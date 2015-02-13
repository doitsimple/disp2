var libFile = require("../../lib/nodejs/file");
var libObject = require("../../lib/js/object");
module.exports = function(env){
	for (var name in env.pages){
		var page = env.pages[name];
		page.name = name;
		if(page.css)
			env.htmlCssContents[name]=libFile.readString(page.css);
		if(page.cssLib)
			libObject.each(page.cssLib, function(cssLib){
				env.cssLibs.push(cssLib);
			});
		if(page.jsLib)
			libObject.each(page.jsLib, function(jsLib){
				env.jsLibs.push(jsLib);
			});
	}
}
