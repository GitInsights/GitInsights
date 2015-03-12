(function(){
  'use strict';

  angular.module('gitInsight.home', ['ngMaterial', 'ngMessages'])
  .controller('HomeController', HomeController)
  .config( function($mdThemingProvider){
    $mdThemingProvider.theme('docs-dark', 'default')
    .primaryPalette('light-blue')
    .dark();
  });

  HomeController.$inject = ['$scope', '$window', '$location', 'Auth'];

  function HomeController($scope, $window, $location, Auth){
    $scope.user = {};
    $scope.login = Auth.login;
    console.log(Auth);
  }
})();
