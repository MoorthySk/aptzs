import React from "react";
import * as configData from "../../../utility/config";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import Radio from "../../@vuexy/radio/RadioVuexy";
import SweetAlert from "react-bootstrap-sweetalert";
import { CheckSquare, XSquare } from "react-feather";
import axios from "axios";
import Toggle from "react-toggle";
import "react-toggle/style.css";
import "../../../assets/scss/plugins/forms/switch/react-toggle.scss";
import Helpers from "./Helpers";
import Select from "react-select";
import Checkbox from "../../@vuexy/checkbox/CheckboxesVuexy";
import { Check, Lock } from "react-feather";
import {
  Card,
  CardTitle,
  CardBody,
  Button,
  FormGroup,
  Col,
  Row,
  Input,
  ListGroup,
  ListGroupItem,
  Table,
} from "reactstrap";

import { Cancel, AddCircle, AssignmentInd } from "@material-ui/icons";
var buttonList = [];
class RoleCreate extends React.Component {
  state = {
    successAlert: true,
    isChecked: true,
    isEntry: false,
    isActive: null,
    isCheckedWhatsup: false,
    isCheckedEmail: false,
    entryAllowed: false,
    rowData: [],
    values: [],
    year: null,
    rbacDataList: [
      {
        roleId: "",
        rbacId: "",
      },
    ],
    users: [
      {
        moduleName: "",
        moduleId: "",
        searchList: "",
        updateList: "",
        createList: "",
        viewList: "",
        deleteList: "",
        isModuleName: "",
        isSearchList: "",
        isUpdateList: "",
        isCreateList: "",
        isViewList: "",
        isDeleteList: "",
      },
    ],
    moduleData: [],
    moduleId: [],
    createData: [],
    updateData: [],
    viewData: [],
    searchData: [],
    deleteData: [],
    isModuleData: [],
    isCreateData: [],
    isUpdateData: [],
    isViewData: [],
    isSearchData: [],
    isDeleteData: [],
  };
  constructor(props) {
    super(props);
    this.handleSubmit1 = this.handleSubmit1.bind(this);
  }
  async componentDidMount() {
    var roleId = this.props.match.params.roleId;

    axios
      .post("/admin/role/searchrole/", {
        roleId: roleId,
      })

      .then((response) => {
        var roleObj = response.data.roleDtl;
        try {
          this.setState({
            roleId: roleObj.roleId,
            roleCode: roleObj.roleCode,
            roleName: roleObj.roleName,
            defaultRbacMenuId: roleObj.defaultRbacMenuId,
            roleRemarks: roleObj.roleRemarks,
          });
        } catch (e) {
          console.log(e);
        }
      });
    this.removeAll();
    axios
      .post("/admin/role/rback-listmaping/", {
        roleId: roleId,
      })

      .then((response) => {
        let marked = response.data.AllMenu;
        marked !== undefined &&
          response.data.AllMenu.forEach((mData) => {
            this.state.moduleData = mData.rbacName;
            this.state.moduleId = mData.rbacid;

            let markedPriv = mData.rbacPrivilege;

            markedPriv !== undefined &&
              mData.rbacPrivilege.forEach((aData) => {
                if (aData.rbacTypeID == 1) {
                  this.state.searchData = aData.rbacId;
                  if (aData.isMapped == 1) {
                    this.state.isSearchData = "true";
                  } else {
                    this.state.isSearchData = "false";
                  }
                } else if (aData.rbacTypeID == "2") {
                  this.state.createData = aData.rbacId;
                  if (aData.isMapped == 1) {
                    this.state.isCreateData = "true";
                  } else {
                    this.state.isCreateData = "false";
                  }
                } else if (aData.rbacTypeID == "3") {
                  this.state.updateData = aData.rbacId;
                  if (aData.isMapped == 1) {
                    this.state.isUpdateData = "true";
                  } else {
                    this.state.isUpdateData = "false";
                  }
                } else if (aData.rbacTypeID == "4") {
                  this.state.viewData = aData.rbacId;
                  if (aData.isMapped == 1) {
                    this.state.isViewData = "true";
                  } else {
                    this.state.isViewData = "false";
                  }
                } else if (aData.rbacTypeID == "5") {
                  this.state.deleteData = aData.rbacId;
                  if (aData.isMapped == 1) {
                    this.state.isDeleteData = "true";
                  } else {
                    this.state.isDeleteData = "false";
                  }
                }
              });
            this.setState((prevState) => ({
              users: [
                ...prevState.users,
                {
                  moduleName: this.state.moduleData,
                  moduleId: this.state.moduleId,
                  searchList: this.state.searchData,
                  isSearchList: this.state.isSearchData,
                  createList: this.state.createData,
                  isCreateList: this.state.isCreateData,
                  updateList: this.state.updateData,
                  isUpdateList: this.state.isUpdateData,
                  viewList: this.state.viewData,
                  isViewList: this.state.isViewData,
                  deleteList: this.state.deleteData,
                  isDeleteList: this.state.isDeleteData,
                },
              ],
            }));
          });
      });
  }

