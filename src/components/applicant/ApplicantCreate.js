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
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
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

//Default Error Messgae::::::::::::::::::::::::::::::::::::::::::::::::::::
const phoneRegExp = /^((\+\d{1,3}(-| )?\(?\d\)?(-| )?\d{1,3})|(\(?\d{2,3}\)?))(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$/;
const ssnRegExp = /(^\d{9}$)|(^\d{9}-\d{4}$)/;
const dlRegExp = /(^[a-zA-Z0-9_]*$)/;
const formValidation = Yup.object().shape({
  region: Yup.number().required("Required"),
  moveInDate: Yup.string().required("Required"),
  sizeOfUnit: Yup.string().required("Required"),
  firstName: Yup.string()
    .max(20, "Must be 20 characters or less")
    .required("Required"),
  dateOfBirth: Yup.string().required("Required"),
  //socialSecurityNumber: Yup.number().max(9, "Max limit 9").required("Required"),
  socialSecurityNumber: Yup.string()
    .matches(ssnRegExp, "Invalid SSN number")
    .required("Required"),
  //drivingLiceseNumber: Yup.number().max(8, " Max limit 8").required("Required"),
  drivingLiceseNumber: Yup.string()
    .matches(dlRegExp, "Invalid Driving License Number")
    .max(8, "Max limit 8")
    .min(8, "Min limit 8")
    .required("Required"),
  emailAdress: Yup.string().email("Invalid email address").required("Required"),
  addressLineOne: Yup.string().required("Required"),
  addressLineTwo: Yup.string().required("Required"),
  applicantCity: Yup.string().required("Required"),
  applicantState: Yup.string().max(2, "Max limit 2").required("Required"),
  applicantPostalCode: Yup.string()
    .matches(/(^\d{5}$)|(^\d{5}-\d{4}$)/, "Invalid PostalCode")
    .required("Required"),
  applicantCountry: Yup.string().required("Required"),
  applicantPhoneNumber: Yup.number().required("Required"),
  landlordName: Yup.string().required("Required"),
  landlordNumber: Yup.number().required("Required"),
  monthlyRent: Yup.number().required("Required"),
  reasonForMoving: Yup.string().required("Required"),
  //Employement Form
  presentEmployer: Yup.string().required("Required"),
  emplAddressOne: Yup.string().required("Required"),
  emplAddressTwo: Yup.string().required("Required"),
  emplCity: Yup.string().required("Required"),
  emplState: Yup.string().required("Required"),
  emplPostalCode: Yup.number().required("Required"),
  emplPhoneNumber: Yup.string()
    .matches(phoneRegExp, "Phone number is not valid")
    .required("Required"),
  emplPositionHeld: Yup.string().required("Required"),
  supervisorName: Yup.string().required("Required"),
  datesEmployed: Yup.string().required("Required"),
  grossMonthlyIncome: Yup.number().required("Required"),

  //Emergency Form

  emergContactName: Yup.string().required("Required"),
  emergContactRelationship: Yup.string().required("Required"),
  emergContactAddLineOne: Yup.string().required("Required"),
  emergContactAddLineTwo: Yup.string().required("Required"),
  emergContactCity: Yup.string().required("Required"),
  emergContactState: Yup.string().max(2, "Max limit 2").required("Required"),
  emergContactPostalCode: Yup.number().required("Required"),
  emergContactCountry: Yup.string().required("Required"),
  emergHomeContact: Yup.number().required("Required"),
  emergWorkContact: Yup.number().required("Required"),
  emergContactMobile: Yup.string()
    .matches(phoneRegExp, "Phone number is not valid")
    .required("Required"),

  //Emergency Form
});
//Default Error Messgae end::::::::::::::::::::::::::::::::::::::::::::::::::::

class ApplicantCreate extends React.Component {
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
          <Col md="3" sm="12">
            <label>Full Name</label>
            <Input
              placeholder="Full Name"
              name="metFullName"
              value={el.metFullName || ""}
              onChange={this.handleChange.bind(this, i)}
            />
          </Col>
          <Col md="3" sm="12">
            <label>Relationship</label>
            <Input
              placeholder="Last Name"
              name="metRelatioship"
              value={el.metRelatioship || ""}
              onChange={this.handleChange.bind(this, i)}
            />
          </Col>
          <Col md="3" sm="12">
            <label>Date Of Birth</label>
            <Input
              placeholder="Date Of Birth"
              name="metDob"
              value={el.metDob || ""}
              onChange={this.handleChange.bind(this, i)}
            />
          </Col>
          <Col md="3" sm="12">
            <Button.Ripple
              color="primary"
              className="mr-1 mb-1"
              onClick={this.removeClick.bind(this, i)}
            >
              <CheckSquare size={14} />

              <span className="align-middle ml-25">X</span>
            </Button.Ripple>
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
  successMessgae(state, value) {
    const getAlert = () => (
      <SweetAlert
        success
        confirmBtnText="Ok!"
        title="Success"
        show={this.state.successAlert}
        onConfirm={() => Helpers.redirectSearch()}
      >
        <p className="sweet-alert-text">Request Sussessfully Added</p>
      </SweetAlert>
    );
    this.setState({
      alert: getAlert(),
    });
  }

  render() {
    const { getAlert, state } = this.state;
    return (
      <React.Fragment>
        <Card>
          <CardHeader>
            <CardTitle>Rental Application</CardTitle>
          </CardHeader>
          <CardBody>
            <Formik
              initialValues={{
                region: 1,
                moveInDate: "2020-04-30",
                sizeOfUnit: "599",
                firstName: "SK Moorthy",
                dateOfBirth: "1989-07-06",
                socialSecurityNumber: "999977777",
                drivingLiceseNumber: "DL00234J",
                emailAdress: "sk@gmail.com",
                addressLineOne: "test Address one",
                addressLineTwo: "test address two",
                applicantCity: "chennai",
                applicantState: "NY",
                applicantPostalCode: 67232,
                applicantCountry: 12,
                applicantPhoneNumber: "9840642421",
                landlordName: "ABC GROUP",
                landlordNumber: "9840642421",
                monthlyRent: 12,
                reasonForMoving: "test move",

                presentEmployer: "Planet Info Tech",
                emplAddressOne: "line one",
                emplAddressTwo: "line two",
                emplCity: "new york",
                emplState: "new york",
                emplPostalCode: "453433",
                emplPhoneNumber: "9840642421",
                emplPositionHeld: "SSE",
                supervisorName: "XCV",
                datesEmployed: "2020-02-01",
                grossMonthlyIncome: 34534,

                emergContactName: "XYZ",
                emergContactRelationship: "Friend",
                emergContactAddLineOne: "address one",
                emergContactAddLineTwo: "address two",
                emergContactCity: "New York",
                emergContactState: "NY",
                emergContactPostalCode: "63475",
                emergContactCountry: 234,
                emergHomeContact: "9840642421",
                emergWorkContact: "9840642421",
                emergContactMobile: "9840642421",

                schoolUniversityName: "SREC",
                schoolTeleNo: "9840642421",
                presentGrade: "G1",
                exptdGraduDate: "2012-05-03",
              }}
              validationSchema={formValidation}
              //Onsubmit API Call function start////////////////////////////
              onSubmit={(values, actions) => {
                var info = JSON.stringify(this.state.users);
                var infoX = JSON.parse(info);
                console.log("infox");
                console.log(infoX);
                let responseCode = "";
                setTimeout(() => {
                  let payload = {
                    appHdr: {},
                    appInfo: {
                      region: values.region,
                      moveInDate: values.moveInDate,
                      sizeOfUnit: values.sizeOfUnit,
                      firstName: values.firstName,
                      dateOfBirth: values.dateOfBirth,
                      socialSecurityNumber: values.socialSecurityNumber,
                      drivingLiceseNumber: values.drivingLiceseNumber,
                      emailAdress: values.emailAdress,
                      addressLineOne: values.addressLineOne,
                      addressLineTwo: values.addressLineTwo,
                      applicantCity: values.applicantCity,
                      applicantState: values.applicantState,
                      applicantPostalCode: values.applicantPostalCode,
                      applicantCountry: values.applicantCountry,
                      applicantPhoneNumber: values.applicantPhoneNumber,
                      landlordName: values.landlordName,
                      landlordNumber: values.landlordNumber,
                      monthlyRent: values.monthlyRent,
                      reasonForMoving: values.reasonForMoving,
                    },

                    employmentInfo: {
                      presentEmployer: values.presentEmployer,
                      emplAddressOne: values.emplAddressOne,
                      emplAddressTwo: values.emplAddressTwo,
                      emplCity: values.emplCity,
                      emplState: values.emplState,
                      emplPostalCode: values.emplPostalCode,
                      emplPhoneNumber: values.emplPhoneNumber,
                      emplPositionHeld: values.emplPositionHeld,
                      supervisorName: values.supervisorName,
                      datesEmployed: values.datesEmployed,
                      grossMonthlyIncome: values.grossMonthlyIncome,
                    },

                    emerContact: {
                      emergContactName: values.emergContactName,
                      emergContactRelationship: values.emergContactName,
                      emergContactAddLineOne: values.emergContactAddLineOne,
                      emergContactAddLineTwo: values.emergContactAddLineTwo,
                      emergContactCity: values.emergContactCity,
                      emergContactState: values.emergContactState,
                      emergContactPostalCode: values.emergContactPostalCode,
                      emergContactCountry: values.emergContactCountry,
                      emergHomeContact: values.emergHomeContact,
                      emergWorkContact: values.emergWorkContact,
                      emergContactMobile: values.emergContactMobile,
                    },

                    studentInfo: {
                      schoolUniversityName: values.schoolUniversityName,
                      schoolTeleNo: values.schoolTeleNo,
                      presentGrade: values.presentGrade,
                      exptdGraduDate: values.exptdGraduDate,
                    },

                    roommates: infoX,
                    //this.infoX,
                  };
                  axios({
                    method: "POST",
                    url: "/lease/applicant-req/",
                    data: payload,
                  })
                    .then((response) => {
                      responseCode = response.data.responseCode;
                      console.log("responseCode " + responseCode);
                      if (responseCode == 1000) {
                        this.successMessgae("successAlert", true);
                      } else {
                        toast.error("Bad Request");
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
                    <div>
                      <div>
                        <div>
                          <div>
                            <PerfectScrollbar>
                              <div className="divider divider-success">
                                <div className="divider-text">
                                  <Person
                                    color="secondary"
                                    style={{ fontSize: 40 }}
                                  />
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
                                          as="select"
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
                                        <ErrorMessage
                                          name="region"
                                          component="div"
                                          className="field-error text-danger"
                                        />
                                      </FormGroup>
                                    </Col>

                                    <Col md="12" sm="12">
                                      <label>Move in Date</label>

                                      <FormGroup className="has-icon-left position-relative">
                                        <Field
                                          className="form-control"
                                          name="moveInDate"
                                          placeholder="MM/DD/YYYY"
                                          type="date"
                                        />
                                        <div className="form-control-position">
                                          <Event />
                                        </div>
                                        <ErrorMessage
                                          name="moveInDate"
                                          component="div"
                                          className="field-error text-danger"
                                        />
                                      </FormGroup>
                                    </Col>
                                    <Col md="12" sm="12">
                                      <label>Type and Size of Unit</label>

                                      <FormGroup className="has-icon-left position-relative">
                                        <Field
                                          className="form-control"
                                          name="sizeOfUnit"
                                          placeholder="Type Here"
                                          type="text"
                                        />
                                        <div className="form-control-position">
                                          <TextFields />
                                        </div>
                                        <ErrorMessage
                                          name="sizeOfUnit"
                                          component="div"
                                          className="field-error text-danger"
                                        />
                                      </FormGroup>
                                    </Col>

                                    <Col md="12" sm="12">
                                      <label>Applicant Full Name</label>

                                      <FormGroup className="has-icon-left position-relative">
                                        <Field
                                          className="form-control"
                                          name="firstName"
                                          placeholder="Type FullName"
                                          type="text"
                                        />
                                        <div className="form-control-position">
                                          <Person />
                                        </div>
                                        <ErrorMessage
                                          name="firstName"
                                          component="div"
                                          className="field-error text-danger"
                                        />
                                      </FormGroup>
                                    </Col>
                                    <Col md="12" sm="12">
                                      <label>Applicant DOB</label>

                                      <FormGroup className="has-icon-left position-relative">
                                        <Field
                                          className="form-control"
                                          name="dateOfBirth"
                                          placeholder="MM/DD/YYYY"
                                          type="date"
                                        />
                                        <div className="form-control-position">
                                          <Event />
                                        </div>
                                        <ErrorMessage
                                          name="dateOfBirth"
                                          component="div"
                                          className="field-error text-danger"
                                        />
                                      </FormGroup>
                                    </Col>
                                    <Col md="12" sm="12">
                                      <label>Social Security Number</label>

                                      <FormGroup className="has-icon-left position-relative">
                                        <Field
                                          className="form-control"
                                          name="socialSecurityNumber"
                                          placeholder="123-45-XXXX"
                                          type="text"
                                        />
                                        <div className="form-control-position">
                                          <ViewDay />
                                        </div>
                                        <ErrorMessage
                                          name="socialSecurityNumber"
                                          component="div"
                                          className="field-error text-danger"
                                        />
                                      </FormGroup>
                                    </Col>

                                    <Col md="12" sm="12">
                                      <label>Drive License Number</label>

                                      <FormGroup className="has-icon-left position-relative">
                                        <Field
                                          className="form-control"
                                          name="drivingLiceseNumber"
                                          placeholder="12 34 5678"
                                          type="text"
                                        />
                                        <div className="form-control-position">
                                          <Payment />
                                        </div>
                                        <ErrorMessage
                                          name="drivingLiceseNumber"
                                          component="div"
                                          className="field-error text-danger"
                                        />
                                      </FormGroup>
                                    </Col>

                                    <Col md="12" sm="12">
                                      <label>Email</label>

                                      <FormGroup className="has-icon-left position-relative">
                                        <Field
                                          className="form-control"
                                          name="emailAdress"
                                          placeholder="abcd@gmail.com"
                                          type="email"
                                        />
                                        <div className="form-control-position">
                                          <Email />
                                        </div>
                                        <ErrorMessage
                                          name="emailAdress"
                                          component="div"
                                          className="field-error text-danger"
                                        />
                                      </FormGroup>
                                    </Col>
                                    <Col md="12" sm="12">
                                      <label>Address Line One</label>

                                      <FormGroup className="has-icon-left position-relative">
                                        <Field
                                          className="form-control"
                                          name="addressLineOne"
                                          placeholder="1234 ABCD Street"
                                          type="text"
                                        />
                                        <div className="form-control-position">
                                          <ContactMail />
                                        </div>
                                        <ErrorMessage
                                          name="addressLineOne"
                                          component="div"
                                          className="field-error text-danger"
                                        />
                                      </FormGroup>
                                    </Col>
                                    <Col md="12" sm="12">
                                      <label>Address Line Two</label>

                                      <FormGroup className="has-icon-left position-relative">
                                        <Field
                                          className="form-control"
                                          name="addressLineTwo"
                                          placeholder="Building"
                                          type="text"
                                        />
                                        <div className="form-control-position">
                                          <ContactMail />
                                        </div>
                                        <ErrorMessage
                                          name="addressLineTwo"
                                          component="div"
                                          className="field-error text-danger"
                                        />
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
                                          placeholder="City"
                                          type="text"
                                        />
                                        <div className="form-control-position">
                                          <LocationCity />
                                        </div>
                                        <ErrorMessage
                                          name="applicantCity"
                                          component="div"
                                          className="field-error text-danger"
                                        />
                                      </FormGroup>
                                    </Col>
                                    <Col md="12" sm="12">
                                      <label>State</label>

                                      <FormGroup className="has-icon-left position-relative">
                                        <Field
                                          className="form-control"
                                          name="applicantState"
                                          placeholder="XY"
                                          type="text"
                                        />
                                        <div className="form-control-position">
                                          <Public />
                                        </div>
                                        <ErrorMessage
                                          name="applicantState"
                                          component="div"
                                          className="field-error text-danger"
                                        />
                                      </FormGroup>
                                    </Col>
                                    <Col md="12" sm="12">
                                      <label>Postal Code</label>

                                      <FormGroup className="has-icon-left position-relative">
                                        <Field
                                          className="form-control"
                                          name="applicantPostalCode"
                                          placeholder="Zipcode"
                                          type="number"
                                        />
                                        <div className="form-control-position">
                                          <ContactMail />
                                        </div>
                                        <ErrorMessage
                                          name="applicantPostalCode"
                                          component="div"
                                          className="field-error text-danger"
                                        />
                                      </FormGroup>
                                    </Col>

                                    <Col md="12" sm="12">
                                      <label>Country</label>

                                      <FormGroup className="has-icon-left position-relative">
                                        <Field
                                          className="form-control"
                                          name="applicantCountry"
                                          placeholder="Country"
                                          type="text"
                                        />
                                        <div className="form-control-position">
                                          <Flag />
                                        </div>
                                        <ErrorMessage
                                          name="applicantCountry"
                                          component="div"
                                          className="field-error text-danger"
                                        />
                                      </FormGroup>
                                    </Col>

                                    <Col md="12" sm="12">
                                      <label>Phone Number</label>

                                      <FormGroup className="has-icon-left position-relative">
                                        <Field
                                          className="form-control"
                                          name="applicantPhoneNumber"
                                          placeholder="0123456789"
                                          type="text"
                                        />
                                        <div className="form-control-position">
                                          <Phone />
                                        </div>
                                        <ErrorMessage
                                          name="applicantPhoneNumber"
                                          component="div"
                                          className="field-error text-danger"
                                        />
                                      </FormGroup>
                                    </Col>
                                    <Col md="12" sm="12">
                                      <label>Present Landlord Name</label>

                                      <FormGroup className="has-icon-left position-relative">
                                        <Field
                                          className="form-control"
                                          name="landlordName"
                                          placeholder="FullName"
                                          type="text"
                                        />
                                        <div className="form-control-position">
                                          <Person />
                                        </div>
                                        <ErrorMessage
                                          name="landlordName"
                                          component="div"
                                          className="field-error text-danger"
                                        />
                                      </FormGroup>
                                    </Col>
                                    <Col md="12" sm="12">
                                      <label>Present Landlord Number</label>

                                      <FormGroup className="has-icon-left position-relative">
                                        <Field
                                          className="form-control"
                                          name="landlordNumber"
                                          placeholder="0987654321"
                                          type="number"
                                        />
                                        <div className="form-control-position">
                                          <Phone />
                                        </div>
                                        <ErrorMessage
                                          name="landlordNumber"
                                          component="div"
                                          className="field-error text-danger"
                                        />
                                      </FormGroup>
                                    </Col>
                                    <Col md="12" sm="12">
                                      <label>Monthly Rent</label>

                                      <FormGroup className="has-icon-left position-relative">
                                        <Field
                                          className="form-control"
                                          name="monthlyRent"
                                          placeholder="$$"
                                          type="number"
                                        />
                                        <div className="form-control-position">
                                          <AttachMoney />
                                        </div>
                                        <ErrorMessage
                                          name="monthlyRent"
                                          component="div"
                                          className="field-error text-danger"
                                        />
                                      </FormGroup>
                                    </Col>

                                    <Col md="12" sm="12">
                                      <label>Reason for Moving</label>

                                      <FormGroup className="has-icon-left position-relative">
                                        <Field
                                          name="reasonForMoving"
                                          className="form-control"
                                          placeholder="Type Here"
                                        >
                                          {({
                                            field, // { name, value, onChange, onBlur }
                                            form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                            meta,
                                          }) => (
                                            <div>
                                              <Input
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
                                        <ErrorMessage
                                          name="reasonForMoving"
                                          component="div"
                                          className="field-error text-danger"
                                        />
                                      </FormGroup>
                                    </Col>
                                  </ListGroupItem>
                                </Col>
                              </Row>
                              <div className="divider divider-success">
                                <div className="divider-text">
                                  <Briefcase
                                    fontSize="large"
                                    className="primary"
                                  />
                                  <span className="text-bold-600 mx-50">
                                    Family or Roomets Information
                                  </span>
                                </div>
                              </div>

                              {this.createUI()}
                              <Button.Ripple
                                color="primary"
                                className="mr-1 mb-1"
                                onClick={this.addClick.bind(this)}
                              >
                                <CheckSquare size={14} />

                                <span className="align-middle ml-25">Add</span>
                              </Button.Ripple>

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
                                          placeholder="Company Name"
                                          type="text"
                                        />
                                        <div className="form-control-position">
                                          <Business />
                                        </div>
                                        <ErrorMessage
                                          name="presentEmployer"
                                          component="div"
                                          className="field-error text-danger"
                                        />
                                      </FormGroup>
                                    </Col>
                                    <Col md="12" sm="12">
                                      <label>Address Line one</label>

                                      <FormGroup className="has-icon-left position-relative">
                                        <Field
                                          className="form-control"
                                          name="emplAddressOne"
                                          placeholder="1234 ABCD Street"
                                          type="text"
                                        />
                                        <div className="form-control-position">
                                          <ContactMail />
                                        </div>
                                        <ErrorMessage
                                          name="emplAddressOne"
                                          component="div"
                                          className="field-error text-danger"
                                        />
                                      </FormGroup>
                                    </Col>
                                    <Col md="12" sm="12">
                                      <label>Address Line Two</label>

                                      <FormGroup className="has-icon-left position-relative">
                                        <Field
                                          className="form-control"
                                          name="emplAddressTwo"
                                          placeholder="Building"
                                          type="text"
                                        />
                                        <div className="form-control-position">
                                          <ContactMail />
                                        </div>
                                        <ErrorMessage
                                          name="emplAddressTwo"
                                          component="div"
                                          className="field-error text-danger"
                                        />
                                      </FormGroup>
                                    </Col>
                                    <Col md="12" sm="12">
                                      <label>City</label>

                                      <FormGroup className="has-icon-left position-relative">
                                        <Field
                                          className="form-control"
                                          name="emplCity"
                                          placeholder="City"
                                          type="text"
                                        />
                                        <div className="form-control-position">
                                          <LocationCity />
                                        </div>
                                        <ErrorMessage
                                          name="emplCity"
                                          component="div"
                                          className="field-error text-danger"
                                        />
                                      </FormGroup>
                                    </Col>
                                    <Col md="12" sm="12">
                                      <label>State</label>

                                      <FormGroup className="has-icon-left position-relative">
                                        <Field
                                          className="form-control"
                                          name="emplState"
                                          placeholder="YZ"
                                          type="text"
                                        />
                                        <div className="form-control-position">
                                          <Public />
                                        </div>
                                        <ErrorMessage
                                          name="emplState"
                                          component="div"
                                          className="field-error text-danger"
                                        />
                                      </FormGroup>
                                    </Col>
                                    <Col md="12" sm="12">
                                      <label>Postal Code</label>

                                      <FormGroup className="has-icon-left position-relative">
                                        <Field
                                          className="form-control"
                                          name="emplPostalCode"
                                          placeholder="ZipCode"
                                          type="number"
                                        />
                                        <div className="form-control-position">
                                          <ContactMail />
                                        </div>
                                        <ErrorMessage
                                          name="emplPostalCode"
                                          component="div"
                                          className="field-error text-danger"
                                        />
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
                                          placeholder="0123456789"
                                          type="text"
                                        />
                                        <div className="form-control-position">
                                          <Phone />
                                        </div>
                                        <ErrorMessage
                                          name="emplPhoneNumber"
                                          component="div"
                                          className="field-error text-danger"
                                        />
                                      </FormGroup>
                                    </Col>
                                    <Col md="12" sm="12">
                                      <label>Position Held</label>

                                      <FormGroup className="has-icon-left position-relative">
                                        <Field
                                          className="form-control"
                                          name="emplPositionHeld"
                                          placeholder="Occupation"
                                          type="text"
                                        />
                                        <div className="form-control-position">
                                          <Work />
                                        </div>
                                        <ErrorMessage
                                          name="emplPositionHeld"
                                          component="div"
                                          className="field-error text-danger"
                                        />
                                      </FormGroup>
                                    </Col>
                                    <Col md="12" sm="12">
                                      <label>Supervisor Name</label>

                                      <FormGroup className="has-icon-left position-relative">
                                        <Field
                                          className="form-control"
                                          name="supervisorName"
                                          placeholder="FullName"
                                          type="text"
                                        />
                                        <div className="form-control-position">
                                          <Person />
                                        </div>
                                        <ErrorMessage
                                          name="supervisorName"
                                          component="div"
                                          className="field-error text-danger"
                                        />
                                      </FormGroup>
                                    </Col>
                                    <Col md="12" sm="12">
                                      <label>Dates Employed</label>

                                      <FormGroup className="has-icon-left position-relative">
                                        <Field
                                          className="form-control"
                                          name="datesEmployed"
                                          placeholder="MM/DD/YYYY"
                                          type="date"
                                        />
                                        <div className="form-control-position">
                                          <Event />
                                        </div>
                                        <ErrorMessage
                                          name="datesEmployed"
                                          component="div"
                                          className="field-error text-danger"
                                        />
                                      </FormGroup>
                                    </Col>
                                    <Col md="12" sm="12">
                                      <label>Gross Monthly Income</label>

                                      <FormGroup className="has-icon-left position-relative">
                                        <Field
                                          className="form-control"
                                          name="grossMonthlyIncome"
                                          placeholder="$$"
                                          type="number"
                                        />
                                        <div className="form-control-position">
                                          <AttachMoney />
                                        </div>
                                        <ErrorMessage
                                          name="grossMonthlyIncome"
                                          component="div"
                                          className="field-error text-danger"
                                        />
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
                                      <label>
                                        Name of School or University
                                      </label>

                                      <FormGroup className="has-icon-left position-relative">
                                        <Field
                                          className="form-control"
                                          name="schoolUniversityName"
                                          placeholder="University"
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
                                          placeholder="0987654321"
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
                                          placeholder="Grade"
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
                                          placeholder="MM/DD/YYYY"
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
                                          placeholder="FullName"
                                          type="text"
                                        />
                                        <div className="form-control-position">
                                          <Person />
                                        </div>
                                        <ErrorMessage
                                          name="emergContactName"
                                          component="div"
                                          className="field-error text-danger"
                                        />
                                      </FormGroup>
                                    </Col>
                                    <Col md="12" sm="12">
                                      <label>Relationship</label>

                                      <FormGroup className="has-icon-left position-relative">
                                        <Field
                                          className="form-control"
                                          name="emergContactRelationship"
                                          placeholder="Relation"
                                          type="text"
                                        />
                                        <div className="form-control-position">
                                          <Wc />
                                        </div>
                                        <ErrorMessage
                                          name="emergContactRelationship"
                                          component="div"
                                          className="field-error text-danger"
                                        />
                                      </FormGroup>
                                    </Col>
                                    <Col md="12" sm="12">
                                      <label>Address Line one</label>

                                      <FormGroup className="has-icon-left position-relative">
                                        <Field
                                          className="form-control"
                                          name="emergContactAddLineOne"
                                          placeholder="1234 ABCD Street"
                                          type="text"
                                        />
                                        <div className="form-control-position">
                                          <ContactMail />
                                        </div>
                                        <ErrorMessage
                                          name="emergContactAddLineOne"
                                          component="div"
                                          className="field-error text-danger"
                                        />
                                      </FormGroup>
                                    </Col>
                                    <Col md="12" sm="12">
                                      <label>Address Line Two</label>

                                      <FormGroup className="has-icon-left position-relative">
                                        <Field
                                          className="form-control"
                                          name="emergContactAddLineTwo"
                                          placeholder="Building"
                                          type="text"
                                        />
                                        <div className="form-control-position">
                                          <ContactMail />
                                        </div>
                                        <ErrorMessage
                                          name="emergContactAddLineTwo"
                                          component="div"
                                          className="field-error text-danger"
                                        />
                                      </FormGroup>
                                    </Col>
                                    <Col md="12" sm="12">
                                      <label>City</label>

                                      <FormGroup className="has-icon-left position-relative">
                                        <Field
                                          className="form-control"
                                          name="emergContactCity"
                                          placeholder="City"
                                          type="text"
                                        />
                                        <div className="form-control-position">
                                          <LocationCity />
                                        </div>
                                        <ErrorMessage
                                          name="emergContactCity"
                                          component="div"
                                          className="field-error text-danger"
                                        />
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
                                          placeholder="AB"
                                          type="text"
                                        />
                                        <div className="form-control-position">
                                          <Public />
                                        </div>
                                        <ErrorMessage
                                          name="emergContactState"
                                          component="div"
                                          className="field-error text-danger"
                                        />
                                      </FormGroup>
                                    </Col>
                                    <Col md="12" sm="12">
                                      <label>Postal Code</label>

                                      <FormGroup className="has-icon-left position-relative">
                                        <Field
                                          className="form-control"
                                          name="emergContactPostalCode"
                                          placeholder="ZipCode"
                                          type="text"
                                        />
                                        <div className="form-control-position">
                                          <ContactMail />
                                        </div>
                                        <ErrorMessage
                                          name="emergContactPostalCode"
                                          component="div"
                                          className="field-error text-danger"
                                        />
                                      </FormGroup>
                                    </Col>
                                    <Col md="12" sm="12">
                                      <label>Country</label>

                                      <FormGroup className="has-icon-left position-relative">
                                        <Field
                                          className="form-control"
                                          name="emergContactCountry"
                                          placeholder="Country"
                                          type="text"
                                        />
                                        <div className="form-control-position">
                                          <Flag />
                                        </div>
                                        <ErrorMessage
                                          name="emergContactCountry"
                                          component="div"
                                          className="field-error text-danger"
                                        />
                                      </FormGroup>
                                    </Col>
                                    <Col md="12" sm="12">
                                      <label>Home Phone Number</label>

                                      <FormGroup className="has-icon-left position-relative">
                                        <Field
                                          className="form-control"
                                          name="emergHomeContact"
                                          placeholder="0123456789"
                                          type="number"
                                        />
                                        <div className="form-control-position">
                                          <Phone />
                                        </div>
                                        <ErrorMessage
                                          name="emergHomeContact"
                                          component="div"
                                          className="field-error text-danger"
                                        />
                                      </FormGroup>
                                    </Col>
                                    <Col md="12" sm="12">
                                      <label>Work Phone Number</label>

                                      <FormGroup className="has-icon-left position-relative">
                                        <Field
                                          className="form-control"
                                          name="emergWorkContact"
                                          placeholder="0987654321"
                                          type="number"
                                        />
                                        <div className="form-control-position">
                                          <PhoneAndroid />
                                        </div>
                                        <ErrorMessage
                                          name="emergWorkContact"
                                          component="div"
                                          className="field-error text-danger"
                                        />
                                      </FormGroup>
                                    </Col>
                                    <Col md="12" sm="12">
                                      <label>Phone Number</label>

                                      <FormGroup className="has-icon-left position-relative">
                                        <Field
                                          className="form-control"
                                          name="emergContactMobile"
                                          placeholder="0987654321"
                                          type="text"
                                        />
                                        <div className="form-control-position">
                                          <PhoneAndroidSharp />
                                        </div>
                                        <ErrorMessage
                                          name="emergContactMobile"
                                          component="div"
                                          className="field-error text-danger"
                                        />
                                      </FormGroup>
                                    </Col>
                                  </ListGroupItem>
                                </Col>
                              </Row>
                              <div className="divider divider-warning">
                                <div className="divider-text"></div>
                              </div>
                              <FormGroup>
                                <Col md={{ size: 8, offset: 4 }}>
                                  <Button.Ripple
                                    color="primary"
                                    type="submit"
                                    className="mr-1 mb-1"
                                  >
                                    <CheckSquare size={14} />

                                    <span className="align-middle ml-25">
                                      Submit
                                    </span>
                                  </Button.Ripple>
                                  <Button.Ripple
                                    color="warning"
                                    type="reset"
                                    className="mr-1 mb-1"
                                  >
                                    <ChevronsLeft size={14} />

                                    <span className="align-middle ml-25">
                                      Reset
                                    </span>
                                  </Button.Ripple>
                                  <Button.Ripple
                                    color="danger"
                                    onClick={Helpers.redirectSearch}
                                    className="mr-1 mb-1"
                                  >
                                    <XSquare size={14} />

                                    <span className="align-middle ml-25">
                                      Cancel
                                    </span>
                                  </Button.Ripple>

                                  {this.state.alert}
                                  <ToastContainer />
                                </Col>
                              </FormGroup>
                            </PerfectScrollbar>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </CardBody>
        </Card>
      </React.Fragment>
    );
  }
}
export default ApplicantCreate;
