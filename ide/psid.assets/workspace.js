$scope.data = [];
$scope.list=function(){
	API.listproject(function(err, data){
		$scope.data = data;
		$scope.template = 'projectList';
	});
}
