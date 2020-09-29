
import { history } from "../../../history";
const Helpers = {
  handleErrors: function (response) {
    if (!response.ok) throw new Error(response.status);
    return response;
  },
  handleCancel: function () {
    history.push("/lovSearch");
  },
  forceUpdateHandler: function () {
    this.forceUpdate();
  },
  hideAlert: function () {
    history.push("/lovSearch");
  },
  onRadioChange: function (value) {
    this.setState({
      radio: value,
    });
  },
  redirectSearch: function () {
    history.push("/lovSearch");
  },

  handleNewRequest: function () {
    history.push("/lovCreate");
  },
  
};

export default Helpers;
