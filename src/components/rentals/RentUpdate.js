import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import SweetAlert from "react-bootstrap-sweetalert";
import { CheckSquare, XSquare, ChevronsLeft } from "react-feather";
import axios from "axios";
import "react-toggle/style.css";
import "../../assets/scss/plugins/forms/switch/react-toggle.scss";
import Radio from "../../components/@vuexy/radio/RadioVuexy";
import Helpers from "./Helpers";
import * as appConst from  "../../utility/Constants";
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
  ListGroup,
  ListGroupItem,
} from "reactstrap";
import Select from "react-select";
import LovList from "../../components/common/Helpers";
import { Cancel, AddCircle } from "@material-ui/icons";
import moment from "moment";
var _ = require("lodash");
class RentUpdate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [
        {
          paymentType: "0",
          balance: "0",
          receivedAmount: "0",
          paymentNotes: "",
        },
      ],
      successAlert: true,
      appReqId: "",
      paymentDate: "",
      isMailChecked: false,
      isWupChecked: false,
      appReqId: "",
      mailCheck: "",
      wupCheck: "",
      referenceNumber: "",
      receivedFrom: "",
      remarks: "",
      amount: "",
      paymentMethod: "",
      errorMessage: "",
    };
    this.baseState = this.state;
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount() {
    this.setState({ appReqId: this.props.match.params.appReqId });
    totalAmount = 0;
    var paymentParentId = appConst.paymentMethodParentId;
    var paymentTypeParentId = appConst.paymentTypeParentId;
    paymentList = await LovList.lovList(paymentParentId);
    paymentType = await LovList.lovList(paymentTypeParentId);
    this.setState({
      appReqId: this.props.match.params.appReqId,
      paymentDate: moment(new Date()).format("YYYY-MM-DD"),
    });

    var data = "";
    await axios.post("/admin/user/all-users/").then((response) => {
      data = response.data.users;
    });

    let marked = data;
    userList.splice(0, userList.length);
    marked !== undefined &&
      data.forEach((rData) => {
        let userOption = {};
        userOption.value = rData.userId;
        userOption.label = rData.firstName + " " + rData.lastName;
        userList.push(userOption);
      });
  }

  render() {
    const {
      receivedFrom = "",
      paymentMethod = "",
      emailNotif = "1",
      wupNotif = "1",
      paymentDate = "",
    } = this.state;
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payment Request</CardTitle>
        </CardHeader>
        <CardBody>
          <Formik
            enableReinitialize
            initialValues={{
              appReqId: "",
              paymentDate: paymentDate,
              emailNotif: emailNotif,
              wupNotif: wupNotif,
              referenceNumber: "",
              receivedFrom: "",
              remarks: "",
              amount: "",
              paymentMethod: "",
            }}
            validationSchema={formValidation}
            onSubmit={(values, actions) => {
              var myObject = JSON.stringify(this.state.users);
              var parseObject = JSON.parse(myObject);
              console.log(parseObject);
              var responseCode = "";
              var flag = this.validatePayment();

              let payload = {
                payHdr: {
                  referenceId: this.state.appReqId,
                  paymentDate: values.paymentDate,
                  amount: values.amount,
                  paymentMethod: values.paymentMethod.value,
                  referenceNumber: values.paymentDate,
                  receivedFrom: values.receivedFrom.value,
                  emailNotif: values.emailNotif,
                  wupNotif: values.wupNotif,
                  remarks: values.paymentRemarks,
                },
                payDetails: parseObject,
              };
              if (flag == 1) {
                var amountFlag = this.amountValidate(values.amount);
                if (amountFlag == 1) {
                  console.log("amountFlag " + amountFlag);
                  axios({
                    method: "POST",
                    url: "/rentals/payment/create/",
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
                      //  toast.error("Bad Request, Please verify your inputs!");
                    });
                } else {
                  this.setState({
                    errorMessage: "Amount and total amount should be equal",
                  });
                }
              } else {
                this.setState({
                  errorMessage: "Enter Payment Details",
                });
                console.log("error " + this.state.errorMessage);
              }
            }}
          >
            {(props) => {
              const { errors, touched, setFieldValue } = props;
              return (
                <Form onSubmit={props.handleSubmit}>
                  <Row>
                    <Col md="6" sm="12">
                      <label>Payment Date</label>
                      <FormGroup>
                        <Field
                          className="form-control"
                          name="paymentDate"
                          type="date"
                          // defaultValue={date}
                        />

                        <ErrorMessage
                          name="paymentDate"
                          component="div"
                          className="field-error text-danger"
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6" sm="12">
                      <label>Amount</label>
                      <FormGroup>
                        <Field
                          className="form-control"
                          name="amount"
                          type="number"
                        />

                        <ErrorMessage
                          name="amount"
                          component="div"
                          className="field-error text-danger"
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6" sm="12">
                      <label htmlFor="paymentMethod">Payment Method</label>

                      <FormGroup>
                        <Select
                          name="paymentMethod"
                          options={paymentList}
                          value={userList.find(
                            (obj) => obj.value == paymentMethod
                          )}
                          onChange={(paymentList) =>
                            setFieldValue("paymentMethod", paymentList)
                          }
                        />

                        <ErrorMessage
                          name="paymentMethod"
                          component="div"
                          className="field-error text-danger"
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6" sm="12">
                      <label>Reference Number</label>
                      <FormGroup className="form-group required">
                        <Field
                          className="form-control"
                          name="referenceNumber"
                          type="text"
                        />

                        <ErrorMessage
                          name="referenceNumber"
                          component="div"
                          className="field-error text-danger"
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6" sm="12">
                      <label htmlFor="receivedFrom">Recived From</label>

                      <FormGroup>
                        <Select
                          name="receivedFrom"
                          options={userList}
                          value={userList.find(
                            (obj) => obj.value == receivedFrom
                          )}
                          onChange={(userList) =>
                            setFieldValue("receivedFrom", userList)
                          }
                          defaultValue={{ label: "Select", value: 0 }}
                          isClearable={true}
                        />

                        <ErrorMessage
                          name="receivedFrom"
                          component="div"
                          className="field-error text-danger"
                        />
                      </FormGroup>
                    </Col>
                    <Col md="3" sm="12">
                      <label htmlFor="genderType">Email Notification</label>

                      <FormGroup className="has-icon-left position-relative">
                        <div className="d-inline-block mr-1">
                          <Radio
                            label="Yes"
                            color="primary"
                            name="emailNotif"
                            checked={emailNotif == 1}
                            onChange={() => setFieldValue("emailNotif", "1")}
                          />
                        </div>
                        <div className="d-inline-block mr-1">
                          <Radio
                            label="No"
                            color="warning"
                            name="emailNotif"
                            value="2"
                            onChange={() => setFieldValue("emailNotif", "2")}
                          />
                        </div>
                      </FormGroup>
                    </Col>
                    <Col md="3" sm="12">
                      <label htmlFor="genderType">Whatsup Notification</label>

                      <FormGroup className="has-icon-left position-relative">
                        <div className="d-inline-block mr-1">
                          <Radio
                            label="Yes"
                            color="primary"
                            name="wupNotif"
                            checked={wupNotif == 1}
                            value="1"
                            onChange={() => setFieldValue("wupNotif", "1")}
                          />
                        </div>
                        <div className="d-inline-block mr-1">
                          <Radio
                            label="No"
                            color="warning"
                            name="wupNotif"
                            value="2"
                            onChange={() => setFieldValue("wupNotif", "2")}
                          />
                        </div>
                      </FormGroup>
                    </Col>

                    <Col md="12" sm="12">
                      <label htmlFor="remarks">Payment Remarks</label>

                      <FormGroup>
                        <Field
                          name="remarks"
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
                      </FormGroup>
                    </Col>

                    <Col md="10" sm="12">
                      <ListGroup tag="div">
                        <ListGroupItem>Payment Details</ListGroupItem>
                        <ListGroupItem>
                          {" "}
                          <Col>
                            <div>
                              <Row>
                                <Col md="3" sm="12">
                                  <label>Payment Type</label>
                                </Col>
                                <Col md="2" sm="12">
                                  <label>Balance</label>
                                </Col>
                                <Col md="2" sm="12">
                                  <label>Received Amount</label>
                                </Col>
                                <Col md="4" sm="12">
                                  <label>Notes</label>
                                </Col>

                                <Col md="1" sm="12">
                                  <label>Delete</label>
                                </Col>
                              </Row>
                            </div>
                            {this.createUI()}
                            <div style={{ color: "red" }}>
                              {this.state.errorMessage}
                            </div>
                            <br />
                            <Button.Ripple
                              className="btn-icon rounded-circle"
                              color="primary"
                              onClick={this.addClick.bind(this)}
                            >
                              <AddCircle />
                            </Button.Ripple>
                          </Col>
                        </ListGroupItem>
                        <ListGroupItem color="light">
                          <Col md="4" sm="12">
                            <h6>Total : {totalAmount}</h6>
                          </Col>
                        </ListGroupItem>
                      </ListGroup>
                    </Col>
                  </Row>
                  <br />
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
                        onClick={this.resetForm}
                      >
                        <ChevronsLeft size={14} />

                        <span className="align-middle ml-25">Reset</span>
                      </Button.Ripple>
                      <Button.Ripple
                        color="danger"
                        onClick={this.ha}
                        className="mr-1 mb-1"
                        onClick={Helpers.handleCancel}
                      >
                        <XSquare size={14} />

                        <span className="align-middle ml-25">Cancel</span>
                      </Button.Ripple>

                      {this.state.alert}
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
  createUI() {
    const { setFieldValue, errors, touched } = this.state;
    let paymentTypeOptions = paymentType.map((data) => (
      <option key={data.value} value={data.value}>
        {data.label}{" "}
      </option>
    ));
    return this.state.users.map((el, i) => (
      <div key={i}>
        <Row>
          <Col md="3" sm="12">
            <Input
              type="select"
              id="paymentType"
              name="paymentType"
              value={el.paymentType || ""}
              onChange={this.handleChange.bind(this, i)}
            >
              <option value="">Select</option>
              {paymentTypeOptions}
            </Input>
            <ErrorMessage
              name="paymentType"
              component="div"
              className="field-error text-danger"
            />
          </Col>
          <Col md="2" sm="12">
            <Input
              name="balance"
              value={el.balance || ""}
              onChange={this.handleChange.bind(this, i)}
              type="text"
            />
          </Col>

          <Col md="2" sm="12">
            <Input
              name="receivedAmount"
              value={el.receivedAmount || ""}
              onChange={this.handleChange.bind(this, i)}
              type="number"
            />
          </Col>
          <Col md="4" sm="12">
            <Input
              name="paymentNotes"
              value={el.paymentNotes || ""}
              onChange={this.handleChange.bind(this, i)}
              type="number"
            />
          </Col>

          <Col md="1" sm="12">
            <div className="actions cursor-pointer">
              <Button.Ripple
                className="btn-icon rounded-circle"
                color="danger"
                onClick={this.removeClick.bind(this, i)}
              >
                <Cancel fontSize="large" />
              </Button.Ripple>
            </div>
          </Col>
          <br />
        </Row>
      </div>
    ));
  }

  handleChange(i, e) {
    const { name, value } = e.target;
    let users = [...this.state.users];
    if ("receivedAmount" == name) {
      users[i] = { ...users[i], [name]: Number(value) };
      this.setState({ users });
    } else if ("paymentType" == name) {
      let availableObj = [];
      availableObj = _.filter(users, {
        paymentType: Number(value),
      });
      if (availableObj.length == 0) {
        users[i] = { ...users[i], [name]: Number(value) };
        this.setState({ users });
      }
    } else if ("balance" == name) {
      users[i] = { ...users[i], [name]: Number(value) };
      this.setState({ users });
    } else {
      users[i] = { ...users[i], [name]: value };
      this.setState({ users });
    }
    let valueAdded = 0;
    let count = 0;
    if ("receivedAmount" == name) {
      for (let i = 0; i < users.length; i++) {
        count = parseInt(users[i].receivedAmount);
        valueAdded += count;
      }
      totalAmount = valueAdded;
    }
    this.setState({ users });
  }

  removeClick(i) {
    let users = [...this.state.users];
    users.splice(i, 1);
    this.setState({ users });
    let valueAdded = 0;
    let count = 0;

    for (let i = 0; i < users.length; i++) {
      count = parseInt(users[i].receivedAmount);
      valueAdded += count;
    }
    totalAmount = valueAdded;
  }
  validatePayment() {
    var flag = 0;
    for (let i = 0; i < this.state.users.length; i++) {
      let paymentType = parseInt(this.state.users[i].paymentType);
      if (paymentType == "0") {
        this.state.errorMessage = "Payment Details Required";
        flag = 2;
      } else {
        this.state.errorMessage = "";
        flag = 1;
      }
    }
    return flag;
  }
  amountValidate(amount) {
    var flag = 0;
    if (amount == totalAmount) {
      flag = 1;
    } else {
      flag = 2;
    }
    return flag;
  }
  handleSubmit(event) {
    this.validatePayment();
  }
  resetForm = () => {
    this.setState(this.baseState);
  };
  setValue = (value) => {
    this.setState((prevState) => ({
      select: {
        ...prevState.select,
        value,
      },
    }));
  };
  addClick() {
    let userLH = this.state.users.length;
    let pmOptionLH = paymentType.length;
    if (userLH < pmOptionLH) {
      this.setState((prevState) => ({
        users: [
          ...prevState.users,
          {
            paymentType: "0",
            balance: "0",
            receivedAmount: "0",
            paymentNotes: "",
          },
        ],
      }));
    }
  }

  successMessgae(state, value) {
    const getAlert = () => (
      <SweetAlert
        success
        confirmBtnText="Ok!"
        title="Success"
        show={this.state.successAlert}
        onConfirm={() => this.hideAlert()}
      >
        <p className="sweet-alert-text">Request Sussessfully Updated</p>
      </SweetAlert>
    );
    this.setState({
      alert: getAlert(),
    });
  }
  hideAlert() {
    this.props.history.push("/rentalsSearch");
    this.setState({
      alert: null,
    });
  }
}
const formValidation = Yup.object().shape({
  receivedFrom: Yup.string().required("Required"),
  paymentMethod: Yup.string().required("Required"),
  paymentDate: Yup.string().required("Required"),
  amount: Yup.string().required("Required"),
  referenceNumber: Yup.string().required("Required"),
});
var totalAmount = 0;
var paymentList = [];
var paymentType = [];
var userList = [];
export default RentUpdate;
