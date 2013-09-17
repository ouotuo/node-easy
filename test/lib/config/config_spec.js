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
      Config.configFile(config, path.join(__dirname, "config1.json"));
      expect(config.app).toEqual('app.json');
      expect(config.person.name).toEqual("json");
      expect(config.http.port).toEqual(4000);
      return done();
    });
    return it('load from multi file', function(done) {
      var config, dir;
      dir = path.join(__dirname, "./config2");
      config = Config.loadConfig(dir);
      expect(config.app).toEqual('test');
      expect(config.a.name).toEqual('a');
      expect(config.b.name).toEqual('b');
      return done();
    });
  });

}).call(this);
