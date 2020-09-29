import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import ManageRequestService from "../../service/management/ManageRequestService";
import Radio from "../../components/@vuexy/radio/RadioVuexy";
import SweetAlert from "react-bootstrap-sweetalert";
import { CheckSquare, XSquare, ChevronsLeft } from "react-feather";
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
  Filed,
  CustomInput,
} from "reactstrap";

import {
  User,
  Mail,
  Phone,
  Calendar,
  FileText,
  Edit,
  ArrowDown,
  ChevronsDown,
  Home,
  MoreVertical,
} from "react-feather";
//Importv End::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

const issueOptions = [
  { value: "1", label: "Power Issue" },
  { value: "2", label: "Water Problem" },
  { value: "3", label: "Payment Issue" },
  { value: "4", label: "Cleaning" },
];

//Default Error Messgae::::::::::::::::::::::::::::::::::::::::::::::::::::
const phoneRegExp = /^((\+\d{1,3}(-| )?\(?\d\)?(-| )?\d{1,3})|(\(?\d{2,3}\)?))(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$/;

const formValidation = Yup.object().shape({
  employeeName: Yup.string()
    .max(20, "Must be 20 characters or less")
    .required("Required"),
  employeeAddress: Yup.string()
    .max(200, "Must be 20 characters or less")
    .required("Required"),

  employeeEmail: Yup.string()
    .email("Invalid email address")
    .required("Required"),
  employeePhone: Yup.string()
    .matches(phoneRegExp, "Phone number is not valid")
    .required("Required"),
  empRemarks: Yup.string().required("Required"),
  workTypeId: Yup.string().required("Required"),
  yearOfExp: Yup.string().required("Required"),
  vendorId: Yup.string().required("Required"),
});

//Default Error Messgae end::::::::::::::::::::::::::::::::::::::::::::::::::::

function SelectField(FieldProps) {
  return (
    <Select
      isClearable={true}
      defaultValue={issueOptions[0]}
      options={FieldProps.options}
      {...FieldProps.field}
      onChange={(issueOptions) =>
        FieldProps.form.setFieldValue(FieldProps.field.name, issueOptions)
      }
    />
  );
}

class UserCreate extends React.Component {
  handleCancel = () => {
    this.props.history.push("/empSearch");
  };
  state = {
    successAlert: true,
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
        <p className="sweet-alert-text">Request Sussessfully Added</p>
      </SweetAlert>
    );
    this.setState({
      alert: getAlert(),
    });
  }
  hideAlert() {
    this.props.history.push("/empSearch");
    this.setState({
      alert: null,
    });
  }
  render() {
    const { getAlert, state } = this.state;

    return (
      <Card>
        <CardHeader>
          <CardTitle>Employee Request</CardTitle>
        </CardHeader>
        <CardBody>
          <Formik
            initialValues={{
              employeeName: "",
              employeePhone: "",
              employeeEmail: "",
              employeeAddress: "",
              empRemarks: "",
              workTypeId: "",
              vendorId: "",
              yearOfExp: "",
            }}
            validationSchema={formValidation}
            //Onsubmit API Call function start////////////////////////////
            onSubmit={(values, actions) => {
              setTimeout(() => {
                ManageRequestService.createRequest(values).then((response) =>
                  this.setState({
                    description: response.data.description,
                  })
                );
                console.log(values);

                // alert(JSON.stringify(values, null, 2));
                this.successMessgae("successAlert", true);
                actions.setSubmitting(false);
              }, 1000);
            }}
            //Onsubmit API Call function End////////////////////////////
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
                  <Row>
                    <Col md="6" sm="12">
                      <label htmlFor="contactPersonNumber">Employee Name</label>
                      <FormGroup className="has-icon-left position-relative">
                        <Field
                          className="form-control"
                          name="employeeName"
                          type="text"
                        />

                        <div className="form-control-position">
                          <User size={15} />
                        </div>
                        <ErrorMessage
                          name="employeeName"
                          component="div"
                          className="field-error text-danger"
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6" sm="12">
                      <label htmlFor="employeePhone">Employee Phone</label>
                      <FormGroup className="has-icon-left position-relative">
                        <Field
                          className="form-control"
                          name="employeePhone"
                          type="text"
                        />

                        <div className="form-control-position">
                          <Phone size={15} />
                        </div>
                        <ErrorMessage
                          name="employeePhone"
                          component="div"
                          className="field-error text-danger"
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6" sm="12">
                      <label htmlFor="employeeEmail">Employee Email</label>

                      <FormGroup className="has-icon-left position-relative">
                        <Field
                          className="form-control"
                          name="employeeEmail"
                          type="text"
                        />

                        <div className="form-control-position">
                          <Mail size={15} />
                        </div>
                        <ErrorMessage
                          name="employeeEmail"
                          component="div"
                          className="field-error text-danger"
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6" sm="12">
                      <label htmlFor="employeeAddress">Employee Address</label>

                      <FormGroup className="has-icon-left position-relative">
                        <Field
                          className="form-control"
                          name="employeeAddress"
                          type="text"
                        />

                        <div className="form-control-position">
                          <Home size={15} />
                        </div>
                        <ErrorMessage
                          name="employeeAddress"
                          component="div"
                          className="field-error text-danger"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="6" sm="12">
                      <label htmlFor="workTypeId">Work Type</label>

                      <FormGroup className="has-icon-left position-relative">
                        <Field
                          name="workTypeId"
                          as="select"
                          className={
                            "form-control" +
                            (errors.title && touched.title ? " is-invalid" : "")
                          }
                        >
                          <option value="">select</option>
                          <option value="1">Electronics</option>
                          <option value="2">Maintanance</option>
                          <option value="3">Electrical</option>
                        </Field>
                        <div className="form-control-position">
                          <ArrowDown size={15} />
                        </div>
                        <ErrorMessage
                          name="workTypeId"
                          component="div"
                          className="field-error text-danger"
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6" sm="12">
                      <label htmlFor="contactPersonNumber">Vendor Name</label>

                      <FormGroup className="has-icon-left position-relative">
                        <Field
                          name="vendorId"
                          as="select"
                          className={
                            "form-control" +
                            (errors.title && touched.title ? " is-invalid" : "")
                          }
                        >
                          <option value="">select</option>
                          <option value="1">ABC Private Ltd</option>
                          <option value="2">Mars </option>
                          <option value="3">Earth</option>
                        </Field>
                        <div className="form-control-position">
                          <ArrowDown size={15} />
                        </div>
                        <ErrorMessage
                          name="vendorId"
                          component="div"
                          className="field-error text-danger"
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6" sm="12">
                      <label htmlFor="employeeAddress">Year Of Exp</label>

                      <FormGroup className="has-icon-left position-relative">
                        <Field
                          className="form-control"
                          name="yearOfExp"
                          type="text"
                        />

                        <div className="form-control-position">
                          <Home size={15} />
                        </div>
                        <ErrorMessage
                          name="yearOfExp"
                          component="div"
                          className="field-error text-danger"
                        />
                      </FormGroup>
                    </Col>

                    <Col md="12" sm="12">
                      <label htmlFor="mangRemarks">Emplayee Remarks</label>
                      <FormGroup className="has-icon-left position-relative">
                        <Field
                          name="empRemarks"
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
                        <div className="form-control-position">
                          <Edit size={15} />
                        </div>
                        <ErrorMessage
                          name="empRemarks"
                          component="div"
                          className="field-error text-danger"
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6" sm="12">
                      <FormGroup>
                        <label htmlFor="mangRemarks">Active Status</label>
                        <CardBody>
                          <CustomInput
                            type="radio"
                            id="record_status"
                            name="record_status"
                            inline
                            label="Active"
                            defaultChecked
                          />
                          <CustomInput
                            type="radio"
                            id="record_status1"
                            name="record_status"
                            inline
                            label="Inactive"
                          />

                          <ErrorMessage
                            name="record_status"
                            component="div"
                            className="field-error text-danger"
                          />
                        </CardBody>
                      </FormGroup>
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
}
export default UserCreate;
