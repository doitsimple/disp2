module.exports = function(env){
	var bowerPath = "bower_components";
	env.bowerCssLibs.forEach(function(csspath){
		env.cssLibs.push(bowerPath + "/" + csspath);
	});
	env.bowerJsLibs.forEach(function(csspath){
		env.jsLibs.push(bowerPath + "/" + csspath);
	});
}
