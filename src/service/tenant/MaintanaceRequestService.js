import axios from "axios";

const MODULE_URL = "tenant/maint";
const API_URL = `${MODULE_URL}`;

class MaintanaceRequestService {
  options = {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("accessToken"),
    },
  };
  updateRequest(maint) {
    //console.log('executed service')
    return axios.post(`/tenant/maint/update/`, maint);
  }

  createRequest(maint) {
    //console.log('executed service')
    return axios.post(`/tenant/maint/create/`, maint);
  }
}

export default new MaintanaceRequestService();
