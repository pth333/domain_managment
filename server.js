const express = require("express");
const session = require("express-session");
const passport = require("passport");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const crypto = require("crypto");
require("./app/config/passport.js");

const app = express();
app.use(morgan("combined"));

// const allowedDomains = [
//   "http://localhost:5173",
//   "https://dm.adful.io",
//   "https://dm-api.adful.io",
// ];

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin || allowedDomains.indexOf(origin) !== -1) {
//         // Nếu origin là undefined (trong trường hợp truy cập từ cùng một domain) hoặc nằm trong danh sách allowedDomains
//         callback(null, true);
//       } else {
//         // Nếu domain không được phép
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const secret = crypto.randomBytes(64).toString("hex");


// Thiết lập session
app.use(
  session({
    secret: secret,
    resave: false,
    saveUninitialized: true,
  })
);
// Khởi động passport
app.use(passport.initialize());
app.use(passport.session());

const db = require("./app/models");

db.sequelize
  .sync()
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

require("./app/routes/domain.routes.js")(app);
require("./app/routes/auth.routes.js")(app);
require("./app/routes/authGg.route.js")(app);
require("./app/routes/dashboard.routes.js")(app);

const PORT = process.env.PORT || 8082;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
