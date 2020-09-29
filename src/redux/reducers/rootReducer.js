import { combineReducers } from "redux";
//import calenderReducer from "./calendar/";
import emailReducer from "./email/";
import chatReducer from "./chat/";
import todoReducer from "./todo/";
import customizer from "./customizer/";
import auth from "./auth/";
import navbar from "./navbar/Index";
import manageReducer from "./tenantManagement/";
import dataList from "./data-list/";
import taskReducer from "./maintanance/task/task";

const rootReducer = combineReducers({
  // calendar: calenderReducer,
  emailApp: emailReducer,
  todoApp: todoReducer,
  chatApp: chatReducer,
  customizer: customizer,
  auth: auth,
  navbar: navbar,
  manageApp: manageReducer,
  dataList: dataList,
  task: taskReducer,
});

export default rootReducer;
