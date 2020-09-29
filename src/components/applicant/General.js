import React from "react";
import Avatar from "../../components/@vuexy/avatar/AvatarComponent";
import { UserCheck, CheckSquare, XSquare } from "react-feather";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../assets/scss/plugins/extensions/toastr.scss";
import Helpers from "./Helpers";
import SweetAlert from "react-bootstrap-sweetalert";
import moment from "moment";
import { ContextLayout } from "../../utility/context/Layout";
import "../../assets/scss/plugins/tables/_agGridStyleOverride.scss";
import { AgGridReact } from "ag-grid-react";
import { connect } from "react-redux";

import {
  getUnits,
  getTenant,
  getUnitDetails,
} from "../../redux/actions/tenantManagement/index";

import {
  HomeWork,
  Contacts,
  KingBed,
  AspectRatio,
  Bathtub,
  AttachMoney,
  AssignmentTurnedInSharp,
  EmailSharp,
  MonetizationOn,
  Email,
  PhoneAndroid,
  ContactMail,
  PhoneIphone,
  Person,
  PermPhoneMsg,
} from "@material-ui/icons";
import {
  Alert,
  Button,
  Media,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
  Col,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  TabContent,
  TabPane,
  Modal,
  ModalHeader,
  ModalBody,
  Progress,
  UncontrolledTooltip,
  Table,
} from "reactstrap";

const formValidation = Yup.object().shape({
  leaseStartDate: Yup.string().nullable().required("Required"),
  leaseEndDate: Yup.string().required("Required"),
  mangeNotes: Yup.string().nullable().required("Required"),
});
const ModalConfig = [
  {
    id: 5,
    btnTitle: "Select Unit",
    modalTitle: "Employee Details",
    modalClass: "modal-xl",
    bgColor: "bg-primary",
  },
];

class General extends React.Component {
  dismissAlert = () => {
    this.setState({
      visible: false,
    });
  };
  state = {
    unitid: null,
    propUnitName: null,
    propUnitNumber: null,
    propNoOfBedRooms: null,
    propNoOfBathRooms: null,
    propSquareFeet: null,
    propRentAmount: null,
    unitDetails: null,
  };

  apptData = (proptyUnitId) => {
    this.setState((prevState) => ({
      proptyUnitId: proptyUnitId,
      modal: !prevState.modal,
    }));

    axios
      .post("/rentals/property/search-byunitid/", {
        proptyUnitId: proptyUnitId,
      })

      .then((response) => {
        var ress = response.data.unitDetails;
        console.log("ress.propUnitName:::" + ress.propUnitName);

        this.setState({
          propUnitName: ress.propUnitName,
          propUnitNumber: ress.propUnitNumber,
          propNoOfBedRooms: ress.propNoOfBedRooms,
          propNoOfBathRooms: ress.propNoOfBathRooms,
          propSquareFeet: ress.propSquareFeet,
          propRentAmount: ress.propRentAmount,
        });
      })
      .catch((error) => {
        console.log("Concurrent Login Issue:::" + error);
      });
  };

