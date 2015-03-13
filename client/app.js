angular.module('gitInsight', [
  'gitInsight.home',
  'ngRoute',
  'gitInsight.gitapi',
  'gitInsight.auth'
])
.config(function($routeProvider, $httpProvider){
  $routeProvider
    .when('/', {
      templateUrl: 'app/scripts/home/home.html',
      controller: 'HomeController'
    })
    //sandbox for ko
    .when('/ko', {
      templateUrl: 'app/scripts/home/ko.html',
      controller: 'HomeController'
    });
});
