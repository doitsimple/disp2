module.exports = function(env, config){
	env.nodeControllerFiles.update = true;
	if(!config) return;
	if(config.frontend){
		env.apis.downloadLatest = {
			"route": "latest.apk",
			"method": "get",
      "text": "下载最新版本"
		};
		env.apis.checkUpdate.controller = "Update.checkUpdate";
		env.apis.downloadLatest.controller = "Update.downloadLatest";
	}
	if(config.backend){
		env.apis.uploadUpdateFile.controller = "Update.uploadUpdateFile";
	}
}
