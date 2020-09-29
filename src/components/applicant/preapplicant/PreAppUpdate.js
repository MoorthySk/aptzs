import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import SweetAlert from "react-bootstrap-sweetalert";
import "react-toastify/dist/ReactToastify.css";
import "../../../assets/scss/plugins/extensions/toastr.scss";
import Helpers from "../Helpers";
import LovList from "../../common/Helpers";
import * as appConst from "../../../utility/Constants";
import { CheckSquare, XSquare, ChevronsLeft } from "react-feather";
import { toast } from "react-toastify";
import axios from "axios";
import { ContextLayout } from "../../../utility/context/Layout";
import { AgGridReact } from "ag-grid-react";
import moment from "moment";
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
  Modal,
  ModalHeader,
  ModalBody,
  UncontrolledTooltip,
  TabContent,
  TabPane,
} from "reactstrap";
import { Edit, Home } from "react-feather";
import {
  HomeWork,
  ContactMail,
  LocationCity,
  Filter9Plus,
  Filter6,
  Cancel,
  Event,
  RepeatOneSharp,
  AlarmAddSharp,
  SubtitlesSharp,
  AddCircle,
  CheckCircle,
} from "@material-ui/icons";
import { FormControlLabel, RadioGroup, Radio } from "@material-ui/core";
//import {RadioGroup, Radio} from 'react-toolbox/lib';

toast.configure();
class ReoccurenceUpdate extends React.Component {
  _isMounted = false;
  constructor(props) {
    super(props);
  }

  state = {
    taskId: "",
    subject: "",
    description: "",
    requestType: "",
    categoryType: "",
    propertyUnitId: "",
    propUnitName: "",
    assignedTo: "",
    dueAfter: "",
    dueType: "",
    priority: "",
    reoccureRepeat: "",
    startDate: "",
    endType: "",
    reOccuringCount: "",
    activeTab: "1",
    defaultColDef: {
      sortable: true,
    },
    rowData: null,
    columnDefs: [
      {
        headerName: "Unit Name",
        field: "propUnitName",
        width: 250,
        filter: true,
      },
      {
        headerName: "Unit Number",
        field: "propUnitNumber",
        filter: true,
        width: 250,
      },
      {
        headerName: "No Of Bed",
        field: "propNoOfBedRooms",
        filter: true,
        width: 250,
      },
      {
        headerName: "No Of bath",
        field: "propNoOfBathRooms",
        filter: true,
        width: 200,
      },

      {
        headerName: "Square Feet",
        field: "propSquareFeet",
        filter: true,
        width: 200,
      },

      {
        headerName: "Rent",
        field: "propRentAmount",
        filter: true,
        width: 200,
      },
      {
        headerName: "Status",
        field: "recordStatus",
        filter: true,
        width: 200,
      },
      {
        headerName: "Select",
        field:
          "proptyUnitId&propUnitName&propUnitNumber&propNoOfBedRooms&propSquareFeet&propRentAmount",
        width: 150,
        cellRendererFramework: (params) => {
          var proptyUnitId = params.data.proptyUnitId;
          var propUnitName = params.data.propUnitName;
          var propUnitNumber = params.data.propUnitNumber;
          var propNoOfBedRooms = params.data.propNoOfBedRooms;
          var propSquareFeet = params.data.propSquareFeet;
          var propRentAmount = params.data.propRentAmount;
          return (
            <div className="actions cursor-pointer">
              <CheckCircle
                color="primary"
                className="mr-50"
                onClick={() => {
                  this.apptData(
                    proptyUnitId,
                    propUnitName,
                    propUnitNumber,
                    propNoOfBedRooms,
                    propSquareFeet,
                    propRentAmount
                  );
                }}
              >
                Select
              </CheckCircle>
            </div>
          );
        },
      },
    ],
  };

