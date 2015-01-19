var dbdef = require("./dbdef");
module.exports = function(env){
	if(!env.schemas){
		console.error("database module must have schemas");
		process.exit(1);
	}
	for (var key in env.schemas){
		dbdef.extendSchema(env.schemas[key], key, env);
	}
	if(env.hasMongo){
		if(!env.mongo) env.mongo = {};
		if(!env.mongo.port) env.mongo.port = 27017;
		if(!env.mongo.host) env.mongo.host = "localhost";
		if(!env.mongo.db) env.mongo.db = "test";
	}
	if(env.hasMysql){
		if(!env.mysql) env.mysql = {};
		if(!env.mysql.port) env.mysql.port = 3306;
		if(!env.mongo.host) env.mongo.host = "localhost";
		if(!env.mongo.db) env.mongo.db = "test";
		if(!env.mongo.user) env.mongo.user = "root";
	}
	env.dbdef = dbdef;
}
