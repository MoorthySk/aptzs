import React from "react";
import { history } from "../../history";
import "../../assets/scss/plugins/tables/_agGridStyleOverride.scss";
import { AgGridReact } from "ag-grid-react";
import { Card, CardBody, Input, Row, Col, Button } from "reactstrap";
import axios from "axios";
import { ContextLayout } from "../../utility/context/Layout";
import moment from "moment";
import { PlusCircle } from "react-feather";

import {
  CheckCircle,
  EditLocationTwoTone,
  DeleteForever,
} from "@material-ui/icons";

class TenantSearch extends React.Component {
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
        headerName: "Applicant Name",
        field: "applicantName",
        filter: true,
        width: 250,
      },
      {
        headerName: "Email",
        field: "applicantEmail",
        filter: true,
        width: 250,
      },

      {
        headerName: "Phone Number",
        field: "applicantId",
        filter: true,
        width: 200,
      },
      {
        headerName: "Status",
        field: "applicantStatus",
        filter: true,
        width: 200,
        cellRendererFramework: (params) => {
          return params.value === "Approved" ? (
            <div className="badge badge-pill badge-light-success">
              {"Approved"}
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
        field: "applicantId",
        width: 150,
        cellRendererFramework: (params) => {
          return (
            <div className="actions cursor-pointer">
              <CheckCircle
                color="primary"
                className="mr-50"
                style={{ fontSize: 25 }}
                onClick={() =>
                  history.push("/tenantManagement/" + params.value)
                }
              />

              <EditLocationTwoTone
                color="secondary"
                className="mr-50"
                style={{ fontSize: 25 }}
                //onClick={() => history.push("/tenantEdit/" + params.value)}
              />
              <DeleteForever
                style={{ fontSize: 25 }}
                color="error"
                // onClick={() => history.push("/leaseCreate/" + params.value)}
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

  handleNewRequest = () => {
    this.props.history.push("/applicantCreate");
  };
  handleWizard = () => {
    this.props.history.push("/applicantWizard");
  };
  async componentDidMount() {
    var token = localStorage.getItem("accessToken");

    await axios({
      method: "POST",
      url: "/lease/applicant-view-all/",
    })
      .then((response) => {
        console.log("Response:::::::::::::" + response.data.appInfo);
        try {
          let listData = response.data.applicantList;

          this.setState({ rowData: listData });
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

  updateSearchQuery = (val) => {
    this.gridApi.setQuickFilter(val);
    this.setState({
      searchVal: val,
    });
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
                  <Button.Ripple
                    color="success"
                    onClick={this.handleNewRequest}
                    className="mr-1 mb-1"
                  >
                    <PlusCircle size={14} />

                    <span className="align-middle ml-25">New Request</span>
                  </Button.Ripple>
                  <Button.Ripple
                    color="success"
                    onClick={this.handleWizard}
                    className="mr-1 mb-1"
                  >
                    <PlusCircle size={14} />

                    <span className="align-middle ml-25">Wizard Request</span>
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

export default TenantSearch;
