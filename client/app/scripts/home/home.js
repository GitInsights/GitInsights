(function(){
  'use strict';

  angular.module('gitInsight.home', ['ngMaterial', 'ngMessages'])
  .controller('HomeController', HomeController)
  .config( function($mdThemingProvider){
    $mdThemingProvider.theme('docs-dark', 'default')
    .primaryPalette('light-blue')
    .dark();
  });

  HomeController.$inject = ['$scope', '$window', '$location'];

  function HomeController($scope, $window, $location){
    $scope.user = {};
  }
})();
