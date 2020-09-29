import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import Radio from "../../components/@vuexy/radio/RadioVuexy";
import SweetAlert from "react-bootstrap-sweetalert";
import axios from "axios";
import "../../assets/scss/plugins/tables/_agGridStyleOverride.scss";
import "../../assets/scss/pages/users.scss";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../assets/scss/plugins/extensions/toastr.scss";
import Helpers from "./Helpers";

import {
  User,
  Mail,
  Phone,
  Edit,
  Home,
  ChevronsLeft,
  CheckSquare,
  XSquare,
} from "react-feather";

import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Button,
  FormGroup,
  Col,
  Input,
  Row,
} from "reactstrap";

//Default Error Messgae::::::::::::::::::::::::::::::::::::::::::::::::::::
const phoneRegExp = /^((\+\d{1,3}(-| )?\(?\d\)?(-| )?\d{1,3})|(\(?\d{2,3}\)?))(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$/;

const formValidation = Yup.object().shape({
  vendorName: Yup.string()
    .max(100, "Must be 20 characters or less")
    .required("Required"),
  vendorEmail: Yup.string().email("Invalid email address").required("Required"),
  vendorType: Yup.string().required("Required"),
  vendorMobileNo: Yup.string()
    .min(10, "Must be 10 digits")
    .matches(phoneRegExp, "Phone number is not valid")
    .required("Required"),
  vendorCategory: Yup.string().required("Required"),
  vendorAddress: Yup.string().required("Required"),
  vendorCity: Yup.string().required("Required"),
  vendorState: Yup.string().required("Required"),
  vendorPostal: Yup.number().required("Required"),
});
//Default Error Messgae end::::::::::::::::::::::::::::::::::::::::::::::::::::

const ModalConfig = [
  {
    id: 5,
    btnTitle: "Work Assign",
    modalTitle: "Employee Details",
    modalClass: "modal-xl",
    bgColor: "bg-primary",
  },
];

class VendorUpdate extends React.Component {
  constructor() {
    super();
    this.state.isLogged = false;
  }

  state = {
    successAlert: true,
  };

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
  //:::::::::::::::::::::Fetch Data Start:::::::::::::::::::::::::::::::::::::::::::::://
  async componentDidMount() {
    var vendorId = this.props.match.params.vendorId;
    let ress = "";

    await axios
      .post("/maint/vendor/search-byid/", {
        vendorId: vendorId,
      })

      .then((response) => {
        ress = response.data.vendorDetails;
        this.setState({
          vendorId: ress.vendorId,
          vendorType: ress.vendorType,
          vendorName: "Sk",
          vendorEmail: ress.vendorEmail,
          vendorSecMail: ress.vendorSecMail,
          vendorOfficeNo: ress.vendorOfficeNo,
          vendorHomeNo: ress.vendorHomeNo,
          vendorMobileNo: ress.vendorMobileNo,
          vendorCategory: ress.vendorCategory,
          vendorAddress: ress.vendorAddress,
          vendorCity: ress.vendorCity,
          vendorState: ress.vendorState,
          vendorPostal: ress.vendorPostal,
          vendorNotes: ress.vendorNotes,
        });
      });
  }
  //:::::::::::::::::::::Fetch Data End:::::::::::::::::::::::::::::::::::::::::::::://
  render() {
    const { selectedOption } = this.state;
    let option = [];
    let marked = this.state.values;

    const {
      vendorId = "",
      vendorType = "",
      vendorName = "",
      vendorEmail = "",
      vendorSecMail = "",
      vendorOfficeNo = "",
      vendorHomeNo = "",
      vendorMobileNo = "",
      vendorCategory = "",
      vendorAddress = "",
      vendorCity = "",
      vendorState = "",
      vendorPostal = "",
      vendorNotes = "",
    } = this.state;
    return (
      <Card>
        <CardHeader>
          <CardTitle>Update Request</CardTitle>
        </CardHeader>
        <CardBody>
          <Formik
            enableReinitialize
            initialValues={{
              vendorId: vendorId,
              vendorType: vendorType,
              vendorName: vendorName,
              vendorEmail: vendorEmail,
              vendorSecMail: vendorSecMail,
              vendorOfficeNo: vendorOfficeNo,
              vendorHomeNo: vendorHomeNo,
              vendorMobileNo: vendorMobileNo,
              vendorCategory: vendorCategory,
              vendorAddress: vendorAddress,
              vendorCity: vendorCity,
              vendorState: vendorState,
              vendorPostal: vendorPostal,
              vendorNotes: vendorNotes,
            }}
            validationSchema={formValidation}
            //Onsubmit API Call function start////////////////////////////

            onSubmit={(values, actions) => {
              let responseCode = "";

              setTimeout(() => {
                axios({
                  method: "POST",
                  url: "/maint/vendor/update/",

                  data: values,
                })
                  .then((response) => {
                    console.log("Response:::::::::::::" + response.data);

                    responseCode = response.data.responseCode;
                    console.log("Response Code:::::::::::::" + responseCode);
                    if ((responseCode = 1000)) {
                      this.successMessage("successAlert", true);
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
              const { setFieldValue, errors, touched } = props;
              return (
                <Form onSubmit={props.handleSubmit}>
                  <Row>
                    <Col md="6" sm="12">
                      <label htmlFor="vendorName">Full Name</label>
                      <FormGroup className="has-icon-left position-relative">
                        <Field
                          className="form-control"
                          name="vendorName"
                          type="text"
                        />

                        <div className="form-control-position">
                          <User size={15} />
                        </div>
                        <ErrorMessage
                          name="vendorName"
                          component="div"
                          className="field-error text-danger"
                        />
                      </FormGroup>
                    </Col>

                    <Col md="6" sm="12">
                      <label htmlFor="vendorType">Vendor Type</label>

                      <FormGroup className="has-icon-left position-relative">
                        <div className="d-inline-block mr-1">
                          <Radio
                            label="Company"
                            color="primary"
                            name="vendorType"
                            checked={vendorType === "Company"}
                            onChange={() =>
                              setFieldValue("vendorType", "Company")
                            }
                          />
                        </div>
                        <div className="d-inline-block mr-1">
                          <Radio
                            label="Indidual"
                            color="success"
                            name="vendorType"
                            checked={vendorType === "Indidual"}
                            onChange={() =>
                              setFieldValue("vendorType", "Indidual")
                            }
                          />
                        </div>
                        <ErrorMessage
                          name="vendorType"
                          component="div"
                          className="field-error text-danger"
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6" sm="12">
                      <label htmlFor="vendorEmail">Category Type</label>
                      <FormGroup className="has-icon-left position-relative">
                        <Field
                          name="vendorCategory"
                          as="select"
                          className={
                            "form-control" +
                            (errors.title && touched.title ? " is-invalid" : "")
                          }
                        >
                          <option value="">Select..</option>
                          <option value="Plumber">Plumber</option>
                          <option value="Electrician">Electrician</option>
                          <option value="Cleaning">Cleaning</option>
                        </Field>
                        <div className="form-control-position">
                          <Phone />
                        </div>
                        <ErrorMessage
                          name="vendorCategory"
                          component="div"
                          className="field-error text-danger"
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6" sm="12">
                      <label>Primary Email</label>
                      <FormGroup className="has-icon-left position-relative">
                        <Field
                          className="form-control"
                          name="vendorEmail"
                          type="text"
                        />

                        <div className="form-control-position">
                          <Phone size={15} />
                        </div>
                        <ErrorMessage
                          name="vendorEmail"
                          component="div"
                          className="field-error text-danger"
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6" sm="12">
                      <label htmlFor="vendorSecMail">Secondary Email</label>

                      <FormGroup className="has-icon-left position-relative">
                        <Field
                          className="form-control"
                          name="vendorSecMail"
                          type="email"
                        />

                        <div className="form-control-position">
                          <Mail size={15} />
                        </div>
                      </FormGroup>
                    </Col>
                    <Col md="6" sm="12">
                      <label htmlFor="vendorMobileNo">Mobile Number</label>

                      <FormGroup className="has-icon-left position-relative">
                        <Field
                          className="form-control"
                          name="vendorMobileNo"
                          type="number"
                        />

                        <div className="form-control-position">
                          <Mail size={15} />
                        </div>
                        <ErrorMessage
                          name="vendorMobileNo"
                          component="div"
                          className="field-error text-danger"
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6" sm="12">
                      <label htmlFor="vendorOfficeNo">Office Number</label>

                      <FormGroup className="has-icon-left position-relative">
                        <Field
                          className="form-control"
                          name="vendorOfficeNo"
                          type="number"
                        />

                        <div className="form-control-position">
                          <Mail size={15} />
                        </div>
                      </FormGroup>
                    </Col>
                    <Col md="6" sm="12">
                      <label htmlFor="vendorHomeNo">Home Number</label>

                      <FormGroup className="has-icon-left position-relative">
                        <Field
                          className="form-control"
                          name="vendorHomeNo"
                          type="number"
                        />

                        <div className="form-control-position">
                          <Mail size={15} />
                        </div>
                      </FormGroup>
                    </Col>
                    <Col md="6" sm="12">
                      <label htmlFor="vendorAddress">Address</label>

                      <FormGroup className="has-icon-left position-relative">
                        <Field
                          className="form-control"
                          name="vendorAddress"
                          type="text"
                        />

                        <div className="form-control-position">
                          <Home size={15} />
                        </div>
                        <ErrorMessage
                          name="vendorAddress"
                          component="div"
                          className="field-error text-danger"
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6" sm="12">
                      <label htmlFor="vendorCity">City</label>

                      <FormGroup className="has-icon-left position-relative">
                        <Field
                          className="form-control"
                          name="vendorCity"
                          type="text"
                        />

                        <div className="form-control-position">
                          <Home size={15} />
                        </div>
                        <ErrorMessage
                          name="vendorCity"
                          component="div"
                          className="field-error text-danger"
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6" sm="12">
                      <label htmlFor="vendorState">State</label>

                      <FormGroup className="has-icon-left position-relative">
                        <Field
                          className="form-control"
                          name="vendorState"
                          type="text"
                        />

                        <div className="form-control-position">
                          <Home size={15} />
                        </div>
                        <ErrorMessage
                          name="vendorState"
                          component="div"
                          className="field-error text-danger"
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6" sm="12">
                      <label htmlFor="vendorPostal">Postal Code</label>

                      <FormGroup className="has-icon-left position-relative">
                        <Field
                          className="form-control"
                          name="vendorPostal"
                          type="number"
                        />

                        <div className="form-control-position">
                          <Home size={15} />
                        </div>
                        <ErrorMessage
                          name="vendorPostal"
                          component="div"
                          className="field-error text-danger"
                        />
                      </FormGroup>
                    </Col>

                    <Col md="6" sm="12">
                      <label htmlFor="vendorNotes">Notes</label>
                      <FormGroup className="has-icon-left position-relative">
                        <Field
                          name="vendorNotes"
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
                </Form>
              );
            }}
          </Formik>
        </CardBody>
      </Card>
    );
  }
}
export default VendorUpdate;