  async componentDidMount() {
    this._isMounted = true;

    await axios({
      method: "POST",
      url: "/rentals/property/search-all/",
    })
      .then((response) => {
        try {
          let rowData = response.data.propUnitDtls;
          if (this._isMounted) {
            this.setState({ rowData });
          }
        } catch (e) {
          console.log(e);
        }
      })
      .catch((error) => {
        console.log("error:::" + error);
      });

    await axios
      .post("/maint/reoccuring/search-byid/", {
        reoccuringId: "reoccuringId",
      })
      .then((response) => {
        try {
          this.setState({
            taskId: response.data.reOccuringTask.reoccuringId,
            subject: response.data.reOccuringTask.subject,
            description: response.data.reOccuringTask.description,
            requestType: response.data.reOccuringTask.requestType.toString(),
            categoryType: response.data.reOccuringTask.categoryType,
            propertyUnitId: response.data.reOccuringTask.propertyUnitId,
            propUnitName: response.data.reOccuringTask.propertyUnitName,
            assignedTo: response.data.reOccuringTask.assignedTo,
            dueAfter: response.data.reOccuringTask.dueAfter,
            dueType: response.data.reOccuringTask.dueType,
            priority: response.data.reOccuringTask.priority.toString(),
            reoccureRepeat: response.data.reOccuringTask.reoccureRepeat,
            startDate: moment(response.data.reOccuringTask.startDate).format(
              "YYYY-MM-DD"
            ),
            endType: response.data.reOccuringTask.endType,
            reOccuringCount: response.data.reOccuringTask.reOccuringCount,
          });
        } catch (e) {
          console.log(e);
        }
      });
  }

