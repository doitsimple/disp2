var path = require("path");
var libFile=require("./lib/file");
^^if(global.hasMultipart){$$
var multipart = require('connect-multiparty');
^^}$$
^^if(global.uploadPath){$$
var uploadPath = require("./constant").uploadPath;
^^}$$

var common = require("./controllers/common");
var sendRes = require("./response").sendRes;

var router = express.Router();
// Create our Express router
^^for (var key in global.apis){
 var api = global.apis[key];
 var authStr = "";
 if(api.auth) authStr = "auth.midware, ";
$$

 ^^
	 if(api.method.toLowerCase() == "rest"){
	 $$
 router.route("/^^=api.name$$/:id").get(^^=authStr$$sendRes(common.^^=api.name+"GET"$$));
 router.route("/^^=api.name$$").post(^^=authStr$$sendRes(common.^^=api.name+"POST"$$));
 router.route("/^^=api.name$$/:id").put(^^=authStr$$sendRes(common.^^=api.name+"PUT"$$));
 router.route("/^^=api.name$$/:id").delete(^^=authStr$$sendRes(common.^^=api.name+"DELETE"$$));
 ^^continue;}$$

^^
 var ctrlStr;
 if(!api.controller)
	 ctrlStr = "sendRes(common." + api.name + ")";
 else if(api.controllerMethod)
	 ctrlStr = "require('./controllers/" + api.controller + "')." + api.controllerMethod;
 else if(api.controller)
	 ctrlStr = "sendRes("+ api.controller + ")";
 if(api.customize)
	 ctrlStr = "sendRes(" + api.customize + ")";
 var midwareStr = "";$$

 ^^if(api.multipart){
	 midwareStr = "multipart({uploadDir: path.resolve(uploadPath + '/"+api.route + "/')}), ";
	 $$
libFile.mkdirpSync(path.resolve(uploadPath + "/^^=api.route$$"));
  ^^if(!api.controller){$$
router.route('/^^=api.route$$/:filename')
			.get(common.download^^=methods.ucfirst(api.name)$$);
  ^^}$$
 ^^}$$

 ^^var paramsStr = "";
 api.params.forEach(function(p){
	 paramsStr += ("/:" + p.name);
 });$$
router.route('/^^=api.route$$^^=paramsStr$$')
      .^^=api.method$$(^^=authStr$$^^=midwareStr$$^^=ctrlStr$$);
^^}$$


app.use('/api', router);

