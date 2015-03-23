(function(){
  'use strict';

  angular.module('gitInsight.compare', [])
    .controller('CompareController', CompareController);

  CompareController.$inject = ['$scope', 'GitApi', 'Auth'];
  function CompareController ($scope, GitApi, Auth) {
    $scope.userOne = {};
    $scope.userTwo = {};
    $scope.toDo = function(){
      console.log('howdy');
    };
  }
  
})();