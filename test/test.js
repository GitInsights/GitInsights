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

      beforeEach(function(){
        //used by getUserRepos
        var _userResource = gitApi + '/users/GitInsights/repos';
        $httpBackend
          .when('GET', _userResource)
          .respond([
            {
              "full_name": "GitInsights/GitInsights",
              "owner": {
                "login":'GitInsights'
              }
            }
          ]);
      });

      it("should return a list of a user's repos", function(){
        GitApi.getUserRepos('GitInsights')
          .then(function (repos) {
            var username = repos[0].owner.login;
            var repoName = repos[0].full_name;
            expect(username).to.equal('GitInsights');
            expect(repoName).to.equal('GitInsights/GitInsights');
            expect(repos.length).to.equal(1);
          });
        $httpBackend.flush();
      });

    });

    describe('getRepoWeeklyData', function(){

      beforeEach(function () {
        //used by getRepoWeeklyData
        var _repoResource = gitApi + '/repos/GitInsights/GitInsights/stats/contributors';
        $httpBackend
          .when('GET', _repoResource)
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
      });

      it('should return an array of objects', function () {
        var mockRepoObject = {url:gitApi + '/repos/GitInsights/GitInsights'};
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

    xdescribe('getAllWeeklyData', function () {

    });

  });
});