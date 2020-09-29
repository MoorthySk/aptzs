import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import ManageRequestService from "../../service/management/ManageRequestService";
import Radio from "../@vuexy/radio/RadioVuexy";
import SweetAlert from "react-bootstrap-sweetalert";
import { CheckSquare, XSquare, ChevronsLeft } from "react-feather";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Button,
  FormGroup,
  Col,
  Row,
  Input,
} from "reactstrap";

import { User, Mail, Phone, Edit, ArrowDown, Home } from "react-feather";
//Importv End::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

const issueOptions = [
  { value: "1", label: "Power Issue" },
  { value: "2", label: "Water Problem" },
  { value: "3", label: "Payment Issue" },
  { value: "4", label: "Cleaning" },
];

//Default Error Messgae::::::::::::::::::::::::::::::::::::::::::::::::::::
const phoneRegExp = /^((\+\d{1,3}(-| )?\(?\d\)?(-| )?\d{1,3})|(\(?\d{2,3}\)?))(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$/;

const formValidation = Yup.object().shape({
  vendorName: Yup.string()
    .max(100, "Must be 20 characters or less")
    .required("Required"),
  vendorEmail: Yup.string().email("Invalid email address").required("Required"),
  vendorType: Yup.string().required("Required"),
  vendorMobileNo: Yup.string()
    .min(10, "Must be 10 digits")
    .matches(phoneRegExp, "Phone number is not valid")
    .required("Required"),
  vendorCategory: Yup.string().required("Required"),
  vendorAddress: Yup.string().required("Required"),
  vendorCity: Yup.string().required("Required"),
  vendorState: Yup.string().required("Required"),
  vendorPostal: Yup.number().required("Required"),
});

//Default Error Messgae end::::::::::::::::::::::::::::::::::::::::::::::::::::

function SelectField(FieldProps) {
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
}

class EmployeeCreate extends React.Component {
  handleCancel = () => {
    this.props.history.push("/vendorSearch");
  };
  state = {
    successAlert: true,
    radio: null,
  };
  successMessgae(state, value) {
    const getAlert = () => (
      <SweetAlert
        success
        confirmBtnText="Ok!"
        title="Success"
        show={this.state.successAlert}
        onConfirm={() => this.hideAlert()}
      >
        <p className="sweet-alert-text">Request Sussessfully Added</p>
      </SweetAlert>
    );
    this.setState({
      alert: getAlert(),
    });
  }
  hideAlert() {
    this.props.history.push("/vendorSearch");
    this.setState({
      alert: null,
    });
  }
  updateRadioButton(value) {
    console.log("Radio Value" + value);
    // this.setState({ radio: value });
  }
  async componentDidMount() {}

  render() {
    const {
      vendorType,
      vendorName,
      vendorEmail,
      vendorSecMail,
      vendorOfficeNo,
      vendorHomeNo,
      vendorMobileNo,
      vendorCategory,
      vendorAddress,
      vendorCity,
      vendorState,
      vendorPostal,
      vendorNotes,
    } = this.state;

    return (
      <Card>
        <CardHeader>
          <CardTitle>Vendor Request</CardTitle>
        </CardHeader>
        <CardBody>
          <Formik
            initialValues={{
              vendorType: "",
              vendorName: "",
              vendorEmail: "",
              vendorSecMail: "",
              vendorOfficeNo: "",
              vendorHomeNo: "",
              vendorMobileNo: "",
              vendorCategory: "",
              vendorAddress: "",
              vendorCity: "",
              vendorState: "",
              vendorPostal: "",
              vendorNotes: "",
            }}
            validationSchema={formValidation}
            //Onsubmit API Call function start////////////////////////////
            onSubmit={(values, actions) => {
              let responseCode = "";
              console.log("Value 10   " + values.vendorType);
              console.log("Value 20 " + values.vendorType.value);
              setTimeout(() => {
                let payload = {
                  vendorType: values.vendorType,
                  vendorName: values.vendorName,
                  vendorEmail: values.vendorEmail,
                  vendorSecMail: values.vendorSecMail,
                  vendorOfficeNo: values.vendorOfficeNo,
                  vendorHomeNo: values.vendorHomeNo,
                  vendorMobileNo: values.vendorMobileNo,
                  vendorCategory: values.vendorCategory,
                  vendorAddress: values.vendorAddress,
                  vendorCity: values.vendorCity,
                  vendorState: values.vendorState,
                  vendorPostal: values.vendorPostal,
                  vendorNotes: values.vendorNotes,
                };
                axios({
                  method: "POST",
                  url: "/maint/vendor/create/",
                  data: payload,
                })
                  .then((response) => {
                    responseCode = response.data.responseCode;
                    console.log("Response Code:::::::::::::" + responseCode);
                    if (responseCode == 1000) {
                      this.successMessgae("successAlert", true);
                    } else {
                      this.errorMessgae("errorAlert", true);
                    }
                  })
                  .catch((error) => {
                    console.log(error);
                    // toast.error("Bad Request, Please verify your inputs!");
                  });
              }, 1000);
            }}
            //Onsubmit API Call function End////////////////////////////
          >
            {(props) => {
              const { errors, touched, setFieldValue } = props;
              return (
                <Form onSubmit={props.handleSubmit}>
                  <Row>
                    <Col md="6" sm="12">
                      <label htmlFor="vendorName">Full Name</label>
                      <FormGroup className="has-icon-left position-relative">
                        <Field
                          className="form-control"
                          name="vendorName"
                          type="text"
                        />

                        <div className="form-control-position">
                          <User size={15} />
                        </div>
                        <ErrorMessage
                          name="vendorName"
                          component="div"
                          className="field-error text-danger"
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6" sm="12">
                      <label htmlFor="vendorType">Vendor Type</label>

                      <FormGroup className="has-icon-left position-relative">
                        <div className="d-inline-block mr-1">
                          <Radio
                            label="Company"
                            color="primary"
                            value="Company"
                            name="vendorType"
                            onChange={() =>
                              setFieldValue("vendorType", "Company")
                            }
                          />
                        </div>
                        <div className="d-inline-block mr-1">
                          <Radio
                            label="Indidual"
                            color="success"
                            name="vendorType"
                            value="Indidual"
                            onChange={() =>
                              setFieldValue("vendorType", "Indidual")
                            }
                          />
                        </div>
                        <ErrorMessage
                          name="vendorType"
                          component="div"
                          className="field-error text-danger"
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6" sm="12">
                      <label htmlFor="vendorEmail">Category Type</label>
                      <FormGroup className="has-icon-left position-relative">
                        <Field
                          name="vendorCategory"
                          as="select"
                          className={
                            "form-control" +
                            (errors.title && touched.title ? " is-invalid" : "")
                          }
                        >
                          <option value="">Select..</option>
                          <option value="Plumber">Plumber</option>
                          <option value="Electrician">Electrician</option>
                          <option value="Cleaning">Cleaning</option>
                        </Field>
                        <div className="form-control-position">
                          <Phone />
                        </div>
                        <ErrorMessage
                          name="vendorCategory"
                          component="div"
                          className="field-error text-danger"
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6" sm="12">
                      <label htmlFor="vendorEmail">Primary Email</label>
                      <FormGroup className="has-icon-left position-relative">
                        <Field
                          className="form-control"
                          name="vendorEmail"
                          type="text"
                        />

                        <div className="form-control-position">
                          <Phone size={15} />
                        </div>
                        <ErrorMessage
                          name="vendorEmail"
                          component="div"
                          className="field-error text-danger"
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6" sm="12">
                      <label htmlFor="vendorSecMail">Secondary Email</label>

                      <FormGroup className="has-icon-left position-relative">
                        <Field
                          className="form-control"
                          name="vendorSecMail"
                          type="email"
                        />

                        <div className="form-control-position">
                          <Mail size={15} />
                        </div>
                      </FormGroup>
                    </Col>
                    <Col md="6" sm="12">
                      <label htmlFor="vendorMobileNo">Mobile Number</label>

                      <FormGroup className="has-icon-left position-relative">
                        <Field
                          className="form-control"
                          name="vendorMobileNo"
                          type="number"
                        />

                        <div className="form-control-position">
                          <Mail size={15} />
                        </div>
                        <ErrorMessage
                          name="vendorMobileNo"
                          component="div"
                          className="field-error text-danger"
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6" sm="12">
                      <label htmlFor="vendorOfficeNo">Office Number</label>

                      <FormGroup className="has-icon-left position-relative">
                        <Field
                          className="form-control"
                          name="vendorOfficeNo"
                          type="number"
                        />

                        <div className="form-control-position">
                          <Mail size={15} />
                        </div>
                      </FormGroup>
                    </Col>
                    <Col md="6" sm="12">
                      <label htmlFor="vendorHomeNo">Home Number</label>

                      <FormGroup className="has-icon-left position-relative">
                        <Field
                          className="form-control"
                          name="vendorHomeNo"
                          type="number"
                        />

                        <div className="form-control-position">
                          <Mail size={15} />
                        </div>
                      </FormGroup>
                    </Col>
                    <Col md="6" sm="12">
                      <label htmlFor="vendorAddress">Address</label>

                      <FormGroup className="has-icon-left position-relative">
                        <Field
                          className="form-control"
                          name="vendorAddress"
                          type="text"
                        />

                        <div className="form-control-position">
                          <Home size={15} />
                        </div>
                        <ErrorMessage
                          name="vendorAddress"
                          component="div"
                          className="field-error text-danger"
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6" sm="12">
                      <label htmlFor="vendorCity">City</label>

                      <FormGroup className="has-icon-left position-relative">
                        <Field
                          className="form-control"
                          name="vendorCity"
                          type="text"
                        />

                        <div className="form-control-position">
                          <Home size={15} />
                        </div>
                        <ErrorMessage
                          name="vendorCity"
                          component="div"
                          className="field-error text-danger"
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6" sm="12">
                      <label htmlFor="vendorState">State</label>

                      <FormGroup className="has-icon-left position-relative">
                        <Field
                          className="form-control"
                          name="vendorState"
                          type="text"
                        />

                        <div className="form-control-position">
                          <Home size={15} />
                        </div>
                        <ErrorMessage
                          name="vendorState"
                          component="div"
                          className="field-error text-danger"
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6" sm="12">
                      <label htmlFor="vendorPostal">Postal Code</label>

                      <FormGroup className="has-icon-left position-relative">
                        <Field
                          className="form-control"
                          name="vendorPostal"
                          type="number"
                        />

                        <div className="form-control-position">
                          <Home size={15} />
                        </div>
                        <ErrorMessage
                          name="vendorPostal"
                          component="div"
                          className="field-error text-danger"
                        />
                      </FormGroup>
                    </Col>

                    <Col md="6" sm="12">
                      <label htmlFor="vendorNotes">Notes</label>
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
                          <Edit size={15} />
                        </div>
                      </FormGroup>
                    </Col>
                  </Row>

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
                        color="warning"
                        type="reset"
                        className="mr-1 mb-1"
                      >
                        <ChevronsLeft size={14} />

                        <span className="align-middle ml-25">Reset</span>
                      </Button.Ripple>
                      <Button.Ripple
                        color="danger"
                        onClick={this.handleCancel}
                        className="mr-1 mb-1"
                      >
                        <XSquare size={14} />

                        <span className="align-middle ml-25">Cancel</span>
                      </Button.Ripple>

                      {this.state.alert}
                    </Col>
                  </FormGroup>
                </Form>
              );
            }}
          </Formik>
        </CardBody>
      </Card>
    );
  }
}
export default EmployeeCreate;
