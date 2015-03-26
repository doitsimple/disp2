var rootApp = angular.module('rootApp', [
	'ngRoute', 'ngCookies'
]);


rootApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
			when('/', {
				templateUrl: 'assets/partials/home.html',
        controller: 'homeController',
				access: 3
			}).
^^for (var key in global.apis){
 var api = global.apis[key];
 var access;
 if(global.secure && api.isSignup){continue;}
 if(api.isSignin || api.isSignup || api.isSignupSendCode) access = 3;
 else access = 2; $$
      when('/^^=api.name$$', {
        templateUrl: 'assets/partials/^^=api.name$$.html',
        controller: '^^=api.name$$Controller',
				access: ^^=access$$
			}).
^^}$$

			otherwise({
        redirectTo: '/error'
      });
}]);


rootApp.run(function ($rootScope, authService) {
    $rootScope.$on("$routeChangeStart", function (event, next, current) {
      if (next.access<3) {
        if(!authService.getId()){
          event.preventDefault();
          window.location = "#/^^=global.signinApi.route$$?redirect=" +
            encodeURIComponent(next.\$\$route.originalPath);
        }
      }
    });
});



