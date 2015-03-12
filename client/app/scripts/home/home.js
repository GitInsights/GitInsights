(function(){
  'use strict';

  angular.module('gitInsight.home', ['ngMaterial', 'ngMessages', 'gitInsight.gitapi'])
  .controller('HomeController', HomeController)
  .config( function($mdThemingProvider){
    $mdThemingProvider.theme('docs-dark', 'default')
    .primaryPalette('light-blue')
    .dark();
  });

  HomeController.$inject = ['$scope', '$window', '$location', 'GitApi'];

  function HomeController($scope, $window, $location, GitApi){
    $scope.user = {};
    $scope.getUserRepo = function(){
      GitApi.getAllWeeklyData($scope.user.username)
        .then(function(data){
          console.log(data);
        });
    };
  }
})();
