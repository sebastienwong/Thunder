function getWeather() {
  return new Promise((res, rej) => {
    let key = weather_key;

    $.ajax({
      url: 'https://api.openweathermap.org/data/2.5/weather?id=' + 5913490 + '&appid=' + key,
      type: "GET",
      dataType: "jsonp",
      success: function(data) { 
        console.log("Weather data loaded")

        res(parseWeather(data));
      }
    });
  })
}

function parseWeather(data) {
  let date = new Date();
  let hours = date.getHours();
  let month = date.getMonth();

  let time_term;
  if(6 < hours && hours <= 12) {
    time_term = "morning";
  } else if(12 < hours && hours <= 17) {
    time_term = "afternoon";
  } else {
    time_term = "night";
  }

  let weather_term = data.weather[0].main;
  if(weather_term == "Rain" || weather_term == "Drizzle") {
    weather_term = "rainy";
  } else if(weather_term == "Thunderstorm") {
    weather_term = "stormy";
  } else if(weather_term == "Snow") {
    weather_term = "winter";
  } else {
    if(1 < month && month <= 4) {
      weather_term = "spring";
    } else if(4 < month && month  <= 7) {
      weather_term = "summer";
    } else if(7 < month && month  <= 10) {
      weather_term = "fall";
    } else {
      weather_term = "winter";
    }
  }

  console.log(weather_term);
  console.log(time_term);

  return {
    time: time_term,
    weather: weather_term
  };
}