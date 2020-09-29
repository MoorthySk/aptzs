import React from "react";
import {
  Card,
  CardBody,
  Row,
  Col,
  Button,
  UncontrolledTooltip,
} from "reactstrap";
import {
  EmojiPeople,
  HomeWork,
  DateRange,
  AttachMoney,
  Payment,
  ChromeReaderMode,
  ViewAgendaOutlined,
} from "@material-ui/icons";
import moment from "moment";
import axios from "axios";
import { ContextLayout } from "../../utility/context/Layout";
import { AgGridReact } from "ag-grid-react";
import { history } from "../../history";
import "../../assets/scss/plugins/tables/_agGridStyleOverride.scss";
import "../../assets/scss/pages/users.scss";
import { Badge } from "reactstrap";
class RentManagement extends React.Component {
  state = {
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
    rowData: [],
    columnDefs: [
      {
        headerName: "Actions",
        field: "appReqId",
        width: 200,
        cellRendererFramework: (params) => {
          return (
            <div className="actions cursor-pointer">
              <div className="d-inline-block mr-1 mb-1">
                <Badge
                  color="primary"
                  className="mr-1 mb-1"
                  onClick={() =>
                    history.push("/rentalsSummary/" + params.value)
                  }
                >
                  <ViewAgendaOutlined size={12} />
                  <span>View</span>
                </Badge>
                <Badge
                  color="success"
                  className="mr-1 mb-1"
                  onClick={() => history.push("/rentUpdate/" + params.value)}
                >
                  <Payment size={12} />
                  <span>Pay</span>
                </Badge>
              </div>
            </div>
          );
        },
      },
      {
        headerName: "Property Name",
        field: "propertyName",
        width: 250,
        filter: true,
        cellRendererFramework: (params) => {
          return (
            <div className="actions cursor-pointer">
              <HomeWork
                color="primary"
                onClick={() => history.push("/propertySummary/" + params.value)}
              />{" "}
              {params.value}{" "}
            </div>
          );
        },
      },

      {
        headerName: "Unit",
        field: "unitName",
        filter: true,
        width: 180,
      },
      {
        headerName: "Tenant Name",
        field: "tenantName",
        filter: true,
        width: 250,
        cellRendererFramework: (params) => {
          return (
            <div className="actions cursor-pointer">
              <EmojiPeople color="primary" />
              <div
                className="d-inline-block mr-1 mb-1"
                onClick={() => history.push("/tenantManagement/" + "1052")}
              >
                {params.value}
              </div>
            </div>
          );
        },
      },

      {
        headerName: "Lease Start",
        field: "leaseStartDate",
        filter: true,
        width: 150,
        cellRendererFramework: (params) => {
          return (
            <div className="actions cursor-pointer">
              <DateRange color="primary" />
              <div className="d-inline-block mr-1 mb-1">{params.value}</div>
            </div>
          );
        },
      },
      {
        headerName: "Lease End",
        field: "leaseEndDate",
        filter: true,
        width: 150,
        cellRendererFramework: (params) => {
          return (
            <div className="actions cursor-pointer">
              <DateRange color="primary" />
              <div className="d-inline-block mr-1 mb-1">{params.value}</div>
            </div>
          );
        },
      },
      {
        headerName: "Status",
        field: "leaseStatus",
        filter: true,
        width: 120,

        cellRendererFramework: (params) => {
          return params.value === "Active" ? (
            <div className="badge badge-pill badge-light-success">
              {"Active"}
            </div>
          ) : params.value === "InActive" ? (
            <div className="badge badge-pill badge-light-warning">
              {"InActive"}
            </div>
          ) : params.value === "Expired" ? (
            <div className="badge badge-pill badge-light-danger">
              {"Expired"}
            </div>
          ) : null;
        },
      },

      {
        headerName: "Days Left",
        field: "daysLeft",
        filter: true,
        width: 150,

        cellStyle: (params) =>
          params.value < 61 ? { color: "red", "font-weight": "bold" } : null,
      },
      {
        headerName: "Rent",
        field: "rentAmount",
        filter: true,
        width: 120,
        cellRendererFramework: (params) => {
          return (
            <div className="actions cursor-pointer">
              <AttachMoney color="primary" />
              <div className="d-inline-block mr-1 mb-1">{params.value}</div>
            </div>
          );
        },
      },
      {
        headerName: "Current Month",
        field: "currentMonth",
        filter: true,
        width: 200,
        cellRendererFramework: (params) => {
          return params.value === "Paid" ? (
            <div className="badge badge-pill badge-light-success">{"Paid"}</div>
          ) : params.value === "UnPaid" ? (
            <div className="badge badge-pill badge-light-warning">
              {"UnPaid"}
            </div>
          ) : null;
        },
      },
    ],
  };

  async componentDidMount() {
    await axios({
      method: "POST",
      url: "/rentals/rent/search/",
    })
      .then((response) => {
        console.log("Response:::::::::::::" + response.data.rentalInfo);
        try {
          let listData = response.data.rentalInfo;
          let marked = listData;
          let rowDataList = [];
          let nData = {};
          this.state.rowData.splice(0, this.state.rowData.length);
          marked !== undefined &&
            listData.forEach((rData) => {
              nData.unitName = rData.unitName;
              nData.tenantName = rData.tenantName;
              nData.rentStatus = rData.rentStatus;
              nData.leaseStartDate = moment(rData.leaseStartDate).format(
                "MM-DD-YYYY"
              );
              nData.leaseEndDate = moment(rData.leaseEndDate).format(
                "MM-DD-YYYY"
              );
              nData.propertyName = rData.propertyName;
              nData.daysLeft = rData.daysLeft;
              nData.appReqId = rData.appReqId;
              nData.leaseStatus = rData.leaseStatus;
              nData.rent = rData.rent;
              rowDataList.push(nData);
              this.setState((prevState) => ({
                rowData: [...prevState.rowData],
              }));
              this.setState({ rowData: rowDataList });
            });
        } catch (e) {
          console.log(e);
        }
      })
      .catch((error) => {
        console.log("Concurrent Login Issue:::" + error);
        this.componentDidMount();
      });
  }

  onGridReady = (params) => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  };

  filterData = (column, val) => {
    var filter = this.gridApi.getFilterInstance(column);
    var modelObj = null;
    if (val !== "all") {
      modelObj = {
        type: "equals",
        filter: val,
      };
    }
    filter.setModel(modelObj);
    this.gridApi.onFilterChanged();
  };

  filterSize = (val) => {
    if (this.gridApi) {
      this.gridApi.paginationSetPageSize(Number(val));
      this.setState({
        pageSize: val,
      });
    }
  };
  updateSearchQuery = (val) => {
    this.gridApi.setQuickFilter(val);
    this.setState({
      searchVal: val,
    });
  };

  render() {
    const { rowData, columnDefs, defaultColDef, pageSize } = this.state;
    return (
      <Row>
        <Col sm="12">
          <Card>
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
          </Card>
        </Col>
      </Row>
    );
  }
}

export default RentManagement;
