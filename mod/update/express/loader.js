module.exports = function(env, config){
	env.nodeControllerFiles.update = true;
	if(!config) return;
	if(config.frontend){
		env.apis.checkUpdate.controller = "Update.checkUpdate";
		env.apis.downloadUpdate.controller = "Update.downloadUpdate";
	}
	if(config.backend){
		env.apis.uploadUpdateFile.controller = "Update.uploadUpdateFile";
	}
}
