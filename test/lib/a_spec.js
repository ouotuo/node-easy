(function() {
  var root;

  root = process.cwd();

  describe('test', function() {
    it('a test', function(done) {
      expect(200).toEqual(200);
      return done();
    });
    return it('b test', function(done) {
      expect(false).toBeFalsy();
      expect(2).toBeGreaterThan(1);
      return done();
    });
  });

}).call(this);
