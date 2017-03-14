/**
* @file  /common/commonTimer.js
*/

define(['jquery'], function ($) {
    var connection;
    var _option;
    
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

    function connectToServer(openCallback, receiveCallback) {
        connection = new WebSocket(_option.serverAddress, _option.protocol);

        connection.onopen = function () {
            console.log('open');
            openCallback();
        };

        connection.onerror = function (error) {
            console.log('error');
        };

        connection.onclose = function (e) {
            console.log('retry');
            setTimeout(function () { connectToServer(openCallback, receiveCallback) }, 5000);

        };

        connection.onmessage = function (message) {
            receiveCallback(message)
        };
        return connection;
    }

    CommonTimer.prototype.connect = connectToServer;
    
    return CommonTimer;

});