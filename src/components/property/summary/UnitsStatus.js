import React from "react";
import { Formik } from "formik";
import {
  Row,
  CardBody,
  Card,
  Button,
  Col,
  ModalHeader,
  ModalBody,
  Form,
  TabContent,
  TabPane,
  Modal,
  Table,
  UncontrolledTooltip,
  Input,
} from "reactstrap";
import axios from "axios";
import {
  AssignmentReturn,
  ChromeReaderMode,
  AddCircle,
  ViewAgendaOutlined,
  Edit,
} from "@material-ui/icons";
import { AgGridReact } from "ag-grid-react";
import Helpers from "../Helpers";
import { ContextLayout } from "../../../utility/context/Layout";
import "../../../assets/scss/plugins/tables/_agGridStyleOverride.scss";
import Appliance from "./Appliance";
import Features from "./Features";
import moment from "moment";
import { history } from "../../../history";
const ModalConfig = [
  {
    id: 5,
    btnTitle: "Update",
    modalTitle: "Update Task",
    modalClass: "modal-xl",
    bgColor: "bg-primary",
  },
];
class RentalCard extends React.Component {
  state = {
    isActive: false,
    activeTab: "1",
    active: "1",
    unitName: null,
    unitNo: null,
    unitRent: null,
    unitSqFeet: null,
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
    tenantName: "",
    tenantEmail: "",
    tenantMobile: "",
    leaseStatus: "",
    leaseStartDate: "",
    leaseEndDate: "",
    daysLeft: "",
    defaultColDef: {
      sortable: true,
    },
    searchVal: "",
    columnDefs: [
      {
        headerName: "View",
        colId:
          "proptyUnitId&propUnitName&propUnitNumber&propRentAmount&propSquareFeet",
        width: 100,

        cellRendererFramework: (params) => {
          var unitName = params.data.propUnitName;
          var unitId = params.data.proptyUnitId;
          var unitNo = params.data.propUnitNumber;
          var unitRent = params.data.propRentAmount;
          var unitSqFeet = params.data.propSquareFeet;

          return (
            <div className="actions cursor-pointer">
              <div className="d-inline-block mr-1 mb-1">
                <ViewAgendaOutlined
                  className="btn-icon rounded-circle"
                  color="primary"
                  onClick={() =>
                    this.toggleModal(
                      unitId,
                      unitName,
                      unitNo,
                      unitRent,
                      unitSqFeet
                    )
                  }
                />
              </div>
            </div>
          );
        },
      },
      {
        headerName: "Unit Name",
        field: "propUnitName",
        width: 250,
        filter: true,
      },

      {
        headerName: "Unit No",
        field: "propUnitNumber",
        filter: true,
        width: 250,
      },
      {
        headerName: "Rent Amount",
        field: "propRentAmount",
        filter: true,
        width: 250,
      },
      {
        headerName: "Square Feet",
        field: "propSquareFeet",
        filter: true,
        width: 250,
      },
      {
        headerName: "Active Status",
        field: "recordStatus",
        filter: true,
        width: 250,
        cellRendererFramework: (params) => {
          return params.value === 1 ? (
            <div className="badge badge-pill badge-light-success">
              {"Active"}
            </div>
          ) : params.value === 9 ? (
            <div className="badge badge-pill badge-light-warning">
              {"InActive"}
            </div>
          ) : null;
        },
      },
    ],
  };
  toggleModal = (unitId, unitName, unitNo, unitRent, unitSqFeet) => {
    let id = "5";
    console.log("Unit Id" + unitId);
    console.log("unitName" + unitName);
    if (this.state.modal !== 5) {
      this.setState({
        unitId: unitId,
        unitName: unitName,
        unitNo: unitNo,
        unitRent: unitRent,
        unitSqFeet: unitSqFeet,
        modal: 5,
      });
    } else {
      this.setState({
        modal: null,
      });
    }
    this.leaseView(unitId);
    this.handleShow();
  };
  handleShow = () => {
    this.setState({
      isActive: true,
    });
  };

