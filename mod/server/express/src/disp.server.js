var app= require("./app");
^^var protocol = global.protocol;$$
var ^^=protocol$$ = require('^^=protocol$$');

process.on('uncaughtException', function(err) {
  //log the error
  console.error(err.stack);
});
var server = ^^=protocol$$.createServer(app);

^^for(var key in global.nodeServerContents){$$
^^=global.nodeServerContents[key]$$
^^}$$

server.listen(app.get('port'), function(){
	console.log('Express server listening on port:', app.get('port'));
});



