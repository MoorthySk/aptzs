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
import { FormControlLabel, RadioGroup, Radio } from '@material-ui/core';
//import {RadioGroup, Radio} from 'react-toolbox/lib';



toast.configure();
class ReoccurenceCreate extends React.Component {
  _isMounted = false;
  constructor(props) {
    super(props);     
  }

  state = {
    taskId:"",
    subject:"",
    description:"",
    requestType:"",
    categoryType:"",
    propertyUnitId:"",
    propUnitName:"",
    assignedTo:"",
    dueAfter:"",
    dueType:"",
    priority:"",
    reoccureRepeat:"",
    startDate:"",
    endType:"",
    reOccuringCount:"",
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

    var categoryParentId = appConst.categoryType;
    var dueTypeParentId = appConst.dueType;
    var repeatParent = appConst.repeat;
    var endTypeParent = appConst.endType;

    categoryTypeList = await LovList.lovList(categoryParentId);
    dueTypeList = await LovList.lovList(dueTypeParentId);
    repeatList = await LovList.lovList(repeatParent);
    endTypeList = await LovList.lovList(endTypeParent);
    userList = await LovList.userList();
    this._isMounted = true;
    
    await axios({
      method: "POST",
      url: "/rentals/property/search-all/",
    })
      .then((response) => {
        console.log("Response:::::::::::::" + response.data);
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
    
  }
  render() {

    const {
        subject="",
        description="",
        requestType="",
        categoryType="",
        propertyUnitId="",
        propUnitName="",
        assignedTo="",
        dueAfter="",
        dueType="",
        priority="",
        reoccureRepeat="",
        startDate="",
        endType="",
        reOccuringCount="",
        theme,
        columnDefs,
        pageSize,
        defaultColDef,
        rowData
    } = this.state;

   /* const selectStyles = {
      input: (base) => ({
        ...base,
        color: theme.palette.text.primary,
        "& input": {
          font: "inherit",
        },
      }),
    };*/

    const selectStyles = {
      menu: base => ({
        ...base,
        zIndex: 100
      })
    };

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
      <Formik
        enableReinitialize
        initialValues={{
            subject:subject,
            description:description,
            requestType:requestType,
            categoryType:categoryType,
            propertyUnitId:propertyUnitId,
            propUnitName:propUnitName,
            assignedTo:assignedTo,
            dueAfter:dueAfter,
            dueType:dueType,
            priority:priority,
            reoccureRepeat:reoccureRepeat,
            startDate:startDate,
            endType:endType,
            reOccuringCount:reOccuringCount,
        }}
        validationSchema={formValidation}
        //Onsubmit API Call function start////////////////////////////

        onSubmit={(values, actions) => {
          let responseCode = "";

          setTimeout(() => {
            let payload = {
                subject:values.subject,
                description:values.description,
                requestType:values.requestType,
                categoryType:values.categoryType,
                propertyUnitId:values.propertyUnitId,
                assignedTo:values.assignedTo,
                dueAfter:values.dueAfter,
                dueType:values.dueType,
                priority:values.priority,
                reoccureRepeat:values.reoccureRepeat,
                startDate:values.startDate,
                endType:values.endType,
                reOccuringCount:values.reOccuringCount,
            };

            axios({
              method: "POST",
              url: "/maint/reoccuring/create/",
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
                  <CardTitle>Reoccuring Task Creation</CardTitle>
                </CardHeader>
                <CardBody>
                  <h6 className="primary">Task Details</h6>
                  <Row>
                    <Col md="6" sm="12">
                      <label htmlFor="subject">Subject</label>

                      <FormGroup className="has-icon-left position-relative">
                        <Field
                          className="form-control"
                          name="subject"
                          type="text"
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
                      <label htmlFor="requestType">Request Type</label>

                      <FormGroup className="has-icon-left position-relative">
                      <div className="d-inline-block mr-1">
                              <Radio
                                label="Owner"
                                color="primary"
                                name="requestType"
                                value="1"
                                checked={requestType == 1}
                                onChange={this.radioRequestType}                                
                              />Owner
                      </div>
                      <div className="d-inline-block mr-1">
                              <Radio
                                label="Manager"
                                color="primary"
                                name="requestType"
                                value="2"
                                checked={requestType == 2}
                                onChange={this.radioRequestType}                                
                              />Manager
                      </div>   

                       <ErrorMessage
                          name="requestType"
                          component="div"
                          className="field-error text-danger"
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6" sm="12">
                      <label htmlFor="description">Description</label>
                      <FormGroup className="has-icon-left position-relative">
                        <Field
                          className="form-control"
                          name="description"
                          type="text"
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
                      <label htmlFor="categoryType">Category Type</label>

                      <FormGroup className="has-icon-left position-relative">
                      <Select styles={selectStyles}
                          name="categoryType"
                          options={categoryTypeList}
                          //value={defaultValue(categoryTypeList, values.name)}
                          //onChange={categoryTypeList => setFieldValue("categoryType", categoryTypeList.value)} 
                          onChange={(categoryTypeList) => {
                            this.setState({
                              categoryType: categoryTypeList.value,
                            });
                          }}
                          
                        />

                        <ErrorMessage
                          name="categoryType"
                          component="div"
                          className="field-error text-danger"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="6" sm="12">
                      <label htmlFor="propertyUnitId" id="addapp">Property Unit Name <AddCircle size={1} onClick={() => this.toggleModal(5)}/></label>
                      
                      <UncontrolledTooltip placement="top" target="addapp">
                        Select Unit
                      </UncontrolledTooltip>
                      <FormGroup className="has-icon-left position-relative">
                        <Field
                          className="form-control"
                          name="propUnitName"
                          type="text"                          
                        />

                        <div className="form-control-position">
                          <Filter6 size={15} />
                        </div>
                        <ErrorMessage
                          name="propertyUnitId"
                          component="div"
                          className="field-error text-danger"
                        />
                      </FormGroup>
                        
                    </Col>
                    
                    <Col md="6" sm="12">
                      <label htmlFor="assignedTo">Assigned To</label>

                      <FormGroup className="has-icon-left position-relative">
                        <Select styles={selectStyles}
                            name="assignedTo"
                            options={userList}
                            //onChange={userList => setFieldValue("assignedTo", userList.value)} 
                            onChange={(userList) => {
                              this.setState({
                                assignedTo: userList.value,
                              });
                            }}
                          />

                        <ErrorMessage
                          name="assignedTo"
                          component="div"
                          className="field-error text-danger"
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6" sm="12">
                      <label>Due After</label>

                      <FormGroup className="has-icon-left position-relative">
                        <Field
                            className="form-control"
                            name="dueAfter"
                            type="number"
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
                      <label htmlFor="priority">Priority</label>

                      <FormGroup className="has-icon-left position-relative">
                      <div className="d-inline-block mr-1">
                              <Radio
                                label="Low"
                                color="primary"
                                name="priority"
                                value="1"
                                checked={priority == 1}
                                onChange={this.radioPriority}
                              />Low
                            </div>
                            <div className="d-inline-block mr-1">
                              <Radio
                                label="Medium"
                                color="primary"
                                name="priority"
                                value="2"
                                checked={priority == 2}
                                onChange={this.radioPriority}
                              />Medium
                            </div>
                            <div className="d-inline-block mr-1">
                              <Radio
                                label="High"
                                color="primary"
                                name="priority"
                                value="3"
                                checked={priority == 3}
                                onChange={this.radioPriority}
                              />High
                            </div>

                        <ErrorMessage
                          name="priority"
                          component="div"
                          className="field-error text-danger"
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6" sm="12">
                      <label htmlFor="dueType">Due Type</label>
                      <FormGroup className="has-icon-left position-relative">
                        <Select styles={selectStyles}
                            name="dueType"
                            options={dueTypeList}
                            //onChange={dueTypeList => setFieldValue("dueType", dueTypeList.value)} 
                            onChange={(dueTypeList) => {
                              this.setState({
                                dueType: dueTypeList.value,
                              });
                            }}
                          />                    
                        <ErrorMessage
                          name="dueType"
                          component="div"
                          className="field-error text-danger"
                        />
                      </FormGroup>
                    </Col>
                    
                    <Col md="6" sm="12">
                      <label htmlFor="reoccureRepeat">Repeat</label>
                      <FormGroup className="has-icon-left position-relative">
                        <Select styles={selectStyles}
                            name="reoccureRepeat"
                            options={repeatList}
                            //onChange={repeatList => setFieldValue("reoccureRepeat", repeatList.value)} 
                            onChange={(repeatList) => {
                              this.setState({
                                reoccureRepeat: repeatList.value,
                              });
                            }}
                          />                        
                        <ErrorMessage
                          name="reoccureRepeat"
                          component="div"
                          className="field-error text-danger"
                        />                          
                      </FormGroup>
                    </Col>
                    <Col md="6" sm="12">
                      <label htmlFor="startDate">Start Date</label>

                      <FormGroup className="has-icon-left position-relative">
                        <Field
                            className="form-control"
                            name="startDate"
                            type="date"
                            placeholder="MM/DD/YYYY"
                            onChange={(e) => {
                              this.setState({
                                startDate: e.currentTarget.value,
                              });
                            }}
                          />

                        <div className="form-control-position">
                            <Event />
                        </div>
                        <ErrorMessage
                          name="startDate"
                          component="div"
                          className="field-error text-danger"
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6" sm="12">
                      <label htmlFor="endType">End Type</label>
                      <FormGroup className="has-icon-left position-relative">
                        <Select styles={selectStyles}
                            name="endType"
                            options={endTypeList}
                            //onChange={endTypeList => setFieldValue("endType", endTypeList.value)} 
                            onChange={(endTypeList) => {
                              this.setState({
                                endType: endTypeList.value,
                              });
                            }}
                          />                        
                        <ErrorMessage
                          name="endType"
                          component="div"
                          className="field-error text-danger"
                        />                       
                      </FormGroup>
                    </Col>
                    <Col md="6" sm="12">
                      <label>Reoccuring Count</label>

                      <FormGroup className="has-icon-left position-relative">
                        <Field
                            className="form-control"
                            name="reOccuringCount"
                            type="number"
                            onChange={(e) => {
                              this.setState({
                                reOccuringCount: e.currentTarget.value,
                              });
                            }}
                          />
                        <div className="form-control-position">
                            <RepeatOneSharp size={15} />
                        </div>
                        <ErrorMessage
                          name="reOccuringCount"
                          component="div"
                          className="field-error text-danger"
                        />
                      </FormGroup>
                    </Col>
                    <Col md="12" sm="12">
                      <TabContent activeTab={this.state.activeTab}>
                        <TabPane tabId="1">{renderModal}</TabPane>
                      </TabContent>
                    </Col>
                    <Col md={{ size: 8, offset: 4 }}>
                    <Button.Ripple
                      color="primary"
                      type="submit"
                      className="mr-1 mb-1"
                    >
                      <CheckSquare size={14} />

                      <span className="align-middle ml-25">Save</span>
                    </Button.Ripple>

                    <Button.Ripple
                      color="danger"
                      onClick={Helpers.reoccuringCancel}
                      className="mr-1 mb-1"
                    >
                      <XSquare size={14} />

                      <span className="align-middle ml-25">Cancel</span>
                    </Button.Ripple>
                  </Col>
                  <FormGroup row>
                    <Col md={{ size: 8, offset: 4 }}>
                      {this.state.alert}
                      
                    </Col>
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
        <p className="sweet-alert-text"> Reoccurence Sussessfully Created</p>
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
    this.state.priority=e.currentTarget.value;
    this.setState({
      priority: e.currentTarget.value,
    });
  };

  radioRequestType = (e) => {
    
    //this.state.requestType=e.currentTarget.value;
    this.setState({
      
        //...prevState.subject,
        requestType: e.currentTarget.value,
      
      
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
      categoryType:prevState.categoryType,
      assignedTo:prevState.assignedTo,
      dueType:prevState.dueType,
      reoccureRepeat:prevState.reoccureRepeat,
      endType:prevState.endType,
      propertyUnitId:proptyUnitId,
      propUnitName:propUnitName,
      modal: !prevState.modal,
    }));
    //console.log("proptyUnitId" + proptyUnitId);
    //this.state.propertyUnitId=proptyUnitId;
    //this.state.propUnitName=propUnitName;
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
var repeatList =  [];
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
export default ReoccurenceCreate;
