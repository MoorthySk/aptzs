import React from "react";
import { history } from "../../history";
import "../../assets/scss/plugins/tables/_agGridStyleOverride.scss";
import "../../assets/scss/pages/users.scss";
import { Card, CardBody, Input, Row, Col, Button } from "reactstrap";
import axios from "axios";
import { ContextLayout } from "../../utility/context/Layout";
import { AgGridReact } from "ag-grid-react";
import { PlusCircle } from "react-feather";

import { Edit, ViewAgendaOutlined } from "@material-ui/icons";

class PropertySearch extends React.Component {
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
        headerName: "Actions",
        field: "propertyId",
        width: 150,
        cellRendererFramework: (params) => {
          return (
            <div className="actions cursor-pointer">
              <Edit
                color="primary"
                className="mr-50"
                style={{ fontSize: 25 }}
                onClick={() => history.push("/propertyUpdate/" + params.value)}
              />
              <ViewAgendaOutlined
                color="primary"
                className="mr-50"
                style={{ fontSize: 25 }}
                onClick={() => history.push("/propertySummary/" + params.value)}
              />
            </div>
          );
        },
      },
      {
        headerName: "Property Name",
        field: "proptyName",
        width: 250,
        filter: true,
      },
      {
        headerName: "Property City",
        field: "proptyCity",
        filter: true,
        width: 250,
      },
      {
        headerName: "Property State",
        field: "proptyState",
        filter: true,
        width: 250,
      },

      {
        headerName: "No Of Units",
        field: "noOfUnits",
        filter: true,
        width: 200,
      },
      {
        headerName: "Occupied Count",
        field: "noOfUnits",
        filter: true,
        width: 200,
      },
      {
        headerName: "Owner",
        field: "ownerName",
        filter: true,
        width: 200,
      },
      {
        headerName: "Manager",
        field: "manager",
        filter: true,
        width: 200,
        tooltipValueGetter: function (params) {
          return { value: params.value };
        },
      },
    ],
    defaultColDef: {
      sortable: true,
    },
    rowSelection: "single",
    rowData: [],
  };

  handleNewRequest = () => {
    this.props.history.push("/propertyCreate");
  };

  async componentDidMount() {
    var responseCode = "";

    await axios({
      method: "POST",
      url: "/rentals/property/search-details/",
    })
      .then((response) => {
        responseCode = response.data.responseCode;

        console.log("Response:::::::::::::" + responseCode);
        if (responseCode === "1004") {
          this.props.history.push("/sessionExpired");
        } else {
          try {
            let rowData = null;
            let propDtl = response.data.propDtls;
            let ownerDtl = response.data.propOwnerDtls;
            if (responseCode === "1004") {
              this.props.history.push("/sessionExpired");
            } else {
              this.setState({
                rowData: propDtl,
              });
            }
          } catch (e) {
            console.log(e);
          }
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
                        tooltipShowDelay={this.state.tooltipShowDelay}
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

export default PropertySearch;
