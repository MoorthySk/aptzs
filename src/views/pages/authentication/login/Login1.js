import React from "react";
import {
  Button,
  Card,
  CardBody,
  Row,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
} from "reactstrap";
import { Mail, Lock, Check, Facebook, Twitter, GitHub } from "react-feather";
import { history } from "../../../../history";
import Checkbox from "../../../../components/@vuexy/checkbox/CheckboxesVuexy";
import googleSvg from "../../../../assets/img/svg/google.svg";
import loginImg from "../../../../assets/img/pages/login.png";
import "../../../../assets/scss/pages/authentication.scss";
import AuthenticationService from "../../../../service/admin/AuthenticationService";
import LoginService from "../../../../service/admin/LoginService";
import SweetAlert from "react-bootstrap-sweetalert";
import Alert from "react-s-alert";
import { CookiesProvider } from "react-cookie";

class Login1 extends React.Component {
  state = {
    //activeTab: "1",
    username: "",
    password: "",
    grant_type: "password",
  };
  loginRqst = {
    loginId: "",
    loginFlag: "",
  };
  toggle = (tab) => {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  };
  /* state = {
    successAlert: true,
  };*/
  successMessgae(state, value) {
    const getAlert = () => (
      <SweetAlert
        success
        confirmBtnText="Ok!"
        title="Success"
        show={this.state.successAlert}
        onConfirm={() => this.hideAlert()}
      >
        <p className="sweet-alert-text">You're successfully logged in</p>
      </SweetAlert>
    );
    this.setState({
      alert: getAlert(),
    });
  }
  hideAlert() {
    console.log("Hiding alert...");
    this.setState({
      alert: null,
    });
  }
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      grant_type: "password",
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.successMessgae = this.successMessgae.bind(this);
  }
  handleInputChange(event) {
    const target = event.target;
    const inputName = target.name;
    const inputValue = target.value;
    this.setState({
      [inputName]: inputValue,
    });
  }
  handleSubmit(event) {
    event.preventDefault();
    const loginRequest = Object.assign({}, this.state);
    AuthenticationService.createRequest(loginRequest)
      .then((response) => {
        if (response == 400) {
          this.loginRqst.loginId = loginRequest.username;
          this.loginRqst.loginFlag = "F";
          const userDtl = Object.assign({}, this.loginRqst);
          LoginService.loginRequest(userDtl)
            .then((response) => {
              console.log("Error Response:" + response.responseMsg);
              this.successMessgae(response.responseMsg);
            })
            .catch((error) => {
              this.successMessgae(
                (error && error.message) ||
                  "Oops! Something went wrong. Please try again!"
              );
              //Alert.error('Invlid Username/Password!!!');
            });
        } else {
          this.loginRqst.loginId = loginRequest.username;
          this.loginRqst.loginFlag = "S";
          const userDtl = Object.assign({}, this.loginRqst);
          LoginService.loginRequest(userDtl)
            .then((response) => {
              this.props.history.push("/maintSearch");
            })
            .catch((error) => {
              this.successMessgae(
                (error && error.message) ||
                  "Oops! Something went wrong. Please try again!"
              );
              //Alert.error('Invlid Username/Password!!!');
            });
        }
      })
      .catch((error) => {
        //this.successMessgae((error && error.message) || 'Oops! Something went wrong. Please try again!');
        Alert.error("Invlid Username/Password!!!");
      });
  }
  render() {
    return (
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
                    <Form onSubmit={this.handleSubmit}>
                      <FormGroup className="form-label-group position-relative has-icon-left">
                        <Input
                          type="text"
                          name="username"
                          placeholder="username"
                          value={this.state.username}
                          onChange={this.handleInputChange}
                        />
                        <div className="form-control-position">
                          <Mail size={15} />
                        </div>
                        <Label>User Name</Label>
                      </FormGroup>
                      <FormGroup className="form-label-group position-relative has-icon-left">
                        <Input
                          type="password"
                          name="password"
                          placeholder="Password"
                          value={this.state.password}
                          onChange={this.handleInputChange}
                        />
                        <div className="form-control-position">
                          <Lock size={15} />
                        </div>
                        <Label>Password</Label>
                      </FormGroup>
                      <FormGroup className="d-flex justify-content-between align-items-center">
                        <Checkbox
                          color="primary"
                          icon={<Check className="vx-icon" size={16} />}
                          label="Remember me"
                        />
                        <div className="float-right">Forgot Password?</div>
                      </FormGroup>
                      <div className="d-flex justify-content-between">
                        <Button.Ripple color="primary" outline>
                          Register
                        </Button.Ripple>
                        <Button.Ripple color="primary" type="submit">
                          Login
                        </Button.Ripple>
                      </div>
                    </Form>
                  </CardBody>
                  <div className="auth-footer">
                    <div className="divider">
                      <div className="divider-text">OR</div>
                    </div>
                    <div className="footer-btn">
                      <Button.Ripple className="btn-facebook" color="">
                        <Facebook size={14} />
                      </Button.Ripple>
                      <Button.Ripple className="btn-twitter" color="">
                        <Twitter size={14} stroke="white" />
                      </Button.Ripple>
                      <Button.Ripple className="btn-google" color="">
                        <img
                          src={googleSvg}
                          alt="google"
                          height="15"
                          width="15"
                        />
                      </Button.Ripple>
                      <Button.Ripple className="btn-github" color="">
                        <GitHub size={14} stroke="white" />
                      </Button.Ripple>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    );
  }
}
export default Login1;
