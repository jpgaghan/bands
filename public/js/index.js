// The API object contains methods for each kind of request we'll make
//firebase config
var dateArray = [];
var eventData = {};
// Initialize Firebase
var config = {
  apiKey: "AIzaSyD937MlgcJiQIwVpX_UYcaqjUjn2O19vxk",
  authDomain: "project-2-9f2fd.firebaseapp.com",
  databaseURL: "https://project-2-9f2fd.firebaseio.com",
  projectId: "project-2-9f2fd",
  storageBucket: "project-2-9f2fd.appspot.com",
  messagingSenderId: "518120117449"
};

firebase.initializeApp(config)

var database = firebase.database();

var API = {
  bandsApi: () => {
    const band = $("#name").val();
    var URL = "https://rest.bandsintown.com/artists/" + band + "/events?app_id=codingbootcamp";
    $.ajax({
      url: URL,
      method: "GET"
    }).then((response) => {
      API.bandImage(band);
      var artistName = $("#name").val().trim();
      $(".artistName").empty();
      $(".artistName").append(artistName);
      $("#events").empty();
      $("#name").val("");
      let countryCount = 0;
      let i = 0
      do {
        const concertdata = response;
        if (i< concertdata.length) {
        // if (country === "United States") {
          dateArray.push(concertdata[i].datetime);
        // };
      }
        countryCount += 1;
        i += 1;
      } while (countryCount < 12);

      $.post("/band/date", { '': dateArray })
        .then((dateresponse) => {
          // Loops through the events and adds them to the event rows
          let countryCount = 0;
          let i = 0;
          do {
            const dates = dateresponse
            let country = response[i].venue.country
            // if (country === "United States") {
              if (i< response.length) {
              var data = `
              <p class= "city"> ${response[i].venue.city} , ${response[i].venue.region}<p>
              <p class = "venue"> ${response[i].venue.name}<p>
              <p class = "dates" data-sdate = "${dates.sdates[countryCount]}" data-edate = "${dates.edates[countryCount]}"> ${dates.dates[countryCount]}<p>
              <p class = "time" >${dates.times[countryCount]}<p>
              `;

              
              var createDivs = $("<div>").addClass("col sm12 m3 concerts");
              createDivs.append(data);
              $("#events").append(createDivs);
              }
              countryCount += 1;
            // };
            i += 1
          } while (countryCount < 12);
        })
    });
  },
  yelpApi: (params) => {
    $.post("/restaurants", { ...params }).then(response => console.log(response))
    // var options = {
    //   headers: {
    //       "authorization": process.env.YELP_API_TOKEN
    //   }
  },
  bandImage: (band) => {
    $.post("/band/image", { bandname: band }).then((responseimage) => {
      Img = new Image();
      Img.src = responseimage;
      $(".bandimg").html(Img);
    }
    )
  },
  ticketMaster: (startDate, endDate, limit, city) => {
    event.preventDefault();
    var queryURL = "https://app.ticketmaster.com/discovery/v2/events.json?apikey=Z5KkKdg29zBxIkQFJCnXrG3TnUXuj1YW";
    $.ajax({
      url: queryURL,
      method: "GET",
      data: {
        city: city,
        startDateTime: startDate,
        endDateTime: endDate,
        size: limit,
        locale: "en"
      }
    }).then(function (response) {

      var dateArray = [];
      var timeArray = [];
      for (i=0; i<9; i++) {
        if(i<response._embedded.events.length) {
        dateArray.push(response._embedded.events[i].dates.start.localDate);
        timeArray.push(response._embedded.events[i].dates.start.localTime);
      }
      }
      $.post("/event/date", { '':dateArray}).then((dateresponse) => {
        for (i = 0; i < 9; i++) {
          if(i<response._embedded.events.length) {
        var eventsData =
          `<div class = "col m3 eventDiv">
          <img class="eventImages" data-image="${response._embedded.events[i].images[0].url}" src=${response._embedded.events[i].images[0].url}>
          <p data-name="${response._embedded.events[i].name}" data-city ="${response._embedded.events[i]._embedded.venues[0].city.name}"> ${response._embedded.events[i].name} </p>
          <p data-date="${response._embedded.events[i].dates.start.localDate}">${dateresponse.dates[i]}</p>
          <p data-time="${response._embedded.events[i].dates.start.localTime}">${response._embedded.events[i].dates.start.localTime}</p>
          <a data-link="${response._embedded.events[i].url}" href=${response._embedded.events[i].url}>
          </div>
          `;

        $("#attractions").append(eventsData);

          }
      }

    });
  })
},
  signIn: (email, password) => {
    firebase.auth().signInWithEmailAndPassword(email, password).then((user) => {
      userid = user.user.uid;
      email = user.user.email;
      localStorage.setItem("userid", userid);

      // db queries
      // $.post("/db/concerts", {userid}). then((res) => {console.log(res)});
      // $.post("/db/hotels", {userid}).then((res) => {console.log(res)});
      // $.post("/db/events", {userid}).then((res) => {console.log(res)});
      // $.post("/db/restaurants", {userid}).then ((res) => {console.log(res)});
      $.post("/newuser", { userid, email });
      window.location.href = "/artist"
    })
      .catch(function (error) {
        // Handle Errors here.
        $("#error").text("Incorrect email or password")
        $("#error").css({ "color": "red" })
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
      })
  },
  createUser: (email, password) => {
    firebase.auth().createUserWithEmailAndPassword(email, password).then((user) => {
      userid = user.user.uid;
      email = user.user.email;
      $.post("/newuser", { userid, email });
      window.location.href = "/artist"
    })
      .catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
      });
  },
  deleteExample: function (id) {
    return $.ajax({
      url: "api/examples/" + id,
      type: "DELETE"
    });
  },
  googleHotels: (city) => {
    $("#hotels").show();
    $( "#hotels" ).addClass(city);
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: city }, function (results) {
      map.setCenter(results[0].geometry.location);
      map.setZoom(15);
      // then places the markers on the map
      search();
    });
  }
};

