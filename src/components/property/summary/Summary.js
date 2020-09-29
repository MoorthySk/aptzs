import React from "react";
import { Formik, Field, ErrorMessage, Form } from "formik";
import Select from "react-select";
import {
  Card,
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
  Table,
  CardHeader,
  Media,
  ModalFooter,
  NavLink,
} from "reactstrap";
import { history } from "../../../history";
import { Edit, Link, Trash } from "react-feather";
import { Assistant } from "@material-ui/icons";
import SweetAlert from "react-bootstrap-sweetalert";
import Helpers from "../Helpers";
import TaskStatus from "./TaskStatus";
import ApplicantStatus from "./ApplicantStatus";
import StatisticsCardCol from "../../../components/@vuexy/statisticsCard/StatisticsCardCol";
import { Person } from "@material-ui/icons";
import { green } from "@material-ui/core/colors";
import "../../../assets/scss/plugins/charts/apex-charts.scss";
import axios from "axios";
import Features from "./Features";
import Notes from "./Notes";
import userImg from "../../../assets/img/portrait/small/appart1.jpg";

class Summary extends React.Component {
  state = {
    activeTab: "1",
    active: "1",
    contactPersonName: null,
    contactPersonEmail: null,
    contactPersonNumber: null,
    priority: null,
    propId: null,
    renderChildren: false,
    modal: false,
  };
  toggleModal = (id) => {
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
        onConfirm={() => Helpers.redirectSearch()}
      >
        <p className="sweet-alert-text">Request Updated Failed</p>
      </SweetAlert>
    );
    this.setState({
      alert: getAlert(),
    });
  }
  handleSelect2Change = (proptyManager) => {
    let item2 = [];
    if (proptyManager.value) {
      item2.push({ value: proptyManager.value, label: proptyManager.value });
    }

    this.setState({
      proptyManager: proptyManager.value,
      selProptyManager: item2,
    });
  };

  async componentDidMount() {
    var propertyId = this.props.propertyId;
    this.state.propId = this.props.propertyId;
    console.log("summary propId:: " + this.state.propId);
    this.setState({
      renderChildren: true,
    });
    let mess = "";
    let unitDtl = "";
    let ownerdtl = "";
    let feature = "";
    let responseCode = "";

    axios
      .post("/rentals/property/search/", {
        propertyId: propertyId,
      })

      .then((response) => {
        responseCode = response.data.responseCode;
        if (responseCode === "1004") {
          history.push("/sessionExpired");
        } else {
          mess = response.data.propDetails;
          ownerdtl = response.data.propOwnerDtls;
          feature = response.data.propFeatureDtls;
          // this.propInfo.propertyId = mess.propertyId;
          let items = [];

          if (feature) {
            var optList = feature.featureList.split(",");

            for (let i = 0; i < optList.length; i++) {
              items.push({ value: optList[i], label: optList[i] });
            }
          }

          let item2 = [];
          if (mess.proptyManager) {
            item2.push({
              value: mess.proptyManager,
              label: mess.proptyManager,
            });
          }

          //   console.log("feature:" + response.data.propFeatureDtls.propDescription);
          //console.log("option list:"+items);
          this.setState({
            propertyName: mess.proptyName,
            propertyAddress: mess.proptyAddress,
            propertyCity: mess.proptyCity,
            propertyState: mess.proptyState,
            propertyPostalCode: mess.proptyPostalCode,
            noOfUnits: mess.noOfUnits,
            manageNotes: mess.manageNotes,
            proptyManager: mess.proptyManager,
            selProptyManager: item2,
            propertyId: mess.propertyId,
            propOwnerName: ownerdtl.propOwnerName,
            propOwnerAddress: ownerdtl.propOwnerAddress,
            propOwnerCity: ownerdtl.propOwnerCity,
            propOwnerState: ownerdtl.propOwnerState,
            propOwnerPostalCode: ownerdtl.propOwnerPostalCode,
            propOwnerEmail: ownerdtl.propOwnerEmail,
            propOwnerMobileNumber: ownerdtl.propOwnerMobileNumber,
            propOwnerOfficeNumber: ownerdtl.propOwnerOfficeNumber,
            propOwnerHomeNumber: ownerdtl.propOwnerHomeNumber,
            propDescription: null,
            featureList: "Pool",
            selFeatureList: "Pool",
          });
        }
      })
      .catch((error) => {
        console.log("error:::" + error);
      });
  }
  render() {
    const {
      propertyName = "",
      propertyAddress = "",
      propertyCity = "",
      propertyState = "",
      propertyPostalCode = "",
      noOfUnits = "",
      manageNotes = "",
      propertyId,
      proptyManager = "",
      selProptyManager = [],
      propOwnerName = "",
      propOwnerAddress = "",
      propOwnerCity = "",
      propOwnerState = "",
      propOwnerPostalCode = "",
      propOwnerEmail = "",
      propOwnerMobileNumber = "",
      propOwnerOfficeNumber = "",
      propOwnerHomeNumber = "",
      propDescription = "",
      featureList = [],
      selFeatureList = [],
      renderChildren,
      propId,
    } = this.state;
    const renderModal = ModalConfig.map((item) => {
      return (
        <React.Fragment key={item.id}>
          <Modal
            isOpen={this.state.modal === item.id}
            toggle={() => this.toggleModal(item.id)}
            className="modal-dialog-centered"
            key={item.id}
          >
            <ModalHeader
              toggle={() => this.toggleModal(item.id)}
              className={item.bgColor}
            >
              {item.title}
            </ModalHeader>
            <ModalBody>
              <div className="users-page-view-table">
                <div className="d-flex user-info">
                  <div className="user-info-title font-weight-bold">
                    Owner Name
                  </div>
                  <div>{propOwnerName}</div>
                </div>
                <div className="d-flex user-info">
                  <div className="user-info-title font-weight-bold">
                    Address
                  </div>
                  <div>{propOwnerAddress}</div>
                </div>
                <div className="d-flex user-info">
                  <div className="user-info-title"></div>
                  <div className="text-truncate">
                    <span> {propOwnerCity}</span>
                  </div>
                </div>
                <div className="d-flex user-info">
                  <div className="user-info-title"></div>
                  <div className="text-truncate">
                    <span>
                      {propOwnerState} - {propOwnerPostalCode}
                    </span>
                  </div>
                </div>
                <div className="d-flex user-info">
                  <div className="user-info-title font-weight-bold">Mobile</div>
                  <div>{propOwnerMobileNumber}</div>
                </div>
                <div className="d-flex user-info">
                  <div className="user-info-title font-weight-bold">Office</div>
                  <div>{propOwnerOfficeNumber}</div>
                </div>
                <div className="d-flex user-info">
                  <div className="user-info-title font-weight-bold">Home</div>
                  <div>{propOwnerHomeNumber}</div>
                </div>
              </div>
            </ModalBody>
          </Modal>
        </React.Fragment>
      );
    });
    return (
      <React.Fragment>
        <Formik
          enableReinitialize
          initialValues={{
            propertyName: propertyName,
            propertyAddress: propertyAddress,
            propertyCity: propertyCity,
            propertyState: propertyState,
            propertyPostalCode: propertyPostalCode,
            noOfUnits: noOfUnits,
            manageNotes: manageNotes,
            proptyManager: proptyManager,
            selProptyManager: selProptyManager,
            propertyId: propertyId,
            propOwnerName: propOwnerName,
            propOwnerAddress: propOwnerAddress,
            propOwnerCity: propOwnerCity,
            propOwnerState: propOwnerState,
            propOwnerPostalCode: propOwnerPostalCode,
            propOwnerEmail: propOwnerEmail,
            propOwnerMobileNumber: propOwnerMobileNumber,
            propOwnerOfficeNumber: propOwnerOfficeNumber,
            propOwnerHomeNumber: propOwnerHomeNumber,
            propDescription: propDescription,
            featureList: featureList,
            selFeatureList: selFeatureList,
          }}
        >
          {(props) => {
            const { setFieldValue, errors, touched } = props;
            return (
              <Form>
                <Row>
                  <Col sm="12">
                    <Card>
                      <CardHeader>
                        <CardTitle>Property Details</CardTitle>
                      </CardHeader>
                      <CardBody>
                        <Row className="mx-0" col="12">
                          <Col className="pl-0" sm="12">
                            <Media className="d-sm-flex d-block">
                              <Media className="mt-md-1 mt-0" left>
                                <Media
                                  className="rounded mr-2"
                                  object
                                  src={userImg}
                                  alt="Generic placeholder image"
                                  height="280"
                                  width="280"
                                />
                              </Media>
                              <Media body>
                                <Row>
                                  <Col sm="12" md="12">
                                    <div className="users-page-view-table">
                                      <div className="d-flex user-info">
                                        <div className="user-info-title-prop font-weight-bold">
                                          Property Name
                                        </div>
                                        <div>{propertyName}</div>
                                      </div>
                                      <div className="d-flex user-info">
                                        <div className="user-info-title-prop font-weight-bold">
                                          Address
                                        </div>
                                        <div>{propertyAddress}</div>
                                      </div>
                                      <div className="d-flex user-info">
                                        <div className="user-info-title-prop"></div>
                                        <div className="text-truncate">
                                          <span> {propertyCity}</span>
                                        </div>
                                      </div>
                                      <div className="d-flex user-info">
                                        <div className="user-info-title-prop"></div>
                                        <div className="text-truncate">
                                          <span>
                                            {propertyState} -{" "}
                                            {propertyPostalCode}
                                          </span>
                                        </div>
                                      </div>
                                      <div className="d-flex user-info">
                                        <div className="user-info-title-prop font-weight-bold">
                                          No Of Units
                                        </div>
                                        <div className="text-truncate">
                                          <span>{noOfUnits}</span>
                                        </div>
                                      </div>
                                      <div className="d-flex user-info">
                                        <div className="user-info-title-prop font-weight-bold">
                                          Occupied Units
                                        </div>
                                        <div className="text-truncate">
                                          <span>{noOfUnits}</span>
                                        </div>
                                      </div>
                                      <div className="d-flex user-info">
                                        <div className="user-info-title-prop font-weight-bold">
                                          Manager
                                        </div>
                                        <NavLink
                                          onClick={() => this.toggleModal(5)}
                                        >
                                          {proptyManager + "       "}
                                          <Assistant color="secondary" />
                                          <small className="primary">
                                            ...more info
                                          </small>
                                        </NavLink>
                                      </div>
                                      <div className="d-flex user-info">
                                        <div className="user-info-title-prop font-weight-bold">
                                          Office Number
                                        </div>
                                        <div className="text-truncate">
                                          <span>{"412-5126582"}</span>
                                        </div>
                                      </div>
                                      <div className="d-flex user-info">
                                        <div className="user-info-title-prop font-weight-bold">
                                          Owner Name
                                        </div>

                                        <NavLink
                                          onClick={() => this.toggleModal(5)}
                                        >
                                          {propOwnerName + " "}
                                          <Assistant color="secondary" />
                                          <small className="primary">
                                            ...more info
                                          </small>
                                        </NavLink>
                                      </div>
                                    </div>
                                  </Col>
                                </Row>
                              </Media>
                            </Media>
                          </Col>
                          <Col className="mt-1 pl-3" sm="12">
                            <Button.Ripple
                              color="primary"
                              onClick={() =>
                                history.push(
                                  "/propertyUpdate/" + this.state.propId
                                )
                              }
                            >
                              <Edit size={15} />
                              <span className="align-middle ml-50">
                                Update Property
                              </span>
                            </Button.Ripple>
                            <TabPane tabId="1">{renderModal}</TabPane>
                          </Col>
                        </Row>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>

                <Row>
                  {1 == 0 ? (
                    <Col xl="6" lg="6" sm="6">
                      <div>
                        <ApplicantStatus
                          primary={$primary}
                          danger={$danger}
                          white={$white}
                        />
                      </div>
                    </Col>
                  ) : (
                    <div></div>
                  )}
                  {1 == 0 ? (
                    <Col xl="6" lg="6" sm="6">
                      <div>
                        <TaskStatus
                          primary={$primary}
                          danger={$danger}
                          white={$white}
                        />
                      </div>
                    </Col>
                  ) : (
                    <div></div>
                  )}

                  <Col sm="12" md="12">
                    <Card>
                      <CardBody>
                        <Features
                          propertyId={this.state.propId}
                          menuFlag={1}
                        ></Features>

                        {renderChildren ? (
                          <Notes propertyId={propId} menuFlag={1} />
                        ) : (
                          "Loading"
                        )}

                        <hr />
                        <h6 className="primary">Files</h6>
                        <div className="users-page-view-table">
                          <Table responsive bordered>
                            <thead>
                              <tr>
                                <th
                                  style={{
                                    width: 300,
                                    height: 50,
                                  }}
                                >
                                  File Name
                                </th>
                                <th
                                  style={{
                                    width: 300,
                                    height: 50,
                                  }}
                                >
                                  Created date
                                </th>
                                <th
                                  style={{
                                    width: 300,
                                    height: 50,
                                  }}
                                >
                                  File
                                </th>
                                <th
                                  style={{
                                    width: 300,
                                    height: 50,
                                  }}
                                >
                                  Active Status
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>Lease Documents</td>
                                <td>04/31/2021</td>
                                <td>lease.pdf</td>
                                <td>Active</td>
                              </tr>
                            </tbody>
                          </Table>
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              </Form>
            );
          }}
        </Formik>
      </React.Fragment>
    );
  }
}
let $primary = "#7367F0",
  $danger = "#EA5455",
  $white = "#fff";
const ModalConfig = [
  {
    id: 5,
    title: "Owner Details",
    bgColor: "bg-primary",
  },
];

const featureOptions = [
  { value: "Club House", label: "Club House" },
  { value: "Pool", label: "Pool" },
  { value: "Elevator", label: "Elevator" },
];

const managerOption = [
  { value: "Admin", label: "Admin" },
  { value: "User", label: "User" },
];
export default Summary;
