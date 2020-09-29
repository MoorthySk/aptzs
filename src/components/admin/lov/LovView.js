import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { ArrowLeftCircle } from "react-feather";
import Radio from "../../@vuexy/radio/RadioVuexy";
import SweetAlert from "react-bootstrap-sweetalert";
import { CheckSquare, XSquare } from "react-feather";
import axios from "axios";
import "react-toggle/style.css";
import "../../../assets/scss/plugins/forms/switch/react-toggle.scss";
import "../../../assets/scss/plugins/forms/react-select/_react-select.scss";
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
} from "reactstrap";
var lovList = [];
var _ = require("lodash");
class LovCreate extends React.Component {
  state = {
    successAlert: true,
    isActive: null,
    lovListValue: [],
  };
  async componentDidMount() {
    var lovId = this.props.match.params.lovId;
    await axios
      .post("/admin/lov/search/", {
        lovId: lovId,
      })
      .then((response) => {
        this.setState({
          lovId: response.data.lovList.lovId,
          lovName: response.data.lovList.lovName,
          lovParentId: response.data.lovList.lovParentId,
          lovRemarks: response.data.lovList.lovRemarks,
          lovCode: response.data.lovList.lovCode,
          recordStatus: response.data.lovList.recordStatus,
        });
      });
    await axios
      .post("/admin/lov/search-all-parent/", {
        lovParentId: 0,
      })
      .then((response) => {
        try {
          this.setState({
            value: response.data.lovList,
          });
        } catch (e) {
          console.log(e);
        }
      });

    let marked = this.state.value;
    lovList.splice(0, lovList.length);
    marked !== undefined &&
      this.state.value.forEach((rData) => {
        let lovData = {};
        lovData.value = rData.lovId;
        lovData.label = rData.lovName;
        lovList.push(lovData);
        this.setState({ lovListValue: lovList });
      });
  }

  render() {
    const {
      lovId = "",
      lovCode = "",
      lovName = "",
      lovParentId = "",
      lovRemarks = "",
    } = this.state;

    return (
      <Formik
        enableReinitialize
        initialValues={{
          lovCode: lovCode,
          lovName: lovName,
          lovParentId: lovParentId,
          lovRemarks: lovRemarks,
          lovId: lovId,
        }}
        validationSchema={formValidation}
        onSubmit={(values, actions) => {
          let lovResCode = "";
          let userId = "";
          console.log("lovParentId:: " + values.lovParentId.value);
          var payload = {
            lovId: lovId,
            lovCode: values.lovCode,
            lovName: values.lovName,
            lovParentId: values.lovParentId.value,
            lovRemarks: values.lovRemarks,
            recordStatus: values.recordStatus,
          };
          setTimeout(() => {
            axios({
              method: "POST",
              url: "/admin/lov/update/",
              data: payload,
            })
              .then((response) => {
                lovResCode = response.data.responseCode;
                if ((lovResCode = 1000)) {
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
            values,
            handleBlur,
          } = props;

          return (
            <Form onSubmit={props.handleSubmit}>
              <Card>
                <CardBody>
                  <CardTitle>Lov View Request</CardTitle>
                  <Row>
                    <Col md="6" sm="12">
                      <FormGroup>
                        <h6>Lov Code</h6>
                        <label>{this.state.lovCode} </label>
                      </FormGroup>
                    </Col>
                    <Col md="6" sm="12">
                      <FormGroup>
                        <h6>Lov Name</h6>
                        <label>{this.state.lovName} </label>
                      </FormGroup>
                    </Col>
                    <Col md="6" sm="12">
                      <FormGroup>
                        <h6>Lov Parent Name</h6>
                        <label>
                          {_.filter(lovList, { value: lovParentId }).map(
                            (v) => v.label
                          )}{" "}
                        </label>
                      </FormGroup>
                    </Col>
                    <Col md="6" sm="12">
                      <FormGroup>
                        <h6>Active Status</h6>
                        <label>
                          {this.state.recordStatus == 1 ? "Active" : "InActive"}
                        </label>
                      </FormGroup>
                    </Col>
                    <Col md="6" sm="12">
                      <FormGroup>
                        <h6>Remarks</h6>
                        <label>{this.state.lovRemarks}</label>
                      </FormGroup>
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

const formValidation = Yup.object().shape({
  lovCode: Yup.string().required("Required"),
  lovName: Yup.string().required("Required"),
  lovParentId: Yup.string().required("Required"),
});

export default LovCreate;
