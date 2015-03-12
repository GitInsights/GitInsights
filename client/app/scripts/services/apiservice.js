(function(){

angular.module('gitInsight.apiservice')
  .factory(GitApi, GitApi)

GitApi.$inject = ['$http'];
function GitApi ($http) {

  var gitApi = 'https://api.github.com/'

  return {
    getUserRepos: getUserRepos
  }

  function getUserRepos (username) {
    var userRepos = 'users/' + username + '/repos';
    return $http({
      method: 'GET',
      url: gitApi + userRepos;
    })
  }

  getUserRepos('waieez');
}

})()