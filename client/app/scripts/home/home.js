angular.module('gitInsight.home', ['ngMaterial', 'ngMessages'])

.controller('HomeController', function($scope, $window, $location){


})
.config( function($mdThemingProvider){
    // Configure a dark theme with primary foreground yellow
    $mdThemingProvider.theme('docs-dark', 'default')
        .primaryPalette('teal')
        .dark();
  });
//red, pink, purple, deep-purple, indigo, blue, light-blue, cyan, teal, green, light-green, lime, yellow, amber, orange, deep-orange, brown, grey, blue-grey
