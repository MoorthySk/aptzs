import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import Helpers from "../Helpers";
import Radio from "../../../components/@vuexy/radio/RadioVuexy";
import SweetAlert from "react-bootstrap-sweetalert";
import { history } from "../../../history";
import StatisticsCardCol from "../../../components/@vuexy/statisticsCard/StatisticsCardCol";
import { Person } from "@material-ui/icons";
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Button,
  FormGroup,
  Col,
  Input,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  TabContent,
  TabPane,
  Label,
} from "reactstrap";
import axios from "axios";
import {
  User,
  Mail,
  Phone,
  Edit,
  ArrowDown,
  CheckSquare,
  XSquare,
} from "react-feather";

import { Flare } from "@material-ui/icons";
const ModalConfig = [
  {
    id: 5,
    btnTitle: "Edit Task",
    modalTitle: "Update Task",
    modalClass: "modal-lg",
    bgColor: "bg-primary",
  },
];
class TaskDetails extends React.Component {
  state = {
    activeTab: "1",
    active: "1",
    contactPersonName: null,
    contactPersonEmail: null,
    contactPersonNumber: null,
    priority: null,
  };

  async componentDidMount() {
    let mess = "";
    let maintId = this.props.requestId;
    console.log("maintId:::" + maintId);
    await axios
      .post("/maint/maint/preEdit/", {
        maintId: maintId,
      })

      .then((response) => {
        mess = response.data.maintReq;
        this.setState({
          contactPersonName: mess.contactPersonName,
          contactPersonEmail: mess.contactPersonEmail,
          issueType: mess.issueType,
          issueDesc: mess.issueDesc,
          priority: mess.priority,
          contactPersonNumber: mess.contactPersonNumber,
          maintId: mess.maintId,
          mangRemarks: mess.mangRemarks,
        });
      });
  }
  toggleModal = (id) => {
    console.log("inside the submit");
    if (this.state.modal !== id) {
      this.setState({
        modal: id,
      });
    } else {
      this.setState({
        modal: null,
      });
    }
  };
  successMessage(state, value) {
    const getAlert = () => (
      <SweetAlert
        success
        confirmBtnText="Ok!"
        title="Success"
        tim
        show={this.state.successAlert}
        onConfirm={() => this.hideAlert()}
      >
        <p className="sweet-alert-text">Request Sussessfully Updated</p>
      </SweetAlert>
    );
    this.setState({
      alert: getAlert(),
    });
  }
  hideAlert = () => {
    console.log("maintId:::" + this.props.requestId);
    history.push("/maintSearch/");
  };
  render() {
    const {
      contactPersonName = "",
      contactPersonEmail = "",
      issueType = "",
      issueDesc = "",
      contactPersonNumber = "",
      priority = "",
      maintId = "",
      mangRemarks = "",
    } = this.state;
    const renderModal = ModalConfig.map((item) => {
      return (
        <React.Fragment key={item.id}>
          <Button.Ripple
            onClick={() => this.toggleModal(item.id)}
            key={item.title}
            color="primary"
            className="w-100 box-shadow-1 mt-2"
            block
          >
            {item.btnTitle}
          </Button.Ripple>

          <Modal
            isOpen={this.state.modal === item.id}
            toggle={() => this.toggleModal(item.id)}
            className={`modal-dialog-centered ${item.modalClass}`}
            key={item.id}
          >
            <ModalHeader
              toggle={() => this.toggleModal(item.id)}
              className={item.bgColor}
            >
              {item.modalTitle}
              {item.title}
            </ModalHeader>
            <ModalBody>
              <Formik
                enableReinitialize
                initialValues={{
                  contactPersonEmail: contactPersonEmail,
                  issueType: issueType,
                  issueDesc: issueDesc,
                  contactPersonName: contactPersonName,
                  priority: priority,
                  contactPersonNumber: contactPersonNumber,
                  maintId: maintId,
                }}
                // validationSchema={formValidation}
                //Onsubmit API Call function start////////////////////////////

                onSubmit={(values, actions) => {
                  let responseCode = "";

                  setTimeout(() => {
                    axios({
                      method: "POST",
                      url: "/maint/maint/update/",

                      data: values,
                    })
                      .then((response) => {
                        console.log("Response:::::::::::::" + response.data);

                        responseCode = response.data.responseCode;
                        console.log(
                          "Response Code:::::::::::::" + responseCode
                        );
                        if ((responseCode = 1000)) {
                          this.successMessage("successAlert", true);
                        } else {
                          //  toast.error("Bad Request");
                        }
                      })
                      .catch((error) => {
                        console.log(error);
                        //toast.error("Bad Request, Please verify your inputs!");
                      });
                  }, 1000);
                }}
                //Onsubmit API Call function End////////////////////////////
              >
                {(props) => {
                  const { setFieldValue, errors, touched } = props;
                  return (
                    //Form Start////////////////////////////
                    <Form onSubmit={props.handleSubmit}>
                      <Row>
                        <Col md="6" sm="12">
                          <CardTitle>Issue Type</CardTitle>

                          <FormGroup className="has-icon-left position-relative">
                            <Field
                              name="issueType"
                              as="select"
                              className={
                                "form-control" +
                                (errors.title && touched.title
                                  ? " is-invalid"
                                  : "")
                              }
                            >
                              <option value="">select</option>
                              <option value="Power Issue">Power Issue</option>
                              <option value="Payment Issue">
                                Payment Issue
                              </option>
                              <option value="Water Problem">
                                Water Problem
                              </option>
                              <option value="Cleaning">Cleaning</option>
                            </Field>
                            <div className="form-control-position">
                              <ArrowDown size={15} />
                            </div>
                          </FormGroup>
                        </Col>
                        <Col md="6" sm="12">
                          <FormGroup>
                            <CardTitle>Priority</CardTitle>
                            <div className="d-inline-block mr-1">
                              <Radio
                                label="Low"
                                color="primary"
                                name="priority"
                                checked={priority === "1"}
                                onChange={() =>
                                  setFieldValue("priority", priority)
                                }
                              />
                            </div>
                            <div className="d-inline-block">
                              <Radio
                                label="Medium"
                                color="warning"
                                name="priority"
                                checked={priority === "2"}
                                onChange={() =>
                                  setFieldValue("priority", priority)
                                }
                              />
                            </div>
                            <div className="d-inline-block mr-1">
                              <Radio
                                label="High"
                                color="danger"
                                name="priority"
                                checked={priority === "3"}
                                onChange={() =>
                                  setFieldValue("priority", priority)
                                }
                              />
                            </div>
                          </FormGroup>
                        </Col>
                        <Col md="12" sm="12">
                          <label htmlFor="issueDesc">Issue Description</label>
                          <FormGroup className="has-icon-left position-relative">
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
                            <div className="form-control-position">
                              <Edit size={15} />
                            </div>
                          </FormGroup>
                        </Col>

                        <Col md="12" sm="12">
                          <CardTitle>Contact Details</CardTitle>
                        </Col>
                        <Col md="6" sm="12">
                          <label>Person Name</label>
                          <FormGroup className="has-icon-left position-relative">
                            <Field
                              className="form-control"
                              name="contactPersonName"
                              placeholder="Doe"
                              type="text"
                            />

                            <div className="form-control-position">
                              <User size={15} />
                            </div>
                          </FormGroup>
                        </Col>
                        <Col md="6" sm="12">
                          <label htmlFor="contactPersonEmail">Email</label>
                          <FormGroup className="has-icon-left position-relative">
                            <Field
                              className="form-control"
                              name="contactPersonEmail"
                              placeholder="jane@acme.com"
                              type="email"
                            />
                            <div className="form-control-position">
                              <Mail size={15} />
                            </div>
                          </FormGroup>
                        </Col>
                        <Col md="6" sm="12">
                          <label htmlFor="contactPersonNumber">
                            Person Number
                          </label>
                          <FormGroup className="has-icon-left position-relative">
                            <Field
                              className="form-control"
                              name="contactPersonNumber"
                              type="number"
                              placeholder="Phone Number"
                            />
                            <div className="form-control-position">
                              <Phone size={15} />
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

                            <span className="align-middle ml-25">Update</span>
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
                    </Form>
                  );
                }}
              </Formik>
            </ModalBody>
          </Modal>
        </React.Fragment>
      );
    });
    return (
      <Formik>
        <Row>
          <Card>
            <CardBody>
              <Row>
                <Col md="10" sm="12" className="text-left">
                  <dt style={{ textAlign: "center" }}>Task Details</dt>
                </Col>
              </Row>
              <hr />
              <Row>
                <Col md="6" sm="12" className="text-left">
                  <p className="font-weight-bold">Task Created By</p>
                </Col>
                <Col md="6" sm="12" className="text-Right">
                  <label>Tenant</label>
                </Col>
                <Col md="6" sm="12" className="text-left">
                  <p className="font-weight-bold">Name</p>
                </Col>
                <Col md="6" sm="12" className="text-Right">
                  <label>{contactPersonName}</label>
                </Col>
                <Col md="6" sm="12" className="text-left">
                  <p className="font-weight-bold">Priority</p>
                </Col>
                <Col md="6" sm="12" className="text-Right">
                  {priority === "1" ? (
                    <div className="badge badge-pill badge-light-success">
                      {"Low"}
                    </div>
                  ) : priority === "2" ? (
                    <div className="badge badge-pill badge-light-warning">
                      {"Medium"}
                    </div>
                  ) : priority === "3" ? (
                    <div className="badge badge-pill badge-light-danger">
                      {"High"}
                    </div>
                  ) : null}
                </Col>

                <Col md="6" sm="12" className="text-left">
                  <p className="font-weight-bold">Email</p>
                </Col>
                <Col md="6" sm="12" className="text-Right">
                  <label>{contactPersonEmail}</label>
                </Col>
                <Col md="6" sm="12" className="text-left">
                  <p className="font-weight-bold">Contact No</p>
                </Col>
                <Col md="6" sm="12" className="text-Right">
                  <label>{contactPersonNumber}</label>
                </Col>
              </Row>
              <div className="divider divider-warning">
                <div className="divider-text">
                  <Flare></Flare>
                </div>
              </div>

              <Col md="12" sm="12">
                <TabContent activeTab={this.state.activeTab}>
                  <TabPane tabId="1">{renderModal}</TabPane>
                </TabContent>
              </Col>
            </CardBody>
          </Card>
          <Col lg="12" sm="12">
            <StatisticsCardCol
              hideChart
              iconLeft
              iconBg="primary"
              icon={<Person className="primary" style={{ fontSize: 30 }} />}
              stat={"Moorthy"}
              statTitle={"Vendor Name"}
            />
          </Col>
        </Row>
      </Formik>
    );
  }
}
export default TaskDetails;
