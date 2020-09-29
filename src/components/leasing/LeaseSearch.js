import React from "react";
import { history } from "../../history";
import "../../assets/scss/plugins/tables/_agGridStyleOverride.scss";
import { AgGridReact } from "ag-grid-react";
import { Card, CardBody, Input, Row, Col, Button } from "reactstrap";
import axios from "axios";
import { ContextLayout } from "../../utility/context/Layout";
import moment from "moment";
import LeaseSelection from "./LeaseSelection";

import {
  CheckCircle,
  EditLocationTwoTone,
  DeleteForever,
  AddCircle,
  Edit,
  AddCircleOutline,
} from "@material-ui/icons";

class LeaseSearch extends React.Component {
  state = {
    activeTab: "1",
    tooltipOpen: false,
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
        headerName: "Applicant ID",
        field: "applicantId",
        width: 50,
        filter: true,
      },
      {
        headerName: "Tenant Name",
        field: "tenantName",
        filter: true,
        width: 250,
      },
      {
        headerName: "Email",
        field: "email",
        filter: true,
        width: 250,
      },

      {
        headerName: "Lease Start",
        field: "leaseStartDate",
        filter: true,
        width: 200,
        cellRendererFramework: (params) => {
          return (
            <div className="d-inline-block mr-1 mb-1">
              {moment(params.value).format("MM-DD-YYYY")}
            </div>
          );
        },
      },
      {
        headerName: "Lease End",
        field: "leaseEndDate",
        filter: true,
        width: 200,
        cellRendererFramework: (params) => {
          return (
            <div className="d-inline-block mr-1 mb-1">
              {moment(params.value).format("MM-DD-YYYY")}
            </div>
          );
        },
      },
      {
        headerName: "Lease Type",
        field: "leaseType",
        filter: true,
        width: 200,
        cellRendererFramework: (params) => {
          return params.value === "Fixed" ? (
            <div className="badge badge-pill badge-light-success">
              {"Fixed"}
            </div>
          ) : params.value === "Review Pending" ? (
            <div className="badge badge-pill badge-light-info">
              {"Review Pending"}
            </div>
          ) : params.value === "New" ? (
            <div className="badge badge-pill badge-light-primary">{"New"}</div>
          ) : params.value === "Deleted" ? (
            <div className="badge badge-pill badge-light-warning">
              {"Deleted"}
            </div>
          ) : params.value === "Rejected" ? (
            <div className="badge badge-pill badge-light-danger">
              {"Rejected"}
            </div>
          ) : null;
        },
      },
      {
        headerName: "Lease Status",
        field: "leaseStatus",
        filter: true,
        width: 200,
        cellRendererFramework: (params) => {
          return params.value === "Active" ? (
            <div className="badge badge-pill badge-light-success">
              {"Active"}
            </div>
          ) : params.value === "Review Pending" ? (
            <div className="badge badge-pill badge-light-info">
              {"Review Pending"}
            </div>
          ) : params.value === "New" ? (
            <div className="badge badge-pill badge-light-primary">{"New"}</div>
          ) : params.value === "Deleted" ? (
            <div className="badge badge-pill badge-light-warning">
              {"Deleted"}
            </div>
          ) : params.value === "Rejected" ? (
            <div className="badge badge-pill badge-light-danger">
              {"Rejected"}
            </div>
          ) : null;
        },
      },
      {
        headerName: "Actions",
        field: "applicantId&&leaseStartDate",
        width: 150,
        cellRendererFramework: (params) => {
          var appReqId = params.data.applicantId;
          var leaseStartDate = params.data.leaseStartDate;
          return (
            <div className="actions cursor-pointer">
              {leaseStartDate == null && (
                <AddCircle
                  color="primary"
                  className="mr-50"
                  style={{ fontSize: 25 }}
                  onClick={() => history.push("/leaseCreate/" + appReqId)}
                />
              )}{" "}
              {leaseStartDate !== null && (
                <Edit
                  color="secondary"
                  className="mr-50"
                  style={{ fontSize: 25 }}
                  onClick={() => history.push("/leaseUpdate/" + appReqId)}
                />
              )}
              <EditLocationTwoTone
                color="primary"
                className="mr-50"
                style={{ fontSize: 25 }}
                onClick={() => history.push("/leaseView/" + params.value)}
              />
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

  async componentDidMount() {
    await axios({
      method: "POST",
      url: "/lease/lease-info/",
    })
      .then((response) => {
        try {
          let listData = response.data.leaseInfo;
          this.setState({ rowData: listData });
        } catch (e) {
          console.log(e);
        }
      })
      .catch((error) => {
        console.log("error:::" + error);
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
  handleNewRequest = () => {
    this.props.history.push("/leaseSelection");
  };
  render() {
    const { rowData, columnDefs, defaultColDef, pageSize, params } = this.state;
    return (
      <Row className="app-user-list">
        <Col sm="12">
          <Card>
            <CardBody>
              <div className="ag-theme-material ag-grid-table">
                <div className="ag-grid-actions d-flex justify-content-between flex-wrap mb-1">
                  <LeaseSelection></LeaseSelection>
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

export default LeaseSearch;
