// Load required packages
var path = require("path");
var fs = require("fs");
^^
if(!methods.isEmpty(global.schemas)){$$
var Db = require('../db');
^^}$$
^^if(global.uploadPath){$$
var uploadPath = require("../constant").uploadPath;
^^}$$
^^for (var key in global.multipartApiContents){$$
^^=global.multipartApiContents[key]$$
^^}$$

^^	
for (var apiname in global.apis){
	var api = global.apis[apiname];
	if(!api.controller && !api.multipart && api.method != "rest"){
$$
module.exports.^^=apiname$$ = function(req, fn){
	^^=methods.intepret("psid.assets/" + apiname +".js")$$
}
^^}$$
	^^if(api.method == "rest"){$$
var ^^=apiname$$Methods = Db.models.^^=api.db$$.methods;

module.exports.^^=apiname$$GET = function(req, fn){
	^^=apiname$$Methods.get(req.params.id, {}, fn);
}
module.exports.^^=apiname$$POST = function(req, fn){
	^^=apiname$$Methods.add(req.body, fn);
}
module.exports.^^=apiname$$PUT = function(req, fn){
	^^=apiname$$Methods.update(req.params.id, req.body, fn);
}
module.exports.^^=apiname$$DELETE = function(req, fn){
	^^=apiname$$Methods.delete(req.params.id, fn);
}
	^^}$$
^^}$$
