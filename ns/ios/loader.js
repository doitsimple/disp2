var dbdef = require("../dbdef");
module.exports = function(env){
	if(!env.schemas || !env.apis){
		console.error("must have schemas and apis");
		process.exit(1);
	}

	dbdef.extendSchemas(env);
	dbdef.extendApis(env);

	env.dbdef = dbdef;


}
