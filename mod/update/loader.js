module.exports = function(env, config){

	env.schemas.version = {
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
				"name": "apk",
				"type": "Path",
				"text": "apk文件"
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
		env.apis.downloadLatest = {
			"route": "latest.apk",
			"method": "get",
      "text": "下载最新版本"
		};
	}
	if(config.backend){
		env.apis.uploadUpdateFile = {
			"text": "上传APK",
      "multipart": true,
      "method": "post",
      "media": "File",
      "auth": true
		}
	}
}
