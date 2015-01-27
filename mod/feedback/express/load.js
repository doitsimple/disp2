var libString = require("../../../lib/js/string");
var ucfirst = libString.ucfirst;
module.exports = function(env, config){
	for (var name in env.feedback){
		var feedbackConfig = env.feedback[name];
		env.schemas[name] = {
			"fields": [
				{
					"name": "_id",
					"type": "BigInteger",
					"default": "autoinc",
					"auto": true
				},
				{
					"name": "userid",
					"type": "BigInt"
				},
				{
					"name": "content",
					"type": "String",
					"text": "内容"
				},
				{
					"name":"create_time",
					"type":"DateTime",
					"text": "创建时间",
					"default": "now",
					"auto": true
				}
			]
		}
		env.nodeControllerFiles[name] = true;
		if(!config) continue;
		if(config.frontend){
			env.apis["send"+ucfirst(name)].controller = ucfirst(name) + ".send";
		}
		if(config.backend){
			env.apis["list"+ucfirst(name)].controller = ucfirst(name) + ".list";
		}
	}
}
