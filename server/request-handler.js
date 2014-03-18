/* You should implement your request handler function in this file.
 * And hey! This is already getting passed to http.createServer()
 * in basic-server.js. But it won't work as is.
 * You'll have to figure out a way to export this function from
 * this file and include it in basic-server.js so that it actually works.
 * *Hint* Check out the node module documentation at http://nodejs.org/api/modules.html. */
 var express = require('express');
 var app = express();
var results = [];

exports.handleRequest = function(request, response) {
  var headers = defaultCorsHeaders;
  headers['Content-Type'] = 'text/plain';
  console.log("Serving request type " + request.method + " for url " + request.url);
  if (request.url === '/classes/messages'){
    if (request.method === 'POST') {
      response.writeHead(201, headers);
      request.on('data', function(dataChunk){
        results.push(JSON.parse(dataChunk));
      });
      response.end();
    } else if (request.method === 'GET') {
      response.writeHead(200, headers);
      response.end(JSON.stringify({results:results}));
    } else if (request.method === 'OPTIONS') {
      response.writeHead(200, headers);
      response.end();
    }
  } else if (request.url === '/classes/room') {
    if (request.method === 'POST') {
      response.writeHead(201, headers);
      request.on('data', function(dataChunk){
        results.push(JSON.parse(dataChunk));
      });
      response.end();
    } else if (request.method === 'GET') {
      response.writeHead(200, headers);
      response.end(JSON.stringify({results: results}));
    }
  } else {
    response.writeHead(404, headers);
    //response.sendFile('../client/index.html');
    response.end("Hello");
  }
};

/* These headers will allow Cross-Origin Resource Sharing (CORS).
 * This CRUCIAL code allows this server to talk to websites that
 * are on different domains. (Your chat client is running from a url
 * like file://your/chat/client/index.html, which is considered a
 * different domain.) */
var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};


