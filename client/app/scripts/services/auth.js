(function () {
'use strict'

angular.module('gitInsight.auth', [])
  .factory('Auth', Auth);

Auth.$inject = []
function Auth () {
  var ref = new Firebase("https://boiling-torch-2275.firebaseio.com");
  var githubToken;

  return {
    login: login,
    getToken: getToken
  }
  
  function getToken () {
    return githubToken;
  }

  function login () {
    ref.authWithOAuthPopup("github", function (error, authData) {
      if (error) {
        console.log("Login Failed!", error);
      } else {
        console.log("Authenticated successfully with payload:", authData);
        githubToken = authData.github.accessToken;
      }
    })()
  }
}

})()