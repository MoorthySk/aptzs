import React from "react";
import { Card, CardBody, Row, Col, Button, Input } from "reactstrap";
import { Payment, Edit, AddOutlined } from "@material-ui/icons";

import axios from "axios";
import { ContextLayout } from "../../../utility/context/Layout";
import { AgGridReact } from "ag-grid-react";
import { history } from "../../../history";
import "../../../assets/scss/plugins/tables/_agGridStyleOverride.scss";
import "../../../assets/scss/pages/users.scss";

class CarPortSearch extends React.Component {
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
        headerName: "Property Name",
        field: "propertyName&&cpHdrId",
        width: 250,
        filter: true,
        cellRendererFramework: (params) => {
          return (
            <div
              className="actions cursor-pointer"
              onClick={() =>
                history.push("/carPortUpdate/" + params.data.cpHdrId)
              }
            >
              <div className="d-inline-block mr-1 mb-1 text-primary mb-50">
                {params.data.propertyName}
              </div>
            </div>
          );
        },
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
          return params.value == 1 ? (
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
    ],
  };

  async componentDidMount() {
    let rowData = null;
    await axios({
      method: "POST",
      url: "/rentals/carport/search-all-details/",
    })
      .then((response) => {
        let dtlData = response.data.carportDtl;

        this.setState({ rowData: dtlData });
      })
      .catch((error) => {
        console.log("error " + error);
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
  handleNewRequest = () => {
    this.props.history.push("/carPortCreate");
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
                    onClick={this.handleNewRequest}
                    className="mr-1 mb-1"
                  >
                    <AddOutlined size={14} />

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

export default CarPortSearch;
