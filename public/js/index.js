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
      console.log(response)
      $(".artistName").append(artistName + "'s Upcoming Shows");
      API.bandImage(band);
      var artistName = $("#name").val().trim();
      $(".artistName").empty();
      $("#events").empty();

      $("#name").val("");
      let countryCount = 0;
      let i = 0
      do {
        const concertdata = response;
        if (i < concertdata.length) {
          // if (country === "United States") {
          dateArray.push(concertdata[i].datetime);
          // };
        }
        countryCount += 1;
        i += 1;
      } while (countryCount < 9);
      if (dateArray.length !== 0) {
        $.post("/band/date", { '': dateArray })
          .then((dateresponse) => {
            // Loops through the events and adds them to the event rows
            let countryCount = 0;
            let i = 0;
            do {
              const dates = dateresponse
              // if (country === "United States") {
              if (i < response.length) {
                if (response[i].venue.region !== "") {
                  var data = `
                <p class= "city" style="font-weight: bold; font-size: 18px"> ${response[i].venue.city} , ${response[i].venue.region}<p>
                <p class = "venue"> ${response[i].venue.name}<p>
                <p class = "dates" data-sdate = "${dates.sdates[countryCount]}" data-edate = "${dates.edates[countryCount]}"> ${dates.dates[countryCount]}<p>
                <p class = "time" >${dates.times[countryCount]}<p>
                `;
                } else {
                  var data = `
                <p class= "city" style="font-weight: bold; font-size: 18px">${response[i].venue.city}<p>
                <p class = "venue"> ${response[i].venue.name}<p>
                <p class = "dates" data-sdate = "${dates.sdates[countryCount]}" data-edate = "${dates.edates[countryCount]}"> ${dates.dates[countryCount]}<p>
                <p class = "time" >${dates.times[countryCount]}<p>
                `;
                }

                var createDivs = $("<div>").addClass("col sm12 m4 concerts");
                createDivs.append(data);
                $("#events").append(createDivs);
              }
              countryCount += 1;
              // };
              i += 1
            } while (countryCount < 9);
          })
      } else {
        var data = `<h2 class="noConcert">This artist does not have any upcoming shows. Please choose another.</h2>`
        var createDivs = $("<div>").addClass("col sm12 m3 concerts");
        createDivs.append(data);

        $("#events").append(createDivs);
      }
    });

  },
  yelpApi: (params) => {
    $.post("/restaurants", { ...params }).then(response => {

      // store the restaurant data in array so we can use it later to display
      restArray = [];
      for (var i = 0; i < 8; i++) {
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
      for (i = 0; i < 8; i++) {
        phone = restArray[i].Phone.substring(2, restArray[i].Phone.length);
        phone = `(${phone.substring(0, 3)})${phone.substring(3, 6)}-${phone.substring(6, 10)}`
        var eventsData =
          `
        <div class="col s12 m3 eventDiv">
          <img class="eventImages" src=${restArray[i].Pic}>
          <p><a href = ${restArray[i].Url}>${restArray[i].Name}</a></p>
          <p> ${restArray[i].Address1}</p>
          <p> ${phone} </p>
          <p> ${restArray[i].City} </p>
          <p> ${restArray[i].Rating} </p>
          <button class="favBtn">Save to your Favorites Page!</button>
          </div>
      
          `
        // var createDivs = $("<div>").addClass("col sm12 m3 Restaurants");
        // createDivs.append(eventsData);
        $("#restaurants").append(eventsData);
        console.log(eventsData);

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
      console.log(response)
      let nondupEvent = 0;
      const nondupArray = [];
      const nondupindexArray = [];
      let z = 0
      do {
        if (!nondupArray.includes(response._embedded.events[z].name)) {
          nondupArray.push(response._embedded.events[z].name)
          nondupindexArray.push(z);
        }
        z += 1
      } while (nondupArray.length !== 8)
      var dateArray = [];
      console.log(nondupindexArray)
      nondupindexArray.forEach((i) => {
        dateArray.push(response._embedded.events[i].dates.start.localDate);
      });
      $.post("/event/date", { '': dateArray }).then((dateresponse) => {
        let z = 0
        nondupindexArray.forEach((i) => {
          var eventsData =
            `<div class = "col s12 m3 eventDiv">
           <img class="eventImages" data-image="${response._embedded.events[i].images[0].url}" src=${response._embedded.events[i].images[0].url}>
          <p data-name="${response._embedded.events[i].name}" data-city ="${response._embedded.events[i]._embedded.venues[0].city.name}"> ${response._embedded.events[i].name} </p>
          <p data-date="${response._embedded.events[i].dates.start.localDate}">${dateresponse.dates[z]}</p>
          <p data-time="${response._embedded.events[i].dates.start.localTime}">${response._embedded.events[i].dates.start.localTime}</p>
          <a data-link="${response._embedded.events[i].url}" href=${response._embedded.events[i].url}>
          <button class="favBtn">Save to your Favorites Page!</button>
          </div>
          `;
          z += 1
          $("#attractions").append(eventsData);

        });
      });
    });
  },

  signIn: (email, password) => {
    firebase.auth().signInWithEmailAndPassword(email, password).then((user) => {
      userid = user.user.uid;
      email = user.user.email;
      localStorage.setItem("userid", userid);
      $.post("/newuser", { userid, email });
      window.location.href = "/artist"
    }).catch(function (error) {
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
    $("#hotels").addClass(city);

    // Adds the city to the City Banner after user searches for artist
    var banner = $("<div>").html("<h3>Hotels in " + city + "</h3>");
    var banner2 = $("<div>").html("<h3>Check the events in " + city + "</h3>");
    var banner3 = $("<div>").html("<h3>Local Resturants in " + city + "</h3>");

    banner.addClass("row center").attr("id", "cityBanner");
    $("#cityBanner").html(banner);
    $("#attractions").prepend(banner2);
    $("#restaurants").prepend(banner3);



Collap


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
    var city = address.substring(address.indexOf(',') + 1, address.length).trim();
    var address = address.substring(0, address.indexOf(',')).trim();
    var website = $("#iw-website").text();
    var telephone = $("#iw-phone").text();
    var userid = localStorage.getItem("userid");
    $.post("/hotel/favorite", { address, website, telephone, userid, city })
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
  if (location.indexOf(",") !== -1) {
    var city = location.substring(0, location.indexOf(',')).trim();
  } else {
    var city = location;
  }
  var date = currEle[0].childNodes[5].innerText;
  var startDate = currEle[0].childNodes[5].dataset.sdate;
  var endDate = currEle[0].childNodes[5].dataset.edate;
  var limit = 100;
  var time = currEle[0].childNodes[7].innerText;
  var venue = currEle[0].childNodes[3].innerText;
  $("#artist").empty();
  userid = localStorage.getItem('userid');
  $.post("/newconcert", { location, date, time, venue, userid, city });
  eventData = {
    location,
    state,
    startDate,
    endDate,
    limit,
    city
  };
  API.ticketMaster(
    // var eventTitle = `<h3>Local Events in + ${city}</h3>`
    // eventTitle.addClass("row").attr("id", "eventTitle");
    // $("#eventTitle").html(eventTitle);

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
  $.post("/res/favs", { street, rating, phone, city, url, name, img, userid });
})

$(document).on("click", ".favorites", (e) => {
  var userid = localStorage.getItem("userid");
  let totalcityArray = [];
  let concertArrays = [];
  let hotelArrays = [];
  let eventArrays = [];
  let restaurantArrays = [];
  $.post("/db/concerts", { userid }).then((res) => {
    let cityArray = [];
    res.forEach(index => {
      if (!cityArray.includes(index.city)) {
        cityArray.push(index.city)
        totalcityArray.push(index.city);
        concertArrays.push([index])
      } else {
        concertArrays.forEach(count => {
          if (count[0].city === index.city) {
            count.push(index)
          }
        })
      };
      if (!totalcityArray.includes(index.city)) {
        totalcityArray.push(index.city)
      }
    });
  });
  $.post("/db/hotels", { userid }).then((res) => {
    let cityArray = [];
    res.forEach(index => {
      if (!cityArray.includes(index.city)) {
        cityArray.push(index.city)
        totalcityArray.push(index.city);
        hotelArrays.push([index])
      } else {
        hotelArrays.forEach(count => {
          if (count[0].city === index.city) {
            count.push(index)
          }
        })
      };
    });
  });
  cityArray = []
  $.post("/db/events", { userid }).then((res) => {
    let cityArray = [];
    res.forEach(index => {
      if (!cityArray.includes(index.city)) {
        cityArray.push(index.city)
        eventArrays.push([index])
      } else {
        eventArrays.forEach(count => {
          if (count[0].city === index.city) {
            count.push(index)
          }
        })
      };
    });
  });

  cityArray = []
  $.post("/db/restaurants", { userid }).then((res) => {
    let cityArray = [];
    res.forEach(index => {
      if (!cityArray.includes(index.city)) {
        cityArray.push(index.city);
        totalcityArray.push(index.city);
        restaurantArrays.push([index]);
      } else {
        restaurantArrays.forEach(count => {
          if (count[0].city === index.city) {
            count.push(index)
          }
        })
      }
    })
    let index = totalcityArray.indexOf("");
    if (index > -1) {
      totalcityArray.splice(index, 1);
    }
    index = totalcityArray.indexOf(null);
    if (index > -1) {
      totalcityArray.splice(index, 1);
    }
    let firstTime = 0;
    totalcityArray.forEach(newcity => {
        //append city (text should be new city) header/container here
      concertArrays.forEach(item => {
        item.forEach(cityc => {
          if (cityc.city === newcity) {
            //append concerts here
            if (firstTime===0) {
              firstTime +=1;
              console.log(firstTime)
              //append section
            }
          }
        })
      })
      firstTime = 0;
      eventArrays.forEach(item => {
        item.forEach(citye => {
          if (citye.city === newcity) {
            if (firstTime===0) {
              firstTime +=1;
              console.log(firstTime)
              //append section
            }
            //append events here
            console.log(citye)
          }
        })
      })
      firstTime = 0;
      hotelArrays.forEach(item => {
        item.forEach(cityh => {
          if (cityh.city === newcity) {
            if (firstTime===0) {
              firstTime +=1;
              console.log(firstTime)
              //append section
            }
            //append hotels here
          }
        })
      })
      firstTime = 0;
      restaurantArrays.forEach(item => {
        item.forEach(cityr => {
          if (cityr.city === newcity) {
            if (firstTime===0) {
              firstTime +=1;
              console.log(firstTime)
              //append section
            }
            //append restaurants here
          }
        })
      })
    })
      
  });



});



