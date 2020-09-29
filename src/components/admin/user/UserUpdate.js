import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import Radio from "../../@vuexy/radio/RadioVuexy";
import SweetAlert from "react-bootstrap-sweetalert";
import { CheckSquare, XSquare } from "react-feather";
import axios from "axios";
import "react-toggle/style.css";
import "../../../assets/scss/plugins/forms/switch/react-toggle.scss";
import "../../../assets/scss/plugins/forms/react-select/_react-select.scss";
import Helpers from "./Helpers";
import Select from "react-select";
import * as configData from "../../../utility/config";
import qs from "qs";
import {
  Card,
  CardTitle,
  CardBody,
  Button,
  FormGroup,
  Col,
  Row,
  Input,
} from "reactstrap";

class UserUpdate extends React.Component {
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
  };
  async componentDidMount() {
    var config = {
      method: "post",
      url: "/admin/user/all-users/",

      data: data,
    };
    await axios(config, { withCredentials: true }).then((response) => {
      try {
        this.setState({ rowData: response.data.users });
      } catch (e) {
        console.log(e);
      }
    });
    var userId = this.props.match.params.userId;
    var roleName = localStorage.getItem("roleName");
    console.log("roleId:::" + roleName);
    let userObj = "";

    var data = {
      userId: userId,
    };
    var configData = {
      method: "post",
      url: "/admin/user/user-byid/",

      data: data,
    };
    await axios(configData).then((response) => {
      userObj = response.data.user;
      try {
        this.setState({
          loginId: userObj.loginId,
          firstName: userObj.firstName,
          lastName: userObj.lastName,
          emailId: userObj.emailId,
          genderType: userObj.genderId,
          departmentId: userObj.departmentId,
          mobileNo: userObj.mobileNo,
          userRemarks: userObj.userRemarks,
          roleName: userObj.roleId,
        });
      } catch (e) {
        console.log(e);
      }
    });
    var data = qs.stringify({
      userId: userId,
      token: localStorage.getItem("accessToken"),
    });
    var configLov = {
      method: "post",
      url: "/admin/role/all-roles/",

      data: data,
    };
    await axios(configLov, { withCredentials: true }).then((response) => {
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
          loginId: loginId,
          firstName: firstName,
          lastName: lastName,
          emailId: emailId,
          genderType: genderType,
          departmentId: departmentId,
          mobileNo: mobileNo,
          userRemarks: userRemarks,
          roleName: roleName,
        }}
        validationSchema={formValidation}
        onSubmit={(values, actions) => {
          let userResponseCode = "";

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
              userId: this.props.match.params.userId,
            },
            roleMap: {
              userId: this.props.match.params.userId,
              roleId: values.roleName,
            },
            token: localStorage.getItem("accessToken"),
            sessionId: localStorage.getItem("sessionId"),
          };

          setTimeout(() => {
            var update = {
              method: "post",
              url: "http://localhost:8080/admin/user/update/",

              data: payload,
            };
            axios(update, { withCredentials: true })
              .then((response) => {
                userResponseCode = response.data.responseCode;
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
                  <CardTitle>User Update Request</CardTitle>
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
                            checked={genderType === 1}
                            onChange={this.genderChangeMale}
                          />
                        </div>
                        <div className="d-inline-block mr-1">
                          <Radio
                            label="Female"
                            color="warning"
                            name="genderType"
                            checked={genderType === 2}
                            onChange={this.genderChangeFem}
                          />
                        </div>
                        <div className="d-inline-block mr-1">
                          <Radio
                            label="Transgender"
                            color="danger"
                            value="3"
                            checked={genderType === 3}
                            onChange={this.genderChangeTran}
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
                          value={roleList.find((obj) => obj.value === roleName)}
                          options={roleList}
                          onChange={this.propertyChange}
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
  propertyChange = (e) => {
    console.log("e.value:::" + e.value);
    let selectedProprty = e.value;
    this.setState({
      roleName: selectedProprty,
    });
  };

  genderChangeMale = (e) => {
    this.setState({
      genderType: 1,
    });
  };
  genderChangeFem = (e) => {
    this.setState({
      genderType: 2,
    });
  };
  genderChangeTran = (e) => {
    this.setState({
      genderType: 3,
    });
  };
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
}

var roleList = [];
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

export default UserUpdate;
