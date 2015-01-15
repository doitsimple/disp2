// Load required packages
var Db = require('../db');

^^for (var key in global.apis){
 var api = global.apis[key];
 if(!api.customize && api.db){
$$
  ^^if(api.multipart){
		var field = api.fields[0].name;$$
exports.^^=api.name$$ = function(req, fn){
	console.log("UPLOAD");
	console.log(req.params);
	console.log(req.files);
	var id = req.params.id;
	if(!id){
		fn("no id " + id);
    return;
	}
	if(!req.files || !req.files.buffer){
		fn("no file");
    return;
  }
//	var id = req.files.image.name.match(/(\S+)\.\S+$/)[1];
	var name = path.basename(req.files.buffer.path);
	Db.^^=api.db$$.method.put(id, {"^^=field$$": name}, function(err){
		if(err){ fn(err); return};
		fn(null, {
			"^^=global.schemas[api.db].idField.name$$": id,
			"^^=field$$": name
		});
	});	
}
exports.download^^=methods.ucfirst(api.name)$$ = function(req, res){
	var fpath = path.resolve(uploadPath + "/^^=api.route$$/" + req.params.filename); 
	console.log(fpath);
	if(fs.existsSync(fpath)){
^^if(api.media != "image"){$$
^^}else{$$
		res.setHeader('Content-Type', 'image/jpeg');
^^}$$
		res.send(fs.readFileSync(fpath));
	}
	else
		res.status(500).send({error: "not exist"});
}


^^}$$

  ^^}else{$$
exports.^^=api.name$$ = function(req, fn){
	fn(null, "hehe");
}
  ^^}$$

^^}$$

