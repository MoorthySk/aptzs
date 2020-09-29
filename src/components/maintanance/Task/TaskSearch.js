import React from "react";
import { history } from "../../../history";
import { Card, CardBody, Input, Row, Col, Button } from "reactstrap";
import axios from "axios";
import { ContextLayout } from "../../../utility/context/Layout";
import { AgGridReact } from "ag-grid-react";
import "../../../assets/scss/plugins/tables/_agGridStyleOverride.scss";
import { Trash2, PlusCircle } from "react-feather";
import moment from "moment";
import { getTask } from "../../../redux/actions/maintanance/task/index";
import { connect } from "react-redux";
import { Edit, ViewCarousel } from "@material-ui/icons";

class TaskSearch extends React.Component {
  static getDerivedStateFromProps(props, state) {
    if (props.taskRedux.task !== props.taskRedux.task) {
      return {
        taskData: props.taskRedux.task.getTask,
      };
    }
    // Return null if the state hasn't changed
    return null;
  }
  state = {
    taskData: [],

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
        headerName: "Actions",
        field: "taskHdrId",
        width: 150,
        cellRendererFramework: (params) => {
          return (
            <div className="actions cursor-pointer">
              <Edit
                color="primary"
                onClick={() => history.push("/taskUpdate/" + params.value)}
              />
              <ViewCarousel
                color="primary"
                onClick={() => history.push("/taskSummary/" + params.value)}
              />
            </div>
          );
        },
      },
      {
        headerName: "Category",
        field: "taskCategory",
        filter: true,
        width: 200,
      },

      {
        headerName: "Priority",
        field: "priority",
        filter: true,
        width: 150,
        cellRendererFramework: (params) => {
          return params.value == 1 ? (
            <div className="badge badge-pill badge-light-success">{"Low"}</div>
          ) : params.value == 2 ? (
            <div className="badge badge-pill badge-light-warning">
              {"Medium"}
            </div>
          ) : params.value == 3 ? (
            <div className="badge badge-pill badge-light-danger">{"High"}</div>
          ) : null;
        },
      },
      {
        headerName: "Status",
        field: "taskStatus",
        filter: true,
        width: 200,
      },
      {
        headerName: "Contact Name",
        field: "contactName",
        filter: true,
        width: 250,
      },
      {
        headerName: "Email",
        field: "contactEmail",
        filter: true,
        width: 250,
      },
      {
        headerName: "Phone Number",
        field: "contactMobile",
        filter: true,
        width: 200,
      },

      {
        headerName: "Created Date",
        field: "created_date",
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
  };
  handleNewRequest = () => {
    this.props.history.push("/taskCreate");
  };
  async componentDidMount() {
    await this.props
      .getTask()
      .then(() => {
        this.setState({
          rowData: this.props.taskRedux.taskData,
        });
        console.log("rowData " + this.state.rowData.length);
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

  onRowSelected = (event) => {
    try {
      var rowId = event.node.data.maintId;

      history.push({
        pathname: "/maintUpdate/" + rowId,
      });
    } catch (e) {
      console.log(e);
    }
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

const mapStateToProps = (state) => {
  return {
    taskRedux: state.task,
  };
};
export default connect(mapStateToProps, {
  getTask,
})(TaskSearch);
