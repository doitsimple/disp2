var utils = require('../utils');
var async = require('async');
^^
if(usernameField || passwordField || tokenField || codeField){
	console.error("usernameField || passwordField || tokenField || codeField is not supported");
	process.exit(1);
}
$$	


var mysql = require('../dbconn').mysql;
var bcrypt = require('bcrypt');

var createTableStr = "CREATE TABLE IF NOT EXISTS ^^=name$$ (";
^^len = fields.length;fields.forEach(function(f,i){$$
createTableStr += '^^=f.name$$ ^^=dbdef.getType(f, "mysql")$$';
 ^^if(dbdef.getType(f, "mysql") == "ENUM"){$$
createTableStr += ""
 ^^}$$
 ^^if(f.default == "autoinc"){$$
createTableStr += " AUTO_INCREMENT";
 ^^}$$																		
 ^^if(f.default == "now"){$$
createTableStr += " DEFAULT NOW()";
 ^^}$$
 ^^if(f.unique){$$
createTableStr += " UNIQUE";
 ^^}$$		
 ^^if(f.required){$$
createTableStr += " NOT NULL";
 ^^}$$		
 ^^if(f.name == idField){$$
createTableStr += " PRIMARY KEY";
 ^^}$$
 ^^if(i != len-1){$$
createTableStr += ", ";
 ^^}$$									 
^^})$$
createTableStr += ");";
var Model = {};
Model.method = {};
Model.method.populate = function(fn){
	mysql.query(createTableStr, function(err, info){
		if(err){
			console.error("create table ^^=name$$ failed\n" + err.toString() + "\n" + createTableStr);
			fn(err);
		}else{
			fn(null);
		}
	});
};
Model.method.gets = function(criteria, cols, fn){
	var sort, limit, skip, key;
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
	var selectStr = mysql.getSelectStr(criteria, cols, "^^=name$$");
	if(sort){
		var sorts = [];
		for (key in sort){
			if(sort[key]==-1)
				sorts.push(key + " DESC");
			else
				sorts.push(key + " ASC");
		}
		selectStr += " ORDER BY " + sorts.join(", ");
	}
	if(limit){
		selectStr += " LIMIT "+limit;
		if(skip){
			selectStr += ", "+skip;
		}
	}
	if(skip && !limit)
		console.error("skip must be used with limit for mysql");
	console.log(selectStr);
	mysql.query(selectStr, function(err, models){
    if (err)
      fn(err);
		else
			fn(null, models);
  });
}
Model.method.get = function(where, cols, fn){
	if(typeof where == "string" || typeof where == "number")
		where = {"^^=idField$$": where};

	mysql.query(mysql.getSelectStr(where, cols, "^^=name$$") + " LIMIT 1", function(err, models){
    if (err)
      fn(err);
		else
			if(models.length){
				fn(null, models[0]);
			}else{
				fn(null, null);
			}
  });
}
Model.method.post = function(doc, fn){
  mysql.query(mysql.getInsertStr(filter(doc), "^^=name$$"), function(err, result){
    if (err)
      fn(err);
		else
			fn(null, result);//result contains insertId
	});
}
Model.method.delete = function(json, fn){
  mysql.query(mysql.getDeleteStr(json, "^^=name$$"), function(err, result){
    if (err)
      fn(err);
		else
			fn(null, result);//result contains insertId
	});
}
Model.method.put = function(where, doc, fn){
	if(typeof where == "string" || typeof where == "number")
		where = {"^^=idField$$": where};
	console.log(mysql.getUpdateStr(where, filter(doc), "^^=name$$"));
	mysql.query(mysql.getUpdateStr(where, filter(doc), "^^=name$$"), function(err, result){
		if(err) {fn(err); return;}
		if(result.affectedRows)
			fn(null);
		else
			fn("nothing updated");
	});
}
Model.method.drop = function(fn){
	mysql.query("DROP TABLE ^^=name$$", function(err, result){
		fn(err);
	});
}


^^fields.forEach(function(f){if(f.encrypt){$$
Model.method.verifyId^^=ucfirst(f.name)$$ = function(id, password, cb) {
	Model.method.get(id, {"^^=f.name$$":1}, function(err, result){
		utils.encrypt.bcryptcompare(password, result.^^=f.name$$, function(err, isMatch) {
			if (err) return cb(err);
			cb(null, isMatch);
		});
	});
}
^^}})$$

Model.method.posts = function(array, fn){
	async.eachSeries(array, Model.method.post, function(err){
		if(err) fn(err);
		else fn(null, {success: true});
	});
}

Model.method.generateTest = function(){
	var json = {};

	^^fields.forEach(function(field){if(!field.auto){$$
	json.^^=field.name$$ = ^^=dbdef.getType(field, "jstest")$$;
	^^}})$$
	
	return json;
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
