
//$.connection.hub.url = "http://beecastcore.azurewebsites.net/signalr";
$.connection.hub.url = "http://localhost:8080/signalr";
$.connection.hub.qs = "StbNo=0&HtmlPage=Y";
var commercial = $.connection.stbCommandHub;

//[3] 클라이언트 -> 서버
$.connection.hub.start({ jsonp: true }).done(function () {

});

//[!] 예외 처리
$.connection.hub.error(function (err) {
    //alert("에러 발생 : " + err);
});

function stbRebootCommand(stbno) {
    commercial.server.stbRebootCommand(stbno);
}

function stbScreenCaptureCommand(stbno) {
    commercial.server.stbScreenCaptureCommand(stbno);
}

function addNotice(stbno, captionText) {
    commercial.server.addNotice(stbno, captionText);
}

function removeNotice(stbno) {
    commercial.server.removeNotice(stbno);
}

function refreshHtml(stbno) {
    commercial.server.refreshHtml(stbno);
}
function addEmergency(stbno) {
    commercial.server.addEmergency(stbno);
}
function removeEmergency(stbno) {
    commercial.server.removeEmergency(stbno);
}

function callFunc(stbno, funcname, params) {   
    commercial.server.callFunc(stbno, funcname, params);
}
function getStbDisplayInfo(stbno) {
    commercial.server.getStbDisplayInfo(stbno);
}
function addNoticeHtml(stbno, noticetype, noticetext) {
    commercial.server.addNoticeHtml(stbno, noticetype, noticetext);
}
function hideNoticeHtml(stbno) {
    commercial.server.hideNoticeHtml(stbno);
}
