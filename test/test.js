describe('GitInsight', function(){

  describe('GitApi', function(){

    var GitApi;
    var Auth;

    beforeEach(module('gitInsight.gitapi'));
    beforeEach(module('gitInsight.auth'));
    beforeEach(inject(function (_GitApi_, _Auth_){
      GitApi = _GitApi_;
      Auth = _Auth_;
    }));

    it('should work now', function(){
      expect(true).to.equal(true);
    });

    it('should work now', function(){
      expect(true).to.equal(true);
    });

  });
});