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
      method: "GET",

    }).then((response) => {
      API.bandImage(band);
      console.log(response)
      var artistName = $("#name").val().trim();
      $(".artistName").empty();
      $(".artistName").append(artistName);
      $("#events").empty();
      $("#name").val("");
      for (var i = 0; i < 12; i++) {
        dateArray.push(response[i].datetime);
      }

      $.post("/band/date", { '': dateArray })
        .then((dateresponse) => {
          console.log(dateresponse)
          // Loops through the events and adds them to the event rows
          for (var i = 0; i < 12; i++) {
            console.log(response[i].venue.region)
            var data = `
          <p class= "city"> ${response[i].venue.city} , ${response[i].venue.region}<p>
          <p> ${response[i].venue.name}<p>
          <p class ="dates" data-sdate = "${dateresponse.sdates[i]}" data-edate = "${dateresponse.edates[i]}"> ${dateresponse.dates[i]}<p>
          <p>${dateresponse.times[i]}<p>

          `;
            var createDivs = $("<div>").addClass("col sm12 m3 concerts");
            createDivs.append(data);
            $("#events").append(createDivs);
          };
          //empty out input field after submission
          document.getElementById("name").reset();
        })
    });
  },
  yelpApi: (params) => {$.post("/restaurants", {...params}).then(response => console.log(response))
    // var options = {
    //   headers: {
    //       "authorization": process.env.YELP_API_TOKEN
    //   }
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
        
        </div>
        `

        $("#attractions").append(eventsData); 
        console.log(eventsData);

      }


    });
  },
  signIn: (email, password) => {
    console.log(`here`)
    firebase.auth().signInWithEmailAndPassword(email, password).then(function () {
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
      console.log(user)
      console.log(user.user.uid, user.user.email)
      userid = user.user.uid;
      email = user.user.email;
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
// $submitBtn.on("click", handleFormSubmit);
// $exampleList.on("click", ".delete", handleDeleteBtnClick);

$(() => {

  $("#submit").on("click", function (event) {
    event.preventDefault();
    API.bandsApi();
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
  var location = currEle[0].childNodes[1].innerText;
  var state = location.slice(-2)
  // $.post("/state",state)
  var startDate = currEle[0].childNodes[5].dataset.sdate;
  var endDate = currEle[0].childNodes[5].dataset.edate;
  var limit = 10;
  var city = currEle[0].childNodes[1].innerText;
  $("body").empty();
  city = city.substring(0, city.length - 5)
  eventData = {
    location,
    state,
    startDate,
    endDate,
    limit,
    city
  }
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

$(window).bind('hashchange', function() {
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
