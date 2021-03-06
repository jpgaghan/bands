var db = require("../models");
var moment = require("moment");
var keys = require("../keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var fetchUrl = require("fetch").fetchUrl;
var state;

module.exports = function (app) {

  //database queries to produce user data upon login
  app.post("/db/concerts", (req, res) => {
    db.Concerts.findAll({
      where: {
        userid: req.body.userid
      }
    }).then((dbExamples) => {
      res.json(dbExamples);
    });
  });

  app.get("/db/concerts", (req, res) => {
    db.Concerts.findAll().then((dbExamples) => {
      res.json(dbExamples);
    });
  });  

  app.get("/db/events", (req, res) => {
    db.Events.findAll().then((dbExamples) => {
      res.json(dbExamples);
    });
  }); 

  app.post("/db/hotels", (req, res) => {
    db.Hotels.findAll({
      where: {
        userid: req.body.userid
      }
    }).then(function (dbExamples) {
      res.json(dbExamples);
    });
  });
  
  app.post("/db/events", (req, res) => {
    db.Events.findAll({
      where: {
        userid: req.body.userid
      }
    }).then(function (dbExamples) {
      res.json(dbExamples);
    });
  });

  app.post("/db/restaurants", (req, res) => {
    db.Restaurants.findAll({
      where: {
        userid: req.body.userid
      }
    }).then(function (dbExamples) {
      console.log(dbExamples);
      res.json(dbExamples);
    });
  });

  // database api storing new data
  app.post("/event/favorite", (req, res) => {
    db.Events.create(req.body).then(function (dbExample) {
      res.json(dbExample);
    });
  });

  app.post("/hotel/favorite", function(req, res) {
    db.Hotels.create(req.body).then(function(dbExample) {
      res.json(dbExample);
    });
  });

  app.post("/res/favs", (req, res) => {
    db.Restaurants.create(req.body).then((dbExample) => {
      res.json(dbExample)
    });
  });

  app.post("/newuser", function (req, res) {
    db.Users.create(req.body).then((userInfo) => {
      res.json(userInfo)
    });
  });

  app.post("/newconcert", (req, res) => {
    db.Concerts.create(req.body).then((userinfo) => { console.log(userinfo) })
  });

  // spotify api request
  app.post("/band/image", function (req, res) {
    spotify.search({ type: 'artist', query: req.body.bandname, limit: 1 }, (err, data) => {
      (err) => {
        return console.log('Error occurred: ' + err);
      }
      const artistPic = data.artists.items[0].images[1].url;
      res.json(artistPic);
    });
  });

  /**
   * YELP API Request
   */
  app.post("/restaurants", function (req, res) {
    const options = {
      headers: {
        "authorization": process.env.YELP_API_TOKEN
      }
    };
    const { city, state } = req.body;
    
    const url = `https://api.yelp.com/v3/businesses/search?term=restaurant&location=${city}_${state}`      
    
    fetchUrl( 
      url,
      options,
      function (error, meta, body) {
        var obj = JSON.parse(body);
        for (i = 0; i < 10; i++) {
          var img = obj.businesses[i].image_url;
          var name = obj.businesses[i].name;
          var yelpUrl = obj.businesses[i].url;
          var rating = obj.businesses[i].rating;
          var street = obj.businesses[i].location.address1;
          var city = obj.businesses[i].location.city;
          var phone = obj.businesses[i].display_phone;
        };
        res.json(obj);
      });
  });

  //converting dates with moment.js
  app.post("/band/date", (req, res) => {
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
    });
  });

  app.post("/event/date", (req, res) => {
    const formattedDates = [];
    req.body['[]'].forEach(index => {
      formattedDates.push(moment(index).format('MMMM Do YYYY'));
    });
    res.json({
      dates: formattedDates
    });
  });
  
  app.post("/delete/restaurant", (req,res) => {
    db.Restaurants.destroy({
      where: {
        userid: req.body.userid,
        id : req.body.id
      }}).then((dbExample) => {
        res.json(dbExample);
    });
  });
  
  app.post("/delete/hotel", (req,res) => {
    db.Hotels.destroy({
      where: {
        userid: req.body.userid,
        id : req.body.id
      }}).then(function (dbExample) {
        res.json(dbExample);
    });
  });

  app.post("/delete/event", (req,res) => {
    db.Events.destroy({
      where: {
        userid: req.body.userid,
        id : req.body.id
      }}).then((dbExample) => {
        res.json(dbExample);
      });
  });

  app.post("/delete/concert", (req,res) => {
    db.Concerts.destroy({
      where: {
        userid: req.body.userid,
        id : req.body.id
      }}).then(function (dbExample) {
        res.json(dbExample);
    });
  });
};
