import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import Radio from "../@vuexy/radio/RadioVuexy";
import SweetAlert from "react-bootstrap-sweetalert";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../assets/scss/plugins/extensions/toastr.scss";
import Helpers from "./Helpers";
import axios from "axios";
import moment from "moment";
import {
  Public,
  AcUnitSharp,
  Event,
  CalendarViewDay,
  Person,
  TextFields,
  ViewDay,
  Payment,
  Email,
  ContactMail,
  LocationCity,
  Map,
  Flag,
  AttachMoney,
  Business,
  Work,
  School,
  Grade,
  Wc,
  PhoneAndroid,
  PhoneAndroidSharp,
  FormatListBulleted,
  PersonOutline,
} from "@material-ui/icons";
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
  ListGroupItem,
} from "reactstrap";
import {
  User,
  Mail,
  Phone,
  Edit,
  ArrowDown,
  DollarSign,
  Book,
  Monitor,
  UserCheck,
  Briefcase,
  Tablet,
  CheckSquare,
  XSquare,
  ChevronsLeft,
} from "react-feather";
//Importv End::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

//Default Error Messgae end::::::::::::::::::::::::::::::::::::::::::::::::::::

class ApplicantForm extends React.Component {
  state = {
    roommates: [],
    successAlert: true,
  };

