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
import moment from "moment";
import SweetAlert from "react-bootstrap-sweetalert";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../../assets/scss/plugins/extensions/toastr.scss";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { history } from "../../../history";
import {
  Update,
  DeleteForever,
  AddCircle,
  CheckCircleOutlined,
  Edit,
  ExitToApp,
} from "@material-ui/icons";
import * as appConst from "../../../utility/Constants";
import LovList from "../../common/Helpers";

export default class MoveOutCreate extends Component {
  constructor(props) {
    super(props);
    this.invokeParentMethod = this.invokeParentMethod.bind(this);
    this.state = {
      modal: "",
      tenantId: props.value,
      leaseRenewalId: props.value,
      renewedList: [],
      renewalStatus: "",
      renewlNotes: "",
      successAlert: false,
      rowData: [],
    };
  }
  invokeParentMethod() {
    console.log("this.props.value" + this.props.value);
    this.props.context.componentParent.methodFromParent(`${1}`);
  }
  async componentDidMount() {
    console.log("Id" + this.state.tenantId);

    this.state.renewedList = await LovList.lovList(appConst.renewedList);
    await axios
      .post("/renewal/moveout/search-byref/", {
        appReqId: this.state.tenantId,
      })
      .then((response) => {
        this.state.rowData = response.data.moveout;
        this.setState({
          noticeGivenDate: moment(this.state.rowData.noticeGivenDate).format(
            "YYYY-MM-DD"
          ),
          moveOutDate: moment(this.state.rowData.moveOutDate).format(
            "YYYY-MM-DD"
          ),
          comments: this.state.rowData.comments,
          moveOutId: this.state.rowData.moveOutId,
        });
      })
      .catch((error) => {
        console.log("error:::" + error);
      });
  }
  render() {
    const {
      noticeGivenDate,
      tenantId,
      moveOutDate,
      comments,
      moveOutId,
      rowData,
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
                  noticeGivenDate: noticeGivenDate,
                  moveOutDate: moveOutDate,
                  comments: comments,
                }}
                onSubmit={(values, actions) => {
                  let responseCode = "";
                  let url = "";
                  let payload = "";
                  setTimeout(() => {
                    if (rowData == null) {
                      url = "/renewal/moveout/create/";
                      console.log("Create");
                      payload = {
                        noticeGivenDate: values.noticeGivenDate,
                        moveOutDate: values.moveOutDate,
                        comments: values.comments,
                        appReqId: tenantId,
                      };
                    } else {
                      url = "/renewal/moveout/update/";
                      console.log("Update");
                      payload = {
                        noticeGivenDate: values.noticeGivenDate,
                        moveOutDate: values.moveOutDate,
                        comments: values.comments,
                        appReqId: tenantId,
                        moveOutId: moveOutId,
                      };
                    }
                    axios({
                      method: "POST",
                      url: url,
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
                            <Col sm="12" md="6">
                              <label htmlFor="noticeGivenDate">
                                Notice Give Date
                              </label>
                              <FormGroup className=" position-relative">
                                <Field
                                  className="form-control"
                                  name="noticeGivenDate"
                                  type="date"
                                />
                              </FormGroup>
                            </Col>
                            <Col sm="12" md="6">
                              <label htmlFor="moveOutDate">Move Out Date</label>
                              <FormGroup className=" position-relative">
                                <Field
                                  className="form-control"
                                  name="moveOutDate"
                                  type="date"
                                />
                              </FormGroup>
                            </Col>

                            <Col sm="12" md="12">
                              <label htmlFor="comments">Comments</label>
                              <FormGroup className=" position-relative">
                                <Field
                                  name="comments"
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
        <ExitToApp
          color="primary"
          onClick={() => this.toggleModal(5, null, 1)}
        />
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
    console.log("Inside hide");
    this.setState({
      alert: null,
      modal: null,
    });
    this.invokeParentMethod();
  }

  toggleModal = (id, notesId, actionId) => {
    this.componentDidMount();

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
    modalTitle: "Move Out Status",
    modalClass: "modal-lg",
    bgColor: "bg-primary",
  },
];
