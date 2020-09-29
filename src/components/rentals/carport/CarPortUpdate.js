import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import SweetAlert from "react-bootstrap-sweetalert";
import { CheckSquare, XSquare, ChevronsLeft } from "react-feather";
import { Cancel, AddCircle } from "@material-ui/icons";
import "../../../assets/scss/plugins/forms/react-select/_react-select.scss";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Button,
  FormGroup,
  Col,
  Row,
  Input,
  ListGroup,
  ListGroupItem,
} from "reactstrap";

class CarPortUpdate extends React.Component {
  state = {
    successAlert: true,
    radio: null,
    selectedOption: "vanilla",
  };

  async componentDidMount() {
    var carPortId = this.props.match.params.cpHdrId;
    let carPortHdr = "";
    let carPortDtl = "";

    await axios
      .post("/rentals/carport/search/", {
        cpHdrId: carPortId,
      })

      .then((response) => {
        carPortHdr = response.data.carportHdr;
        carPortDtl = response.data.carportDtl;

        this.setState({
          propertyName: carPortHdr.propertyName,
          propertyNotes: carPortHdr.notes,
          cpHdrId: carPortHdr.cpHdrId,
        });

        this.removeAll();
        for (var i = 0; i < carPortDtl.length; i++) {
          this.setState((prevState) => ({
            users: [
              ...prevState.users,
              {
                parkingName: carPortDtl[i].parkingName,
                parkingNo: carPortDtl[i].parkingNo,
                parkingNotes: carPortDtl[i].parkingNotes,
                parkingStatus: carPortDtl[i].parkingStatus,
              },
            ],
          }));
        }
      });
    let responseCode;
    await axios({
      method: "POST",
      url: "/rentals/property/search-all/",
    }).then((response) => {
      responseCode = response.data.responseCode;
      if (responseCode === "1004") {
        this.props.history.push("/sessionExpired");
      } else {
        this.setState({
          values: response.data.propDtls,
        });
      }
    });

    let marked = this.state.values;
    marked !== undefined &&
      this.state.values.forEach((vData) => {
        let propertyData = {};
        propertyData.value = vData.propertyId;
        propertyData.label = vData.proptyName;
        propertyList.push(propertyData);
      });
  }

