import axios from "axios";
import { history } from "../../../history";

export const getTodos = (routeParams) => {
  console.log(routeParams);
  return async (dispatch) => {
    await axios
      .post("/app/todo/search-all/")
      //.get("api/apps/todo", {
      // params: routeParams,
      //})
      .then((result) => {
        console.log(result.data);

        dispatch({
          type: "GET_TODOS",
          todos: result.data.toDoInfo,
          //todos: result.data,
          routeParams,
        });
      })
      .catch((err) => console.log(err));
  };
};
export const completeTask = (todo, status) => {
  console.log("todo " + todo.isCompleted);
  console.log("status " + status);
  let payload = {
    id: todo.id,
    isCompleted: status,
  };
  const request = axios.post("/app/todo/update/", payload);
  return (dispatch) => {
    dispatch({ type: "COMPLETE_TASK", id: todo.id, value: todo.isCompleted });
  };
};

export const starTask = (todo) => {
  return (dispatch) => {
    Promise.all([
      dispatch({ type: "STAR_TASK", id: todo.id, value: todo.isStarred }),
    ]);
  };
};

export const importantTask = (todo) => {
  return (dispatch) => {
    Promise.all([
      dispatch({
        type: "IMPORTANT_TASK",
        id: todo.id,
        value: todo.isImportant,
      }),
    ]);
  };
};

export const trashTask = (id) => {
  return (dispatch, getState) => {
    const params = getState().todoApp.todo.routeParam;
    axios
      .post("/api/app/todo/trash-todo", id)
      .then((response) => dispatch({ type: "TRASH_TASK", id }))
      .then(dispatch(getTodos(params)));
  };
};

export const updateTodo = (id, title, desc) => {
  let payload = {
    id: id,
    title: title,
    desc: desc,
  };
  const request = axios.post("/app/todo/update/", payload);
  return (dispatch, getState) => {
    const params = getState().todoApp.todo.routeParam;
    request.then((response) => {
      Promise.all([
        dispatch({ type: "UPDATE_TASK", id, title, desc }),
      ]).then(() => dispatch(getTodos(params)));
    });
  };
};

export const updateTask = (id, title, desc) => {
  console.log("id " + id);
  return (dispatch) => {
    dispatch({ type: "UPDATE_TASK", id, title, desc });
  };
};

export const updateLabel = (id, label) => {
  return (dispatch, getState) => {
    dispatch({ type: "UPDATE_LABEL", label, id });
  };
};

export const addNewTask = (task) => {
  return (dispatch, getState) => {
    const params = getState().todoApp.todo.routeParam;

    var arr = task.tags;
    var str1 = arr.toString();

    let payload = {
      title: task.title,
      desc: task.desc,
      tags: str1,
      isCompleted: task.isCompleted,
      isImportant: task.isImportant,
      isStarred: task.isStarred,
    };
    axios({
      method: "POST",
      url: "/app/todo/create/",
      data: payload,
    }).then((response) => {
      console.log(response.data.responseCode);
      dispatch({ type: "ADD_TASK", task });
      dispatch(getTodos(params));
    });
  };
};

export const searchTask = (val) => {
  return (dispatch) => {
    dispatch({
      type: "SEARCH_TASK",
      val,
    });
  };
};

export const changeFilter = (filter) => {
  return (dispatch) => {
    dispatch({ type: "CHANGE_FILTER", filter });
    history.push(`/todo/${filter}`);
    dispatch(getTodos({ filter }));
  };
};
