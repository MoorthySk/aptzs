import React from "react";
import {
  Card,
  CardBody,
  Row,
  Col,
  Button,
  UncontrolledTooltip,
  Input,
} from "reactstrap";
import {
  EmojiPeople,
  HomeWork,
  DateRange,
  AttachMoney,
  Payment,
  ChromeReaderMode,
  AddCircleRounded,
  EditLocationOutlined,
} from "@material-ui/icons";
import Helpers from "./Helpers";

import axios from "axios";
import { ContextLayout } from "../../utility/context/Layout";
import { AgGridReact } from "ag-grid-react";
import { history } from "../../history";
import "../../assets/scss/plugins/tables/_agGridStyleOverride.scss";
import "../../assets/scss/pages/users.scss";

class WorkOrder extends React.Component {
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
        headerName: "Vendor Name",
        field: "vendorName",
        width: 250,
        filter: true,
      },

      {
        headerName: "Invoice Number",
        field: "invoiceNumber",
        filter: true,
        width: 250,
      },
      {
        headerName: "Entry Contact",
        field: "entryContact",
        filter: true,
        width: 250,
      },
      {
        headerName: "Entry Allowed",
        field: "entryAllowed",
        filter: true,
        width: 250,
      },

      {
        headerName: "Actions",
        field: "appReqId",
        width: 150,
        cellRendererFramework: (params) => {
          return (
            <div className="actions cursor-pointer">
              <div className="d-inline-block mr-1 mb-1">
                {" "}
                <EditLocationOutlined
                  className="btn-icon rounded-circle"
                  color="primary"
                  onClick={() => history.push("/rentUpdate/" + params.value)}
                />
              </div>
            </div>
          );
        },
      },
    ],
  };

  async componentDidMount() {
    await axios({
      method: "POST",
      url: "/maint/workorder/search-all/",
    }).then((response) => {
      console.log("Response:::::::::::::" + response.data.responseCode);
      try {
        let rowData = response.data.wOrder;
        this.setState({ rowData });
      } catch (e) {
        console.log(e);
      }
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

  refreshCard = () => {
    this.setState({ reload: true });
    setTimeout(() => {
      this.setState({
        reload: false,
        role: "All",
        selectStatus: "All",
        verified: "All",
        department: "All",
      });
    }, 500);
  };

  render() {
    const { rowData, columnDefs, defaultColDef, pageSize } = this.state;
    return (
      <Row>
        <Col sm="12">
          <Card>
            <CardBody>
              <div className="ag-theme-material ag-grid-table">
                <div className="ag-grid-actions d-flex justify-content-between flex-wrap mb-1">
                  <Button.Ripple
                    color="success"
                    onClick={Helpers.handleNewRequest}
                    className="mr-1 mb-1"
                  >
                    <AddCircleRounded size={14} />

                    <span className="align-middle ml-25">New Request</span>
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

export default WorkOrder;
