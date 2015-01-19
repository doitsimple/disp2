var apidef = require("./apidef");
module.exports = function(env){
	if(!env.apis){
		console.error("database module must have schemas");
		process.exit(1);
	}
	apidef.extendApis(env);
}
