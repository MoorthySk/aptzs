import React from "react";

import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import Radio from "../../@vuexy/radio/RadioVuexy";
import SweetAlert from "react-bootstrap-sweetalert";
import { CheckSquare, XSquare, ChevronsLeft, Star } from "react-feather";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../../assets/scss/plugins/extensions/toastr.scss";
import Helpers from "../Helpers";
import axios from "axios";
import * as appConst from "../../../utility/Constants";
import LovList from "../../common/Helpers";
import DropZone from "../../common/DropZone";
import Select from "react-select";
import query from "../../../assets/img/elements/query.png";
import "../../../assets/scss/pages/app-ecommerce-shop.scss";
import maintanance from "../../../assets/img/elements/maintanance.png";

import PropTypes from "prop-types";
import UnitSelection from "./UnitSelection";
import { getTaskById } from "../../../redux/actions/maintanance/task/index";
import { connect } from "react-redux";
import DMS from "../../common/Helpers";
import Swiper from "react-id-swiper";

import img1 from "../../../assets/img/slider/banner-31.jpg";
import img2 from "../../../assets/img/slider/banner-22.jpg";
import img3 from "../../../assets/img/slider/banner-23.jpg";
import img4 from "../../../assets/img/slider/banner-24.jpg";
import img5 from "../../../assets/img/slider/banner-25.jpg";
import "swiper/css/swiper.css";
import "../../../assets/scss/plugins/extensions/swiper.scss";

import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Button,
  FormGroup,
  Col,
  Input,
  Filed,
  Row,
  Media,
} from "reactstrap";
import { helpers } from "chart.js";
//Importv End::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

