var libString = require("../../../lib/js/string");
var ucfirst = libString.ucfirst;
module.exports = function(env, config){
	for (var name in env.feedback){
		var feedbackConfig = env.feedback[name];
		env.nodeControllerFiles[name] = true;
		if(!config) continue;
		if(config.frontend){
			env.apis["send"+ucfirst(name)].controller = ucfirst(name) + ".send";
		}
		if(config.backend){
			env.apis["list"+ucfirst(name)].controller = ucfirst(name) + ".list";
		}
	}
}
