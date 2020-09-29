import React from "react";
import Select from "react-select";
import { history } from "../../history";

const Helpers = {
  handleErrors: function (response) {
    if (!response.ok) throw new Error(response.status);
    return response;
  },
  handleCancel: function () {
    history.push("/vendorSearch");
  },
  forceUpdateHandler: function () {
    this.forceUpdate();
  },
  hideAlert: function () {
    history.push("/vendorSearch");
  },
  onRadioChange: function (value) {
    this.setState({
      radio: value,
    });
  },

  redirectSearch: function () {
    history.push("/vendorSearch");
  },
};

export default Helpers;
