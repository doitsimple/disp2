var libFile = require("../../lib/nodejs/file");
var libObject = require("../../lib/js/object");
module.exports = function(env){
	env.text2html = text2html;
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
function text2html(file, title){
	var str = libFile.readString(file);
	str = str.replace(/\r\n/g,"\n");
	str = str.replace(/\r/g,"\n");
	str = str.replace(/\n\n/g,"</p><p>&nbsp;</p><p>");
	str = str.replace(/\n/g,"</p><p>");
	str = '<div class="row"><div class="col-xs-offset-1 col-xs-10"><p>&nbsp;</p><p class="text-center"><strong>' + title + '</strong></p><p>&nbsp;</p><p>' + str + "</p></p></div></div>";
	return str;
}
