import React from "react";
import * as configData from "../../../utility/config";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import Radio from "../../../components/@vuexy/radio/RadioVuexy";
import SweetAlert from "react-bootstrap-sweetalert";
import { CheckSquare, XSquare } from "react-feather";
import axios from "axios";
import Toggle from "react-toggle";
import "react-toggle/style.css";
import "../../../assets/scss/plugins/forms/switch/react-toggle.scss";
import "../../../assets/scss/plugins/forms/react-select/_react-select.scss";
import Helpers from "./Helpers";
import RbacList from "../../../configs/RbacList";
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
var roleList = [];
var finalData = [];
class UserCreate extends React.Component {
  state = {
    successAlert: true,
    isChecked: true,
    isEntry: false,
    isActive: null,
    isCheckedWhatsup: false,
    isCheckedEmail: false,
    entryAllowed: false,
    rowData: [],
    value: [],
    year: null,
    userCreate: null,
    userUpdate: null,
    userDelete: null,
  };
  async componentDidMount() {
    let actionName = "userMaster";
    let actionButton = "userCreate";
    var actionCreate = RbacList.rbacCheck(actionName, actionButton);
    this.state.userCreate = actionCreate;
    this.handleShow();
    await axios({
      method: "POST",
      url: configData.hostUrl + "/admin/role/all-roles/",
    }).then((response) => {
      try {
        this.setState({
          value: response.data.roles,
        });
      } catch (e) {
        console.log(e);
      }
    });

    let marked = this.state.value;
    roleList.splice(0, roleList.length);
    marked !== undefined &&
      this.state.value.forEach((rData) => {
        let roleData = {};
        roleData.value = rData.roleId;
        roleData.label = rData.roleName;
        roleList.push(roleData);
        this.setState({ roleList: roleList });
      });
  }

