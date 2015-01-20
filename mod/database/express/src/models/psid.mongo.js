var async = require('async');
var mongoose = require('mongoose');
^^if(passwordField){$$
var libEncrypt = require("../lib/encrypt");
^^}$$
^^
var dbdef = global.dbdef;
var ucfirst = methods.ucfirst;
var autoIncField = false;
function getDefault(field){
	switch(field.default){
		case "now":
			return ", default: Date.now";
			break;
		case "autoinc":
			autoIncField = field.name;
			return "";
			break;
	}
}
$$
// Define our user schema
var json = {};
^^var uniques = [];fields.forEach(function(field){$$
json.^^=field.name$$ = { type: ^^=dbdef.getType(field, "mongoose")$$^^if(field.required){$$, required: true^^}$$^^if(field.default){$$^^=getDefault(field)$$^^}$$ };
^^if(field.unique){
uniques.push("\""+field.name+"\": 1");
}$$
^^})$$
var ^^=ucfirst(name)$$Schema = new mongoose.Schema(json);

^^if(autoIncField){$$
var AutoIncSchema = new mongoose.Schema({
	next: Number
});
var AutoIncModel = mongoose.model('^^=name$$_next', AutoIncSchema);
^^}$$
// Define our user schema



^^if(passwordField || autoIncField){$$
// Execute before each user.save() call
^^=ucfirst(name)$$Schema.pre('save', function(callback) {
  var model = this;


^^fields.forEach(function(f){if(f.encrypt){$$
  // Break out if the password hasn't changed
  if (model.isModified('^^=f.name$$')){
  // Password changed so we need to hash it
		model.^^=f.name$$ = libEncrypt.bcrypt(model.^^=f.name$$, 5);
	}
^^}})$$

	^^if(autoIncField){$$
	if(!model.^^=autoIncField$$){
		
		AutoIncModel.findOne({}, function(err, nexti){
			model.^^=autoIncField$$ = nexti.next;
			AutoIncModel.findOneAndUpdate({}, {"$inc": {"next":1}}, function(err, nexti){
        callback(err);
      });
		})
	}else{
		callback();
	}
	^^}else{$$
	callback();
	^^}$$
	
});
^^}$$


