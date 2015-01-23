var libDate = require("./lib/date");
^^if(global.hasMongo){
 var mongo = global.mongo;
 $$
var mongoose = require("mongoose");
mongoose.connect('mongodb://^^=mongo.host$$:^^=mongo.port$$/^^=mongo.db$$');
^^}$$

^^if(global.hasMysql){var mysql = global.mysql;$$
var mysql = require("mysql");
var FFI = require("ffi");
var libc = new FFI.Library(null, {
  "system": ["int32", ["string"]]
});
var run = libc.system;

run('mysql -h ^^=mysql.host$$ -u ^^=mysql.user$$ ^^if(mysql.password){$$-p^^=mysql.password$$ ^^}$$-e "CREATE DATABASE IF NOT EXISTS ^^=mysql.db$$"');
var mysqlConn = mysql.createPool({
	connectionLimit : 10,
	host     : '^^=mysql.host$$',
	user     : '^^=mysql.user$$',
^^if(mysql.password){$$
	password : '^^=mysql.password$$',
^^}$$
	database : '^^=mysql.db$$'
});


mysqlConn.getInsertStr = function(json, table){
	var cols = [];
	var values = [];
	for (var key in json){
		switch(typeof json[key]){
			case "string":
				cols.push(key);
				values.push("'"+json[key]+"'");
				break;
			case "object":
				cols.push(key);
				values.push("'"+libDate.formatDate(json[key], "yyyy-MM-dd hh:mm:ss")+"'");
				break;
			default:
				cols.push(key);
				values.push(json[key]);
		}
	}
	return "INSERT INTO " + table + "(" + cols.join(", ") + ") VALUES (" + values.join(", ") + ")";
}
function genEqualStr(where, sep){
	if(!sep) sep = " and ";
	var whereStr, key;
	if(!where)
		whereStr = "";
	else{
		var wheres = [];
		for (key in where){
			switch(typeof where[key]){
				case "string":
					wheres.push(key + " = " + "'"+where[key]+"'");
					break;
				case "object":
					wheres.push(key + " = " + "'" + libDate.formatDate(where[key], "yyyy-MM-dd hh:mm:ss") + "'");
					break;
				default:
					wheres.push(key + " = " + where[key]);
			}
		}
		whereStr = wheres.join(sep);
	}
	return whereStr;
}
mysqlConn.getSelectStr = function(where, coljson, table){
	var colStr, key;
	var cols = [];
	for (key in coljson)	cols.push(key);
	colStr = cols.join(", ");
	if(!colStr) colStr = "*";
	var str = "SELECT "+colStr +" FROM " + table;
	if(where && Object.keys(where).length)
		str += " WHERE " +  genEqualStr(where);	
	return str;
}
mysqlConn.getUpdateStr = function(where, doc, table){
	var incstr = "";
	if(doc.$inc){
		for (var key in doc.$inc){
			incstr += (", " + key + " = " + key + " + " + doc.$inc[key]);
		}
		delete doc.$inc;
	}
	var str = "UPDATE "+table + " SET ";
	var setStr = genEqualStr(doc, ", ");	
	if(incstr){
		if(!setStr)
			str += incstr.substr(1);
		else
			str += (setStr + incstr);
	}
	else{
		str += setStr;
	}
	if(where && Object.keys(where).length)
		str += " WHERE " +  genEqualStr(where);
	return str;
}
mysqlConn.getDeleteStr = function(where, table){
	var str = "DELETE FROM " + table;
	if(where && Object.keys(where).length)
		str += " WHERE " +  genEqualStr(where);
	return str;
}

exports.mysql = mysqlConn;
^^}$$


module.exports.models = {};
^^for (var key in global.schemas){
	var sname = global.schemas[key].name;
	var usname = methods.ucfirst(sname);$$
module.exports.models.^^=sname$$ = ^^=usname$$ = require('./models/^^=sname$$');
^^=usname$$.method.populate(function(err){
	if(err) console.log(err);
});

^^}$$
