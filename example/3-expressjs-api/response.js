var libObject = require("./lib/object.js");
module.exports.sendRes = function(func){
	var rtnFunc = function(req, res){
		func(req, function(err, result, errorCode){
			if(err == "set"){
				res.set('Content-Type', 'application/json');
				return;
			}
			var json;
			if(errorCode) 
				json = {
          errorCode: errorCode,
          error: err,
          result: result
        };
			else if(err)
				json = {
					error: err,
          result: result
				};
			else
				json = result;
/**/
			res.send(json);
		});
	}
	return rtnFunc;
}
