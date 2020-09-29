import React from "react";
import { Formik, Field, ErrorMessage, Form } from "formik";
import { green, orange } from "@material-ui/core/colors";
import { CheckSquare, XSquare } from "react-feather";
import { history } from "../../../history";
import {
  Card,
  CardBody,
  Row,
  Col,
  Button,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  ListGroup,
  ListGroupItem,
  CardHeader,
  CardTitle,
  FormGroup,
  Table,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Modal,
  Input,
  Label,
} from "reactstrap";
import {
  Star,
  Truck,
  DollarSign,
  ShoppingCart,
  Heart,
  Facebook,
  Twitter,
  Youtube,
  Instagram,
  Award,
  Clock,
  Shield,
  Plus,
  AlertCircle,
  Check,
  User,
  UserCheck,
  Users,
} from "react-feather";
import {
  AssignmentTurnedInRounded,
  EventAvailable,
  Description,
  Update,
  Work,
  CheckCircle,
  AddCircle,
  WorkOff,
  Apartment,
  Home,
  RecentActors,
  Edit,
  Email,
} from "@material-ui/icons";
import LovList from "../../common/Helpers";
import * as appConst from "../../../utility/Constants";
import Select from "react-select";
import Swiper from "react-id-swiper";
import img1 from "../../../assets/img/slider/banner-31.jpg";
import img2 from "../../../assets/img/slider/banner-22.jpg";
import img3 from "../../../assets/img/slider/banner-23.jpg";
import img4 from "../../../assets/img/slider/banner-24.jpg";
import img5 from "../../../assets/img/slider/banner-25.jpg";
import "swiper/css/swiper.css";
import "../../../assets/scss/plugins/extensions/swiper.scss";
import Breacrumbs from "../../@vuexy/breadCrumbs/BreadCrumb";
import classnames from "classnames";
import macbook from "../../../assets/img/elements/macbook-pro.png";
import axios from "axios";
import moment from "moment";
import "swiper/css/swiper.css";
import "../../../assets/scss/pages/app-ecommerce-shop.scss";
import Helpers from "../Helpers";
import { getSummary } from "../../../redux/actions/maintanance/task/index";
import { connect } from "react-redux";
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
const ModalConfig = [
  {
    id: 5,
    btnTitle: "Update",
    modalTitle: "Update Task",
    modalClass: "modal-lg",
    bgColor: "bg-primary",
  },
];
const staffOption = [
  { value: "Staff 1", label: "Sk" },
  { value: "Bk", label: "Bk" },
  { value: "Surya", label: "Surya" },
  { value: "Moorthy", label: "Moorthy" },
  { value: "Sankar", label: "Sankar" },
];

class Summary extends React.Component {
  state = {
    selectedColor: 1,
    activeTab: "1",
    active: "1",
    taskList: [],
    tasks: [
      {
        taskType: "",
        issueDescription: "",
        taskCreationDate: "",
        ceatedBy: "",
      },
    ],
    taskId: this.props.taskId,
    vendorName: "",
    vendorMobile: "",
    vendorEmail: "",
    userList: [],
    firstName: "",
    emailId: "",
    mobileNo: "",
    userData: [],
    userId: "",
    assignedId: "",
    emailId: "",
    taskTimeLine: [],
  };
  toggleSelectedColor = (color) => this.setState({ selectedColor: color });

