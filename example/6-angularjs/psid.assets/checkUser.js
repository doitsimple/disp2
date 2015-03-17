reqService.postAuth("/api/listUser", {}, function(err, data, status){
	if(status == 200){
		$scope.data = data;
	}
});

