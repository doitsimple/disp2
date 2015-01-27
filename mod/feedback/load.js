var libString = require("../../lib/js/string");
var ucfirst = libString.ucfirst;
module.exports = function(env, config){
	for (var name in env.feedback){
		var feedbackConfig = env.feedback[name];
		if(!config) continue;
		if(config.frontend){
			env.apis["send"+ucfirst(name)] = {
				"method": "post",
				"text": "发送" + feedbackConfig.text,
				"fields": [
					{
						"name": "content"
					}
				],
				"auth": true
			};
		}
		if(config.backend){
			env.apis["list"+ucfirst(name)] = {
				"method": "get",
				"text": "获取" + feedbackConfig.text,
				"params": [
					{
						"name": "userid"
					}
				],
				"auth": true
			}
		}
	}
}
