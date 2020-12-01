const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const exphbs = require("express-handlebars");
const morgan = require("morgan");
const router = require("./routes/index");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const passport = require("passport");
const methodOverride = require("method-override");

const path = require("path");

//load config
dotenv.config({ path: "./config/config.env" });

//passport config
require("./config/passport")(passport);

connectDB();

const app = express();

//body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// method overrride
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      // look in urlencoded POST bodies and delete it
      var method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);

//logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//Handlebards Helpers
const {
  formatDate,
  stripTags,
  truncate,
  editIcon,
  select,
} = require("./helpers/hbs");

//handlebars setup for different extention name
app.engine(
  ".hbs",
  exphbs({
    helpers: { formatDate, stripTags, truncate, editIcon, select },
    defaultLayout: "main",
    extname: ".hbs",
  })
);
app.set("view engine", ".hbs");

//sessions saves session to mongoDb
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//set global var to access user from template
app.use(function (req, res, next) {
  res.locals.user = req.user || null;
  next();
});

//static folder
app.use(express.static(path.join(__dirname, "public")));

//routes
app.use("/", router);
app.use("/auth", require("./routes/auth"));
app.use("/stories", require("./routes/stories"));

const PORT = process.env.PORT || 3000;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
