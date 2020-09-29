import React from "react";
import { CheckSquare, XSquare } from "react-feather";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../assets/scss/plugins/extensions/toastr.scss";
import Helpers from "./Helpers";
import SweetAlert from "react-bootstrap-sweetalert";
import "../../assets/scss/plugins/tables/_agGridStyleOverride.scss";
import * as appConst from "../../utility/Constants";
import LovList from "../common/Helpers";

import { Beenhere, NoteAdd } from "@material-ui/icons";
import {
  Button,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
  Col,
  Card,
  CardTitle,
  CardBody,
} from "reactstrap";
import Select from "react-select";
import { Multiselect } from "multiselect-react-dropdown";

const formValidation = Yup.object().shape({
  mangeNotes: Yup.string().nullable().required("Required"),
});
const ModalConfig = [
  {
    id: 5,
    btnTitle: "Select Unit",
    modalTitle: "Employee Details",
    modalClass: "modal-xl",
    bgColor: "bg-primary",
  },
];

class ApplicantApproval extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    selectedOption: [],
    statusList: [],
  };

  async componentDidMount() {
    this._isMounted = true;
    this.state.statusList = await LovList.lovList(appConst.statusList);
    var appReqstId = this.props.applicantId;
    var appHdr = "";
    await axios
      .post("/lease/applicant-search-byid/", {
        appReqstId: appReqstId,
      })

      .then((response) => {
        appHdr = response.data.appHdr;
        if (this._isMounted) {
          this.setState({
            applicantStatus: appHdr.applicantStatus,
            mangeNotes: appHdr.remarks,
            appReqstId: appHdr.appReqstId,
          });
        }
      })
      .catch((error) => {
        console.log("error:::" + error);
      });
  }

  render() {
    const {
      mangeNotes = "",
      applicantStatus = "",
      statusList = "",
    } = this.state;
    return (
      <Card>
        <CardBody>
          <Formik
            enableReinitialize
            initialValues={{
              applicantStatus: applicantStatus,
              mangeNotes: mangeNotes,
            }}
            validationSchema={formValidation}
            onSubmit={(values, actions) => {
              let responseCode = "";
              console.log("languages::::::" + this.state.selectedOptions);
              setTimeout(() => {
                let payload = {
                  appHdr: {
                    appReqId: this.props.applicantId,
                    applicantStatus: values.applicantStatus.value,
                    remarks: values.mangeNotes,
                  },
                };
                axios({
                  method: "POST",
                  url: "/lease/applicant-approval/",
                  data: payload,
                })
                  .then((response) => {
                    responseCode = response.data.responseCode;
                    console.log("Response Code:::::::::::::" + responseCode);
                    if (responseCode == 1000) {
                      this.successMessgae("successAlert", true);
                    } else {
                      this.errorMessgae("errorAlert", true);
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
                    <CardTitle>Approval Status</CardTitle>

                    <Col md="12" sm="12">
                      <label>Applicant Status</label>

                      <FormGroup>
                        <Select
                          type="select"
                          name="applicantStatus"
                          options={statusList}
                          value={statusList.find(
                            (obj) => obj.value == applicantStatus
                          )}
                          onChange={(statusList) =>
                            setFieldValue("applicantStatus", statusList)
                          }
                        />
                      </FormGroup>
                    </Col>

                    <Col md="12" sm="12">
                      <label htmlFor="mangeNotes">Management Remarks</label>
                      <FormGroup>
                        <Field
                          name="mangeNotes"
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
                          name="mangeNotes"
                          component="div"
                          className="field-error text-danger"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <hr />
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
                      onClick={Helpers.handleCancel}
                      className="mr-1 mb-1"
                    >
                      <XSquare size={14} />

                      <span className="align-middle ml-25">Cancel</span>
                    </Button.Ripple>
                  </Col>

                  <FormGroup row>
                    <Col md={{ size: 8, offset: 4 }}>
                      {this.state.alert}
                      <ToastContainer />
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
  successMessgae(state, value) {
    const getAlert = () => (
      <SweetAlert
        success
        confirmBtnText="Ok!"
        title="Success"
        show={this.state.successAlert}
        onConfirm={() => Helpers.redirectSearch()}
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
        onConfirm={() => Helpers.redirectSearch()}
      >
        <p className="sweet-alert-text">Request Updated Failed</p>
      </SweetAlert>
    );
    this.setState({
      alert: getAlert(),
    });
  }

  handleChange = (selectedOptions) => {
    let catArray = [];
    selectedOptions.map((o) => catArray.push(o.value));
    console.log("selectedOptions::: " + catArray);
    this.setState({ selectedOptions: catArray });
  };
}

export default ApplicantApproval;
