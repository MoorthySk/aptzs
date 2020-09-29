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
import Helpers from "../Helpers";
import Select from "react-select";
import avatarImg from "../../../assets/img/portrait/small/offer1.jpg";
import moment from "moment";
import SweetAlert from "react-bootstrap-sweetalert";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../../assets/scss/plugins/extensions/toastr.scss";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { history } from "../../../history";
import {
  AddCircle,
  HomeWork,
  ContactMail,
  Cancel,
  AddCircleOutline,
  LocalOffer,
  Edit,
} from "@material-ui/icons";
import * as appConst from "../../../utility/Constants";
import LovList from "../../common/Helpers";
const columns = [
  {
    name: "Features",
    selector: "feature",
    sortable: true,
  },
  {
    name: "Description",
    selector: "description",
    sortable: true,
  },
];
export default class OfferUpdate extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit1 = this.handleSubmit1.bind(this);
    this.invokeParentMethod = this.invokeParentMethod.bind(this);
    this.state = {
      offerData: [
        {
          leaseType: "",
          rent: "",
          leaseEndDate: "",
        },
      ],
      activeTab: "1",
      rowData: [],
      propertyId: null,
      unitId: null,
      menuFlag: null,
      leaseTypeList: [],
      tenantId: null,
      errorMessage: "",
      tenantId: props.value,
    };
  }

  invokeParentMethod() {
    console.log("this.props.value" + this.props.value);
    this.props.context.componentParent.methodFromParent(`${1}`);
  }
  async componentDidMount() {
    console.log("Mount");
    this.state.leaseTypeList = await LovList.lovList(appConst.leaseType);
    this.state.offerStatusList = await LovList.lovList(
      appConst.offerStatusList
    );

    await axios
      .post("/renewal/offers/search-byid/", {
        appReqId: this.state.tenantId,
      })
      .then((response) => {
        let rowData = response.data.offerDtl;
        let offerHdr = response.data.offerHdr;

        this.setState({
          leaseOfferId: offerHdr.leaseOfferId,
          offerStatus: offerHdr.offerStatus,
          offerNotes: offerHdr.offerNotes,
        });

        this.removeAll();
        for (var i = 0; i < rowData.length; i++) {
          this.setState((prevState) => ({
            offerData: [
              ...prevState.offerData,
              {
                leaseType: rowData[i].leaseType,
                rent: rowData[i].rent,

                leaseEndDate: moment(rowData[i].leaseEndDate).format(
                  "YYYY-MM-DD"
                ),
              },
            ],
          }));
        }
      })
      .catch((error) => {
        console.log("error:::" + error);
      });
    await axios
      .post("/lease/lease-info-byid/", {
        applicantId: this.state.tenantId,
      })
      .then((response) => {
        let leaseInfo = response.data.leaseInfo;
        this.setState({
          leaseType: leaseInfo.leaseType,

          leaseStartDate: moment(leaseInfo.leaseStartDate).format("YYYY-MM-DD"),
          leaseEndDate: moment(leaseInfo.leaseEndDate).format("YYYY-MM-DD"),

          totalRent: leaseInfo.totalRent,
          rowData: leaseInfo,
        });
      })
      .catch((error) => {
        console.log("error:::" + error);
      });
  }
  render() {
    const {
      unitId = "",
      propertyId = "",
      rowData,
      leaseTypeList,
      leaseType,
      leaseEndDate,
      totalRent,
      leaseStartDate,
      offerStatus,
      offerNotes,
      offerStatusList,
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
                  offerNotes: offerNotes,
                  offerStatus: offerStatus,
                }}
                onSubmit={(values, actions) => {
                  let responseCode = "";
                  var myObject = JSON.stringify(this.state.offerData);
                  var parseObject = JSON.parse(myObject);

                  if (parseObject.length > 0) {
                    setTimeout(() => {
                      let payload = {
                        offerDtl: parseObject,
                        offerHdr: {
                          appReqId: this.state.tenantId,
                          offerStatus: this.state.offerStatus,
                          offerNotes: values.offerNotes,
                        },
                        leaseOfferId: this.state.leaseOfferId,
                      };
                      var url = "/renewal/offers/update/";

                      axios({
                        method: "POST",
                        url: url,
                        data: payload,
                      })
                        .then((response) => {
                          console.log("Response:::::::::::::" + response.data);
                          responseCode = response.data.responseCode;
                          console.log(
                            "Response Codeccccccccccccccccccccc:::::::::::::" +
                              responseCode
                          );
                          if (responseCode == 1000) {
                            this.message("successAlert", true);
                          } else {
                            this.errorMessgae("errorAlert", true);
                          }
                        })
                        .catch((error) => {
                          console.log(error);
                        });
                    }, 1000);
                  } else {
                    this.setState({
                      errorMessage: "At least one offer to be added",
                    });
                  }
                }}
              >
                {(props) => {
                  const { setFieldValue, errors, touched } = props;
                  return (
                    <Form onSubmit={props.handleSubmit}>
                      <Row>
                        <Col md="12" sm="12">
                          <Card>
                            <CardHeader className="mx-auto flex-column">
                              <h4>Current Term </h4>
                              <p></p>
                            </CardHeader>
                            <CardBody className="text-center pt-0">
                              <div className="d-flex justify-content-between mt-2">
                                <div className="uploads">
                                  <p className="font-weight-bold text-left">
                                    Lease Type
                                  </p>

                                  {leaseType}
                                </div>
                                <div className="followers">
                                  <p className="font-weight-bold text-left">
                                    Lease Start
                                  </p>
                                  {leaseStartDate}
                                </div>
                                <div className="following">
                                  <p className="font-weight-bold text-left">
                                    Lease End
                                  </p>
                                  {leaseEndDate}
                                </div>
                                <div className="following">
                                  <p className="font-weight-bold text-left">
                                    Rent
                                  </p>
                                  {totalRent}
                                </div>
                              </div>

                              <div className="d-flex justify-content-between mt-2">
                                <Col md="6" sm="12">
                                  <div className="offerStatus">
                                    <p className="font-weight-bold text-left">
                                      Offer Status
                                    </p>

                                    <Select
                                      type="select"
                                      name="offerStatus"
                                      value={offerStatusList.find(
                                        (obj) => obj.value === offerStatus || ""
                                      )}
                                      options={offerStatusList}
                                      onChange={this.handleOfferStatusChange.bind(
                                        this
                                      )}
                                      required
                                    />
                                  </div>
                                </Col>
                                <Col md="6" sm="12">
                                  <div className="offerNotes">
                                    <p className="font-weight-bold text-left">
                                      Notes
                                    </p>
                                    <Field
                                      className="form-control"
                                      name="offerNotes"
                                      type="text"
                                    />
                                  </div>
                                </Col>
                              </div>
                            </CardBody>
                            <div style={{ color: "red" }}>
                              {this.state.errorMessage}
                            </div>
                          </Card>
                        </Col>
                      </Row>
                      {this.createUI()}

                      <br />

                      <FormGroup row>
                        <Col md={{ size: 8, offset: 4 }}>
                          <Button.Ripple
                            color="success"
                            className="mr-1 mb-1"
                            onClick={this.addClick.bind(this)}
                          >
                            <AddCircleOutline size={14} />

                            <span className="align-middle ml-25">
                              Add Offer
                            </span>
                          </Button.Ripple>
                          <Button.Ripple
                            color="primary"
                            type="submit"
                            className="mr-1 mb-1"
                            onClick={this.handleSubmit}
                          >
                            <AddCircleOutline size={14} />

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

    return (
      <div className="actions cursor-pointer">
        <LocalOffer
          color="primary"
          onClick={() => this.toggleModal(5, null, 1)}
        />
        <TabContent activeTab={this.state.activeTab}>
          <TabPane tabId="1">{renderCreateModal}</TabPane>
        </TabContent>
      </div>
    );
  }
  handleOfferStatusChange(e) {
    this.setState({ offerStatus: e.value });
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
  message(state, value) {
    const getAlert = () => (
      <SweetAlert
        success
        confirmBtnText="Ok!"
        title="success"
        show={value}
        onConfirm={() => this.hideAlert()}
      >
        <p className="sweet-alert-text">Request Sussessfully Updated!!</p>
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
    console.log("Inside hide");
    this.invokeParentMethod();
  }

  toggleModal = (id, notesId, actionId) => {
    // this.componentDidMount();

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

  handleRowChange(i, e) {
    const { name, value } = e.target;
    let offerData = [...this.state.offerData];
    offerData[i] = { ...offerData[i], [name]: value };
    this.setState({ offerData });
  }
  handleSelectChange(i, e) {
    let offerData = [...this.state.offerData];
    offerData[i] = { ...offerData[i], ["leaseType"]: e.value };
    this.setState({ offerData });
  }
  removeClick(i) {
    let offerData = [...this.state.offerData];
    offerData.splice(i, 1);
    this.setState({ offerData });
  }
  removeAll() {
    let offerData = [...this.state.offerData];
    offerData.splice(0, offerData.length);
    this.setState({ offerData });
  }
  handleSubmit1(event) {
    event.preventDefault();
  }

  addClick() {
    this.setState({
      errorMessage: " ",
    });
    this.setState((prevState) => ({
      offerData: [
        ...prevState.offerData,
        {
          leaseType: "",
          rent: "",
          leaseEndDate: "",
        },
      ],
    }));
  }
  createUI() {
    const {
      setFieldValue,
      errors,
      touched,
      leaseTypeList,
      offerData,
    } = this.state;
    return this.state.offerData.map((el, i) => (
      <div key={i}>
        <Row>
          <Col md="12" sm="12">
            <Card>
              <CardHeader className="mx-auto flex-column">
                <h4>Offer {i + 1}</h4>
                <p></p>
              </CardHeader>
              <CardBody className="text-center pt-0">
                <div className="avatar mr-1 avatar-xxl">
                  <img src={avatarImg} alt="avatarImg" />
                </div>
                <div className="d-flex justify-content-between mt-2">
                  <div className="uploads">
                    <p className="font-weight-bold text-left">
                      Lease Type &nbsp;&nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                      &nbsp; &nbsp;
                    </p>

                    <Select
                      type="select"
                      name="leaseType"
                      value={leaseTypeList.find(
                        (obj) => obj.value === el.leaseType || ""
                      )}
                      options={leaseTypeList}
                      onChange={this.handleSelectChange.bind(this, i)}
                      required
                    />
                  </div>
                  <div className="followers">
                    <p className="font-weight-bold text-left">Lease End</p>
                    <Input
                      className="form-control"
                      name="leaseEndDate"
                      type="date"
                      value={el.leaseEndDate || ""}
                      onChange={this.handleRowChange.bind(this, i)}
                      required
                    />
                  </div>
                  <div className="following">
                    <p className="font-weight-bold text-left">Rent</p>
                    <Input
                      className="form-control"
                      name="rent"
                      type="number"
                      value={el.rent || ""}
                      onChange={this.handleRowChange.bind(this, i)}
                      required
                    />
                  </div>
                </div>
                <Button.Ripple
                  onClick={this.removeClick.bind(this, i)}
                  className="btn-block gradient-light-primary mt-2"
                >
                  Remove
                </Button.Ripple>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    ));
  }
}

const ModalCreateConfig = [
  {
    id: 5,
    btnTitle: "Update Status",
    modalTitle: "Offer Create",
    modalClass: "modal-lg",
    bgColor: "bg-primary",
  },
];
