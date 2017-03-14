/**
* @file  /common/commonTimer.js
*/

define(['jquery'], function ($) {
    var connection;
    var _option;
    var _openCallback, _receiveCallback
    
    var defaults = {
        serverAddress: '',
        protocol : '',
        retryOnFail: true
    };

    function CommonTimer(option) {
        var _this = this;
        _option = $.extend({}, defaults, option);

        this.init();
    }

    CommonTimer.prototype.init = function () {
        var _this = this;
        window.WebSocket = window.WebSocket || window.MozWebSocket;
        console.log('inited');
    };

    function connectToServer(scheduleData, receiveCallback) {
        connection = new WebSocket(_option.serverAddress, _option.protocol);

        connection.onopen = function () {
            console.log('open');
            if (scheduleData != undefined && scheduleData != '') {
                connection.send(scheduleData);
            }
        };

        connection.onerror = function (error) {
            console.log('error');
        };

        connection.onclose = function (e) {
            console.log('retry');
            setTimeout(function () { connectToServer(scheduleData, receiveCallback) }, 5000);

        };

        connection.onmessage = function (message) {
            receiveCallback(message)
        };
        return connection;
    }

    CommonTimer.prototype.connect = connectToServer;
    
    return CommonTimer;

});