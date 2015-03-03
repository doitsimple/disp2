var libFile = require("../../lib/nodejs/file");
var libObject = require("../../lib/js/object");
module.exports = function(env){
	for (var name in env.pages){
		var page = env.pages[name];
		page.name = name;

		page.htmlProperty = page.htmlProperty || "";
		page.bodyContent = page.bodyContent || "";
		if(!page.cssLibs) page.cssLibs = [];
		if(!page.jsLibs) page.jsLibs = [];
		if(page.css)
			env.htmlCssContents[name]=libFile.readString(page.css);

		libObject.each(page.cssLib, function(cssLib){
			page.cssLibs.push(cssLib);
		});

		libObject.each(page.jsLib, function(jsLib){
			page.jsLibs.push(jsLib);
		});
	}
}
