describe('GitInsight', function(){

  describe('GitApi', function(){

    var $httpBackend, GitApi, Auth;
    var gitApi = 'https://api.github.com';

    beforeEach(module('gitInsight.gitapi'));
    beforeEach(module('gitInsight.auth'));
    beforeEach(inject(function ($injector, _GitApi_, _Auth_){
      $httpBackend = $injector.get('$httpBackend');
      GitApi = _GitApi_;
      Auth = _Auth_;

      //resource used by getUserRepos
      var _userResource = gitApi + '/users/waieez/repos';
      $httpBackend
        .when('GET', _userResource)
        .respond([
          {
            "full_name": "waieez/GitInsights",
            "owner": {
              "login":'waieez'
            },
            "url": gitApi + '/repos/waieez/GitInsights'
          },
          {
            "full_name": "waieez/Blog",
            "owner": {
              "login":'waieez'
            },
            "url": gitApi + '/repos/waieez/Blog'
          }            
        ]);

      //getAllWeeklyData will make an api call for each repo        
      var _repoResource1 = gitApi + '/repos/waieez/GitInsights/stats/contributors';
      $httpBackend
        .when('GET', _repoResource1)
        .respond([
          {
            "weeks": [{}, {}, {}],
            "author": {"login":"imskojs"}
          },
          {
            "weeks": [{}, {}, {}],
            "author": {"login":"johnz133"}
          },
          {
            "weeks": [{}, {}, {}],
            "author": {"login":"waieez"}
          }
        ])

      var _repoResource2 = gitApi + '/repos/waieez/Blog/stats/contributors';
      $httpBackend
        .when('GET', _repoResource2)
        .respond([
          {
            "weeks": [{}, {}, {}],
            "author": {"login":"waieez"}
          }
        ])
    }));

    afterEach(function () {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('should return an object with all the required methods', function(){
      expect(GitApi).to.be.an('object');
      expect(GitApi.getUserRepos).to.be.a('function');
      expect(GitApi.getRepoWeeklyData).to.be.a('function');
      expect(GitApi.getAllWeeklyData).to.be.a('function');
    });

    describe('getUserRepos', function () {

      it("should return a list of a user's repos", function(){
        GitApi.getUserRepos('waieez')
          .then(function (repos) {
            var username = repos[0].owner.login;
            var repoName = repos[0].full_name;
            expect(username).to.equal('waieez');
            expect(repoName).to.equal('waieez/GitInsights');
            expect(repos.length).to.equal(2);
          });
        $httpBackend.flush();
      });

    });

    describe('getRepoWeeklyData', function(){

      it('should return an array of objects', function () {
        var mockRepoObject = {url:gitApi + '/repos/waieez/GitInsights'};
        GitApi.getRepoWeeklyData(mockRepoObject, 'waieez')
          .then(function(data){
            var authorName = data.author.login;
            var weeksData = data.weeks;
            expect(authorName).to.equal('waieez');
            expect(weeksData.length).to.eql(3);
          })
        $httpBackend.flush();
      });

    });

    describe('getAllWeeklyData', function () {
      
      it("should return the user's weekly data", function(){
        GitApi.getAllWeeklyData('waieez')
          .then(function (result) {
            expect(result.length).to.equal(2);
          });
        $httpBackend.flush();
      });
    });
  });
});