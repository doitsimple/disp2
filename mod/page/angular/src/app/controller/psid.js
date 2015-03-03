^^
var depStr = "";
if(local.deps)
	depStr = ", " + local.deps.join(", ");	
$$
rootApp.controller('^^=name$$Controller', function($scope^^=depStr$$){
^^=content$$
});
