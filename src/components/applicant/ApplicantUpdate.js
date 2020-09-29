import React from "react";
import Avatar from "../@vuexy/avatar/AvatarComponent";
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
import {
  DateRange,
  Beenhere,
  NoteAdd,
  HomeWork,
  Contacts,
  KingBed,
  AspectRatio,
  Bathtub,
  AttachMoney,
  AssignmentTurnedInSharp,
  EmailSharp,
  MonetizationOn,
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

class TenantUpdate extends React.Component {
  _isMounted = false;
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
    rowData1: [],
    visible: true,
    values: [],
    successAlert: true,
    activeTab: "1",
    tooltipOpen: false,
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
        headerName: "Unit Name",
        field: "propUnitName",
        width: 50,
        filter: true,
      },
      {
        headerName: "Unit Number",
        field: "propUnitNumber",
        filter: true,
        width: 250,
      },
      {
        headerName: "No Of Bed",
        field: "propNoOfBedRooms",
        filter: true,
        width: 250,
      },
      {
        headerName: "No Of bath",
        field: "propNoOfBathRooms",
        filter: true,
        width: 200,
      },

      {
        headerName: "Square Feet",
        field: "propSquareFeet",
        filter: true,
        width: 200,
      },

      {
        headerName: "Rent",
        field: "propRentAmount",
        filter: true,
        width: 200,
      },
      {
        headerName: "Status",
        field: "recordStatus",
        filter: true,
        width: 200,
      },
      {
        headerName: "Select",
        field: "proptyUnitId",
        width: 150,
        cellRendererFramework: (params) => {
          return (
            <div className="actions cursor-pointer">
              <Button
                color="primary"
                className="mr-50"
                onClick={() => {
                  let proptyUnitId = params.value;

                  this.apptData(proptyUnitId);
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

  getUnitContents = () => {
    var appReqstId = this.props.applicantId;
    this.props.getUnits();
    this.props.getTenant(appReqstId);
  };

  getUnitSeacrh = (unitid) => {
    this.props.getUnitSearch(unitid);
  };

  //:::::::::::::::::::::Fetch Data Start:::::::::::::::::::::::::::::::::::::::::::::://
  async componentDidMount() {
    this._isMounted = true;
    var appReqstId = this.props.applicantId;
    var applicantInfo = "";
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
        if (this._isMounted) {
          this.setState({
            firstName: applicantInfo.firstName,
            emailAdress: applicantInfo.emailAdress,
            applicantPhoneNumber: applicantInfo.applicantPhoneNumber,
            applicantStatus: applicantInfo.applicantStatus,
            leaseStartDate: moment(applicantInfo.leaseStartDate).format(
              "YYYY-MM-DD"
            ),
            leaseStartDate1: moment(applicantInfo.leaseStartDate).format(
              "MM-DD-YYYY"
            ),
            leaseEndDate: moment(applicantInfo.leaseEndDate).format(
              "YYYY-MM-DD"
            ),
            leaseEndDate1: moment(applicantInfo.leaseStartDate).format(
              "MM-DD-YYYY"
            ),
            mangeNotes: applicantInfo.mangeNotes,
            appReqstId: applicantInfo.appReqstId,
            proptyUnitId: applicantInfo.proptyUnitId,
          });
        }
      })
      .catch((error) => {
        console.log("Concurrent Login Issue:::" + error);
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
            if (this._isMounted) {
              this.setState({ rowData });
            }
          } catch (e) {
            console.log(e);
          }
        })
        .catch((error) => {
          console.log("Concurrent Login Issue:::" + error);
        });
    }
    //For Appartment Selection
    await axios({
      method: "POST",
      url: "/rentals/property/search-all/",
    })
      .then((response) => {
        console.log("Response:::::::::::::" + response.data);
        try {
          let rowData = response.data.propUnitDtls;
          console.log("rowData:::::::::::::" + response.data.responseMsg);
          if (this._isMounted) {
            this.setState({ rowData });
          }
        } catch (e) {
          console.log(e);
        }
      })
      .catch((error) => {
        console.log("Concurrent Login Issue:::" + error);
      });
    this.apptData(applicantInfo.proptyUnitId);
  }
  componentWillUnmount() {
    this._isMounted = false;
    this.setState = (state, callback) => {
      return;
    };
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
  onGridReady = (params) => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  };

  updateSearchQuery = (val) => {
    this.gridApi.setQuickFilter(val);
    this.setState({
      searchVal: val,
    });
  };

  onRowSelected = (event) => {
    try {
      var rowId = event.node.data.maintId;
    } catch (e) {
      console.log(e);
    }
  };

  onSelectionChanged = (event) => {
    var rowCount = event.api.getSelectedNodes().length;
  };
  onRowSelected = (event) => {
    try {
      var rowId = event.node.data.maintId;
    } catch (e) {
      console.log(e);
    }
  };
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
      columnDefs,
      defaultColDef,
      pageSize,
      propertyId = "",
      propUnitName = "",
      propUnitNumber = "",
      propNoOfBedRooms = "",
      propNoOfBathRooms = "",
      propSquareFeet = "",
      propRentAmount = "",
      proptyUnitId = "",
      rowData,
    } = this.state;

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
              <Row>
                <Col sm="12">
                  <Card>
                    <CardBody>
                      <div className="ag-theme-material ag-grid-table">
                        <div className="ag-grid-actions d-flex justify-content-between flex-wrap mb-1">
                          <div className="filter-actions d-flex">
                            <Input
                              className="w-70 mr-1 mb-1 mb-sm-0"
                              type="text"
                              placeholder="search..."
                              onChange={(e) =>
                                this.updateSearchQuery(e.target.value)
                              }
                              value={this.state.searchVal}
                            />

                            <div className="sort-dropdown"></div>
                          </div>
                        </div>
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
                                onSelectionChanged={this.onSelectionChanged.bind(
                                  this
                                )}
                              />
                            )}
                          </ContextLayout.Consumer>
                        ) : null}
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </ModalBody>
          </Modal>
        </React.Fragment>
      );
    });
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
              console.log("Inside the submit ");
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
                  <Row>
                    <Col sm="12">
                      <CardTitle>Lease Details</CardTitle>
                      <label htmlFor="leaseStartDate">Lease Start Date</label>

                      <FormGroup className="has-icon-left position-relative">
                        <Field
                          className="form-control"
                          name="leaseStartDate"
                          type="date"
                        />
                        <div className="form-control-position">
                          <DateRange />
                        </div>
                        <ErrorMessage
                          name="leaseStartDate"
                          component="div"
                          className="field-error text-danger"
                        />
                      </FormGroup>
                    </Col>
                    <Col sm="12">
                      <label htmlFor="leaseEndDate">Lease End Date</label>
                      <FormGroup className="has-icon-left position-relative">
                        <Field
                          className="form-control"
                          name="leaseEndDate"
                          type="date"
                        />
                        <div className="form-control-position">
                          <DateRange size={15} />
                        </div>
                        <ErrorMessage
                          name="leaseEndDate"
                          component="div"
                          className="field-error text-danger"
                        />
                      </FormGroup>
                    </Col>

                    <Col md="12" sm="12">
                      <label>Applicant Status</label>

                      <FormGroup className="has-icon-left position-relative">
                        <Field
                          name="applicantStatus"
                          as="select"
                          value={applicantStatus}
                          className={
                            "form-control" +
                            (errors.title && touched.title ? " is-invalid" : "")
                          }
                        >
                          <option value="New">New</option>
                          <option value="Review Pending">Review Pending</option>
                          <option value="Approved">Approved</option>
                          <option value="Rejected">Rejected</option>
                          <option value="Deleted">Deleted</option>
                        </Field>
                        <div className="form-control-position">
                          <Beenhere />
                        </div>
                      </FormGroup>
                    </Col>
                    <Col md="12" sm="12">
                      <label htmlFor="mangeNotes">Management Remarks</label>
                      <FormGroup className="has-icon-left position-relative">
                        <Field
                          name="mangeNotes"
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
                          <NoteAdd size={15} />
                        </div>

                        <ErrorMessage
                          name="mangeNotes"
                          component="div"
                          className="field-error text-danger"
                        />
                      </FormGroup>
                    </Col>
                    <Col md="12" sm="12">
                      <CardTitle>Appartment Details</CardTitle>
                    </Col>
                    <Col md="12" sm="12">
                      <TabContent activeTab={this.state.activeTab}>
                        <TabPane tabId="1">{renderModal}</TabPane>
                      </TabContent>
                    </Col>
                    <Table responsive bordered>
                      <thead>
                        <tr>
                          <th
                            style={{
                              width: 300,
                            }}
                          >
                            Property Name
                          </th>
                          <th
                            style={{
                              width: 300,
                            }}
                          >
                            Unit Number
                          </th>
                          <th
                            style={{
                              width: 300,
                            }}
                          >
                            No Of Bed
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <HomeWork size={15} /> {propUnitName}
                          </td>
                          <td>
                            {" "}
                            <Contacts size={15} /> {propUnitNumber}
                          </td>
                          <td>
                            <KingBed size={15} /> {propNoOfBedRooms}
                          </td>
                        </tr>
                      </tbody>
                      <thead>
                        <tr>
                          <th
                            style={{
                              width: 300,
                            }}
                          >
                            No Of Bath
                          </th>
                          <th
                            style={{
                              width: 300,
                            }}
                          >
                            Square Feet
                          </th>
                          <th
                            style={{
                              width: 300,
                            }}
                          >
                            Rent
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <Bathtub size={15} />
                            {propNoOfBathRooms}
                          </td>
                          <td>
                            <AspectRatio size={15} /> {propSquareFeet}
                          </td>
                          <td>
                            <AttachMoney />
                            {propRentAmount}
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </Row>
                  <div className="card-btns d-flex justify-content-between">
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
                  </div>
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

export default TenantUpdate;
