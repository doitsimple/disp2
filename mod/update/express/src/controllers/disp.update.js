var uploadPath = "^^=global.uploadPath$$";
var path = require("path");
var fs = require("fs");
var Db = require("../db");
var libString =require("../lib/string");
function getLatestVersion(fn){
	Db.models.version.method.gets({sort: {version: -1}, limit: 1}, {}, function(err, doc){
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
		if(doc == null)
			fn("nothing updated");
		if(libString.compareVersion(version, doc.version) < 0)
			fn(null, {"existUpdate": true});
		else
			fn(null, {"existUpdate": false});
	});
}
module.exports.downloadLatest = function(req, fn){
	getLatestVersion(function(err, doc){
    if(err) {fn(err); return;}
		var fpath = path.resolve(uploadPath + "/uploadUpdateFile/" + doc.apk);
		if(fs.existsSync(fpath)){
			fn(null, fs.readFileSync(fpath));
		}
		else
			fn("file not exist " +fpath);
  });
}

module.exports.uploadUpdateFile = function(req, fn){
  console.log("UPLOAD");
  console.log(req.files);
//  var id = req.files.image.name.match(/(\S+).\S+$/)[1];
  var name = path.basename(req.files.buffer.path);
	var vs = req.files.buffer.originalFilename.match(/(\d\.\d+)\.[^\.]+$/);
	console.log(vs);
	if(!vs || !vs.length) {fn("filename format error"); return;}
	var version = vs[1];
  Db.models.version.method.post({"version": version, "apk": name}, function(err){
    if(err){ fn(err); return; }
    fn(null, {
      "version": version
    });
  });
}
