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
	if(!api.controller){
$$
module.exports.^^=apiname$$ = function(req, fn){
	^^=methods.intepret("psid.assets/" + apiname +".js")$$
}
^^	
	}
}$$
