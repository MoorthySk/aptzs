import React from "react";
import Select from "react-select";
import { history } from "../../history";

const Helpers = {
  handleErrors: function (response) {
    if (!response.ok) throw new Error(response.status);
    return response;
  },
  handleCancel: function () {
    history.push("/propertySearch");
  },
  forceUpdateHandler: function () {
    this.forceUpdate();
  },
  hideAlert: function () {
    history.push("/propertySearch");
  },
  onRadioChange: function (value) {
    this.setState({
      radio: value,
    });
  },

  redirectSearch: function () {
    history.push("/propertySearch");
  },
  handleUnitUpdate: function (unitId) {
    history.push("/propertyUpdate/" + unitId);
  },
  updateId: function (value) {
    alert("value:::" + value);
    return value;
  },
};

export default Helpers;