  constructor(props) {
    super(props);
    this.state = {
      users: [{ metFullName: "", metRelatioship: "", metDob: "" }],
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  addClick() {
    this.setState((prevState) => ({
      users: [
        ...prevState.users,
        { metFullName: "", metRelatioship: "", metDob: "" },
      ],
    }));
  }
  createUI() {
    return this.state.users.map((el, i) => (
      <div key={i}>
        <Row>
          <Col md="4" sm="12">
            <label>Full Name</label>
            <Input
              placeholder="Full Name"
              name="metFullName"
              value={el.metFullName || ""}
              onChange={this.handleChange.bind(this, i)}
              readOnly
            />
          </Col>
          <Col md="4" sm="12">
            <label>Relationship</label>
            <Input
              placeholder="Last Name"
              name="metRelatioship"
              value={el.metRelatioship || ""}
              onChange={this.handleChange.bind(this, i)}
              readOnly
            />
          </Col>
          <Col md="4" sm="12">
            <label>Date Of Birth</label>
            <Input
              placeholder="Date Of Birth"
              name="metDob"
              value={el.metDob || ""}
              onChange={this.handleChange.bind(this, i)}
              readOnly
            />
          </Col>
        </Row>
      </div>
    ));
  }
  handleChange(i, e) {
    const { name, value } = e.target;
    let users = [...this.state.users];
    users[i] = { ...users[i], [name]: value };
    this.setState({ users });
  }

  removeClick(i) {
    let users = [...this.state.users];
    users.splice(i, 1);
    this.setState({ users });
  }

  handleSubmit(event) {
    event.preventDefault();
  }
  //:::::::::::::::::::::Fetch Data Start:::::::::::::::::::::::::::::::::::::::::::::://
  async componentDidMount() {
    var appReqstId = this.props.applicantId;
    var applicantInfo = "";
    var emp = "";
    var emer = "";
    var stud = "";
    var room = "";
    var responseCode = "";
    var token = localStorage.getItem("accessToken");

    const options = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
    };

    await axios
      .post("/lease/applicant-search-byid/", {
        appReqstId: appReqstId,
      })

      .then((response) => {
        responseCode = response.data.responseCode;
        console.log("Search by id ::::" + responseCode);
        applicantInfo = response.data.appInfo;
        emp = response.data.employmentInfo;
        emer = response.data.emerContact;
        stud = response.data.studentInfo;
        room = response.data.roommates;
        this.setState({
          region: applicantInfo.region,

          sizeOfUnit: applicantInfo.sizeOfUnit,
          firstName: applicantInfo.firstName,
          dateOfBirth: applicantInfo.dateOfBirth,
          socialSecurityNumber: applicantInfo.socialSecurityNumber,
          drivingLiceseNumber: applicantInfo.drivingLiceseNumber,
          moveInDate: moment(applicantInfo.moveInDate).format("YYYY-MM-DD"),
          emailAdress: applicantInfo.emailAdress,
          addressLineOne: applicantInfo.addressLineOne,
          addressLineTwo: applicantInfo.addressLineTwo,
          applicantCity: applicantInfo.applicantCity,
          applicantState: applicantInfo.applicantState,
          applicantPostalCode: applicantInfo.applicantPostalCode,
          applicantCountry: applicantInfo.applicantCountry,
          applicantPhoneNumber: applicantInfo.applicantPhoneNumber,
          landlordName: applicantInfo.landlordName,
          landlordNumber: applicantInfo.landlordNumber,
          monthlyRent: applicantInfo.monthlyRent,
          reasonForMoving: applicantInfo.reasonForMoving,

          presentEmployer: emp.presentEmployer,
          emplAddressOne: emp.emplAddressOne,
          emplAddressTwo: emp.emplAddressTwo,
          emplCity: emp.emplCity,
          emplState: emp.emplState,
          emplPostalCode: emp.emplPostalCode,
          emplPhoneNumber: emp.emplPhoneNumber,
          emplPositionHeld: emp.emplPositionHeld,
          supervisorName: emp.supervisorName,
          datesEmployed: emp.datesEmployed,
          grossMonthlyIncome: emp.grossMonthlyIncome,

          emergContactName: emer.emergContactName,
          emergContactRelationship: emer.emergContactRelationship,
          emergContactAddLineOne: emer.emergContactAddLineOne,
          emergContactAddLineTwo: emer.emergContactAddLineTwo,
          emergContactCity: emer.emergContactCity,
          emergContactState: emer.emergContactState,
          emergContactPostalCode: emer.emergContactState,
          emergContactCountry: emer.emergContactCountry,
          emergHomeContact: emer.emergHomeContact,
          emergWorkContact: emer.emergWorkContact,
          emergContactMobile: emer.emergContactMobile,

          schoolUniversityName: stud.schoolUniversityName,
          schoolTeleNo: stud.schoolTeleNo,
          presentGrade: stud.presentGrade,
          exptdGraduDate: stud.exptdGraduDate,
        });
      })
      .catch((error) => {
        console.log("Concurrent Login Issue:::" + error);
        this.componentDidMount();
      });
  }
  render() {
    const {
      getAlert,
      state,
      region = "",
      moveInDate = "",
      sizeOfUnit = "",
      firstName = "",
      dateOfBirth = "",
      socialSecurityNumber = "",
      drivingLiceseNumber = "",
      emailAdress = "",
      addressLineOne = "",
      addressLineTwo = "",
      applicantCity = "",
      applicantState = "",
      applicantPostalCode = "",
      applicantCountry = "",
      applicantPhoneNumber = "",
      landlordName = "",
      landlordNumber = "",
      monthlyRent = "",
      reasonForMoving = "",

      presentEmployer = "",
      emplAddressOne = "",
      emplAddressTwo = "",
      emplCity = "",
      emplState = "",
      emplPostalCode = "",
      emplPhoneNumber = "",
      emplPositionHeld = "",
      supervisorName = "",
      datesEmployed = "",
      grossMonthlyIncome = "",

      emergContactName = "",
      emergContactRelationship = "",
      emergContactAddLineOne = "",
      emergContactAddLineTwo = "",
      emergContactCity = "",
      emergContactState = "",
      emergContactPostalCode = "",
      emergContactCountry = "",
      emergHomeContact = "",
      emergWorkContact = "",
      emergContactMobile = "",

      schoolUniversityName = "",
      schoolTeleNo = "",
      presentGrade = "",
      exptdGraduDate = "",
    } = this.state;
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tenant Application Form</CardTitle>
        </CardHeader>
        <CardBody>
          <Formik
            initialValues={{
              region: region,
              moveInDate: moveInDate,
              sizeOfUnit: sizeOfUnit,
              firstName: firstName,
              dateOfBirth: dateOfBirth,
              socialSecurityNumber: socialSecurityNumber,
              drivingLiceseNumber: drivingLiceseNumber,
              emailAdress: emailAdress,
              addressLineOne: addressLineOne,
              addressLineTwo: addressLineTwo,
              applicantCity: applicantCity,
              applicantState: applicantState,
              applicantPostalCode: applicantPostalCode,
              applicantCountry: applicantCountry,
              applicantPhoneNumber: applicantPhoneNumber,
              landlordName: landlordName,
              landlordNumber: landlordNumber,
              monthlyRent: monthlyRent,
              reasonForMoving: reasonForMoving,

              presentEmployer: presentEmployer,
              emplAddressOne: emplAddressOne,
              emplAddressTwo: emplAddressTwo,
              emplCity: emplCity,
              emplState: emplState,
              emplPostalCode: emplPostalCode,
              emplPhoneNumber: emplPhoneNumber,
              emplPositionHeld: emplPositionHeld,
              supervisorName: supervisorName,
              datesEmployed: datesEmployed,
              grossMonthlyIncome: grossMonthlyIncome,

              emergContactName: emergContactName,
              emergContactRelationship: emergContactRelationship,
              emergContactAddLineOne: emergContactAddLineOne,
              emergContactAddLineTwo: emergContactAddLineTwo,
              emergContactCity: emergContactCity,
              emergContactState: emergContactState,
              emergContactPostalCode: emergContactState,
              emergContactCountry: emergContactCountry,
              emergHomeContact: emergHomeContact,
              emergWorkContact: emergWorkContact,
              emergContactMobile: emergContactMobile,

              schoolUniversityName: schoolUniversityName,
              schoolTeleNo: schoolTeleNo,
              presentGrade: presentGrade,
              exptdGraduDate: exptdGraduDate,
            }}

            //Onsubmit API Call function End////////////////////////////
          >
            {(props) => {
              const { setFieldValue, errors, touched } = props;
              return (
                <Form onSubmit={props.handleSubmit}>
                  <div className="divider divider-success">
                    <div className="divider-text">
                      <PersonOutline classname="secondary" />
                      <span className="text-bold-600 mx-50">
                        Applicant Information
                      </span>
                    </div>
                  </div>

                  <Row>
                    <Col md="6" sm="12">
                      <ListGroupItem color="">
                        <Col md="12" sm="12">
                          <label>Region</label>

                          <FormGroup className="has-icon-left position-relative">
                            <Field
                              name="region"
                              value={region}
                              as="select"
                              readOnly
                              className={
                                "form-control" +
                                (errors.title && touched.title
                                  ? " is-invalid"
                                  : "")
                              }
                            >
                              <option value="1">Select</option>
                              <option value="2">South</option>
                              <option value="3">NorthEast</option>
                              <option value="4">MidWest</option>
                              <option value="5">West</option>
                            </Field>
                            <div className="form-control-position">
                              <Public />
                            </div>
                          </FormGroup>
                        </Col>

                        <Col md="12" sm="12">
                          <label>Move in Date</label>

                          <FormGroup className="has-icon-left position-relative">
                            <Field
                              className="form-control"
                              name="moveInDate"
                              placeholder="MM/DD/YYYY"
                              value={moveInDate}
                              type="date"
                              readOnly
                            />
                            <div className="form-control-position">
                              <Event />
                            </div>
                          </FormGroup>
                        </Col>
                        <Col md="12" sm="12">
                          <label>Type and Size of Unit</label>

                          <FormGroup className="has-icon-left position-relative">
                            <Field
                              className="form-control"
                              name="sizeOfUnit"
                              value={sizeOfUnit}
                              type="text"
                              readOnly
                            />
                            <div className="form-control-position">
                              <TextFields />
                            </div>
                          </FormGroup>
                        </Col>

                        <Col md="12" sm="12">
                          <label>Applicant Full Name</label>

                          <FormGroup className="has-icon-left position-relative">
                            <Field
                              className="form-control"
                              name="firstName"
                              type="text"
                              value={firstName}
                              readOnly
                            />
                            <div className="form-control-position">
                              <Person />
                            </div>
                          </FormGroup>
                        </Col>
                        <Col md="12" sm="12">
                          <label>Applicant DOB</label>

                          <FormGroup className="has-icon-left position-relative">
                            <Field
                              className="form-control"
                              name="dateOfBirth"
                              type="date"
                              value={dateOfBirth}
                              readOnly
                            />
                            <div className="form-control-position">
                              <Event />
                            </div>
                          </FormGroup>
                        </Col>
                        <Col md="12" sm="12">
                          <label>Social Security Number</label>

                          <FormGroup className="has-icon-left position-relative">
                            <Field
                              className="form-control"
                              name="socialSecurityNumber"
                              type="text"
                              value={socialSecurityNumber}
                              readOnly
                            />
                            <div className="form-control-position">
                              <ViewDay />
                            </div>
                          </FormGroup>
                        </Col>

                        <Col md="12" sm="12">
                          <label>Drive License Number</label>

                          <FormGroup className="has-icon-left position-relative">
                            <Field
                              className="form-control"
                              name="drivingLiceseNumber"
                              value={drivingLiceseNumber}
                              readOnly
                              type="text"
                            />
                            <div className="form-control-position">
                              <Payment />
                            </div>
                          </FormGroup>
                        </Col>

                        <Col md="12" sm="12">
                          <label>Email</label>

                          <FormGroup className="has-icon-left position-relative">
                            <Field
                              className="form-control"
                              name="emailAdress"
                              value={emailAdress}
                              readOnly
                              type="email"
                            />
                            <div className="form-control-position">
                              <Email />
                            </div>
                          </FormGroup>
                        </Col>
                        <Col md="12" sm="12">
                          <label>Address Line One</label>

                          <FormGroup className="has-icon-left position-relative">
                            <Field
                              className="form-control"
                              name="addressLineOne"
                              value={emailAdress}
                              readOnly
                              type="text"
                            />
                            <div className="form-control-position">
                              <ContactMail />
                            </div>
                          </FormGroup>
                        </Col>
                        <Col md="12" sm="12">
                          <label>Address Line Two</label>

                          <FormGroup className="has-icon-left position-relative">
                            <Field
                              className="form-control"
                              name="addressLineTwo"
                              value={addressLineTwo}
                              readOnly
                              type="text"
                            />
                            <div className="form-control-position">
                              <ContactMail />
                            </div>
                          </FormGroup>
                        </Col>
                      </ListGroupItem>
                    </Col>
                    <Col md="6" sm="12">
                      <ListGroupItem color="">
                        <Col md="12" sm="12">
                          <label>City</label>

                          <FormGroup className="has-icon-left position-relative">
                            <Field
                              className="form-control"
                              name="applicantCity"
                              value={applicantCity}
                              readOnly
                              type="text"
                            />
                            <div className="form-control-position">
                              <LocationCity />
                            </div>
                          </FormGroup>
                        </Col>
                        <Col md="12" sm="12">
                          <label>State</label>

                          <FormGroup className="has-icon-left position-relative">
                            <Field
                              className="form-control"
                              name="applicantState"
                              value={applicantState}
                              readOnly
                              type="text"
                            />
                            <div className="form-control-position">
                              <Public />
                            </div>
                          </FormGroup>
                        </Col>
                        <Col md="12" sm="12">
                          <label>Postal Code</label>

                          <FormGroup className="has-icon-left position-relative">
                            <Field
                              className="form-control"
                              name="applicantPostalCode"
                              value={applicantPostalCode}
                              readOnly
                              type="number"
                            />
                            <div className="form-control-position">
                              <ContactMail />
                            </div>
                          </FormGroup>
                        </Col>

                        <Col md="12" sm="12">
                          <label>Country</label>

                          <FormGroup className="has-icon-left position-relative">
                            <Field
                              className="form-control"
                              name="applicantCountry"
                              value={applicantCountry}
                              readOnly
                              type="text"
                            />
                            <div className="form-control-position">
                              <Flag />
                            </div>
                          </FormGroup>
                        </Col>

                        <Col md="12" sm="12">
                          <label>Phone Number</label>

                          <FormGroup className="has-icon-left position-relative">
                            <Field
                              className="form-control"
                              name="applicantPhoneNumber"
                              value={applicantPhoneNumber}
                              readOnly
                              type="text"
                            />
                            <div className="form-control-position">
                              <Phone />
                            </div>
                          </FormGroup>
                        </Col>
                        <Col md="12" sm="12">
                          <label>Present Landlord Name</label>

                          <FormGroup className="has-icon-left position-relative">
                            <Field
                              className="form-control"
                              name="landlordName"
                              value={landlordName}
                              readOnly
                              type="text"
                            />
                            <div className="form-control-position">
                              <Person />
                            </div>
                          </FormGroup>
                        </Col>
                        <Col md="12" sm="12">
                          <label>Present Landlord Number</label>

                          <FormGroup className="has-icon-left position-relative">
                            <Field
                              className="form-control"
                              name="landlordNumber"
                              value={landlordNumber}
                              readOnly
                              type="number"
                            />
                            <div className="form-control-position">
                              <Phone />
                            </div>
                          </FormGroup>
                        </Col>
                        <Col md="12" sm="12">
                          <label>Monthly Rent</label>

                          <FormGroup className="has-icon-left position-relative">
                            <Field
                              className="form-control"
                              name="monthlyRent"
                              value={monthlyRent}
                              readOnly
                              type="number"
                            />
                            <div className="form-control-position">
                              <AttachMoney />
                            </div>
                          </FormGroup>
                        </Col>

                        <Col md="12" sm="12">
                          <label>Reason for Moving</label>

                          <FormGroup className="has-icon-left position-relative">
                            <Field
                              name="reasonForMoving"
                              className="form-control"
                              value={reasonForMoving}
                              readOnly
                            >
                              {({
                                field, // { name, value, onChange, onBlur }
                                form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                meta,
                              }) => (
                                <div>
                                  <Input
                                    readOnly
                                    type="textarea"
                                    placeholder="Type Here"
                                    {...field}
                                  />
                                </div>
                              )}
                            </Field>
                            <div className="form-control-position">
                              <TextFields />
                            </div>
                          </FormGroup>
                        </Col>
                      </ListGroupItem>
                    </Col>
                  </Row>
                  <div className="divider divider-success">
                    <div className="divider-text">
                      <FormatListBulleted
                        fontSize="large"
                        className="primary"
                      />
                      <span className="text-bold-600 mx-50">
                        Family or Roomets Information
                      </span>
                    </div>
                  </div>

                  {this.createUI()}

                  <div className="divider divider-success">
                    <div className="divider-text">
                      <Briefcase size="18" className="primary" />
                      <span className="text-bold-600 mx-50">
                        Employment Information
                      </span>
                    </div>
                  </div>
                  <Row>
                    <Col md="6" sm="12">
                      <ListGroupItem color="">
                        <Col md="12" sm="12">
                          <label>Present Employer</label>

                          <FormGroup className="has-icon-left position-relative">
                            <Field
                              className="form-control"
                              name="presentEmployer"
                              value={presentEmployer}
                              readOnly
                              type="text"
                            />
                            <div className="form-control-position">
                              <Business />
                            </div>
                          </FormGroup>
                        </Col>
                        <Col md="12" sm="12">
                          <label>Address Line one</label>

                          <FormGroup className="has-icon-left position-relative">
                            <Field
                              className="form-control"
                              name="emplAddressOne"
                              value={emplAddressOne}
                              readOnly
                              type="text"
                            />
                            <div className="form-control-position">
                              <ContactMail />
                            </div>
                          </FormGroup>
                        </Col>
                        <Col md="12" sm="12">
                          <label>Address Line Two</label>

                          <FormGroup className="has-icon-left position-relative">
                            <Field
                              className="form-control"
                              name="emplAddressTwo"
                              value={emplAddressTwo}
                              readOnly
                              type="text"
                            />
                            <div className="form-control-position">
                              <ContactMail />
                            </div>
                          </FormGroup>
                        </Col>
                        <Col md="12" sm="12">
                          <label>City</label>

                          <FormGroup className="has-icon-left position-relative">
                            <Field
                              className="form-control"
                              name="emplCity"
                              value={emplCity}
                              readOnly
                              type="text"
                            />
                            <div className="form-control-position">
                              <LocationCity />
                            </div>
                          </FormGroup>
                        </Col>
                        <Col md="12" sm="12">
                          <label>State</label>

                          <FormGroup className="has-icon-left position-relative">
                            <Field
                              className="form-control"
                              name="emplState"
                              value={emplState}
                              readOnly
                              type="text"
                            />
                            <div className="form-control-position">
                              <Public />
                            </div>
                          </FormGroup>
                        </Col>
                        <Col md="12" sm="12">
                          <label>Postal Code</label>

                          <FormGroup className="has-icon-left position-relative">
                            <Field
                              className="form-control"
                              name="emplPostalCode"
                              value={emplPostalCode}
                              readOnly
                              type="number"
                            />
                            <div className="form-control-position">
                              <ContactMail />
                            </div>
                          </FormGroup>
                        </Col>
                      </ListGroupItem>
                    </Col>
                    <Col md="6" sm="12">
                      <ListGroupItem color="">
                        <Col md="12" sm="12">
                          <label>Office Number</label>

                          <FormGroup className="has-icon-left position-relative">
                            <Field
                              className="form-control"
                              name="emplPhoneNumber"
                              value={emplPhoneNumber}
                              readOnly
                              type="text"
                            />
                            <div className="form-control-position">
                              <Phone />
                            </div>
                          </FormGroup>
                        </Col>
                        <Col md="12" sm="12">
                          <label>Position Held</label>

                          <FormGroup className="has-icon-left position-relative">
                            <Field
                              className="form-control"
                              name="emplPositionHeld"
                              value={emplPositionHeld}
                              readOnly
                              type="text"
                            />
                            <div className="form-control-position">
                              <Work />
                            </div>
                          </FormGroup>
                        </Col>
                        <Col md="12" sm="12">
                          <label>Supervisor Name</label>

                          <FormGroup className="has-icon-left position-relative">
                            <Field
                              className="form-control"
                              name="supervisorName"
                              value={supervisorName}
                              readOnly
                              type="text"
                            />
                            <div className="form-control-position">
                              <Person />
                            </div>
                          </FormGroup>
                        </Col>
                        <Col md="12" sm="12">
                          <label>Dates Employed</label>

                          <FormGroup className="has-icon-left position-relative">
                            <Field
                              className="form-control"
                              name="datesEmployed"
                              value={datesEmployed}
                              readOnly
                              type="date"
                            />
                            <div className="form-control-position">
                              <Event />
                            </div>
                          </FormGroup>
                        </Col>
                        <Col md="12" sm="12">
                          <label>Gross Monthly Income</label>

                          <FormGroup className="has-icon-left position-relative">
                            <Field
                              className="form-control"
                              name="grossMonthlyIncome"
                              value={grossMonthlyIncome}
                              readOnly
                              type="number"
                            />
                            <div className="form-control-position">
                              <AttachMoney />
                            </div>
                          </FormGroup>
                        </Col>
                      </ListGroupItem>
                    </Col>
                  </Row>
                  <div className="divider divider-success">
                    <div className="divider-text">
                      <Tablet size="18" className="primary" />
                      <span className="text-bold-600 mx-50">
                        Students Information
                      </span>
                    </div>
                  </div>
                  <Row>
                    <Col md="6" sm="12">
                      <ListGroupItem color="">
                        <Col md="12" sm="12">
                          <label>Name of School or University</label>

                          <FormGroup className="has-icon-left position-relative">
                            <Field
                              className="form-control"
                              name="schoolUniversityName"
                              value={schoolUniversityName}
                              readOnly
                              type="text"
                            />
                            <div className="form-control-position">
                              <School />
                            </div>
                          </FormGroup>
                        </Col>
                        <Col md="12" sm="12">
                          <label>Phone Number</label>

                          <FormGroup className="has-icon-left position-relative">
                            <Field
                              className="form-control"
                              name="schoolTeleNo"
                              value={schoolTeleNo}
                              readOnly
                              type="text"
                            />
                            <div className="form-control-position">
                              <Phone />
                            </div>
                          </FormGroup>
                        </Col>
                      </ListGroupItem>
                    </Col>
                    <Col md="6" sm="12">
                      <ListGroupItem color="">
                        <Col md="12" sm="12">
                          <label>Present Grade</label>

                          <FormGroup className="has-icon-left position-relative">
                            <Field
                              className="form-control"
                              name="presentGrade"
                              value={presentGrade}
                              readOnly
                              type="text"
                            />
                            <div className="form-control-position">
                              <Grade />
                            </div>
                          </FormGroup>
                        </Col>
                        <Col md="12" sm="12">
                          <label>Expected Date of Graduation</label>

                          <FormGroup className="has-icon-left position-relative">
                            <Field
                              className="form-control"
                              name="exptdGraduDate"
                              value={exptdGraduDate}
                              readOnly
                              type="date"
                            />
                            <div className="form-control-position">
                              <Event />
                            </div>
                          </FormGroup>
                        </Col>
                      </ListGroupItem>
                    </Col>
                  </Row>
                  <div className="divider divider-success">
                    <div className="divider-text">
                      <XSquare size="18" className="primary" />
                      <span className="text-bold-600 mx-50">
                        Emergency Contact
                      </span>
                    </div>
                  </div>
                  <Row>
                    <Col md="6" sm="12">
                      <ListGroupItem color="">
                        <Col md="12" sm="12">
                          <label>Name</label>

                          <FormGroup className="has-icon-left position-relative">
                            <Field
                              className="form-control"
                              name="emergContactName"
                              value={emergContactName}
                              readOnly
                              type="text"
                            />
                            <div className="form-control-position">
                              <Person />
                            </div>
                          </FormGroup>
                        </Col>
                        <Col md="12" sm="12">
                          <label>Relationship</label>

                          <FormGroup className="has-icon-left position-relative">
                            <Field
                              className="form-control"
                              name="emergContactRelationship"
                              value={emergContactRelationship}
                              readOnly
                              type="text"
                            />
                            <div className="form-control-position">
                              <Wc />
                            </div>
                          </FormGroup>
                        </Col>
                        <Col md="12" sm="12">
                          <label>Address Line one</label>

                          <FormGroup className="has-icon-left position-relative">
                            <Field
                              className="form-control"
                              name="emergContactAddLineOne"
                              value={emergContactAddLineOne}
                              readOnly
                              type="text"
                            />
                            <div className="form-control-position">
                              <ContactMail />
                            </div>
                          </FormGroup>
                        </Col>
                        <Col md="12" sm="12">
                          <label>Address Line Two</label>

                          <FormGroup className="has-icon-left position-relative">
                            <Field
                              className="form-control"
                              name="emergContactAddLineTwo"
                              value={emergContactAddLineTwo}
                              readOnly
                              type="text"
                            />
                            <div className="form-control-position">
                              <ContactMail />
                            </div>
                          </FormGroup>
                        </Col>
                        <Col md="12" sm="12">
                          <label>City</label>

                          <FormGroup className="has-icon-left position-relative">
                            <Field
                              className="form-control"
                              name="emergContactCity"
                              value={emergContactCity}
                              readOnly
                              type="text"
                            />
                            <div className="form-control-position">
                              <LocationCity />
                            </div>
                          </FormGroup>
                        </Col>
                      </ListGroupItem>
                    </Col>
                    <Col md="6" sm="12">
                      <ListGroupItem color="">
                        <Col md="12" sm="12">
                          <label>State</label>

                          <FormGroup className="has-icon-left position-relative">
                            <Field
                              className="form-control"
                              name="emergContactState"
                              value={emergContactState}
                              readOnly
                              type="text"
                            />
                            <div className="form-control-position">
                              <Public />
                            </div>
                          </FormGroup>
                        </Col>
                        <Col md="12" sm="12">
                          <label>Postal Code</label>

                          <FormGroup className="has-icon-left position-relative">
                            <Field
                              className="form-control"
                              name="emergContactPostalCode"
                              value={emergContactPostalCode}
                              readOnly
                              type="text"
                            />
                            <div className="form-control-position">
                              <ContactMail />
                            </div>
                          </FormGroup>
                        </Col>
                        <Col md="12" sm="12">
                          <label>Country</label>

                          <FormGroup className="has-icon-left position-relative">
                            <Field
                              className="form-control"
                              name="emergContactCountry"
                              value={emergContactCountry}
                              readOnly
                              type="text"
                            />
                            <div className="form-control-position">
                              <Flag />
                            </div>
                          </FormGroup>
                        </Col>
                        <Col md="12" sm="12">
                          <label>Home Phone Number</label>

                          <FormGroup className="has-icon-left position-relative">
                            <Field
                              className="form-control"
                              name="emergHomeContact"
                              value={emergHomeContact}
                              readOnly
                              type="number"
                            />
                            <div className="form-control-position">
                              <Phone />
                            </div>
                          </FormGroup>
                        </Col>
                        <Col md="12" sm="12">
                          <label>Work Phone Number</label>

                          <FormGroup className="has-icon-left position-relative">
                            <Field
                              className="form-control"
                              name="emergWorkContact"
                              value={emergWorkContact}
                              readOnly
                              type="number"
                            />
                            <div className="form-control-position">
                              <PhoneAndroid />
                            </div>
                          </FormGroup>
                        </Col>
                        <Col md="12" sm="12">
                          <label>Phone Number</label>

                          <FormGroup className="has-icon-left position-relative">
                            <Field
                              className="form-control"
                              name="emergContactMobile"
                              value={emergContactMobile}
                              readOnly
                              type="text"
                            />
                            <div className="form-control-position">
                              <PhoneAndroidSharp />
                            </div>
                          </FormGroup>
                        </Col>
                      </ListGroupItem>
                    </Col>
                  </Row>
                  <div className="divider divider-warning">
                    <div className="divider-text"></div>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </CardBody>
      </Card>
    );
  }
}
export default ApplicantForm;
