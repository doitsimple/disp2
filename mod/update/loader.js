module.exports = function(env, config){
	if(!config) return;

	if(config.frontend){
		env.apis.checkUpdate = {
			"method": "post",
      "text": "查看版本更新",
      "fields": [
        {
          "name": "version"
        }
      ]
		};
		env.apis.downloadUpdate = {
      "method": "get",
      "text": "下载最新版本"
		};
	}
	if(config.backend){
		env.apis["uploadUpdateFile"] = {
      "text": "上传最新版本",
      "multipart": true,
      "method": "post",
      "media": "File",
      "auth": true
    };
	}
}
