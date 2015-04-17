rootApp.factory('API', function($http, reqService){
	var methods = {};
	var gapis = [
		"listproject"
	];
	var papis = [
		"gen",
		"readlist"
	];
	methods.read = function(file, fn){
		$.get("/read/" + encodeURIComponent(file), function(data){
			fn(null, data);
		});
	}
	methods.write = function(file, content, fn){
		reqService.post("/write/" + encodeURIComponent(file), content, function(err, data, status){
			if(!err && status == 200){
				fn(null, data);
			}else{
				console.log(err);
				console.log(status);
				fn("api error");
				alert("api error");
			}
		});
	}
	gapis.forEach(function(gapi){
		methods[gapi] = function(fn){
			reqService.get("/gapi/listproject", function(err, data, status){
				if(!err && status == 200){
					fn(null, data);
				}else{
					console.log(err);
					console.log(status);
					fn("api error");
					alert("api error");
				}
			});
		}
	});
	papis.forEach(function(papi){
		methods[papi] = function(project, fn){
			reqService.get("/papi/" + papi + "/" + project, function(err, data, status){
				if(!err && status == 200){
					fn(null, data);
				}else{
					console.log(err);
					console.log(status);
					fn("api error");
					alert("api error");
				}
			});
		}
	});
	return methods;
});
