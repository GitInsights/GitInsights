(function () {
'use strict'

angular.module('gitInsight.contact', [])
  .directive('userInfo', userInfo)

function userInfo () {
  return {
    link: link,
    restrict: 'E',
    templateUrl: 'app/scripts/directives/contact.html',
    scope: {
      user: '='
    }
  }

  function link (scope, ele, attrs) {
  }
}

})()