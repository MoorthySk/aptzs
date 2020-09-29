
import { history } from "../../../history";
const Helpers = {
  handleErrors: function (response) {
    if (!response.ok) throw new Error(response.status);
    return response;
  },
  handleCancel: function () {
    history.push("/userSearch");
  },
  forceUpdateHandler: function () {
    this.forceUpdate();
  },
  hideAlert: function () {
    history.push("/userSearch");
  },
  onRadioChange: function (value) {
    this.setState({
      radio: value,
    });
  },
  redirectSearch: function () {
    history.push("/userSearch");
  },

  handleNewRequest: function () {
    history.push("/userCreate");
  },
  
};

export default Helpers;
