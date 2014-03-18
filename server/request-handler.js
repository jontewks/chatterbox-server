/* You should implement your request handler function in this file.
 * And hey! This is already getting passed to http.createServer()
 * in basic-server.js. But it won't work as is.
 * You'll have to figure out a way to export this function from
 * this file and include it in basic-server.js so that it actually works.
 * *Hint* Check out the node module documentation at http://nodejs.org/api/modules.html. */
var results = [];

exports.handleRequest = function(request, response) {
  var headers = defaultCorsHeaders;
  headers['Content-Type'] = 'text/plain';
  console.log("Serving request type " + request.method + " for url " + request.url);
  if (request.url === '/classes/messages'){
    console.log('hits messages');
    if (request.method === 'POST') {
      console.log('hits post');
      var statusCode = 201;
      response.writeHead(statusCode, headers);
      request.on('data', function(dataChunk){
        results.push(JSON.parse(dataChunk));
      });
      response.end();
    } else if (request.method === 'GET') {
      var statusCode = 200;
      response.writeHead(statusCode, headers);
      console.log(results);
      response.end(JSON.stringify({results:results}));
    } else if (request.method === 'OPTIONS') {
      var statusCode = 200;
      response.writeHead(statusCode, headers);
      response.end();
    }
  } else if (request.url === '/classes/room') {
    if (request.method === 'POST') {
      var statusCode = 201;
      response.writeHead(statusCode, headers);
      request.on('data', function(dataChunk){
        results.push(JSON.parse(dataChunk));
      });
      response.end();
    } else if (request.method === 'GET') {
      var statusCode = 200;
      response.writeHead(statusCode, headers);
      response.end(JSON.stringify({results: results}));
    }
  } else {
    var statusCode = 404;
    response.writeHead(statusCode, headers);
    response.end('Server is on');
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

'<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title>chatterbox</title>
    <link rel="stylesheet" href="styles/styles.css">

    <!-- dependencies -->
    <script src="bower_components/jquery/jquery.min.js"></script>
    <script src="bower_components/underscore/underscore.js"></script>
    <!-- your scripts -->
    <script src="scripts/config.js"></script>
    <script src="scripts/app.js"></script>
  </head>
  <body>
    <div id="main">
      <h1>chatterbox</h1>
      <!-- Your HTML goes here! -->
      <button id="refresh">Refresh Messages</button>
      <select id="rooms">
        <option value="All Rooms"> All Rooms</option>
      </select>
      <button id="createRoom">Create Chat Room</button>
      <div id="friendsBox"><span>Friends:</span> </div>
      <select id="selectRoom">
        <option value="All Rooms"> All Rooms</option>
      </select>
      <input id="textMsg"type="text">
      <button id="sendMsg">Send</button>
      <h3>Filters:</h3>
      <button id="friendsFilter">Friends Filter</button>
      <button id="allMessages">All Messages</button>
      <div id="messagesDiv"></div>
    </div>
  </body>
</html>'
