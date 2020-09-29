import React from "react";
import "../../../assets/scss/plugins/tables/_agGridStyleOverride.scss";
import "../../../assets/scss/pages/users.scss";
import axios from "axios";
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
import * as appConst from "../../../utility/Constants";
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
    name: "Features",
    selector: "feature",
    sortable: true,
  },
  {
    name: "Description",
    selector: "description",
    sortable: true,
  },
];
class Features extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit1 = this.handleSubmit1.bind(this);
  }
  state = {
    featureData: [
      {
        featureList: "",
        description: "",
      },
    ],
    activeTab: "1",
    rowData: [],
    propertyId: null,
    unitId: null,
    menuFlag: null,
  };

  async componentDidMount() {
    var lovParentId = appConst.unitFeaturesParent;
    var referenceId = "";

    featuresListData = await LovList.lovList(lovParentId);
    this.state.unitId = this.props.unitId;
    this.state.propertyId = this.props.propertyId;
    this.state.menuFlag = this.props.menuFlag;
    console.log("features " + this.state.propertyId);
    if (this.state.menuFlag == 1) {
      lovParentId = appConst.leaseType;
      referenceId = this.state.propertyId;
    } else {
      lovParentId = appConst.unitFeaturesParent;
      referenceId = this.state.unitId;
    }

    await axios
      .post("/rentals/property/feature/search-byref/", {
        refNumber: referenceId,
      })
      .then((response) => {
        let rowData = response.data.features;
        this.setState({
          rowData,
        });

        this.removeAll();
        for (var i = 0; i < rowData.length; i++) {
          this.setState((prevState) => ({
            featureData: [
              ...prevState.featureData,
              {
                featureList: rowData[i].featureList,
                description: rowData[i].description,
              },
            ],
          }));
        }
      })
      .catch((error) => {
        console.log("error:::" + error);
      });
  }

  render() {
    const { unitId = "", propertyId = "" } = this.state;
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
                  propertyId: propertyId,
                }}
                onSubmit={(values, actions) => {
                  let responseCode = "";
                  var myObject = JSON.stringify(this.state.featureData);
                  var parseObject = JSON.parse(myObject);
                  console.log(parseObject);
                  var refId = "";
                  if (this.state.menuFlag == 1) {
                    refId = this.state.propertyId;
                  } else {
                    refId = this.state.unitId;
                  }
                  setTimeout(() => {
                    let payload = {
                      feature: parseObject,
                      refNumber: refId,
                    };
                    var url = "";
                    if (rowData.length > 0) {
                      url = "/rentals/property/feature/update/";
                    } else {
                      url = "/rentals/property/feature/create/";
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
                            <Col md="5" sm="12">
                              <label>Feature List</label>
                            </Col>
                            <Col md="5" sm="12">
                              <label>Description</label>
                            </Col>

                            <Col md="2" sm="12">
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
              <h6 className="primary">Features </h6>
            </Col>

            <Col md="1" sm="12">
              <Button.Ripple
                className="btn-icon rounded-circle"
                color="primary"
                onClick={() => this.toggleModal(5)}
                id="addfeatures"
              >
                <AddCircle />
              </Button.Ripple>
              <UncontrolledTooltip placement="top" target="addfeatures">
                Add & Update Features
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
        onConfirm={() => this.hideAlert()}
      >
        <p className="sweet-alert-text">Request Sussessfully Updated</p>
      </SweetAlert>
    );
    this.setState({
      alert: getAlert(),
    });
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
      modal: null,
    });
    this.componentDidMount();
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
    let featureData = [...this.state.featureData];
    featureData[i] = { ...featureData[i], [name]: value };
    this.setState({ featureData });
  }
  handleSelectChange(i, e) {
    let featureData = [...this.state.featureData];
    featureData[i] = { ...featureData[i], ["featureList"]: e.value };
    this.setState({ featureData });
  }
  removeClick(i) {
    let featureData = [...this.state.featureData];
    featureData.splice(i, 1);
    this.setState({ featureData });
  }
  removeAll() {
    let featureData = [...this.state.featureData];
    featureData.splice(0, featureData.length);
    this.setState({ featureData });
  }
  handleSubmit1(event) {
    event.preventDefault();
  }

  addClick() {
    this.setState((prevState) => ({
      featureData: [
        ...prevState.featureData,
        {
          featureList: "",
          description: "",
        },
      ],
    }));
  }
  createUI() {
    const { setFieldValue, errors, touched } = this.state;
    return this.state.featureData.map((el, i) => (
      <div key={i}>
        <Row>
          <Col md="4" sm="12">
            <Select
              type="select"
              name="featureList"
              value={featuresListData.find(
                (obj) => obj.value === el.featureList || ""
              )}
              options={featuresListData}
              onChange={this.handleSelectChange.bind(this, i)}
            />
          </Col>
          <Col md="6" sm="12">
            <Input
              name="description"
              value={el.description || ""}
              onChange={this.handleRowChange.bind(this, i)}
              type="text"
              required
            />
          </Col>

          <Col md="2" sm="12">
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

const ModalConfig = [
  {
    id: 5,
    btnTitle: "Update Details",
    modalTitle: "Features Details",
    modalClass: "modal-lg",
    bgColor: "bg-primary",
  },
];
var featuresListData = [];
export default Features;
