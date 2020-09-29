import React from "react";
import { CheckSquare, XSquare } from "react-feather";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../../assets/scss/plugins/extensions/toastr.scss";
import Helpers from "../Helpers";
import LovList from "../../common/Helpers";
import SweetAlert from "react-bootstrap-sweetalert";
import moment from "moment";
import { ContextLayout } from "../../../utility/context/Layout";
import "../../../assets/scss/plugins/tables/_agGridStyleOverride.scss";
import { AgGridReact } from "ag-grid-react";
import Select from "react-select";
import Chip from "../../@vuexy/chips/ChipComponent";
import Cosign from "../../applicant/Cosign";
import * as appConst from "../../../utility/Constants";
import DataTable from "react-data-table-component";
import Radio from "../../@vuexy/radio/RadioVuexy";
import {
  Beenhere,
  HomeWork,
  Contacts,
  KingBed,
  AspectRatio,
  Bathtub,
  AttachMoney,
  AddCircle,
  Cancel,
  DirectionsCar,
  LocalParking,
  EmailRounded,
  PhoneAndroidRounded,
  DateRange,
} from "@material-ui/icons";
import { green, orange } from "@material-ui/core/colors";
import {
  Button,
  Form,
  FormGroup,
  Input,
  Row,
  Col,
  Card,
  CardTitle,
  CardBody,
  TabContent,
  TabPane,
  Modal,
  ModalHeader,
  ModalBody,
  UncontrolledTooltip,
  Table,
  ListGroup,
  ListGroupItem,
} from "reactstrap";

