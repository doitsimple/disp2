var libObject = require("../../lib/js/object.js");
module.exports = function(env){
	env.nodeDeps = env.nodeDeps || {};
	env.nodeDevDeps = env.nodeDevDeps || {};
	if(env.hasMultipart)
		env.nodeDeps["connect-multiparty"] = "*";	
	if(!env.lib)
		env.lib = {files: []};
}
