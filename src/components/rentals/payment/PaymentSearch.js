import React from "react";
import { Card, CardBody, Input, Row, Col, Button } from "reactstrap";
import axios from "axios";
import { ContextLayout } from "../../../utility/context/Layout";
import { AgGridReact } from "ag-grid-react";
import { PlusCircle } from "react-feather";
import * as appConst from "../../../utility/Constants";
import moment from "moment";
import {
  EditSharp,
  DeleteForever,
  VisibilityOutlined,
} from "@material-ui/icons";
import { history } from "../../../history";
import "../../../assets/scss/plugins/tables/_agGridStyleOverride.scss";
import "../../../assets/scss/pages/users.scss";
import Helpers from "../Helpers";
import LovList from "../../../components/common/Helpers";
import RbacList from "../../../configs/RbacList";
import DeleteMessageRender from "../summary/DeleteComp";
var _ = require("lodash");
class PaymentSearch extends React.Component {
  state = {
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
    columnDefs: [
      {
        headerName: "Payment Method",
        field: "paymentMethod",
        width: 10,
        filter: true,
        cellRendererFramework: (params) => {
          let paymentMethod = _.filter(paymentMethodList, {
            value: params.value,
          }).map((v) => v.label);
          return <div>{paymentMethod}</div>;
        },
      },

      {
        headerName: "Created Date",
        field: "createdDate",
        filter: true,
        width: 250,
        cellRenderer: (params) => {
          return moment(params).format("YYYY-MM-DD");
        },
      },
      {
        headerName: "Reference Number",
        field: "referenceNumber",
        filter: true,
        width: 250,
      },
      {
        headerName: "Amount",
        field: "amount",
        filter: true,
        width: 250,
      },
      {
        headerName: "Received From",
        field: "receivedFrom",
        filter: true,
        width: 250,
        cellRendererFramework: (params) => {
          let name = _.filter(userList, { value: params.value }).map(
            (v) => v.label
          );
          return <div>{name}</div>;
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
    rowData: [],
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
    var paymentTypeParentId = appConst.paymentTypeParentId;
    var paymentMethodParentId = appConst.paymentMethodParentId;
    paymentType = await LovList.lovList(paymentTypeParentId);
    paymentMethodList = await LovList.lovList(paymentMethodParentId);

    var userData = "";
    await axios.post("/admin/user/all-users/").then((response) => {
      userData = response.data.users;
    });

    console.log(userData);
    userList.splice(0, userList.length);
    userData !== undefined &&
      userData.forEach((rData) => {
        let userOption = {};
        userOption.value = rData.userId;
        userOption.label = rData.firstName + " " + rData.lastName;
        userList.push(userOption);
      });
    console.log(userList);
    this.state.userCreate = true;
    this.state.userUpdate = true;
    var data = "";
    await axios({
      method: "POST",
      url: "/rentals/payment/search-all/",
    }).then((response) => {
      try {
        this.setState({ rowData: response.data.payHdr });
        data = response.data.payHdr;
      } catch (e) {
        console.log(e);
      }
    });
    let marked = data;
    console.log(marked);
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

var paymentType = [];
var userList = [];
var paymentMethodList = [];
export default PaymentSearch;
