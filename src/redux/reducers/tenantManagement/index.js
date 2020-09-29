import { combineReducers } from "redux";
import property from "./property";

const manageReducer = combineReducers({
  property,
});

export default manageReducer;
