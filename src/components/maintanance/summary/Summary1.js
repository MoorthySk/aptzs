import React from "react";
import { Formik, Field, ErrorMessage, Form } from "formik";
import axios from "axios";
import { Spinner } from "reactstrap";
import {
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Row,
  Col,
  CardBody,
  ListGroup,
  ListGroupItem,
  Card,
  CardHeader,
  CardTitle,
  FormGroup,
  Button,
  Table,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Modal,
  Input,
} from "reactstrap";
import StatisticsCard from "../../../components/@vuexy/statisticsCard/StatisticsCard";
import StatisticsCardCol from "../../../components/@vuexy/statisticsCard/StatisticsCardCol";
import Select from "react-select";
import moment from "moment";
import {
  BugReportSharp,
  Person,
  SupervisedUserCircle,
  EventAvailable,
  Beenhere,
  NoteAdd,
} from "@material-ui/icons";
import { green } from "@material-ui/core/colors";
import { Plus, AlertCircle, Check } from "react-feather";
const ModalConfig = [
  {
    id: 5,
    btnTitle: "Update",
    modalTitle: "Update Task",
    modalClass: "modal-lg",
    bgColor: "bg-primary",
  },
];
const taskList = [
  { value: "New", label: "New" },
  { value: "In progress", label: "In progress" },
  { value: "Completed", label: "Completed" },
  { value: "Closed", label: "Closed" },
];
const staffOption = [
  { value: "Staff 1", label: "Sk" },
  { value: "Bk", label: "Bk" },
  { value: "Surya", label: "Surya" },
  { value: "Moorthy", label: "Moorthy" },
  { value: "Sankar", label: "Sankar" },
];
class Summary extends React.Component {
  /*state = {
    activeTab: "1",
    active: "1",
    selectedOption: null,
    selectedStaffOption: null,
    assignedUser: null,
    taskStatus: null,
    dueDate: null,
  };*/

  constructor(props) {
    super(props);
    this.state = {
      activeTab: "1",
      active: "1",
      selectedOption: null,
      selectedStaffOption: null,
      assignedUser: null,
      taskStatus: null,
      dueDate: null,
      tasks: [
        {
          taskType: "",
          issueDescription: "",
          taskCreationDate: "",
        },
      ],
    };

    this.removeAll = this.removeAll.bind(this);
  }

  createUI() {
    return this.state.tasks.map((el, i) => (
      // <div key={i}>

      <li key={i}>
        <div className="timeline-icon bg-primary">
          {(() => {
            switch (el.taskType) {
              case "Task Created":
                return <Plus size="18" />;
              case "New":
                return <Plus size="18" />;
              case "In progress":
                return <AlertCircle size="18" />;
              case "Completed":
                return <Check size="18" />;
              case "Closed":
                return <Check size="18" />;
              default:
                return "";
            }
          })()}
        </div>
        <div className="timeline-info">
          <p className="font-weight-bold">{el.taskType}</p>
          <span>{el.issueDescription}</span>
        </div>
        <small className="">{el.taskCreationDate}</small>
      </li>
      // </div>
    ));
  }

  staffData = (assignedId) => {
    this.assignedId = assignedId;

    this.setState((prevState) => ({
      modal: !prevState.modal,
    }));

    axios
      .post("/manag/employee/search/empid", {
        empId: assignedId,
      })

      .then((response) => {
        var ress = response.data.empSearch;
        console.log(ress);
        this.setState({
          assignedId: ress.empId,
          employeePhone: ress.employeeEmail,
          employeeName: ress.employeeName,
          employeeEmail: ress.employeePhone,
        });
      });
  };
  async componentDidMount() {
    var requestId = this.props.requestId;
    let mess = "";
    let taskList = "";
    const options = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
    };
    await axios
      .post(
        "/tenant/maint/preEdit/",
        {
          maintId: requestId,
        },
        options
      )

