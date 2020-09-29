import React, { Component } from "react";
import {
  Button,
  Form,
  FormGroup,
  Input,
  Row,
  Col,
  Card,
  CardTitle,
  CardBody,
  TabContent,
  TabPane,
  Modal,
  ModalHeader,
  ModalBody,
  UncontrolledTooltip,
  Table,
  ListGroup,
  ListGroupItem,
} from "reactstrap";
import axios from "axios";
import { green, orange } from "@material-ui/core/colors";
import { HomeWork, Contacts, AddCircle } from "@material-ui/icons";
import { ContextLayout } from "../../../utility/context/Layout";
import "../../../assets/scss/plugins/tables/_agGridStyleOverride.scss";
import { AgGridReact } from "ag-grid-react";
class Child extends Component {
  constructor(props) {
    super(props);
    // ...
  }
  state = {
    selectedOption: [],
    unitid: null,
    propUnitName: null,
    propUnitNumber: null,
    propNoOfBedRooms: null,
    propNoOfBathRooms: null,
    propSquareFeet: null,
    propRentAmount: null,
    unitDetails: null,
    proptyUnitId: null,
    visible: true,
    values: [],
    successAlert: true,
    activeTab: "1",
    tooltipOpen: false,
    modal: null,
    modalParking: null,
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
    leaseStatus: "",
    tenantChip: "",
    columnDefs: [
      {
        headerName: "Unit Id",
        field: "proptyUnitId",
        width: 50,
        filter: true,
      },
      {
        headerName: "Unit Name",
        field: "propUnitName",
        width: 50,
        filter: true,
      },
      {
        headerName: "Unit Number",
        field: "propUnitNumber",
        filter: true,
        width: 250,
      },

      {
        headerName: "Status",
        field: "recordStatus",
        filter: true,
        width: 200,
      },
      {
        headerName: "Select",
        field: "proptyUnitId&propUnitName&propUnitNumber",
        width: 150,
        cellRendererFramework: (params) => {
          var proptyUnitId = params.data.proptyUnitId;
          var propUnitName = params.data.propUnitName;
          var propUnitNumber = params.data.propUnitNumber;

          return (
            <div className="actions cursor-pointer">
              <Button
                color="primary"
                className="mr-50"
                onClick={() => {
                  this.apptData(proptyUnitId, propUnitName, propUnitNumber);
                }}
              >
                Select
              </Button>
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
    leaseTypeList: [],
  };
  async componentDidMount() {
    //var appReqstId = this.props.match.params.appReqId;
    this._isMounted = true;
    await axios({
      method: "POST",
      url: "/rentals/property/search-all/",
    })
      .then((response) => {
        try {
          let rowData = response.data.propUnitDtls;

          this.setState({ rowData: rowData });

          var indexVal = rowData.findIndex(
            (obj) => obj.proptyUnitId == this.props.propertyUnitId
          );

          for (var i = 0; i < rowData.length; i++) {
            this.setState({
              propUnitName: rowData[indexVal]["propUnitName"],
              propUnitNumber: rowData[indexVal]["propUnitNumber"],
              propUnitNumber: rowData[indexVal]["propUnitNumber"],
            });
          }
        } catch (e) {
          console.log(e);
        }
      })
      .catch((error) => {
        console.log("error:::" + error);
      });
    //this.apptData(applicantInfo.proptyUnitId);
  }
  render() {
    const {
      value,
      proptyUnitId,
      columnDefs,
      defaultColDef,
      pageSize,
      propUnitName,
      propUnitNumber,
      rowData,
    } = this.state;

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
                                onSelectionChanged={this.onSelectionChanged.bind(
                                  this
                                )}
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
      <Card>
        <CardBody>
          <div></div>
          <Row>
            <Col md="11" sm="12">
              <CardTitle>Property Details</CardTitle>
            </Col>
            <Col md="1" sm="12">
              <Button.Ripple
                className="btn-icon rounded-circle"
                color="primary"
                onClick={() => this.toggleModal(5)}
                id="addapp"
              >
                <AddCircle />
              </Button.Ripple>
              <UncontrolledTooltip placement="top" target="addapp">
                Select Unit
              </UncontrolledTooltip>
            </Col>
            <Col md="12" sm="12">
              <TabContent activeTab={this.state.activeTab}>
                <TabPane tabId="1">{renderModal}</TabPane>
              </TabContent>
            </Col>
            <Table responsive bordered>
              <thead>
                <tr>
                  <th
                    style={{
                      width: 300,
                    }}
                  >
                    Property Name
                  </th>
                  <th
                    style={{
                      width: 300,
                    }}
                  >
                    Unit Name
                  </th>
                  <th
                    style={{
                      width: 300,
                    }}
                  >
                    Unit Number
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <HomeWork style={{ color: green[500] }} /> {propUnitName}
                  </td>
                  <td>
                    {" "}
                    <Contacts style={{ color: green[500] }} /> {propUnitNumber}
                  </td>
                  <td>
                    <HomeWork style={{ color: green[500] }} /> {propUnitNumber}
                  </td>
                </tr>
              </tbody>
            </Table>
          </Row>
        </CardBody>
      </Card>
    );
  }
  onSelectionChanged = (event) => {
    var rowCount = event.api.getSelectedNodes().length;
  };

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
  apptData = (proptyUnitId, propUnitName, propUnitNumber) => {
    this.props.passRefUpward(proptyUnitId);

    this.setState((prevState) => ({
      proptyUnitId: proptyUnitId,
      propUnitName: propUnitName,
      propUnitNumber: propUnitNumber,

      modal: !prevState.modal,
    }));
  };
}

const ModalConfig = [
  {
    id: 5,
    btnTitle: "Select Unit",
    modalTitle: "Employee Details",
    modalClass: "modal-xl",
    bgColor: "bg-primary",
  },
];
export default Child;
