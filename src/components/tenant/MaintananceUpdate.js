import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import MaintanaceRequestService from "../../service/tenant/MaintanaceRequestService";
import Radio from "../../components/@vuexy/radio/RadioVuexy";
import SweetAlert from "react-bootstrap-sweetalert";
import axios from "axios";
import { CheckSquare, XSquare } from "react-feather";
import { ContextLayout } from "../../utility/context/Layout";
import { AgGridReact } from "ag-grid-react";
import "../../assets/scss/plugins/tables/_agGridStyleOverride.scss";
import "../../assets/scss/pages/users.scss";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../assets/scss/plugins/extensions/toastr.scss";
import Helpers from "./Helpers";
import {
  User,
  Mail,
  Phone,
  Edit,
  ArrowDown,
  DollarSign,
  Book,
} from "react-feather";

import {
  Card,
  CardHeader,
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
  Label,
} from "reactstrap";

//Default Error Messgae::::::::::::::::::::::::::::::::::::::::::::::::::::
const phoneRegExp = /^((\+\d{1,3}(-| )?\(?\d\)?(-| )?\d{1,3})|(\(?\d{2,3}\)?))(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$/;

const formValidation = Yup.object().shape({
  contactPersonName: Yup.string().nullable().required("Required"),
  priority: Yup.number().required("Required"),
  contactPersonEmail: Yup.string()
    .email("Invalid email address")
    .required("Required"),
  contactPersonNumber: Yup.string()
    .matches(phoneRegExp, "Phone number is not valid")
    .required("Required"),
  issueDesc: Yup.string().required("Required"),
  issueType: Yup.string().nullable().required("Required"),
  mangRemarks: Yup.string().required("Required"),
});
//Default Error Messgae end::::::::::::::::::::::::::::::::::::::::::::::::::::

const ModalConfig = [
  {
    id: 5,
    btnTitle: "Work Assign",
    modalTitle: "Employee Details",
    modalClass: "modal-xl",
    bgColor: "bg-primary",
  },
];

class MaintananceUpdate extends React.Component {
  constructor() {
    super();
    // this.forceUpdateHandler = this.forceUpdateHandler.bind(this);
    this.state.isLogged = false;
  }

  state = {
    values: [],
    successAlert: true,
    activeTab: "1",
    modal: null,
    rowData: null,
    pageSize: 20,
    isVisible: true,
    reload: false,
    collapse: true,
    status: "Opened",
    role: "All",
    selectStatus: "All",
    verified: "All",
    department: "All",
    defaultColDef: {
      sortable: true,
    },
    searchVal: "",
    columnDefs: [
      {
        headerName: "Employee ID",
        field: "empId",
        width: 50,
        filter: true,
      },
      {
        headerName: "Employee Name",
        field: "employeeName",
        filter: true,
        width: 250,
      },
      {
        headerName: "Employee Email",
        field: "employeeEmail",
        filter: true,
        width: 250,
      },
      {
        headerName: "Employee Phone",
        field: "employeePhone",
        filter: true,
        width: 200,
      },

      {
        headerName: "Vendor Name",
        field: "vendorId",
        filter: true,
        width: 200,
      },
      {
        headerName: "Select",
        field: "empId",
        width: 150,
        cellRendererFramework: (params) => {
          return (
            <div className="actions cursor-pointer">
              <Button
                color="primary"
                className="mr-50"
                onClick={() => {
                  let empId1 = params.value;

                  this.empData(empId1);
                }}
              >
                Select
              </Button>
            </div>
          );
        },
      },
    ],
    defaultColDef: {
      flex: 1,
      minWidth: 100,
    },
    rowSelection: "single",
    rowData: [],
  };
  empData = (assignedId) => {
    this.assignedId = assignedId;

    this.setState((prevState) => ({
      modal: !prevState.modal,
    }));

    axios
      .post("/manag/employee/search/empid", {
        empId: assignedId,
      })

      .then((response) => {
        var ress = response.data.empSearch;
        console.log(ress);
        this.setState({
          assignedId: ress.empId,
          employeePhone: ress.employeeEmail,
          employeeName: ress.employeeName,
          employeeEmail: ress.employeePhone,
        });
      });
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
  //:::::::::::::::::::::Fetch Data Start:::::::::::::::::::::::::::::::::::::::::::::://
  async componentDidMount() {
    var maintId = this.props.match.params.maintId;
    let mess = "";
    const options = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
    };
    await axios
      .post(
        "/tenant/maint/preEdit/",
        {
          maintId: maintId,
        },
        options
      )

      .then((response) => {
        mess = response.data.maintReq;
        this.setState({
          contactPersonName: mess.contactPersonName,
          contactPersonEmail: mess.contactPersonEmail,
          issueType: mess.issueType,
          issueDesc: mess.issueDesc,
          priority: mess.priority,
          contactPersonNumber: mess.contactPersonNumber,
          maintId: mess.maintId,
          mangRemarks: mess.mangRemarks,
          assignedId: mess.assignedId,
          meterialCost: mess.meterialCost,
          laborCost: mess.laborCost,
          requestStatus: mess.requestStatus,
        });
      });
    await axios({
      method: "POST",
      url: "/manag/employee/search/",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
    }).then((response) => {
      console.log("Response:::::::::::::" + response.data);
      try {
        let rowData = response.data.employeeRequest;
        console.log("rowData:::::::::::::" + response.data.responseMsg);
        this.setState({ rowData });
      } catch (e) {
        console.log(e);
      }
    });

    this.empData(mess.assignedId);
  }
  //:::::::::::::::::::::Fetch Data End:::::::::::::::::::::::::::::::::::::::::::::://
  render() {
    const { selectedOption } = this.state;
    let option = [];
    let marked = this.state.values;

    const {
      contactPersonName = "",
      contactPersonEmail = "",
      issueType = "",
      issueDesc = "",
      contactPersonNumber = "",
      priority = "",
      maintId = "",
      mangRemarks = "",
      employeePhone = "",
      employeeEmail = "",
      employeeName = "",
      assignedId = "",
      laborCost = "",
      meterialCost = "",
      requestStatus = "",
      rowData,
      columnDefs,
      defaultColDef,
      pageSize,
    } = this.state;
    //WorkAssign Popup Modal Satrt////////////////////////////
    const renderModal = ModalConfig.map((item) => {
      return (
        <React.Fragment key={item.id}>
          <div className="d-inline-block mr-1 mb-1">
            <Button.Ripple
              color="warning"
              onClick={() => this.toggleModal(item.id)}
              key={item.title}
              outline
            >
              {item.btnTitle}
            </Button.Ripple>
          </div>
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
              <CardBody>
                <div className="ag-theme-material ag-grid-table">
                  {this.state.rowData !== null ? (
                    <ContextLayout.Consumer>
                      {(context) => (
                        <AgGridReact
                          gridOptions={{}}
                          rowSelection="multiple"
                          defaultColDef={defaultColDef}
                          columnDefs={columnDefs}
                          rowData={rowData}
                          onGridReady={this.onGridReady}
                          colResizeDefault={"shift"}
                          animateRows={true}
                          floatingFilter={true}
                          pagination={true}
                          pivotPanelShow="always"
                          paginationPageSize={pageSize}
                          resizable={true}
                          enableRtl={context.state.direction === "rtl"}
                        />
                      )}
                    </ContextLayout.Consumer>
                  ) : null}
                </div>
              </CardBody>
            </ModalBody>
          </Modal>
        </React.Fragment>
      );
    });
    //WorkAssign Popup Modal End////////////////////////////
    return (
      <Card>
        <CardHeader>
          <CardTitle>Maintanance Request</CardTitle>
        </CardHeader>
        <CardBody>
          <Formik
            enableReinitialize
            initialValues={{
              contactPersonEmail: contactPersonEmail,
              issueType: issueType,
              issueDesc: issueDesc,
              contactPersonName: contactPersonName,
              priority: priority,
              contactPersonNumber: contactPersonNumber,
              maintId: maintId,
              assignedId: assignedId,
              employeePhone: "",
              employeeEmail: "",
              mangRemarks: mangRemarks,
              employeeName: "",
              laborCost: laborCost,
              meterialCost: meterialCost,
              requestStatus: requestStatus,
            }}
            validationSchema={formValidation}
            //Onsubmit API Call function start////////////////////////////

            onSubmit={(values, actions) => {
              let responseCode = "";

              setTimeout(() => {
                axios({
                  method: "POST",
                  url: "/tenant/maint/update/",
                  headers: {
                    Authorization:
                      "Bearer " + localStorage.getItem("accessToken"),
                  },
                  data: values,
                })
                  .then((response) => {
                    console.log("Response:::::::::::::" + response.data);

                    responseCode = response.data.responseCode;
                    console.log("Response Code:::::::::::::" + responseCode);
                    if ((responseCode = 1000)) {
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
            //Onsubmit API Call function End////////////////////////////
          >
            {(props) => {
              const { setFieldValue, errors, touched } = props;
              return (
                //Form Start////////////////////////////
                <Form onSubmit={props.handleSubmit}>
                  <Row>
                    <Col md="6" sm="12">
                      <CardTitle>Issue Type</CardTitle>

                      <FormGroup className="has-icon-left position-relative">
                        <Field
                          name="issueType"
                          as="select"
                          className={
                            "form-control" +
                            (errors.title && touched.title ? " is-invalid" : "")
                          }
                        >
                          <option value="">select</option>
                          <option value="1">Power Issue</option>
                          <option value="2">Payment Issue</option>
                          <option value="3">Service Issue</option>
                        </Field>
                        <div className="form-control-position">
                          <ArrowDown size={15} />
                        </div>
                        <ErrorMessage
                          name="issueType"
                          component="div"
                          className="field-error text-danger"
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6" sm="12">
                      <FormGroup>
                        <CardTitle>Priority</CardTitle>
                        <div className="d-inline-block mr-1">
                          <Radio
                            label="Low"
                            color="primary"
                            name="priority"
                            checked={priority === "1"}
                            onChange={() => setFieldValue("priority", priority)}
                          />
                        </div>
                        <div className="d-inline-block">
                          <Radio
                            label="Medium"
                            color="warning"
                            name="priority"
                            checked={priority === "2"}
                            onChange={() => setFieldValue("priority", priority)}
                          />
                        </div>
                        <div className="d-inline-block mr-1">
                          <Radio
                            label="High"
                            color="danger"
                            name="priority"
                            checked={priority === "3"}
                            onChange={() => setFieldValue("priority", priority)}
                          />
                        </div>
                        <ErrorMessage
                          name="priority"
                          component="div"
                          className="field-error text-danger"
                        />
                      </FormGroup>
                    </Col>
                    <Col md="12" sm="12">
                      <label htmlFor="issueDesc">Issue Description</label>
                      <FormGroup className="has-icon-left position-relative">
                        <Field
                          name="issueDesc"
                          className="form-control"
                          placeholder="Doe"
                        >
                          {({ field, form: { touched, errors }, meta }) => (
                            <div>
                              <Input
                                type="textarea"
                                placeholder="Issue Description"
                                {...field}
                              />
                            </div>
                          )}
                        </Field>
                        <div className="form-control-position">
                          <Edit size={15} />
                        </div>
                        <ErrorMessage
                          name="issueDesc"
                          component="div"
                          className="field-error text-danger"
                        />
                      </FormGroup>
                    </Col>

                    <Col md="12" sm="12">
                      <CardTitle>Contact Details</CardTitle>
                    </Col>
                    <Col md="6" sm="12">
                      <label>Person Name</label>
                      <FormGroup className="has-icon-left position-relative">
                        <Field
                          className="form-control"
                          name="contactPersonName"
                          placeholder="Doe"
                          type="text"
                        />

                        <div className="form-control-position">
                          <User size={15} />
                        </div>
                        <ErrorMessage
                          name="contactPersonName"
                          component="div"
                          className="field-error text-danger"
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6" sm="12">
                      <label htmlFor="contactPersonEmail">Email</label>
                      <FormGroup className="has-icon-left position-relative">
                        <Field
                          className="form-control"
                          name="contactPersonEmail"
                          placeholder="jane@acme.com"
                          type="email"
                        />
                        <div className="form-control-position">
                          <Mail size={15} />
                        </div>
                        <ErrorMessage
                          name="contactPersonEmail"
                          component="div"
                          className="field-error text-danger"
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6" sm="12">
                      <label htmlFor="contactPersonNumber">Person Number</label>
                      <FormGroup className="has-icon-left position-relative">
                        <Field
                          className="form-control"
                          name="contactPersonNumber"
                          type="number"
                          placeholder="Phone Number"
                        />
                        <div className="form-control-position">
                          <Phone size={15} />
                        </div>
                        <ErrorMessage
                          name="contactPersonNumber"
                          component="div"
                          className="field-error text-danger"
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6" sm="12"></Col>
                    <Col md="12" sm="12">
                      <CardTitle>Work Assigned Details</CardTitle>
                    </Col>
                    <Col md="12" sm="12">
                      <TabContent activeTab={this.state.activeTab}>
                        <TabPane tabId="1">{renderModal}</TabPane>
                      </TabContent>
                    </Col>

                    <Col md="6" sm="12">
                      <label htmlFor="contactPersonNumber">Employee ID</label>
                      <FormGroup className="has-icon-left position-relative">
                        <Field
                          className="form-control"
                          name="assignedId"
                          value={assignedId}
                          readOnly
                        />

                        <div className="form-control-position">
                          <Book size={15} />
                        </div>
                      </FormGroup>
                    </Col>
                    <Col md="6" sm="12">
                      <label htmlFor="contactPersonNumber">Employee Name</label>
                      <FormGroup className="has-icon-left position-relative">
                        <Field
                          className="form-control"
                          name="empName"
                          value={employeeName}
                          readOnly
                        />

                        <div className="form-control-position">
                          <User size={15} />
                        </div>
                      </FormGroup>
                    </Col>

                    <Col md="6" sm="12">
                      <label htmlFor="contactPersonNumber">
                        Employee Phone
                      </label>
                      <FormGroup className="has-icon-left position-relative">
                        <Field
                          className="form-control"
                          name="employeePhone"
                          value={employeePhone}
                          readOnly
                        />

                        <div className="form-control-position">
                          <Phone size={15} />
                        </div>
                      </FormGroup>
                    </Col>
                    <Col md="6" sm="12">
                      <label htmlFor="contactPersonNumber">
                        Employee Email
                      </label>

                      <FormGroup className="has-icon-left position-relative">
                        <Field
                          className="form-control"
                          name="employeeEmail"
                          value={employeeEmail}
                          readOnly
                        />

                        <div className="form-control-position">
                          <Mail size={15} />
                        </div>
                      </FormGroup>
                    </Col>
                    <Col md="6" sm="12">
                      <label>Labor Cost</label>
                      <FormGroup className="has-icon-left position-relative">
                        <Field
                          className="form-control"
                          name="laborCost"
                          placeholder="Doe"
                          type="number"
                        />

                        <div className="form-control-position">
                          <DollarSign size={15} />
                        </div>
                        <ErrorMessage
                          name="laborCost"
                          component="div"
                          className="field-error text-danger"
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6" sm="12">
                      <label>Meterial Cost</label>
                      <FormGroup className="has-icon-left position-relative">
                        <Field
                          className="form-control"
                          name="meterialCost"
                          placeholder="Doe"
                          type="number"
                        />

                        <div className="form-control-position">
                          <DollarSign size={15} />
                        </div>
                        <ErrorMessage
                          name="meterialCost"
                          component="div"
                          className="field-error text-danger"
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6" sm="12">
                      <Label>Request Status</Label>

                      <FormGroup className="has-icon-left position-relative">
                        <Field
                          name="requestStatus"
                          as="select"
                          className={
                            "form-control" +
                            (errors.title && touched.title ? " is-invalid" : "")
                          }
                        >
                          <option value="">select</option>
                          <option value="New">New</option>
                          <option value="Inprogress">Inprogress</option>
                          <option value="Completed">Completed</option>
                          <option value="Rejected">Rejected</option>
                        </Field>
                        <div className="form-control-position">
                          <ArrowDown size={15} />
                        </div>
                        <ErrorMessage
                          name="issueType"
                          component="div"
                          className="field-error text-danger"
                        />
                      </FormGroup>
                    </Col>
                    <Col md="12" sm="12">
                      <label htmlFor="mangRemarks">Management Remarks</label>
                      <FormGroup className="has-icon-left position-relative">
                        <Field
                          name="mangRemarks"
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
                        <ErrorMessage
                          name="mangRemarks"
                          component="div"
                          className="field-error text-danger"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <FormGroup row>
                    <Col md={{ size: 8, offset: 4 }}>
                      <Button.Ripple
                        color="primary"
                        type="submit"
                        className="mr-1 mb-1"
                      >
                        <CheckSquare size={14} />

                        <span className="align-middle ml-25">Update</span>
                      </Button.Ripple>

                      <Button.Ripple
                        color="danger"
                        onClick={Helpers.handleCancel}
                        className="mr-1 mb-1"
                      >
                        <XSquare size={14} />

                        <span className="align-middle ml-25">Cancel</span>
                      </Button.Ripple>

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
export default MaintananceUpdate;