      .then((response) => {
        mess = response.data.maintReq;
        taskList = response.data.taskDtl;

        this.setState({
          contactPersonName: mess.contactPersonName,
          contactPersonEmail: mess.contactPersonEmail,
          issueType: mess.issueType,
          issueDesc: mess.issueDesc,
          priority: mess.priority,
          contactPersonNumber: mess.contactPersonNumber,
          maintId: mess.maintId,
          mangRemarks: mess.mangRemarks,
          assignedId: mess.assignedId,
          meterialCost: mess.meterialCost,
          laborCost: mess.laborCost,
          requestStatus: mess.requestStatus,
          taskCreatedDate: mess.createdDate,
          taskStatus: "",
        });

        if (taskList) {
          for (var i = 0; i < taskList.length; i++) {
            this.state.taskStatus = taskList[i].taskStatus;
            this.state.assignedUser = taskList[i].assignedTo;
            const parsedDueDate = moment(taskList[i].dueDate).format(
              "MM-DD-YYYY"
            );
            this.state.dueDate = parsedDueDate;
            const createDate = moment(taskList[i].createdDate).format(
              "MM-DD-YYYY"
            );
            this.setState((prevState) => ({
              tasks: [
                ...prevState.tasks,
                {
                  taskType: taskList[i].taskStatus,
                  issueDescription: taskList[i].taskRemarks,
                  taskCreationDate: createDate,
                },
              ],
            }));
          }
        }
      });
    await axios({
      method: "POST",
      url: "/manag/employee/search/",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
    }).then((response) => {
      console.log("Response:::::::::::::" + response.data);
      try {
        let rowData = response.data.employeeRequest;
        console.log("rowData:::::::::::::" + response.data.responseMsg);
        this.setState({ rowData });
      } catch (e) {
        console.log(e);
      }
    });

    this.staffData(mess.assignedId);

    /*for(var i=0;i<3;i++){
      this.setState((prevState) => ({
        tasks: [
          ...prevState.tasks,
          {
            taskType: "Task Completed",
            issueDescription: "electrician called",
            taskCreationDate: "06-12-2020",
          },  ``
        ],
      }));
    }*/
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

  removeAll() {
    let tasks = [...this.state.tasks];
    tasks.splice(0, tasks.length);
    this.setState({ tasks });
    //this.state.noOfUnits=users.length;
  }

