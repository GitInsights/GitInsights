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
    $scope.currentUser = {};
    $scope.users = [];
    $scope.loaded = false;
    $scope.labels = [];
    $scope.series = [];
    $scope.graphData = [];
    $scope.timeStamps = [];

    $scope.getUserRepos = function(){
      GitApi.getUserRepos($scope.currentUser.username)
        .then(function(data){
          $scope.loaded = true;
        });
    };

    $scope.getAllWeeklyData = function(){
      GitApi.getAllWeeklyData($scope.currentUser.username)
        .then(function(data){
          addGraphData(GitApi.reduceAllWeeklyData(data, $scope.currentUser.username));
          convertTimeStampToDate();
          $scope.loaded = true;
          $scope.users.push($scope.currentUser);
          $scope.currentUser = {};
          return data;
        })
        .then(function (data) {
          return GitApi.gatherLanguageData(data);
        })
        .then(function (data) {
          var languages = GitApi.getUserLanguages(data);
          console.log(languages);
        });
    };

    var addGraphData = function(data){
      var additions = [],
          deletions = [],
          dates = [],
          tempTimeStamps = [],
          newTimeStamps = [];
      for(var prop in data){
          tempTimeStamps.push(prop);
          additions.push(data[prop]['a']);
          deletions.push(data[prop]['d']);
      }
      $scope.graphData.push(additions);
      $scope.graphData.push(deletions);
      $scope.series.push($scope.currentUser.username + "'s Additions");
      $scope.series.push($scope.currentUser.username + "'s Deletions");
      var j, i, debug;
      i = j = debug = 0;
      while(i < tempTimeStamps.length && j < $scope.timeStamps.length){
        if(tempTimeStamps[i]===$scope.timeStamps[j]){
          newTimeStamps.push(tempTimeStamps[i++]);
          j++;
        } else if(tempTimeStamps[i] < $scope.timeStamps[j]){
          newTimeStamps.push(tempTimeStamps[i++]);
        } else {
          newTimeStamps.push($scope.timeStamps[j++]);
        }
      }
      if(i === tempTimeStamps.length){
        for(;j < $scope.timeStamps.length; j++){
          newTimeStamps.push($scope.timeStamps[j]);
        }
      } else {
        for(;i < tempTimeStamps.length; i++){
          newTimeStamps.push(tempTimeStamps[i]);
        }
      }
      $scope.timeStamps = newTimeStamps;
    };

    var convertTimeStampToDate = function(){
      $scope.labels = [];
      for(var i = 0; i < $scope.timeStamps.length; i++){
        $scope.labels.push(toDate($scope.timeStamps[i]));
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

