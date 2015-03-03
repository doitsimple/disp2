var rootApp = angular.module('rootApp', [
  'ngRoute', 'ngCookies'
]);


rootApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
^^if(local.home){$$
      when('/', {
        templateUrl: 'html/^^=home.name$$.html',
        controller: '^^=home.name$$Controller',
        access: ^^=home.access$$
      }).
^^}$$
^^for (var ngRoute in ngRoutes){route = ngRoutes[ngRoute];$$
      when('^^=route.route$$', {
        templateUrl: 'html/^^=route.name$$.html',
        controller: '^^=route.name$$Controller',
        access: ^^=route.access$$
      }).
^^}$$
      otherwise({
        redirectTo: '/error'
      });
}]);

^^if(local.signin){$$
rootApp.run(function ($rootScope, authService) {
    $rootScope.$on("$routeChangeStart", function (event, next, current) {
      if (next.access<3) {
        if(!authService.getId()){
          event.preventDefault();
          window.location = "#/^^=signin.name$$?redirect=" +
            encodeURIComponent(next.\$\$route.originalPath);
        }
      }
    });
});
^^}$$
