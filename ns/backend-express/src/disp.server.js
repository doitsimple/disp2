var app= require("./app");
^^var protocol = global.protocol;$$
var ^^=protocol$$ = require('^^=protocol$$');

process.on('uncaughtException', function(err) {
  //log the error
  console.error(err.stack);
});
^^=protocol$$.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port:', app.get('port'));
});



