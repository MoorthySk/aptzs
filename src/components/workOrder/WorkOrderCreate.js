import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import Radio from "../../components/@vuexy/radio/RadioVuexy";
import SweetAlert from "react-bootstrap-sweetalert";
import { CheckSquare, XSquare } from "react-feather";
import axios from "axios";
import Toggle from "react-toggle";
import "react-toggle/style.css";
import "../../assets/scss/plugins/forms/switch/react-toggle.scss";
import Helpers from "./Helpers";
import Select from "react-select";
import {
  Card,
  CardTitle,
  CardBody,
  Button,
  FormGroup,
  Col,
  Row,
  Input,
  ListGroup,
  ListGroupItem,
  Table,
} from "reactstrap";

import { Cancel, AddCircle, AssignmentInd } from "@material-ui/icons";
var vendorList = [];
class WorkOrderCreate extends React.Component {
  state = {
    successAlert: true,
    isChecked: true,
    isEntry: false,
    isActive: null,
    isCheckedWhatsup: false,
    isCheckedEmail: false,
    entryAllowed: false,
    rowData: [],
    values: [],
    year: null,
  };
  async componentDidMount() {
    this.handleShow();
    await axios({
      method: "POST",
      url: "/maint/vendor/search-byall/",
    }).then((response) => {
      try {
        let vendorList;
        let vendorDtl = response.data.vendorSearchDtl;

        this.setState({
          values: response.data.vendorSearchDtl,
        });
        console.log(vendorList);
      } catch (e) {
        console.log(e);
      }
    });

    let marked = this.state.values;
    marked !== undefined &&
      this.state.values.forEach((vData) => {
        let vendorData = {};
        vendorData.value = vData.vendorId;
        vendorData.label = vData.vendorName;

        vendorList.push(vendorData);
      });
  }

