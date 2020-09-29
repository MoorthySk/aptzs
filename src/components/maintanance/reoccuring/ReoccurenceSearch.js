import React from "react";
import {
  Card,
  CardBody,
  Row,
  Col,
  Button,
} from "reactstrap";
import {
  Edit,
} from "@material-ui/icons";
import moment from "moment";
import axios from "axios";
import { ContextLayout } from "../../../utility/context/Layout";
import { AgGridReact } from "ag-grid-react";
import { history } from "../../../history";
import "../../../assets/scss/plugins/tables/_agGridStyleOverride.scss";
import { PlusCircle } from "react-feather";
class ReoccurenceSearch extends React.Component {
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
    rowData: [],
    columnDefs: [
      {
        headerName: "Actions",
        field: "reoccuringId",
        width: 150,
        cellRendererFramework: (params) => {
         
          console.log("reoccurenceId:"+params.value);          
          return (
            <div className="actions cursor-pointer">              
              {(
                <Edit
                  color="secondary"
                  className="mr-50"
                  style={{ fontSize: 25 }}
                  onClick={() => history.push("/reoccurenceUpdate/" + params.value)}
                />
              )}             
            </div>
          );
        },
      },
      {
        headerName: "Property Name",
        field: "propertyName",
        width: 200,       
      },
      {
        headerName: "Property Unit Id",
        field: "propertyUnitId",
        width: 250,
        filter: true,   
      },
      {
        headerName: "Request Type",
        field: "requestType",
        filter: true,
        width: 180,
      },      
      {
        headerName: "Category Type",
        field: "categoryType",
        filter: true,
        width: 180,
      },     
      {
        headerName: "Assigned To",
        field: "assignedTo",
        filter: true,
        width: 180,
      },
      {
        headerName: "Priority",
        field: "priority",
        filter: true,
        width: 180,
      },
      {
        headerName: "Repeat",
        field: "repeat",
        filter: true,
        width: 180,
      },      
      {
        headerName: "Record Status",
        field: "recordStatus",
        filter: true,
        width: 180,
      },    
    ],
  };

  handleNewRequest = () => {
    this.props.history.push("/reoccurenceCreate");
  };

  async componentDidMount() {
    await axios({
      method: "POST",
      url: "/maint/reoccuring/info/",
      /*headers: {
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },*/
    })
      .then((response) => {
        console.log("Response:::::::::::::" + response.data.reOccuringTask);
        try {
          let listData = response.data.reOccuringTask;          

          this.setState({ rowData: listData });
         
        } catch (e) {
          console.log(e);
        }
      })
      .catch((error) => {
        console.log("Concurrent Login Issue:::" + error);
        //this.componentDidMount();
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

  render() {
    const { rowData, columnDefs, defaultColDef, pageSize } = this.state;
    return (
      <Row>
        <Col sm="12">
          <Card>
            <CardBody>
              <Button.Ripple
                    color="success"
                    onClick={this.handleNewRequest}
                    className="mr-1 mb-1"
                  >
                    <PlusCircle size={14} />

                    <span className="align-middle ml-25">New Request</span>
              </Button.Ripple>
              <div className="ag-theme-material ag-grid-table">
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

export default ReoccurenceSearch;
