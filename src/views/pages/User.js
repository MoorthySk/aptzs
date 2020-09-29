import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  FormGroup,
  Button,
  Label,
  Row,
  Col,
  Input,
} from "reactstrap";

import { User, Mail, Phone, Calendar } from "react-feather";

import { Formik, Field, Form } from "formik";
import * as Yup from "yup";

const formSchema = Yup.object().shape({
  firstName: Yup.string().required("Required"),
  lastName: Yup.string().required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  mobileNumber: Yup.number().required("Required"),
  url: Yup.string().url().required("Required"),
  date: Yup.date().required("Required"),
  address: Yup.string().required("Required"),
  maxlength: Yup.string().max(5, "Too Long!").required("Required"),
});

class UserAdd extends React.Component {
  render() {
    return (
      <Card>
        <CardHeader>
          <CardTitle> User Master</CardTitle>
        </CardHeader>
        <CardBody>
          <Formik
            initialValues={{
              required: "",
              email: "",
              lastName: "",
              mobileNumber: "",
              date: "",
              address: "",
              maxlength: "",
              firstName: "",
            }}
            validationSchema={formSchema}
          >
            {({ errors, touched }) => (
              <Form className="mt-2">
                <Row>
                  <Col md="6" sm="12">
                    <Label for="nameVerticalIcons">First Name</Label>
                    <FormGroup className="has-icon-left position-relative">
                      <Input
                        type="text"
                        name="firstName"
                        id="firstName"
                        placeholder="First Name"
                        className={`form-control ${
                          errors.firstName && touched.firstName && "is-invalid"
                        }`}
                      />
                      <div className="form-control-position">
                        <User size={15} />
                      </div>
                      {errors.firstName && touched.firstName ? (
                        <div className="invalid-tooltip mt-25">
                          {errors.firstName}
                        </div>
                      ) : null}
                    </FormGroup>
                  </Col>
                  <Col md="6" sm="12">
                    <Label for="nameVerticalIcons">Last Name</Label>
                    <FormGroup className="has-icon-left position-relative">
                      <Field
                        type="text"
                        name="lastName"
                        id="lastName"
                        placeholder="Last Name"
                        className={`form-control ${
                          errors.lastName && touched.lastName && "is-invalid"
                        }`}
                      />
                      <div className="form-control-position">
                        <User size={15} />
                      </div>
                      {errors.lastName && touched.lastName ? (
                        <div className="invalid-tooltip mt-25">
                          {errors.lastName}
                        </div>
                      ) : null}
                    </FormGroup>
                  </Col>
                  <Col md="6" sm="12">
                    <Label for="emailVerticalIcons">Email</Label>
                    <FormGroup className="has-icon-left position-relative">
                      <Field
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Email"
                        className={`form-control ${
                          errors.email && touched.email && "is-invalid"
                        }`}
                      />
                      <div className="form-control-position">
                        <Mail size={15} />
                      </div>
                      {errors.email && touched.email ? (
                        <div className="invalid-tooltip mt-25">
                          {errors.email}
                        </div>
                      ) : null}
                    </FormGroup>
                  </Col>

                  <Col md="6" sm="12">
                    <Label for="phoneVerticalIcons">Mobile Number</Label>
                    <FormGroup className="has-icon-left position-relative">
                      <input
                        type="number"
                        name="mobileNumber"
                        id="mobileNumber"
                        placeholder="Mobile Number"
                        className={`form-control ${
                          errors.mobileNumber &&
                          touched.mobileNumber &&
                          "is-invalid"
                        }`}
                      />
                      <div className="form-control-position">
                        <Phone size={15} />
                      </div>
                      {errors.mobileNumber && touched.mobileNumber ? (
                        <div className="invalid-tooltip mt-25">
                          {errors.mobileNumber}
                        </div>
                      ) : null}
                    </FormGroup>
                  </Col>
                  <Col md="6" sm="12">
                    <Label for="phoneVerticalIcons">Date</Label>
                    <FormGroup className="has-icon-left position-relative">
                      <Field
                        type="date"
                        name="date"
                        id="date"
                        placeholder="Date"
                        className={`form-control ${
                          errors.date && touched.date && "is-invalid"
                        }`}
                      />
                      <div className="form-control-position">
                        <Calendar size={15} />
                      </div>
                      {errors.date && touched.date ? (
                        <div className="invalid-tooltip mt-25">
                          {errors.date}
                        </div>
                      ) : null}
                    </FormGroup>
                  </Col>
                  <Col md="6" sm="12">
                    <Label for="phoneVerticalIcons">Address</Label>
                    <FormGroup className="has-icon-left position-relative">
                      <Field
                        type="teaxtarea"
                        name="address"
                        id="address"
                        placeholder="address"
                        className={`form-control ${
                          errors.address && touched.address && "is-invalid"
                        }`}
                      />
                      <div className="form-control-position">
                        <Mail size={15} />
                      </div>
                      {errors.date && touched.address ? (
                        <div className="invalid-tooltip mt-25">
                          {errors.address}
                        </div>
                      ) : null}
                    </FormGroup>
                  </Col>
                </Row>
                <Button.Ripple color="primary" type="submit">
                  Submit
                </Button.Ripple>
              </Form>
            )}
          </Formik>
        </CardBody>
      </Card>
    );
  }
}
export default UserAdd;
