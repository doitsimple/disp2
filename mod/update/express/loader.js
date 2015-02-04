var ucfirst = require("../../../lib/js/string").ucfirst;
module.exports = function(env, config){
	
	for (var name in env.update){

		
		env.nodeControllerFiles[name] = true;
		env.schemas[name] = {
			"fields": [
				{
					"name": "_id",
					"type": "BigInteger",
					"default": "autoinc",
					"auto": true
				},
				{
					"name": "version",
					"type": "String"
				},
				{
					"name": "file",
					"type": "Path",
					"text": "文件名"
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

		if(!config) continue;
		if(config.frontend){
			env.apis["download" + ucfirst(name)] = {
				"method": "get",
				"params": [	
					{
						"name": "filename"
					}
				],
				"text": "下载最新版本"
			};
			env.apis["checkUpdate" + ucfirst(name)].controller = ucfirst(name) + ".checkUpdate";
			env.apis["download" + ucfirst(name)].controller = ucfirst(name) + ".download";
		}
		if(config.backend){
			env.apis["upload" + ucfirst(name)].controller = ucfirst(name) + ".upload";
		}
	}
}
