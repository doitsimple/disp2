var fs = require("fs");
var libFile = require("../../../lib/nodejs/file");
module.exports = function(env){
	env.angularControllers = {};
	for (var name in env.pages){
		var page = env.pages[name];
		if(!page.ngRoutes){
			continue;
		}
		if(!page.nav) page.nav = "psid.nav.html";
		var nav ="";
		if(!fs.existsSync(page.nav)){
			console.log("!!!!!no nav bar");
		}else{
			nav = env.intepret(page.nav);
		}

		page.htmlProperty += ' ng-app="rootApp"';
		page.bodyContent += '<div ng-controller="navbarController">' + nav  + '</div><div ng-view></div>';

		if(!page.assetDir) page.assetDir = "psid.assets";
		page.jsLibs.push("lib/js/angular.min.js");
		page.jsLibs.push("lib/js/angular-route.min.js");
		page.jsLibs.push("lib/js/angular-cookies.min.js");
		page.jsLibs.push("app/" + name + ".js");
		page.jsLibs.push("app/controller/navbar.js");
		page.jsLibs.push("app/service/reqService.js");
		page.jsLibs.push("app/service/authService.js");
		page.jsLibs.push("app/filter.js");


		for (var subname in page.ngRoutes){
			var subpage = page.ngRoutes[subname];
			subpage.name = subname;
			if(!subpage.route){
				subpage.route = "/" + subname;
			}
			if(!subpage.access) subpage.access = 3;

			if(!subpage.controller) subpage.controller = subname;
			if(!subpage.template) subpage.template = subname;
			var tplFile = page.assetDir + "/" + subpage.template + ".html";
            libFile.mkdirp("html");
			if(fs.existsSync(tplFile)){
				fs.writeFileSync("html/" + subname + ".html", env.intepret(tplFile));
			}
			var ctrlFile = page.assetDir + "/" + subpage.controller + ".js";
			if(fs.existsSync(ctrlFile)){
				env.angularControllers[subname] = {};
				env.angularControllers[subname].content = env.intepret(ctrlFile);
				env.angularControllers[subname].deps = subpage.deps;
				page.jsLibs.push("app/controller/" + subname + ".js");
			}
			if(subpage.isHome) page.home = subpage;
			if(subpage.isSignin) page.signin = subpage;
		}
	}
}
