import axios from "axios";
const Helpers = {
  lovList: async function (lovParentId) {
    var lovListData = [];
    var data = "";
    await axios
      .post("/admin/lov/search-by-parentid/", {
        lovParentId: lovParentId,
      })
      .then((response) => {
        data = response.data.lovList;
      });
    let marked = data;
    lovListData.splice(0, lovListData.length);
    marked !== undefined &&
      data.forEach((rData) => {
        let lovData = {};
        lovData.value = rData.lovId;
        lovData.label = rData.lovName;
        lovListData.push(lovData);
      });
    return lovListData;
  },
  vendorList: async function () {
    var vendorListData = [];
    var data = "";
    await axios.post("/maint/vendor/search-byall/").then((response) => {
      data = response.data.vendorSearchDtl;
    });
    let marked = data;
    vendorListData.splice(0, vendorListData.length);
    marked !== undefined &&
      data.forEach((rData) => {
        let lovData = {};
        lovData.value = rData.vendorId;
        lovData.label = rData.vendorName;
        vendorListData.push(lovData);
      });
    return vendorListData;
  },
  userList: async function () {
    var userListData = [];
    var data = "";
    await axios({
      method: "POST",
      url: "/admin/user/all-users/",
    }).then((response) => {
      try {
        data = response.data.users;
      } catch (e) {
        console.log(e);
      }
    });

    let marked = data;
    userListData.splice(0, userListData.length);
    marked !== undefined &&
      data.forEach((rData) => {
        let userData = {};
        userData.value = rData.userId;
        userData.label = rData.firstName;
        userData.className = "form-control";
        userListData.push(userData);
      });
    return userListData;
  },
  userListById: async function (userId) {
    var userListData = [];
    var data = "";

    await axios
      .post("/admin/user/user-byid/", {
        userId: userId,
      })
      .then((response) => {
        try {
          data = response.data.user;
        } catch (e) {
          console.log(e);
        }
      });

    let userData = {};
    userData.userId = data.userId;
    userData.loginId = data.loginId;
    userData.middleName = data.middleName;
    userData.firstName = data.firstName;
    userData.lastName = data.lastName;
    userData.emailId = data.emailId;
    userData.mobileNo = data.mobileNo;

    return userData;
  },

  taskCreateUpdate: async function (
    url,
    files,
    refId,
    taskType,
    taskCategory,
    subject,
    issueDescription,
    priority,
    propertyUnitId,
    contactName,
    contactEmail,
    contactMobile
  ) {
    //console.log("Inside the file:"+refId+"-"+taskType+"-"+taskCategory+"-"+subject+"-"+issueDescription+"-"+priority+"-"+propertyUnitId+"-"+contactName+"-"+contactEmail+"-"+contactMobile);
    //const url = "/dms/s3-upload-files/";
    //const url = "/maint/task/maint-task-update/";
    const formData = new FormData();
    var ress = "";

    let data = {
      refId: refId,
    };

    files.map((file) => formData.append("files", file));

    formData.set("taskHdrId", refId);
    formData.set("taskType", taskType);
    formData.set("taskCategory", taskCategory);
    formData.set("subject", subject);
    formData.set("issueDescription", issueDescription);
    formData.set("priority", priority);
    formData.set("propertyUnitId", propertyUnitId);
    formData.set("contactName", contactName);
    formData.set("contactEmail", contactEmail);
    formData.set("contactMobile", contactMobile);

    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    await axios.post(url, formData, config).then((response) => {
      ress = response.data.responseCode;
      console.log("ress " + ress);
    });
    return ress;
  },
  fileUpload: async function (files, refId) {
    console.log("Inside the file");
    const url = "/maint/task/maint-task-update/";
    const formData = new FormData();
    var ress = "";

    let data = {
      refId: refId,
    };

    files.map((file) => formData.append("files", file));
    //formData.append("files", file);
    formData.set("taskHdrId", refId);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    await axios.post(url, formData, config).then((response) => {
      ress = response.data.responseCode;
      console.log("ress " + ress);
    });
    return ress;
  },
  fileViewAll: async function (refId) {
    console.log("Inside the file");
    const url = "/dms/source/pre-signed-urls/";
    const formData = new FormData();
    var ress = {};

    let data = {
      refId: refId,
    };

    formData.set("sourceId", refId);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    await axios.post(url, formData, config).then((response) => {
      ress = response.data.urlDtls;
      console.log("ress " + ress);
    });
    return ress;
  },
};

export default Helpers;
