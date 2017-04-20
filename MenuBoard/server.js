var http = require('http');
var fs = require("fs");
var url = require('url');

http.createServer(function(request, response) {
    var pathname = url.parse(request.url).pathname;
    if (pathname == "/") { pathname = "/index.html"; }
    var file = pathname.substr(1);

    //if(/^\/[a-zA-Z0-9\/]*.html$/.test(file)){
    if (file.lastIndexOf('.html') > 0) {
        sendFileContent(response, file, "text/html");
    }
    else if (/^\/[a-zA-Z0-9\/]*.js$/.test(request.url.toString())) {
        sendFileContent(response, request.url.toString().substring(1), "text/javascript");
    }
    else if (/^\/[a-zA-Z0-9\/]*.css$/.test(request.url.toString())) {
        sendFileContent(response, request.url.toString().substring(1), "text/css");
    }
    else if (/^\/[a-zA-Z0-9\/]*.mp4$/.test(request.url.toString())) {
        sendFileContent(response, request.url.toString().substring(1), "video/mp4");
    }
    else {
        sendFileContent(response, request.url.toString().substring(1), "text/html");
    }
}).listen(3000);

function sendFileContent(response, fileName, contentType){
	fs.readFile(fileName, function(err, data){
		if(err){
			response.writeHead(404);
			response.write("Not Found!");
		}
		else{
			response.writeHead(200, {'Content-Type': contentType, 'charset': 'euc-kr' });
			response.write(data);
		}
		response.end();
	});
}

