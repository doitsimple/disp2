var uploadPath = require("../constant").uploadPath;
var path = require("path");
var fs = require("fs");
var Db = require("../db");
var libString =require("../lib/string");
var libFile = require("../lib/file");
function getLatestVersion(fn){
	Db.models["^^=name$$"].method.gets({sort: {version: -1}, limit: 1}, {}, function(err, doc){
		if(err) {fn(err); return;}
		if(!doc.length)
			fn(null, null);
		else
			fn(null, doc[0]);
	});
}
module.exports.checkUpdate = function(req, fn){
	var version = req.body.version;
	getLatestVersion(function(err, doc){
		if(err) {fn(err); return;}
		if(doc == null){
			fn(null, {"existUpdate": false, message: "nothing to updated"});
			return;
		}
		if(libString.compareVersion(version, doc.version) < 0)
			fn(null, {"existUpdate": true});
		else
			fn(null, {"existUpdate": false});
	});
}
module.exports.download = function(req, fn){
	var filename = req.params.filename;
	if(path.basename(filename).match(/^latest/))
		getLatestVersion(function(err, doc){
			if(err) {fn(err); return;}
			var fpath = path.resolve(uploadPath + "/upload^^=methods.ucfirst(name)$$/" + doc.file);
			if(fs.existsSync(fpath)){
				fn(null, fs.readFileSync(fpath));
			}
			else
				fn("file not exist " +fpath);

		});
	else{
		var fpath = path.resolve(uploadPath + "/upload^^=methods.ucfirst(name)$$/" + filename);
		if(fs.existsSync(fpath)){
      fn(null, fs.readFileSync(fpath));
    }
    else
      fn("file not exist " +fpath);
	}
		

}

module.exports.upload = function(req, fn){
	if(!req.files.buffer){
		fn("nothing to update");
		return;
	}
//  var id = req.files.image.name.match(/(\S+).\S+$/)[1];
  var dir = path.dirname(req.files.buffer.path);
	var name = path.basename(req.files.buffer.originalFilename);
	libFile.mvSync(req.files.buffer.path, dir + "/" + name);
	var vs = req.files.buffer.originalFilename.match(/([\d\.]+\d)\.[^\.]+$/);
	if(!vs || !vs.length) {fn("filename format error"); return;}
	var version = vs[1];
  Db.models["^^=name$$"].method.post({"version": version, "file": name}, function(err){
    if(err){ fn(err); return; }
    fn(null, {
      "version": version
    });
  });
}
