import React from "react";
import Select from "react-select";
import { history } from "../../history";

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
    history.push("/taskSearch");
  },
  forceUpdateHandler: function () {
    this.forceUpdate();
  },
  hideAlert: function () {
    history.push("/taskSearch");
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
        defaultValue={FieldProps[0]}
        options={FieldProps.options}
        {...FieldProps.field}
        onChange={(categoryTypeList) =>
          FieldProps.form.setFieldValue(FieldProps.field.name, categoryTypeList)
        }
      />
    );
  },
  redirectSearch: function () {
    history.push("/taskSearch");
  },
  reoccuringCancel: function () {
    history.push("/reoccurenceSearch");
  },
};

export default Helpers;
