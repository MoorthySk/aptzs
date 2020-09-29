import URLSearchParams from "url-search-params";
const request = async (options) => {
  const headers = new Headers({
    "Content-Type": "application/x-www-form-urlencoded",
    "Access-Control-Allow-Origin": "http://localhost:4000",
  });
  headers.append("Authorization", "Basic Z3JlZW5sZWFmOmFzdHJvbmV0");
  const defaults = { headers: headers };
  options = Object.assign({}, defaults, options);
  const response = await fetch(options.url, options);
  if (response.status == 400) {
    return response.status;
  }
  const json = await response.json();
  if (!response.ok) {
    return Promise.reject(json);
  } else {
  }
  localStorage.setItem("accessToken", json.access_token);
  return json;
};
class AuthenticationService {
  createRequest(logindtl) {
    const searchParams = new URLSearchParams();
    searchParams.append("grant_type", logindtl.grant_type);
    searchParams.append("username", logindtl.username);
    searchParams.append("password", logindtl.password);
    localStorage.clear();
    return request({
      url: "http://localhost:8080/oauth/token",
      method: "POST",
      credentials: "same-origin",
      beforeSend: function (xhr) {
        xhr.setRequestHeader("Authorization", "Basic Z3JlZW5sZWFmOmFzdHJvbmV0");
        xhr.setRequestHeader(
          "Access-Control-Allow-Origin",
          "http://localhost:4000"
        );
      },
      body: searchParams,
    });
  }
}
export default new AuthenticationService();
