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
    console.log(band)
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
          countryCount +=1;
        };
        i+=1;
        }  while (countryCount <12);
      console.log(dateArray)
      $.post("/band/date", { '': dateArray })
        .then((dateresponse) => {
          // Loops through the events and adds them to the event rows
          let countryCount = 0;
          let i = 0;
      do {
        const dates = dateresponse
        console.log(dates)
        let country = response[i].venue.country
        if (country === "United States") {
          console.log(dates)
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
        } while (countryCount <12);
          //empty out input field after submission
          document.getElementById("name").reset();
        })
    });
  },
  yelpApi: (params) => {$.post("/restaurants", {...params}).then(response => console.log(response))
    
  },
  bandImage: (band) => {
    $.post("/band/image", { bandname: band }).then((responseimage) => {
      Img = new Image();
      Img.src = responseimage
      $(".bandimg").html(Img)
    }
    )
  },
  ticketMaster: (startDate, endDate, limit, city) => {
    event.preventDefault();
    console.log("I've been clicked");
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
      console.log(response);
      eventArray = []
      
      for (i = 0; i < 8; i++) {
     
      var eventsData =

        `<div class ="col m3 eventDiv">
        <img class="eventImages" src=${response._embedded.events[i].images[0].url}>
        <p> ${response._embedded.events[i].name} </p>
        <p> ${response._embedded.events[i].dates.start.localDate}</p>
        <p> ${response._embedded.events[i].dates.start.localTime} </p>
        <a href=${response._embedded.events[i].url}>

        </div>
        `

        $("#attractions").append(eventsData); 
        console.log(eventsData);

      }

    });
  },
  signIn: (email, password) => {
    console.log(`here`)
    firebase.auth().signInWithEmailAndPassword(email, password).then((user) => {
      userid = user.user.uid;
      email = user.user.email;
      localStorage.setItem("userid", userid);
      $.post("/newuser", {userid,email});
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
      $.post("/newuser", {userid,email});
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
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: city }, function (results) {
      map.setCenter(results[0].geometry.location);
      map.setZoom(15);
      // then places the markers on the map
      search();
    });
  }
};

// refreshExamples gets new examples from the db and repopulates the list
var refreshExamples = function () {
  API.getExamples().then(function (data) {
    var $examples = data.map(function (example) {
      var $a = $("<a>")
        .text(example.text)
        .attr("href", "/example/" + example.id);

      var $li = $("<li>")
        .attr({
          class: "list-group-item",
          "data-id": example.id
        })
        .append($a);

      var $button = $("<button>")
        .addClass("btn btn-danger float-right delete")
        .text("ｘ");

      $li.append($button);

      return $li;
    });

    $exampleList.empty();
    $exampleList.append($examples);
  });
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
  $("#submit").on("click", function (event) {
    event.preventDefault();
    API.bandsApi();
    API.ticketMaster
  });

  //Populating hotel on different path /artist/hotel when clicking on city
  // $("#submit").on("click", function (event) {
  //   event.preventDefault();
  //   $.get('/artist/hotel').then(function(res) {
  //   API.bandsApi();
  //   }).catch(function(err) {
  //     console.log(err)
  //   });
  // });



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
    $("iw-address").text();
    $("iw-website").text();
    $("#iw-phone").text();
  });
  
});

$(document).on("click", ".concerts", (e) => {
  event.preventDefault();
  var currEle = $(e.currentTarget);
  console.log(currEle)
  var location = currEle[0].childNodes[1].innerText;
  var state = location.slice(-2);
  // $.post("/state",state)
  var date = currEle[0].childNodes[5].innerText;
  var startDate = currEle[0].childNodes[5].dataset.sdate;
  var endDate = currEle[0].childNodes[5].dataset.edate;
  var limit = 10;
  var city = currEle[0].childNodes[1].innerText;
  var time = currEle[0].childNodes[7].innerText;
  var venue = currEle[0].childNodes[2].innerText;
  $("body").empty();
  city = city.substring(0, city.length - 5);
  userid = localStorage.getItem('userid')
$.post("/newconcert", {location,date,time,venue,userid});
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
