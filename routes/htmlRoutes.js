var db = require("../models");

module.exports = function (app) {
  
  // Load index page
  app.get("/", function (req, res) {
    res.render("index", {
      msg: "Welcome!"
    });
  });

  app.get("/artist", function (req, res) {
    res.render("artist");
  });

  app.get("/login", function (req, res) {
    res.render("login");
  });

  // Render 404 page for any unmatched routes
  app.get("*", function (req, res) {
    res.render("404");
  });
};
