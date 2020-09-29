const request = async (options) => {
  const headers = new Headers({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "http://localhost:4000",
  });
  if (localStorage.getItem("accessToken")) {
    headers.append(
      "Authorization",
      "Bearer " + localStorage.getItem("accessToken")
    );
  }
  const defaults = { headers: headers };
  options = Object.assign({}, defaults, options);

  const response = await fetch(options.url, options);
  const json = await response.json();
  if (!response.ok) {
    return Promise.reject(json);
  } else {
  }
  return json;
};
class LoginService {
  loginRequest(logindtl) {
    return request({
      url: "http://mark1.aptzs.com:8080/admin/login/",
      method: "post",
      credentials: "same-origin",
      body: JSON.stringify(logindtl),
    });
  }
  logoutRequest() {
    console.log("inside logout...");
    localStorage.clear();
    return request({
      url: "http://mark1.aptzs.com:8080/admin/logout-request/",
      method: "POST",

      credentials: "same-origin",
      body: "",
    });
  }
}
export default new LoginService();
