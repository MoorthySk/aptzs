import React, { Component } from "react";
import "../../assets/scss/plugins/tables/_agGridStyleOverride.scss";
import "../../assets/scss/pages/users.scss";
import axios from "axios";
import { AddCircle, CheckCircleOutlined } from "@material-ui/icons";
import SweetAlert from "react-bootstrap-sweetalert";
import LovList from "../../components/common/Helpers";
import { Formik, Field, Form, ErrorMessage } from "formik";
import Select from "react-select";
import DataTable from "react-data-table-component";
import moment from "moment";
import { history } from "../../history";
import PropTypes from "prop-types";
import { Update, DeleteForever, Cancel } from "@material-ui/icons";
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
import * as appConst from "../../utility/Constants";
var _ = require("lodash");
class MonthlyCharges extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: props.paymentDetailsList,
      totalAmount: props.mtyChargeAmt,
      appReqId: props.appReqId,
      errorMessage: "",
    };
  }
  async componentDidMount() {
    console.log("appReqId " + this.state.appReqId);
    var paymentParentId = appConst.paymentTypeParentId;
    paymentList = await LovList.lovList(paymentParentId);
    await axios
      .post("/lease/charges/search-byid/", {
        appReqId: this.state.appReqId,
      })
      .then((response) => {
        let listData = response.data.tenantCharges;
        let marked = listData;
        let rowDataList = [];
        let nData = {};
        this.state.users.splice(0, this.state.users.length);
        marked !== undefined &&
          listData.forEach((rData) => {
            nData = {};
            nData.chargeId = rData.chargeId;
            nData.chargeType = rData.chargeType;
            nData.chargeAmount = rData.chargeAmount;
            nData.nextDueDate = moment(rData.nextDueDate).format("YYYY-MM-DD");
            nData.chargeNotes = rData.chargeNotes;
            rowDataList.push(nData);
            this.setState((prevState) => ({
              users: [...prevState.users],
            }));
            this.setState({ users: rowDataList });
            this.props.updatePaymentDetails(this.state.users);
          });
      })
      .catch((error) => {
        console.log("error:::" + error);
      });
    console.log(this.state.users);
  }
  render() {
    const { totalAmount } = this.state;
    return (
      <Col md="12" sm="12">
        <CardTitle>Monthly Charges</CardTitle>
        <ListGroup tag="div">
          <ListGroupItem>
            {" "}
            <Col>
              <div>
                <Row>
                  <Col md="3" sm="12">
                    <label>Payment Type</label>
                  </Col>
                  <Col md="2" sm="12">
                    <label>Amount</label>
                  </Col>
                  <Col md="2" sm="12">
                    <label>Next Due Date</label>
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
              <div style={{ color: "red" }}>{this.state.errorMessage}</div>
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
        <br />
      </Col>
    );
  }
  createUI() {
    const { setFieldValue, errors, touched, users } = this.state;
    let paymentTypeOptions = paymentList.map((data) => (
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
              id="chargeType"
              name="chargeType"
              value={el.chargeType || ""}
              onChange={this.handleChange.bind(this, i)}
            >
              <option value="">Select</option>
              {paymentTypeOptions}
            </Input>
          </Col>
          <Col md="2" sm="12">
            <Input
              name="chargeAmount"
              value={el.chargeAmount || ""}
              onChange={this.handleChange.bind(this, i)}
              type="text"
            />
          </Col>

          <Col md="2" sm="12">
            <Input
              name="nextDueDate"
              value={el.nextDueDate || ""}
              onChange={this.handleChange.bind(this, i)}
              type="date"
            />
          </Col>
          <Col md="4" sm="12">
            <Input
              name="chargeNotes"
              value={el.chargeNotes || ""}
              onChange={this.handleChange.bind(this, i)}
              type="text"
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
        </Row>
      </div>
    ));
  }
  async handleChange(i, e) {
    const { name, value } = e.target;
    let users = [...this.state.users];
    this.state.errorMessage = "";
    if ("chargeType" == name) {
      let availableObj = [];
      availableObj = _.filter(users, {
        chargeType: value,
      });
      if (availableObj.length == 0) {
        users[i] = { ...users[i], [name]: value };
        this.setState({ users });
      }
    } else if ("chargeAmount" == name) {
      users[i] = { ...users[i], [name]: Number(value) };
      this.setState({ users });
      let valueAdded = 0;
      let count = 0;
      for (let i = 0; i < users.length; i++) {
        count = parseInt(users[i].chargeAmount);
        valueAdded += count;
      }
      await this.setState({ totalAmount: valueAdded });
      this.props.updateChargeAmount(valueAdded);
    } else {
      users[i] = { ...users[i], [name]: value };
      this.setState({ users });
    }
    console.log(value + "-->" + JSON.stringify(this.state.users));
    this.props.updatePaymentDetails(this.state.users);
  }

  async removeClick(i) {
    this.state.errorMessage = "";
    let users = [...this.state.users];
    users.splice(i, 1);
    this.setState({ users });

    let valueAdded = 0;
    let count = 0;
    for (let i = 0; i < users.length; i++) {
      count = parseInt(users[i].chargeAmount);
      valueAdded += count;
    }
    await this.setState({ totalAmount: valueAdded });
    this.props.updateChargeAmount(valueAdded);
    this.props.updatePaymentDetails(this.state.users);
  }
  addClick() {
    let userLH = this.state.users.length;
    let pmOptionLH = paymentList.length;
    if (userLH < pmOptionLH) {
      this.setState((prevState) => ({
        users: [
          ...prevState.users,
          {
            chargeType: "",
            chargeAmount: "",
            nextDueDate: "",
            chargeNotes: "",
          },
        ],
      }));
    }
  }
  mtlyChargeOnUpdate(amt) {
    this.setState({ totalAmount: amt });
  }
  async emptyValidation() {
    console.log("emptyValidation");
    let users = [...this.state.users];
    var flag = 0;
    for (let i = 0; i < this.state.users.length; i++) {
      let chargeType = this.state.users[i].chargeType;
      let chargeAmount = this.state.users[i].chargeAmount;
      let nextDueDate = this.state.users[i].nextDueDate;
      let chargeNotes = this.state.users[i].chargeNotes;

      if (chargeType == "") {
        this.state.errorMessage = "Payment Type Details Required";
        flag = 2;
        break;
      } else if (chargeAmount == "") {
        this.state.errorMessage = "Amount Details Required";
        flag = 2;
        break;
      } else if (nextDueDate == "") {
        this.state.errorMessage = "Next due date Details Required";
        flag = 2;
        break;
      } else if (chargeNotes == "") {
        this.state.errorMessage = "Notes Details Required";
        flag = 2;
        break;
      } else {
        this.state.errorMessage = "";
        flag = 1;
      }
    }
    if (flag == 0) this.state.errorMessage = "Monthly Charges is Mandatory";
    console.log("flag" + flag);

    this.props.validateForm_MonthyCharge(flag);
  }
}

var paymentList = [];
MonthlyCharges.propTypes = {
  paymentDetailsList: PropTypes.array.isRequired,
  mtyChargeAmt: PropTypes.number.isRequired,
  appReqId: PropTypes.number.isRequired,
};
export default MonthlyCharges;