class RenewalLeaseCreate extends React.Component {
  _isMounted = false;
  dismissAlert = () => {
    this.setState({
      visible: false,
    });
  };
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }
  state = {
    users: [
      {
        paymentType: "",
        balance: "",
        receivedAmount: "",
        paymentNotes: "",
      },
    ],
    leaseEndDate: "",
    rent: "",
    leaseType: "",
    selectedOption: [],
    unitid: null,
    propUnitName: null,
    propUnitNumber: null,
    propNoOfBedRooms: null,
    propNoOfBathRooms: null,
    propSquareFeet: null,
    propRentAmount: null,
    unitDetails: null,
    propertyParkingName: null,
    parkingName: null,
    parkingNo: null,
    mcarportDtlId: null,
    proptyUnitId: null,
    rowData1: [],
    visible: true,
    values: [],
    successAlert: true,
    activeTab: "1",
    tooltipOpen: false,
    modal: null,
    modalParking: null,
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
    leaseStatus: "",
    tenantChip: "",
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
        field:
          "proptyUnitId&propUnitName&propUnitNumber&propNoOfBedRooms&propSquareFeet&propRentAmount",
        width: 150,
        cellRendererFramework: (params) => {
          var proptyUnitId = params.data.proptyUnitId;
          var propUnitName = params.data.propUnitName;
          var propUnitNumber = params.data.propUnitNumber;
          var propNoOfBedRooms = params.data.propNoOfBedRooms;
          var propSquareFeet = params.data.propSquareFeet;
          var propRentAmount = params.data.propRentAmount;
          return (
            <div className="actions cursor-pointer">
              <Button
                color="primary"
                className="mr-50"
                onClick={() => {
                  this.apptData(
                    proptyUnitId,
                    propUnitName,
                    propUnitNumber,
                    propNoOfBedRooms,
                    propSquareFeet,
                    propRentAmount
                  );
                }}
              >
                Select
              </Button>
            </div>
          );
        },
      },
    ],
    columnParkingDefs: [
      {
        headerName: "Property Name",
        field: "propertyName",
        width: 250,
        filter: true,
      },

      {
        headerName: "Parking Name",
        field: "parkingName",
        filter: true,
        width: 250,
      },
      {
        headerName: "Parking No",
        field: "parkingNumber",
        filter: true,
        width: 250,
      },
      {
        headerName: "Parking Status",
        field: "parkingStatus",
        filter: true,
        width: 200,
        cellRendererFramework: (params) => {
          return params.value === "Available" ? (
            <div className="badge badge-pill badge-light-success">
              {"Available"}
            </div>
          ) : params.value === "Occupaid" ? (
            <div className="badge badge-pill badge-light-danger">
              {"Occupaid"}
            </div>
          ) : null;
        },
      },
      {
        headerName: "View",
        colId: "propertyName&parkingName&parkingNumber",
        width: 100,

        cellRendererFramework: (params) => {
          var propertyParkingName = params.data.propertyName;
          var parkingName = params.data.parkingName;
          var parkingNumber = params.data.parkingNumber;
          var mcarportDtlId = params.data.mcarportDtlId;

          return (
            <div className="actions cursor-pointer">
              <div className="d-inline-block mr-1 mb-1">
                <Button.Ripple
                  color="primary"
                  className="mr-50"
                  onClick={() =>
                    this.parkingData(
                      propertyParkingName,
                      parkingName,
                      parkingNumber,
                      mcarportDtlId
                    )
                  }
                >
                  Select
                </Button.Ripple>
              </div>
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
    columnsOffer: [
      {
        name: "Lease Type",
        selector: "leaseType",
        sortable: true,
        minWidth: "300px",
      },
      {
        name: "Lease End",
        selector: "leaseEndDate",
        sortable: true,
      },
      {
        name: "Rent",
        selector: "rent",
        sortable: true,
      },
      {
        name: "Actions",
        selector: "offerDtlId",
        sortable: true,

        cell: (row) => <this.ActionsComponent offerDtlId={row.offerDtlId} />,
      },
    ],
    rowParkingData: [],
    leaseTypeList: [],
    tenantId: "",
    rowOfferDtl: [],

    offerRadio: 1,
    offerListData: [],
  };
  ActionsComponent = (props) => {
    return (
      <div className="data-list-action">
        <Radio
          color="primary"
          name="checked"
          onClick={() => this.selectOffer(props.offerDtlId)}
        />
      </div>
    );
  };
  selectOffer = (offerDtlId) => {
    let value = this.state.offerListData;
    for (var i = 0; i < value.length; i++) {
      if (value[i]["offerDtlId"] === offerDtlId) {
        var index = i;
        this.state.rent = value[index]["rent"];
        this.state.leaseEndDate = value[index]["leaseEndDate"];
        this.state.leaseType = value[index]["leaseType"];
      }
    }
  };
  async componentDidMount() {
    var paymentParentId = appConst.paymentMethodParentId;
    var leaseParentId = appConst.leaseStatusParentId;

    paymentList = await LovList.lovList(paymentParentId);
    leaseStatusList = await LovList.lovList(leaseParentId);
    this.state.leaseTypeList = await LovList.lovList(appConst.leaseType);

    this._isMounted = true;
    var paramValue1 = this.props.match.params.paramValue1;
    var applicantInfo = "";
    var responseCode = "";
    var res = "";
    let rowDataList = [];
    let nData = {};

    await axios
      .post("/lease/search-byid/", {
        appReqId: paramValue1,
      })
      .then((response) => {
        res = response.data.leaseInfo;

        this.setState({
          applicantStatus: res.applicantStatus,
          leaseDtlId: res.leaseDtlId,
          leaseStartDate: moment(res.leaseStartDate).format("YYYY-MM-DD"),
          leaseEndDate: moment(res.leaseEndDate).format("YYYY-MM-DD"),
          mangeNotes: res.remarks,
          leaseStatus: res.leaseStatus,
          leaseType: res.leaseType,
          mcarportDtlId: res.carportId,
          proptyUnitId: res.proptyUnitId,
          totalRent: res.totRent,
        });
      })
      .catch((error) => {
        console.log("error:::" + error);
      });
    await axios
      .post("/lease/applicant-search-byid/", {
        appReqstId: paramValue1,
      })
      .then((response) => {
        let res = response.data.appInfo;

        this.setState({
          firstName: res.firstName,
          emailAdress: res.emailAdress,
          applicantPhoneNumber: res.applicantPhoneNumber,
          tenantChip: res.firstName.charAt(0),
        });
      })
      .catch((error) => {
        console.log("error:::" + error);
      });
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
        console.log("error:::" + error);
      });
    this.apptData(this.state.proptyUnitId);
    await axios({
      method: "POST",
      url: "/rentals/carport/search-all-details/",
    })
      .then((response) => {
        let dtlData = response.data.carportDtl;
        this.setState({ rowParkingData: dtlData });
        console.log("this.state.mcarportDtlId " + this.state.mcarportDtlId);
        var indexVal = dtlData.findIndex(
          (obj) => obj.mcarportDtlId == this.state.mcarportDtlId
        );
        for (var i = 0; i < dtlData.length; i++) {
          this.setState({
            propertyParkingName: dtlData[indexVal].propertyName,
            parkingName: dtlData[indexVal].parkingName,
            parkingNo: dtlData[indexVal].parkingNumber,
            mcarportDtlId: dtlData[indexVal].mcarportDtlId,
          });
        }
      })
      .catch((error) => {
        console.log("error:::" + error);
      });
    axios
      .post("/rentals/property/search-byunitid/", {
        proptyUnitId: this.state.proptyUnitId,
      })

      .then((response) => {
        var ress = response.data.unitDetails;
        console.log("ress.propUnitName:::" + ress.propUnitName);

        this.setState((prevState) => ({
          propUnitName: ress.propUnitName,
          propUnitNumber: ress.propUnitNumber,
          propNoOfBedRooms: ress.propNoOfBedRooms,
          propNoOfBathRooms: ress.propNoOfBathRooms,
          propSquareFeet: ress.propSquareFeet,
          propRentAmount: ress.propRentAmount,
        }));
      })
      .catch((error) => {
        console.log("error" + error);
      });
  }

  render() {
    const {
      firstName = "",
      emailAdress = "",
      applicantStatus = "",
      leaseStartDate = "",
      leaseEndDate = "",
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
      columnParkingDefs = "",
      rowParkingData,
      appReqstId = "",
      leaseStatus = "",
      propertyParkingName,
      parkingName,
      parkingNo,
      mcarportDtlId,
      applicantPhoneNumber,
      tenantChip,
      leaseTypeList = "",
      leaseType = "",
      rowOfferDtl,
      columnsOffer,
      totalRent,
      offerRadio,
      manualRadio,
    } = this.state;
    const renderParkingModal = ModalConfig.map((item) => {
      return (
        <React.Fragment key={item.id}>
          <Modal
            isOpen={this.state.modalParking === item.id}
            toggle={() => this.toggleParkingModal(item.id)}
            className={`modal-dialog-centered ${item.modalClass}`}
            key={item.id}
          >
            <ModalHeader
              toggle={() => this.toggleParkingModal(item.id)}
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
                                columnDefs={columnParkingDefs}
                                rowData={rowParkingData}
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
    const renderModal = ModalConfig.map((item) => {
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
          appReqstId: appReqstId,
          leaseStatus: leaseStatus,
          emailAdress: emailAdress,
          applicantPhoneNumber: applicantPhoneNumber,
          tenantChip: tenantChip,
          leaseType: leaseType,
        }}
        validationSchema={formValidation}
        onSubmit={(values, actions) => {
          console.log(
            "values.leaseType.value:::::::::::::" + values.leaseType.value
          );
          let responseCode = "";
          let payload = "";
          setTimeout(() => {
            if (this.state.offerRadio == 1) {
              payload = {
                appReqId: this.state.tenantId,
                leaseEndDate: this.state.leaseEndDate,
                leaseType: this.state.leaseType,
              };
            } else {
              payload = {
                appReqId: this.state.tenantId,
                leaseEndDate: values.leaseEndDate,
                leaseType: values.leaseType,
              };
            }
            axios({
              method: "POST",
              url: "/renewal/create/",
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
              <Card>
                <CardBody>
                  <Row>
                    <Col md="11" sm="12">
                      <CardTitle>Tenant Details</CardTitle>
                    </Col>

                    <Col md="12" sm="12">
                      <TabContent activeTab={this.state.activeTab}>
                        <TabPane tabId="1">{renderParkingModal}</TabPane>
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
                            Tenant Name
                          </th>
                          <th
                            style={{
                              width: 300,
                            }}
                          >
                            Email
                          </th>
                          <th
                            style={{
                              width: 300,
                            }}
                          >
                            Moboile No
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <Chip
                              className="mr-1"
                              avatarColor="warning "
                              avatarText={tenantChip}
                              text={firstName}
                            />
                          </td>
                          <td>
                            {" "}
                            <EmailRounded style={{ color: orange[500] }} />{" "}
                            {emailAdress}
                          </td>
                          <td>
                            <PhoneAndroidRounded
                              style={{ color: orange[500] }}
                            />{" "}
                            {applicantPhoneNumber}
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
                            Current Lease Start
                          </th>
                          <th
                            style={{
                              width: 300,
                            }}
                          >
                            Current Lease End
                          </th>
                          <th
                            style={{
                              width: 300,
                            }}
                          >
                            Current Rent
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <DateRange style={{ color: orange[500] }} />
                            {leaseStartDate}
                          </td>
                          <td>
                            {" "}
                            <DateRange style={{ color: orange[500] }} />{" "}
                            {leaseEndDate}
                          </td>
                          <td>
                            <AttachMoney style={{ color: orange[500] }} />{" "}
                            {totalRent}
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </Row>
                </CardBody>
                <Cosign propertyId={"propId"} menuFlag={1} />
              </Card>

              <Card>
                <CardBody>
                  <CardTitle>Lease Details</CardTitle>
                  <Row>
                    <Col sm="12" md="6">
                      <label htmlFor="leaseEndDate">Lease End Date</label>
                      <FormGroup className=" position-relative">
                        <Field
                          className="form-control"
                          name="leaseEndDate"
                          type="date"
                        />

                        <ErrorMessage
                          name="leaseEndDate"
                          component="div"
                          className="field-error text-danger"
                        />
                      </FormGroup>
                    </Col>{" "}
                    <Col sm="12" md="6">
                      <label htmlFor="leaseType">Lease Type</label>
                      <FormGroup className=" position-relative">
                        <Select
                          type="select"
                          name="leaseType"
                          value={leaseTypeList.find(
                            (obj) => obj.value === leaseType || ""
                          )}
                          options={leaseTypeList}
                          onChange={(leaseTypeList) =>
                            setFieldValue("leaseType", leaseTypeList)
                          }
                        />

                        <ErrorMessage
                          name="leaseEndDate"
                          component="div"
                          className="field-error text-danger"
                        />
                      </FormGroup>
                    </Col>
                    <Col sm="12" md="12">
                      <label htmlFor="mangeNotes">Notes</label>
                      <FormGroup className=" position-relative">
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

                        <ErrorMessage
                          name="mangeNotes"
                          component="div"
                          className="field-error text-danger"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <Row>
                    <Col md="11" sm="12">
                      <CardTitle>Appartment Details</CardTitle>
                    </Col>
                    <Col md="1" sm="12">
                      <Button.Ripple
                        className="btn-icon rounded-circle"
                        color="primary"
                        onClick={() => this.toggleModal(5)}
                        id="addapp"
                      >
                        <AddCircle />
                      </Button.Ripple>
                      <UncontrolledTooltip placement="top" target="addapp">
                        Select Unit
                      </UncontrolledTooltip>
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
                            <HomeWork style={{ color: green[500] }} />{" "}
                            {propUnitName}
                          </td>
                          <td>
                            {" "}
                            <Contacts style={{ color: green[500] }} />{" "}
                            {propUnitNumber}
                          </td>
                          <td>
                            <KingBed style={{ color: green[500] }} />{" "}
                            {propNoOfBedRooms}
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
                            <Bathtub style={{ color: green[500] }} />{" "}
                            {propNoOfBathRooms}
                          </td>
                          <td>
                            <AspectRatio style={{ color: green[500] }} />{" "}
                            {propSquareFeet}
                          </td>
                          <td>
                            <AttachMoney style={{ color: green[500] }} />
                            {propRentAmount}
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </Row>
                </CardBody>
              </Card>
              <Card>
                <CardBody>
                  <Row>
                    <Col md="11" sm="12">
                      <CardTitle>Parking Details</CardTitle>
                    </Col>
                    <Col md="1" sm="12">
                      <Button.Ripple
                        className="btn-icon rounded-circle"
                        color="primary"
                        onClick={() => this.toggleParkingModal(5)}
                        id="addapp"
                      >
                        <AddCircle />
                      </Button.Ripple>
                      <UncontrolledTooltip placement="top" target="addapp">
                        Select Unit
                      </UncontrolledTooltip>
                    </Col>
                    <Col md="12" sm="12">
                      <TabContent activeTab={this.state.activeTab}>
                        <TabPane tabId="1">{renderParkingModal}</TabPane>
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
                            Parking Name
                          </th>
                          <th
                            style={{
                              width: 300,
                            }}
                          >
                            Parking No
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <HomeWork style={{ color: green[500] }} />{" "}
                            {propertyParkingName}
                          </td>
                          <td>
                            {" "}
                            <LocalParking style={{ color: green[500] }} />{" "}
                            {parkingName}
                          </td>
                          <td>
                            <DirectionsCar style={{ color: green[500] }} />{" "}
                            {parkingNo}
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </Row>
                </CardBody>
              </Card>
              <Card>
                <CardBody>
                  <Row>
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
                            <h6>Total</h6>
                          </Col>
                        </ListGroupItem>
                      </ListGroup>
                      <br />
                    </Col>

                    <Col md="12" sm="12">
                      <CardTitle>Security Deposit</CardTitle>
                    </Col>
                    <Col md="3" sm="12">
                      <label htmlFor="leaseStartDate">Payment Type</label>

                      <FormGroup className="has-icon-left position-relative">
                        <Field
                          name="paymentType"
                          as="select"
                          className={
                            "form-control" +
                            (errors.title && touched.title ? " is-invalid" : "")
                          }
                        >
                          <option value="Security Deposit">
                            Security Deposit
                          </option>
                        </Field>
                        <div className="form-control-position">
                          <Beenhere />
                        </div>
                      </FormGroup>
                    </Col>
                    <Col md="3" sm="12">
                      <label htmlFor="paymentAmount">Amount</label>

                      <FormGroup className="has-icon-left position-relative">
                        <Field
                          className="form-control"
                          name="paymentAmount"
                          type="number"
                        />
                      </FormGroup>
                    </Col>
                    <Col md="3" sm="12">
                      <label htmlFor="dueDate">Payment Date</label>

                      <FormGroup className="has-icon-left position-relative">
                        <Field
                          className="form-control"
                          name="dueDate"
                          type="date"
                        />
                      </FormGroup>
                    </Col>
                    <Col md="3" sm="12">
                      <label htmlFor="paymentNotes">Payment Notes</label>

                      <FormGroup className="has-icon-left position-relative">
                        <Field
                          className="form-control"
                          name="paymentNotes"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <hr />
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
                  </Col>
                  <FormGroup row>
                    <Col md={{ size: 8, offset: 4 }}>
                      {this.state.alert}
                      <ToastContainer />
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

  renewalRadioOffer = () => {
    this.setState({
      offerRadio: "1",
    });
    console.log("offerRadio2 " + this.state.offerRadio);
  };
  renewalRadioManual = () => {
    this.setState({
      offerRadio: "2",
    });
    console.log("offerRadio3 " + this.state.offerRadio);
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
  toggleParkingModal = (id) => {
    if (this.state.modalParking !== id) {
      this.setState({
        modalParking: id,
      });
    } else {
      this.setState({
        modalParking: null,
      });
    }
  };
  apptData = (
    proptyUnitId,
    propUnitName,
    propUnitNumber,
    propNoOfBedRooms,
    propSquareFeet,
    propRentAmount
  ) => {
    this.setState((prevState) => ({
      proptyUnitId: proptyUnitId,
      propUnitName: propUnitName,
      propUnitNumber: propUnitNumber,
      propNoOfBedRooms: propNoOfBedRooms,
      propSquareFeet: propSquareFeet,
      propRentAmount: propRentAmount,
      mangeNotes: this.state.mangeNotes,
      modal: !prevState.modal,
    }));
    console.log("this.state.mangeNotes" + this.state.mangeNotes);
  };

  parkingData = (
    propertyParkingName,
    parkingName,
    parkingNo,
    mcarportDtlId
  ) => {
    this.setState((prevState) => ({
      propertyParkingName: propertyParkingName,
      parkingName: parkingName,
      parkingNo: parkingNo,
      mcarportDtlId: mcarportDtlId,
      modalParking: !prevState.modalParking,
    }));
    console.log("this.state.mangeNotes" + this.state.mangeNotes);
  };

  createUI() {
    const { setFieldValue, errors, touched } = this.state;
    return this.state.users.map((el, i) => (
      <div key={i}>
        <Row>
          <Col md="3" sm="12">
            <Select
              type="select"
              name="paymentType"
              //value={el.paymentType || ""}
              options={paymentList}
              onChange={this.handleSelectChange.bind(this, i)}
            />
          </Col>
          <Col md="2" sm="12">
            <Input
              name="paymentAmount"
              value={el.paymentAmount || ""}
              onChange={this.handleChange.bind(this, i)}
              type="text"
            />
          </Col>

          <Col md="2" sm="12">
            <Input
              name="dueDate"
              value={el.dueDate || ""}
              onChange={this.handleChange.bind(this, i)}
              type="date"
            />
          </Col>
          <Col md="4" sm="12">
            <Input
              name="paymentNotes"
              value={el.paymentNotes || ""}
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
  handleChange(i, e) {
    const { name, value } = e.target;
    let users = [...this.state.users];
    users[i] = { ...users[i], [name]: value };
    this.setState({ users });
  }
  handleSelectChange(i, e) {
    let users = [...this.state.users];
    users[i] = { ...users[i], ["paymentType"]: e.value };
    this.setState({ users });
  }

  removeClick(i) {
    let users = [...this.state.users];
    users.splice(i, 1);
    this.setState({ users });
  }
  handleSubmit(event) {
    alert("Values: " + this.state.values.join(", "));
    event.preventDefault();
  }

  addClick() {
    this.setState((prevState) => ({
      users: [
        ...prevState.users,
        {
          paymentType: "",
          balance: "",
          receivedAmount: "",
          paymentNotes: "",
        },
      ],
    }));
  }
  successMessgae(state, value) {
    const getAlert = () => (
      <SweetAlert
        success
        confirmBtnText="Ok!"
        title="Success"
        show={this.state.successAlert}
        onConfirm={() => Helpers.redirectRenewalSearch()}
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
        onConfirm={() => Helpers.redirectRenewalSearch()}
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
  getUnitContents = () => {
    var appReqstId = this.props.match.params.appReqId;
    this.props.getUnits();
    this.props.getTenant(appReqstId);
  };

  getUnitSeacrh = (unitid) => {
    this.props.getUnitSearch(unitid);
  };
}
var paymentList = [];
var leaseStatusList = [];
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
export default RenewalLeaseCreate;
