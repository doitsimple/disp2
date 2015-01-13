var url = require("url");
var dbdef = require("../dbdef");
module.exports = function(env){
	if(!env.schemas || !env.apis){
		console.error("must have schemas and apis");
		process.exit(1);
	}
	dbdef.extendSchemas(env);
	dbdef.extendApis(env);
	if(!env.host) env.host = "http://127.0.0.1";
	if(env.port)
		env.serverUrl = env.host + ":" + env.port;
	else
		env.serverUrl = env.host;
	var protocol = url.parse(env.host).protocol;
	if(protocol)
		env.protocol = protocol.substr(0, protocol.length - 1);
	else
		env.protocol = "http";
	env.dbdef = dbdef;

	if(env.mongo)
		env.deps["mongoose"] = "*";
	if(env.mysql)
		env.deps["mysql"] = "*";
}
