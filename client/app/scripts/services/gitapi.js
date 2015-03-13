(function(){
"use strict"

angular.module('gitInsight.gitapi', [])
  .factory('GitApi', GitApi);

GitApi.$inject = ['$q', '$http', 'Auth'];
function GitApi ($q, $http, Auth) {

  var gitApi = 'https://api.github.com/';
  var usersRepos = {};

  return {
    reduceAllWeeklyData: reduceAllWeeklyData,
    getAllWeeklyData: getAllWeeklyData,
    getRepoWeeklyData: getRepoWeeklyData,
    getUserRepos: getUserRepos,
    getUserContact: getUserContact
  };

  //reduces data from each week
  function reduceAllWeeklyData (array, username) {
    var reduced = {};
    array.forEach(function (result) {
      if(result!==undefined && result.author.login.toLowerCase() === username.toLowerCase()){
        result.weeks.forEach(function (data) {
            var week = data.w;
            for (var key in data) {
              reduced[week] = reduced[week] || {};
              reduced[week][key] = (reduced[week][key] || 0) + data[key];
            delete reduced[week].w;
          }
        });
      }
    });
    return reduced;
  }

  //returns data from each api call
  //after all successfully resolves
  function getAllWeeklyData (username) {
    return getUserRepos(username)
      .then(function (repos) {
        var promises = repos.map(function (repo) {
          return getRepoWeeklyData(repo);
        });
        return $q.all(promises);
      });
  }

  //returns an array of additions/deletions and commits
  //made by a user for a given repo
  function getRepoWeeklyData (repo) {
    var contributorsResource = repo.url + '/stats/contributors';
    return $http({
      method: 'GET',
      url: contributorsResource,
      params: {
        access_token: Auth.getToken()
      }
    }).then(function (res) {
      return res.data[0];
    });
  }


  function getUserRepos (username) {
    //if cached, return repo list as promise
    if (usersRepos[username]) {
      return $q(function (resolve, reject) {
        return resolve(usersRepos[username]);
      });
    }

    //else, fetch via api
    //currently only fetches repos owned by user
    //TODO: Fetch all repos user has contributed to
    var userReposResource = 'users/' + username + '/repos';

    return $http({
      method: 'GET',
      url: gitApi + userReposResource,
      params: {
        access_token: Auth.getToken()
      }
    }).then(function (res){
      var repos = res.data;
      var username = res.data[0].owner.login;
      return usersRepos[username] = repos;
    });
  }

  function getUserContact (username) {
    return $http({
      method: 'GET',
      url: gitApi + "users/" + username,
      params: {
        access_token: Auth.getToken()
      }
    }).then(function (res) {
      return res.data;
    });
  }

}

})();
