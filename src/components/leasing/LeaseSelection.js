import React from "react";
import { history } from "../../history";
import "../../assets/scss/plugins/tables/_agGridStyleOverride.scss";
import { AgGridReact } from "ag-grid-react";
import {
  Card,
  CardBody,
  Input,
  Row,
  Col,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  TabContent,
  TabPane,
} from "reactstrap";
import axios from "axios";
import { ContextLayout } from "../../utility/context/Layout";

import { PlusCircle } from "react-feather";

import { AddCircleOutline } from "@material-ui/icons";

class LeaseSelection extends React.Component {
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
        headerName: "Applicant ID",
        field: "tenantId",
        width: 50,
        filter: true,
      },
      {
        headerName: "Tenant Name",
        field: "tenantName",
        filter: true,
        width: 250,
      },
      {
        headerName: "Email",
        field: "tenantEmail",
        filter: true,
        width: 250,
      },

      {
        headerName: "Phone Number",
        field: "tenantMobile",
        filter: true,
        width: 200,
      },
      {
        headerName: "Status",
        field: "applicantStatus",
        filter: true,
        width: 200,
        cellRendererFramework: (params) => {
          return params.value === "Approved" ? (
            <div className="badge badge-pill badge-light-success">
              {"Approved"}
            </div>
          ) : params.value === "Review Pending" ? (
            <div className="badge badge-pill badge-light-info">
              {"Review Pending"}
            </div>
          ) : params.value === "New" ? (
            <div className="badge badge-pill badge-light-primary">{"New"}</div>
          ) : params.value === "Deleted" ? (
            <div className="badge badge-pill badge-light-warning">
              {"Deleted"}
            </div>
          ) : params.value === "Rejected" ? (
            <div className="badge badge-pill badge-light-danger">
              {"Rejected"}
            </div>
          ) : null;
        },
      },

      {
        headerName: "Actions",
        field: "tenantId",
        width: 150,
        cellRendererFramework: (params) => {
          return (
            <div className="actions cursor-pointer">
              <AddCircleOutline
                style={{ fontSize: 25 }}
                color="primary"
                onClick={() => history.push("/leaseCreate/" + params.value)}
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

  handleNewRequest = () => {
    this.props.history.push("/applicantCreate");
  };
  async componentDidMount() {
    var token = localStorage.getItem("accessToken");

    await axios({
      method: "POST",
      url: "/lease/renewal/lease-selection/",
    })
      .then((response) => {
        console.log("Response:::::::::::::" + response.data.appInfo);
        try {
          let rowData = response.data.leaseSelection;
          this.setState({ rowData });
        } catch (e) {
          console.log(e);
        }
      })
      .catch((error) => {
        console.log("Concurrent Login Issue:::" + error);
        this.componentDidMount();
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
    const { rowData, columnDefs, defaultColDef, pageSize, params } = this.state;
    const renderModal = ModalConfig.map((item) => {
      return (
        <React.Fragment key={item.id}>
          <Modal
            isOpen={this.state.modal === item.id}
            toggle={() => this.toggleModal(item.id)}
            className={`modal-dialog-centered ${item.modalClass}`}
            key={item.id}
          >
            <ModalHeader
              toggle={() => this.toggleModal(item.id)}
              className={item.bgColor}
            >
              {item.modalTitle}
              {item.title}
            </ModalHeader>
            <ModalBody>
              <Row>
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
                              onChange={(e) =>
                                this.updateSearchQuery(e.target.value)
                              }
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
            </ModalBody>
          </Modal>
        </React.Fragment>
      );
    });
    return (
      <Row>
        <Col md="12" sm="12">
          <Button.Ripple
            color="success"
            onClick={() => this.toggleModal(5)}
            className="mr-1 mb-1"
          >
            <PlusCircle size={14} />

            <span className="align-middle ml-25">New Lease</span>
          </Button.Ripple>
        </Col>
        <Col md="12" sm="12">
          <TabContent activeTab={this.state.activeTab}>
            <TabPane tabId="1">{renderModal}</TabPane>
          </TabContent>
        </Col>{" "}
      </Row>
    );
  }
  toggleModal = (id) => {
    if (this.state.modal !== id) {
      this.setState({
        modal: id,
      });
    } else {
      this.setState({
        modal: null,
      });
    }
  };
}
const ModalConfig = [
  {
    id: 5,

    modalTitle: "Create Lease",
    modalClass: "modal-xl",
    bgColor: "bg-primary",
  },
];
export default LeaseSelection;
