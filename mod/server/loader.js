var url = require("url");
module.exports = function(env){
	if(!env.host) env.host = "http://127.0.0.1";
	if(env.port)
		env.serverUrl = env.host + ":" + env.port;
	else{
		env.port = 80;
		env.serverUrl = env.host;
	}
	var protocol = url.parse(env.host).protocol;
	if(protocol)
		env.protocol = protocol.substr(0, protocol.length - 1);
	else
		env.protocol = "http";
}
