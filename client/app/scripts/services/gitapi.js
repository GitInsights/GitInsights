(function(){
"use strict";

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
    getUserContact: getUserContact,
    gatherLanguageData: gatherLanguageData,
    getUserLanguages: getUserLanguages
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
          return getRepoWeeklyData(repo, username);
        });
        return $q.all(promises);
      });
  }

  function get (url, params) {
    //perhaps extend params with given input
    params = params || {access_token: Auth.getToken()};
    return $http({
      method: 'GET',
      url: url,
      params: params
    });
  }

  //returns an array of additions/deletions and commits
  //made by a user for a given repo
  function getRepoWeeklyData (repo, username) {
    var contributors = repo.url + '/stats/contributors';

    return get(contributors).then(function (res) {
      var numContributors = res.data.length;
      //if there are multiple contributors for this repo,
      //we need to find the one that matches the queried user
      for(var i = 0; i < numContributors; i++){
        if(res.data[i].author.login === username) {
          var data = res.data[i];
        //we attach some metadata that will help us with chaining these queries
          data.url = repo.url;
          data.numContributors = numContributors;
          return data;
        }
      }
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
    var userRepos = gitApi + 'users/' + username + '/repos';
    return get(userRepos).then(function (res){
      var repos = res.data;
      var username = res.data[0].owner.login;
      usersRepos[username] = repos;
      return usersRepos[username];
    });
  }

  function getUserContact (username) {
    var userContact = gitApi + "users/" + username;
    return get(userContact).then(function (res) {
      return res.data;
    });
  }

  // In order to get an idea of the user's language use,
  // we first supply information about all repos the user has contributed to.

  // For each repo, we make at most two requests,
  // getLanguageStats gathers the language statstic for that repo, 
    // if the user is the sole contributor for the repo, 
      // we can add the language stat directly to the final result
    // else, getCodeFrequency gets the repo's data for weekly additions/deletions
      // the ratio between the user's and the repo's net additions is used to estimate
      // the portion the user has contributed to the repo in each language.

  // This approximation strives to reduce the number of api calls to Github
  // while giving a reasonable estimate of the user's language use.

  // Please let us know if there is a better way.

  function gatherLanguageData (data) {
    var promises = data.map(function (repo) {
      if (repo) {
        var requests = [repo];
        requests[1] = getLanguageStats(repo);

        //only get code frequency if the repo has multiple contibutors
        //otherwise we can just add the languageStat directly.
        if(repo.numContributors > 1) {
          requests[2] = getCodeFrequency(repo);
        }

        return $q.all(requests);
      } else {
        return [];
      }
    });
    return $q.all(promises);
  }

  // Once all the requests have been resolved, we can sum the values 
  // across all repos and get an estimate of the user's language use
  // based on the total number of bytes per language.

  function getUserLanguages (repos) {
    var squashed = {};
    repos.forEach(function (repo) {
      var result = estimateUserContribution(repo);
      if (result) {
        for (var language in result) {
          if (squashed[language]) {
            squashed[language] += result[language];
          } else {
            squashed[language] = result[language];
          }
        }
      }
    });
    return squashed;
  }

  //returns an object representing the number of bytes
  //each language used in this repo uses.
  function getLanguageStats (repo) {
    var repoLanguages = repo.url + '/languages'
    return get(repoLanguages).then(function (res) {
      return res.data;
    });
  }

  //returns an array of arrays
  //each subarray contains information about the total number of additions/deletions
  //for a given week made in this repo
  function getCodeFrequency (repo) {
    var repoCodeFreq = repo.url + '/stats/code_frequency';
    return get(repoCodeFreq).then(function (res) {
      return res.data;
    });
  }

  function estimateUserContribution (repo) {
    var result = {};

    // no data on repo
    if (repo.length === 0){
      return null;
    }

    // no request for contributor data,
    // user is sole contributor
    // return entire languageStat
    if (!repo[2]) {
      return repo[1];
    }

    var weeklyData = repo[0].weeks;
    var languageStats = repo[1];
    var codeFreq = repo[2];

    var userNetAdditions = 0;
    var repoNetAdditions = 0;

    weeklyData.forEach(function (week) {
      userNetAdditions += (week.a - week.d);
    });

    codeFreq.forEach(function (week) {
      repoNetAdditions += (week[1] - week[2]);
    });

    var ratio = (userNetAdditions/repoNetAdditions);

    for (var key in languageStats) {
      result[key] = languageStats[key] * ratio;
    }

    return result;
  }

}

})();
