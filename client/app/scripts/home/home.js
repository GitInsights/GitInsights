(function(){
  'use strict';

  angular.module('gitInsight.home', ['ngMaterial', 'ngMessages', 'gitInsight.gitapi', 'gitInsight.auth'])
  .controller('HomeController', HomeController)
  //defines the colors
  .config( function($mdThemingProvider){
    $mdThemingProvider.theme('docs-dark', 'default')
    .primaryPalette('light-blue')
    .dark();
  });

  HomeController.$inject = ['$scope', '$window', '$location', 'GitApi', 'Auth'];

  function HomeController($scope, $window, $location, GitApi, Auth){
    $scope.user = {};
    $scope.getUserRepos = function(){
      GitApi.getUserRepos($scope.user.username)
        .then(function(data){
          console.log(data);
        });
    };

    $scope.login = function(){
      Auth.login();
    };


  }
})();

