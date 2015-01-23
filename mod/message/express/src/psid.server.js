var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({server: server});
var Message = require("./message");
wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
		Message(message);
    ws.send('received: %s', message);
  });
});




