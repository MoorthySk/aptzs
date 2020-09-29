import React from "react";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Radio from "../../../components/@vuexy/radio/RadioVuexy";
import SweetAlert from "react-bootstrap-sweetalert";
import { CheckSquare, XSquare } from "react-feather";
import axios from "axios";
import Toggle from "react-toggle";
import "react-toggle/style.css";
import "../../../assets/scss/plugins/forms/switch/react-toggle.scss";
import Helpers from "../Helpers";
import Select from "react-select";
import LovList from "../../../components/common/Helpers";
import * as appConst from "../../../utility/Constants";
import Breacrumbs from "../../@vuexy/breadCrumbs/BreadCrumb";
import {
  Form,
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

class WorkOrderCreate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [
        {
          issueType: "",
          issueDesc: "",
          amount: "",
          wOrderDetailId: "",
          worderId: "",
          maintId: "",
        },
      ],
      successAlert: true,
      isChecked: true,
      isEntry: false,
      isActive: null,
      isCheckedWhatsup: false,
      isCheckedEmail: false,
      entryAllowed: false,
      rowData: [],
      values: [],
      vendorListData: [],
      workTypeList: [],
      totalAmount: 0,
    };
  }

  async componentDidMount() {
    var requestId = this.props.taskId;
    this.state.vendorListData = await LovList.vendorList();
    this.state.workTypeList = await LovList.lovList(appConst.workTypeList);
    let mess = "";
    let orderDtl = "";
    let resCode = "";
    console.log("taskId:" + requestId);
    axios
      .post("/maint/workorder/search/", {
        maintId: requestId,
      })
      .then((response3) => {
        mess = response3.data.wOrder;
        resCode = response3.data.responseCode;
        //console.log("response:"+mess.entryAllowed);

        if (resCode === "1000") {
          let whatsFlag = false;
          let emailFlag = false;
          let entryAll = false;
          let entryAllYes = false;
          let entryAllNo = false;
          let entryContactYes = false;
          let entryContactNo = false;
          let entryCont = false;
          if (mess.whatsAppVendor === "false") {
            whatsFlag = false;
          } else {
            whatsFlag = true;
          }

          if (mess.emailVendor === "false") {
            emailFlag = false;
          } else {
            emailFlag = true;
          }

          if (mess.entryAllowed === "false") {
            entryAll = false;
            entryAllNo = true;
          } else {
            entryAll = true;
            entryAllYes = true;
          }

          if (mess.entryContact === "Tenant") {
            entryCont = false;
            entryContactNo = true;
            this.handleHide();
          } else {
            entryCont = true;
            entryContactYes = true;
            this.handleShow();
          }

          this.setState({
            vendorName: mess.vendorName,
            invoiceNumber: mess.invoiceNumber,
            invoiceNumber: mess.invoiceNumber,
            vendorNotes: mess.vendorNotes,
            totalAmount: mess.totalAmount,
            staffNotes: mess.staffNotes,
            isCheckedWhatsup: whatsFlag,
            isCheckedEmail: emailFlag,
            entryAllowed: entryAll,
            entryAllowedYes: entryAllYes,
            entryAllowedNo: entryAllNo,
            isEntry: entryCont,
            entryContact: mess.entryContact,
            entryContactYes: entryContactYes,
            entryContactNo: entryContactNo,
            worderId: mess.worderId,
          });

          orderDtl = response3.data.worderDetails;
          this.removeAll();
          for (var i = 0; i < orderDtl.length; i++) {
            //console.log(unitDtl[i]);
            this.setState((prevState) => ({
              users: [
                ...prevState.users,
                {
                  issueType: orderDtl[i].issueType,
                  issueDesc: orderDtl[i].issueDesc,
                  amount: orderDtl[i].amount,
                  wOrderDetailId: orderDtl[i].wOrderDetailId,
                  worderId: orderDtl[i].worderId,
                  maintId: orderDtl[i].maintId,
                },
              ],
            }));
          }
        }
      });
  }

  render() {
    const {
      tenantName = "",
      tenantNumber = "",
      tenantEmail = "",
      stafName = "",
      stafNumber = "",
      stafEmail = "",
      totAmount = "",
      vendorName = "",
      invoiceNumber = "",
      vendorNotes = "",
      staffNotes = "",
      worderId = "",
      isEntry,
      selectedOption,
      totalAmount,
      vendorListData,
    } = this.state;

    return (
      <Formik
        enableReinitialize
        initialValues={{
          vendorName: vendorName,
          invoiceNumber: invoiceNumber,
          entryAllowed: "",
          staffNotes: staffNotes,
          entryContact: "",
          totalAmount: totalAmount,
          vendorNotes: vendorNotes,
          selectedOption: "",
          worderId: worderId,
        }}
        validationSchema={formValidation}
        onSubmit={(values, actions) => {
          let wOrderResponseCode = "";
          let taskResponseCode = "";
          var requestId = this.props.taskId;
          var myObject = JSON.stringify(this.state.users);
          var parseObject = JSON.parse(myObject);
          console.log("worderId:" + values.worderId);
          let payload = {
            worder: {
              maintId: requestId,
              worderId: values.worderId,
              vendorName: values.vendorName.value,
              invoiceNumber: values.invoiceNumber,
              entryAllowed: this.state.entryAllowed,
              entryContact: this.state.entryContact,
              staffNotes: values.staffNotes,
              totalAmount: this.state.totAmount,
              vendorNotes: values.vendorNotes,
              emailVendor: this.state.isCheckedEmail,
              whatsAppVendor: this.state.isCheckedWhatsup,
            },
            worderDetails: parseObject,
            maintId: requestId,
          };
          setTimeout(() => {
            axios({
              method: "POST",
              url: "/maint/workorder/update/",
              data: payload,
            })
              .then((response) => {
                wOrderResponseCode = response.data.responseCode;
                console.log(
                  "wOrderResponseCode Code:::::::::::::" + wOrderResponseCode
                );

                if ((wOrderResponseCode = 1000)) {
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
          const { setFieldValue, errors, touched } = props;

          return (
            <Form onSubmit={props.handleSubmit}>
              <Breacrumbs
                breadCrumbTitle="Work Order"
                breadCrumbParent="Task"
                breadCrumbActive="Work Order Update"
              />
              <Card>
                <CardBody>
                  {" "}
                  <CardTitle>Vendor Details</CardTitle>
                  <Row>
                    <Col md="6" sm="12">
                      <label htmlFor="vendorName">Vendor Name</label>

                      <FormGroup className=" position-relative">
                        <Select
                          type="select"
                          name="vendorName"
                          options={vendorListData}
                          //  value={vendorListData.find(
                          //   (obj) => obj.value == vendorName
                          // )}
                          onChange={(vendorListData) =>
                            setFieldValue("vendorName", vendorListData)
                          }
                          // onChange={this.vendorNameChange}
                        />

                        <ErrorMessage
                          name="vendorName"
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
                    <Col md="6" sm="12">
                      <label htmlFor="entryContact">Entry Contact</label>

                      <FormGroup className="has-icon-left position-relative">
                        <div className="d-inline-block mr-1">
                          <Radio
                            label="Staff"
                            color="primary"
                            name="entryContact"
                            defaultChecked={this.state.entryContactYes}
                            onClick={this.handleShow}
                          />
                        </div>
                        <div className="d-inline-block mr-1">
                          <Radio
                            label="Tenant"
                            color="warning"
                            name="entryContact"
                            defaultChecked={this.state.entryContactNo}
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
                            defaultChecked={this.state.entryAllowedYes}
                            name="entryAllowed"
                            value="true"
                            onClick={this.handleEntryYes}
                          />
                        </div>
                        <div className="d-inline-block mr-1">
                          <Radio
                            label="No"
                            color="danger"
                            name="entryAllowed"
                            defaultChecked={this.state.entryAllowedNo}
                            value="false"
                            onClick={this.handleEntryYes}
                          />
                        </div>
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
                            <label htmlFor="totalAmount">
                              Total : {totalAmount}
                            </label>
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
                    <Col md="4" sm="12">
                      <CardBody>
                        <label className="react-toggle-wrapper">
                          <Toggle
                            checked={this.state.isCheckedEmail}
                            onChange={this.handleSwitchEmail}
                            name="isCheckedEmail"
                          />
                          Email Notification
                        </label>
                      </CardBody>
                    </Col>
                    <Col md="4" sm="12">
                      <CardBody>
                        <label className="react-toggle-wrapper">
                          <Toggle
                            checked={this.state.isCheckedWhatsup}
                            onChange={this.handleSwitchWhatup}
                            name="isCheckedWhatsup"
                          />
                          Whatsup Notification
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
            <Select
              type="select"
              name="issueType"
              // value={this.state.workTypeList.find(
              //   (obj) => obj.value === el.issueType || ""
              // )}
              options={this.state.workTypeList}
              onChange={this.handleSelectChange.bind(this, i)}
            />
          </Col>
          <Col md="3" sm="12">
            <Input
              name="issueDesc"
              value={el.issueDesc || ""}
              onChange={this.handleRowChange.bind(this, i)}
              type="text"
            />
          </Col>

          <Col md="3" sm="12">
            <Input
              name="amount"
              value={el.amount || ""}
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
  handleSelectChange(i, e) {
    let users = [...this.state.users];
    users[i] = { ...users[i], ["issueType"]: e.value };
    this.setState({ users });
  }
  handleRowChange(i, e) {
    let valueAdded = 0;
    let count = 0;
    const { name, value } = e.target;
    let users = [...this.state.users];
    users[i] = { ...users[i], [name]: value };
    this.setState({ users });
    if ("amount" == name) {
      for (let i = 0; i < users.length; i++) {
        count = parseInt(users[i].amount);
        valueAdded += count;
      }
      this.state.totalAmount = valueAdded;
    }
  }

  removeClick(i) {
    let users = [...this.state.users];
    users.splice(i, 1);
    this.setState({ users });
  }

  removeAll() {
    let users = [...this.state.users];
    users.splice(0, users.length);
    this.setState({ users });
    //this.state.noOfUnits=users.length;
  }

  handleSubmit1(event) {
    alert("Values: " + this.state.values.join(", "));
    event.preventDefault();
  }

  addClick() {
    this.setState((prevState) => ({
      users: [
        ...prevState.users,
        {
          issueType: "",
          issueDescription: "",
          issueAmount: "",
          wOrderDetailId: "",
          worderId: "",
          maintId: "",
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
      entryContact: 2,
    });
  };
  handleShow = () => {
    this.setState({
      isEntry: true,
      entryContact: 1,
    });
  };
  handleEntryYes = (e) => {
    console.log(e.currentTarget.value);
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
const phoneRegExp = /^((\+\d{1,3}(-| )?\(?\d\)?(-| )?\d{1,3})|(\(?\d{2,3}\)?))(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$/;
const formValidation = Yup.object().shape({
  vendorName: Yup.string().required("Required"),
  invoiceNumber: Yup.string().required("Required"),
  staffNotes: Yup.string().required("Required"),
});

export default WorkOrderCreate;
