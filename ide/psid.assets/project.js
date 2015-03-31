$scope.projectJson = {};
$scope.data = {};
function refresh(){
	API.readlist($routeParams.project, function(err, data){
		$scope.data = data;
		var rawFiles = [];
		for(var key in data.rawFiles){
			rawFiles.push({
				name: key,
				id: key
			});
		}
		var genFiles = [];
		for(var key in data.genFiles){
			genFiles.push({
				name: key,
				id: key
			});
		}
		$scope.filetree = [
			{ "name" : "raw", "id": "raw", "children": rawFiles },
			{ "name" : "gen", "id": "gen", "children": genFiles }
		];
		var editor = ace.edit("editorarea");
		$scope.editor = editor;
		editor.setTheme("ace/theme/monokai");
		editor.getSession().setMode("ace/mode/javascript");
		editor.getSession().setTabSize(4);
		$scope.$watch(function(scope){
			return scope.filetreeid.currentNode;
		}, function(newv, oldv){
			if(newv){
				API.read($routeParams.project + "/"+ newv.name, function(err, data){
					console.log(data);
					if(err) return;
					if(newv.name != "project.json"){
						$("#editorarea").toggleClass("collapse");
						editor.setValue(data.toString());
					}else{
						$scope.projectJson = JSON.parse(data);
						console.log($scope.projectJson);
					}
				});
			}
		});
	});
}
refresh();
$scope.gen = function(){
	API.gen($routeParams.project, function(err, data){
		console.log(err, data);
		refresh();
	});
}

$scope.save = function(){
	API.write($routeParams.project + "/"+ $scope.filetreeid.currentNode.name, $scope.projectJson, function(err, data){
		console.log(err, data);
	});
}
