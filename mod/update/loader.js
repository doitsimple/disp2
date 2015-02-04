var ucfirst = require("../../lib/js/string").ucfirst;
module.exports = function(env, config){
	if(!config) return;
	for (var name in env.update){
		env.update[name].name = name;
		if(config.frontend){
			env.apis["checkUpdate" + ucfirst(name)] = {
				"method": "post",
				"text": "查看" +name+ "版本更新",
				"fields": [
					{
						"name": "version"
					}
				]
			};
		}
		if(config.backend){
			env.apis["upload" + ucfirst(name)] = {
				"text": "上传" + name,
				"multipart": true,
				"method": "post",
				"media": "File",
				"auth": true
			};
		}
	}
}
