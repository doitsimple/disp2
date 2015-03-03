rootApp.factory('reqService', function($http, authService){
	var methods = {};
	["get", "delete"].forEach(function(method){
		methods[method] = function(route, isAuth){
			var url = route;
			var config = {
				url: url,
				method: method.toUpperCase(),
				headers: {}
			};
			if(isAuth)
				config.headers.Authorization = "Bearer " + authService.getToken();
			return $http(config);
		};
	});
	["put", "post"].forEach(function(method){
		methods[method] = function(route, isAuth, data){
			var url = route;
			var config = {
				url: url,
				method: method.toUpperCase(),
				data: data,
				headers: {}
			};
			if(isAuth)
				config.headers.Authorization = "Bearer " + authService.getToken();
			return $http(config);
		};
	});
	methods["postMultipart"] = function(route, isAuth, file){
		var formData=new FormData();
		formData.append("buffer", file);
		var url = route;
		var config = {
			url: url,
			method: "POST",
			data: formData,
			headers: {
				'Content-Type': undefined
			},
			transformRequest: angular.identity
		};
		if(isAuth)
			config.headers.Authorization = "Bearer " + authService.getToken();
		return $http(config);
	}
	var finalMethods = {};
	["get", "delete"].forEach(function(method){
		finalMethods[method] = function(route, fn){
			methods[method](route, false).then(function(result){
				fn(null, result.data, result.status);
			}, function(err){
				fn(err);
			});
		}
		finalMethods[method + "Auth"] = function(route, fn){
			methods[method](route, true).then(function(result){
				fn(null, result.data, result.status);
			}, function(err){
				fn(err);
			});
		}
	});

	["post", "put", "postMultipart"].forEach(function(method){
		finalMethods[method] = function(route, data, fn){
			methods[method](route, false, data).then(function(result){
				fn(null, result.data, result.status);
			}, function(err){
				fn(err);
			});
		}
		finalMethods[method + "Auth"] = function(route, data, fn){
			methods[method](route, true, data).then(function(result){
				fn(null, result.data, result.status);
			}, function(err){
				fn(err);
			});
		}
	});
	return finalMethods;
});
