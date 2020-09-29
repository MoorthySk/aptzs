import React from "react";
import "../../../assets/scss/plugins/tables/_agGridStyleOverride.scss";
import "../../../assets/scss/pages/users.scss";
import axios from "axios";
import moment from "moment";
import {
  AddCircle,
  HomeWork,
  ContactMail,
  Cancel,
  AddCircleOutline,
} from "@material-ui/icons";
import SweetAlert from "react-bootstrap-sweetalert";
import Helpers from "../Helpers";
import { Formik, Field, Form, ErrorMessage } from "formik";
import DataTable from "react-data-table-component";
import LovList from "../../../components/common/Helpers";
import Select from "react-select";
import {
  Card,
  CardTitle,
  CardBody,
  Button,
  FormGroup,
  Col,
  Row,
  Table,
  UncontrolledTooltip,
  ModalBody,
  Modal,
  ModalHeader,
  TabContent,
  TabPane,
  Input,
  CardHeader,
} from "reactstrap";
const columns = [
  {
    name: "Appliance Name",
    selector: "applianceName",
    sortable: true,
  },
  {
    name: "Make",
    selector: "make",
    sortable: true,
  },
  {
    name: "Model",
    selector: "model",
    sortable: true,
  },
  {
    name: "Installed On",
    selector: "installedOn",
    sortable: true,
  },
  {
    name: "Installed By",
    selector: "installedBy",
    sortable: true,
  },
  {
    name: "Warrenty Ends",
    selector: "warrenttEndsOn",
    sortable: true,
  },
];
class PropertySearch extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit1 = this.handleSubmit1.bind(this);
  }
  state = {
    users: [
      {
        applianceName: "",
        make: "",
        model: "",
        installedOn: "",
        installedBy: "",
        warrenttEndsOn: "",
        propUnitId: "",
      },
    ],
    activeTab: "1",
    rowData: [],
  };

  async componentDidMount() {
    var unitId = this.props.unitId;
    console.log("unit Id " + unitId);
    await axios
      .post("/rentals/appliance/search/", {
        propUnitId: unitId,
      })
      .then((response) => {
        let listData = response.data.appliancesList;
        let marked = listData;
        let rowDataList = [];
        let nData = {};
        this.state.rowData.splice(0, this.state.rowData.length);
        marked !== undefined &&
          listData.forEach((rData) => {
            nData.applianceName = rData.applianceName;
            nData.make = rData.make;
            nData.model = rData.model;
            nData.installedOn = moment(rData.installedOn).format("MM-DD-YYYY");
            nData.installedBy = rData.installedBy;
            nData.warrenttEndsOn = moment(rData.warrenttEndsOn).format(
              "MM-DD-YYYY"
            );
            rowDataList.push(nData);
            this.setState((prevState) => ({
              rowData: [...prevState.rowData],
            }));
            this.setState({ rowData: rowDataList });
          });

        this.removeAll();
        for (var i = 0; i < listData.length; i++) {
          this.setState((prevState) => ({
            users: [
              ...prevState.users,
              {
                applianceName: listData[i].applianceName,
                make: listData[i].make,
                model: listData[i].model,
                installedOn: moment(listData[i].installedOn).format(
                  "YYYY-MM-DD"
                ),
                installedBy: listData[i].installedBy,
                warrenttEndsOn: moment(listData[i].warrenttEndsOn).format(
                  "YYYY-MM-DD"
                ),
                propUnitId: listData[i].propUnitId,
              },
            ],
          }));
        }
      })
      .catch((error) => {
        console.log("error:::" + error);
      });
    vendorListData = await LovList.vendorList();
  }

  render() {
    const { unitId = "" } = this.state;
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
              <Formik
                enableReinitialize
                initialValues={{
                  unitId: unitId,
                }}
                onSubmit={(values, actions) => {
                  let responseCode = "";
                  var myObject = JSON.stringify(this.state.users);
                  var parseObject = JSON.parse(myObject);
                  console.log(parseObject);

                  setTimeout(() => {
                    let payload = {
                      appliancesList: parseObject,
                      propUnitId: this.props.unitId,
                    };
                    var url = "";
                    if (rowData.length > 0) {
                      url = "/rentals/appliance/update/";
                    } else {
                      url = "/rentals/appliance/create/";
                    }
                    axios({
                      method: "POST",
                      url: url,
                      data: payload,
                    })
                      .then((response) => {
                        console.log("Response:::::::::::::" + response.data);
                        responseCode = response.data.responseCode;
                        console.log(
                          "Response Code:::::::::::::" + responseCode
                        );
                        if (responseCode == 1000) {
                          this.successMessage("successAlert", true);
                        } else {
                          this.errorMessgae("errorAlert", true);
                        }
                      })
                      .catch((error) => {
                        console.log(error);
                        // toast.error("Bad Request, Please verify your inputs!");
                      });
                  }, 1000);
                }}
              >
                {(props) => {
                  const { setFieldValue, errors, touched } = props;
                  return (
                    <Form onSubmit={props.handleSubmit}>
                      <Col>
                        <div>
                          <Row>
                            <Col md="2" sm="12">
                              <label>Appliance Name</label>
                            </Col>
                            <Col md="2" sm="12">
                              <label>Make</label>
                            </Col>
                            <Col md="1" sm="12">
                              <label>Model</label>
                            </Col>
                            <Col md="2" sm="12">
                              <label>Installed On</label>
                            </Col>
                            <Col md="2" sm="12">
                              <label>Installed By</label>
                            </Col>
                            <Col md="2" sm="12">
                              <label>Warrenty Ends On</label>
                            </Col>

                            <Col md="1" sm="12">
                              <label>Delete</label>
                            </Col>
                          </Row>
                        </div>
                        {this.createUI()}
                        <br />
                        <Button.Ripple
                          className="btn-icon rounded-circle"
                          color="primary"
                          onClick={this.addClick.bind(this)}
                        >
                          <AddCircle />
                        </Button.Ripple>
                      </Col>

                      <FormGroup row>
                        <Col md={{ size: 8, offset: 4 }}>
                          <Button.Ripple
                            color="primary"
                            type="submit"
                            className="mr-1 mb-1"
                            onClick={this.handleSubmit}
                          >
                            <AddCircleOutline size={14} />

                            <span className="align-middle ml-25">Update</span>
                          </Button.Ripple>

                          {this.state.alert}
                        </Col>
                      </FormGroup>
                    </Form>
                  );
                }}
              </Formik>
            </ModalBody>
          </Modal>
        </React.Fragment>
      );
    });
    const { rowData } = this.state;
    return (
      <Card>
        <CardBody>
          <Row>
            <Col md="11" sm="12">
              <h6 className="primary">Appliance </h6>
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
                Add Appliance
              </UncontrolledTooltip>
            </Col>
          </Row>

          <DataTable data={rowData} columns={columns} noHeader />
        </CardBody>
        <Col md="12" sm="12">
          <TabContent activeTab={this.state.activeTab}>
            <TabPane tabId="1">{renderModal}</TabPane>
          </TabContent>
        </Col>
      </Card>
    );
  }
  successMessage(state, value) {
    const getAlert = () => (
      <SweetAlert
        success
        confirmBtnText="Ok!"
        title="Success"
        tim
        show={this.state.successAlert}
        onConfirm={() => Helpers.hideAlert()}
      >
        <p className="sweet-alert-text">Request Sussessfully Updated</p>
      </SweetAlert>
    );
    this.setState({
      alert: getAlert(),
    });
  }
  hideAlert() {
    this.setState({
      alert: null,
      modal: null,
    });
    this.componentDidMount();
  }
  errorMessgae(state, value) {
    const getAlert = () => (
      <SweetAlert
        error
        confirmBtnText="Ok!"
        title="Error"
        show={this.state.errorAlert}
        onConfirm={() => this.hideAlert()}
      >
        <p className="sweet-alert-text">Request Updated Failed</p>
      </SweetAlert>
    );
    this.setState({
      alert: getAlert(),
    });
  }

  hideAlert() {
    this.setState({
      alert: null,
    });
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
  handleRowChange(i, e) {
    const { name, value } = e.target;
    let users = [...this.state.users];
    users[i] = { ...users[i], [name]: value };
    this.setState({ users });
  }

  removeClick(i) {
    let users = [...this.state.users];
    users.splice(i, 1);
    this.setState({ users });
  }
  removeAll() {
    let users = [...this.state.users];
    users.splice(0, users.length);
    this.setState({ users });
  }
  handleSubmit1(event) {
    alert("Values: " + this.state.values.join(", "));
    event.preventDefault();
  }
  handleSelectChange(i, e) {
    let users = [...this.state.users];
    users[i] = { ...users[i], ["installedBy"]: e.value };
    this.setState({ users });
  }
  addClick() {
    this.setState((prevState) => ({
      users: [
        ...prevState.users,
        {
          applianceName: "",
          make: "",
          model: "",
          installedOn: "",
          installedBy: "",
          warrenttEndsOn: "",
          propUnitId: "",
        },
      ],
    }));
  }
  createUI() {
    const { setFieldValue, errors, touched } = this.state;
    return this.state.users.map((el, i) => (
      <div key={i}>
        <Row>
          <Col md="2" sm="12">
            <Input
              name="applianceName"
              value={el.applianceName || ""}
              onChange={this.handleRowChange.bind(this, i)}
              type="text"
              required
            />
          </Col>

          <Col md="2" sm="12">
            <Input
              name="make"
              value={el.make || ""}
              onChange={this.handleRowChange.bind(this, i)}
              type="text"
              required
            />
          </Col>
          <Col md="1" sm="12">
            <Input
              name="model"
              value={el.model || ""}
              onChange={this.handleRowChange.bind(this, i)}
              type="text"
              required
            />
          </Col>
          <Col md="2" sm="12">
            <Input
              name="installedOn"
              value={el.installedOn || ""}
              onChange={this.handleRowChange.bind(this, i)}
              type="date"
              required
            />
          </Col>

          <Col md="2" sm="12">
            value {el.installedBy}
            <Select
              type="select"
              name="installedBy"
              value={vendorListData.find(
                (obj) => obj.value === el.installedBy || ""
              )}
              options={vendorListData}
              onChange={this.handleSelectChange.bind(this, i)}
            />
          </Col>

          <Col md="2" sm="12">
            <Input
              name="warrenttEndsOn"
              value={el.warrenttEndsOn || ""}
              onChange={this.handleRowChange.bind(this, i)}
              type="date"
            />
          </Col>

          <Col md="1" sm="12">
            <div className="actions cursor-pointer">
              <Button.Ripple
                className="btn-icon rounded-circle"
                color="danger"
                onClick={this.removeClick.bind(this, i)}
              >
                <Cancel fontSize="large" />
              </Button.Ripple>
            </div>
          </Col>
        </Row>
      </div>
    ));
  }
}
var vendorListData = [];
const ModalConfig = [
  {
    id: 5,
    btnTitle: "Update Details",
    modalTitle: "Appliance Details",
    modalClass: "modal-xl",
    bgColor: "bg-primary",
  },
];

export default PropertySearch;
