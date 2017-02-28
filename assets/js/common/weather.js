define(['jquery'], function ($) {
    var appId = 'ff30206bd4b4f65a8319912dd13f3902';
    var forecastUrl = 'http://api.openweathermap.org/data/2.5/forecast?';
    var dailyUrl = 'http://api.openweathermap.org/data/2.5/forecast/daily?';
    var currentUrl = 'http://api.openweathermap.org/data/2.5/weather?';

    var latitude, longitude;

    function Weather(el, option) {
        var _this = this;
    }

    Weather.prototype.init = function () {
        var _this = this;
    };

    Weather.prototype.setWeather = function () {
        setCurrentLocation();
    }

    function setCurrentLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(setLocation);
        } else {
            console.log("Geolocation is not supported by this browser.");
        }
    }
    function setLocation(position) {
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;

        setCurrentWeather();
        setDailyWeather();
        setWeeklyWeather();
    }

    function setCurrentWeather() {
        var apiUrl = currentUrl + getParameter();
        console.log(apiUrl);
    }

    function setDailyWeather() {
        var apiUrl = dailyUrl + getParameter();
        console.log(apiUrl);
    }

    function setWeeklyWeather() {
        var apiUrl = forecastUrl + getParameter();
        console.log(apiUrl);
    }

    function getParameter(){
        var data = {
            'appid':appId,
            'lat':latitude,
            'lon':longitude
        };
        return $.param(data);
    }

    return Weather;

});