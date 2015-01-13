var fs = require("fs");
var path = require("path");
var libString = require("../lib/js/string");
var libArray = require("../lib/js/array");
var libObject = require("../lib/js/object");
var methods = {};
libObject.extend1(methods, libString);
libObject.extend1(methods, libArray);
libObject.extend1(methods, libObject);

var libFile = require("../lib/nodejs/file");
var globalConfig;
// two dim array is not allowed in config
function set(config){
	if(!config.task.main ){
		console.error("no main task");
		process.exit(1);
	}
	var main = config.task.main;
	var defaultSys;
	if( path.resolve(config.root) == path.resolve("."))
		defaultSys = {
			libPaths: ["lib"],
			nsPaths: ["ns"]
		};
	else
		defaultSys = {
			libPaths: ["lib", config.root +　"/lib"],
			nsPaths: ["ns", config.root +　"/ns"]
		};
	if(!config.sys) config.sys = {};
	addDefaultParams(config.sys, defaultSys);	
	config.sys.modPaths = [];
	var defaultMakeTask = {
		type: "make",
		target: "."
	};
	var defaultGenTask = {
		type: "gen",
		src: ["src"],
		target: "dist"
	};
	if(!main.type || main.type == "make")
		addDefaultParams(config.task.main, defaultMakeTask);
	else if(main.type == "gen")
		addDefaultParams(config.task.main, defaultGenTask);
	
	
	mountJSON(config);
	intepretJSON(config);
	globalConfig = config;
}
function run(task){
	var taskConfig = globalConfig.task[task];
	if(!taskConfig.env) taskConfig.env = {};
	if(!taskConfig){
		console.error("task " + task + " is not exist");
		process.exit(1);
	}
	if(taskConfig.type == "gen"){
		libFile.mkdirpSync(taskConfig.target);

		getModPaths(taskConfig);
		makeFromMods(taskConfig);
		makeFromNs(taskConfig);
		taskConfig.src.forEach(function(src){
			walk(src, taskConfig.target, taskConfig.env);
		});

	}else if(taskConfig.type == "make"){
		taskConfig.src = [];
		taskConfig.src.push(taskConfig.target);

		getModPaths(taskConfig);
		makeFromMods(taskConfig);
		makeFromNs(taskConfig);
		taskConfig.src.forEach(function(src){
			walk(src, taskConfig.target, taskConfig.env);
		});
		
	}else if(taskConfig.type == "batch"){
	}else{
		console.error("task type" + taskConfig.type + " is not valid");
		process.exit(1);
	}
}

