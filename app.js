const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const exphbs = require("express-handlebars");
const morgan = require("morgan");
const router = require("./routes/index");
const session = require("express-session");
const passport = require("passport");

const path = require("path");

//load config
dotenv.config({ path: "./config/config.env" });

//passport config
require("./config/passport")(passport);

connectDB();

const app = express();

//logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//handlebars setup for different extention name
app.engine(".hbs", exphbs({ defaultLayout: "main", extname: ".hbs" }));
app.set("view engine", ".hbs");

//sessions
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
  })
);

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//static folder
app.use(express.static(path.join(__dirname, "public")));

//routes
app.use("/", router);
app.use("/auth", require("./routes/auth"));

const PORT = process.env.PORT || 3000;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
