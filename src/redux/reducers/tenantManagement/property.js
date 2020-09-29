const initialState = {
  unitdetails: "",
  tenantdetails: "",
  unitDetails: "",
};

const property = (state = initialState, action) => {
  switch (action.type) {
    case "GET_UNITS":
      return { ...state, unitdetails: action.unitdetails };

    case "GET_TENANTS":
      return {
        ...state,
        tenantdetails: action.tenantdetails,
        unitDetails: action.unitDetails,
      };
    case "GET_UNIT_DETAILS":
      return { ...state, unitDetails: action.unitDetails };
    default:
      return { ...state };
  }
};
export default property;
