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
	if(!config || !config.task || !config.task.main ){
		console.log("config error");
		process.exit(1);
	}

	var mainTaskConfig = config.task.main;
	if(mainTaskConfig.ns){
		if(!mainTaskConfig.src || mainTaskConfig.src.length)
			mainTaskConfig.src = ["."];
		if(!mainTaskConfig.target)
			mainTaskConfig.target = ".";
	}

	var defaultSys;
	if( path.resolve(config.root) == path.resolve("."))
		defaultSys = {
			libPaths: ["../lib"],
			nsPaths: ["../ns"],
			modPaths: ["../mod"]
		};
	else
		defaultSys = {
			libPaths: ["../lib", config.root +　"/lib"],
			nsPaths: ["../ns", config.root +　"/ns"],
			modPaths: ["../mod", config.root + "/mod"]
		};
	if(!config.sys) config.sys = {};
	addParams(config.sys, defaultSys);	

	mountJSON(config);
	intepretJSON(config);
	globalConfig = config;
}
function run(task){
	var taskConfig;
	if(task == "main")
		taskConfig = globalConfig.task[task];
	else{
		if(!globalConfig.task[task]){
			console.log("no task: " + task);
			process.exit(0);
		}
		taskConfig = globalConfig.task["main"];
		replaceParams(taskConfig, globalConfig.task[task]);
		console.log(taskConfig);
	}

	if(!taskConfig.env) taskConfig.env = {};
	if(!taskConfig){
		console.error("task " + task + " is not exist");
		process.exit(1);
	}
	libFile.mkdirpSync(taskConfig.target);
	console.log("\nload configs ...");
	makeFromNs(taskConfig);
	makeFromMods(taskConfig);
	console.log("\ngenerate files ...");
	taskConfig.src.forEach(function(src){
		walk(src, taskConfig.target, taskConfig.env);
	});
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


function addParams(config, defaultConfig){
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
function replaceParams(config, config2){
	if(!config) {config = config2; return; }
	libObject.iterate2(config2, config, function(key, itConfig, itConfig2){
		itConfig2[key] = itConfig[key];
	}, function(key, itConfig, itConfig2){
		if(!libObject.isArray(itConfig2[key])){
			itConfig2[key]= [];
		}
		itConfig[key].forEach(function(v){
			itConfig2[key].push(v);
		});
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
function loadSubPath(nsSubPath, taskConfig, modConfig){
	var config, rtnConfig;
	
	if(fs.existsSync(nsSubPath + "/config.json")){
		console.log("\tget: " + nsSubPath + "/config.json");
		config = libFile.readJSON(nsSubPath + "/config.json"); 
	}else{
		config = {};
	}

	libObject.each(config.dep, function(dep){
		makeFromNs(taskConfig, dep);
	});

	if(fs.existsSync(nsSubPath + "/loader.js")){
		console.log("\tget: " + nsSubPath + "/loader.js");
		rtnConfig = require(path.resolve(nsSubPath) + "/loader")(taskConfig.env, modConfig);
	}
	if(!rtnConfig) rtnConfig = {};
	if(!rtnConfig.src){
		if(fs.existsSync(nsSubPath + "/src"))
			taskConfig.src.push(nsSubPath + "/src");
	}else{
		libObject.each(rtnConfig.src, function(src){
			if(fs.existsSync(nsSubPath + "/" + src))
				taskConfig.src.push(nsSubPath + "/" + src);
		});
	}
}

function makeFromNs(taskConfig, ns){	

	if(!ns) ns = taskConfig.ns;
	if(!ns) return;

	globalConfig.sys.nsPaths.forEach(function(nsPath){
		var nsSubPath = nsPath + "/" + ns;
		if(fs.existsSync(nsSubPath)){
			loadSubPath(nsSubPath, taskConfig);
		}
	});
}
function makeFromMods(taskConfig){	
	if(!taskConfig.mod) return;
	globalConfig.sys.modPaths.forEach(function(modPath){
		for (var mod in taskConfig.mod){
			var modConfig  = taskConfig.mod[mod];

			var modSubPath = modPath + "/" + mod;
			if(fs.existsSync(modPath)){
				loadSubPath(modSubPath, taskConfig, modConfig);
				if(!taskConfig.ns) return;
				var modnsSubPath = modSubPath + "/" + taskConfig.ns;
				if(fs.existsSync(modnsSubPath)){
					loadSubPath(modnsSubPath, taskConfig, modConfig);
				}

			}
		}
	});
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
		console.log("!!!"+dir + "/psid.json not works");
		return;
	}
	configs.forEach(function(config, configi){
// files: copy hetero
		if(libObject.isArray(config.files)){
			libFile.mkdirpSync(tdir);
			if(config.parse)
				config.files.forEach(function(f){
					var t = tdir + "/" + path.basename(f);
					console.log("\tfile: " + f);
					console.log("\t====> " + t);
					fs.writeFileSync(t, tmpl(fs.readFileSync(f), {global: env, dir: path.basename(tdir)}));
				});
			else
				config.files.forEach(function(f){
					var t = tdir + "/" + path.basename(f);
					if(f != t){
						console.log("\tfile: " + f);
						console.log("\t====> " + t);
						libFile.copySync(f, t);
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


			var subenvs;
			if(config.env){
				subenvs = config.env;
			}else if(config.envlink){
				subenvs = env[config.envlink];
			}else if(!subenvs){
				subenvs = {};
				subenvs[dir] = {};
			}
			if(!subenvs){
				console.log("!!!"+dir + "/psid.json config " + configi + " not works");
				return;
			}
				
			if(libObject.isArray(subenvs)){
				console.log("the config for psid should not be array");
				process.exit(1);
			}

			
			for (var subkey in subenvs){
				var subenv = subenvs[subkey];

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
				if(!subenv.name) subenv.name = subkey;
				if(config.filename){
					var filename = tmpl(config.filename, subenv);
					var t = tdir + "/" + filename;
					console.log("\tfile: " + config.tpl);
					console.log("\t====> " + t);
					libFile.mkdirpSync(path.dirname(t));
					fs.writeFileSync(t, tmpl(tplStr, subenv));
				}else if(config.envname){
					console.log("\tfile: " + config.tpl);
					console.log("\t====> " + subenv.name);

					if(config.envname && !env[config.envname])
						env[config.envname] = {};
					env[config.envname][subenv.name] = tmpl(tplStr, subenv);

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
			console.log("\tfile: " + p);
			t = tdir + '/' + f.replace(/^disp./, "");				
			console.log("\t====> " + t);
			libFile.mkdirpSync(path.dirname(t));
			fs.writeFileSync(t, tmpl(fs.readFileSync(p).toString(), {global: env}));
		}
		else if(f.match(/\.disp$/)){
			console.log("\tfile: " + p);
			t = tdir + '/' + f.replace(/\.disp$/, "");
			console.log("\t====> " + t);
			libFile.mkdirpSync(path.dirname(t));
			fs.writeFileSync(t, tmpl(fs.readFileSync(p).toString(), {global: env}));
		}
		else if(dir != tdir){
			console.log("\tfile: " + p);
			t = tdir + '/' + f;
			console.log("\t===> " + t);
			libFile.mkdirpSync(path.dirname(t));
			libFile.copySync(p, t);
		}
	});
};


module.exports.methods = methods;
module.exports.set = set;
module.exports.run = run;
module.exports.tmpl = tmpl;