  render() {
    const {
      tenantName = "Moorthy",
      tenantNumber = "9840642421",
      tenantEmail = "Sk@gmail.com",
      stafName = "John",
      stafNumber = "9841252356",
      stafEmail = "john@gmail.com",
      isEntry,
      selectedOption,
    } = this.state;

    return (
      <Formik
        enableReinitialize
        initialValues={{
          contactPersonEmail: "",
          issueType: "",
          issueDesc: "",
          contactPersonName: "",
          priority: "",
          contactPersonNumber: "",
          vandorName: "",
          invoiceNumber: "",
          entryAllowed: "",
          staffNotes: "",
          entryContact: "",
          tenantName: "",
          tenantNumber: "",
          tenantEmail: "",
          stafName: "",
          stafNumber: "",
          stafEmail: "",
          workDescription: "",
          issueDescription: "",
          issueAmount: "",
          vendorNotes: "",
          selectedOption: "",
        }}
        validationSchema={formValidation}
        onSubmit={(values, actions) => {
          let wOrderResponseCode = "";
          let taskResponseCode = "";

          var myObject = JSON.stringify(this.state.users);
          var parseObject = JSON.parse(myObject);
          values.vandorName = values.vandorName.label;
          let payload = {
            worder: {
              vandorName: values.vendorName,
              invoiceNumber: values.invoiceNumber,
              entryAllowed: this.state.entryAllowed,
              entryContact: this.state.entryContact,
              staffNotes: values.staffNotes,
              issueAmount: values.issueAmount,
              vendorNotes: values.vendorNotes,
              emailVendor: this.state.isCheckedEmail,
              whatsAppVendor: this.state.isCheckedWhatsup,
            },
            worderDetails: parseObject,
          };
          setTimeout(() => {
            values.issueType = values.issueType.label;
            axios({
              method: "POST",
              url: "/maint/maint/create/",

              data: values,
            }).then((response) => {
              taskResponseCode = response.data.responseCode;
              console.log(
                "taskResponseCode Code:::::::::::::" + taskResponseCode
              );
            });

            axios({
              method: "POST",
              url: "/maint/workorder/create/",
              data: payload,
            })
              .then((response) => {
                wOrderResponseCode = response.data.responseCode;
                console.log(
                  "wOrderResponseCode Code:::::::::::::" + wOrderResponseCode
                );
                if ((taskResponseCode = 1000) && (wOrderResponseCode = 1000)) {
                  this.successMessage("successAlert", true);
                } else {
                  this.errorMessgae("errorAlert", true);
                }
              })
              .catch((error) => {
                console.log(error);
                this.errorMessgae("errorAlert", true);
              });
          }, 1000);
        }}
      >
        {(props) => {
          const {
            setFieldValue,
            handleChange,
            errors,
            touched,
            year,
            values,
            handleBlur,
          } = props;

          return (
            <Form onSubmit={props.handleSubmit}>
              <Card>
                <CardBody>
                  <CardTitle>Task Details</CardTitle>
                  <Row>
                    <Col md="6" sm="12">
                      <FormGroup>
                        <label htmlFor="issueType"> Issue Type</label>
                        <Field
                          name="issueType"
                          options={issueOptions}
                          component={SelectField}
                          isSearchable={true}
                        />

                        <ErrorMessage
                          name="issueType"
                          component="div"
                          className="field-error text-danger"
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6" sm="12">
                      <label htmlFor="entryContact">Priority</label>

                      <FormGroup className="has-icon-left position-relative">
                        <div className="d-inline-block mr-1">
                          <Radio
                            label="Low"
                            color="primary"
                            name="priority"
                            value="1"
                            onChange={() => setFieldValue("priority", "1")}
                          />
                        </div>
                        <div className="d-inline-block mr-1">
                          <Radio
                            label="Medium"
                            color="warning"
                            name="priority"
                            value="2"
                            onChange={() => setFieldValue("priority", "2")}
                          />
                        </div>
                        <div className="d-inline-block mr-1">
                          <Radio
                            label="High"
                            color="danger"
                            name="priority"
                            value="3"
                            onChange={() => setFieldValue("priority", "3")}
                          />
                        </div>
                        <ErrorMessage
                          name="priority"
                          component="div"
                          className="field-error text-danger"
                        />
                      </FormGroup>
                    </Col>
                    <Col md="12" sm="12">
                      <label htmlFor="issueDesc">Issue Description</label>
                      <FormGroup>
                        <Field
                          name="issueDesc"
                          className="form-control"
                          placeholder="Doe"
                        >
                          {({ field, form: { touched, errors }, meta }) => (
                            <div>
                              <Input
                                type="textarea"
                                placeholder="Issue Description"
                                {...field}
                              />
                            </div>
                          )}
                        </Field>

                        <ErrorMessage
                          name="issueDesc"
                          component="div"
                          className="field-error text-danger"
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6" sm="12">
                      <FormGroup>
                        <label htmlFor="contactPersonName">Person Name</label>
                        <Field
                          className="form-control"
                          name="contactPersonName"
                          placeholder="Doe"
                          type="text"
                        />
                        <ErrorMessage
                          name="contactPersonName"
                          component="div"
                          className="field-error text-danger"
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6" sm="12">
                      <FormGroup>
                        <label htmlFor="contactPersonEmail">Email</label>
                        <Field
                          className="form-control"
                          name="contactPersonEmail"
                          placeholder="jane@acme.com"
                          type="email"
                        />

                        <ErrorMessage name="contactPersonEmail">
                          {(msg) => (
                            <div className="field-error text-danger">{msg}</div>
                          )}
                        </ErrorMessage>
                      </FormGroup>
                    </Col>{" "}
                    <Col md="6" sm="12">
                      <FormGroup>
                        <label htmlFor="contactPersonNumber">
                          Person Number
                        </label>
                        <Field
                          className="form-control"
                          name="contactPersonNumber"
                          type="text"
                          placeholder="Phone Number"
                        />
                        <ErrorMessage
                          name="contactPersonNumber"
                          component="div"
                          className="field-error text-danger"
                        />
                      </FormGroup>{" "}
                    </Col>
                  </Row>
                </CardBody>
              </Card>
              <Card>
                <CardBody>
                  {" "}
                  <CardTitle>Vendor Details</CardTitle>
                  <Row>
                    <Col md="6" sm="12">
                      <FormGroup>
                        <label htmlFor="vandorName"> Vendor Name</label>
                        <Field
                          name="vandorName"
                          options={vendorList}
                          component={SelectVendorField}
                          isSearchable={true}
                        />

                        <ErrorMessage
                          name="vandorName"
                          component="div"
                          className="field-error text-danger"
                        />
                      </FormGroup>
                    </Col>

                    <Col md="6" sm="12">
                      <label>Invoice Number</label>
                      <FormGroup className="has-icon-left position-relative">
                        <Field
                          className="form-control"
                          name="invoiceNumber"
                          type="text"
                        />
                        <div className="form-control-position">
                          <AssignmentInd size={15} />
                        </div>
                        <ErrorMessage
                          name="invoiceNumber"
                          component="div"
                          className="field-error text-danger"
                        />
                      </FormGroup>
                    </Col>
                    <Col md="12" sm="12">
                      <label htmlFor="staffNotes">Staff Notes</label>
                      <FormGroup className="has-icon-left position-relative">
                        <Field
                          name="staffNotes"
                          className="form-control"
                          placeholder="Doe"
                        >
                          {({ field, form: { touched, errors }, meta }) => (
                            <div>
                              <Input
                                type="textarea"
                                placeholder="Remarks"
                                {...field}
                              />
                            </div>
                          )}
                        </Field>
                        <div className="form-control-position">
                          <AssignmentInd size={15} />
                        </div>
                        <ErrorMessage
                          name="staffNotes"
                          component="div"
                          className="field-error text-danger"
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6" sm="12">
                      <label htmlFor="entryContact">Entry Contact</label>

                      <FormGroup className="has-icon-left position-relative">
                        <div className="d-inline-block mr-1">
                          <Radio
                            label="Staff"
                            color="info"
                            name="entryContact"
                            defaultChecked={true}
                            onClick={this.handleShow}
                          />
                        </div>
                        <div className="d-inline-block mr-1">
                          <Radio
                            label="Tenant"
                            color="primary"
                            name="entryContact"
                            onClick={this.handleHide}
                          />
                        </div>
                      </FormGroup>
                    </Col>
                    <Col md="6" sm="12">
                      <label htmlFor="entryAllowed">Entry Allowed</label>

                      <FormGroup className="has-icon-left position-relative">
                        <div className="d-inline-block mr-1">
                          <Radio
                            label="Yes"
                            color="success"
                            defaultChecked={true}
                            name="entryAllowed"
                            onClick={this.handleEntryYes}
                          />
                        </div>
                        <div className="d-inline-block mr-1">
                          <Radio
                            label="No"
                            color="danger"
                            name="entryAllowed"
                            onClick={this.handleEntryNo}
                          />
                        </div>
                      </FormGroup>
                    </Col>
                    <Col md="6" sm="12">
                      {isEntry ? (
                        <div className="users-page-view-table">
                          <Table responsive bordered>
                            <thead>
                              <tr>
                                <th
                                  style={{
                                    width: 300,
                                    height: 50,
                                  }}
                                >
                                  Staff Name
                                </th>
                                <th
                                  style={{
                                    width: 300,
                                    height: 50,
                                  }}
                                >
                                  Staff Email
                                </th>
                                <th
                                  style={{
                                    width: 300,
                                    height: 50,
                                  }}
                                >
                                  Staff Number
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>{stafName}</td>
                                <td>{stafEmail}</td>
                                <td>{stafNumber}</td>
                              </tr>
                            </tbody>
                          </Table>
                        </div>
                      ) : (
                        <div className="users-page-view-table">
                          <Table responsive bordered>
                            <thead>
                              <tr>
                                <th
                                  style={{
                                    width: 300,
                                    height: 50,
                                  }}
                                >
                                  Tenant Name
                                </th>
                                <th
                                  style={{
                                    width: 300,
                                    height: 50,
                                  }}
                                >
                                  Tenant Email
                                </th>
                                <th
                                  style={{
                                    width: 300,
                                    height: 50,
                                  }}
                                >
                                  Mobile Number
                                </th>
                              </tr>
                            </thead>

                            <tbody>
                              <tr>
                                <td>{tenantName}</td>
                                <td>{tenantEmail}</td>
                                <td>{tenantNumber}</td>
                              </tr>
                            </tbody>
                          </Table>
                        </div>
                      )}
                    </Col>
                  </Row>
                </CardBody>
              </Card>
              <Card>
                <CardBody>
                  <Row>
                    <Col md="12" sm="12">
                      <ListGroup tag="div">
                        <ListGroupItem active>Work Order Details</ListGroupItem>
                        <ListGroupItem>
                          {" "}
                          <Col>
                            <div>
                              <Row>
                                <Col md="3" sm="12">
                                  <label>Type</label>
                                </Col>
                                <Col md="3" sm="12">
                                  <label>Description</label>
                                </Col>
                                <Col md="3" sm="12">
                                  <label>Price</label>
                                </Col>

                                <Col md="1" sm="12">
                                  <label>Delete</label>
                                </Col>
                              </Row>
                            </div>
                            {this.createUI()}
                            <br />
                            <Button.Ripple
                              className="btn-icon rounded-circle"
                              color="primary"
                              onClick={this.addClick.bind(this)}
                            >
                              <AddCircle />
                            </Button.Ripple>
                          </Col>
                        </ListGroupItem>
                        <ListGroupItem color="light">
                          <Col md="4" sm="12">
                            <h6>Total</h6>
                          </Col>
                        </ListGroupItem>
                      </ListGroup>
                    </Col>

                    <Col md="12" sm="12">
                      <br />

                      <label htmlFor="vendorNotes">Vendor Notes</label>
                      <FormGroup className="has-icon-left position-relative">
                        <Field
                          name="vendorNotes"
                          className="form-control"
                          placeholder="Doe"
                        >
                          {({ field, form: { touched, errors }, meta }) => (
                            <div>
                              <Input
                                type="textarea"
                                placeholder="Remarks"
                                {...field}
                              />
                            </div>
                          )}
                        </Field>
                        <div className="form-control-position">
                          <AssignmentInd size={15} />
                        </div>
                      </FormGroup>
                    </Col>
                    <Col md="2" sm="12">
                      <CardBody>
                        <label className="react-toggle-wrapper">
                          <Toggle
                            checked={this.state.isCheckedEmail}
                            onChange={this.handleSwitchEmail}
                            name="isCheckedEmail"
                          />
                          Email Sent
                        </label>
                      </CardBody>
                    </Col>
                    <Col md="2" sm="12">
                      <CardBody>
                        <label className="react-toggle-wrapper">
                          <Toggle
                            checked={this.state.isCheckedWhatsup}
                            onChange={this.handleSwitchWhatup}
                            name="isCheckedWhatsup"
                          />
                          Whatsup Sent
                        </label>
                      </CardBody>
                    </Col>
                  </Row>
                  <br />
                  <FormGroup row>
                    <Col md={{ size: 8, offset: 4 }}>
                      <Button.Ripple
                        color="primary"
                        type="submit"
                        className="mr-1 mb-1"
                      >
                        <CheckSquare size={14} />

                        <span className="align-middle ml-25">Submit</span>
                      </Button.Ripple>

                      <Button.Ripple
                        color="danger"
                        onClick={Helpers.handleCancel}
                        className="mr-1 mb-1"
                      >
                        <XSquare size={14} />

                        <span className="align-middle ml-25">Cancel</span>
                      </Button.Ripple>

                      {this.state.alert}
                    </Col>
                  </FormGroup>
                </CardBody>
              </Card>
            </Form>
          );
        }}
      </Formik>
    );
  }
  createUI() {
    const { setFieldValue, errors, touched } = this.state;
    return this.state.users.map((el, i) => (
      <div key={i}>
        <Row>
          <Col md="3" sm="12">
            <Input
              type="select"
              name="issueType"
              value={el.issueType || ""}
              onChange={this.handleRowChange.bind(this, i)}
            >
              <option>Select..</option>
              <option>Rent</option>
              <option>Water Bill</option>
              <option>Electric Bill</option>
              <option>Others</option>
            </Input>
          </Col>
          <Col md="3" sm="12">
            <Input
              name="issueDescription"
              value={el.issueDescription || ""}
              onChange={this.handleRowChange.bind(this, i)}
              type="text"
            />
          </Col>

          <Col md="3" sm="12">
            <Input
              name="issueAmount"
              value={el.issueAmount || ""}
              onChange={this.handleRowChange.bind(this, i)}
              type="number"
            />
          </Col>

          <Col md="2" sm="12">
            <div className="actions cursor-pointer">
              <Button.Ripple
                className="btn-icon rounded-circle"
                color="danger"
                onClick={this.removeClick.bind(this, i)}
              >
                <Cancel fontSize="large" />
              </Button.Ripple>
            </div>
          </Col>
        </Row>
      </div>
    ));
  }
  handleRowChange(i, e) {
    const { name, value } = e.target;
    let users = [...this.state.users];
    users[i] = { ...users[i], [name]: value };
    this.setState({ users });
  }

