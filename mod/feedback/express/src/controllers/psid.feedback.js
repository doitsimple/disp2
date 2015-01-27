var uploadPath = "^^=global.uploadPath$$";
var path = require("path");
var fs = require("fs");
var Db = require("../db");
module.exports.send = function(req, fn){
	if(!req.body.content) {fn("no content"); return;}
	Db.models.^^=name$$.method.post({
		userid: req.user._id,
		content: req.body.content
	}, function(err, doc){
		if(err) {fn(err); return;}
		fn(null, {success: true});
	});
}
module.exports.list = function(req, fn){
	if(!req.params.userid) {fn("no userid"); return;}
	Db.models.^^=name$$.method.gets({
		userid: req.params.userid
	}, {}, function(err, docs){
		if(err) {fn(err); return;}
		fn(null, docs);		
	});
}