  render() {
    const {
      taskId = "",
      subject = "",
      description = "",
      requestType = "",
      categoryType = "",
      propertyUnitId = "",
      propUnitName = "",
      assignedTo = "",
      dueAfter = "",
      dueType = "",
      priority = "",
      reoccureRepeat = "",
      startDate = "",
      endType = "",
      reOccuringCount = "",
      theme,
      columnDefs,
      pageSize,
      defaultColDef,
      rowData,
    } = this.state;

    return (
      <Formik
        enableReinitialize
        initialValues={{
          taskId: taskId,
          subject: subject,
          description: description,
          requestType: requestType,
          categoryType: categoryType,
          propertyUnitId: propertyUnitId,
          propUnitName: propUnitName,
          assignedTo: assignedTo,
          dueAfter: dueAfter,
          dueType: dueType,
          priority: priority,
          reoccureRepeat: reoccureRepeat,
          startDate: startDate,
          endType: endType,
          reOccuringCount: reOccuringCount,
        }}
        validationSchema={formValidation}
        //Onsubmit API Call function start////////////////////////////

        onSubmit={(values, actions) => {
          let responseCode = "";

          setTimeout(() => {
            let payload = {
              reoccuringId: values.taskId,
              subject: values.subject,
              description: values.description,
              requestType: values.requestType,
              categoryType: values.categoryType,
              propertyUnitId: values.propertyUnitId,
              assignedTo: values.assignedTo,
              dueAfter: values.dueAfter,
              dueType: values.dueType,
              priority: values.priority,
              reoccureRepeat: values.reoccureRepeat,
              startDate: values.startDate,
              endType: values.endType,
              reOccuringCount: values.reOccuringCount,
            };

            axios({
              method: "POST",
              url: "/maint/reoccuring/update/",
              headers: {
                Authorization: "Bearer " + localStorage.getItem("accessToken"),
              },
              data: payload,
            })
              .then((response) => {
                console.log("Response:::::::::::::" + response.data);

                responseCode = response.data.responseCode;
                console.log("Response Code:::::::::::::" + responseCode);
                if (responseCode == 1000) {
                  this.successMessage("successAlert", true);
                  actions.setSubmitting(false);
                } else {
                  toast.error("Bad Request");
                }
              })
              .catch((error) => {
                console.log(error);
                toast.error("Bad Request, Please verify your inputs!");
              });
          }, 1000);
        }}
      >
        {(props) => {
          const {
            handleSubmit,
            values,
            setFieldValue,
            errors,
            touched,
          } = props;
          return (
            <Form onSubmit={props.handleSubmit}>
              <Card>
                <CardHeader>
                  <CardTitle>Pre Applicant Form</CardTitle>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col md="6" sm="12">
                      <label htmlFor="subject">First Name</label>

                      <FormGroup className="has-icon-left position-relative">
                        <Field
                          className="form-control"
                          name="subject"
                          type="text"
                          value={"Jhon"}
                          onChange={(e) => {
                            this.setState({
                              subject: e.currentTarget.value,
                            });
                          }}
                        />

                        <div className="form-control-position">
                          <SubtitlesSharp size={15} />
                        </div>
                        <ErrorMessage
                          name="subject"
                          component="div"
                          className="field-error text-danger"
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6" sm="12">
                      <label htmlFor="subject">Last Name</label>

                      <FormGroup className="has-icon-left position-relative">
                        <Field
                          className="form-control"
                          name="subject"
                          type="text"
                          value={"Albert"}
                          onChange={(e) => {
                            this.setState({
                              subject: e.currentTarget.value,
                            });
                          }}
                        />

                        <div className="form-control-position">
                          <SubtitlesSharp size={15} />
                        </div>
                        <ErrorMessage
                          name="subject"
                          component="div"
                          className="field-error text-danger"
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6" sm="12">
                      <label htmlFor="description">Email Id</label>
                      <FormGroup className="has-icon-left position-relative">
                        <Field
                          className="form-control"
                          name="description"
                          type="text"
                          value={"jhon@gmail.com"}
                          onChange={(e) => {
                            this.setState({
                              description: e.currentTarget.value,
                            });
                          }}
                        />

                        <div className="form-control-position">
                          <ContactMail size={15} />
                        </div>
                        <ErrorMessage
                          name="description"
                          component="div"
                          className="field-error text-danger"
                        />
                      </FormGroup>
                    </Col>

                    <Col md="6" sm="12">
                      <label>Mobile Number</label>

                      <FormGroup className="has-icon-left position-relative">
                        <Field
                          className="form-control"
                          name="dueAfter"
                          type="number"
                          value={"9840642421"}
                          onChange={(e) => {
                            this.setState({
                              dueAfter: e.currentTarget.value,
                            });
                          }}
                        />
                        <div className="form-control-position">
                          <AlarmAddSharp size={15} />
                        </div>
                        <ErrorMessage
                          name="dueAfter"
                          component="div"
                          className="field-error text-danger"
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6" sm="12">
                      <label>Address</label>

                      <FormGroup className="has-icon-left position-relative">
                        <Field
                          className="form-control"
                          name="dueAfter"
                          type="text"
                          value={"7th street"}
                          onChange={(e) => {
                            this.setState({
                              dueAfter: e.currentTarget.value,
                            });
                          }}
                        />
                        <div className="form-control-position">
                          <AlarmAddSharp size={15} />
                        </div>
                        <ErrorMessage
                          name="dueAfter"
                          component="div"
                          className="field-error text-danger"
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6" sm="12">
                      <label>City</label>

                      <FormGroup className="has-icon-left position-relative">
                        <Field
                          className="form-control"
                          name="dueAfter"
                          type="text"
                          value={"Pitt"}
                          onChange={(e) => {
                            this.setState({
                              dueAfter: e.currentTarget.value,
                            });
                          }}
                        />
                        <div className="form-control-position">
                          <AlarmAddSharp size={15} />
                        </div>
                        <ErrorMessage
                          name="dueAfter"
                          component="div"
                          className="field-error text-danger"
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6" sm="12">
                      <label>State</label>

                      <FormGroup className="has-icon-left position-relative">
                        <Field
                          className="form-control"
                          name="dueAfter"
                          type="text"
                          value={"PA"}
                          onChange={(e) => {
                            this.setState({
                              dueAfter: e.currentTarget.value,
                            });
                          }}
                        />
                        <div className="form-control-position">
                          <AlarmAddSharp size={15} />
                        </div>
                        <ErrorMessage
                          name="dueAfter"
                          component="div"
                          className="field-error text-danger"
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6" sm="12">
                      <label>Zip Code</label>

                      <FormGroup className="has-icon-left position-relative">
                        <Field
                          className="form-control"
                          name="dueAfter"
                          type="number"
                          value={"15220"}
                          onChange={(e) => {
                            this.setState({
                              dueAfter: e.currentTarget.value,
                            });
                          }}
                        />
                        <div className="form-control-position">
                          <AlarmAddSharp size={15} />
                        </div>
                        <ErrorMessage
                          name="dueAfter"
                          component="div"
                          className="field-error text-danger"
                        />
                      </FormGroup>
                    </Col>
                    <Col sm="12" md="12">
                      <label htmlFor="mangeNotes">Notes</label>
                      <FormGroup className=" position-relative">
                        <Field
                          name="mangeNotes"
                          className="form-control"
                          placeholder="Doe"
                          value={"New"}
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
                          name="mangeNotes"
                          component="div"
                          className="field-error text-danger"
                        />
                      </FormGroup>
                    </Col>

                    <Col md={{ size: 8, offset: 4 }}>
                      <Button.Ripple
                        color="primary"
                        type="submit"
                        className="mr-1 mb-1"
                      >
                        <CheckSquare size={14} />

                        <span className="align-middle ml-25">Update</span>
                      </Button.Ripple>

                      <Button.Ripple
                        color="danger"
                        onClick={Helpers.preAppCancel}
                        className="mr-1 mb-1"
                      >
                        <XSquare size={14} />

                        <span className="align-middle ml-25">Cancel</span>
                      </Button.Ripple>
                    </Col>
                    <FormGroup row>
                      <Col md={{ size: 8, offset: 4 }}>{this.state.alert}</Col>
                    </FormGroup>
                  </Row>
                </CardBody>
              </Card>
            </Form>
          );
        }}
      </Formik>
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
        onConfirm={() => this.props.history.push("/reoccurenceSearch")}
      >
        <p className="sweet-alert-text">Reoccurence Sussessfully Updated</p>
      </SweetAlert>
    );
    this.setState({
      alert: getAlert(),
    });
  }
  handleCancel = () => {
    this.props.history.push("/reoccurenceSearch");
  };

