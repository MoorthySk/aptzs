import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { ArrowLeftCircle } from "react-feather";
import axios from "axios";
import "react-toggle/style.css";
import "../../../assets/scss/plugins/forms/switch/react-toggle.scss";
import Helpers from "./Helpers";
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
class RoleView extends React.Component {
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
      <Formik>
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
            <Form>
              <Card>
                <CardBody>
                  <CardTitle>Role Creation</CardTitle>
                  <Row>
                    <Col md="6" sm="12">
                      <FormGroup>
                        <h6>Role Code</h6>
                        <label>{this.state.roleCode}</label>
                      </FormGroup>
                    </Col>
                    <Col md="6" sm="12">
                      <FormGroup>
                        <h6>Role Name</h6>
                        <label>{this.state.roleName}</label>
                      </FormGroup>
                    </Col>
                    <Col md="6" sm="12">
                      <h6>Default Menu</h6>
                      <label></label>
                    </Col>
                    <Col md="6" sm="12">
                      <FormGroup>
                        <h6>Active Status</h6>
                        <label>{this.state.roleCode}</label>
                      </FormGroup>
                    </Col>

                    <Col md="6" sm="12">
                      <FormGroup>
                        <h6>Remarks</h6>
                        <label>{this.state.roleRemarks}</label>
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
                    <Button.Ripple
                      color="danger"
                      onClick={Helpers.handleCancel}
                      className="mr-1 mb-1"
                    >
                      <ArrowLeftCircle size={14} />
                      <span className="align-middle ml-25">Back</span>
                    </Button.Ripple>
                  </FormGroup>
                </CardBody>
              </Card>
            </Form>
          );
        }}
      </Formik>
    );
  }

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
              checked={el.isSearchList == "true"}
              disabled
            />{" "}
          </Col>
          <Col md="1" sm="12">
            <Checkbox
              color="primary"
              icon={<Check className="vx-icon" size={16} />}
              checked={el.isCreateList == "true"}
              disabled
            />
          </Col>
          <Col md="1" sm="12">
            <Checkbox
              color="primary"
              icon={<Check className="vx-icon" size={16} />}
              checked={el.isUpdateList == "true"}
              disabled
            />
          </Col>
          <Col md="1" sm="12">
            <Checkbox
              color="primary"
              icon={<Check className="vx-icon" size={16} />}
              checked={el.isViewList == "true"}
              disabled
            />
          </Col>
          <Col md="1" sm="12">
            <Checkbox
              color="primary"
              icon={<Check className="vx-icon" size={16} />}
              checked={el.isDeleteList == "true"}
              disabled
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
}
export default RoleView;
