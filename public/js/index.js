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

firebase.initializeApp(config);

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
        let country = concertdata[i].venue.country;
        if (country === "United States") {
          dateArray.push(concertdata[i].datetime);
          countryCount += 1;
        };
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
            if (country === "United States") {
              var data = `
              <p class= "city"> ${response[i].venue.city} , ${response[i].venue.region}<p>
              <p class = "venue"> ${response[i].venue.name}<p>
              <p class = "dates" data-sdate = "${dates.sdates[countryCount]}" data-edate = "${dates.edates[countryCount]}"> ${dates.dates[countryCount]}<p>
              <p class = "time" >${dates.times[countryCount]}<p>
              `;
              countryCount += 1;
              var createDivs = $("<div>").addClass("col sm12 m3 concerts");
              createDivs.append(data);
              $("#events").append(createDivs);
            };
            i += 1
          } while (countryCount < 12);
        })
    });
  },
  yelpApi: (params) => {
    $.post("/restaurants", { ...params }).then(response => {
      // store the restaurant data in array so we can use it later to display
      restArray = [];
      for (var i = 0; i < 10; i++) {
        restArray.push({
          Pic: response.businesses[i].image_url,
          Name: response.businesses[i].name,
          Phone: response.businesses[i].phone,
          Address1: response.businesses[i].location.address1,
          City: response.businesses[i].location.city,
          Rating: response.businesses[i].rating,
          Url: response.businesses[i].url
        })
      }
      // Now read the saved restaurants data from Array and append
      for (i = 0; i < 9; i++) {
        phone = restArray[i].Phone.substring(2, restArray[i].Phone.length);
        phone = `(${phone.substring(0, 3)})${phone.substring(3, 6)}-${phone.substring(6, 10)}`
        var eventsData =
        `
        <div class="col sm12 m3 resDiv">
        <img class="resImages" src=${restArray[i].Pic}>
        <p><a href = ${restArray[i].Url}>${restArray[i].Name}</a></p>
        <p>${restArray[i].Address1}</p>
        <p> ${restArray[i].City} </p>
        <p> ${phone}</p>
        <p > ${restArray[i].Rating} </p>
        <button class ="resfav" data-rating="${restArray[i].Rating}" data-phone="${phone}" data-city="${restArray[i].City}" 
        data-address="${restArray[i].Address1}" data-image = "${restArray[i].Pic}" data-url="${restArray[i].Url}" data-name="${restArray[i].Name}">Save to your Favorites Page!</button>
        </div>
        `
        $("#restaurants").append(eventsData);
      }
    })
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
      localStorage.setItem("userid", userid);
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

$(document).on("click", ".resfav", (e) => {
  event.preventDefault();
  var currEle = $(e.currentTarget);
  var street = currEle[0].dataset.address;
  var rating = currEle[0].dataset.rating;
  var phone = currEle[0].dataset.phone;
  var city = currEle[0].dataset.city;
  var url = currEle[0].dataset.url;
  var name = currEle[0].dataset.name;
  var img = currEle[0].dataset.image;
  var userid = localStorage.getItem("userid");
  $.post("/res/favs",{street, rating, phone, city, url, name, img, userid});
})

$(document).on("click", ".favorites", (e) => {
  // $.get("/db/concerts", (req, res) => {console.log(res)});
  // $.get("/db/hotels", (req,res) => {console.log(res)});
  // $.get("/db/events", (req,res) => {console.log(res)});
  // $.get("/db/restaurants", (req,res) => {console.log(res)});
})