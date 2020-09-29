import React from "react";
import { Card, CardBody, Input, Row, Col, Button } from "reactstrap";
import axios from "axios";
import { ContextLayout } from "../../utility/context/Layout";
import { AgGridReact } from "ag-grid-react";
import { PlusCircle } from "react-feather";
import { EditSharp, DeleteForever } from "@material-ui/icons";
import { history } from "../../history";
import "../../assets/scss/plugins/tables/_agGridStyleOverride.scss";
import "../../assets/scss/pages/users.scss";
class VendorSearch extends React.Component {
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
        headerName: "Vendor ID",
        field: "vendorId",
        width: 50,
        filter: true,
      },
      {
        headerName: "Vendor Name",
        field: "vendorName",
        filter: true,
        width: 250,
      },
      {
        headerName: "Email",
        field: "vendorEmail",
        filter: true,
        width: 250,
      },

      {
        headerName: "Phone Number",
        field: "vendorMobileNo",
        filter: true,
        width: 200,
      },

      {
        headerName: "Status",
        field: "vendorType",
        filter: true,
        width: 150,
        cellRendererFramework: (params) => {
          return params.value === "Company" ? (
            <div className="badge badge-pill badge-light-success">
              {"Company"}
            </div>
          ) : params.value === "Indidual" ? (
            <div className="badge badge-pill badge-light-danger">
              {"Indidual"}
            </div>
          ) : null;
        },
      },
      {
        headerName: "Actions",
        field: "vendorId",
        width: 150,
        cellRendererFramework: (params) => {
          return (
            <div className="actions cursor-pointer">
              <EditSharp
                color="primary"
                className="mr-50"
                style={{ fontSize: 25 }}
                onClick={() => history.push("/vendorUpdate/" + params.value)}
              />
              <DeleteForever
                style={{ fontSize: 25 }}
                color="error"
                onClick={() => {
                  let selectedData = "";
                  //  this.gridApi.updateRowData({ remove: selectedData });
                }}
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

  handleUpdate = () => {
    this.props.history.push("/vendorCreate");
  };

  handleNewRequest = () => {
    this.props.history.push("/vendorCreate");
  };

  async componentDidMount() {
    await axios({
      method: "POST",
      url: "/maint/vendor/search-byall/",
    }).then((response) => {
      console.log("Response:::::::::::::" + response.data);
      try {
        let rowData = response.data.vendorSearchDtl;
        console.log("rowData:::::::::::::" + response.data.responseMsg);
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
                  <Button.Ripple
                    color="success"
                    onClick={this.handleNewRequest}
                    className="mr-1 mb-1"
                  >
                    <PlusCircle size={14} />

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
                        // onRowSelected={this.onRowSelected.bind(this)}
                        onSelectionChanged={this.onSelectionChanged.bind(this)}
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

export default VendorSearch;
