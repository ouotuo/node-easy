(function() {
  var Config, path, root;

  path = require("path");

  root = process.cwd();

  Config = require("" + root + "/lib").Config;

  describe('config test1', function() {
    it('load from dir with one file', function(done) {
      var config, dir;
      dir = path.join(__dirname, "./config1");
      config = Config.loadConfig(dir, 'test1');
      expect(config.app).toEqual('test');
      expect(config.http.port).toEqual(4001);
      expect(config.logDir).toEqual('test1');
      expect(config.index1.app).toEqual('test');
      expect(config.index1.http.port).toEqual(4001);
      expect(config.index1.logDir).toEqual('test1');
      return done();
    });
    return it('b test', function(done) {
      expect(false).toBeFalsy();
      expect(2).toBeGreaterThan(1);
      return done();
    });
  });

}).call(this);
