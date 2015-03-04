^^
var db = global.codeSchema.name;
var userDb = global.userSchema.name;
var schema = global.codeSchema;
if(!local.pseudo) pseudo = false;
$$
var Db = require('../models/^^=db$$');
var userDb = require('../models/^^=userDb$$');
var random = require('../lib/random');
var webreq = require('../lib/webreq');
var async = require("async");

function sendSms(body, fn){
	if(body.body) body = body.body;
	if(!body.phone)
		fn("no phone");

	var json = ^^=JSON.stringify(params)$$;
	json.^^=phoneField$$ = body.phone;

	var code = body.code || random.genNum(6);

	json.^^=codeField$$ = code;
	^^if(local.code2Field){$$
	if(body.code2){
		json.^^=code2Field$$ = body.code2;
	}
  ^^}$$

	json.^^=templateField$$ = body.template || "^^=templates[0]$$";

	Db.method.get({"^^=schema.phoneField.name$$": body.phone}, {}, function(err, doc){
		if(err){
			fn(err);
			return;
		}	
		if(!doc){
			doc = new Db({
				"^^=schema.phoneField.name$$": body.phone,
				"^^=schema.codeField.name$$": code,
				"^^=schema.timeField.name$$": new Date()
			});
		}else if(new Date().getTime() - doc.^^=schema.timeField.name$$.getTime() < 60000){
			fn("wait 60s to send next", null, 1);
			return;
		}
		doc.^^=schema.codeField.name$$ = code;
		doc.^^=schema.timeField.name$$ = new Date();
		console.log(doc);
		doc.save(function(err){
			if(err){
				fn(err);
				return;
			}
^^if(pseudo){$$
			console.log("send to "+body.phone);
			console.log(json);
			fn(null, {"code": code});
^^}else{$$
			console.log(json);
			webreq.postForm("^^=url$$", json, function(err, result){
				if(err) fn(err);
				else if(^^=success$$)
					fn(null, {success: true});
				else
					fn("第三方短信发送接口返回错误", result, 2);
			});
^^}$$
		});
	});

}
module.exports.sendSms = sendSms;
module.exports.sendSmsMultiple = function(body, fn){
	if(body.body) body = body.body;
	async.eachSeries(body.configs, function(config, cb){
		sendSms(config, function(err){
			if(err) {console.log("send sms error "+config.phone);}
			cb();
		});
	}, fn);

}
module.exports.sendSmsCheckNoPhone = function(req, fn){
	userDb.method.get({"^^=global.userSchema.phoneField.name$$":req.body.phone}, {}, function(err, doc){
		if(err){
			fn("database error: findOne failed: "+req.body.phone);
			return;
		}
		if(doc){
			fn("phone already exists", null, 3);
			return;
		}
		sendSms(req, fn);
	});
}
module.exports.sendSmsCheckPhone = function(req, fn){
	userDb.method.get({"^^=global.userSchema.phoneField.name$$":req.body.phone}, {}, function(err, doc){
		if(err){
			fn("database error: findOne failed: "+req.body.phone);
			return;
		}
		if(!doc){
			fn("phone not exists", null, 3);
			return;
		}
		sendSms(req, fn);
	});
}
module.exports.verifySMS = function(req, fn){
	Db.method.VerifyCode({
		"id":req.body.phone,
    "code":req.body.code,
		"minutes": 3
	}, function(err, doc){
		if(err) fn(err);
		else if(doc)
			fn(null, {result: true});
		else
			fn(null, {result: false});
	});
}
