import axios from "axios";

const MODULE_URL = "manage/employee";
const API_URL = `${MODULE_URL}`;

class MaintanaceRequestService {
  updateRequest(empData) {
    //console.log('executed service')
    return axios.post(`/manag/employee/update/`, empData);
  }

  createRequest(empData) {
    //console.log('executed service')
    return axios.post(`/manag/employee/create/`, empData);
  }
}

export default new MaintanaceRequestService();
