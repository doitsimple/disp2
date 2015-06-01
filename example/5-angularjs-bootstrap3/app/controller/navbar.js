rootApp.controller('navbarController', function($scope, $location, authService){
	$scope.isActive=function(path){
		return path && $location.url() == path;
	};
	$scope.toggle = function(){
		$('.dropdown-menu').toggle();
	}	
	$scope.isSignedin = authService.getToken;
	$scope.getId = authService.getId;
	$scope.signout = authService.signout;
});
