var db = require("../models");

module.exports = function (app) {
  // Load index page
  app.get("/", function (req, res) {
    // db.Example.findAll({}).then(function(dbExamples) {
    res.render("index", {
      msg: "Welcome!"
      // examples: dbExamples
    });
    // });
  });

  // Load example page and pass in an example by id
  app.get("/example/:id", function (req, res) {
    // db.Example.findOne({ where: { id: req.params.id } }).then(function(dbExample) {
    //   res.render("example", {
    //     example: dbExample
    //   });
    // });
  });

  // Brings us to the artist search page
  // app.get("/artist/:type", function (req, res) {
  //   var newData;
  //   if (req.params && req.params.type) {
  //     newData = {
  //       [req.params.type]: true
  //     };
  //   }
  //   else {
  //     newData = {
  //       artist: true
  //     }
  //   }

 
  //   res.render("artist", newData);
  //   res.render("hotel", newData);
  // });

  app.get("/artist", function (req, res) {
    res.render("artist");
  });

  // Render 404 page for any unmatched routes
  app.get("*", function (req, res) {
    res.render("404");
  });
};
