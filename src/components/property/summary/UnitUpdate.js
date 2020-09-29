import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import SweetAlert from "react-bootstrap-sweetalert";
import "react-toastify/dist/ReactToastify.css";
import "../../../assets/scss/plugins/extensions/toastr.scss";
import Helpers from "../Helpers";
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
  Filed,
  CustomInput,
  Map,
} from "reactstrap";

import {
  User,
  Mail,
  Phone,
  Calendar,
  FileText,
  Edit,
  ArrowDown,
  ChevronsDown,
  Home,
  MoreVertical,
} from "react-feather";
import {
  HomeWork,
  ContactMail,
  LocationCity,
  Filter9Plus,
  Filter6,
  Cancel,
  CheckCircle,
} from "@material-ui/icons";

class PropertyUpdate extends React.Component {
  state = {
    roommates: [],
    successAlert: true,
  };

  propInfo = {
    propertyId: "",
  };

  async componentDidMount() {
    var propertyId = this.props.match.params.propertyId;
    let mess = "";
    let unitDtl = "";
    let ownerdtl = "";
    let feature = "";
    var responseCode = "";
    await axios
      .post("/rentals/property/search/", {
        propertyId: propertyId,
      })

      .then((response) => {
        responseCode = response.data.responseCode;
        if (responseCode === "1004") {
          this.props.history.push("/sessionExpired");
        } else {
          mess = response.data.propDetails;
          ownerdtl = response.data.propOwnerDtls;
          feature = response.data.propFeatureDtls;
          this.propInfo.propertyId = mess.propertyId;
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
            featureList: null,
            selFeatureList: items,
          });

          unitDtl = response.data.unitDetails;
          this.removeAll();
          for (var i = 0; i < unitDtl.length; i++) {
            this.setState((prevState) => ({
              users: [
                ...prevState.users,
                {
                  propUnitName: unitDtl[i].propUnitName,
                  propUnitNumber: unitDtl[i].propUnitNumber,
                  propSquareFeet: unitDtl[i].propSquareFeet,
                  propRentAmount: unitDtl[i].propRentAmount,
                  propNoOfBedRooms: unitDtl[i].propNoOfBedRooms,
                  propNoOfBathRooms: unitDtl[i].propNoOfBathRooms,
                  propUnitDeposit: unitDtl[i].propUnitDeposit,
                  propertyId: unitDtl[i].propertyId,
                  proptyUnitId: unitDtl[i].proptyUnitId,
                },
              ],
            }));
          }
        }
      })
      .catch((error) => {
        console.log("error:::" + error);
      });
    await axios({
      method: "POST",
      url: "/admin/user/all-users/",
    })
      .then((response) => {
        try {
          this.setState({
            value: response.data.users,
          });
        } catch (e) {
          console.log(e);
        }
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
      })
      .catch((error) => {
        console.log("error:::" + error);
      });
  }
  //:::::::::::::::::::::Fetch Data End:::::::::::::::::::::::::::::::::::::::::::::://

  render() {
    const {
      propertyName = "",
      propertyAddress = "",
      propertyCity = "",
      propertyState = "",
      propertyPostalCode = "",
      noOfUnits = "",
      manageNotes = "",
      propertyId = "",
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
    } = this.state;

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
        validationSchema={formValidation}
        onSubmit={(values, actions) => {
          var myObject = JSON.stringify(this.state.users);
          var parseObject = JSON.parse(myObject);
          let responseCode = "";
          console.log(
            "values.proptyManager.value:::::::::::::" + values.proptyManager
          );
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
                proptyManager: values.proptyManager,
                propertyId: this.propInfo.propertyId,
              },
              unitDetails: parseObject,
              propertyId: this.propInfo.propertyId,
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
            };

            axios({
              method: "POST",
              url: "/rentals/property/update/",
              data: payload,
            })
              .then((response) => {
                console.log("Response:::::::::::::" + response.data);

                responseCode = response.data.responseCode;
                console.log("Response Code:::::::::::::" + responseCode);
                if (responseCode == 1000) {
                  this.successMessage("successAlert", true);
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
                  <CardTitle>Unit Update</CardTitle>
                </CardHeader>

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
                            <label>Unit No</label>
                          </Col>
                          <Col md="2" sm="12">
                            <label>Bed</label>
                          </Col>
                          <Col md="2" sm="12">
                            <label>Bath</label>
                          </Col>
                          <Col md="2" sm="12">
                            <label>Sq.Feet</label>
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
                      <br />
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

                        <span className="align-middle ml-25">Update</span>
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
  selectManager = (e) => {
    console.log("e.value:::" + e.value);
    let selectedProprty = e.value;
    this.setState({
      proptyManager: selectedProprty,
    });
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
              placeholder="Unit Name"
              name="propUnitName"
              value={el.propUnitName || ""}
              onChange={this.handleChange.bind(this, i)}
              type="text"
            />
          </Col>
          <Col md="2" sm="12">
            <Input
              placeholder="Unit Number"
              name="propUnitNumber"
              value={el.propUnitNumber || ""}
              onChange={this.handleChange.bind(this, i)}
              type="text"
            />
          </Col>

          <Col md="2" sm="12">
            <Input
              placeholder="No Of Bedrooms"
              name="propNoOfBedRooms"
              value={el.propNoOfBedRooms || ""}
              onChange={this.handleChange.bind(this, i)}
              type="number"
            />
          </Col>
          <Col md="2" sm="12">
            <Input
              placeholder="No of Bathrooms"
              name="propNoOfBathRooms"
              value={el.propNoOfBathRooms || ""}
              onChange={this.handleChange.bind(this, i)}
              type="number"
            />
          </Col>
          <Col md="2" sm="12">
            <Input
              placeholder="Square Feet"
              name="propSquareFeet"
              value={el.propSquareFeet || ""}
              onChange={this.handleChange.bind(this, i)}
              type="number"
            />
          </Col>
          <Col md="1" sm="12">
            <Input
              placeholder="Rent Amount"
              name="propRentAmount"
              value={el.propRentAmount || ""}
              onChange={this.handleChange.bind(this, i)}
              type="number"
            />
          </Col>

          <Col md="1" sm="12">
            <div className="actions cursor-pointer">
              <Cancel
                color="secondary"
                style={{ fontSize: 25 }}
                onClick={this.removeClick.bind(this, i)}
              />
            </div>
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

  handleSelectChange = (featureList) => {
    let catArray = [];
    let selArray = [];

    if (featureList) {
      featureList.map((o) => (o === null ? "" : catArray.push(o.value)));

      featureList.map((o) =>
        o === null ? "" : selArray.push({ value: o.value, label: o.value })
      );

      this.setState({ featureList: catArray, selFeatureList: selArray });
    }
  };

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

  removeClick(i) {
    let users = [...this.state.users];
    users.splice(i, 1);
    this.setState({ users });
    this.state.noOfUnits = users.length;
  }
  removeAll() {
    let users = [...this.state.users];
    users.splice(0, users.length);
    this.setState({ users });
  }

  handleSubmit(event) {
    let users = [...this.state.users];
    for (var i = 0; i < users.length; i++) {
      var validResult = "";

      if (users[i].propUnitName == "") {
        //toast.error("Please enter Property Unit Name");
        validResult = validResult + " ,Unit Name";
        //event.preventDefault();
      }

      if (validResult != "") {
        toast.error("Please enter " + validResult + " in row:" + (i + 1));
        event.preventDefault();
      }
    }
  }
  constructor(props) {
    super(props);
    this.state = {
      unitVal: "",
      users: [
        {
          propUnitName: "",
          propUnitNumber: "",
          propSquareFeet: "",
          propRentAmount: "",
          propNoOfBedRooms: "",
          propNoOfBathRooms: "",
          propUnitDeposit: "",
          propertyId: "",
          proptyUnitId: "",
        },
      ],
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateInput = this.updateInput.bind(this);
    this.addClick = this.addClick.bind(this);
    this.removeAll = this.removeAll.bind(this);
  }

  updateInput(evt) {
    this.addClick(evt);
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
              propUnitDeposit: "",
              propertyId: "",
              proptyUnitId: "",
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
          propUnitDeposit: "",
          propertyId: "",
          proptyUnitId: "",
        },
      ],
    }));

    let users = [...this.state.users];
    this.state.noOfUnits = users.length + 1;
  }
}
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
});

toast.configure();
var userList = [];
export default PropertyUpdate;