//Default Error Messgae::::::::::::::::::::::::::::::::::::::::::::::::::::
const phoneRegExp = /^((\+\d{1,3}(-| )?\(?\d\)?(-| )?\d{1,3})|(\(?\d{2,3}\)?))(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$/;

const formValidation = Yup.object().shape({
  priority: Yup.number().required("Required"),
  contactName: Yup.string()
    .max(20, "Must be 20 characters or less")
    .required("Required"),
  contactEmail: Yup.string()
    .email("Invalid email address")
    .required("Required"),
  contactMobile: Yup.string()
    .matches(phoneRegExp, "Phone number is not valid")
    .required("Required"),
  issueDescription: Yup.string().required("Required"),
  taskCategory: Yup.string().required("Required"),
  subject: Yup.string().required("Required"),
});

const swiperParams = {
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  breakpoints: {
    500: {
      slidesPerView: 2,
      spaceBetween: 55,
    },
    100: {
      slidesPerView: 1,
      spaceBetween: 55,
    },
  },
};
const params = {
  effect: "cube",
  grabCursor: true,
  cubeEffect: {
    shadow: true,
    slideShadows: true,
    shadowOffset: 20,
    shadowScale: 0.94,
  },
  pagination: {
    el: ".swiper-pagination",
  },
};
var categoryOptions = [];

let fileList = "";
let imgSlider = "";
class TaskUpdate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      successAlert: true,
      taskType: 1,
      fileList: [],
      value: "",
      propertyUnitId: "",
      contactEmail: "",
      contactMobile: "",
      contactName: "",
      subject: "",
      propertyUnitId: "",
      priority: "",
      selFiles: [],
      taskId: this.props.match.params.taskId,
    };
    this.getRefsFromChild = this.getRefsFromChild.bind(this);
    this.radioPriority = this.radioPriority.bind(this);
    this.taskUpdateHandler = this.taskUpdateHandler.bind(this);
  }
  static getDerivedStateFromProps(props, state) {
    if (props.taskRedux.task !== props.taskRedux.task) {
      return {
        taskData: props.taskRedux.task.getTask,
      };
    }
    // Return null if the state hasn't changed
    return null;
  }
  getRefsFromChild(childRefs) {
    this.setState({
      propertyUnitId: childRefs,
    });
  }
  onDropFile = (files) => {
    console.log("selFiles " + files);
    this.setState({ selFiles: files });
  };

  async taskUpdateHandler() {
    /*if(this.state.selFiles && this.state.selFiles.length){
      console.log("selFiles " + this.state.selFiles);     
    }*/
    console.log("inside task update...");
    const url = "/maint/task/maint-task-update/";
    var ress = await LovList.taskCreateUpdate(
      url,
      this.state.selFiles,
      this.state.taskId,
      this.state.taskType,
      this.state.taskCategory,
      this.state.subject,
      this.state.issueDescription,
      this.state.priority,
      this.state.propertyUnitId,
      this.state.contactName,
      this.state.contactEmail,
      this.state.contactMobile
    );
    if (ress == 1000) {
      this.successMessgae("successAlert", true);
    } else {
      toast.error("Bad Request");
    }
  }

  successMessgae(state, value) {
    const getAlert = () => (
      <SweetAlert
        success
        confirmBtnText="Ok!"
        title="Success"
        show={this.state.successAlert}
        onConfirm={() => Helpers.redirectSearch()}
      >
        <p className="sweet-alert-text">Request Sussessfully Added</p>
      </SweetAlert>
    );
    this.setState({
      alert: getAlert(),
    });
  }
  radioTaskType = (e) => {
    console.log("Radio Value " + e.currentTarget.value);
    this.setState({
      taskType: e.currentTarget.value,
    });
  };
  radioPriority = (e) => {
    // this.state.priority = e.currentTarget.value;

    this.setState({
      priority: e.currentTarget.value,
    });
  };

  async componentDidMount() {
    categoryOptions = await LovList.lovList(appConst.taskCategory);
    fileList = await DMS.fileViewAll(this.state.taskId);

    await this.props
      .getTaskById(this.state.taskId)
      .then(() => {
        let mess = this.props.taskRedux.taskDataById;
        this.setState({
          assignedId: mess.assignedId,
          contactEmail: mess.contactEmail,
          contactMobile: mess.contactMobile,
          contactName: mess.contactName,
          createdDate: mess.createdDate,
          issueDescription: mess.issueDescription,
          modifiedBy: mess.modifiedBy,
          modifiedDate: mess.modifiedDate,
          priority: mess.priority,
          propertyUnitId: mess.propertyUnitId,
          recordStatus: mess.recordStatus,
          requestFrom: mess.requestFrom,
          subject: mess.subject,
          taskCategory: mess.taskCategory,
          taskHdrId: mess.taskHdrId,
          taskStatus: mess.taskStatus,
          taskType: mess.taskType,
        });
      })
      .catch((error) => {
        console.log("error:::" + error);
      });
  }
  render() {
    const {
      getAlert,
      state,
      assignedId,
      contactEmail,
      contactMobile,
      contactName,
      createdDate,
      issueDescription,
      modifiedBy,
      modifiedDate,
      priority,
      propertyUnitId,
      recordStatus,
      requestFrom,
      subject,
      taskCategory,
      taskHdrId,
      taskStatus,
      taskType,
    } = this.state;

    return (
      <Formik
        enableReinitialize
        initialValues={{
          assignedId: assignedId,
          contactEmail: contactEmail,
          contactMobile: contactMobile,
          contactName: contactName,
          createdDate: createdDate,
          issueDescription: issueDescription,
          modifiedBy: modifiedBy,
          modifiedDate: modifiedDate,
          priority: priority,
          propertyUnitId: propertyUnitId,
          recordStatus: recordStatus,
          requestFrom: requestFrom,
          subject: subject,
          taskCategory: taskCategory,
          taskHdrId: taskHdrId,
          taskStatus: taskStatus,
          taskType: taskType,
        }}
        validationSchema={formValidation}
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
            //<Form onSubmit={this.taskUpdateHandler}>
            <Form>
              <Row>
                <Col sm="1" />
                <Col sm="8">
                  <Card>
                    <CardBody>
                      <Row>
                        <Col
                          className="details-page-swiper text-center mt-0"
                          sm="12"
                        >
                          <div className="heading-section mb-3">
                            <h2 className=" mb-50">Task Creation</h2>
                            <p>Task will be closed within 48 hours</p>
                          </div>
                          <Swiper {...swiperParams}>
                            <div>
                              <div className="title mb-1">
                                <p className="font-medium-1 text-bold-600 truncate mb-0">
                                  Maintanance
                                </p>
                                <small>Request</small>
                              </div>

                              <Media className="mt-md-1 mt-0" left>
                                <Media
                                  className="rounded mr-2"
                                  object
                                  src={maintanance}
                                  alt="Generic placeholder image"
                                  height="150"
                                  width="170"
                                />
                              </Media>

                              <Col md={{ size: 6, offset: 5 }}>
                                <Radio
                                  size="lg"
                                  checked={taskType == 1}
                                  color="primary"
                                  name="taskType"
                                  value="1"
                                  onChange={this.radioTaskType}
                                />
                              </Col>
                            </div>
                            <div>
                              <div className="title mb-1">
                                <p className="font-medium-1 text-bold-600 truncate mb-0">
                                  Query
                                </p>
                                <small>Request</small>
                              </div>

                              <Media className="mt-md-1 mt-0" left>
                                <Media
                                  className="rounded mr-2"
                                  object
                                  src={query}
                                  alt="Generic placeholder image"
                                  height="150"
                                  width="170"
                                />
                              </Media>

                              <div className="ml-1">
                                <Col md={{ size: 8, offset: 5 }}>
                                  <Radio
                                    checked={taskType == 2}
                                    size="lg"
                                    color="warning"
                                    name="taskType"
                                    value="2"
                                    onChange={this.radioTaskType}
                                  />
                                </Col>
                              </div>
                            </div>
                            <div>
                              <div className="title mb-1">
                                <p className="font-medium-1 text-bold-600 truncate mb-0">
                                  Payment
                                </p>
                                <small>Request</small>
                              </div>
                              <Media className="mt-md-1 mt-0" left>
                                <Media
                                  className="rounded mr-2"
                                  object
                                  src={query}
                                  alt="Generic placeholder image"
                                  height="150"
                                  width="170"
                                />
                              </Media>
                              <div className="ml-1">
                                <Col md={{ size: 8, offset: 5 }}>
                                  <Radio
                                    size="lg"
                                    color="info"
                                    name="priority"
                                    value="3"
                                    onChange={this.radioTaskType}
                                  />
                                </Col>
                              </div>
                            </div>
                          </Swiper>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>{" "}
                  <Card>
                    <CardBody>
                      {taskType == 1 ? (
                        <CardTitle>Maintanance Request</CardTitle>
                      ) : (
                        <CardTitle>Query Request</CardTitle>
                      )}
                      <Row>
                        <Col sm="12" md="6">
                          {" "}
                          {taskType == 1 && (
                            <FormGroup>
                              <label htmlFor="taskCategory">
                                {" "}
                                Category Type
                              </label>

                              <Select
                                name="taskCategory"
                                classNamePrefix="select"
                                value={categoryOptions.find(
                                  (obj) => obj.value == taskCategory
                                )}
                                options={categoryOptions}
                                onChange={this.taskCategChange}
                              />
                              <ErrorMessage
                                name="taskCategory"
                                component="div"
                                className="field-error text-danger"
                              />
                            </FormGroup>
                          )}{" "}
                          {taskType == 2 && (
                            <FormGroup>
                              <label htmlFor="taskCategory"> Query Type</label>
                              <Select
                                name="taskCategory"
                                classNamePrefix="select"
                                value={categoryOptions.find(
                                  (obj) => obj.value == taskCategory
                                )}
                                options={categoryOptions}
                                onChange={this.taskCategChange}
                              />

                              <ErrorMessage
                                name="taskCategory"
                                component="div"
                                className="field-error text-danger"
                              />
                            </FormGroup>
                          )}
                        </Col>
                        <Col sm="12" md="6">
                          <FormGroup>
                            <label htmlFor="subject">Subject</label>
                            <Field
                              className="form-control"
                              name="subject"
                              placeholder="Doe"
                              type="text"
                              onChange={(e) => {
                                this.setState({
                                  subject: e.currentTarget.value,
                                });
                              }}
                            />
                            <ErrorMessage
                              name="subject"
                              component="div"
                              className="field-error text-danger"
                            />
                          </FormGroup>
                        </Col>
                        <Col sm="12" md="6">
                          <FormGroup>
                            <label htmlFor="issueDescription">
                              Description
                            </label>
                            <Field
                              name="issueDescription"
                              className="form-control"
                              placeholder="Doe"
                            >
                              {({
                                field, // { name, value, onChange, onBlur }
                                form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                meta,
                              }) => (
                                <div>
                                  <Input
                                    type="textarea"
                                    placeholder="Issue Description"
                                    {...field}
                                    onChange={(e) => {
                                      this.setState({
                                        issueDescription: e.currentTarget.value,
                                      });
                                    }}
                                  />
                                </div>
                              )}
                            </Field>

                            <ErrorMessage
                              name="issueDescription"
                              component="div"
                              className="field-error text-danger"
                            />
                          </FormGroup>
                        </Col>
                        <Col sm="12" md="6">
                          <label htmlFor="priority">Priority</label>
                          <FormGroup>
                            <div className="d-inline-block mr-1">
                              <Radio
                                label="Low"
                                color="primary"
                                name="priority"
                                value="1"
                                checked={priority == 1}
                                onChange={(e) => {
                                  this.setState({
                                    priority: e.target.value,
                                  });
                                }}
                              />
                            </div>
                            <div className="d-inline-block mr-1">
                              <Radio
                                label="Medium"
                                color="warning"
                                name="priority"
                                value="2"
                                checked={priority == 2}
                                onChange={(e) => {
                                  this.setState({
                                    priority: e.target.value,
                                  });
                                }}
                              />
                            </div>
                            <div className="d-inline-block mr-1">
                              <Radio
                                label="High"
                                color="danger"
                                name="priority"
                                value="3"
                                checked={priority == 3}
                                onChange={(e) => {
                                  this.setState({
                                    priority: e.target.value,
                                  });
                                }}
                              />
                            </div>
                            <ErrorMessage
                              name="priority"
                              component="div"
                              className="field-error text-danger"
                            />
                          </FormGroup>
                        </Col>
                        <div>
                          <UnitSelection
                            propertyUnitId={propertyUnitId}
                            passRefUpward={this.getRefsFromChild}
                          />
                        </div>
                      </Row>
                    </CardBody>
                  </Card>{" "}
                  <Card>
                    <CardBody>
                      <CardTitle>Contact Details</CardTitle>
                      <Row>
                        <Col sm="12" md="6">
                          <FormGroup>
                            <label htmlFor="contactName">Contact Name</label>
                            <Field
                              className="form-control"
                              name="contactName"
                              placeholder="Doe"
                              type="text"
                            />
                            <ErrorMessage
                              name="contactName"
                              component="div"
                              className="field-error text-danger"
                            />
                          </FormGroup>
                        </Col>
                        <Col sm="12" md="6">
                          <FormGroup>
                            <label htmlFor="contactEmail">Contact Email</label>
                            <Field
                              className="form-control"
                              name="contactEmail"
                              placeholder="jane@acme.com"
                              type="email"
                            />
                            {/* This will render a string */}
                            <ErrorMessage name="contactEmail">
                              {(msg /** this is the same as the above */) => (
                                <div className="field-error text-danger">
                                  {msg}
                                </div>
                              )}
                            </ErrorMessage>
                          </FormGroup>
                        </Col>{" "}
                        <Col sm="12" md="6">
                          <FormGroup>
                            <label htmlFor="contactMobile">
                              Contact Number
                            </label>
                            <Field
                              className="form-control"
                              name="contactMobile"
                              type="text"
                              placeholder="Phone Number"
                            />
                            <ErrorMessage
                              name="conatctMobile"
                              component="div"
                              className="field-error text-danger"
                            />
                          </FormGroup>
                        </Col>{" "}
                      </Row>
                    </CardBody>
                  </Card>
                  <Card>
                    <CardBody>
                      <CardTitle>Images</CardTitle>
                      <DropZone onDrop={this.onDropFile.bind(this)} />
                      <Row>
                        <Col
                          className="details-page-swiper text-center mt-0"
                          sm="12"
                        >
                          <Swiper {...swiperParams}>
                            {Object.keys(fileList).map((keyName, i) => {
                              return (
                                <Media className="mt-md-1 mt-0" left key={i}>
                                  <Media
                                    className="rounded mr-2"
                                    object
                                    src={fileList[keyName]}
                                    alt="Generic placeholder image"
                                    height="250"
                                    width="290"
                                  />
                                </Media>
                              );
                            })}
                          </Swiper>
                        </Col>
                      </Row>
                      <FormGroup row>
                        <Col md={{ size: 8, offset: 4 }}>
                          <Button.Ripple
                            color="primary"
                            //type="submit"
                            onClick={this.taskUpdateHandler}
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
                            onClick={Helpers.redirectSearch}
                            className="mr-1 mb-1"
                          >
                            <XSquare size={14} />

                            <span className="align-middle ml-25">Cancel</span>
                          </Button.Ripple>

                          {this.state.alert}
                          <ToastContainer />
                        </Col>
                      </FormGroup>
                    </CardBody>
                  </Card>{" "}
                </Col>
              </Row>
            </Form>
          );
        }}
      </Formik>
    );
  }
  taskCategChange = (e) => {
    this.setState({
      taskCategory: e.value,
    });
  };
  createUI() {
    return (
      <div>
        <Swiper {...params}>
          {Object.keys(fileList).map((el, i) => (
            <div
              style={{
                backgroundImage: `url(${fileList[el]})`,
                backgroundSize: "contain",
              }}
            ></div>
          ))}
          ;
        </Swiper>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    taskRedux: state.task,
  };
};
export default connect(mapStateToProps, {
  getTaskById,
})(TaskUpdate);