  render() {
    const {
      loginId = "",
      roleId = "",
      roleCode = "",
      roleName = "",
      roleRemarks = "",
      defaultRbacMenuId = "",
    } = this.state;

    return (
      <Formik
        enableReinitialize
        initialValues={{
          roleCode: roleCode,
          roleId: roleId,
          roleName: roleName,
          roleRemarks: roleRemarks,
          defaultRbacMenuId: defaultRbacMenuId,
        }}
        validationSchema={formValidation}
        onSubmit={(values, actions) => {
          let roleResponseCode = "";
          var myObject = JSON.stringify(this.state.users);
          var parseObject = JSON.parse(myObject);
          var rbacList = this.finalObject(parseObject);
          var myObject1 = JSON.stringify(rbacList);
          var parseObject = JSON.parse(myObject1);

          let payload = {
            role: {
              roleId: values.roleId,
              roleCode: values.roleCode,
              roleName: values.roleName,
              roleRemarks: values.roleRemarks,
              defaultRbacMenuId: values.defaultRbacMenuId.value,
              record_status: values.activeStatus,
            },
            rbac: rbacList,
            token: localStorage.getItem("accessToken"),
          };
          setTimeout(() => {
            console.log("token " + localStorage.getItem("accessToken"));
            axios({
              method: "POST",
              url: "/admin/role/update/",
              withCredentials: true,
              data: payload,
            })
              .then((response) => {
                roleResponseCode = response.data.responseCode;
                if (roleResponseCode == 1000) {
                  this.successMessage("successAlert", true);
                } else if (roleResponseCode == 1004) {
                  this.props.history.push("/sessionExpired");
                }
              })
              .catch((error) => {
                console.log(error);
                this.errorMessgae("errorAlert", true);
              });
          }, 1000);
        }}
      >
        {(props) => {
          const {
            setFieldValue,
            handleChange,
            errors,
            touched,
            year,
            values,
            handleBlur,
          } = props;

          return (
            <Form onSubmit={props.handleSubmit}>
              <Card>
                <CardBody>
                  <CardTitle>Role Creation</CardTitle>
                  <Row>
                    <Col md="6" sm="12">
                      <FormGroup>
                        <label htmlFor="roleCode">Role Code</label>
                        <Field
                          className="form-control"
                          name="roleCode"
                          placeholder="Doe"
                          type="text"
                        />
                        <ErrorMessage
                          name="roleCode"
                          component="div"
                          className="field-error text-danger"
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6" sm="12">
                      <FormGroup>
                        <label htmlFor="roleName">Role Name</label>
                        <Field
                          className="form-control"
                          name="roleName"
                          placeholder="Doe"
                          type="text"
                        />
                        <ErrorMessage
                          name="roleName"
                          component="div"
                          className="field-error text-danger"
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6" sm="12">
                      <label htmlFor="defaultRbacMenuId">Default Menu</label>
                      <FormGroup>
                        <Select
                          isClearable={true}
                          name="defaultRbacMenuId"
                          classNamePrefix="select"
                          value={menuOption.find(
                            (obj) => obj.value === defaultRbacMenuId
                          )}
                          options={menuOption}
                          onChange={(menuOption) =>
                            setFieldValue("defaultRbacMenuId", menuOption)
                          }
                        />
                        <ErrorMessage
                          name="defaultRbacMenuId"
                          component="div"
                          className="field-error text-danger"
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6" sm="12">
                      <label htmlFor="activeStatus">Active Status</label>

                      <FormGroup className="has-icon-left position-relative">
                        <div className="d-inline-block mr-1">
                          <Radio
                            label="Active"
                            color="primary"
                            name="activeStatus"
                            defaultChecked={true}
                            onChange={() => setFieldValue("activeStatus", "1")}
                          />
                        </div>

                        <div className="d-inline-block mr-1">
                          <Radio
                            label="InActive"
                            color="danger"
                            name="activeStatus"
                            onChange={() => setFieldValue("activeStatus", "9")}
                          />
                        </div>
                      </FormGroup>
                    </Col>

                    <Col md="6" sm="12">
                      <label htmlFor="roleRemarks">Remarks</label>
                      <FormGroup>
                        <Field
                          name="roleRemarks"
                          className="form-control"
                          placeholder="Doe"
                        >
                          {({ field, form: { touched, errors }, meta }) => (
                            <div>
                              <Input
                                type="textarea"
                                placeholder="User Remarks"
                                {...field}
                              />
                            </div>
                          )}
                        </Field>
                      </FormGroup>
                    </Col>

                    <Col md="12" sm="12">
                      <div className="permissions border px-2">
                        <div className="title pt-2 pb-0">
                          <Lock size={19} />
                          <span className="text-bold-500 font-medium-2 ml-50">
                            Permissions
                          </span>
                          <hr />
                        </div>
                        <Row>
                          <Col md="2" sm="12">
                            <h6>Module Name</h6>
                          </Col>
                          <Col md="1" sm="12">
                            <h6>Search</h6>
                          </Col>
                          <Col md="1" sm="12">
                            <h6>Create</h6>
                          </Col>
                          <Col md="1" sm="12">
                            <h6>Update</h6>
                          </Col>
                          <Col md="1" sm="12">
                            <h6>View</h6>
                          </Col>
                          <Col md="1" sm="12">
                            <h6>Delete</h6>
                          </Col>
                          <br />
                        </Row>

                        {this.createUI()}
                        <br />
                      </div>
                    </Col>
                  </Row>
                  <br />

                  <br />
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
                        color="danger"
                        onClick={Helpers.handleCancel}
                        className="mr-1 mb-1"
                      >
                        <XSquare size={14} />

                        <span className="align-middle ml-25">Cancel</span>
                      </Button.Ripple>

                      {this.state.alert}
                    </Col>
                  </FormGroup>
                </CardBody>
              </Card>
            </Form>
          );
        }}
      </Formik>
    );
  }
  onSearchItem = (i) => (event) => {
    if (this.state.users[i].isSearchList == "true") {
      this.setState((state) => {
        state.users[i].isSearchList = "false";
        return {
          users: state.users,
        };
      });
    } else {
      this.setState((state) => {
        state.users[i].isSearchList = "true";
        return {
          users: state.users,
        };
      });
    }
  };
  onCreateItem = (i) => (event) => {
    if (this.state.users[i].isCreateList == "true") {
      this.setState((state) => {
        state.users[i].isCreateList = "false";
        return {
          users: state.users,
        };
      });
    } else {
      this.setState((state) => {
        state.users[i].isCreateList = "true";
        return {
          users: state.users,
        };
      });
    }
  };
  onUpdateItem = (i) => (event) => {
    if (this.state.users[i].isUpdateList == "true") {
      this.setState((state) => {
        state.users[i].isUpdateList = "false";
        return {
          users: state.users,
        };
      });
    } else {
      this.setState((state) => {
        state.users[i].isUpdateList = "true";
        return {
          users: state.users,
        };
      });
    }
  };
  onViewItem = (i) => (event) => {
    if (this.state.users[i].isViewList == "true") {
      this.setState((state) => {
        state.users[i].isViewList = "false";
        return {
          users: state.users,
        };
      });
    } else {
      this.setState((state) => {
        state.users[i].isViewList = "true";
        return {
          users: state.users,
        };
      });
    }
  };
  onDeleteItem = (i) => (event) => {
    if (this.state.users[i].isDeleteList == "true") {
      this.setState((state) => {
        state.users[i].isDeleteList = "false";
        return {
          users: state.users,
        };
      });
    } else {
      this.setState((state) => {
        state.users[i].isDeleteList = "true";
        return {
          users: state.users,
        };
      });
    }
  };
  removeRbacList() {
    let rbacDataList = [...this.state.rbacDataList];
    rbacDataList.splice(0, rbacDataList.length);
    this.setState({ rbacDataList });
  }
  finalObject(parseObject) {
    let rbacList = [];
    let condtion = false;
    let marked = parseObject;
    this.removeRbacList();
    marked !== undefined &&
      parseObject.forEach((mData) => {
        let modulData = {};
        let createData = {};
        let searchData = {};
        let updateData = {};
        let viewData = {};
        let deleteData = {};

        if (mData.isCreateList == "true") {
          createData.rbacId = mData.createList;
          rbacList.push(createData);
          condtion = true;
        }
        if (mData.isSearchList == "true") {
          searchData.rbacId = mData.searchList;
          rbacList.push(searchData);
          condtion = true;
        }
        if (mData.isUpdateList == "true") {
          updateData.rbacId = mData.updateList;
          rbacList.push(updateData);
          condtion = true;
        }
        if (mData.isViewList == "true") {
          viewData.rbacId = mData.viewList;
          rbacList.push(viewData);
          condtion = true;
        }
        if (mData.isDeleteList == "true") {
          deleteData.rbacId = mData.deleteList;
          rbacList.push(deleteData);
          condtion = true;
        }

        if (condtion == true) {
          modulData.rbacId = mData.moduleId;
          rbacList.push(modulData);
          condtion = false;
        }
      });

    return rbacList;
  }
  createUI() {
    return this.state.users.map((el, i) => (
      <div key={i}>
        <Row>
          <Col md="2" sm="12">
            <span>{el.moduleName || ""}</span>
          </Col>
          <Col md="1" sm="12">
            <Checkbox
              color="primary"
              icon={<Check className="vx-icon" size={16} />}
              onChange={this.onSearchItem(i)}
              checked={el.isSearchList == "true"}
            />{" "}
          </Col>
          <Col md="1" sm="12">
            <Checkbox
              color="primary"
              icon={<Check className="vx-icon" size={16} />}
              onChange={this.onCreateItem(i)}
              checked={el.isCreateList == "true"}
            />
          </Col>
          <Col md="1" sm="12">
            <Checkbox
              color="primary"
              icon={<Check className="vx-icon" size={16} />}
              onChange={this.onUpdateItem(i)}
              checked={el.isUpdateList == "true"}
            />
          </Col>
          <Col md="1" sm="12">
            <Checkbox
              color="primary"
              icon={<Check className="vx-icon" size={16} />}
              onChange={this.onViewItem(i)}
              checked={el.isViewList == "true"}
            />
          </Col>
          <Col md="1" sm="12">
            <Checkbox
              color="primary"
              icon={<Check className="vx-icon" size={16} />}
              onChange={this.onDeleteItem(i)}
              checked={el.isDeleteList == "true"}
            />
          </Col>
        </Row>
      </div>
    ));
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
}
const menuOption = [
  { value: "1", label: "Dashboard 1" },
  { value: "2", label: "Dashboard 2" },
  { value: "3", label: "Dashboard 3" },
  { value: "4", label: "Dashboard 4" },
];

const formValidation = Yup.object().shape({
  roleCode: Yup.string().required("Required"),
  roleName: Yup.string().required("Required"),
  defaultRbacMenuId: Yup.string().required("Required"),
});

export default RoleCreate;