function tmpl(str, data, filename){
	str = str.toString();
	data.local = data;
	data.methods = methods;
	var p=[];
	var win, wout;
	var evalstr = "p.push('";
	with(data){
		str = str.replace(/\r/g,"");
//		str = str.
//			replace(/\s*(\^\^[^=]((?!\$\$).)*\$\$)\s*/g, "$1");
		//replace multiple line [\s but not \n]* [^^] [not =] [not $$]* [$$] [\s*\n] 

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
				.replace(/\n[\t ]+$/, "\n") //remove \s after last \n
				.replace(/^[\t ]*\n/, "") // remove \s before/and first \n
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
function mountJSON(config, dir){
	if(!dir) dir = ".";
	libObject.iterate(config, function(key, itConfig, i){
		var e;
		if(i==undefined)
			e = itConfig[key];
		else
			e = itConfig[key][i];
		if(e[0] == "@" && e[1] == "@"){
			var jpath = path.resolve(dir + "/" +e.substr(2));
			var json = libFile.readJSON(jpath);
			mountJSON(json, path.dirname(jpath));
			if(i==undefined)
				itConfig[key] = json;
			else
				itConfig[key][i] = json;
		}
	});
}
function intepretJSON(config){
	libObject.iterate(config, function(key, itConfig, i){
		var e;
		if(i==undefined)
			e = itConfig[key];
		else
			e = itConfig[key][i];
		
		if(e[0] == "#" && e[1] == "#"){
			var f = e.substr(2);
			config.sys.libPaths.forEach(function(lib){
				if(fs.existsSync(lib + "/" + f)){
					if(i == undefined){
						itConfig[key] = lib + "/" + f;
					}else{
						itConfig[key][i] = lib + "/" + f;
					}
				}
			});
		}
	});
}
function loadSubPath(nsSubPath, taskConfig){
	console.log("load subpath: " + nsSubPath);
	var config;
	if(fs.existsSync(nsSubPath + "/config.json")){
		config = libFile.readJSON(nsSubPath + "/config.json"); 
		if(libObject.isArray(config.defaultArrayVars))
			config.defaultArrayVars.forEach(function(k){
				if(!taskConfig.env[k]) taskConfig.env[k] = [];
			});
		if(libObject.isArray(config.defaultHashVars))
			config.defaultHashVars.forEach(function(k){
				if(!taskConfig.env[k]) taskConfig.env[k] = {};
			});
		if(libObject.isArray(config.defaultVars))
			config.defaultVars.forEach(function(k){
				if(!taskConfig.env[k])
					taskConfig.env[k] = false;
			});
	}
	if(fs.existsSync(nsSubPath + "/loader.js")){
		console.log("run loader");
		require(path.resolve(nsSubPath) + "/loader")(taskConfig.env);
	}
}
function walkSubPath(nsSubPath, taskConfig){
	var dirpath = nsSubPath  + "/src";
	if(fs.existsSync(dirpath)){
		console.log("src: " + path.resolve(dirpath));
		walk(dirpath, taskConfig.target, taskConfig.env);
	}
}
function getModPaths(taskConfig){	
	if(!taskConfig.ns) return;
	globalConfig.sys.nsPaths.forEach(function(nsPath){
		globalConfig.sys.modPaths.push(nsPath);
		var nsSubPath = nsPath + "/" + taskConfig.ns;
		if(fs.existsSync(nsSubPath)){
			globalConfig.sys.modPaths.push(nsSubPath);
		}
	});
}
function makeFromNs(taskConfig){	
	if(!taskConfig.ns) return;
	globalConfig.sys.nsPaths.forEach(function(nsPath){
		var nsSubPath = nsPath + "/" + taskConfig.ns;
		if(fs.existsSync(nsSubPath)){
			taskConfig.src.push(nsSubPath + "/src");
			loadSubPath(nsSubPath, taskConfig);
		}
	});
}
function makeFromMods(taskConfig){	

	if(!taskConfig.mods) return;
	for (var modname in taskConfig.mods){
		globalConfig.sys.modPaths.forEach(function(modPath){
			var modSubPath = modPath + "/" + modname;
			if(fs.existsSync(modSubPath)){
				taskConfig.src.push(modSubPath + "/src");
				loadSubPath(modSubPath, taskConfig);
			}
		});
	}
}

function fillDir(dir, tdir, dj, env){
//		console.log("filldir " +dir);
	if(!dj.key && !dj.config){
		console.error(dir + "/psid.json has no key or config");
		process.exit(1);
	}

	var configs;
// the array can be store in key and/or config
	if(dj.key){
		if(!env[dj.key]) configs = [];
		else if(!libObject.isArray(env[dj.key]))
			configs = [env[dj.key]];
		else
			configs = env[dj.key];
	}
	else
		configs = [];
	if(dj.config)
		if(!libObject.isArray(dj.config))
			configs.push(dj.config);
		else
			dj.config.forEach(function(c){
				configs.push(c);
			});
	if(!configs.length){
		console.log("env has no config");
		return;
	}
	configs.forEach(function(config){

// files: copy hetero
		if(libObject.isArray(config.files)){
			libFile.mkdirpSync(tdir);
			if(config.parse)
				config.files.forEach(function(f){
					console.log("file: " + f);
					fs.writeFileSync(tdir + "/" + path.basename(f), tmpl(fs.readFileSync(f), {global: env, dir: path.basename(tdir)}));
				});
			else
				config.files.forEach(function(f){
					if(f != tdir + "/" + path.basename(f)){
						console.log("file: " + f);
						libFile.copySync(f, tdir + "/" + path.basename(f));
					}
				});				
		}
// copy homo
		else{
			if(!config.tpl) config.tpl = dir + "/psid.tpl";
			else config.tpl = dir + "/" + config.tpl;
			if(!fs.existsSync(config.tpl)){
				console.error("no tpl file " + config.tpl);
				process.exit(1);
			}
			var	tplStr = fs.readFileSync(config.tpl);
			var subenvs = {};;
			if(config.envs){
				subenvs = config.envs;
			}else if(config.envlink){
				subenvs = env[config.envlink];
			}else if(config.envlinks){
				for(var key in config.envlinks){
					subenvs[key] = env[config.envlinks[key]];
				}
			}
			if(config.envname)
				env[config.envname] = {};
			
			for (var key in subenvs){
				var subenv = subenvs[key];

				if(!subenv){
					console.log(dir + " not env");
					continue;
				}

//select subenv that matchs select
				var doloop = true;
				if(config.select){
					for(var key in config.select){
						if(subenv[key] != config.select[key])
							doloop = false;
					}
				}
				if(!doloop) continue;

				subenv.global = env;
				if(!subenv.name) subenv.name = key;
				if(config.filename){
					var filename = tmpl(config.filename, subenv);
					console.log("file: " + tdir + "/" + filename);
					libFile.mkdirpSync(path.dirname(tdir + "/" + filename));
					fs.writeFileSync(tdir + "/" + filename, tmpl(tplStr, subenv));
				}else if(config.envname){
					env[config.envname][key] = tmpl(tplStr, subenv);
				}
			};
			
		}
/*else{
			console.error("unknown config for disp.json", JSON.stringify(config, undefined, 2));
			process.exit(1);
		}
*/
	});
	
}
function walk(dir, tdir, env){
	if(!fs.existsSync(dir)){
		console.log(dir + " is not exist");
		return 0;
	}

	if(!tdir)
		tdir = dir;

	var dj = {};
	if(fs.existsSync(dir+"/psid.json")){
		dj = libFile.readJSON(dir+"/psid.json");
		if(dj.ignore){
			if(fs.existsSync(tdir))
				return 0;
		}
		if(dj.mv)
			tdir = path.dirname(tdir) + "/" + tmpl(dj.mv, {global: env});
	
		fillDir(dir, tdir, dj, env);

	}

// then iterate file
	var files = fs.readdirSync(dir);
	files.forEach(function(f){
		if(f == "." || f.match(/~/) || f[0] == '#' 
			 || f.match(/^psid\./)
			 || f.match(/\.psid$/)
			 || fs.existsSync(dir + "/" + f +".disp") 
			 || fs.existsSync(dir + "/" + "disp." + f)){
			return 0;
		}
		var p = dir + '/' + f;
		var t;
// support disp. in directory name
		var	stat = fs.statSync(p);
		if(stat.isDirectory()){
			walk(p, tdir + "/" + f, env);
			return 0;
		}
// if begin with disp, format the file
		if(f.match(/^disp\./)){
			console.log("file: " + p);
			t = tdir + '/' + f.replace(/^disp./, "");				
			libFile.mkdirpSync(path.dirname(t));
			fs.writeFileSync(t, tmpl(fs.readFileSync(p).toString(), {global: env}));
		}
		else if(f.match(/\.disp$/)){
			console.log("file: " + p);
			t = tdir + '/' + f.replace(/\.disp$/, "");
			libFile.mkdirpSync(path.dirname(t));
			fs.writeFileSync(t, tmpl(fs.readFileSync(p).toString(), {global: env}));
		}
		else if(dir != tdir){
			console.log("file: " + p);
			t = tdir + '/' + f;
			libFile.mkdirpSync(path.dirname(t));
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
module.exports.set = set;
module.exports.run = run;
module.exports.tmpl = tmpl;