  hideAlert() {
    this.props.history.push("/reoccurenceSearch");
    this.setState({
      alert: null,
    });
  }

  radioPriority = (e) => {
    // this.state.priority = e.currentTarget.value;
    this.setState({
      priority: e.currentTarget.value,
    });
  };

  radioRequestType = (e) => {
    // this.state.priority = e.currentTarget.value;
    this.setState({
      requestType: e.currentTarget.value,
    });
  };
  categoryTypeChange = (e) => {
    this.setState({
      categoryType: e.value,
    });
  };

  assignedToChange = (e) => {
    this.setState({
      assignedTo: e.value,
    });
  };

  dueTypeChange = (e) => {
    this.setState({
      dueType: e.value,
    });
  };

  reoccureRepeatChange = (e) => {
    this.setState({
      reoccureRepeat: e.value,
    });
  };

  endTypeChange = (e) => {
    this.setState({
      endType: e.value,
    });
  };

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

  apptData = (
    proptyUnitId,
    propUnitName,
    propUnitNumber,
    propNoOfBedRooms,
    propSquareFeet,
    propRentAmount
  ) => {
    this.setState((prevState) => ({
      modal: !prevState.modal,
    }));
    console.log("proptyUnitId" + proptyUnitId);
    this.state.propertyUnitId = proptyUnitId;
    this.state.propUnitName = propUnitName;
  };

  updateSearchQuery = (val) => {
    this.gridApi.setQuickFilter(val);
    this.setState({
      searchVal: val,
    });
  };
}

const customStyles = {
  option: (provided, state) => ({
    ...provided,
    borderBottom: "1px dotted pink",
    color: state.isSelected ? "red" : "blue",
    padding: 20,
  }),
  control: () => ({
    // none of react-select's styles are passed to <Control />
    width: 200,
  }),
  singleValue: (provided, state) => {
    const opacity = state.isDisabled ? 0.5 : 1;
    const transition = "opacity 300ms";

    return { ...provided, opacity, transition };
  },
};
var userList = [];
var categoryTypeList = [];
var dueTypeList = [];
var repeatList = [];
var endTypeList = [];
const formValidation = Yup.object().shape({
  subject: Yup.string().required("Required"),
  description: Yup.string().required("Required"),
  requestType: Yup.number().required("Required"),
  categoryType: Yup.number().required("Required"),
  propertyUnitId: Yup.number().required("Required"),
  assignedTo: Yup.number().required("Required"),
  dueAfter: Yup.number().required("Required"),
  dueType: Yup.number().required("Required"),
  priority: Yup.number().required("Required"),
  reoccureRepeat: Yup.number().required("Required"),
  startDate: Yup.date().required("Required"),
  endType: Yup.number().required("Required"),
  reOccuringCount: Yup.number().required("Required"),
});

const ModalConfig = [
  {
    id: 5,
    btnTitle: "Select Unit",
    modalTitle: "Property Details",
    modalClass: "modal-xl",
    bgColor: "bg-primary",
  },
];
export default ReoccurenceUpdate;
