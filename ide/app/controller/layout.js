rootApp.controller('layoutController', function($scope, reqService){
$scope.count = 0;
$scope.grid = 40;
$scope.canvasSize = 12;
$scope.layout = {};
$scope.makeCanvas = function(json){
	if(!json.count) json.count = 0;
	$("#canvas").remove();
	$("#canvas")
		.width(json.gridSize * json.canvasWidth)
		.height(json.gridSize * json.canvasHeight);
	$scope.add = function(){
		var id = "e" + (json.count+1).toString();
		$("#canvas").append('<div class="ui-widget-content" id="' + id + '"></div>');
		$scope.count ++;
		//	$("#"+id).resizable().draggable();
		$("#"+id).height($scope.grid).width($scope.grid).resizable({
			grid: [$scope.grid, $scope.grid],
			containment: "parent"
		}).draggable({
			containment: "parent",
			grid: [$scope.grid, $scope.grid],
			drag: function(){
				var offset = $(this).offset();
				$scope.xPos = offset.left;
				$scope.yPos = offset.top;
			}
		});
	}
}
});
