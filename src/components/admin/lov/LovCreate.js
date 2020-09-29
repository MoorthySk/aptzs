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
class LovCreate extends React.Component {
  state = {
    successAlert: true,
    isActive: null,
    lovListValue: [],
  };
  async componentDidMount() {
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
    const { lovId = "" } = this.state;

    return (
      <Formik
        enableReinitialize
        initialValues={{
          lovCode: "",
          lovName: "",
          lovParentId: "",
          lovRemarks: "",
          lovSeqCode: "",
          recordStatus: 1,
        }}
        validationSchema={formValidation}
        onSubmit={(values, actions) => {
          let lovResCode = "";
          let userId = "";
          console.log("lovParentId:: " + values.lovParentId.value);
          var payload = {
            lovCode: values.lovCode,
            lovName: values.lovName,
            lovParentId: values.lovParentId.value,
            lovRemarks: values.lovRemarks,
            recordStatus: values.recordStatus,
          };
          setTimeout(() => {
            axios({
              method: "POST",
              url: "/admin/lov/create/",
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
                  <CardTitle>Lov Request</CardTitle>
                  <Row>
                    <Col md="6" sm="12">
                      <FormGroup>
                        <label htmlFor="lovCode">Lov Code</label>
                        <Field
                          className="form-control"
                          name="lovCode"
                          placeholder="Doe"
                          type="text"
                        />
                        <ErrorMessage
                          name="lovCode"
                          component="div"
                          className="field-error text-danger"
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6" sm="12">
                      <FormGroup>
                        <label htmlFor="lovName">Lov Name</label>
                        <Field
                          className="form-control"
                          name="lovName"
                          placeholder="Doe"
                          type="text"
                        />
                        <ErrorMessage
                          name="lovName"
                          component="div"
                          className="field-error text-danger"
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6" sm="12">
                      <label htmlFor="lovParentId">Lov Parent Name</label>
                      <FormGroup>
                        <Select
                          isClearable={true}
                          name="lovParentId"
                          classNamePrefix="select"
                          options={lovList}
                          onChange={(lovList) =>
                            setFieldValue("lovParentId", lovList)
                          }
                        />

                        <ErrorMessage
                          name="lovParentId"
                          component="div"
                          className="field-error text-danger"
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6" sm="12">
                      <label htmlFor="recordStatus">Active Status</label>

                      <FormGroup className="has-icon-left position-relative">
                        <div className="d-inline-block mr-1">
                          <Radio
                            label="Active"
                            color="primary"
                            name="recordStatus"
                            defaultChecked={true}
                            onChange={() => setFieldValue("recordStatus", "1")}
                          />
                        </div>

                        <div className="d-inline-block mr-1">
                          <Radio
                            label="InActive"
                            color="danger"
                            name="recordStatus"
                            onChange={() => setFieldValue("recordStatus", "9")}
                          />
                        </div>
                      </FormGroup>
                    </Col>
                    <Col md="6" sm="12">
                      <label htmlFor="lovRemarks">Remarks</label>
                      <FormGroup>
                        <Field
                          name="lovRemarks"
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
