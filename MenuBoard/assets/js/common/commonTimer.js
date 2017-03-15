/**
* @file  /common/commonTimer.js
*/

define(['jquery'], function ($) {
    var connection;
    var _option;
    var connected = false;
    var _retryOnFail = false;
    var _retryCount = 0;
    var retryInterval = 5000;

    var defaults = {
        serverAddress: '',
        protocol : '',
        retryOnFail: true,
        retryCount : 2
    };

    function CommonTimer(option) {
        var _this = this;
        _option = $.extend({}, defaults, option);
        _retryOnFail = _option.retryOnFail;

        this.init();
    }

    function connectToServer(openCallback, receiveCallback, failCallback) {
        connection = new WebSocket(_option.serverAddress, _option.protocol);

        connection.onopen = function () {
            console.log('open');
            connected = true;
            if (openCallback) {
                openCallback();
            }
        };

        connection.onerror = function (error) {
            console.log('error');
        };

        connection.onclose = function (e) {
            console.log('retry');
            connected = false;
            if (_retryOnFail) {
                if (_retryCount >= _option.retryCount) {
                    _retryOnFail = false;
                    failCallback();
                }
            }

            if(_option.retryOnFail)
            {
                if (_retryOnFail == false)
                    retryInterval = 60000;
                
                setTimeout(function () {
                    connectToServer(openCallback, receiveCallback, failCallback);
                    if (_retryOnFail) {
                        _retryCount++;
                    }
                }, retryInterval);
            }
        };

        connection.onmessage = function (message) {
            receiveCallback(message)
        };
        return connection;
    }

    function sendData(type, data) {
        if (connected == false) {
            console.log('not connect server');
            return;
        }

        if (type == 'schedule') {
            connection.send(data);
        }
    }

    CommonTimer.prototype.init = function () {
        var _this = this;
        window.WebSocket = window.WebSocket || window.MozWebSocket;
        console.log('inited');
    };

    CommonTimer.prototype.connect = connectToServer;
    CommonTimer.prototype.send = sendData;

    return CommonTimer;
});