exports.^^=name$$ = function(req, fn){
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
	Db.models.^^=db$$.method.put(id, {"^^=field$$": name}, function(err){
		if(err){ fn(err);	return;	}
		fn(null, {
			"^^=global.schemas[db].idField.name$$": id,
			"^^=field$$": name
		});
	});
}

exports.download^^=methods.ucfirst(name)$$ = function(req, res){
	var fpath = path.resolve(uploadPath + "/^^=route$$/" + req.params.filename);
	console.log(fpath);
	if(fs.existsSync(fpath)){
^^if(media != "Image"){$$
^^}else{$$
		res.setHeader('Content-Type', 'image/jpeg');
^^}$$
		res.send(fs.readFileSync(fpath));
	}
	else
		res.status(500).send({error: "not exist"});
}
