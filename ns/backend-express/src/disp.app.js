// Load required packages
var express = require('express');
var bodyParser = require('body-parser');
var libFile = require("./lib/file");
^^if(global.hasMultipart){$$

var multipart = require('connect-multiparty');
var path = require("path");
^^}$$
^^if(global.uploadPath){$$
var uploadPath = "^^=global.uploadPath$$";
^^}$$
//authentication/authorization module

var common = require('./controllers/common');
var auth = require('./controllers/auth');

^^if(global.code){$$
var code = require('./controllers/^^=global.codeSchema.name$$');
^^}$$
var sendRes = require("./response").sendRes;
require('./db');
// Create our Express application
var app = express();

var passport = require("passport");
// Use the passport package in our application
app.use(passport.initialize());


// Use the body-parser package in our application
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());


^^if(global.static){$$
app.use(express.static(__dirname + '/^^=global.static$$'));
^^}$$


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
router.route('/^^=api.route$$/:id')
      .post(^^=authStr$$multipart({uploadDir: path.resolve(uploadPath + "/^^api.route$$/")}), ^^=ctrlStr$$);
router.route('/^^=api.route$$/:filename')
			.get(^^=authStr$$sendRes(common.download^^=methods.ucfirst(api.name)$$));
 ^^}else{var paramsStr = "";
	 api.params.forEach(function(p){
		 paramsStr += ("/:" + p.name);
	 });$$
router.route('/^^=api.route$$^^=paramsStr$$')
      .^^=api.method$$(^^=authStr$$^^=ctrlStr$$);
 ^^}$$
^^}$$


app.use('/api', router);

app.set('port', ^^=global.port$$);

module.exports = app;
