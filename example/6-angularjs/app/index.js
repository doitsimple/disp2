var rootApp = angular.module('rootApp', [
  'ngRoute', 'ngCookies'
]);


rootApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'html/home.html',
        controller: 'homeController',
        access: 3      }).
      when('/home', {
        templateUrl: 'html/home.html',
        controller: 'homeController',
        access: 3      }).
      when('/checkUser', {
        templateUrl: 'html/checkUser.html',
        controller: 'checkUserController',
        access: 3      }).
      otherwise({
        redirectTo: '/error'
      });
}]);

