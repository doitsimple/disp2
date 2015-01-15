
rootApp.controller('^^=name$$Controller', function($scope, $routeParams, requestService, authService){
	$scope.result = "";
	$scope.data = {};
	$scope.data.fields = {};
	$scope.data.params = {};
	$scope.data.querys = {};
^^fields.forEach(function(f){
	if(f.example){$$
	$scope.data.fields.^^=f.name$$ = "^^=f.example$$";
^^}})$$
^^params.forEach(function(param){
	if(param.example){$$
	$scope.data.params.^^=param.name$$ = "^^=param.example$$";
^^}})$$
^^querys.forEach(function(q){
	if(q.example){$$
	$scope.data.querys.^^=q.name$$ = "^^=q.example$$";
^^}})$$

	$scope.submit = function() {
		var route = "/api/^^=route$$";
^^params.forEach(function(param){$$
		route += "/" + $scope.data.params.^^=param.name$$; 
^^})$$
^^querys.forEach(function(q, i){$$
 ^^if(i == 0){$$
		route += "?^^=q.name$$=" + $scope.data.querys.^^=q.name$$;
 ^^}else{$$
		route += "&^^=q.name$$=" + $scope.data.querys.^^=q.name$$;
 ^^}$$
^^})$$
^^if(!multipart){$$
		requestService.^^=method$$(route, ^^=auth$$, $scope.data.fields).then(function(result){
^^}else{$$
		requestService.postMultipart(route, ^^=auth$$, $scope.buffer).then(function(result){
^^}$$
			if(result.status == 401){
				alert("登陆过期");
				authService.signout();
			}
			else if(result.status == 200){
^^if(saveAuth){$$
				authService.signin(result.data);
^^}$$
				$scope.result = JSON.stringify(result.data, undefined, 2);
			}else{
				$scope.result = "status code: " + result.status;
			}
		});
	}
});
