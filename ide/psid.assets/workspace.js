var globalJson = {};
$scope.globalJson = globalJson;
$scope.data = [];
$scope.list=function(){
	API.listproject(function(err, data){
		$scope.data = data;
		$scope.template = 'projectList';
	});
}
$scope.new=function(){
	$scope.template = 'newproject';
}
$scope.next = function(){
	var sequece = ["database", "server", "website", "android", "ios"];
	for(var i=0; i<sequece.length; i++){
		var e = sequece[i];
		if(!globalJson[e]){
			globalJson[e] = {};
			$scope.template = e;
			break;
		}
	};
}
$scope.add = function(){
	var engine = $("#engine").val();
	globalJson.database.engine = engine;
	console.log(globalJson);
}
