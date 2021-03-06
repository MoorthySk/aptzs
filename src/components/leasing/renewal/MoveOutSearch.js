import React from "react";
import { history } from "../../../history";
import "../../../assets/scss/plugins/tables/_agGridStyleOverride.scss";
import { AgGridReact } from "ag-grid-react";
import { Card, CardBody, Input, Row, Col, Button, Media } from "reactstrap";
import axios from "axios";
import { ContextLayout } from "../../../utility/context/Layout";
import moment from "moment";
import { Badge } from "reactstrap";
import MoveOutCreate from "./MoveOutCreate.js";

import { LocalOffer, Payment, HomeWork, Edit } from "@material-ui/icons";

import { NavLink } from "react-router-dom";
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
      autoHeight: true,
    },
    searchVal: "",
    rowData: [],
    columnDefs: [
      {
        headerName: "Action",
        field: "tenantId",
        width: 100,
        cellRenderer: "MoveOutCreate",
        autoHeight: true,
      },
      {
        headerName: "Property Name",
        colId: "propertyName&unitName&unitNo",
        filter: true,
        width: 300,
        cellRendererFramework: (params) => {
          return (
            <div className="actions cursor-pointer">
              <HomeWork
                color="primary"
                onClick={() => history.push("/propertySummary/" + params.value)}
              />
              {params.data.propertyName}
            </div>
          );
        },
      },
      {
        headerName: "Unit Name",
        colId: "unitName&unitNo",
        filter: true,
        width: 300,
        cellRendererFramework: (params) => {
          return (
            <div className="actions cursor-pointer">
              {params.data.unitName + " / " + params.data.unitNo}
            </div>
          );
        },
      },

      {
        headerName: "Tenant Name",
        field: "tenantName",
        filter: true,
        width: 250,
      },

      {
        headerName: "Comments",
        field: "comments",
        filter: true,
        width: 300,
      },

      {
        headerName: "Notice Given",
        field: "noticeGivenDate",
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
        headerName: "Move Out",
        field: "moveOutDate",
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
    ],
    context: { componentParent: this },
    frameworkComponents: {
      MoveOutCreate: MoveOutCreate,
    },
  };

  async componentDidMount() {
    console.log("inside mount:::");
    await axios({
      method: "POST",
      url: "/renewal/moveout/move-out-info/",
    })
      .then((response) => {
        try {
          let listData = response.data.moveout;

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
  methodFromParent = (cell) => {
    console.log("inside" + cell);
    if (cell == 1) {
      this.componentDidMount();
    }
  };
  render() {
    const { rowData, columnDefs, defaultColDef, pageSize } = this.state;
    return (
      <Row className="app-user-list">
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
                        autoHeight={true}
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
                        context={this.state.context}
                        frameworkComponents={this.state.frameworkComponents}
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
