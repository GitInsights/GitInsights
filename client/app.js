angular.module('gitInsight', [
  'gitInsight.home',
  'ngRoute',
  'gitInsight.gitapi',
  'gitInsight.auth',
  'gitInsight.userinfo',
  'gitInsight.compare',
  'gitInsight.chart'
])
.config(function($routeProvider, $httpProvider){
  $routeProvider
    .when('/', {
      templateUrl: 'app/scripts/home/home.html',
      controller: 'HomeController'
    })
    .when('/compare', {
      templateUrl: 'app/scripts/compare/compare.html',
      controller: 'CompareController'
    })
    .otherwise({
      redirectTo: '/'
    });
});