/**
* @file  /common/weather.js
*/

define(['jquery'], function ($) {
    var appId = 'ff30206bd4b4f65a8319912dd13f3902';
    //var forecastUrl = 'http://api.openweathermap.org/data/2.5/forecast?';
    var weeklyUrl = 'http://api.openweathermap.org/data/2.5/forecast/daily?';
    var currentUrl = 'http://api.openweathermap.org/data/2.5/weather?';

    var latitude, longitude;

    var weekday = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    
    function Weather(el, option) {
        var _this = this;
    }

    Weather.prototype.init = function () {
        var _this = this;
    };

    Weather.prototype.setWeather = function (callback) {
        setCurrentLocation(callback);
    }

    function setCurrentLocation(callback) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                latitude = position.coords.latitude;
                longitude = position.coords.longitude;

                getWeatherData(callback);
            }, function (error) {
                console.log('get geolocation error. Error code: ' + error.code);
            }, { timeout: 5000 });
        } else {
            console.log("Geolocation is not supported by this browser.");
        }
    }



    function getWeatherData(callback) {
        var stdTemp = 273.15;
        var apiUrl = currentUrl + getParameter();
        var data = {};
        
        $.getJSON(apiUrl, function (curRsp) {
            debugger;
            data.location = curRsp.name;
            data.date = getReadableDate(curRsp.dt);
            data.description = curRsp.weather[0].main;
            data.temp = Math.round(curRsp.main.temp);
            //data.minTemp = Math.round(curRsp.temp.min);
            //data.maxTemp = Math.round(curRsp.temp.max);
            data.pressure = curRsp.main.pressure;
            data.humidity = curRsp.main.humidity;
            data.windSpeed = curRsp.wind.speed;
            data.windDegree = curRsp.wind.deg;
            data.icon = getWeatherIcon(curRsp.weather[0].id, true);
            data.weekly = [];
            apiUrl = weeklyUrl + getParameter();
            $.getJSON(apiUrl, function (weekRsp) {
                $(weekRsp.list).each(function (idx) {
                    if (idx == 0) {
                        data.minTemp = Math.round(this.temp.min);
                        data.maxTemp = Math.round(this.temp.max);
                    }
                    else {
                        var forecast = {};

                        forecast.date = weekday[getDateFromApi(this.dt).getDay()];// weekday[this.dt.getDay()];
                        forecast.minTemp = Math.round(this.temp.min);
                        forecast.maxTemp = Math.round(this.temp.max);
                        forecast.pressure = this.pressure;
                        forecast.humidity = this.humidity;
                        forecast.description = this.weather[0].main;
                        forecast.icon = getWeatherIcon(this.weather[0].id);

                        data.weekly.push(forecast);
                    }
                });

                if (callback) {
                    callback(data);
                }
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
            'lang': 'kr',
            'units': 'metric',
            'cnt' : 8
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

    function getDateFromApi(unix_timestamp) {
        return new Date(unix_timestamp * 1000);
    }

    function getReadableDate(unix_timestamp) {
        
        var date = getDateFromApi(unix_timestamp);
        
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var week = weekday[date.getDay()];
        var hours = date.getHours();
        var minutes = "0" + date.getMinutes();
        var seconds = "0" + date.getSeconds();

        // Will display time in 10:30:23 format
        var formattedTime = month + '월 '  + day + '일 ' + week +', ' + hours + ':' + minutes.substr(-2);

        return formattedTime;
    }

    return Weather;

});