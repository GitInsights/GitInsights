(function(){
  'use strict';

  angular.module('gitInsight.home', ['ngMaterial', 'ngMessages', 'chart.js', 'gitInsight.gitapi', 'gitInsight.auth'])
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
    $scope.data = {};
    $scope.loaded = false;
    $scope.labels = [];
    $scope.series = ['Addition', 'Deletion', 'Commits'];
    $scope.graphData = [[],[],[]];
    $scope.getUserRepos = function(){
      GitApi.getUserRepos($scope.user.username)
        .then(function(data){
          console.log(data);
          $scope.loaded = true;
        });
    };
    $scope.getAllWeeklyData = function(){
      GitApi.getAllWeeklyData($scope.user.username)
        .then(function(data){
          $scope.data = GitApi.reduceAllWeeklyData(data, $scope.user.username);
          addGraphData(GitApi.reduceAllWeeklyData(data, $scope.user.username));
          $scope.loaded = true;
        });
    };

    var addGraphData = function(data){
      for(var prop in data){
          $scope.labels.push(toDate(prop));
          $scope.graphData[0].push(data[prop]['a']);
          $scope.graphData[1].push(data[prop]['d']);
          $scope.graphData[2].push(data[prop]['c']);
        }
    };

    var toDate = function(timestamp){
      var a = new Date(timestamp*1000);
      var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      var year = a.getFullYear();
      var month = a.getMonth()+1;
      var date = a.getDate();
      var time = date + '/' + month + '/' + year ;
      return time;
    };

    $scope.login = function(){
      Auth.login();
    };


  }
})();

