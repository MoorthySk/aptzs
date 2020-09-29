import React from "react";
import axios from "axios";

const RbacList = {
  rbacCheck: async function (actionName, actionButton) {
    var actionValue = false;
    var value = "";
    try {
      await axios
        .post("/admin/role/rback-listmaping/", {
          roleId: localStorage.getItem("roleId"),
        })
        .then((response) => {
          value = response.data.AllMenu;
        });
      console.log("value::::::::::::" + value);
      var indexVal = value.findIndex((obj) => obj.rbacName == actionName);
      for (var i = 0; i < value.length; i++) {
        var priviData = value[indexVal]["rbacPrivilege"];
      }
      let marked = priviData;
      marked !== undefined &&
        priviData.forEach((rData) => {
          var actionMenu = rData.rbacName.replace(/\s/g, "");
          var actionRender = actionButton.replace(/\s/g, "");

          if (actionMenu == actionRender) {
            actionValue = true;
          }
        });
    } catch (error) {
      console.log("Error : " + error);
      actionValue = false;
    }

    return actionValue;
  },
  rbacMenuList: function () {
    var roleName = localStorage.getItem("roleName");
    axios
      .post("/admin/role/rback-listmaping/", {
        roleId: localStorage.getItem("roleId"),
      })
      .then((response) => {
        let marked = response.data.AllMenu;
        marked !== undefined &&
          response.data.AllMenu.forEach((mData) => {
            var actionName = mData.rbacName.replace(/\s/g, "");
            if (actionName == "UserMaster" && mData.isMapped == "1") {
              localStorage.setItem("UserMaster", roleName);
            } else if (actionName == "RoleMaster" && mData.isMapped == "1") {
              localStorage.setItem("RoleMaster", roleName);
            } else if (actionName == "LovMaster" && mData.isMapped == "1") {
              localStorage.setItem("LovMaster", roleName);
            }
          });
      });
  },
};

export default RbacList;
