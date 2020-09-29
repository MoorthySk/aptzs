import React from "react";
import { Card, CardBody, Row, Col, Button } from "reactstrap";
import { Edit, ContactMail } from "@material-ui/icons";
import moment from "moment";
import axios from "axios";
import { ContextLayout } from "../../../utility/context/Layout";
import { AgGridReact } from "ag-grid-react";
import { history } from "../../../history";
import "../../../assets/scss/plugins/tables/_agGridStyleOverride.scss";
import { PlusCircle } from "react-feather";
const data = [
  {
    id: 1002,
    name: "Jhon",
    emailId: "jhon@gmail.com",
    contactNumber: "9840642421",
    createdDate: "Oct-09-2020",
    status: "Inprogress",
    response: "Received",
  },
];
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
        field: "id",
        width: 150,
        cellRendererFramework: (params) => {
          console.log("reoccurenceId:" + params.value);
          return (
            <div className="actions cursor-pointer">
              <Edit
                color="primary"
                className="mr-50"
                style={{ fontSize: 25 }}
                onClick={() =>
                  history.push("/preApplicantUpdate/" + params.value)
                }
              />

              <ContactMail
                color="secondary"
                className="mr-50"
                style={{ fontSize: 25 }}
                onClick={() => history.push("/imail/" + params.value)}
              />
            </div>
          );
        },
      },
      {
        headerName: "Name",
        field: "name",
        width: 200,
      },
      {
        headerName: "Email Id",
        field: "emailId",
        width: 250,
        filter: true,
      },
      {
        headerName: "Mobile No",
        field: "contactNumber",
        filter: true,
        width: 180,
      },

      {
        headerName: "Created Date",
        field: "createdDate",
        filter: true,
        width: 180,
      },
      {
        headerName: "Status",
        field: "status",
        filter: true,
        width: 180,
        cellRendererFramework: (params) => {
          return params.value === "Inprogress" ? (
            <div className="badge badge-pill badge-light-primary">
              {"Inprogress"}
            </div>
          ) : params.value === "Hold" ? (
            <div className="badge badge-pill badge-light-warning">{"Hold"}</div>
          ) : params.value === "Expired" ? (
            <div className="badge badge-pill badge-light-danger">
              {"Expired"}
            </div>
          ) : null;
        },
      },
      {
        headerName: "Response",
        field: "response",
        filter: true,
        width: 180,
        cellRendererFramework: (params) => {
          return params.value === "Received" ? (
            <div className="badge badge-pill badge-light-warning">
              {"Received"}
            </div>
          ) : params.value === "Sent" ? (
            <div className="badge badge-pill badge-light-danger">{"Sent"}</div>
          ) : params.value === "Expired" ? (
            <div className="badge badge-pill badge-light-danger">
              {"Expired"}
            </div>
          ) : null;
        },
      },
    ],
  };

  handleNewRequest = () => {
    this.props.history.push("/preApplicantCreate");
  };

  async componentDidMount() {
    await axios({
      method: "POST",
      url: "/maint/reoccuring/info/",
    })
      .then((response) => {
        try {
          let listData = data;

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
