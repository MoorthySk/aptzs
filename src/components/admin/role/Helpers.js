import React from "react";
import Select from "react-select";
import { history } from "../../../history";
const issueOptions = [
  { value: "Power Issue", label: "Power Issue" },
  { value: "Water Problem", label: "Water Problem" },
  { value: "Payment Issue", label: "Payment Issue" },
  { value: "Cleaning", label: "Cleaning" },
];
const Helpers = {
  handleErrors: function (response) {
    if (!response.ok) throw new Error(response.status);
    return response;
  },
  handleCancel: function () {
    history.push("/roleSearch");
  },
  forceUpdateHandler: function () {
    this.forceUpdate();
  },
  hideAlert: function () {
    history.push("/roleSearch");
  },
  onRadioChange: function (value) {
    this.setState({
      radio: value,
    });
  },

  redirectSearch: function () {
    history.push("/roleSearch");
  },

  handleNewRequest: function () {
    history.push("/roleCreate");
  },
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
};

export default Helpers;
