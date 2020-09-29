import axios from "axios";

export const getTask = () => {
  return async (dispatch) => {
    await axios
      .post("/maint/task/maint-taskseach-all/")
      .then((response) => {
        console.log("Redux response " + response.data);

        dispatch({
          type: "GET_TASK",
          taskData: response.data.taskList,
        });
      })
      .catch((err) => console.log(err));
  };
};
export const getTaskById = (taskId) => {
  return async (dispatch) => {
    await axios
      .post("/maint/task/task-search-byid/", {
        taskHdrId: taskId,
      })
      .then((response) => {
        console.log("Redux response " + response.data);

        dispatch({
          type: "GET_TASK_BY_ID",
          taskDataById: response.data.taskHdr,
        });
      })
      .catch((err) => console.log(err));
  };
};
export const getSummary = (taskId) => {
  return async (dispatch) => {
    await axios
      .post("/maint/task/maint-search-byid/", {
        taskHdrId: taskId,
      })
      .then((response) => {
        console.log("Redux response " + response.data);

        dispatch({
          type: "GET_TASK_SUMMARY",
          taskDataById: response.data.taskHdr,
          taskTimeLine: response.data.taskDtlList,
        });
      })
      .catch((err) => console.log(err));
  };
};
