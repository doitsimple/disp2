module.exports = function(env){
	env.name = env.name || "test";
	env.htmlCssContents = env.htmlCssContents || {};

	env.cssLibs = env.cssLibs || [];
	env.jsLibs = env.jsLibs || [];

	env.bowerDeps = env.bowerDeps || {};
	env.bowerCssLibs = env.bowerCssLibs || [];
	env.bowerJsLibs = env.bowerJsLibs || [];

}
