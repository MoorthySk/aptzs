import React from "react";
import Select from "react-select";
import { history } from "../../history";

const issueOptions = [
  { value: "1", label: "Power Issue" },
  { value: "2", label: "Water Problem" },
  { value: "3", label: "Payment Issue" },
  { value: "4", label: "Cleaning" },
];
const Helpers = {
  handleErrors: function (response) {
    if (!response.ok) throw new Error(response.status);
    return response;
  },
  handleCancel: function () {
    history.push("/tenantSearch");
  },
  preAppCancel: function () {
    history.push("/preApplicantSearch");
  },
  forceUpdateHandler: function () {
    this.forceUpdate();
  },
  hideAlert: function () {
    history.push("/tenantSearch");
  },
  onRadioChange: function (value) {
    this.setState({
      radio: value,
    });
  },

  //Add Page Script
  SelectField: function (FieldProps) {
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
  },
  redirectSearch: function () {
    history.push("/tenantSearch");
  },

  updateId: function (value) {
    alert("value:::" + value);
    return value;
  },
};

export default Helpers;
