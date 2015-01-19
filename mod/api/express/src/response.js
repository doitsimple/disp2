module.exports.sendRes = function(func){
	var rtnFunc = function(req, res){
		func(req, function(err, result, errorCode){
			if(errorCode)
				res.send({
					errorCode: errorCode,
					error: err
				});
			else if(err)
				res.send({
					error: err
				});
			else
				res.send(result);
		});
	}
	return rtnFunc;
}
