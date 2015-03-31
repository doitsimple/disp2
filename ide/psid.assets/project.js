$scope.data = {};
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
				if(!err)
					editor.setValue(data.toString());
			});
		}
	});

});
