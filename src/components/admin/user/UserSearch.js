import React from "react";
import * as configData from "../../../utility/config";
import { Card, CardBody, Input, Row, Col, Button } from "reactstrap";
import axios from "axios";
import { ContextLayout } from "../../../utility/context/Layout";
import { AgGridReact } from "ag-grid-react";
import { PlusCircle } from "react-feather";
import {
  EditSharp,
  DeleteForever,
  VisibilityOutlined,
} from "@material-ui/icons";
import { history } from "../../../history";
import "../../../assets/scss/plugins/tables/_agGridStyleOverride.scss";
import "../../../assets/scss/pages/users.scss";
import Helpers from "./Helpers";
import RbacList from "../../../configs/RbacList";
import DeleteMessageRender from "./summary/DeleteComp";
class RoleSearch extends React.Component {
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
    columnDefs: [
      {
        headerName: "Login Id",
        field: "loginId",
        width: 50,
        filter: true,
      },
      {
        headerName: "User Name",
        field: "firstName",
        filter: true,
        width: 250,
      },
      {
        headerName: "Email Id",
        field: "emailId",
        filter: true,
        width: 250,
      },
      {
        headerName: "Mobile No",
        field: "mobileNo",
        filter: true,
        width: 250,
      },
      {
        headerName: "Status",
        field: "recordStatus",
        filter: true,
        width: 150,
        cellRendererFramework: (params) => {
          return params.value === 0 ? (
            <div className="badge badge-pill badge-light-success">
              {"Active"}
            </div>
          ) : params.value === 9 ? (
            <div className="badge badge-pill badge-light-danger">
              {"InActive"}
            </div>
          ) : null;
        },
      },
      {
        headerName: "Actions",
        field: "userId",
        width: 100,
        cellRendererFramework: (params) => {
          return (
            <div className="actions cursor-pointer">
              {this.state.userUpdate ? (
                <EditSharp
                  color="primary"
                  className="mr-50"
                  style={{ fontSize: 25 }}
                  onClick={() => history.push("/userUpdate/" + params.value)}
                />
              ) : null}
              <VisibilityOutlined
                color="primary"
                style={{ fontSize: 25 }}
                onClick={() => {
                  history.push("/userView/" + params.value);
                }}
              />
            </div>
          );
        },
      },
    ],
    rowData: createRowData(),
    context: { componentParent: this },
    frameworkComponents: {
      DeleteMessageRender: DeleteMessageRender,
    },
    defaultColDef: {
      flex: 1,
      minWidth: 100,
    },

    rowSelection: "single",
    rowData: [],
    userCreate: null,
    userUpdate: null,
  };

  async componentDidMount() {
    var actionCreate = await RbacList.rbacCheck("User Master", "User Create");
    var actionUpdate = await RbacList.rbacCheck("User Master", "User Update");
    this.state.userCreate = true;
    this.state.userUpdate = true;
    console.log("actionCreate " + actionCreate);
    var qs = require("qs");
    var data = qs.stringify({
      token: localStorage.getItem("accessToken"),
    });
    var config = {
      method: "post",
      url: "/admin/user/all-users/",

      data: data,
    };
    await axios(config, { withCredentials: true }).then((response) => {
      try {
        this.setState({ rowData: response.data.users });
      } catch (e) {
        console.log(e);
      }
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

  onSelectionChanged = (event) => {
    var rowCount = event.api.getSelectedNodes().length;
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
                  {this.state.userCreate ? (
                    <Button.Ripple
                      color="success"
                      onClick={Helpers.handleNewRequest}
                      className="mr-1 mb-1"
                    >
                      <PlusCircle size={14} />

                      <span className="align-middle ml-25">New Request</span>
                    </Button.Ripple>
                  ) : null}
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
                        frameworkComponents={this.state.frameworkComponents}
                        onSelectionChanged={this.onSelectionChanged.bind(this)}
                        context={this.state.context}
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
function createRowData() {
  var rowData = [];
  for (var i = 0; i < 15; i++) {
    rowData.push({
      row: "Row " + i,
      value: i,
      currency: i + Number(Math.random().toFixed(2)),
    });
  }
  return rowData;
}

export default RoleSearch;
