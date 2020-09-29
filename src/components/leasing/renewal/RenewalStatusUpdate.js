import React, { Component } from "react";
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
import axios from "axios";
import SweetAlert from "react-bootstrap-sweetalert";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../../assets/scss/plugins/extensions/toastr.scss";
import { Formik, Field, Form, ErrorMessage } from "formik";
import Select from "react-select";
import {
  Update,
  DeleteForever,
  AddCircle,
  CheckCircleOutlined,
  Edit,
} from "@material-ui/icons";
import * as appConst from "../../../utility/Constants";
import LovList from "../../common/Helpers";

export default class RenewalStatusUpdate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: "",
      tenantId: props.value,
      leaseRenewalId: props.value,
      renewedList: [],
      renewalStatus: "",
      renewlNotes: "",
      successAlert: false,
    };
  }

  async componentDidMount() {
    console.log("Id" + this.state.tenantId);

    this.state.renewedList = await LovList.lovList(appConst.renewedList);
  }
  render() {
    const {
      renewedList,
      tenantId,
      renewedStatus,
      leaseRenewalId,
      notes,
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
                initialValues={
                  {
                    // unitId: unitId,
                    //  propertyId: propertyId,
                  }
                }
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
                      renewedStatus: this.state.renewalStatus,
                      notes: this.state.notes,
                      leaseRenewalId: leaseRenewalId,
                    };

                    axios({
                      method: "POST",
                      url: "/renewal/status-update/",
                      data: payload,
                    })
                      .then((response) => {
                        responseCode = response.data.responseCode;

                        if (responseCode == 1000) {
                          this.message("successAlert", true);
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
                              <label>Status </label>
                              <Select
                                type="select"
                                name="renewedStatus"
                                value={renewedList.find(
                                  (obj) => obj.value === renewedStatus || ""
                                )}
                                options={renewedList}
                                onChange={this.handleSelectChange}
                              />
                            </Col>
                            <Col md="12" sm="12">
                              <label>Comments {notes}</label>
                              <Input
                                name="notes"
                                type="textarea"
                                value={notes}
                                rows="3"
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
                          <ToastContainer />
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
      <div className="actions cursor-pointer">
        <Edit color="primary" onClick={() => this.toggleModal(5, null, 1)} />
        <TabContent activeTab={this.state.activeTab}>
          <TabPane tabId="1">{renderCreateModal}</TabPane>
        </TabContent>
      </div>
    );
  }

  handleSelectChange = (e) => {
    this.setState({
      renewalStatus: e.value,
    });
  };
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
  message(state, value) {
    const getAlert = () => (
      <SweetAlert
        success
        confirmBtnText="Ok!"
        title="success"
        show={value}
        onConfirm={() => this.hideAlert()}
      >
        <p className="sweet-alert-text">Request Sussessfully Updated</p>
      </SweetAlert>
    );
    this.setState({
      alert: getAlert(),
    });
  }
  handleChange = (event) => {
    this.setState({
      notes: event.target.value,
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
    this.componentDidMount();

    axios
      .post("/renewal/view/", {
        leaseRenewalId: this.state.leaseRenewalId,
      })
      .then((response) => {
        let values = response.data.renewlHdr;
        this.setState({
          renewedStatus: values.renewedStatus,
          notes: values.notes,
        });
      })
      .catch((error) => {
        console.log("error:::" + error);
      });

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
    btnTitle: "Update Status",
    modalTitle: "Update Status",
    modalClass: "modal-lg",
    bgColor: "bg-primary",
  },
];