  render() {
    const { propertyName, propertyNotes, cpHdrId } = this.state;

    return (
      <Card>
        <CardHeader>
          <CardTitle>CarPort Request</CardTitle>
        </CardHeader>
        <CardBody>
          <Formik
            enableReinitialize
            initialValues={{
              propertyName: propertyName,
              propertyNotes: propertyNotes,
              cpHdrId: cpHdrId,
            }}
            validationSchema={formValidation}
            onSubmit={(values, actions) => {
              let responseCode = "";
              var myObject = JSON.stringify(this.state.users);
              var parseObject = JSON.parse(myObject);
              console.log(parseObject);
              setTimeout(() => {
                let payload = {
                  carportHdr: {
                    propertyName: values.propertyName,
                    notes: values.propertyNotes,
                    cpHdrId: cpHdrId,
                  },
                  carportDtl: parseObject,
                };
                axios({
                  method: "POST",
                  url: "/rentals/carport/update/",
                  data: payload,
                })
                  .then((response) => {
                    responseCode = response.data.responseCode;

                    if (responseCode == 1000) {
                      this.successMessgae("successAlert", true);
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
              const {
                //constant variable
              } = props;
              return (
                <Form onSubmit={props.handleSubmit}>
                  <Row>
                    <Col md="12" sm="12">
                      <label htmlFor="propertyName">Property Name</label>

                      <FormGroup>
                        <Select
                          isClearable={true}
                          name="propertyName"
                          value={propertyList.find(
                            (obj) => obj.value === propertyName
                          )}
                          options={propertyList}
                          onChange={this.propertyChange}
                        />

                        <ErrorMessage
                          name="propertyName"
                          component="div"
                          className="field-error text-danger"
                        />
                      </FormGroup>
                    </Col>
                    <Col md="12" sm="12">
                      <label htmlFor="propertyNotes">Notes</label>
                      <FormGroup>
                        <Field
                          name="propertyNotes"
                          className="form-control"
                          placeholder="Doe"
                        >
                          {({ field, form: { touched, errors }, meta }) => (
                            <div>
                              <Input
                                type="textarea"
                                placeholder="Remarks"
                                {...field}
                              />
                            </div>
                          )}
                        </Field>

                        <ErrorMessage
                          name="propertyNotes"
                          component="div"
                          className="field-error text-danger"
                        />
                      </FormGroup>
                    </Col>
                    <Col md="12" sm="12">
                      <ListGroup tag="div">
                        <ListGroupItem>Parking Details</ListGroupItem>
                        <ListGroupItem>
                          {" "}
                          <Col>
                            <div>
                              <Row>
                                <Col md="3" sm="12">
                                  <label>Parking Name</label>
                                </Col>
                                <Col md="3" sm="12">
                                  <label>Parking Number</label>
                                </Col>
                                <Col md="3" sm="12">
                                  <label>Notes</label>
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
                        </ListGroupItem>
                      </ListGroup>
                    </Col>
                  </Row>

                  <FormGroup row>
                    <Col md={{ size: 8, offset: 4 }}>
                      <Button.Ripple
                        color="primary"
                        type="submit"
                        className="mr-1 mb-1"
                      >
                        <CheckSquare size={14} />

                        <span className="align-middle ml-25">Submit</span>
                      </Button.Ripple>
                      <Button.Ripple
                        color="warning"
                        type="reset"
                        className="mr-1 mb-1"
                      >
                        <ChevronsLeft size={14} />

                        <span className="align-middle ml-25">Reset</span>
                      </Button.Ripple>
                      <Button.Ripple
                        color="danger"
                        onClick={this.handleCancel}
                        className="mr-1 mb-1"
                      >
                        <XSquare size={14} />

                        <span className="align-middle ml-25">Cancel</span>
                      </Button.Ripple>

                      {this.state.alert}
                    </Col>
                  </FormGroup>
                </Form>
              );
            }}
          </Formik>
        </CardBody>
      </Card>
    );
  }
  createUI() {
    const { setFieldValue, errors, touched } = this.state;
    return this.state.users.map((el, i) => (
      <div key={i}>
        <Row>
          <Col md="3" sm="12">
            <Input
              name="parkingName"
              value={el.parkingName || ""}
              onChange={this.handleRowChange.bind(this, i)}
              type="text"
            />
          </Col>
          <Col md="3" sm="12">
            <Input
              name="parkingNo"
              value={el.parkingNo || ""}
              onChange={this.handleRowChange.bind(this, i)}
              type="text"
            />
          </Col>

          <Col md="3" sm="12">
            <Input
              name="parkingNotes"
              value={el.parkingNotes || ""}
              onChange={this.handleRowChange.bind(this, i)}
              type="text"
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
  propertyChange = (e) => {
    console.log("e.value:::" + e.value);
    let selectedProprty = e.value;
    this.setState({
      propertyName: selectedProprty,
    });
  };
  handleCancel = () => {
    this.props.history.push("/carPortSearch");
  };
  successMessgae(state, value) {
    const getAlert = () => (
      <SweetAlert
        success
        confirmBtnText="Ok!"
        title="Success"
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
  hideAlert() {
    this.props.history.push("/carPortSearch");
    this.setState({
      alert: null,
    });
  }
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
  constructor(props) {
    super(props);
    this.state = {
      users: [
        {
          parkingName: "",
          parkingNo: "",
          parkingNotes: "",
        },
      ],
    };
    this.handleSubmit1 = this.handleSubmit1.bind(this);
  }

  addClick() {
    this.setState((prevState) => ({
      users: [
        ...prevState.users,
        {
          parkingName: "",
          parkingNo: "",
          parkingNotes: "",
        },
      ],
    }));
  }
}
const formValidation = Yup.object().shape({
  propertyNotes: Yup.string().required("Required"),
  propertyName: Yup.string().required("Required"),
});

const propertyList = [];
export default CarPortUpdate;
