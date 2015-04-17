var rootApp = angular.module('rootApp', [
  'ngRoute', 'ngCookies'
]);


rootApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'html/workspace.html',
        controller: 'workspaceController',
        access: 3      }).
      when('/workspace', {
        templateUrl: 'html/workspace.html',
        controller: 'workspaceController',
        access: 3      }).
      when('/project/:project', {
        templateUrl: 'html/project.html',
        controller: 'projectController',
        access: 3      }).
      otherwise({
        redirectTo: '/error'
      });
}]);

