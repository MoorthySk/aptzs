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
import "swiper/css/swiper.css";
import Swiper from "react-id-swiper";
import PropTypes from "prop-types";
import UnitSelection from "./UnitSelection";
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
var categoryOptions = [];
class TaskCreate extends React.Component {
  constructor(props) {
    super(props);
    // ...
    this.state = {
      successAlert: true,
      taskType: 1,
      fileList: [],
      selFiles: [],
      value: "",
      propertyUnitId: "",
      contactEmail: "",
      contactMobile: "",
      contactName: "",
      subject: "",
      propertyUnitId: "",
      taskCategory: "",
      issueDescription: "",
      priority: "",
    };
    this.getRefsFromChild = this.getRefsFromChild.bind(this);
    this.taskCreateHandler = this.taskCreateHandler.bind(this);
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

  async taskCreateHandler() {
    /*if(this.state.selFiles && this.state.selFiles.length){
      console.log("selFiles " + this.state.selFiles);     
    }*/
    //console.log("inside task create..."+this.state.taskCategory+"-"+this.state.issueDescription+"-"+this.state.priority);
    const url = "/maint/task/taskcreate/";
    var ress = await LovList.taskCreateUpdate(
      url,
      this.state.selFiles,
      0,
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
  radioMaint = (e) => {
    this.setState({
      taskType: 1,
    });
  };
  radioQuery = (e) => {
    this.setState({
      taskType: 2,
    });
  };

  radioPriority = (e) => {
    //this.state.priority=e.currentTarget.value;
    this.setState({
      priority: e.currentTarget.value,
    });
  };

  async componentDidMount() {
    categoryOptions = await LovList.lovList(appConst.taskCategory);
    console.log(localStorage.getItem("userName"));
    this.setState({
      contactName: localStorage.getItem("userName"),
      contactMobile: localStorage.getItem("userMobile"),
      contactEmail: localStorage.getItem("userEmail"),
    });
    console.log(this.state.contactName);
  }

  render() {
    const {
      getAlert,
      state,
      taskType,
      contactEmail,
      contactMobile,
      contactName,
      subject,
      propertyUnitId,
      taskCategory,
      issueDescription = "",
      priority,
    } = this.state;

    const selectStyles = {
      menu: (base) => ({
        ...base,
        zIndex: 100,
      }),
    };
    return (
      <Formik
        enableReinitialize
        initialValues={{
          contactEmail: contactEmail,
          taskCategory: taskCategory,
          issueDescription: issueDescription,
          contactName: contactName,
          priority: priority,
          contactMobile: contactMobile,
          taskType: taskType,
          subject: subject,
          propertyUnitId: propertyUnitId,
        }}
        validationSchema={formValidation}
        //Onsubmit API Call function start////////////////////////////
        onSubmit={(values, actions) => {
          values.taskCategory = values.taskCategory.value;
          values.propertyUnitId = this.state.propertyUnitId;

          let responseCode = "";

          setTimeout(() => {
            axios({
              method: "POST",
              url: "/maint/task/taskcreate/",

              data: values,
            })
              .then((response) => {
                console.log("Response:::::::::::::" + response.data);

                responseCode = response.data.responseCode;
                console.log("Response Code:::::::::::::" + responseCode);
                if (responseCode == 1000) {
                  this.successMessgae("successAlert", true);
                } else {
                  toast.error("Bad Request");
                }
              })
              .catch((error) => {
                console.log(error);
                toast.error("Bad Request, Please verify your inputs!");
              });
          }, 1000);
        }}
        //Onsubmit API Call function End////////////////////////////
      >
        {(props) => {
          const { setFieldValue } = props;
          return (
            //<Form onSubmit={props.handleSubmit}>
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
                                  checked={taskType === 1}
                                  color="primary"
                                  name="taskType"
                                  onChange={this.radioMaint}
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
                                    checked={taskType === 2}
                                    size="lg"
                                    color="warning"
                                    name="taskType"
                                    onChange={this.radioQuery}
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
                                    value="1"
                                    onChange={() =>
                                      setFieldValue("priority", "1")
                                    }
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
                                styles={selectStyles}
                                name="taskCategory"
                                options={categoryOptions}
                                onChange={(categoryOptions) => {
                                  this.setState({
                                    taskCategory: categoryOptions.value,
                                  });
                                }}
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
                              <Field
                                name="taskCategory"
                                options={categoryOptions}
                                //component={Helpers.SelectField}
                                onChange={(categoryOptions) => {
                                  this.setState({
                                    taskCategory: categoryOptions.value,
                                  });
                                }}
                                isSearchable={true}
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
                              onChange={(e) => {
                                this.setState({
                                  subject: e.currentTarget.value,
                                });
                              }}
                              type="text"
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
                              type="text"
                              onChange={(e) => {
                                this.setState({
                                  issueDescription: e.currentTarget.value,
                                });
                              }}
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
                                onChange={this.radioPriority}
                              />
                            </div>
                            <div className="d-inline-block mr-1">
                              <Radio
                                label="Medium"
                                color="primary"
                                name="priority"
                                value="2"
                                checked={priority == 2}
                                onChange={this.radioPriority}
                              />
                            </div>
                            <div className="d-inline-block mr-1">
                              <Radio
                                label="High"
                                color="primary"
                                name="priority"
                                value="3"
                                checked={priority == 3}
                                onChange={this.radioPriority}
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
                            passRefUpward={this.getRefsFromChild}
                          />
                        </div>
                      </Row>
                    </CardBody>
                    <DropZone onDrop={this.onDropFile.bind(this)} />
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
                      <FormGroup row>
                        <Col md={{ size: 8, offset: 4 }}>
                          <Button.Ripple
                            color="primary"
                            //type="submit"
                            onClick={this.taskCreateHandler}
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
                  </Card>
                </Col>
              </Row>
            </Form>
          );
        }}
      </Formik>
    );
  }
}
DropZone.propTypes = {
  fileList: PropTypes.array.isRequired,
};
export default TaskCreate;