  handleHide = () => {
    this.setState({
      isActive: false,
    });
  };
  leaseView(unitId) {
    axios
      .post("/rentals/rent/lease-status/", {
        propertyUnitId: unitId,
      })

      .then((response) => {
        let leaseData = response.data.lease;
        if (leaseData != null) {
          this.setState({
            tenantName: leaseData.tenantName,
            tenantEmail: leaseData.tenantEmail,
            tenantMobile: leaseData.tenantMobile,
            leaseStatus: leaseData.leaseStatus,
            leaseStartDate: moment(leaseData.leaseStartDate).format(
              "MM-DD-YYYY"
            ),
            leaseEndDate: moment(leaseData.leaseEndDate).format("MM-DD-YYYY"),
            daysLeft: leaseData.daysLeft,
          });
        }
      })
      .catch((error) => {
        console.log("error:::" + error);
      });
  }
  async componentDidMount() {
    var propertyId = this.props.propertyId;
    await axios
      .post("/rentals/property/search/", {
        propertyId: propertyId,
      })

      .then((response) => {
        let rowData = response.data.unitDetails;
        this.setState({ rowData });
      })
      .catch((error) => {
        console.log("error:::" + error);
      });
  }
  render() {
    const {
      rowData,
      columnDefs,
      defaultColDef,
      pageSize,
      unitId,
      unitName,
      unitNo,
      unitRent,
      unitSqFeet,
      renderModal,
      tenantName,
      tenantEmail,
      tenantMobile,
      leaseStatus,
      leaseStartDate,
      leaseEndDate,
    } = this.state;
    if (this.state.isActive) {
      return (
        <React.Fragment>
          <Form onSubmit={this.handleSubmit}>
            <Row>
              <Col sm="12">
                <Card>
                  <CardBody>
                    <Col md="12" sm="12">
                      <h6 className="primary">Unit Details</h6>
                      <div className="users-page-view-table">
                        <Table responsive bordered>
                          <thead>
                            <tr>
                              <th
                                style={{
                                  width: 300,
                                  height: 50,
                                }}
                              >
                                Unit Name
                              </th>
                              <th
                                style={{
                                  width: 300,
                                  height: 50,
                                }}
                              >
                                Unit Number
                              </th>
                              <th
                                style={{
                                  width: 300,
                                  height: 50,
                                }}
                              >
                                Rent
                              </th>
                              <th
                                style={{
                                  width: 300,
                                  height: 50,
                                }}
                              >
                                Square Feet
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>{unitName}</td>
                              <td>{unitNo}</td>
                              <td>{unitRent}</td>
                              <td>{unitSqFeet}</td>
                            </tr>
                          </tbody>
                        </Table>
                      </div>

                      <br />

                      <br />
                      <h6 className="primary">Lease Status</h6>
                      <div className="users-page-view-table">
                        <Table responsive bordered>
                          <thead>
                            <tr>
                              <th
                                style={{
                                  width: 300,
                                  height: 50,
                                }}
                              >
                                Tenant Name
                              </th>
                              <th
                                style={{
                                  width: 300,
                                  height: 50,
                                }}
                              >
                                Lease Start Date
                              </th>
                              <th
                                style={{
                                  width: 300,
                                  height: 50,
                                }}
                              >
                                Lease End Date
                              </th>
                              <th
                                style={{
                                  width: 300,
                                  height: 50,
                                }}
                              >
                                Lease Status
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>{tenantName}</td>
                              <td>{leaseStartDate}</td>
                              <td>{leaseEndDate}</td>
                              <td>{leaseStatus}</td>
                            </tr>
                          </tbody>
                        </Table>
                      </div>
                    </Col>
                  </CardBody>
                </Card>
                <Card>
                  <CardBody>
                    <Features unitId={this.state.unitId}></Features>
                  </CardBody>
                </Card>
                <Card>
                  <CardBody>
                    <Appliance unitId={unitId}></Appliance>
                  </CardBody>
                </Card>
                <Card>
                  <CardBody>
                    <Row>
                      <Col md="11" sm="12">
                        <h6 className="primary">Files </h6>
                      </Col>
                      <Col md="1" sm="12">
                        <Button.Ripple
                          className="btn-icon rounded-circle"
                          color="primary"
                          onClick={this.handleHide}
                          id="addFile"
                        >
                          <AddCircle />
                        </Button.Ripple>
                        <UncontrolledTooltip placement="top" target="addFile">
                          Add File
                        </UncontrolledTooltip>
                      </Col>
                    </Row>
                    <div className="users-page-view-table">
                      <Table responsive bordered>
                        <thead>
                          <tr>
                            <th
                              style={{
                                width: 300,
                                height: 50,
                              }}
                            >
                              File Name
                            </th>
                            <th
                              style={{
                                width: 300,
                                height: 50,
                              }}
                            >
                              Created date
                            </th>
                            <th
                              style={{
                                width: 300,
                                height: 50,
                              }}
                            >
                              File
                            </th>
                            <th
                              style={{
                                width: 300,
                                height: 50,
                              }}
                            >
                              Active Status
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>Lease Documents</td>
                            <td>04/31/2021</td>
                            <td>lease.pdf</td>
                            <td>Active</td>
                          </tr>
                        </tbody>
                      </Table>
                    </div>
                    <Button.Ripple
                      className="btn-icon rounded-circle"
                      color="warning"
                      onClick={this.handleHide}
                      id="unitSearch"
                      outline
                    >
                      <AssignmentReturn />
                    </Button.Ripple>
                    <UncontrolledTooltip placement="top" target="unitSearch">
                      Back to unit search
                    </UncontrolledTooltip>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Form>
        </React.Fragment>
      );
    } else {
      return (
        <Row className="app-user-list">
          <Col sm="12">
            <Card>
              <CardBody>
                <div className="ag-theme-material ag-grid-table">
                  <div className="ag-grid-actions d-flex justify-content-between flex-wrap mb-1">
                    <Button.Ripple
                      color="primary"
                      type="submit"
                      className="mr-1 mb-1"
                      onClick={() =>
                        history.push("/unitUpdate/" + this.props.propertyId)
                      }
                    >
                      <Edit size={14} />

                      <span className="align-middle ml-25">Update</span>
                    </Button.Ripple>
                    <div className="filter-actions d-flex">
                      <Input
                        className="w-70 mr-1 mb-1 mb-sm-0"
                        type="text"
                        placeholder="search..."
                        onChange={(e) => this.updateSearchQuery(e.target.value)}
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
                        />
                      )}
                    </ContextLayout.Consumer>
                  ) : null}
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      );
    }
  }
}
export default RentalCard;
