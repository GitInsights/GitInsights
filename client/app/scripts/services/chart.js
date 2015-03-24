(function () {
'use strict';

angular.module('gitInsight.chart', [])
  .factory('Chart', Chart);


Chart.$inject = [];
function Chart () {

  var usersData = [];

  return {
    lineGraph: lineGraph,
    pieChart: pieChart
  };

  function lineGraph (data, username) {
    
    var secondsPerYear = 525600 * 60;
    var dateNow = new Date() / 1000; //convert to unix
    var dateXYearsAgo = dateNow - (secondsPerYear * 1);

    var netAdditions = [];
    var unixTimeStamps = [];
    var newTimeStamps = [];

    for(var week in data){
      unixTimeStamps.push(+week);
      netAdditions.push(data[week].a - data[week].d);
    }
    var userData = {"key": username + "'s Net Additions", "values": []};

    for(var i = 0; i < unixTimeStamps.length; i++){
      if (unixTimeStamps[i] > dateXYearsAgo) {
        userData.values.push([unixTimeStamps[i], netAdditions[i]]);
      }
    }

    if(usersData.length >= 2){
      usersData = [];
    }

    usersData.push(userData);

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
      .domain(d3.range(netAdditions))
      .tickFormat(d3.format('d'));

      // append defined chart to svg element
      d3.select('#chart svg')
      .datum(usersData)
      .call(chart);

      // resizes graph when window resizes
      nv.utils.windowResize(chart.update);
      return chart;
    });
  };

  function pieChart (languages, config) {
    // Limits max user comparison = 2
    //Changes format from {JavaScript: 676977.4910200321, CSS: 3554.990878681176, HTML: 41.838509316770185, Shell: 4024.4960858041054}
    // to [{"key": "One", "value": 222}, ... , {"key": "Last", "value": 222}]
    var languageData = d3.entries(languages)

    // Add second pie chart when comparing users.
    var chart = config.chart;

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

}
})();