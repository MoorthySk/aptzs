import axios from "axios";

export const getUnits = () => {
  return (dispatch) => {
    axios
      .post("/rentals/property/search-all/")
      .then((response) => {
        dispatch({
          type: "GET_UNITS",
          unitdetails: response.data.propUnitDtls,
        });
      })
      .catch((err) => console.log(err));
  };
};

export const getTenant = (appReqstId) => {
  return (dispatch) => {
    axios
      .post("/lease/app-search-byid/", {
        appReqstId: appReqstId,
      })
      .then((response1) => {
        let unitid = response1.data.appInfo.proptyUnitId;
        console.log("dispatch call" + unitid);
        axios

          .post("/rentals/property/search-byunitid/", {
            proptyUnitId: unitid,
          })
          .then((response2) => {
            dispatch({
              type: "GET_TENANTS",
              tenantdetails: response1.data.appInfo,
              unitDetails: response2.data.unitDetails,
            });
          });
      })
      .catch((err) => console.log(err));
  };
};

export const getUnitDetails = (unitId) => {
  console.log("index unit id::::::::: " + unitId);
  return (dispatch) => {
    axios
      .post("/rentals/property/search-byunitid/", {
        proptyUnitId: unitId,
      })
      .then((response) => {
        dispatch({
          type: "GET_UNIT_DETAILS",
          unitDetails: response.data.unitDetails,
        });
      })
      .catch((err) => console.log(err));
  };
};
