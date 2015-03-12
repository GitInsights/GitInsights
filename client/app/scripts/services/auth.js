(function () {

angular.module('gitInsight.auth', [])
  .factory('Auth', Auth);

Auth.$inject = ['$http']
function Auth ($http) {
  var ref = new Firebase("https://boiling-torch-2275.firebaseio.com");

  return {
    login: login
  }

  function login () {
    console.log('logging in!')
    ref.authWithOAuthPopup("github", function(error, authData) {
      if (error) {
        console.log("Login Failed!", error);
      } else {
        console.log("Authenticated successfully with payload:", authData);

        $http.get('https://api.github.com/rate_limit')
          .then(function (res){
            console.log(res);
          });
      }
    })()
  }

}

})()