  render() {
    const {
      loginId = "",
      firstName = "",
      lastName = "",
      emailId = "",
      genderType = "",
      departmentId = "",
      mobileNo = "",
      userRemarks = "",
      roleName = "",
    } = this.state;

    return (
      <Formik
        enableReinitialize
        initialValues={{
          loginId: "",
          firstName: "",
          lastName: "",
          emailId: "",
          genderType: "",
          departmentId: "",
          mobileNo: "",
          userRemarks: "",
          roleName: "",
        }}
        validationSchema={formValidation}
        onSubmit={(values, actions) => {
          let userResponseCode = "";
          let userId = "";
          let roleName = values.roleName.value;
          console.log("roleName:: " + roleName);
          var payload = {
            user: {
              loginId: values.loginId,
              firstName: values.firstName,
              lastName: values.lastName,
              emailId: values.emailId,
              genderId: values.genderType,
              department_id: "1001",
              mobileNo: values.mobileNo,
              user_remarks: values.userRemarks,
              password: "password",
            },
            roleMap: {
              roleId: roleName,
            },
          };

          setTimeout(() => {
            axios({
              method: "POST",
              url: "/admin/user/create/",
              data: payload,
            })
              .then((response) => {
                userResponseCode = response.data.responseCode;
                userId = response.data.userId;
                if ((userResponseCode = 1000)) {
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
                  <CardTitle>User Request</CardTitle>
                  <Row>
                    <Col md="6" sm="12">
                      <FormGroup>
                        <label htmlFor="loginId">Login Id</label>
                        <Field
                          className="form-control"
                          name="loginId"
                          placeholder="Doe"
                          type="text"
                        />
                        <ErrorMessage
                          name="loginId"
                          component="div"
                          className="field-error text-danger"
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6" sm="12">
                      <FormGroup>
                        <label htmlFor="firstName">First Name</label>
                        <Field
                          className="form-control"
                          name="firstName"
                          placeholder="Doe"
                          type="text"
                        />
                        <ErrorMessage
                          name="firstName"
                          component="div"
                          className="field-error text-danger"
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6" sm="12">
                      <FormGroup>
                        <label htmlFor="lastName">Last Name</label>
                        <Field
                          className="form-control"
                          name="lastName"
                          placeholder="Doe"
                          type="text"
                        />
                        <ErrorMessage
                          name="lastName"
                          component="div"
                          className="field-error text-danger"
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6" sm="12">
                      <label htmlFor="genderType">Gender</label>

                      <FormGroup className="has-icon-left position-relative">
                        <div className="d-inline-block mr-1">
                          <Radio
                            label="Male"
                            color="primary"
                            name="genderType"
                            value="1"
                            onChange={() => setFieldValue("genderType", "1")}
                          />
                        </div>
                        <div className="d-inline-block mr-1">
                          <Radio
                            label="Female"
                            color="warning"
                            name="genderType"
                            value="2"
                            onChange={() => setFieldValue("genderType", "2")}
                          />
                        </div>
                        <div className="d-inline-block mr-1">
                          <Radio
                            label="Transgender"
                            color="danger"
                            name="genderType"
                            value="3"
                            onChange={() => setFieldValue("genderType", "3")}
                          />
                        </div>
                        <ErrorMessage
                          name="genderType"
                          component="div"
                          className="field-error text-danger"
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6" sm="12">
                      <FormGroup>
                        <label htmlFor="emailId">Email Id</label>
                        <Field
                          className="form-control"
                          name="emailId"
                          placeholder="Doe"
                          type="text"
                        />
                        <ErrorMessage
                          name="emailId"
                          component="div"
                          className="field-error text-danger"
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6" sm="12">
                      <FormGroup>
                        <label htmlFor="mobileNo">Mobile No</label>
                        <Field
                          className="form-control"
                          name="mobileNo"
                          placeholder="Doe"
                          type="text"
                        />
                        <ErrorMessage
                          name="mobileNo"
                          component="div"
                          className="field-error text-danger"
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6" sm="12">
                      <label htmlFor="roleName">Role Name</label>
                      <FormGroup>
                        <Select
                          isClearable={true}
                          name="roleName"
                          classNamePrefix="select"
                          //defaultValue={roleList[0]}
                          options={roleList}
                          onChange={(roleList) =>
                            setFieldValue("roleName", roleList)
                          }
                        />

                        <ErrorMessage
                          name="roleName"
                          component="div"
                          className="field-error text-danger"
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6" sm="12">
                      <label htmlFor="userRemarks">Remarks</label>
                      <FormGroup>
                        <Field
                          name="userRemarks"
                          className="form-control"
                          placeholder="Doe"
                        >
                          {({ field, form: { touched, errors }, meta }) => (
                            <div>
                              <Input
                                type="textarea"
                                placeholder="User Remarks"
                                {...field}
                              />
                            </div>
                          )}
                        </Field>
                      </FormGroup>
                    </Col>
                  </Row>
                  <br />
                  <FormGroup row>
                    <Col md={{ size: 8, offset: 4 }}>
                      {this.state.userCreate ? (
                        <Button.Ripple
                          color="primary"
                          type="submit"
                          className="mr-1 mb-1"
                        >
                          <CheckSquare size={14} />

                          <span className="align-middle ml-25">Submit</span>
                        </Button.Ripple>
                      ) : null}

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

const phoneRegExp = /^((\+\d{1,3}(-| )?\(?\d\)?(-| )?\d{1,3})|(\(?\d{2,3}\)?))(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$/;
const formValidation = Yup.object().shape({
  firstName: Yup.string().required("Required"),
  lastName: Yup.string().required("Required"),

  emailId: Yup.string().email("Invalid email address").required("Required"),
  mobileNo: Yup.string()
    .matches(phoneRegExp, "Phone number is not valid")
    .required("Required"),
  userRemarks: Yup.string().required("Required"),
  genderType: Yup.string().required("Required"),
  loginId: Yup.string().required("Required"),
});

export default UserCreate;
