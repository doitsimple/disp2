rootApp.factory('requestService', function($http, authService){
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
			return $http(config).then(function(result){
				return result;
			}, function(err){
				return err;
			});
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
			return $http(config).then(function(result){
				return result;
			}, function(err){
				return err;
			});
		};
	});
	return methods;
});