^^if(passwordField){$$
^^=ucfirst(name)$$Schema.methods.verifyPassword = function(password, cb) {
	^^if(passwordField.encrypt){$$
  libEncrypt.bcryptcompare(password, this.^^=passwordField.name$$, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
	^^}else{$$	
	cb(null, this.^^=passwordField.name$$ == password);
	^^}$$
};
^^}$$

^^if(tokenField){$$
var hat = require("../lib/random").hat;

^^=ucfirst(name)$$Schema.methods.getToken = function(cb) {
//	if(!this.^^=tokenField.name$$){
		var token = hat();	
		this.^^=tokenField.name$$ = token;
		this.save(function(){
			cb(null, token);
		});
/*
	}else{
			cb(null, this.^^=tokenField.name$$);
	}
*/
}
^^}$$




var Model = mongoose.model('^^=name$$', ^^=ucfirst(name)$$Schema);
^^if(autoIncField){$$
Model.autoinc = AutoIncModel;
^^}$$

Model.method = {};
Model.method.get = function(where, fields, fn){
	if(typeof where == "string" || typeof where == "number")
		where = {^^=idField.name$$: where};
	Model.findOne(where, fields, fn);
}
Model.method.gets = function(criteria, fields, fn){
	var sort, limit, skip;
	if(criteria.sort){
		sort = criteria.sort;
		delete criteria.sort;
	}
	if(criteria.skip){
		skip = criteria.skip;
		delete criteria.skip;
	}
	if(criteria.limit){
		limit = criteria.limit;
		delete criteria.limit;
	}

	var obj = Model.find(criteria, fields);
	if(sort) obj = obj.sort(sort);
	if(skip) obj = obj.skip(skip);
	if(limit) obj = obj.limit(limit);
	obj.exec(function(err, docs){
    if (err)
			fn(err);
		else{
			fn(null, docs);
		}
	});
}
Model.method.getsPage = function(criteria, fields, page, fn){

}
Model.method.post = function(doc, fn){
  var model = new Model(filter(doc));
  model.save(function(err, doc) {
    if (err)
			fn(err, 1);
		else{
			fn(null, {insertId: doc.^^=idField.name$$});
		}
  });
}
Model.method.put = function(where, doc, fn){
	if(typeof where == "string" || typeof where == "number")
		where = {"^^=idField.name$$": where};
	Model.findOne(where, function(err, ori_doc){
    if (err){	fn(err); return;}
		if(!ori_doc){
			fn("no doc find");
			return;
		}
		if(doc.$inc){
			for(var key in doc.$inc){
				ori_doc[key]+=doc.$inc[key];
			}
		}
		^^fields.forEach(function(field){$$
	  if(doc.^^=field.name$$ && doc.^^=field.name$$ != ori_doc.^^=field.name$$)
			ori_doc.^^=field.name$$ = doc.^^=field.name$$;
		^^})$$
		ori_doc.save(function(err){
			if(err)
				fn(err);
			else
				fn(null, ori_doc);
		});
	});
}

Model.method.delete = function(json, fn){
	Model.remove(json, function(err) {
    if (err) fn(err);
		else fn(null);
  });
}
Model.method.populate = function(callback){
//ensure uniqueness, mongoose unique has some unknown bug
	Model.findOne({}, function(err, json){
		if(err) {callback(err); return; }
		if(json) return;
^^if(uniques.length){$$
Model.collection.ensureIndex({ ^^=uniques.join(", ")$$ }, { "unique": true }, function(err){
	if(err) callback(err);
^^}$$

^^if(autoIncField){$$
AutoIncModel.findOne({}, function(err, json){
	if(err){ callback(err); return; }
	if(json && json.next) return;
	var ai = new AutoIncModel({next: 1});
	ai.save(function(err){
		if(err){ callback(err); return; }
^^}$$
^^if(passwordField && usernameField){$$

^^}$$
		callback(err);
^^if(autoIncField){$$
  });//ai.save
});//AutoIncModel.findOne
^^}$$

^^if(uniques.length){$$
});//Model.collection.ensureIndex
^^}$$

	}); //Model.findOne({}

}//Model.populate

Model.method.drop = function(fn){
	Model.collection.drop(function(err){
		var error = {}; 
		error.error = err;
		if(Model.autoinc)
			Model.autoinc.collection.drop(function(err){
				error.error2 = err;
				fn(error);
			});
		else
			fn(error);
	});
}

^^if(codeField){
if(!idField || !timeField){
	console.error("has codeField but no idField and timeField");
	process.exit(1);
}
$$

Model.method.VerifyCode = function(params, fn){
	var json = {
    "^^=idField.name$$": params.id,
    "^^=codeField.name$$": params.code,
    "^^=timeField.name$$": {
      $gt: new Date().getTime() - params.minutes*60000
    }
  };
	console.log(json);
	Model.findOne(json, function(err, doc){
		if(err){
			fn(err);
			return;
		}
		if(!doc){
			fn(null, false);
			return;
		}
		fn(null, true);
	});
}
^^}$$

^^fields.forEach(function(f){if(f.encrypt){$$
Model.method.verifyId^^=ucfirst(f.name)$$ = function(id, password, cb) {
	Model.method.get(id, {"^^=f.name$$":1}, function(err, result){
		libEncrypt.bcryptcompare(password, result.^^=f.name$$, function(err, isMatch) {
			if (err) return cb(err);
			cb(null, isMatch);
		});
	});
}
^^}})$$

Model.method.posts = function(array, fn){
	console.log("posts");
	async.eachSeries(array, Model.method.post, function(err){
		if(err) fn(err);
		else fn(null, {success: true});
	});

}


function filter(doc){
  var json = {};
	^^fields.forEach(function(field){$$
	if(doc.^^=field.name$$)
		json.^^=field.name$$ = doc.^^=field.name$$;
	^^})$$
	if(doc.$inc) json.$inc = doc.$inc;
	return json;
}
Model.method.filter = filter;
// Export the model
module.exports = Model;
