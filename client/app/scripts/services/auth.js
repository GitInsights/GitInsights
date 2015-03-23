(function () {
'use strict';

angular.module('gitInsight.auth', [])
  .factory('Auth', Auth);

Auth.$inject = [];
function Auth () {
  //Uses Firebase only to authenticate via Github
  //Authenticated Github users are allowed to make 2000api calls/hr vs 60 for unauthenticated users

  //create an instance to interact with firebase api.
  //url refers to Firebase database.
  //for more information about Firebase please refer to http://www.firebase.com
  var ref = new Firebase("https://boiling-torch-2275.firebaseio.com");
  var githubToken;

  return {
    login: login,
    getToken: getToken
  };

  function getToken () {
    return githubToken;
  }

  function login () {
    //creates a popup for authentication via github
    //closes pop after and sets the githubToken for use in GitApi calls
    ref.authWithOAuthPopup("github", function (error, authData) {
      if (error) {
        console.log("Login Failed!", error);
      } else {
        console.log("Authenticated successfully with payload:", authData);
        githubToken = authData.github.accessToken;
      }
    });
  }
}

})();
