const initialState = {
  taskData: [],
  taskTimeLine: [],
  routeParam: null,
  filteredTodos: [],
};

const task = (state = initialState, action) => {
  switch (action.type) {
    case "GET_TASK":
      return {
        ...state,
        taskData: action.taskData,
      };
    case "GET_TASK_BY_ID":
      return {
        ...state,
        taskDataById: action.taskDataById,
      };
    case "GET_TASK_SUMMARY":
      return {
        ...state,
        taskDataById: action.taskDataById,
        taskTimeLine: action.taskTimeLine,
      };

    default:
      return state;
  }
};

export default task;