  handleSubmit = (event) => {
    event.preventDefault();
    console.log("Date :" + event.target.elements.dueDate.value);
    this.setState({
      taskStatus: event.target.elements.selectedOption.value,
      assignedUser: event.target.elements.selectedStaffOption.value,
      dueDate: event.target.elements.dueDate.value,
      modal: null,
    });

    var requestId = this.props.requestId;
    let mess = "";
    let taskList = "";
    console.log("maintenance Id:" + requestId);

    axios
      .post("/maint/create-task/", {
        maintId: requestId,
        taskStatus: event.target.elements.selectedOption.value,
        taskRemarks: event.target.elements.taskRemarks.value,
        assignedTo: event.target.elements.selectedStaffOption.value,
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
            "MM-DD-YYYY"
          );
          this.state.dueDate = parsedDueDate;
          const createDate = moment(taskList[i].createdDate).format(
            "MM-DD-YYYY"
          );
          this.setState((prevState) => ({
            tasks: [
              ...prevState.tasks,
              {
                taskType: taskList[i].taskStatus,
                issueDescription: taskList[i].taskRemarks,
                taskCreationDate: createDate,
              },
            ],
          }));
        }
      });
  };

  handleStatusChange = (selectedOption) => {
    this.setState({ selectedOption });
  };
  handleStaffChange = (selectedStaffOption) => {
    this.setState({ selectedStaffOption });
  };
  render() {
    let option = [];
    let marked = this.state.values;

    const {
      contactPersonName = "",
      contactPersonEmail = "",
      issueType = "",
      issueDesc = "",
      contactPersonNumber = "",
      priority = "",
      maintId = "",
      mangRemarks = "",
      employeePhone = "",
      employeeEmail = "",
      employeeName = "",
      assignedId = "",
      laborCost = "",
      meterialCost = "",
      requestStatus = "",
      rowData,
      columnDefs,
      defaultColDef,
      pageSize,
      taskStatus = "",
      assignedUser,
      selectedOption,
      selectedStaffOption,
      dueDate,
      taskCreatedDate,
    } = this.state;
    const renderModal = ModalConfig.map((item) => {
      return (
        <React.Fragment key={item.id}>
          <div className="d-inline-block mr-1 mb-1">
            <Button.Ripple
              color="warning"
              onClick={() => this.toggleModal(item.id)}
              key={item.title}
              outline
            >
              {item.btnTitle}
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
              <Form onSubmit={this.handleSubmit}>
                <Row>
                  <Col sm="12">
                    <Card>
                      <CardBody>
                        <Col md="12" sm="12">
                          <label>Applicant Status</label>

                          <FormGroup>
                            <Select
                              value={selectedOption}
                              name="selectedOption"
                              onChange={this.handleStatusChange}
                              options={taskList}
                            />
                          </FormGroup>
                        </Col>
                        <Col md="12" sm="12">
                          <label htmlFor="mangeNotes">Remarks</label>
                          <FormGroup>
                            <Input
                              type="textarea"
                              name="taskRemarks"
                              rows="3"
                            />
                          </FormGroup>
                        </Col>
                        <Col md="12" sm="12">
                          <label>Assigned to</label>

                          <FormGroup>
                            <Select
                              className="React"
                              onChange={this.handleStaffChange}
                              name="selectedStaffOption"
                              options={staffOption}
                            />
                          </FormGroup>
                        </Col>
                        <Col sm="12">
                          <label htmlFor="leaseEndDate">Due Date</label>
                          <FormGroup>
                            <Input
                              className="form-control"
                              name="dueDate"
                              type="date"
                            />
                          </FormGroup>
                        </Col>
                        <Button type="submit">Update</Button>{" "}
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              </Form>
            </ModalBody>
          </Modal>
        </React.Fragment>
      );
    });
    return (
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
          assignedId: assignedId,
          employeePhone: "",
          employeeEmail: "",
          mangRemarks: mangRemarks,
          employeeName: "",
          laborCost: laborCost,
          meterialCost: meterialCost,
          requestStatus: requestStatus,
          assignedUser: assignedUser,
          dueDate: dueDate,
          taskCreatedDate: taskCreatedDate,
        }}
        //Onsubmit API Call function start////////////////////////////

        onSubmit={(values, actions) => {
          let responseCode = "";

          setTimeout(() => {
            axios({
              method: "POST",
              url: "/tenant/maint/update/",
              headers: {
                Authorization: "Bearer " + localStorage.getItem("accessToken"),
              },
              data: values,
            })
              .then((response) => {
                console.log("Response:::::::::::::" + response.data);

                responseCode = response.data.responseCode;
                console.log("Response Code:::::::::::::" + responseCode);
                if ((responseCode = 1000)) {
                  this.successMessage("successAlert", true);
                  actions.setSubmitting(false);
                } else {
                }
              })
              .catch((error) => {
                console.log(error);
              });
          }, 1000);
        }}
        //Onsubmit API Call function End////////////////////////////
      >
        {(props) => {
          const { setFieldValue, errors, touched } = props;
          // let issueType1 = <Spinner type="grow" color="primary" /> + issueType;
          return (
            //Form Start////////////////////////////

            <Form onSubmit={props.handleSubmit}>
              <Row>
                <Col lg="12" sm="12">
                  <StatisticsCardCol
                    hideChart
                    iconLeft
                    iconBg="warning"
                    icon={
                      <BugReportSharp
                        className="warning"
                        style={{ fontSize: 30 }}
                      />
                    }
                    stat={issueType}
                    //stat="Power Issue"
                    statTitle={"Description: " + issueDesc}
                  />
                </Col>

                <Col xl="4" lg="6" sm="6">
                  {" "}
                  <div>
                    <StatisticsCardCol
                      iconLeft
                      hideChart
                      iconBg="primary"
                      icon={
                        <Person style={{ color: green[500], fontSize: 40 }} />
                      }
                      stat={taskStatus}
                      statTitle="Status"
                    />
                  </div>
                </Col>
                <Col xl="4" lg="6" sm="6">
                  {" "}
                  <div>
                    <StatisticsCardCol
                      hideChart
                      iconBg="primary"
                      icon={
                        <SupervisedUserCircle
                          color="primary"
                          style={{ fontSize: 40 }}
                        />
                      }
                      stat={assignedUser ? assignedUser : "-"}
                      statTitle="Assigned To"
                    />
                  </div>
                </Col>
                <Col xl="4" lg="6" sm="6">
                  {" "}
                  <div>
                    <StatisticsCardCol
                      hideChart
                      iconBg="primary"
                      icon={
                        <EventAvailable
                          color="secondary"
                          style={{ fontSize: 40 }}
                        />
                      }
                      stat={dueDate ? dueDate : "-"}
                      statTitle="Due Date"
                    />
                  </div>
                </Col>
              </Row>
              <Card>
                <CardBody>
                  <Col md="6" sm="12">
                    <Card>
                      <Col md="12" sm="12">
                        <TabContent activeTab={this.state.activeTab}>
                          <TabPane tabId="1">{renderModal}</TabPane>
                        </TabContent>
                      </Col>
                      <CardHeader>
                        <CardTitle>Task Timeline</CardTitle>
                      </CardHeader>
                      <CardBody>
                        <ul className="activity-timeline timeline-left list-unstyled">
                          {this.createUI()}
                        </ul>
                      </CardBody>
                    </Card>
                  </Col>
                </CardBody>
              </Card>
            </Form>
          );
        }}
      </Formik>
    );
  }
}
export default Summary;
