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
    $scope.data1 =[];

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
        tempTimeStamps.push(+prop);
        additions.push(data[prop].a);
        deletions.push(data[prop].d);
      }

      var series1 = {"key": $scope.currentUser.username + "'s Additions", "values": []};
      var series2 = {"key": $scope.currentUser.username + "'s Deletions", "values": []};

      for(var i = 0; i < tempTimeStamps.length; i++){
        series1.values.push([tempTimeStamps[i], additions[i]])
        series2.values.push([tempTimeStamps[i], deletions[i]])
      }
      if($scope.data1.length >= 4){
        $scope.data1 = [];
      }
      $scope.data1.push(series1)
      $scope.data1.push(series2)

      // [{"key": "additions", "values": [[xdate, yvalue]...[xdate, yvalue]}]
      // Time Series property.
      nv.addGraph(function() {
        var chart = nv.models.cumulativeLineChart()
        .x(function(d) { return d[0] })
        .y(function(d) { return d[1] }) 
        .color(d3.scale.category10().range())
        .useInteractiveGuideline(true);
    
        chart.xAxis
        // .tickValues(tempTimeStamps)
        .tickFormat(function(d) {
          return d3.time.format('%x')(new Date(d*1000))
        });
    
        chart.yAxis
        .domain(d3.range(additions))
        .tickFormat(d3.format('d'));
    
        d3.select('#chart svg')
        .datum($scope.data1)
        .call(chart);

        nv.utils.windowResize(chart.update);
        return chart;

      // nv.addGraph End
      });

    // addGraphData End
    };
    
    var count = 0
    var addPieGraph = function (languages){
      //{JavaScript: 676977.4910200321, CSS: 3554.990878681176, HTML: 41.838509316770185, Shell: 4024.4960858041054}
      //[{"label": "One", "value": 222}, ... , {"label": "Last", "value": 222}]
      count++
      if(count > 2){
        count = 1;
      }
      var data2 = d3.entries(languages)

      var charty = "#chart2"
      if(count === 2){
        charty = "#chart3"
      }
      nv.addGraph(function() {
        var chart = nv.models.pieChart()
            .x(function(d) { return d.key })
            .y(function(d) { return d.value })
            .showLabels(true);

          d3.select(charty + " svg")
              .datum(data2)
              .transition().duration(350)
              .call(chart);

        return chart;
      });
    };

    $scope.login = function(){
      Auth.login();
    };


  }
})();

