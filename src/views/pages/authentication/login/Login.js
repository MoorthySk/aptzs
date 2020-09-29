import React from "react";
import * as configData from "../../../../utility/config";
import ReactFormInputValidation from "react-form-input-validation";
import AuthenticationService from "../../../../service/admin/AuthenticationService";
import LoginService from "../../../../service/admin/LoginService";
import { Mail, Lock } from "react-feather";
import { Formik } from "formik";
import loginImg from "../../../../assets/img/pages/login.png";
import {
  Card,
  CardBody,
  Button,
  FormGroup,
  Col,
  Input,
  Row,
  Form,
} from "reactstrap";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: {
        username: "",
        password: "",
        errorMessage: "",
      },
      errors: {},
    };
    let err = "";
    this.form = new ReactFormInputValidation(this);
    this.form.useRules({
      username: "required",
      password: "required",
    });
    this.loginRqst = {
      loginId: "",
      loginFlag: "",
    };
    this.form.onformsubmit = (fields) => {
      const loginRequest = (this.state = {
        username: fields.username,
        password: fields.password,
        grant_type: "password",
      });
      // this.state.statusList = await LovList.lovList(appConst.statusList);
      AuthenticationService.createRequest(loginRequest)
        .then((response) => {
          if (response.status == 400) {
            this.loginRqst.loginId = loginRequest.username;
            this.loginRqst.loginFlag = "F";
            const userDtl = Object.assign({}, this.loginRqst);
            this.loginRequest(userDtl)
              .then((response) => {
                this.setState({ errorMessage: response.responseMsg });
              })
              .catch((error) => {
                console.error("response code" + error);
                this.setState({ error });
              });
          } else {
            this.loginRqst.loginId = loginRequest.username;
            this.loginRqst.loginFlag = "S";
            const userDtl = Object.assign({}, this.loginRqst);
            let responseCode = "";
            let responseMsg = "";
            LoginService.loginRequest(userDtl)
              .then((response) => {
                console.log("loginRequest" + response.userName);
                localStorage.setItem("userName", response.userName);
                localStorage.setItem("userMobile", response.userMobile);
                localStorage.setItem("userEmail", response.userEmail);
                localStorage.setItem("userId", response.userId);
                localStorage.setItem("roleId", response.roleId);
                localStorage.setItem("roleName", response.roleName);
                localStorage.setItem("loginId", response.loginId);
                localStorage.setItem("sessionId", response.sessionId);
                responseCode = response.responseCode;
                console.log("responseCode:::" + response.responseCode);
                if (responseCode == 1000) {
                  console.log("inside:::" + responseCode);
                  this.props.history.push("/mainDashboard/");
                } else {
                  this.setState({ errorMessage: response.responseMsg });
                }
              })
              .catch((error) => {
                this.setState({ error });
              });
          }
        })
        .catch((error) => {
          console.log("Login Error Message: " + error);
          console.error(error);
        });
    };
  }
  async createRequest(logindtl) {
    const searchParams = new URLSearchParams();
    searchParams.append("grant_type", logindtl.grant_type);
    searchParams.append("username", logindtl.username);
    searchParams.append("password", logindtl.password);
    localStorage.clear();
    var axios = require("axios");
    var qs = require("qs");
    var data = qs.stringify({
      grant_type: logindtl.grant_type,
      username: logindtl.username,
      password: logindtl.password,
    });
    const headers = new Headers({
      "Content-Type": "application/x-www-form-urlencoded",
      "Access-Control-Allow-Origin": "http://localhost:4000",
    });
    headers.append("Authorization", "Basic Z3JlZW5sZWFmOmFzdHJvbmV0");
    localStorage.clear();
    var config = {
      method: "post",
      url: "/oauth/token/",
      headers: headers,
      data: data,
    };
    let response = {};
    console.log("password     " + logindtl.password);
    await axios(config)
      .then(function (res) {
        response = res.data;
        console.log("Status Code     " + res.status);
        console.log("token     " + res.data.access_token);

        localStorage.setItem("accessToken", res.data.access_token);
      })
      .catch(function (error) {
        console.log(error);
      });

    return response;
  }
  async loginRequest(userDtl) {
    var axios = require("axios");
    var data = JSON.stringify({ loginId: "sk10", loginFlag: "S" });
    var qs = require("qs");
    var data = qs.stringify({
      loginId: userDtl.loginId,
      loginFlag: userDtl.loginFlag,
      token: localStorage.getItem("accessToken"),
    });
    var config = {
      method: "post",
      url: "/admin/login/",
      data: data,
    };
    let response = {};
    await axios(config)
      .then(function (res) {
        console.log("Login responseeee     " + res.data.responseCode);
        response = res.data;
      })
      .catch(function (error) {
        console.log(error);
      });

    return response;
  }
  render() {
    const { error } = this.state;
    return (
      <Formik>
        <Row className="m-0 justify-content-center">
          <Col
            sm="8"
            xl="7"
            lg="10"
            md="8"
            className="d-flex justify-content-center"
          >
            <Card className="bg-authentication login-card rounded-0 mb-0 w-100">
              <Row className="m-0">
                <Col
                  lg="6"
                  className="d-lg-block d-none text-center align-self-center px-1 py-0"
                >
                  <img src={loginImg} alt="loginImg" />
                </Col>
                <Col lg="6" md="12" className="p-0">
                  <Card className="rounded-0 mb-0 px-2">
                    <CardBody>
                      <h4>Login</h4>
                      <p>Welcome back, please login to your account.</p>
                      <div>
                        {this.state.error && <span>{error.message}</span>}
                      </div>
                      <Form onSubmit={this.form.handleSubmit}>
                        <FormGroup className="form-label-group position-relative has-icon-left">
                          <Input
                            type="text"
                            name="username"
                            onBlur={this.form.handleBlurEvent}
                            onChange={this.form.handleChangeEvent}
                            value={this.state.fields.username}
                            placeholder="username"
                          />
                          <div className="form-control-position">
                            <Mail size={15} />
                          </div>
                          <div style={{ color: "red" }}>
                            {this.state.errors.username
                              ? this.state.errors.username
                              : ""}
                          </div>
                        </FormGroup>
                        <FormGroup className="form-label-group position-relative has-icon-left">
                          <Input
                            type="password"
                            name="password"
                            onBlur={this.form.handleBlurEvent}
                            onChange={this.form.handleChangeEvent}
                            value={this.state.fields.password}
                            placeholder="password"
                          />
                          <div className="form-control-position">
                            <Lock size={15} />
                          </div>
                          <div style={{ color: "red" }}>
                            {this.state.errors.password
                              ? this.state.errors.password
                              : ""}
                          </div>
                          <div style={{ color: "red" }}>
                            {this.state.errorMessage}
                          </div>
                        </FormGroup>

                        <div className="d-flex justify-content-between">
                          <Button.Ripple color="primary" type="submit">
                            Login
                          </Button.Ripple>
                        </div>
                      </Form>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Formik>
    );
  }
}
export default Login;
