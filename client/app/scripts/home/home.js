(function(){
  'use strict';

  angular.module('gitInsight.home', ['ngMaterial', 'ngMessages'])
  .controller('HomeController', HomeController)
  //defines the colors
  .config( function($mdThemingProvider){
    $mdThemingProvider.theme('docs-dark', 'default')
    .primaryPalette('light-blue')
  });

  HomeController.$inject = ['$scope', '$window', '$location', 'GitApi', 'Auth'];

  function HomeController($scope, $window, $location, GitApi, Auth){
    $scope.currentUser = {};
    $scope.users = [];
    $scope.loaded = false;
    $scope.loaded3 = false;
    $scope.labels = [];
    $scope.series = [];
    $scope.graphData = [];
    $scope.timeStamps = [];
    $scope.userOneData = [];

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

    //TODO: refactor into service
    var addGraphData = function(data){
      
      var additions = [];
      var deletions = [];
      var unixTimeStamps = [];
      var newTimeStamps = [];
      
      for(var week in data){
        unixTimeStamps.push(+week);
        additions.push(data[week].a);
        deletions.push(data[week].d);
      }
      
      var series1 = {"key": $scope.currentUser.username + "'s Additions", "values": []};
      var series2 = {"key": $scope.currentUser.username + "'s Deletions", "values": []};

      for(var i = 0; i < unixTimeStamps.length; i++){
        series1.values.push([unixTimeStamps[i], additions[i]]);
        series2.values.push([unixTimeStamps[i], deletions[i]]);
      }

      if($scope.userOneData.length >= 4){
        $scope.userOneData = [];
      }

      $scope.userOneData.push(series1);
      $scope.userOneData.push(series2);

      // nv is a nvd3 library object. (on global scope)
      nv.addGraph(function() {
        // Creates multi-line graph
        var chart = nv.models.lineChart()
        .x(function(d) { return d[0] })
        .y(function(d) { return d[1] }) 
        .color(d3.scale.category10().range())
        .useInteractiveGuideline(true);
    
        // Define x axis
        chart.xAxis
        // .tickValues(unixTimeStamps)
        .tickFormat(function(d) {
          return d3.time.format('%x')(new Date(d*1000))
        });
    
        // Define y axis
        chart.yAxis
        .domain(d3.range(additions))
        .tickFormat(d3.format('d'));
    
        // append defined chart to svg element
        d3.select('#chart svg')
        .datum($scope.userOneData)
        .call(chart);

        // resizes graph when window resizes
        nv.utils.windowResize(chart.update);
        return chart;
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

