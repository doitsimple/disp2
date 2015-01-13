var dbdef = require("../dbdef");
var core = require("../../dist/core");
var ucfirst = core.methods.ucfirst;
module.exports = function(env){
	if(!env.schemas || !env.apis){
		console.error("must have schemas and apis");
		process.exit(1);
	}

	dbdef.extendSchemas(env);
	dbdef.extendApis(env);

	env.ns = "com." + env.cop + "." + env.name.toLowerCase();
	if(env.port)
		env.serverUrl = env.host + ":" + env.port;
	else
		env.serverUrl = env.host;
	env.dbdef = dbdef;


}
