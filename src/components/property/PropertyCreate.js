import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import SweetAlert from "react-bootstrap-sweetalert";
import "react-toastify/dist/ReactToastify.css";
import "../../assets/scss/plugins/extensions/toastr.scss";
import Helpers from "./Helpers";
import { CheckSquare, XSquare, ChevronsLeft } from "react-feather";
import { toast } from "react-toastify";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Button,
  FormGroup,
  Col,
  Row,
  Input,
} from "reactstrap";
import { Edit, Home } from "react-feather";
import {
  HomeWork,
  ContactMail,
  LocationCity,
  Filter9Plus,
  Filter6,
  Cancel,
} from "@material-ui/icons";

const managerOption = [
  { value: "Admin", label: "Admin" },
  { value: "User", label: "User" },
];

toast.configure();
class PropertyCreate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [
        {
          propUnitName: "",
          propUnitNumber: "",
          propSquareFeet: "",
          propRentAmount: "",
          propNoOfBedRooms: "",
          propNoOfBathRooms: "",
        },
      ],
      unitVal: "",
      selectManager: null,
      selectedStaffOption: null,
      roommates: [],
      successAlert: true,
      propertyName: "",
      propertyAddress: "",
      propertyCity: "",
      propertyState: "",
      propertyPostalCode: "",
      noOfUnits: "",
      proptyManager: null,
      propOwnerName: "",
      propOwnerAddress: "",
      propOwnerCity: "",
      propOwnerState: "",
      propOwnerPostalCode: "",
      propOwnerEmail: "",
      propOwnerMobileNumber: "",
      propOwnerOfficeNumber: "",
      propOwnerHomeNumber: "",
      propDescription: "",
      featureList: [],
      noOfUnits: 1,
    };
    this.addClick = this.addClick.bind(this);
    this.removeAll = this.removeAll.bind(this);
  }
  async componentDidMount() {
    await axios({
      method: "POST",
      url: "/admin/user/all-users/",
    }).then((response) => {
      try {
        this.setState({
          value: response.data.users,
        });
      } catch (e) {
        console.log(e);
      }
    });

    let marked = this.state.value;
    userList.splice(0, userList.length);
    marked !== undefined &&
      this.state.value.forEach((rData) => {
        let userData = {};
        userData.value = rData.userId;
        userData.label = rData.firstName;
        userData.className = "form-control";
        userList.push(userData);
        this.setState({ userList: userList });
      });
  }
  render() {
    const {
      propertyName = "",
      propertyAddress = "",
      propertyCity = "",
      propertyState = "",
      propertyPostalCode = "",
      noOfUnits = "1",
      manageNotes = "",
      proptyManager = "",
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
      featureList = "",
      selectedStaffOption,
      theme,
    } = this.state;
    const selectStyles = {
      input: (base) => ({
        ...base,
        color: theme.palette.text.primary,
        "& input": {
          font: "inherit",
        },
      }),
    };
    return (
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
          selectedStaffOption: selectedStaffOption,
        }}
        validationSchema={formValidation}
        //Onsubmit API Call function start////////////////////////////

        onSubmit={(values, actions) => {
          var myObject = JSON.stringify(this.state.users);
          var parseObject = JSON.parse(myObject);
          let responseCode = "";

          setTimeout(() => {
            let payload = {
              propDetails: {
                proptyName: values.propertyName,
                proptyAddress: values.propertyAddress,
                proptyCity: values.propertyCity,
                proptyState: values.propertyState,
                proptyPostalCode: values.propertyPostalCode,
                noOfUnits: values.noOfUnits,
                manageNotes: values.manageNotes,
                proptyManager: values.selectedStaffOption.value,
              },
              unitDetails: parseObject,
              propOwnerDetails: {
                propOwnerName: values.propOwnerName,
                propOwnerAddress: values.propOwnerAddress,
                propOwnerCity: values.propOwnerCity,
                propOwnerState: values.propOwnerState,
                propOwnerPostalCode: values.propOwnerPostalCode,
                propOwnerEmail: values.propOwnerEmail,
                propOwnerMobileNumber: values.propOwnerMobileNumber,
                propOwnerOfficeNumber: values.propOwnerOfficeNumber,
                propOwnerHomeNumber: values.propOwnerHomeNumber,
              },
              propFeatures: {
                propDescription: values.propDescription,
                featureList: values.featureList.toString(),
              },
            };

            axios({
              method: "POST",
              url: "/rentals/property/create/",
              headers: {
                Authorization: "Bearer " + localStorage.getItem("accessToken"),
              },
              data: payload,
            })
              .then((response) => {
                console.log("Response:::::::::::::" + response.data);

                responseCode = response.data.responseCode;
                console.log("Response Code:::::::::::::" + responseCode);
                if (responseCode == 1000) {
                  this.successMessage("successAlert", true);
                  actions.setSubmitting(false);
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
      >
        {(props) => {
          const {
            handleSubmit,
            values,
            setFieldValue,
            errors,
            touched,
          } = props;
          return (
            <Form onSubmit={props.handleSubmit}>
              <Card>
                <CardHeader>
                  <CardTitle>Property Creation</CardTitle>
                </CardHeader>
                <CardBody>
                  <h6 className="primary">Property Details</h6>
                  <Row>
                    <Col md="6" sm="12">
                      <label htmlFor="propertyName">Property Name</label>

                      <FormGroup className="has-icon-left position-relative">
                        <Field
                          className="form-control"
                          name="propertyName"
                          type="text"
                        />

                        <div className="form-control-position">
                          <HomeWork size={15} />
                        </div>
                        <ErrorMessage
                          name="propertyName"
                          component="div"
                          className="field-error text-danger"
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6" sm="12">
                      <label htmlFor="propertyAddress">Address</label>
                      <FormGroup className="has-icon-left position-relative">
                        <Field
                          className="form-control"
                          name="propertyAddress"
                          type="text"
                        />

                        <div className="form-control-position">
                          <ContactMail size={15} />
                        </div>
                        <ErrorMessage
                          name="propertyAddress"
                          component="div"
                          className="field-error text-danger"
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6" sm="12">
                      <label htmlFor="propertyCity">City</label>

                      <FormGroup className="has-icon-left position-relative">
                        <Field
                          className="form-control"
                          name="propertyCity"
                          type="text"
                        />

                        <div className="form-control-position">
                          <LocationCity size={15} />
                        </div>
                        <ErrorMessage
                          name="propertyCity"
                          component="div"
                          className="field-error text-danger"
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6" sm="12">
                      <label htmlFor="propertyState">State</label>

                      <FormGroup className="has-icon-left position-relative">
                        <Field
                          className="form-control"
                          name="propertyState"
                          type="text"
                        />

                        <div className="form-control-position">
                          <Filter9Plus size={15} />
                        </div>
                        <ErrorMessage
                          name="propertyState"
                          component="div"
                          className="field-error text-danger"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="6" sm="12">
                      <label htmlFor="propertyPostalCode">Postal Code</label>

                      <FormGroup className="has-icon-left position-relative">
                        <Field
                          className="form-control"
                          name="propertyPostalCode"
                          type="number"
                        />

                        <div className="form-control-position">
                          <Filter6 size={15} />
                        </div>
                        <ErrorMessage
                          name="propertyPostalCode"
                          component="div"
                          className="field-error text-danger"
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6" sm="12">
                      <label htmlFor="noOfUnits">No of Units</label>

                      <FormGroup className="has-icon-left position-relative">
                        <Field
                          className="form-control"
                          name="noOfUnits"
                          type="number"
                          onBlur={this.addClick}
                          //onBlur={this.addClick.bind(this)}
                        />

                        <div className="form-control-position">
                          <Home size={15} />
                        </div>
                        <ErrorMessage
                          name="noOfUnits"
                          component="div"
                          className="field-error text-danger"
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6" sm="12">
                      <label>Property Manager</label>

                      <FormGroup className="has-icon-left position-relative">
                        <Select
                          name="selectedStaffOption"
                          options={userList}
                          onChange={(userList) =>
                            setFieldValue("selectedStaffOption", userList)
                          }
                        />
                        <div className="form-control-position"></div>
                        <ErrorMessage
                          name="selectedStaffOption"
                          component="div"
                          className="field-error text-danger"
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6" sm="12">
                      <label htmlFor="manageNotes">Management Notes</label>
                      <FormGroup className="has-icon-left position-relative">
                        <Field
                          name="manageNotes"
                          className="form-control"
                          placeholder="Doe"
                        >
                          {({ field, form: { touched, errors }, meta }) => (
                            <div>
                              <Input
                                type="textarea"
                                placeholder="Remarks"
                                {...field}
                              />
                            </div>
                          )}
                        </Field>
                        <div className="form-control-position">
                          <Edit size={15} />
                        </div>
                      </FormGroup>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
              <Card>
                <CardBody>
                  <h6 className="primary">Property Owner Details</h6>
                  <Row>
                    <Col md="6" sm="12">
                      <label htmlFor="propOwnerName">Property Owner Name</label>
                      <FormGroup className="has-icon-left position-relative">
                        <Field
                          className="form-control"
                          name="propOwnerName"
                          type="text"
                        />

                        <div className="form-control-position">
                          <HomeWork size={15} />
                        </div>
                      </FormGroup>
                    </Col>
                    <Col md="6" sm="12">
                      <label htmlFor="propOwnerAddress">
                        Property Owner Address
                      </label>
                      <FormGroup className="has-icon-left position-relative">
                        <Field
                          className="form-control"
                          name="propOwnerAddress"
                          type="text"
                        />

                        <div className="form-control-position">
                          <ContactMail size={15} />
                        </div>
                      </FormGroup>
                    </Col>
                    <Col md="6" sm="12">
                      <label htmlFor="propOwnerCity">Property Owner City</label>
                      <FormGroup className="has-icon-left position-relative">
                        <Field
                          className="form-control"
                          name="propOwnerCity"
                          type="text"
                        />

                        <div className="form-control-position">
                          <LocationCity size={15} />
                        </div>
                      </FormGroup>
                    </Col>
                    <Col md="6" sm="12">
                      <label htmlFor="propOwnerState">
                        Property Owner Sate
                      </label>
                      <FormGroup className="has-icon-left position-relative">
                        <Field
                          className="form-control"
                          name="propOwnerState"
                          type="text"
                        />

                        <div className="form-control-position">
                          <Filter9Plus size={15} />
                        </div>
                      </FormGroup>
                    </Col>
                    <Col md="6" sm="12">
                      <label htmlFor="propOwnerPostalCode">
                        Property Owner Postal Code
                      </label>
                      <FormGroup className="has-icon-left position-relative">
                        <Field
                          className="form-control"
                          name="propOwnerPostalCode"
                          type="number"
                        />

                        <div className="form-control-position">
                          <Filter6 size={15} />
                        </div>
                      </FormGroup>
                    </Col>
                    <Col md="6" sm="12">
                      <label htmlFor="propOwnerEmail">
                        Property Owner Email
                      </label>
                      <FormGroup className="has-icon-left position-relative">
                        <Field
                          className="form-control"
                          name="propOwnerEmail"
                          type="text"
                        />

                        <div className="form-control-position">
                          <HomeWork size={15} />
                        </div>
                      </FormGroup>
                    </Col>
                    <Col md="6" sm="12">
                      <label htmlFor="propOwnerMobileNumber">
                        Property Owner Mobile Number
                      </label>
                      <FormGroup className="has-icon-left position-relative">
                        <Field
                          className="form-control"
                          name="propOwnerMobileNumber"
                          type="number"
                        />

                        <div className="form-control-position">
                          <HomeWork size={15} />
                        </div>
                      </FormGroup>
                    </Col>
                    <Col md="6" sm="12">
                      <label htmlFor="propOwnerOfficeNumber">
                        Property Owner Office Number
                      </label>
                      <FormGroup className="has-icon-left position-relative">
                        <Field
                          className="form-control"
                          name="propOwnerOfficeNumber"
                          type="number"
                        />

                        <div className="form-control-position">
                          <HomeWork size={15} />
                        </div>
                      </FormGroup>
                    </Col>
                    <Col md="6" sm="12">
                      <label htmlFor="propOwnerHomeNumber">
                        Property Owner Home Number
                      </label>
                      <FormGroup className="has-icon-left position-relative">
                        <Field
                          className="form-control"
                          name="propOwnerHomeNumber"
                          type="number"
                        />

                        <div className="form-control-position">
                          <HomeWork size={15} />
                        </div>
                      </FormGroup>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
              <Card>
                <CardBody>
                  <h6 className="primary">Unit Details</h6>
                  <Row>
                    <Col>
                      <div>
                        <Row>
                          <Col md="2" sm="12">
                            <label>Unit Name</label>
                          </Col>
                          <Col md="2" sm="12">
                            <label>Unit Number</label>
                          </Col>
                          <Col md="2" sm="12">
                            <label>Bed</label>
                          </Col>
                          <Col md="2" sm="12">
                            <label>Bath</label>
                          </Col>
                          <Col md="2" sm="12">
                            <label>Square Feet</label>
                          </Col>
                          <Col md="1" sm="12">
                            <label>Rent</label>
                          </Col>

                          <Col md="1" sm="12">
                            <label>Delete</label>
                          </Col>
                        </Row>
                      </div>
                      {this.createUI()}

                      <Button.Ripple
                        color="primary"
                        className="mr-1 mb-1"
                        onClick={this.addOneClick.bind(this)}
                      >
                        <CheckSquare size={14} />

                        <span className="align-middle ml-25">Add</span>
                      </Button.Ripple>
                    </Col>
                  </Row>
                  <FormGroup row>
                    <Col md={{ size: 8, offset: 4 }}>
                      <Button.Ripple
                        color="primary"
                        type="submit"
                        className="mr-1 mb-1"
                        onClick={this.handleSubmit}
                      >
                        <CheckSquare size={14} />

                        <span className="align-middle ml-25">Submit</span>
                      </Button.Ripple>
                      <Button.Ripple
                        color="warning"
                        type="reset"
                        className="mr-1 mb-1"
                      >
                        <ChevronsLeft size={14} />

                        <span className="align-middle ml-25">Reset</span>
                      </Button.Ripple>
                      <Button.Ripple
                        color="danger"
                        onClick={this.handleCancel}
                        className="mr-1 mb-1"
                      >
                        <XSquare size={14} />

                        <span className="align-middle ml-25">Cancel</span>
                      </Button.Ripple>

                      {this.state.alert}
                    </Col>
                  </FormGroup>
                </CardBody>
              </Card>
            </Form>
          );
        }}
      </Formik>
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
        onConfirm={() => Helpers.hideAlert()}
      >
        <p className="sweet-alert-text">Request Sussessfully Updated</p>
      </SweetAlert>
    );
    this.setState({
      alert: getAlert(),
    });
  }
  handleCancel = () => {
    this.props.history.push("/propertySearch");
  };
  successMessgae(state, value) {
    const getAlert = () => (
      <SweetAlert
        success
        confirmBtnText="Ok!"
        title="Success"
        show={this.state.successAlert}
        onConfirm={() => this.hideAlert()}
      >
        <p className="sweet-alert-text">Request Sussessfully Added</p>
      </SweetAlert>
    );
    this.setState({
      alert: getAlert(),
    });
  }
  hideAlert() {
    this.props.history.push("/propertySearch");
    this.setState({
      alert: null,
    });
  }
  createUI() {
    return this.state.users.map((el, i) => (
      <div key={i}>
        <Row>
          <Col md="2" sm="12">
            <Input
              placeholder="Name"
              name="propUnitName"
              value={el.propUnitName || ""}
              onChange={this.handleChange.bind(this, i)}
              type="text"
            />
          </Col>
          <Col md="2" sm="12">
            <Input
              placeholder="No"
              name="propUnitNumber"
              value={el.propUnitNumber || ""}
              onChange={this.handleChange.bind(this, i)}
              type="text"
            />
          </Col>

          <Col md="2" sm="12">
            <Input
              placeholder="Bed"
              name="propNoOfBedRooms"
              value={el.propNoOfBedRooms || ""}
              onChange={this.handleChange.bind(this, i)}
              type="number"
            />
          </Col>
          <Col md="2" sm="12">
            <Input
              placeholder="Bath"
              name="propNoOfBathRooms"
              value={el.propNoOfBathRooms || ""}
              onChange={this.handleChange.bind(this, i)}
              type="number"
            />
          </Col>
          <Col md="2" sm="12">
            <Input
              placeholder="Feet"
              name="propSquareFeet"
              value={el.propSquareFeet || ""}
              onChange={this.handleChange.bind(this, i)}
              type="number"
            />
          </Col>
          <Col md="1" sm="12">
            <Input
              placeholder="Amount"
              name="propRentAmount"
              value={el.propRentAmount || ""}
              onChange={this.handleChange.bind(this, i)}
              type="number"
            />
          </Col>

          <Col md="1" sm="12">
            <div className="actions cursor-pointer">
              <Cancel
                color="primary"
                style={{ fontSize: 25 }}
                onClick={this.removeClick.bind(this, i)}
              />
            </div>
          </Col>
        </Row>
        <br></br>
      </div>
    ));
  }
  handleChange(i, e) {
    const { name, value } = e.target;
    let users = [...this.state.users];
    users[i] = { ...users[i], [name]: value };

    this.setState({
      propertyName: this.state.propertyName,
      propertyAddress: this.state.propertyAddress,
      propertyCity: this.state.propertyCity,
      propertyState: this.state.propertyState,
      propertyPostalCode: this.state.propertyPostalCode,
      noOfUnits: this.state.noOfUnits,
      proptyManager: this.state.proptyManager,
      propOwnerName: this.state.propOwnerName,
      propOwnerAddress: this.state.propOwnerAddress,
      propOwnerCity: this.state.propOwnerCity,
      propOwnerState: this.state.propOwnerState,
      propOwnerPostalCode: this.state.propOwnerPostalCode,
      propOwnerEmail: this.state.propOwnerEmail,
      propOwnerMobileNumber: this.state.propOwnerMobileNumber,
      propOwnerOfficeNumber: this.state.propOwnerOfficeNumber,
      propOwnerHomeNumber: this.state.propOwnerHomeNumber,
      propDescription: this.state.propDescription,
      featureList: this.state.featureList,
      users,
    });
  }

  handleManagerChange = (selectedStaffOption) => {
    this.setState({ selectedStaffOption });
  };

  removeClick(i) {
    let users = [...this.state.users];
    users.splice(i, 1);
    this.setState({
      propertyName: this.state.propertyName,
      propertyAddress: this.state.propertyAddress,
      propertyCity: this.state.propertyCity,
      propertyState: this.state.propertyState,
      propertyPostalCode: this.state.propertyPostalCode,
      noOfUnits: this.state.noOfUnits,
      proptyManager: this.state.proptyManager,
      propOwnerName: this.state.propOwnerName,
      propOwnerAddress: this.state.propOwnerAddress,
      propOwnerCity: this.state.propOwnerCity,
      propOwnerState: this.state.propOwnerState,
      propOwnerPostalCode: this.state.propOwnerPostalCode,
      propOwnerEmail: this.state.propOwnerEmail,
      propOwnerMobileNumber: this.state.propOwnerMobileNumber,
      propOwnerOfficeNumber: this.state.propOwnerOfficeNumber,
      propOwnerHomeNumber: this.state.propOwnerHomeNumber,
      propDescription: this.state.propDescription,
      featureList: this.state.featureList,
      users,
    });

    this.state.noOfUnits = users.length;
  }
  removeAll() {
    let users = [...this.state.users];
    users.splice(0, users.length);
    this.setState({ users });
    this.state.noOfUnits = users.length;
  }

  addClick(evt) {
    const value = evt.target.value;
    let users = [...this.state.users];
    const usrCount = users.length;
    if (value > usrCount) {
      const value1 = value - usrCount;

      for (var i = 0; i < value1; i++) {
        this.setState((prevState) => ({
          users: [
            ...prevState.users,
            {
              propUnitName: "",
              propUnitNumber: "",
              propSquareFeet: "",
              propRentAmount: "",
              propNoOfBedRooms: "",
              propNoOfBathRooms: "",
            },
          ],
        }));
      }
    } else if (value < usrCount) {
      if (value == 0) {
        users.splice(0, usrCount);
        this.setState({ users });
      } else {
        const value2 = usrCount - value;
        const startIndex = value - 1;
        users.splice(startIndex, value2);
        this.setState({ users });
      }
    }
  }
  addClick1(evt) {
    const value = evt;
    let users = [...this.state.users];
    const usrCount = users.length;
    if (value > usrCount) {
      const value1 = value - usrCount;

      for (var i = 0; i < value1; i++) {
        this.setState((prevState) => ({
          users: [
            ...prevState.users,
            {
              propUnitName: "",
              propUnitNumber: "",
              propSquareFeet: "",
              propRentAmount: "",
              propNoOfBedRooms: "",
              propNoOfBathRooms: "",
            },
          ],
        }));
      }
    } else if (value < usrCount) {
      if (value == 0) {
        users.splice(0, usrCount);
        this.setState({ users });
      } else {
        const value2 = usrCount - value;
        const startIndex = value - 1;
        users.splice(startIndex, value2);
        this.setState({ users });
      }
    }
  }

  addOneClick() {
    this.setState((prevState) => ({
      users: [
        ...prevState.users,
        {
          propUnitName: "",
          propUnitNumber: "",
          propSquareFeet: "",
          propRentAmount: "",
          propNoOfBedRooms: "",
          propNoOfBathRooms: "",
          propertyId: "",
          proptyUnitId: "",
        },
      ],
    }));
    // this.state.noOfUnits = this.state.users.length + 1;
  }
}
const customStyles = {
  option: (provided, state) => ({
    ...provided,
    borderBottom: "1px dotted pink",
    color: state.isSelected ? "red" : "blue",
    padding: 20,
  }),
  control: () => ({
    // none of react-select's styles are passed to <Control />
    width: 200,
  }),
  singleValue: (provided, state) => {
    const opacity = state.isDisabled ? 0.5 : 1;
    const transition = "opacity 300ms";

    return { ...provided, opacity, transition };
  },
};
var userList = [];
const formValidation = Yup.object().shape({
  propertyName: Yup.string()
    .max(20, "Must be 20 characters or less")
    .required("Required"),
  propertyAddress: Yup.string()
    .max(200, "Must be 200 characters or less")
    .required("Required"),
  propertyCity: Yup.string().required("Required"),
  propertyState: Yup.string().required("Required"),
  propertyPostalCode: Yup.string()
    .matches(/^[0-9]{5}$/, "Must be exactly 5 digits")
    .required("Required"),
  noOfUnits: Yup.number().required("Required"),
  selectedStaffOption: Yup.string().required("Required"),
});
export default PropertyCreate;
