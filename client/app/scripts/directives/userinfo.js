(function () {
'use strict';

angular.module('gitInsight.userinfo', [])
  .directive('userInfo', userInfo);

function userInfo () {
  return {
    link: link,
    restrict: 'E',
    templateUrl: 'app/scripts/directives/userinfo.html',
    scope: {
      user: '='
    }
  };

  function link (scope, ele, attrs) {
  }
}

})();