// handleDeleteBtnClick is called when an example's delete button is clicked
// Remove the example from the db and refresh the list
var handleDeleteBtnClick = function () {
  var idToDelete = $(this)
    .parent()
    .attr("data-id");

  API.deleteExample(idToDelete).then(function () {
    refreshExamples();
  });
};

// Add event listeners to the submit and delete buttons

$(() => {
  $("#submit").on("click", (event) => {
    event.preventDefault();
    API.bandsApi();
    API.ticketMaster
  });


  //listeners
  $("#signup").on("click", () => {
    event.preventDefault();
    email = $("#idsignup").val();
    password = $("#passsignup").val();
    API.createUser(email, password);
  });

  $('#signin').on("click", () => {
    event.preventDefault();
    email = $("#email").val();
    password = $("#password").val();
    API.signIn(email, password);
  });

  $(document).on("click", ".favhotel", () => {
    var address = $("#iw-address").text();
    var city = address.substring(address.indexOf(',')+1,address.length).trim();
    var address = address.substring(0, address.indexOf(',')).trim(  );
    var website = $("#iw-website").text();
    var telephone = $("#iw-phone").text();
    var userid = localStorage.getItem("userid");
    $.post("/hotel/favorite", {address,website,telephone,userid,city})
  });
});

$(document).on("click", ".eventDiv", (e) => {
  var currEle = $(e.currentTarget);
  var eventdates = currEle[0].childNodes[5].dataset.date;
  var eventtime = currEle[0].childNodes[7].dataset.time;
  var eventpics = currEle[0].childNodes[1].attributes[1].nodeValue;
  var eventtitle = currEle[0].childNodes[3].dataset.name;
  var ticketlink = currEle[0].childNodes[9].dataset.link;
  var city = currEle[0].childNodes[3].dataset.city;
  var userid = localStorage.getItem('userid');
  $.post("/event/favorite", { eventdates, eventtime, eventpics, eventtitle, ticketlink, city, userid })
});

$(document).on("click", ".concerts", (e) => {
  event.preventDefault();
  var currEle = $(e.currentTarget);
  var location = currEle[0].childNodes[1].innerText;
  var state = location.slice(-2);
  var city = location.substring(0,location.indexOf(',')).trim();
  var date = currEle[0].childNodes[5].innerText;
  var startDate = currEle[0].childNodes[5].dataset.sdate;
  var endDate = currEle[0].childNodes[5].dataset.edate;
  var limit = 10;
  var time = currEle[0].childNodes[7].innerText;
  var venue = currEle[0].childNodes[3].innerText;
  $("#artist").empty();
  userid = localStorage.getItem('userid');
  $.post("/newconcert", { location, date, time, venue, userid, city});
  eventData = {
    location,
    state,
    startDate,
    endDate,
    limit,
    city
  };
  API.ticketMaster(
    eventData.startDate,
    eventData.endDate,
    eventData.limit,
    eventData.city
  );
  API.yelpApi(
    {
      city: eventData.city,
      state: eventData.state
    }
  );
  API.googleHotels(
    eventData.city
  );
});

$(window).bind('hashchange', function () {
  /* things */
});
// createVariables = () => {
//   event.preventDefault();
//   console.log("I've been clicked");
//   var currEle = $(this)
//   console.log(currEle)
//   var location = currEle[0].childNodes[1].innerText;
//   var state = location.slice(-2)
//   // $.post("/state",state)
//   var startDate = currEle[0].childNodes[5].dataset.sdate;
//   var endDate = currEle[0].childNodes[5].dataset.edate;
//   var limit = 10;
//   var city = currEle[0].childNodes[1].innerText;
//   city = city.substring(0, city.length - 4)
//   window.location.href = "/events"
// }
// firebase.auth().onAuthStateChanged((user) => {
//   if (user) {
//     console.log(user.uid);
//     localStorage.setItem("user", user.uid);
//   }
// });
