import React, { Component } from "react";
import "../../assets/scss/plugins/tables/_agGridStyleOverride.scss";
import "../../assets/scss/pages/users.scss";
import axios from "axios";
import { AddCircle, CheckCircleOutlined } from "@material-ui/icons";
import SweetAlert from "react-bootstrap-sweetalert";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import DataTable from "react-data-table-component";
import moment from "moment";
import { history } from "../../history";
import { Update, DeleteForever } from "@material-ui/icons";

import PropTypes from "prop-types";
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
import { Edit, Trash } from "react-feather";

class Cosigner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      appReqId: props.appReqId,
      activeTab: "1",
      rowData: [],
      menuFlag: null,
      actionId: null,
      updateCosigner: {
        firstName: "",
        lastName: "",
        mobileNo: "",
        email: "",
        address: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
        cosignDtlId: "",
      },
      columns: [
        {
          name: "First Name",
          selector: "cosignFirstName",
          sortable: true,
          minWidth: "300px",
        },
        {
          name: "Mobile No",
          selector: "cosignMobileNo",
          sortable: true,
        },
        {
          name: "Email",
          selector: "cosignEmail",
          sortable: true,
        },
        {
          name: "Actions",
          selector: "cosignDtlId",
          sortable: true,
          cell: (row) => (
            <this.ActionsComponent cosignDtlId={row.cosignDtlId} />
          ),
        },
      ],
    };
  }

  ActionsComponent = (props) => {
    return (
      <div className="data-list-action">
        <Update
          color="primary"
          className="cursor-pointer mr-1"
          size={20}
          onClick={() => this.toggleModal(5, props.cosignDtlId, 2)}
        />
        <DeleteForever
          color="secondary"
          className="cursor-pointer mr-1"
          size={20}
          onClick={() => this.toggleModal(5, props.cosignDtlId, 3)}
        />
      </div>
    );
  };
  async componentDidMount() {
    this.state.menuFlag = this.props.menuFlag;
    await axios
      .post("/lease/cosign/view/", {
        appReqId: this.state.appReqId,
      })
      .then((response) => {
        let listData = response.data.cosign;
        let rowDataList = [];
        let nData = {
          cosignDtlId: listData.cosignDtlId,
          cosignEmail: listData.cosignEmail,
          cosignMobileNo: listData.cosignMobileNo,
          cosignFirstName: listData.cosignFirstName,
        };
        rowDataList.push(nData);
        this.setState({ rowData: rowDataList });
      })
      .catch((error) => {
        console.log("error:::" + error);
      });
  }

  render() {
    const { actionId, updateCosigner } = this.state;
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
                  firstName: "sathees" + this.state.appReqId,
                  lastName: "kumar" + this.state.appReqId,
                  mobileNo: "9945127586",
                  email: "sathees@test.com",
                  address: "test",
                  city: "test",
                  state: "tsst",
                  postalCode: "12345",
                  country: "NY",
                }}
                validationSchema={formValidation}
                onSubmit={(values, actions) => {
                  setTimeout(() => {
                    let payload = {
                      appReqId: this.state.appReqId,
                      cosignFirstName: values.firstNamelastName,
                      cosignLastName: values.lastName,
                      cosignMobileNo: values.mobileNo,
                      cosignEmail: values.email,
                      cosignAddress: values.address,
                      cosignCity: values.city,
                      cosignState: values.state,
                      cosignPostalCode: values.postalCode,
                      cosignCountry: values.country,
                      activeStatus: 1,
                    };

                    axios({
                      method: "POST",
                      url: "/lease/cosign/create/",
                      data: payload,
                    })
                      .then((response) => {
                        let responseCode = "";
                        console.log("Response:::::::::::::" + response.data);
                        responseCode = response.data.responseCode;
                        console.log(
                          "Response Code:::::::::::::" + responseCode
                        );
                        if (responseCode == 1000) {
                          this.successMessage("successAlert", true);
                        } else {
                          this.errorMessgae("errorAlert", true);
                        }
                      })
                      .catch((error) => {
                        console.log(error);
                        // toast.error("Bad Request, Please verify your inputs!");
                      });
                  }, 1000);
                }}
              >
                {(props) => {
                  const { setFieldValue, errors, touched } = props;
                  return (
                    <Form onSubmit={props.handleSubmit}>
                      <Col>
                        <div>
                          <Row>
                            <Col sm="12" md="6">
                              <label htmlFor="firstName">First Name</label>

                              <FormGroup className=" position-relative">
                                <Field
                                  className="form-control"
                                  name="firstName"
                                  type="text"
                                />

                                <ErrorMessage
                                  name="firstName"
                                  component="div"
                                  className="field-error text-danger"
                                />
                              </FormGroup>
                            </Col>
                            <Col sm="12" md="6">
                              <label htmlFor="lastName">Last Name</label>

                              <FormGroup className=" position-relative">
                                <Field
                                  className="form-control"
                                  name="lastName"
                                  type="text"
                                />

                                <ErrorMessage
                                  name="lastName"
                                  component="div"
                                  className="field-error text-danger"
                                />
                              </FormGroup>
                            </Col>
                            <Col sm="12" md="6">
                              <label htmlFor="mobileNo">Mobile No</label>

                              <FormGroup className=" position-relative">
                                <Field
                                  className="form-control"
                                  name="mobileNo"
                                  type="text"
                                />

                                <ErrorMessage
                                  name="mobileNo"
                                  component="div"
                                  className="field-error text-danger"
                                />
                              </FormGroup>
                            </Col>
                            <Col sm="12" md="6">
                              <label htmlFor="email">Email</label>

                              <FormGroup className=" position-relative">
                                <Field
                                  className="form-control"
                                  name="email"
                                  type="text"
                                />

                                <ErrorMessage
                                  name="email"
                                  component="div"
                                  className="field-error text-danger"
                                />
                              </FormGroup>
                            </Col>
                            <Col sm="12" md="6">
                              <label htmlFor="address">Address</label>

                              <FormGroup className=" position-relative">
                                <Field
                                  className="form-control"
                                  name="address"
                                  type="text"
                                />

                                <ErrorMessage
                                  name="address"
                                  component="div"
                                  className="field-error text-danger"
                                />
                              </FormGroup>
                            </Col>
                            <Col sm="12" md="6">
                              <label htmlFor="city">City</label>

                              <FormGroup className=" position-relative">
                                <Field
                                  className="form-control"
                                  name="city"
                                  type="text"
                                />

                                <ErrorMessage
                                  name="city"
                                  component="div"
                                  className="field-error text-danger"
                                />
                              </FormGroup>
                            </Col>
                            <Col sm="12" md="6">
                              <label htmlFor="state">State</label>

                              <FormGroup className=" position-relative">
                                <Field
                                  className="form-control"
                                  name="state"
                                  type="text"
                                />

                                <ErrorMessage
                                  name="state"
                                  component="div"
                                  className="field-error text-danger"
                                />
                              </FormGroup>
                            </Col>
                            <Col sm="12" md="6">
                              <label htmlFor="postalCode">Postal Code</label>

                              <FormGroup className=" position-relative">
                                <Field
                                  className="form-control"
                                  name="postalCode"
                                  type="text"
                                />

                                <ErrorMessage
                                  name="postalCode"
                                  component="div"
                                  className="field-error text-danger"
                                />
                              </FormGroup>
                            </Col>
                            <Col sm="12" md="6">
                              <label htmlFor="country">Country</label>

                              <FormGroup className=" position-relative">
                                <Field
                                  className="form-control"
                                  name="country"
                                  type="text"
                                />

                                <ErrorMessage
                                  name="country"
                                  component="div"
                                  className="field-error text-danger"
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                        </div>

                        <br />
                      </Col>

                      <FormGroup row>
                        <Col md={{ size: 8, offset: 4 }}>
                          <Button.Ripple
                            color="primary"
                            type="submit"
                            className="mr-1 mb-1"
                          >
                            <CheckCircleOutlined size={14} />

                            <span className="align-middle ml-25">Create</span>
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
    const renderUpdateModal = ModalUpdateConfig.map((item) => {
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
                  firstName: updateCosigner.firstName,
                  lastName: updateCosigner.lastName,
                  mobileNo: updateCosigner.mobileNo,
                  email: updateCosigner.email,
                  address: updateCosigner.address,
                  city: updateCosigner.city,
                  state: updateCosigner.state,
                  postalCode: updateCosigner.postalCode,
                  country: updateCosigner.country,
                }}
                validationSchema={formValidation}
                onSubmit={(values, actions) => {
                  setTimeout(() => {
                    let payload = {
                      appReqId: this.state.appReqId,
                      cosignDtlId: this.state.updateCosigner.cosignDtlId,
                      cosignFirstName: values.firstName,
                      cosignLastName: values.lastName,
                      cosignMobileNo: values.mobileNo,
                      cosignEmail: values.email,
                      cosignAddress: values.address,
                      cosignCity: values.city,
                      cosignState: values.state,
                      cosignPostalCode: values.postalCode,
                      cosignCountry: values.country,
                      activeStatus: 1,
                    };

                    axios({
                      method: "POST",
                      url: "/lease/cosign/update/",
                      data: payload,
                    })
                      .then((response) => {
                        let responseCode = "";
                        console.log("Response:::::::::::::" + response.data);
                        responseCode = response.data.responseCode;
                        console.log(
                          "Response Code:::::::::::::" + responseCode
                        );
                        if (responseCode == 1000) {
                          this.successMessage("successAlert", true);
                        } else {
                          this.errorMessgae("errorAlert", true);
                        }
                      })
                      .catch((error) => {
                        console.log(error);
                        // toast.error("Bad Request, Please verify your inputs!");
                      });
                  }, 1000);
                }}
              >
                {(props) => {
                  const { setFieldValue, errors, touched } = props;
                  return (
                    <Form onSubmit={props.handleSubmit}>
                      <Col>
                        <div>
                          <Row>
                            <Col sm="12" md="6">
                              <label htmlFor="firstName">First Name</label>

                              <FormGroup className=" position-relative">
                                <Field
                                  className="form-control"
                                  name="firstName"
                                  type="text"
                                />

                                <ErrorMessage
                                  name="firstName"
                                  component="div"
                                  className="field-error text-danger"
                                />
                              </FormGroup>
                            </Col>
                            <Col sm="12" md="6">
                              <label htmlFor="lastName">Last Name</label>

                              <FormGroup className=" position-relative">
                                <Field
                                  className="form-control"
                                  name="lastName"
                                  type="text"
                                />

                                <ErrorMessage
                                  name="lastName"
                                  component="div"
                                  className="field-error text-danger"
                                />
                              </FormGroup>
                            </Col>
                            <Col sm="12" md="6">
                              <label htmlFor="mobileNo">Mobile No</label>

                              <FormGroup className=" position-relative">
                                <Field
                                  className="form-control"
                                  name="mobileNo"
                                  type="text"
                                />

                                <ErrorMessage
                                  name="mobileNo"
                                  component="div"
                                  className="field-error text-danger"
                                />
                              </FormGroup>
                            </Col>
                            <Col sm="12" md="6">
                              <label htmlFor="email">Email</label>

                              <FormGroup className=" position-relative">
                                <Field
                                  className="form-control"
                                  name="email"
                                  type="text"
                                />

                                <ErrorMessage
                                  name="email"
                                  component="div"
                                  className="field-error text-danger"
                                />
                              </FormGroup>
                            </Col>
                            <Col sm="12" md="6">
                              <label htmlFor="address">Address</label>

                              <FormGroup className=" position-relative">
                                <Field
                                  className="form-control"
                                  name="address"
                                  type="text"
                                />

                                <ErrorMessage
                                  name="address"
                                  component="div"
                                  className="field-error text-danger"
                                />
                              </FormGroup>
                            </Col>
                            <Col sm="12" md="6">
                              <label htmlFor="city">City</label>

                              <FormGroup className=" position-relative">
                                <Field
                                  className="form-control"
                                  name="city"
                                  type="text"
                                />

                                <ErrorMessage
                                  name="city"
                                  component="div"
                                  className="field-error text-danger"
                                />
                              </FormGroup>
                            </Col>
                            <Col sm="12" md="6">
                              <label htmlFor="state">State</label>

                              <FormGroup className=" position-relative">
                                <Field
                                  className="form-control"
                                  name="state"
                                  type="text"
                                />

                                <ErrorMessage
                                  name="state"
                                  component="div"
                                  className="field-error text-danger"
                                />
                              </FormGroup>
                            </Col>
                            <Col sm="12" md="6">
                              <label htmlFor="postalCode">Postal Code</label>

                              <FormGroup className=" position-relative">
                                <Field
                                  className="form-control"
                                  name="postalCode"
                                  type="text"
                                />

                                <ErrorMessage
                                  name="postalCode"
                                  component="div"
                                  className="field-error text-danger"
                                />
                              </FormGroup>
                            </Col>
                            <Col sm="12" md="6">
                              <label htmlFor="country">Country</label>

                              <FormGroup className=" position-relative">
                                <Field
                                  className="form-control"
                                  name="country"
                                  type="text"
                                />

                                <ErrorMessage
                                  name="country"
                                  component="div"
                                  className="field-error text-danger"
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                        </div>

                        <br />
                      </Col>

                      <FormGroup row>
                        <Col md={{ size: 8, offset: 4 }}>
                          <Button.Ripple
                            color="primary"
                            type="submit"
                            className="mr-1 mb-1"
                          >
                            <CheckCircleOutlined size={14} />

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
    const renderDeleteModal = ModalDeleteConfig.map((item) => {
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
                  firstName: updateCosigner.firstName,
                  lastName: updateCosigner.lastName,
                  mobileNo: updateCosigner.mobileNo,
                  email: updateCosigner.email,
                  address: updateCosigner.address,
                  city: updateCosigner.city,
                  state: updateCosigner.state,
                  postalCode: updateCosigner.postalCode,
                  country: updateCosigner.country,
                }}
                validationSchema={formValidation}
                onSubmit={(values, actions) => {
                  setTimeout(() => {
                    let payload = {
                      appReqId: this.state.appReqId,
                      cosignDtlId: this.state.updateCosigner.cosignDtlId,
                      cosignFirstName: values.firstName,
                      cosignLastName: values.lastName,
                      cosignMobileNo: values.mobileNo,
                      cosignEmail: values.email,
                      cosignAddress: values.address,
                      cosignCity: values.city,
                      cosignState: values.state,
                      cosignPostalCode: values.postalCode,
                      cosignCountry: values.country,
                      activeStatus: 1,
                    };

                    axios({
                      method: "POST",
                      url: "/lease/cosign/delete/",
                      data: payload,
                    })
                      .then((response) => {
                        let responseCode = "";
                        console.log("Response:::::::::::::" + response.data);
                        responseCode = response.data.responseCode;
                        console.log(
                          "Response Code:::::::::::::" + responseCode
                        );
                        if (responseCode == 1000) {
                          this.successMessage("successAlert", true);
                        } else {
                          this.errorMessgae("errorAlert", true);
                        }
                      })
                      .catch((error) => {
                        console.log(error);
                        // toast.error("Bad Request, Please verify your inputs!");
                      });
                  }, 1000);
                }}
              >
                {(props) => {
                  const { setFieldValue, errors, touched } = props;
                  return (
                    <Form onSubmit={props.handleSubmit}>
                      <Col>
                        <div>
                          <Row>
                            <Col sm="12" md="6">
                              <label htmlFor="firstName">First Name</label>

                              <FormGroup className=" position-relative">
                                <Field
                                  className="form-control"
                                  name="firstName"
                                  type="text"
                                />

                                <ErrorMessage
                                  name="firstName"
                                  component="div"
                                  className="field-error text-danger"
                                />
                              </FormGroup>
                            </Col>
                            <Col sm="12" md="6">
                              <label htmlFor="lastName">Last Name</label>

                              <FormGroup className=" position-relative">
                                <Field
                                  className="form-control"
                                  name="lastName"
                                  type="text"
                                />

                                <ErrorMessage
                                  name="lastName"
                                  component="div"
                                  className="field-error text-danger"
                                />
                              </FormGroup>
                            </Col>
                            <Col sm="12" md="6">
                              <label htmlFor="mobileNo">Mobile No</label>

                              <FormGroup className=" position-relative">
                                <Field
                                  className="form-control"
                                  name="mobileNo"
                                  type="text"
                                />

                                <ErrorMessage
                                  name="mobileNo"
                                  component="div"
                                  className="field-error text-danger"
                                />
                              </FormGroup>
                            </Col>
                            <Col sm="12" md="6">
                              <label htmlFor="email">Email</label>

                              <FormGroup className=" position-relative">
                                <Field
                                  className="form-control"
                                  name="email"
                                  type="text"
                                />

                                <ErrorMessage
                                  name="email"
                                  component="div"
                                  className="field-error text-danger"
                                />
                              </FormGroup>
                            </Col>
                            <Col sm="12" md="6">
                              <label htmlFor="address">Address</label>

                              <FormGroup className=" position-relative">
                                <Field
                                  className="form-control"
                                  name="address"
                                  type="text"
                                />

                                <ErrorMessage
                                  name="address"
                                  component="div"
                                  className="field-error text-danger"
                                />
                              </FormGroup>
                            </Col>
                            <Col sm="12" md="6">
                              <label htmlFor="city">City</label>

                              <FormGroup className=" position-relative">
                                <Field
                                  className="form-control"
                                  name="city"
                                  type="text"
                                />

                                <ErrorMessage
                                  name="city"
                                  component="div"
                                  className="field-error text-danger"
                                />
                              </FormGroup>
                            </Col>
                            <Col sm="12" md="6">
                              <label htmlFor="state">State</label>

                              <FormGroup className=" position-relative">
                                <Field
                                  className="form-control"
                                  name="state"
                                  type="text"
                                />

                                <ErrorMessage
                                  name="state"
                                  component="div"
                                  className="field-error text-danger"
                                />
                              </FormGroup>
                            </Col>
                            <Col sm="12" md="6">
                              <label htmlFor="postalCode">Postal Code</label>

                              <FormGroup className=" position-relative">
                                <Field
                                  className="form-control"
                                  name="postalCode"
                                  type="text"
                                />

                                <ErrorMessage
                                  name="postalCode"
                                  component="div"
                                  className="field-error text-danger"
                                />
                              </FormGroup>
                            </Col>
                            <Col sm="12" md="6">
                              <label htmlFor="country">Country</label>

                              <FormGroup className=" position-relative">
                                <Field
                                  className="form-control"
                                  name="country"
                                  type="text"
                                />

                                <ErrorMessage
                                  name="country"
                                  component="div"
                                  className="field-error text-danger"
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                        </div>

                        <br />
                      </Col>

                      <FormGroup row>
                        <Col md={{ size: 8, offset: 4 }}>
                          <Button.Ripple
                            color="danger"
                            type="submit"
                            className="mr-1 mb-1"
                          >
                            <CheckCircleOutlined size={14} />

                            <span className="align-middle ml-25">Delete</span>
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
    const { rowData, columns } = this.state;
    return (
      <Card>
        <CardBody>
          <Row>
            <Col md="11" sm="12">
              <h6 className="primary">Cosigner Details</h6>
            </Col>
            <Col md="1" sm="12">
              <Button.Ripple
                className="btn-icon rounded-circle"
                color="primary"
                onClick={() => this.toggleModal(5, null, 1)}
                id="addCosign"
              >
                <AddCircle />
              </Button.Ripple>
              <UncontrolledTooltip placement="top" target="addCosign">
                Add Cosigner
              </UncontrolledTooltip>
            </Col>
          </Row>

          <DataTable data={rowData} columns={columns} noHeader />
        </CardBody>
        <Col md="12" sm="12">
          {actionId == 1 && (
            <TabContent activeTab={this.state.activeTab}>
              <TabPane tabId="1">{renderCreateModal}</TabPane>
            </TabContent>
          )}

          {actionId == 2 && (
            <TabContent activeTab={this.state.activeTab}>
              <TabPane tabId="1">{renderUpdateModal}</TabPane>
            </TabContent>
          )}
          {actionId == 3 && (
            <TabContent activeTab={this.state.activeTab}>
              <TabPane tabId="1">{renderDeleteModal}</TabPane>
            </TabContent>
          )}
        </Col>
      </Card>
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
        onConfirm={() => this.hideAlert()}
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
        onConfirm={() => this.hideAlert()}
      >
        <p className="sweet-alert-text">Request Updated Failed</p>
      </SweetAlert>
    );
    this.setState({
      alert: getAlert(),
    });
  }
  handleChange = (event) => {
    this.setState({
      notesDesc: event.target.value,
      notesLength: event.target.value.length,
    });
  };
  hideAlert() {
    this.setState({
      alert: null,
      modal: null,
    });
    this.componentDidMount();
  }

  toggleModal = (id, cosignDtlId, actionId) => {
    if (cosignDtlId !== null && cosignDtlId !== undefined) {
      axios
        .post("/lease/cosign/view/", {
          appReqId: this.state.appReqId,
        })
        .then((response) => {
          this.setState({
            updateCosigner: {
              firstName: response.data.cosign.cosignFirstName,
              lastName: response.data.cosign.cosignLastName,
              mobileNo: response.data.cosign.cosignMobileNo,
              email: response.data.cosign.cosignEmail,
              address: response.data.cosign.cosignAddress,
              city: response.data.cosign.cosignCity,
              state: response.data.cosign.cosignState,
              postalCode: response.data.cosign.cosignPostalCode,
              country: response.data.cosign.cosignCountry,
              cosignDtlId: response.data.cosign.cosignDtlId,
            },
          });
        })
        .catch((error) => {
          console.log("error:::" + error);
        });
    }
    if (this.state.modal !== id) {
      this.setState({
        modal: id,
        actionId: actionId,
      });
    } else {
      this.setState({
        modal: null,
      });
    }
  };
}

const ModalCreateConfig = [
  {
    id: 5,
    btnTitle: "Add Cosigner",
    modalTitle: "Add Cosigner",
    modalClass: "modal-lg",
    bgColor: "bg-primary",
  },
];
const ModalUpdateConfig = [
  {
    id: 5,
    btnTitle: "Update Cosigner",
    modalTitle: "Update Cosigner",
    modalClass: "modal-lg",
    bgColor: "bg-primary",
  },
];
const ModalDeleteConfig = [
  {
    id: 5,
    btnTitle: "Delete Cosigner",
    modalTitle: "Delete Cosigner",
    modalClass: "modal-lg",
    bgColor: "bg-primary",
  },
];
var featuresListData = [];
const phoneRegExp = /^((\+\d{1,3}(-| )?\(?\d\)?(-| )?\d{1,3})|(\(?\d{2,3}\)?))(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$/;
const formValidation = Yup.object().shape({
  firstName: Yup.string().required("Required"),
  lastName: Yup.string().required("Required"),
  mobileNo: Yup.string()
    .matches(phoneRegExp, "Phone number is not valid")
    .required("Required"),
  email: Yup.string().email("Invalid email address").required("Required"),
  address: Yup.string().required("Required"),
  city: Yup.string().required("Required"),
  state: Yup.string().required("Required"),
  postalCode: Yup.string()
    .matches(/(^\d{5}$)|(^\d{5}-\d{4}$)/, "Invalid PostalCode")
    .required("Required"),
  country: Yup.string().required("Required"),
});
Cosigner.propTypes = {
  appReqId: PropTypes.string.isRequired,
};
export default Cosigner;
