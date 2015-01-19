
module.exports = function(env){
	if(!env.schemas || !env.apis){
		console.error("must have schemas and apis");
		process.exit(1);
	}

	if(env.port)
		env.serverUrl = env.host + ":" + env.port;
	else
		env.serverUrl = env.host;

}
