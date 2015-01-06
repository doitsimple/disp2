var fs = require("fs");
var path = require("path");
var libString = require("./lib/string");
var libArray = require("./lib/array");
var libObject = require("./lib/object");
var methods = {};
libObject.extend1(methods, libString);
libObject.extend1(methods, libArray);
libObject.extend1(methods, libObject);

var libFile = require("./lib/file");

// two dim array is not allowed in config
function extend(config){
	if(!config.task.main ){
		console.error("no main task");
		process.exit(1);
	}
	var defaultSys = {
		libPaths: ["lib", config.root +　"/lib"],
		nsPaths: ["ns", config.root +　"/ns"]
	};
	config.sys = {};
	addDefaultParams(config.sys, defaultSys);	

	var defaultTask = {
		type: "gen",
		src: ["src"],
		target: "dist"
	};
	addDefaultParams(config.task.main, defaultTask);
	
	mountJSON(config);
}
function run(config, task){
	var taskConfig = config.task[task];
	if(!taskConfig){
		console.error("task " + task + " is not exist");
		process.exit(1);
	}
	if(taskConfig.type == "gen"){
		var target = taskConfig.target;
		libFile.mkdirpSync(target);
		taskConfig.src.forEach(function(src){
			walk(src, target, taskConfig.env);
		});
	}else if(taskConfig.type == "batch"){
	}else{
		console.error("task type" + taskConfig.type + " is not valid");
		process.exit(1);
	}
}

function tmpl(str, data){
	data.methods = methods;
//	data.escapeRegExp = escapeRegExp;
	var p=[];
	var win, wout;
	var evalstr = "p.push('";
	with(data){
		str = str.replace(/\r/g,"");
		str = str.
			replace(/[^\S\n]*(\^\^[^=]((?!\$\$).)*\$\$)\s*\n/g, "$1");
		//[\s but not \n]* [^^] [not =] [not $$]* [$$] [\s*\n] 
//		console.log(str);
		str.split("\^\^").forEach(function(sub, i){
			if(i==0){
				win = "";
				wout = sub || "";
			}else{
				var subs = sub.split("\$\$");
				win = subs[0];
				wout = subs[1] || "";
			}
			wout = wout
				.replace(/\\([\[\]\{\}a-zA-Z0-9'])/g, "\\\\$1")
				.replace(/\n/g, "\\n")
				.replace(/'/g, "\\'")
				.replace(/\\([\"\?\*])/g, "\\\\\\$1");


			if(win && win[0] == '='){
				evalstr += (win.replace(/^=(.+)/, "',$1,'") + wout);
			}
			else{

				evalstr+=("');"+win+";p.push('"+wout);
			}
			
		});
		evalstr+="');";
		eval(evalstr);
		return p.join('');
	}
}


function addDefaultParams(config, defaultConfig){
	if(!config) {config = defaultConfig; return; }
	libObject.iterate2(defaultConfig, config, function(key, itConfig, itConfig2){
		if(!itConfig2.hasOwnProperty(key)){
			if(typeof itConfig2[key] == "object"){
				console.error(key + " should not be object");
				process.exit(1);
			}
			itConfig2[key] = itConfig[key];
		}
	}, function(key, itConfig, itConfig2){
		if(!itConfig2.hasOwnProperty(key)){
			itConfig2[key] = itConfig[key];
		}else if(libObject.isArray(itConfig2[key])){
			itConfig[key].forEach(function(v){
				itConfig2[key].push(v);
			});
		}else{
			var tmpVal = itConfig2[key];
			itConfig2[key] = [tmpVal];
			itConfig[key].forEach(function(v){
				itConfig2[key].push(v);
			});
		}
	});
}
function mountJSON(config){
	libObject.iterate(config, function(key, itConfig){
		if(itConfig[key][0] == "@"){
			var json = libFile.readJSON(path.resolve(itConfig[key].substr(1)));
			itConfig[key] = json;
		}
	}, function(key, itConfig){
		itConfig[key].forEach(function(e, i){
			if(typeof(e) == "object"){
				mountJSON(e);
			}else{
				if(e[0] == "@"){
					var json = libFile.readJSON(path.resolve(e.substr(1)));
					itConfig[key][i] = json;
				}
			}
		});
	});
}


function fillDir(tdir, dj, env){
	if(dj.mv){
		tdir = path.dirname(tdir) + "/" + tmpl(dj.mv, env);
	}
	if(dj.ignore){
		if(fs.existsSync(tdir))
			return;
	}
	if(!dj.file) dj.file = "^^=name$$";
	if(!dj.data) dj.data = "content";
	if(!dj.path) dj.path = "path";
		if(dj.array && env[dj.array])
			with(env){
				var evalstr = dj.array+".forEach(function(e){"+
							"var df = tdir + '/' + tmpl('"+dj.file + "',e);" + 
							"if(e." + dj.data + "){" +
							"mkdirp.sync(dirname(df));"+
							"fs.writeFile(df, e." + dj.data+ ");"+
							"}else if(e." + dj.path + "){"+
							"mkdirp.sync(dirname(df));"+
							"copySync(e." + dj.path+ ",df);"+
							"}"+
							"})";
//						console.log(evalstr);
				eval(evalstr);
			}
}
function walk(dir, tdir, env){
	if(!fs.existsSync(dir)){
		console.log(dir + "is not exist");
		return 0;
	}
/*
	if(!tdir)
		tdir = dir.replace(new RegExp("^"+libString.quote(srcRoot)), distRoot);
*/
	var dj = {};
	if(fs.existsSync(dir+"/disp.json")){
		dj = libObject.readJSON(dir+"/disp.json");
		fillDir(tdir, dj, env);
	}

// then iterate file
	var files = fs.readdirSync(dir);
	files.forEach(function(f){
		if(f== "." || f.match(/~/) || f == "disp.json"){
			return 0;
		}
		var p = dir + '/' + f;
// support disp. in directory name
		var	stat = fs.statSync(p);
		if(stat.isDirectory()){
			walk(p, tdir + "/" + f, env);
			return 0;
		}
//		console.log("file:"+p);
// if begin with disp, format the file
		if(f.match(/^disp\./)){
			console.log("file: " + f);
			var t = tdir + '/' + f.replace(/^disp./, "");				
			libFile.mkdirp(path.dirname(t));
			fs.writeFileSync(t, tmpl(fs.readFileSync(p).toString(), env));
		}
//	else copy file
		else{
			var t = tdir + '/' + f;
			libFile.mkdirp(path.dirname(t));
			libFile.copySync(p, t);
		}
	});
};

/*
function getModulePath(name, paths){
	var modPath;
	paths.forEach(function(path){
		if(fs.existsSync(path + "/" +name))
			modPath = path + "/" +name;
	});
	return modPath;
}
function loadMod(modName, mp){
	console.log("loadMod: " + mp.name);
	var loaderType, name;
	//TODO example for loaderType 
	if(mp.loader){
		loaderType = mp.loader;
	}
	else{
		loaderType = "_default";
	}
	var modPath = getPath(mp.tpl, modPaths);;
	if(!modPath){
		console.error("no modPath "+ mp.name);
		console.error(modPaths);
		process.exit(1);
	}
		
	var config = readJSONUnsafe(modPath + "/config.json");
	if(config.deps){
//TODO
	}

	loader[loaderType](modPath, mp, env, config);
	mp.extended = true;
}
*/
module.exports.methods = methods;
module.exports.extend = extend;
module.exports.run = run;
module.exports.tmpl = tmpl;
