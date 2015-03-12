angular.module('gitInsight', [
  'gitInsight.home',
  'ngRoute',
  'gitInsight.gitapi',
])
.config(function($routeProvider, $httpProvider){
  $routeProvider
    .when('/', {
      templateUrl: 'app/scripts/home/home.html',
      controller: 'HomeController'
    });
});
