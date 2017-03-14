/**
* @file  /common/weather.js
*/

define(['jquery'], function ($) {
    var appId = 'ff30206bd4b4f65a8319912dd13f3902';
    //var forecastUrl = 'http://api.openweathermap.org/data/2.5/forecast?';
    var weeklyUrl = 'http://api.openweathermap.org/data/2.5/forecast/daily?';
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

        getWeatherData();
    }



    function getWeatherData() {
        var stdTemp = 273.15;
        var apiUrl = currentUrl + getParameter();
        var data = {};
        
        $.getJSON(apiUrl, function (curRsp) {
            data.description = curRsp.weather[0].main;
            data.temp = curRsp.main.temp - stdTemp;
            data.minTemp = curRsp.main.temp_min - stdTemp;
            data.maxTemp = curRsp.main.temp_max - stdTemp;
            data.pressure = curRsp.main.pressure;
            data.humidity = curRsp.main.humidity;
            data.windSpeed = curRsp.wind.speed;
            data.windDegree = curRsp.wind.deg;
            data.icon = getWeatherIcon(curRsp.weather[0].id, true);
            data.weekly = [];
            apiUrl = weeklyUrl + getParameter();
            $.getJSON(apiUrl, function (weekRsp) {
                $(weekRsp.list).each(function (idx) {
                    var forecast = {};

                    forecast.date = this.dt;
                    forecast.minTemp = this.temp.min - stdTemp;
                    forecast.maxTemp = this.temp.max - stdTemp;
                    forecast.pressure = this.pressure;
                    forecast.humidity = this.humidity;
                    forecast.description = this.weather[0].main;
                    forecast.icon = getWeatherIcon(this.weather[0].id);

                    data.weekly.push(forecast);
                });
            });
        });
    }

    function setCurrentWeather() {
        var apiUrl = currentUrl + getParameter();
        
        var result = $.getJSON(apiUrl);

        var icon = result.then(getWeatherIcon);
        
        console.log(apiUrl);
    }

    function setWeeklyWeather() {
        var apiUrl = weeklyUrl + getParameter();
        var result = $.getJSON(apiUrl, function (rsp) {
            
        });
        console.log(apiUrl);
    }

    //function setWeeklyWeather() {
    //    var apiUrl = forecastUrl + getParameter();
    //    console.log(apiUrl);
    //}

    function getParameter(){
        var data = {
            'appid':appId,
            'lat':latitude,
            'lon': longitude,
            'lang': 'kr'
        };
        return $.param(data);
    }

    function getWeatherIcon(id, isCurrent) {
        var prefix = "wi wi-";

        var dorn = "day-";
        if (isCurrent) {
            var today = new Date();
            var hour = today.getHours();

            if (hour > 6 && hour < 20) {
                //Day time
                dorn = "day-";

            } else {
                //Night time
                dorn = "night-";
            }
        }
        
        iconD = prefix + "owm-" + dorn + id;
        console.log(iconD);
        return iconD;
    }

    return Weather;

});