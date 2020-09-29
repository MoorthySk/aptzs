const express = require("express");
const cors = require("cors");
var bodyParser = require("body-parser");
var session = require("express-session");
var cookieParser = require("cookie-parser");

// Import Files
const router = require("./router");
const config = require("./utility/config");
const adminRouter = require("./router/admin");

var app = express();
app.use(cookieParser());
app.use(
  session({
    name: "SESSION",
    resave: false,
    saveUninitialized: true,
    secret: "12541see",
    cookie: {
      maxAge: 36000,
      // this may need to be false is you are accessing from another React app
      httpOnly: true, // this must be false if you want to access the cookie
    },
  })
);
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(cors);
app.use(bodyParser.json());
app.use((req, res, next) => {
  console.log("Session " + JSON.stringify(req.session));
  next();
});
app.use("/", router);
app.use("/admin", adminRouter);

app.listen(config.port, () => {
  console.log("Expres Server Started & Listen Port : " + config.port);
});
