^^if(global.hasMultipart){$$
var multipart = require('connect-multiparty');
var path = require("path");
^^}$$
var common = require("./controllers/common");
var sendRes = require("./response").sendRes;

var router = express.Router();
// Create our Express router
^^for (var key in global.apis){
 var api = global.apis[key];
 var authStr = "";
 if(api.auth) authStr = "auth.midware, ";
 var ctrlStr;
 if(!api.controller)
	 ctrlStr = "sendRes(common." + api.name + ")";
 else if(api.controllerMethod)
	 ctrlStr = "require('./controllers/" + api.controller + "')." + api.controllerMethod;
 else if(api.controller)
	 ctrlStr = "sendRes("+ api.controller + ")";
 if(api.customize)
	 ctrlStr = "sendRes(" + api.customize + ")";
 if(api.multipart){$$
libFile.mkdirpSync(path.resolve(uploadPath + "/^^=api.route$$"));
router.route('/^^=api.route$$')
      .post(^^=authStr$$multipart({uploadDir: path.resolve(uploadPath + "/^^=api.route$$/")}), sendRes(common.^^=api.name$$));
router.route('/^^=api.route$$/:filename')
			.get(common.download^^=methods.ucfirst(api.name)$$);
 ^^}else{var paramsStr = "";
	 api.params.forEach(function(p){
		 paramsStr += ("/:" + p.name);
	 });$$
router.route('/^^=api.route$$^^=paramsStr$$')
      .^^=api.method$$(^^=authStr$$^^=ctrlStr$$);
 ^^}$$
^^}$$


app.use('/api', router);

