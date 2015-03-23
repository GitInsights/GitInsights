(function(){
  'use strict';

  angular.module('gitInsight.home', ['ngMaterial', 'ngMessages'])
  .controller('HomeController', HomeController)
  //defines the colors
  .config( function($mdThemingProvider){
    $mdThemingProvider.theme('docs-dark', 'default')
    .primaryPalette('light-blue')
  });

  HomeController.$inject = ['$scope', 'GitApi', 'Auth', 'Chart'];

  function HomeController($scope, GitApi, Auth, Chart){
    $scope.currentUser = {};
    $scope.users = [];
    $scope.loaded = false;
    $scope.loaded3 = false;

    $scope.graphData = [];
    $scope.timeStamps = [];

    $scope.getAllWeeklyData = function(username){
      GitApi.getAllWeeklyData(username)
        .then(function (data){
          var weeklyData = GitApi.reduceAllWeeklyData(data)
          Chart.lineGraph(weeklyData, username);
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
          addPieGraph(languages);
        });
    };

    var count = 0
    var addPieGraph = function (languages){
      // Limits max user comparison = 2
      count++
      if(count > 2){
        $scope.loaded3 = false;
        count = 1;
      } else if (count === 2){
        $scope.loaded3 = true;
      }
      //Changes format from {JavaScript: 676977.4910200321, CSS: 3554.990878681176, HTML: 41.838509316770185, Shell: 4024.4960858041054}
      // to [{"key": "One", "value": 222}, ... , {"key": "Last", "value": 222}]
      var languageData = d3.entries(languages)

      // Add second pie chart when comparing users.
      var chart = "#chart2"
      if(count === 2){
        chart = "#chart3"
      }

      // nvd3 library's pie chart.
      nv.addGraph(function() {
        var pieChart = nv.models.pieChart()
            .x(function(d) { return d.key })
            .y(function(d) { return d.value })
            .showLabels(true)
            .labelType("percent");

          d3.select(chart + " svg")
              .datum(languageData)
              .transition().duration(350)
              .call(pieChart);

        return pieChart;
      });
    };

    $scope.login = function(){
      Auth.login();
    };

  }
})();