  removeClick(i) {
    let users = [...this.state.users];
    users.splice(i, 1);
    this.setState({ users });
  }
  handleSubmit1(event) {
    alert("Values: " + this.state.values.join(", "));
    event.preventDefault();
  }
  constructor(props) {
    super(props);
    this.state = {
      users: [
        {
          issueType: "",
          issueDescription: "",
          issueAmount: "",
        },
      ],
    };
    this.handleSubmit1 = this.handleSubmit1.bind(this);
  }

  addClick() {
    this.setState((prevState) => ({
      users: [
        ...prevState.users,
        {
          issueType: "",
          issueDescription: "",
          issueAmount: "",
        },
      ],
    }));
  }

  successMessage(state, value) {
    const getAlert = () => (
      <SweetAlert
        success
        confirmBtnText="Ok!"
        title="Success"
        tim
        show={this.state.successAlert}
        onConfirm={() => Helpers.hideAlert()}
      >
        <p className="sweet-alert-text">Request Sussessfully Updated</p>
      </SweetAlert>
    );
    this.setState({
      alert: getAlert(),
    });
  }
  errorMessgae(state, value) {
    const getAlert = () => (
      <SweetAlert
        error
        confirmBtnText="Ok!"
        title="Error"
        show={this.state.errorAlert}
        onConfirm={() => this.hideAlert()}
      >
        <p className="sweet-alert-text">Request Updated Failed</p>
      </SweetAlert>
    );
    this.setState({
      alert: getAlert(),
    });
  }

