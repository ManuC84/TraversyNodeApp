const express = require("express");
const router = express.Router();

// login/landing page // res.render renders the views by name // second argument links the layout from layouts

router.get("/", (req, res) => {
  res.render("login", {
    layout: "login",
  });
});
// dashboard

router.get("/dashboard", (req, res) => {
  res.render("dashboard");
});

module.exports = router;
