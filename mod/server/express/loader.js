module.exports = function(env, config){
	env.staticPath = env.staticPath || false;
	env.nodeAppContents = env.nodeAppContents || {};
	env.nodeControllerFiles = env.nodeControllerFiles || {};
}
