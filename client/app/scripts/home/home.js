var add, sub, commit, tim;
(function(){
  'use strict';

  angular.module('gitInsight.home', ['ngMaterial', 'ngMessages', 'chart.js', 'gitInsight.gitapi', 'gitInsight.auth'])
  .controller('HomeController', HomeController)
  //defines the colors
  .config( function($mdThemingProvider){
    $mdThemingProvider.theme('docs-dark', 'default')
    .primaryPalette('light-blue')
    // .dark();
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
        console.log(data);
        return data;
      })
      .then(function (data) {
        return GitApi.gatherLanguageData(data);
      })
      .then(function (data) {
        var languages = GitApi.getUserLanguages(data);
        console.log(languages);
        addPieGraph(languages);
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

    var addPieGraph = function (languages){
      //{JavaScript: 676977.4910200321, CSS: 3554.990878681176, HTML: 41.838509316770185, Shell: 4024.4960858041054}
      //[{"label": "One", "value": 222}, ... , {"label": "Last", "value": 222}]

      var data2 = d3.entries(languages)

      nv.addGraph(function() {
        var chart = nv.models.pieChart()
            .x(function(d) { return d.key })
            .y(function(d) { return d.value })
            .showLabels(true);

          d3.select("#chart2 svg")
              .datum(data2)
              .transition().duration(350)
              .call(chart);

        return chart;
      });
    };















      // $scope.graphData.push(additions);
      // $scope.graphData.push(deletions);
      // $scope.series.push($scope.currentUser.username + "'s Additions");
      // $scope.series.push($scope.currentUser.username + "'s Deletions");
      // var j, i, debug;
      // i = j = debug = 0;
      // while(i < tempTimeStamps.length && j < $scope.timeStamps.length){
      //   if(tempTimeStamps[i]===$scope.timeStamps[j]){
      //     newTimeStamps.push(tempTimeStamps[i++]);
      //     j++;
      //   } else if(tempTimeStamps[i] < $scope.timeStamps[j]){
      //     newTimeStamps.push(tempTimeStamps[i++]);
      //   } else {
      //     newTimeStamps.push($scope.timeStamps[j++]);
      //   }
      // }
      // if(i === tempTimeStamps.length){
      //   for(;j < $scope.timeStamps.length; j++){
      //     newTimeStamps.push($scope.timeStamps[j]);
      //   }
      // } else {
      //   for(;i < tempTimeStamps.length; i++){
      //     newTimeStamps.push(tempTimeStamps[i]);
      //   }
      // }
      // $scope.timeStamps = newTimeStamps;

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



  // HomeController
  };
})();