  //:::::::::::::::::::::Fetch Data Start:::::::::::::::::::::::::::::::::::::::::::::://
  async componentDidMount() {
    var appReqstId = this.props.applicantId;
    var applicantInfo = "";
    var emergContact = "";
    var responseCode = "";
    var token = localStorage.getItem("accessToken");
    await axios
      .post("/lease/app-search-byid/", {
        appReqstId: appReqstId,
      })

      .then((response) => {
        responseCode = response.data.responseCode;
        console.log("Search by id ::::" + responseCode);
        applicantInfo = response.data.appInfo;
        emergContact = response.data.emerContact;

        this.setState({
          firstName: applicantInfo.firstName,
          addressLineOne: applicantInfo.addressLineOne,
          addressLineTwo: applicantInfo.addressLineTwo,
          applicantCity: applicantInfo.applicantCity,
          applicantCountry: applicantInfo.applicantCountry,
          applicantState: applicantInfo.applicantState,
          applicantPostalCode: applicantInfo.applicantPostalCode,
          socialSecurityNumber: applicantInfo.socialSecurityNumber,
          emailAdress: applicantInfo.emailAdress,
          applicantPhoneNumber: applicantInfo.applicantPhoneNumber,
          applicantStatus: applicantInfo.applicantStatus,
          leaseStartDate: moment(applicantInfo.leaseStartDate).format(
            "YYYY-MM-DD"
          ),
          leaseStartDate1: moment(applicantInfo.leaseStartDate).format(
            "MM-DD-YYYY"
          ),
          leaseEndDate: moment(applicantInfo.leaseEndDate).format("YYYY-MM-DD"),
          leaseEndDate1: moment(applicantInfo.leaseStartDate).format(
            "MM-DD-YYYY"
          ),
          mangeNotes: applicantInfo.mangeNotes,
          appReqstId: applicantInfo.appReqstId,
          proptyUnitId: applicantInfo.proptyUnitId,
          emergContactName: emergContact.emergContactName,
          emergHomeContact: emergContact.emergHomeContact,
          emergContactMobile: emergContact.emergContactMobile,
          emergWorkContact: emergContact.emergWorkContact,
        });
      })
      .catch((error) => {
        console.log("Concurrent Login Issue:::" + error);
        this.componentDidMount();
      });
    if (responseCode === 1000) {
      await axios({
        method: "POST",
        url: "/rentals/property/search-all/",
      })
        .then((response) => {
          console.log("Response:::::::::::::" + response.data);
          try {
            let rowData = response.data.propUnitDtls;
            this.setState({ rowData });
          } catch (e) {
            console.log(e);
          }
        })
        .catch((error) => {
          console.log("Concurrent Login Issue:::" + error);
        });
    }
    //For Appartment Selection

    this.apptData(applicantInfo.proptyUnitId);
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

  render() {
    const {
      firstName = "",
      emailAdress = "",
      applicantStatus = "",
      leaseStartDate = "",
      leaseEndDate = "",
      leaseStartDate1 = "",
      leaseEndDate1 = "",
      mangeNotes = "",
      propertyId = "",
      propUnitName = "",
      propUnitNumber = "",
      propNoOfBedRooms = "",
      propNoOfBathRooms = "",
      propSquareFeet = "",
      propRentAmount = "",
      proptyUnitId = "",
      addressLineOne = "",
      addressLineTwo = "",
      applicantCountry = "",
      applicantCity = "",
      applicantState = "",
      applicantPostalCode = "",
      applicantPhoneNumber = "",
      socialSecurityNumber = "",
      emergContactName = "",
      emergHomeContact = "",
      emergContactMobile = "",
      emergWorkContact = "",
    } = this.state;

    return (
      <Card>
        <CardBody>
          <Formik
            enableReinitialize
            initialValues={{
              applicantStatus: applicantStatus,
              leaseStartDate: leaseStartDate,
              leaseEndDate: leaseEndDate,
              mangeNotes: mangeNotes,
              firstName: firstName,
              propertyId: propertyId,
              propUnitName: propUnitName,
              propUnitNumber: propUnitNumber,
              propNoOfBedRooms: propNoOfBedRooms,
              propNoOfBathRooms: propNoOfBathRooms,
              propSquareFeet: propSquareFeet,
              propRentAmount: propRentAmount,
              proptyUnitId: proptyUnitId,
            }}
            validationSchema={formValidation}
            //Onsubmit API Call function start////////////////////////////

            onSubmit={(values, actions) => {
              let responseCode = "";

              setTimeout(() => {
                let payload = {
                  appInfo: {
                    appReqId: this.props.applicantId,
                    applicantStatus: values.applicantStatus,
                    leaseStartDate: values.leaseStartDate,
                    leaseEndDate: values.leaseEndDate,
                    mangeNotes: values.mangeNotes,
                    proptyUnitId: values.proptyUnitId,
                  },
                };
                axios({
                  method: "POST",
                  url: "/lease/renewal-update/",
                  data: payload,
                })
                  .then((response) => {
                    responseCode = response.data.responseCode;
                    console.log("Response Code:::::::::::::" + responseCode);
                    if (responseCode == 1000) {
                      this.successMessgae("successAlert", true);
                    } else {
                      this.errorMessgae("errorAlert", true);
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
              const { setFieldValue, errors, touched } = props;

              return (
                <Form onSubmit={props.handleSubmit}>
                  <CardBody className="text-center">
                    <Avatar
                      className="mr-1"
                      icon={<UserCheck />}
                      size="xl"
                      color="success"
                    />

                    <h4 className="primary">Name : {firstName}</h4>
                    <h5 className="warning">
                      Propert Name : {propUnitName} | Unit No :{propUnitNumber}
                    </h5>

                    <div className="d-flex justify-content-between mt-1">
                      <small className="float-left font-weight-bold mb-25">
                        Lease Start Date : {leaseStartDate1}
                      </small>
                      <small className="float-left font-weight-bold mb-25">
                        Lease End Date : {leaseEndDate1}
                      </small>
                    </div>
                    <Progress className="box-shadow-1" value="75" />
                    <Row>
                      <Col md="4" sm="12">
                        <Button.Ripple
                          className="btn-icon rounded-circle"
                          color="success"
                          id="message"
                        >
                          <EmailSharp fontSize="large" />
                        </Button.Ripple>
                        <UncontrolledTooltip placement="top" target="message">
                          Message
                        </UncontrolledTooltip>
                      </Col>
                      <Col md="4" sm="12">
                        <Button.Ripple
                          className="btn-icon rounded-circle"
                          color="warning"
                          id="transaction"
                        >
                          <MonetizationOn fontSize="large" />
                        </Button.Ripple>
                        <UncontrolledTooltip
                          placement="top"
                          target="transaction"
                        >
                          Transaction
                        </UncontrolledTooltip>
                      </Col>
                      <Col md="4" sm="12">
                        <Button.Ripple
                          className="btn-icon rounded-circle"
                          color="info"
                          id="event"
                        >
                          <AssignmentTurnedInSharp />
                        </Button.Ripple>

                        <UncontrolledTooltip placement="top" target="event">
                          Event
                        </UncontrolledTooltip>
                      </Col>
                    </Row>
                  </CardBody>
                  <Row>
                    <h6 className="primary">
                      <ContactMail color="primary" size={15} /> Communication
                      Details
                    </h6>

                    <Table responsive bordered>
                      <thead>
                        <tr>
                          <th
                            style={{
                              width: 300,
                              height: 50,
                            }}
                          >
                            Permananent Address
                          </th>
                          <th
                            style={{
                              width: 300,
                              height: 50,
                            }}
                          >
                            Email
                          </th>
                          <th
                            style={{
                              width: 300,
                              height: 50,
                            }}
                          >
                            Mobile Number
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <FormGroup className="has-icon-left position-relative">
                              {addressLineOne},{addressLineTwo}
                              <br />
                              {applicantCity}, {applicantState},
                              {applicantCountry}- {applicantPostalCode}
                            </FormGroup>
                          </td>
                          <td> {emailAdress}</td>
                          <td>{applicantPhoneNumber}</td>
                        </tr>
                      </tbody>
                    </Table>
                    <h6 className="primary">
                      <ContactMail color="primary" size={15} /> Emergency
                      Contact Information
                    </h6>

                    <Table responsive bordered>
                      <thead>
                        <tr>
                          <th
                            style={{
                              width: 300,
                              height: 50,
                            }}
                          >
                            Contact Name
                          </th>
                          <th
                            style={{
                              width: 300,
                              height: 50,
                            }}
                          >
                            Mobile Number
                          </th>
                          <th
                            style={{
                              width: 300,
                              height: 50,
                            }}
                          >
                            Home Number
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{emergContactName}</td>
                          <td> {emergContactMobile}</td>
                          <td>{emergHomeContact}</td>
                        </tr>
                      </tbody>
                    </Table>
                    <h6 className="primary">
                      <HomeWork color="primary" size={15} /> Unit Details
                    </h6>

                    <Table responsive bordered>
                      <thead>
                        <tr>
                          <th
                            style={{
                              width: 300,
                              height: 50,
                            }}
                          >
                            Property Name
                          </th>
                          <th
                            style={{
                              width: 300,
                              height: 50,
                            }}
                          >
                            Unit Number
                          </th>
                          <th
                            style={{
                              width: 300,
                              height: 50,
                            }}
                          >
                            No Of Bed
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{propUnitName}</td>
                          <td> {propUnitNumber}</td>
                          <td> {propNoOfBedRooms}</td>
                        </tr>
                      </tbody>
                      <thead>
                        <tr>
                          <th
                            style={{
                              width: 300,
                              height: 50,
                            }}
                          >
                            No Of Bath
                          </th>
                          <th
                            style={{
                              width: 300,
                              height: 50,
                            }}
                          >
                            Square Feet
                          </th>
                          <th
                            style={{
                              width: 300,
                              height: 50,
                            }}
                          >
                            Rent
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{propNoOfBathRooms}</td>
                          <td> {propSquareFeet}</td>
                          <td>{propRentAmount}</td>
                        </tr>
                      </tbody>
                    </Table>
                    <hr />
                    <Col md="12" sm="12">
                      <div className="card-btns d-flex justify-content-between">
                        <Button.Ripple
                          color="danger"
                          onClick={Helpers.handleCancel}
                          className="mr-1 mb-1"
                        >
                          <XSquare size={14} />

                          <span className="align-middle ml-25">Back</span>
                        </Button.Ripple>
                      </div>
                    </Col>
                  </Row>

                  <FormGroup row>
                    <Col md={{ size: 8, offset: 4 }}>
                      {this.state.alert}
                      <ToastContainer />
                    </Col>
                  </FormGroup>
                </Form>
              );
            }}
          </Formik>
        </CardBody>
      </Card>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    property: state.manageApp.property,
  };
};

export default connect(mapStateToProps, {
  getUnits,
  getTenant,
  getUnitDetails,
})(General);
