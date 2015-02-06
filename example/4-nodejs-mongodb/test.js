var Db = require("./db");
var methods = Db.models.testcontent.methods;
methods.add({
	"name": "abc",
	"content": "the content of abc"
}, function(err, result){
	if(err) {console.log(err); process.exit(1);}
	console.log("This is id of the added term:");
	console.log(result.insertId);


	methods.modify({"name": "abc"}, {"content": "the content of abc2"}, function(err, result){
		if(err) {console.log(err); process.exit(1);}
		console.log("modified");


		methods.get({"name": "abc"}, {}, function(err, doc){
			if(err) {console.log(err); process.exit(1);}
			console.log("This is the added term:");
			console.log(result);


			methods.delete({_id: doc._id}, function(err){
				if(err) {console.log(err); process.exit(1);}
				console.log("deleted");
				process.exit(0);
			});
		});
	});
});
