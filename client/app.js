angular.module('gitInsight', [
  'gitInsight.home',
  'ngRoute',

])
.config(function($routeProvider, $httpProvider){
  $routeProvider
    .when('/', {
      templateUrl: 'app/scripts/home/home.html',
      controller: 'HomeController'
    })
    .when('/ko', {
      templateUrl: 'app/scripts/home/ko.html',
      controller: 'HomeController'
    });
});
