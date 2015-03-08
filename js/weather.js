// Default is set to Kelvin, converts it to Celsius
function KelvinToCelsius (temp){
  // Open Weather Map: http://openweathermap.org/weather-data
  var celsius = temp - 273.15;
  return celsius.toPrecision(3);
};

$(document).ready(function() {
  $('form').submit(function (evt) {
    evt.preventDefault();

    // This is used to validate the user's input. Consider removing numbers.
    // Tested against weatherLocation === user input
    var validateRegex = /^[a-zA-Z0-9_ ]+$/

    var $searchField = $('#search');
    
    var weatherLocation = $searchField.val();
    var weatherAPI = "http://api.openweathermap.org/data/2.5/weather?q=" + weatherLocation;
    var weatherOptions = { name: weatherLocation };

    // Called by the .success callback below. Makes the .ajax block cleaner
    // See failure for similar structure
    function displayWeather(data)
    { 
      // If the input is invalid. Pop a message: this will be displayed with a template later somehow...
      if(!validateRegex.test(weatherLocation))
      {
        alert("ERROR: Invalid Input");
        var invalidHtml = "<p>ERROR: Invalid Input</p>";
        $('#display').html(invalidHtml);
      }
      /*
        OpenWeatherMapAPI uses a HTTP error code system to report errors with their 
        JSON. 200 is good, everything else will be reported via alert until a clean template 
        can be used with it.
      */
      else if(data.cod != "200")
      {
        alert(data.message);
        var errorHtml = "<p>" + data.message + "</p>";
        $('#display').html(errorHtml);
      }
      else
      {
        /* If everything above checks out. Display the data. The script should not get to this point
           if the validation is working.
        */
        var iconImg = "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png";
        var report = 
        [{
          city: 'City: ' + data.name , 
          temperature: 'Current temperature: ' + KelvinToCelsius(data.main.temp) + '°C'
        }];
    
        //Display weather info using Handlebars
        var template = Handlebars.compile( $('#template').html() );
        $(".info").remove();
        $(document.body).append( template(report) );
        document.getElementById("icon").src = iconImg;
      }
    };

    //check for various network failures
    function failure(jqxhr, status, error)
    {
      alert("An error has occurred");
    };
    $.ajax(weatherAPI)
      .success(displayWeather)
      .error(failure)
  }); // end click
}); // end ready
