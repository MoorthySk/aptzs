import React from "react";
import { Formik, Form } from "formik";
import { ArrowLeftCircle } from "react-feather";
import axios from "axios";
import "react-toggle/style.css";
import "../../../assets/scss/plugins/forms/switch/react-toggle.scss";
import "../../../assets/scss/plugins/forms/react-select/_react-select.scss";
import Helpers from "./Helpers";
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

class UserView extends React.Component {
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
    var userId = this.props.match.params.userId;
    var roleName = localStorage.getItem("roleName");
    console.log("roleId:::" + roleName);
    let userObj = "";
    await axios
      .post("/admin/user/user-byid/", {
        userId: userId,
      })
      .then((response) => {
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
            roleId: userObj.roleId,
          });
        } catch (e) {
          console.log(e);
        }
      });

    await axios({
      method: "POST",
      url: "/admin/role/all-roles/",
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
        if (this.state.roleId === rData.roleId) {
          this.setState({ roleName: rData.roleName });
        }
      });
    const genderList = ["", "Male", "Female", "Transgender"];
    this.setState({ genderName: genderList[this.state.genderType] });
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
      roleId = "",
      roleName = "",
      genderName = "",
    } = this.state;

    return (
      <Formik>
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
            <Form>
              <Card>
                <CardBody>
                  <CardTitle>User View Request</CardTitle>
                  <Row>
                    <Col md="6" sm="12">
                      <FormGroup>
                        <h6>Login Id</h6>
                        <label>{loginId}</label>
                      </FormGroup>
                    </Col>
                    <Col md="6" sm="12">
                      <FormGroup>
                        <h6>First Name</h6>
                        <label>{this.state.firstName}</label>
                      </FormGroup>
                    </Col>
                    <Col md="6" sm="12">
                      <FormGroup>
                        <h6>Last Name</h6>
                        <label>{this.state.lastName}</label>
                      </FormGroup>
                    </Col>
                    <Col md="6" sm="12">
                      <h6>Gender</h6>
                      <label>{this.state.genderName}</label>
                    </Col>
                    <Col md="6" sm="12">
                      <FormGroup>
                        <h6>Email Id</h6>
                        <label>{this.state.emailId}</label>
                      </FormGroup>
                    </Col>
                    <Col md="6" sm="12">
                      <FormGroup>
                        <h6>Mobile No</h6>
                        <label>{this.state.mobileNo}</label>
                      </FormGroup>
                    </Col>
                    <Col md="6" sm="12">
                      <h6>Role Name</h6>
                      <label>{this.state.roleName}</label>
                    </Col>
                    <Col md="6" sm="12">
                      <h6>Remarks</h6>
                      <label>{this.state.userRemarks}</label>
                    </Col>
                  </Row>
                  <br />
                  <FormGroup row>
                    <Button.Ripple
                      color="danger"
                      onClick={Helpers.handleCancel}
                      className="mr-1 mb-1"
                    >
                      <ArrowLeftCircle size={14} />
                      <span className="align-middle ml-25">Back</span>
                    </Button.Ripple>
                  </FormGroup>
                </CardBody>
              </Card>
            </Form>
          );
        }}
      </Formik>
    );
  }
}

var roleList = [];

export default UserView;
