import React from "react";
import Avatar from "../@vuexy/avatar/AvatarComponent";
import { UserCheck, XSquare } from "react-feather";
import { Formik } from "formik";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../assets/scss/plugins/extensions/toastr.scss";
import Helpers from "./Helpers";
import moment from "moment";
import "../../assets/scss/plugins/tables/_agGridStyleOverride.scss";
import { connect } from "react-redux";

import {
  getUnits,
  getTenant,
  getUnitDetails,
} from "../../redux/actions/tenantManagement/index";

import {
  HomeWork,
  AssignmentTurnedInSharp,
  EmailSharp,
  MonetizationOn,
  ContactMail,
} from "@material-ui/icons";
import {
  Button,
  Form,
  FormGroup,
  Row,
  Col,
  Card,
  CardBody,
  Progress,
  UncontrolledTooltip,
  Table,
} from "reactstrap";

class LeaseView extends React.Component {
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

  async componentDidMount() {
    var appReqstId = this.props.match.params.appReqId;
    var applicantInfo = "";
    var emergContact = "";
    var responseCode = "";
    await axios
      .post("/lease/app-search-byid/", {
        appReqstId: appReqstId,
      })

      .then((response) => {
        responseCode = response.data.responseCode;
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
      });

    await axios
      .post("/rentals/property/search-byunitid/", {
        proptyUnitId: applicantInfo.proptyUnitId,
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
        console.log("error:::" + error);
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
      emergContactName = "",
      emergHomeContact = "",
      emergContactMobile = "",
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
          >
            {(props) => {
              const { setFieldValue, errors, touched } = props;

              return (
                <Form>
                  <CardBody className="text-center">
                    <Row>
                      <Col md="2" sm="12"></Col>
                      <Col md="8" sm="12">
                        <Avatar
                          className="mr-1"
                          icon={<UserCheck />}
                          size="xl"
                          color="success"
                        />

                        <h4 className="primary">Name : {firstName}</h4>
                        <h5 className="warning">
                          Propert Name : {propUnitName} | Unit No :
                          {propUnitNumber}
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
                      </Col>
                      <Col md="2" sm="12"></Col>
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
})(LeaseView);
