import React, { Component } from "react";
import "../../../assets/scss/plugins/tables/_agGridStyleOverride.scss";
import "../../../assets/scss/pages/users.scss";
import axios from "axios";
import { AddCircle, CheckCircleOutlined } from "@material-ui/icons";
import SweetAlert from "react-bootstrap-sweetalert";
import Helpers from "../Helpers";
import PropertySummary from "../PropertySummary";
import { Formik, Field, Form, ErrorMessage } from "formik";
import DataTable from "react-data-table-component";
import moment from "moment";
import { history } from "../../../history";
import { Update, DeleteForever } from "@material-ui/icons";

import {
  Card,
  CardTitle,
  CardBody,
  Button,
  FormGroup,
  Col,
  Row,
  Table,
  UncontrolledTooltip,
  ModalBody,
  Modal,
  ModalHeader,
  TabContent,
  TabPane,
  Input,
  CardHeader,
} from "reactstrap";
import { Edit, Trash } from "react-feather";

class Notes extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    notesDesc: "",
    notesLength: 0,
    activeTab: "1",
    rowData: [],
    propertyId: null,
    unitId: null,
    menuFlag: null,
    notesId: null,
    actionId: null,
    propId: null,
    unitId: null,
    columns: [
      {
        name: "Notes Description",
        selector: "notesDesc",
        sortable: true,
        minWidth: "300px",
      },
      {
        name: "Created Date",
        selector: "createdDate",
        sortable: true,
      },
      {
        name: "Created By",
        selector: "createdBy",
        sortable: true,
      },
      {
        name: "Actions",
        selector: "notesId",
        sortable: true,
        cell: (row) => <this.ActionsComponent notesId={row.notesId} />,
      },
    ],
  };

  ActionsComponent = (props) => {
    return (
      <div className="data-list-action">
        <Update
          color="primary"
          className="cursor-pointer mr-1"
          size={20}
          onClick={() => this.toggleModal(5, props.notesId, 2)}
        />
        <DeleteForever
          color="secondary"
          className="cursor-pointer mr-1"
          size={20}
          onClick={() => this.toggleModal(5, props.notesId, 3)}
        />
      </div>
    );
  };
  async componentDidMount() {
    var referenceId = "";
    this.state.unitId = this.props.unitId;
    this.state.propertyId = this.props.propertyId;
    this.state.menuFlag = this.props.menuFlag;
    if (this.state.menuFlag == 1) {
      referenceId = this.state.propertyId;
    } else {
      referenceId = this.state.unitId;
    }
    await axios
      .post("/rentals/property/notes/search-by-ref/", {
        refNumber: referenceId,
      })
      .then((response) => {
        let listData = response.data.notes;
        this.setState({ rowData: listData });
      })
      .catch((error) => {
        console.log("error:::" + error);
      });
  }

  render() {
    const {
      notesDesc = "",
      propertyId = "",
      unitId = "",
      notesId,
      actionId,
    } = this.state;
    const renderCreateModal = ModalCreateConfig.map((item) => {
      return (
        <React.Fragment key={item.id}>
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
                  unitId: unitId,
                  propertyId: propertyId,
                }}
                onSubmit={(values, actions) => {
                  let responseCode = "";
                  var refId = "";
                  if (this.state.menuFlag == 1) {
                    refId = this.state.propertyId;
                  } else {
                    refId = this.state.unitId;
                  }
                  setTimeout(() => {
                    let payload = {
                      notesDesc: this.state.notesDesc,
                      refNumber: refId,
                    };

                    axios({
                      method: "POST",
                      url: "/rentals/property/notes/create/",
                      data: payload,
                    })
                      .then((response) => {
                        console.log("Response:::::::::::::" + response.data);
                        responseCode = response.data.responseCode;
                        console.log(
                          "Response Code:::::::::::::" + responseCode
                        );
                        if (responseCode == 1000) {
                          this.successMessage("successAlert", true);
                        } else {
                          this.errorMessgae("errorAlert", true);
                        }
                      })
                      .catch((error) => {
                        console.log(error);
                        // toast.error("Bad Request, Please verify your inputs!");
                      });
                  }, 1000);
                }}
              >
                {(props) => {
                  const { setFieldValue, errors, touched } = props;
                  return (
                    <Form onSubmit={props.handleSubmit}>
                      <Col>
                        <div>
                          <Row>
                            <Col md="12" sm="12">
                              <label>Notes</label>
                              <Input
                                name="notesDesc"
                                type="textarea"
                                rows="4"
                                required
                                onChange={this.handleChange}
                              />

                              <small
                                className={`counter-value float-right ${
                                  this.state.notesLength > 500
                                    ? "bg-danger"
                                    : ""
                                }`}
                              >
                                {`${this.state.notesLength}/500`}
                              </small>
                            </Col>
                          </Row>
                        </div>

                        <br />
                      </Col>

                      <FormGroup row>
                        <Col md={{ size: 8, offset: 4 }}>
                          <Button.Ripple
                            color="primary"
                            type="submit"
                            className="mr-1 mb-1"
                            onClick={this.handleSubmit}
                          >
                            <CheckCircleOutlined size={14} />

                            <span className="align-middle ml-25">Create</span>
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
    const renderUpdateModal = ModalUpdateConfig.map((item) => {
      return (
        <React.Fragment key={item.id}>
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
                  unitId: unitId,
                  propertyId: propertyId,
                  notesId: notesId,
                  notesDesc: notesDesc,
                }}
                onSubmit={(values, actions) => {
                  let responseCode = "";
                  var refId = "";
                  if (this.state.menuFlag == 1) {
                    refId = this.state.propertyId;
                  } else {
                    refId = this.state.unitId;
                  }
                  setTimeout(() => {
                    let payload = {
                      notesDesc: this.state.notesDesc,
                      notesId: notesId,
                    };
                    var url = "/rentals/property/notes/update/";

                    axios({
                      method: "POST",
                      url: url,
                      data: payload,
                    })
                      .then((response) => {
                        console.log("Response:::::::::::::" + response.data);
                        responseCode = response.data.responseCode;
                        console.log(
                          "Response Code:::::::::::::" + responseCode
                        );
                        if (responseCode == 1000) {
                          this.successMessage("successAlert", true);
                        } else {
                          this.errorMessgae("errorAlert", true);
                        }
                      })
                      .catch((error) => {
                        console.log(error);
                        // toast.error("Bad Request, Please verify your inputs!");
                      });
                  }, 1000);
                }}
              >
                {(props) => {
                  const { setFieldValue, errors, touched } = props;
                  return (
                    <Form onSubmit={props.handleSubmit}>
                      <Col>
                        <div>
                          <Row>
                            <Col md="12" sm="12">
                              <label>Notes:</label>
                              <Input
                                name="notesDesc"
                                type="textarea"
                                value={notesDesc}
                                rows="4"
                                required
                                onChange={this.handleChange}
                              />
                              <small
                                className={`counter-value float-right ${
                                  this.state.notesLength > 500
                                    ? "bg-danger"
                                    : ""
                                }`}
                              >
                                {`${this.state.notesLength}/500`}
                              </small>
                            </Col>
                          </Row>
                        </div>

                        <br />
                      </Col>

                      <FormGroup row>
                        <Col md={{ size: 8, offset: 4 }}>
                          <Button.Ripple
                            color="primary"
                            type="submit"
                            className="mr-1 mb-1"
                            onClick={this.handleSubmit}
                          >
                            <CheckCircleOutlined size={14} />

                            <span className="align-middle ml-25">Update</span>
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
    const renderDeleteModal = ModalDeleteConfig.map((item) => {
      return (
        <React.Fragment key={item.id}>
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
                  unitId: unitId,
                  propertyId: propertyId,
                  notesId: notesId,
                  notesDesc: notesDesc,
                }}
                onSubmit={(values, actions) => {
                  let responseCode = "";
                  var refId = "";
                  if (this.state.menuFlag == 1) {
                    refId = this.state.propertyId;
                  } else {
                    refId = this.state.unitId;
                  }
                  setTimeout(() => {
                    let payload = {
                      notesId: notesId,
                    };
                    var url = "/rentals/property/notes/delete/";

                    axios({
                      method: "POST",
                      url: url,
                      data: payload,
                    })
                      .then((response) => {
                        console.log("Response:::::::::::::" + response.data);
                        responseCode = response.data.responseCode;
                        console.log(
                          "Response Code:::::::::::::" + responseCode
                        );
                        if (responseCode == 1000) {
                          this.successMessage("successAlert", true);
                        } else {
                          this.errorMessgae("errorAlert", true);
                        }
                      })
                      .catch((error) => {
                        console.log(error);
                        // toast.error("Bad Request, Please verify your inputs!");
                      });
                  }, 1000);
                }}
              >
                {(props) => {
                  const { setFieldValue, errors, touched } = props;
                  return (
                    <Form onSubmit={props.handleSubmit}>
                      <Col>
                        <div>
                          <Row>
                            <Col md="12" sm="12">
                              <label>Notes:</label>
                              <Input
                                name="notesDesc"
                                type="textarea"
                                value={notesDesc}
                                rows="4"
                                required
                                onChange={this.handleChange}
                              />
                              <small
                                className={`counter-value float-right ${
                                  this.state.notesLength > 500
                                    ? "bg-danger"
                                    : ""
                                }`}
                              >
                                {`${this.state.notesLength}/500`}
                              </small>
                            </Col>
                          </Row>
                        </div>

                        <br />
                      </Col>

                      <FormGroup row>
                        <Col md={{ size: 8, offset: 4 }}>
                          <Button.Ripple
                            color="danger"
                            type="submit"
                            className="mr-1 mb-1"
                            onClick={this.handleSubmit}
                          >
                            <CheckCircleOutlined size={14} />

                            <span className="align-middle ml-25">Delete</span>
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
    const { rowData, columns } = this.state;
    return (
      <Card>
        <CardBody>
          <Row>
            <Col md="11" sm="12">
              <h6 className="primary">Notes </h6>
            </Col>
            <Col md="1" sm="12">
              <Button.Ripple
                className="btn-icon rounded-circle"
                color="primary"
                onClick={() => this.toggleModal(5, null, 1)}
                id="addNotes"
              >
                <AddCircle />
              </Button.Ripple>
              <UncontrolledTooltip placement="top" target="addNotes">
                Add Notes
              </UncontrolledTooltip>
            </Col>
          </Row>

          <DataTable data={rowData} columns={columns} noHeader />
        </CardBody>
        <Col md="12" sm="12">
          {actionId == 1 && (
            <TabContent activeTab={this.state.activeTab}>
              <TabPane tabId="1">{renderCreateModal}</TabPane>
            </TabContent>
          )}

          {actionId == 2 && (
            <TabContent activeTab={this.state.activeTab}>
              <TabPane tabId="1">{renderUpdateModal}</TabPane>
            </TabContent>
          )}
          {actionId == 3 && (
            <TabContent activeTab={this.state.activeTab}>
              <TabPane tabId="1">{renderDeleteModal}</TabPane>
            </TabContent>
          )}
        </Col>
      </Card>
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
        onConfirm={() => this.hideAlert()}
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
  handleChange = (event) => {
    this.setState({
      notesDesc: event.target.value,
      notesLength: event.target.value.length,
    });
  };
  hideAlert() {
    this.setState({
      alert: null,
      modal: null,
    });
    this.componentDidMount();
  }

  toggleModal = (id, notesId, actionId) => {
    console.log("notesId " + notesId);
    if (notesId !== null && notesId !== undefined) {
      axios
        .post("/rentals/property/notes/search-byid/", {
          notesId: notesId,
        })
        .then((response) => {
          let values = response.data.notes;
          this.setState({
            notesDesc: values.notesDesc,
          });
        })
        .catch((error) => {
          console.log("error:::" + error);
        });
    }
    if (this.state.modal !== id) {
      this.setState({
        modal: id,
        notesId: notesId,
        actionId: actionId,
      });
    } else {
      this.setState({
        modal: null,
      });
    }
  };
}

const ModalCreateConfig = [
  {
    id: 5,
    btnTitle: "Add Notes",
    modalTitle: "Add Notes",
    modalClass: "modal-lg",
    bgColor: "bg-primary",
  },
];
const ModalUpdateConfig = [
  {
    id: 5,
    btnTitle: "Update Notes",
    modalTitle: "Update Notes",
    modalClass: "modal-lg",
    bgColor: "bg-primary",
  },
];
const ModalDeleteConfig = [
  {
    id: 5,
    btnTitle: "Delete Notes",
    modalTitle: "Delete Notes",
    modalClass: "modal-lg",
    bgColor: "bg-primary",
  },
];
var featuresListData = [];
export default Notes;