  async componentDidMount() {
    this.state.taskList = await LovList.lovList(appConst.taskStatus);
    this.state.userList = await LovList.userList();

    let res = "";
    let taskList = [];

    await this.props
      .getSummary(this.state.taskId)
      .then(() => {
        res = this.props.taskRedux.taskDataById;
        taskList = this.props.taskRedux.taskTimeLine;

        this.setState({
          contactName: res.contactName,
          contactEmail: res.contactEmail,
          contactMobile: res.contactMobile,
          createdDate: moment(res.createdDate).format("MM-DD-YYYY"),
          issueDescription: res.issueDescription,
          priority: res.priority,
          subject: res.subject,
          taskCategory: res.taskCategory,
          taskHdrId: res.taskHdrId,
          taskHdrStatus: res.taskStatus,
          taskType: res.taskType,
          propertyName: res.propertyName,
          unitName: res.unitName,
          unitNo: res.unitNo,
          assignedId: res.assignedId,
        });

        if (taskList) {
          console.log("inside if " + this.state.taskList.length);
          for (var i = 0; i < taskList.length; i++) {
            console.log("taskList[i] " + taskList[i].taskStatus);
            this.state.taskStatus = taskList[i].taskStatus;
            this.state.assignedUser = taskList[i].assignedTo;
            const parsedDueDate = moment(taskList[i].dueDate).format(
              "MM-DD-YYYY"
            );
            this.state.dueDate = parsedDueDate;
            const createDate = moment(taskList[i].createdDate).format(
              "MM-DD-YYYY"
            );
            var dueDateFinal = moment(
              taskList[taskList.length - 1].dueDate
            ).format("YYYY-MM-DD");

            this.setState((prevState) => ({
              tasks: [
                ...prevState.tasks,
                {
                  taskType: taskList[i].taskStatus,
                  issueDescription: taskList[i].taskRemarks,
                  ceatedBy: taskList[i].ceatedBy,
                  taskCreationDate: createDate,
                },
              ],
              taskHdrStatus: taskList[taskList.length - 1].taskStatus,
              taskRemarks: taskList[taskList.length - 1].taskRemarks,
              dueDate: dueDateFinal,
              dueDateFinal: moment(
                taskList[taskList.length - 1].dueDate
              ).format("MM-DD-YYYY"),
            }));
          }
        }
      })
      .catch((error) => {
        console.log("error:::" + error);
      });

    this.state.userData = await LovList.userListById(this.state.assignedId);
    this.setState({
      firstName: this.state.userData.firstName,
      emailId: this.state.userData.emailId,
      mobileNo: this.state.userData.mobileNo,
    });
    console.log("this.state.userData::" + this.state.userData.firstName);

    await axios
      .post("/maint/vendor/task-vendor-byid/", {
        vendorId: this.state.taskId,
      })

      .then((response) => {
        console.log("Response:::::::::::::" + response.data);
        try {
          let res = response.data.vendorDetails;
          console.log("rowData:::::::::::::" + response.data.responseMsg);
          this.setState({
            vendorName: res.vendorName,
            vendorMobile: res.vendorMobile,
            vendorEmail: res.vendorEmail,
          });
        } catch (e) {
          console.log(e);
        }
      });
  }
  handleSubmit = (event) => {
    event.preventDefault();

    axios
      .post("/admin/user/user-byid/", {
        userId: event.target.elements.assignedId.value,
      })
      .then((response) => {
        try {
          var data = response.data.user;
          this.setState({
            firstName: data.firstName,
            emailId: data.emailId,
            mobileNo: data.mobileNo,
          });
        } catch (e) {
          console.log(e);
        }
      });

    this.setState({
      taskStatus: event.target.elements.taskStatus.value,
      assignedUser: event.target.elements.assignedId.value,
      dueDate: event.target.elements.dueDate.value,

      firstName: this.state.userData.firstName,
      emailId: this.state.userData.emailId,
      mobileNo: this.state.userData.mobileNo,

      modal: null,
    });

    var requestId = this.props.requestId;
    let mess = "";
    let taskList = "";
    console.log("maintenance Id:" + requestId);

    axios
      .post("/maint/create-task/", {
        taskHdrId: this.props.taskId,
        taskStatus: event.target.elements.taskStatus.value,
        taskRemarks: event.target.elements.taskRemarks.value,
        assignedTo: event.target.elements.assignedId.value,
        dueDate: event.target.elements.dueDate.value,
      })
      .then((response) => {
        console.log("Response:::::::::::::" + response.data);
        taskList = response.data.taskDtl;

        this.removeAll();
        for (var i = 0; i < taskList.length; i++) {
          this.state.taskStatus = taskList[i].taskStatus;
          this.state.assignedUser = taskList[i].assignedTo;
          const parsedDueDate = moment(taskList[i].dueDate).format(
            "MM-DD-YYYY "
          );
          this.state.dueDate = parsedDueDate;
          const createDate = moment(taskList[i].createdDate).format(
            "MM-DD-YYYY"
          );
          var dueDateFinal = moment(
            taskList[taskList.length - 1].dueDate
          ).format("YYYY-MM-DD");

          this.setState((prevState) => ({
            tasks: [
              ...prevState.tasks,
              {
                taskType: taskList[i].taskStatus,
                issueDescription: taskList[i].taskRemarks,
                ceatedBy: taskList[i].ceatedBy,
                taskCreationDate: createDate,
              },
            ],
            taskHdrStatus: taskList[taskList.length - 1].taskStatus,
            taskRemarks: taskList[taskList.length - 1].taskRemarks,

            dueDate: dueDateFinal,
            dueDateFinal: moment(taskList[taskList.length - 1].dueDate).format(
              "MM-DD-YYYY"
            ),
          }));
        }
      });
    console.log("this.state.taskHdrStatus " + this.state.taskHdrStatus);
    axios
      .post("/maint/task/maint-status-update/", {
        taskHdrId: this.props.taskId,
        taskStatus: event.target.elements.taskStatus.value,
        assignedId: event.target.elements.assignedId.value,
      })
      .then((response) => {
        console.log("Response:::::::::::::" + response.data);
      });
  };
  handleStatusChange = (e) => {
    console.log("selectedOption" + e.value);
    this.setState({ taskStatus: e.value });
  };
  handleStaffChange = (e) => {
    console.log("selectedOption" + e.value);
    this.setState({ assignedId: e.value });
  };
  handleremarks = (e) => {
    this.setState({ taskRemarks: e.value });
  };
  handleremarks = (e) => {
    this.setState({ taskRemarks: e.value });
  };
  removeAll() {
    let tasks = [...this.state.tasks];
    tasks.splice(0, tasks.length);
    this.setState({ tasks });
    //this.state.noOfUnits=users.length;
  }
  render() {
    const {
      selectedOption,
      taskList,
      taskStatus,
      taskRemarks,
      dueDate,
      dueDateFinal,
      priority,
      assignedTo,
      contactName,
      contactEmail,
      contactMobile,
      unitNo,
      propertyName,
      unitName,
      vendorEmail,
      vendorMobile,
      vendorName,
      userList,
      firstName,
      mobileNo,
      emailId,
      selectedStaffOption,
      assignedId,
    } = this.state;

    const renderModal = ModalConfig.map((item) => {
      return (
        <React.Fragment key={item.id}>
          <div className="d-inline-block mr-1 mb-1">
            <Button.Ripple
              className="mr-1 mb-1"
              color="primary"
              onClick={() => this.toggleModal(item.id)}
              key={item.title}
            >
              <Update size={15} />
              <span className="align-middle ml-25">Update</span>
            </Button.Ripple>

            <Button.Ripple
              className=" mr-1 mb-1"
              color="danger"
              outline
              onClick={() => history.push("/taskUpdate/" + this.state.taskId)}
            >
              <Edit size={15} />
              <span className="align-middle ml-50">Edit Task</span>
            </Button.Ripple>
            <Button.Ripple
              color="danger"
              onClick={Helpers.handleCancel}
              className="mr-1 mb-1"
            >
              <XSquare size={15} />

              <span className="align-middle ml-25">Cancel</span>
            </Button.Ripple>
          </div>
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
                  taskRemarks: taskRemarks,
                  dueDate: dueDate,
                  dueDateFinal: dueDateFinal,
                  priority: priority,
                }}
              >
                {(props) => {
                  const { setFieldValue, errors, touched } = props;
                  return (
                    <Form onSubmit={this.handleSubmit}>
                      <Row>
                        <Col sm="12">
                          <Card>
                            <CardBody>
                              <Col md="12" sm="12">
                                <label>Applicant Status</label>

                                <FormGroup>
                                  <Select
                                    name="taskStatus"
                                    onChange={this.handleStatusChange}
                                    options={taskList}
                                    value={taskList.find(
                                      (obj) => obj.label === taskStatus || ""
                                    )}
                                  />
                                </FormGroup>
                              </Col>
                              <Col md="12" sm="12">
                                <label htmlFor="mangeNotes">Remarks</label>
                                <FormGroup>
                                  <Field
                                    name="taskRemarks"
                                    className="form-control"
                                    placeholder="Doe"
                                  >
                                    {({
                                      field,
                                      form: { touched, errors },
                                      meta,
                                    }) => (
                                      <div>
                                        <Input
                                          type="textarea"
                                          placeholder="Remarks"
                                          {...field}
                                        />
                                      </div>
                                    )}
                                  </Field>
                                </FormGroup>
                              </Col>
                              <Col md="12" sm="12">
                                <label>Assigned to</label>

                                <FormGroup>
                                  <Select
                                    className="React"
                                    onChange={this.handleStaffChange}
                                    name="assignedId"
                                    options={userList}
                                    value={userList.find(
                                      (obj) => obj.value === assignedId
                                    )}
                                  />
                                </FormGroup>
                              </Col>
                              <Col sm="12">
                                <label htmlFor="leaseEndDate">Due Date</label>
                                <FormGroup>
                                  <Field
                                    className="form-control"
                                    name="dueDate"
                                    type="date"
                                  />
                                </FormGroup>
                              </Col>
                              <Button.Ripple
                                className="mr-1 mb-1"
                                color="primary"
                                type="submit"
                              >
                                <Update size={15} /> Update
                              </Button.Ripple>
                            </CardBody>
                          </Card>
                        </Col>
                      </Row>
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
      <React.Fragment>
        <Breacrumbs
          breadCrumbTitle="Maintanance"
          breadCrumbParent="Task"
          breadCrumbActive="Task Summary"
        />
        <Card className="overflow-hidden app-ecommerce-details">
          <CardBody className="pb-0">
            <Row className="mb-5 mt-2">
              <Col
                className="d-flex align-items-center justify-content-center mb-0 mb-md-0"
                sm="12"
                md="5"
              >
                <Swiper {...params}>
                  <div
                    style={{
                      backgroundImage: `url(${img1})`,
                      backgroundSize: "contain",
                    }}
                  ></div>
                  <div
                    style={{
                      backgroundImage: `url(${img2})`,
                      backgroundSize: "contain",
                    }}
                  ></div>
                  <div
                    style={{
                      backgroundImage: `url(${img3})`,
                      backgroundSize: "contain",
                    }}
                  ></div>
                  <div
                    style={{
                      backgroundImage: `url(${img4})`,
                      backgroundSize: "contain",
                    }}
                  ></div>
                  <div
                    style={{
                      backgroundImage: `url(${img5})`,
                      backgroundSize: "contain",
                    }}
                  ></div>
                </Swiper>
              </Col>
              <Col md="7" sm="12">
                <h4>{this.state.subject}</h4>
                <p className="text-muted">
                  Task Category : {this.state.taskCategory}
                </p>
                <div className="d-flex flex-wrap">
                  <h3 className="text-primary mb-50"> Priority</h3>

                  <div className="ratings border-left ml-1 pl-1">
                    <div>
                      {(() => {
                        switch (priority) {
                          case 1:
                            return (
                              <div>
                                <Star
                                  size={20}
                                  fill="#ff9f43"
                                  stroke="#ff9f43"
                                />
                                <Star size={20} fill="#fff" stroke="#b8c2cc" />
                                <Star size={20} fill="#fff" stroke="#b8c2cc" />
                                <Star size={20} fill="#fff" stroke="#b8c2cc" />
                                <span className="ml-1 font-medium-1 text-dark align-middle">
                                  Low
                                </span>{" "}
                              </div>
                            );
                          case 2:
                            return (
                              <div>
                                <Star
                                  size={20}
                                  fill="#ff9f43"
                                  stroke="#ff9f43"
                                />
                                <Star
                                  size={20}
                                  fill="#ff9f43"
                                  stroke="#ff9f43"
                                />
                                <Star size={20} fill="#fff" stroke="#b8c2cc" />
                                <Star size={20} fill="#fff" stroke="#b8c2cc" />
                                <span className="ml-1 font-medium-1 text-dark align-middle">
                                  Medium
                                </span>{" "}
                              </div>
                            );
                          case 3:
                            return (
                              <div>
                                <Star
                                  size={20}
                                  fill="#ff9f43"
                                  stroke="#ff9f43"
                                />
                                <Star
                                  size={20}
                                  fill="#ff9f43"
                                  stroke="#ff9f43"
                                />
                                <Star
                                  size={20}
                                  fill="#ff9f43"
                                  stroke="#ff9f43"
                                />
                                <Star size={20} fill="#fff" stroke="#b8c2cc" />
                                <span className="ml-1 font-medium-1 text-dark align-middle">
                                  High
                                </span>{" "}
                              </div>
                            );
                          case 4:
                            return (
                              <div>
                                <Star
                                  size={20}
                                  fill="#ff9f43"
                                  stroke="#ff9f43"
                                />
                                <Star
                                  size={20}
                                  fill="#ff9f43"
                                  stroke="#ff9f43"
                                />
                                <Star
                                  size={20}
                                  fill="#ff9f43"
                                  stroke="#ff9f43"
                                />
                                <Star
                                  size={20}
                                  fill="#ff9f43"
                                  stroke="#ff9f43"
                                />
                                <span className="ml-1 font-medium-1 text-dark align-middle">
                                  Critical
                                </span>{" "}
                              </div>
                            );
                          default:
                            return "";
                        }
                      })()}
                    </div>
                  </div>
                </div>
                <hr />
                <div>
                  <Description color="primary" />
                  <span className="align-middle font-weight-bold ml-50">
                    Description :
                  </span>
                  &nbsp;&nbsp;&nbsp;{this.state.issueDescription}
                </div>
                <hr />
                <ul className="list-unstyled">
                  {" "}
                  <li className="mb-50">
                    <span className="align-middle font-weight-bold ">
                      <Row>
                        <Col sm="4">
                          <AssignmentTurnedInRounded color="primary" />
                          Task Id :
                        </Col>
                        <Col sm="8">{this.state.taskHdrId}</Col>
                      </Row>
                    </span>
                  </li>
                  <li className="mb-50">
                    <span className="align-middle font-weight-bold ">
                      <Row>
                        <Col sm="4">
                          <EventAvailable color="primary" />
                          Created Date :
                        </Col>
                        <Col sm="8">{this.state.createdDate}</Col>
                      </Row>
                    </span>
                  </li>
                  <li className="mb-50">
                    <span className="align-middle font-weight-bold ">
                      <Row>
                        <Col sm="4">
                          <EventAvailable color="primary" />
                          Due Date :
                        </Col>
                        <Col sm="8">{dueDateFinal}</Col>
                      </Row>
                    </span>
                  </li>
                </ul>
                <hr />
                <ul className="list-unstyled">
                  <li className="mb-50">
                    <span className="align-middle font-weight-bold ">
                      <Row>
                        <Col sm="4">
                          <Apartment style={{ color: green[500] }} />
                          Property Name:
                        </Col>
                        <Col sm="8">{propertyName}</Col>
                      </Row>
                    </span>
                  </li>
                  <li className="mb-50">
                    <span className="align-middle font-weight-bold ">
                      <Row>
                        <Col sm="4">
                          <Home style={{ color: green[500] }} />
                          Unit Name :
                        </Col>
                        <Col sm="8">{unitName}</Col>
                      </Row>
                    </span>
                  </li>
                  <li className="mb-50">
                    <span className="align-middle font-weight-bold ">
                      <Row>
                        <Col sm="4">
                          <RecentActors style={{ color: green[500] }} />
                          Unit Id :
                        </Col>
                        <Col sm="8">{unitNo}</Col>
                      </Row>
                    </span>
                  </li>
                </ul>
                <hr />
                <h5>Task Status</h5>
                {this.state.taskHdrStatus == "New" && (
                  <div>
                    <div
                      className={classnames(
                        "color-radio color-radio-success mr-25",
                        {
                          selected: true,
                        }
                      )}
                    >
                      <div className="radio-content"> </div>
                    </div>{" "}
                    <span className="align-top font-weight-bold ml-50">
                      New
                    </span>
                  </div>
                )}
                {this.state.taskHdrStatus == "In Progress" && (
                  <div>
                    <div
                      className={classnames(
                        "color-radio color-radio-warning mr-25",
                        {
                          selected: true,
                        }
                      )}
                    >
                      <div className="radio-content"> </div>
                    </div>{" "}
                    <span className="align-top font-weight-bold ml-50">
                      In Progress
                    </span>
                  </div>
                )}
                {this.state.taskHdrStatus == "Hold" && (
                  <div>
                    <div
                      className={classnames(
                        "color-radio color-radio-danger mr-25",
                        {
                          selected: true,
                        }
                      )}
                    >
                      <div className="radio-content"> </div>
                    </div>{" "}
                    <span className="align-top font-weight-bold ml-50">
                      Hold
                    </span>
                  </div>
                )}
                {this.state.taskHdrStatus == "Closed" && (
                  <div>
                    <div
                      className={classnames(
                        "color-radio color-radio-success mr-25",
                        {
                          selected: true,
                        }
                      )}
                    >
                      <div className="radio-content"> </div>
                    </div>{" "}
                    <span className="align-top font-weight-bold ml-50">
                      Closed
                    </span>
                  </div>
                )}{" "}
                {this.state.taskHdrStatus == "New1" && (
                  <div
                    className={classnames(
                      "color-radio color-radio-warning mr-50",
                      {
                        selected: this.state.selectedColor === 5,
                      }
                    )}
                    onClick={() => this.toggleSelectedColor(5)}
                  >
                    <div className="radio-content"></div>
                  </div>
                )}
                {this.state.taskHdrStatus == "New1" && (
                  <div
                    className={classnames("color-radio color-radio-dark", {
                      selected: this.state.selectedColor === 6,
                    })}
                    onClick={() => this.toggleSelectedColor(6)}
                  >
                    <div className="radio-content"></div>
                  </div>
                )}
                <hr />
                <div className="action-btns">
                  <TabContent activeTab={this.state.activeTab}>
                    <TabPane tabId="1">{renderModal}</TabPane>
                  </TabContent>
                </div>
              </Col>
            </Row>
          </CardBody>
          <Row>
            <Col sm="12">
              <Row className="item-features py-2 mt-2">
                <Col className="text-center" md="4" sm="12">
                  <div className="w-50 mx-auto">
                    <User className="text-primary mb-1" size={42} />
                    <p className="font-medium-2 text-bold-600 mb-0">
                      Requested By
                    </p>
                    <p className="font-medium-2 text-bold-600 mb-0">
                      {contactName}
                    </p>
                    <p className=" mb-0">{contactEmail}</p>
                    <p>{contactMobile}</p>
                  </div>
                </Col>
                <Col className="text-center" md="4" sm="12">
                  <div className="w-50 mx-auto">
                    <UserCheck className="text-primary mb-1" size={42} />
                    <p className="font-medium-2 text-bold-600 mb-0">
                      Assigned To
                    </p>

                    <p className="font-medium-2 text-bold-600 mb-0">
                      {firstName}
                    </p>
                    <p className=" mb-0">{emailId}</p>
                    <p>{mobileNo}</p>
                  </div>
                </Col>
                <Col className="text-center" md="4" sm="12">
                  <div className="w-50 mx-auto">
                    <Users className="text-primary mb-1" size={42} />
                    <p className="font-medium-2 text-bold-600 mb-0">
                      Work Order
                    </p>
                    <p className="font-medium-2 text-bold-600 mb-0">
                      {vendorName}
                    </p>
                    <p className=" mb-0">{vendorEmail}</p>
                    <p>{vendorMobile}</p>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Task Timeline</CardTitle>
          </CardHeader>
          <CardBody>
            <ul className="activity-timeline timeline-left list-unstyled">
              {this.createUI()}
            </ul>
          </CardBody>
        </Card>
      </React.Fragment>
    );
  }
  createUI() {
    return this.state.tasks.map((el, i) => (
      // <div key={i}>

      <li key={i}>
        <div className="timeline-icon ">
          {(() => {
            switch (el.taskType) {
              case "New":
                return (
                  <AddCircle style={{ fontSize: 36, color: green[500] }} />
                );
              case "In Progress":
                return <Work style={{ fontSize: 36, color: orange[500] }} />;
              case "Hold":
                return <WorkOff color="secondary" style={{ fontSize: 36 }} />;
              case "Closed":
                return (
                  <CheckCircle style={{ color: green[500], fontSize: 36 }} />
                );
              default:
                return "";
            }
          })()}
        </div>
        <div className="timeline-info">
          <p className="font-weight-bold">{el.taskType}</p>
          <span>{el.issueDescription}</span>
        </div>
        <small className=""> {el.ceatedBy}</small>
        <br />
        <small className=""> {el.taskCreationDate}</small>
      </li>
      // </div>
    ));
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
}

const mapStateToProps = (state) => {
  return {
    taskRedux: state.task,
  };
};
export default connect(mapStateToProps, {
  getSummary,
})(Summary);
