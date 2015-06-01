var app= require("./app");
var http = require('http');

process.on('uncaughtException', function(err) {
  //log the error
  console.error(err.stack);
});
var server = http.createServer(app);


server.listen(app.get('port'), function(){
	console.log('Express server listening on port:', app.get('port'));
});



