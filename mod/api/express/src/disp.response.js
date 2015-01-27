module.exports.sendRes = function(func){
	var rtnFunc = function(req, res){
		func(req, function(err, result, errorCode){
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
/*^^if(global.log){$$*/
			var log = "\x1b[1;35m";
			if(typeof json != "string")
				log += JSON.stringify(json, undefined, 2);
			else
				log += "BLOCK";
			log += "\x1b[0m";
			console.log(log);
/*^^}$$*/
			res.send(json);
		});
	}
	return rtnFunc;
}
