$(document).on("click", ".concerts", function () {
    
    // window.location.href = "/events"
    event.preventDefault();
    console.log("I've been clicked");

    var queryURL = "https://app.ticketmaster.com/discovery/v2/events.json?apikey=Z5KkKdg29zBxIkQFJCnXrG3TnUXuj1YW";
    var currEle = $(this)
    var location = currEle[0].childNodes[1].innerText;
    var state = location.slice(-2)
    console.log(state)
    $.post("/state",state)
    console.log(currEle)
    var startDate = currEle[0].childNodes[5].dataset.sdate;
    console.log(startDate)
    var endDate = currEle[0].childNodes[5].dataset.edate;
    console.log(endDate)
    var limit = 10;
    console.log(currEle)
    var city = currEle[0].childNodes[1].innerText;
    city = city.substring(0, city.length - 4)
    // console.log(city);


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
        for (i = 0; i < 10; i++) {
console.log(response._embedded)
            eventDates = response._embedded.events[i].dates.start.localDate;
            eventTime = response._embedded.events[i].dates.start.localTime;
            eventPics = response._embedded.events[i].images[0].url;
            eventTitle = response._embedded.events[i].name;
            ticketLink = response._embedded.events[i].url;

        }


        //   console.log(response._embedded.events);
    });
});
