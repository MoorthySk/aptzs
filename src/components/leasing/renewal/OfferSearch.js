import React from "react";
import { history } from "../../../history";
import "../../../assets/scss/plugins/tables/_agGridStyleOverride.scss";
import { AgGridReact } from "ag-grid-react";
import { Card, CardBody, Input, Row, Col } from "reactstrap";
import axios from "axios";
import { ContextLayout } from "../../../utility/context/Layout";
import { LocalOffer, HomeWork, Autorenew } from "@material-ui/icons";
import OfferActions from "./OfferUpdate.js";
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
        headerName: "Offer",
        field: "tenantId",
        width: 100,
        autoHeight: true,
        cellRenderer: "OfferActions",
      },
      {
        headerName: "Renewal",
        col: "tenantId&leaseOfferId",
        width: 120,
        autoHeight: true,
        cellRendererFramework: (params) => {
          var teanatId = params.data.tenantId;
          var offerId = params.data.leaseOfferId;
          return (
            <div className="actions cursor-pointer">
              <Autorenew
                color="secondary"
                onClick={() => history.push("/renewalCreate/" + offerId)}
              />{" "}
            </div>
          );
        },
      },
      {
        headerName: "Property Name",
        field: "propertyName",
        width: 250,
        filter: true,
        tooltipField: "propertyName",
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
        headerName: "Unit No",
        colId: "unitName&unitNo",
        filter: true,
        width: 250,
        cellRendererFramework: (params) => {
          return params.data.unitName + " / " + params.data.unitNo;
        },
      },
      {
        headerName: "Days Left",
        field: "daysLeft",
        width: 180,
        filter: true,
      },

      {
        headerName: "Tenant Name",
        field: "tenantName",
        filter: true,
        width: 250,
      },
      {
        headerName: "Status",
        field: "offerStatus",
        filter: true,
        width: 250,
      },
      {
        headerName: "Comments",
        field: "comments",
        filter: true,
        width: 250,
      },
    ],
    context: { componentParent: this },
    frameworkComponents: {
      OfferActions: OfferActions,
    },
  };
  methodFromParent = (cell) => {
    console.log("inside" + cell);
    if (cell == 1) {
      axios({
        method: "POST",
        url: "/renewal/offers/search/",
      })
        .then((response) => {
          this.setState({ rowData: response.data.offerList });
        })
        .catch((error) => {
          console.log("Concurrent Login Issue:::" + error);
        });
    }
  };
  async componentDidMount() {
    await axios({
      method: "POST",
      url: "/renewal/offers/search/",
    })
      .then((response) => {
        this.setState({ rowData: response.data.offerList });
      })
      .catch((error) => {
        console.log("Concurrent Login Issue:::" + error);
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
