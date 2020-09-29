import React from "react";
import Select from "react-select";
import { history } from "../../history";

const Helpers = {
  handleErrors: function (response) {
    if (!response.ok) throw new Error(response.status);
    return response;
  },
  handleCancel: function () {
    history.push("/maintSearch");
  },
  forceUpdateHandler: function () {
    this.forceUpdate();
  },
  hideAlert: function () {
    history.push("/maintSearch");
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
        options={FieldProps.options}
        {...FieldProps.field}
        onChange={(categoryOptions) =>
          FieldProps.form.setFieldValue(FieldProps.field.name, categoryOptions)
        }
      />
    );
  },
  redirectSearch: function () {
    history.push("/maintSearch");
  },
};

export default Helpers;
