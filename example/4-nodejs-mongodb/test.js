var Db = require("./db");
var methods = Db.models.testcontent.methods;
methods.add({
	"name": "abc",
	"content": "the content of abc"
}, function(err, result){
	if(err) {console.log(err); process.exit(1);}
	console.log("This is id of the added term:");
	console.log(result.insertId);
	methods.adds([{name: "abd", content:"2"},{name: "abe", content:"3"},{name: "abf", content:"4"},{name: "abg", content:"5"}], function(err){
		console.log("add multiple items");
		methods.gets({skip:2, limit: 2}, {}, function(err, docs){
			console.log(docs);
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
	})
})