  hideAlert() {
    this.setState({
      alert: null,
    });
  }

  showWorkorder = () => {
    this.setState({
      isActive: true,
    });
  };
  handleHide = () => {
    this.setState({
      isEntry: false,
      entryContact: "Tenant",
    });
  };
  handleShow = () => {
    this.setState({
      isEntry: true,
      entryContact: "Staff",
    });
  };
  handleEntryYes = () => {
    this.setState({
      entryAllowed: true,
    });
  };
  handleEntryNo = () => {
    this.setState({
      entryAllowed: false,
    });
  };
  handleSwitchWhatup = () => {
    this.setState({
      isCheckedWhatsup: !this.state.isCheckedWhatsup,
    });
  };
  handleSwitchEmail = () => {
    this.setState({
      isCheckedEmail: !this.state.isCheckedEmail,
    });
  };
}
const issueOptions = [
  { value: "Power Issue", label: "Power Issue" },
  { value: "Water Problem", label: "Water Problem" },
  { value: "Payment Issue", label: "Payment Issue" },
  { value: "Cleaning", label: "Cleaning" },
];
const SelectField = (FieldProps) => {
  return (
    <Select
      isClearable={true}
      defaultValue={issueOptions[0]}
      options={FieldProps.options}
      {...FieldProps.field}
      onChange={(issueOptions) =>
        FieldProps.form.setFieldValue(FieldProps.field.name, issueOptions)
      }
    />
  );
};
const SelectVendorField = (FieldProps) => {
  return (
    <Select
      isClearable={true}
      options={FieldProps.options}
      {...FieldProps.field}
      onChange={(vendorList) =>
        FieldProps.form.setFieldValue(FieldProps.field.name, vendorList)
      }
    />
  );
};
const phoneRegExp = /^((\+\d{1,3}(-| )?\(?\d\)?(-| )?\d{1,3})|(\(?\d{2,3}\)?))(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$/;
const formValidation = Yup.object().shape({
  invoiceNumber: Yup.string().required("Required"),
  staffNotes: Yup.string().required("Required"),
  priority: Yup.number().required("Required"),
  contactPersonName: Yup.string()
    .max(20, "Must be 20 characters or less")
    .required("Required"),
  contactPersonEmail: Yup.string()
    .email("Invalid email address")
    .required("Required"),
  contactPersonNumber: Yup.string()
    .matches(phoneRegExp, "Phone number is not valid")
    .required("Required"),
  issueDesc: Yup.string().required("Required"),
  issueType: Yup.string().required("Required"),
  vandorName: Yup.string().required("Required"),
});

export default WorkOrderCreate;
