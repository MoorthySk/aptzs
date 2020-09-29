import { history } from "../../history";

const Helpers = {
  handleErrors: function (response) {
    if (!response.ok) throw new Error(response.status);
    return response;
  },
  handleCancel: function () {
    history.push("/leaseSearch");
  },
  handleCancelRenewal: function () {
    history.push("/renewal");
  },
  forceUpdateHandler: function () {
    this.forceUpdate();
  },
  hideAlert: function () {
    history.push("/leaseSearch");
  },
  redirectSearch: function () {
    history.push("/leaseSearch");
  },
  redirectRenewalSearch: function () {
    history.push("/renewal");
  },
};

export default Helpers;
