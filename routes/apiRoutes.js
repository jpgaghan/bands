var db = require("../models");
var moment = require("moment");
var keys = require("../keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var fetchUrl = require("fetch").fetchUrl;
var state;

module.exports = function(app) {
  // Get all examples
  app.post("/state", function(req, res) {
    state = req.body.sloc;
  });

  app.get("/api/examples", function(req, res) {
    db.Example.findAll({}).then(function(dbExamples) {
      res.json(dbExamples);
    });
  });

  // Create a new example
  app.post("/api/examples", function(req, res) {
    db.Users.create(req.body).then(function(dbExample) {
      res.json(dbExample);
    });
  });

  app.post("/newuser", function (req,res) {
    db.Users.create(req.body).then((userInfo) => {});
  });

  app.post("/newconcert", (req,res) => {
    db.Concerts.create(req.body).then((userinfo)=>{console.log(userinfo)})
  });

  app.post("/band/image", function(req,res) {
    band = req.body
    console.log(band)
    spotify.search({ type: 'artist', query: req.body.bandname, limit: 1 }, function (err, data) {
      if (err) {
          return console.log('Error occurred: ' + err);
      }
      var artistPic = data.artists.items[0].images[1].url
      res.json(artistPic)
    });
  });
  
  /**
   * YELP API Request
   */
  app.post("/restaurants", function(req,res) {
    var options = {
      headers: {
          "authorization": process.env.YELP_API_TOKEN
      }
    }
    const {city, state} = req.body
    var foodtype = `japanese`
    fetchUrl(
      `https://api.yelp.com/v3/businesses/search?term=restaurant&location=${city}_${state}`,
      options,
      function (error, meta, body) {
        var obj = JSON.parse(body);
        for (i=0; i<10; i++) {
          var img = obj.businesses[i].image_url;
          var name = obj.businesses[i].name;
          var yelpUrl = obj.businesses[i].url;
          var rating = obj.businesses[i].rating;
          var street = obj.businesses[i].location.address1;
          var city = obj.businesses[i].location.city;
          var phone = obj.businesses[i].display_phone;
          console.log(img, name, yelpUrl, rating, street, city)
        }
        res.json(obj)
      })
  })
  app.post("/band/date", function(req, res) {
    console.log(`now here`)
    console.log(req.body['[]'])
    const formattedDates = [];
    const formattedTimes = [];
    const endDates = [];
    const startDates = [];
    req.body['[]'].forEach(index => {
      formattedDates.push(moment(index).format('MMMM Do YYYY'));
      formattedTimes.push(moment(index).format('h:mm:ss a'));
      endDates.push(moment(index).utc().add(1, 'M').format());
      startDates.push(moment(index).utc().subtract(1, 'M').format());
    });
    res.json({
      dates: formattedDates,
      times: formattedTimes,
      sdates: startDates,
      edates: endDates
    }
      );
  });

  // Delete an example by id
  app.delete("/api/examples/:id", function(req, res) {
    db.Example.destroy({ where: { id: req.params.id } }).then(function(dbExample) {
      res.json(dbExample);
    });
  });
};
