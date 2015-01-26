module.exports = function(env){
	env.staticPath = env.staticPath || false;
	env.nodeAppContents = env.nodeAppContents || {};
	env.nodeControllerFiles = env.nodeControllerFiles || {};
}
