(function() {
  var Http, SERVER_PORT, http, logger, resFun, root, server, url;

  root = process.cwd();

  Http = require("" + root + "/lib").Http;

  logger = require("" + root + "/test/lib/consoleLogger");

  http = require("http");

  url = require("url");

  SERVER_PORT = 10086;

  resFun = function(req, res) {
    var path, postData, query, url_parts;
    path = url.parse(req.url).pathname;
    if (req.method === 'POST') {
      postData = '';
      req.setEncoding('utf8');
      req.addListener('data', function(postDataChunk) {
        return postData += postDataChunk;
      });
      return req.addListener('end', function() {
        res.write(postData);
        return res.end();
      });
    } else if (req.method === 'GET') {
      url_parts = url.parse(req.url, true);
      query = url_parts.query;
      res.write(JSON.stringify(query));
      return res.end();
    }
  };

  server = http.createServer(resFun).listen(SERVER_PORT, "localhost");

  describe('http post', function() {
    it('post not exist host', function(done) {
      var options;
      options = {
        host: "10.2.126.215",
        port: 5678,
        path: "/quoteStock",
        logger: logger,
        timeout: 4000
      };
      return Http.post(options, function(err, res, data) {
        expect(err !== false).toEqual(true);
        return done();
      });
    });
    it('post no data', function(done) {
      var options;
      options = {
        host: "localhost",
        port: SERVER_PORT,
        path: "/",
        logger: logger
      };
      return Http.post(options, function(err, res, data) {
        expect(res.statusCode).toEqual(200);
        return done();
      });
    });
    return it('post with data,a data', function(done) {
      var options;
      options = {
        host: "localhost",
        port: SERVER_PORT,
        path: "/data",
        logger: logger,
        data: {
          pLe: 300
        }
      };
      return Http.post(options, function(err, res, data) {
        var ret;
        ret = JSON.parse(data);
        expect(res.statusCode).toEqual(200);
        expect(ret.pLe).toEqual(300);
        return done();
      });
    });
  });

  describe('http get', function() {
    it('get not exist host', function(done) {
      var options;
      options = {
        host: "10.2.126.215",
        port: 5678,
        path: "/quoteStock",
        logger: logger,
        timeout: 4000
      };
      return Http.get(options, function(err, res, data) {
        return done();
      });
    });
    it('get exist host', function(done) {
      var options;
      options = {
        host: "localhost",
        port: SERVER_PORT,
        path: "/get",
        logger: logger,
        timeout: 4000
      };
      return Http.get(options, function(err, res, data) {
        expect(res.statusCode).toEqual(200);
        return done();
      });
    });
    return it('get with param', function(done) {
      var options;
      options = {
        host: "localhost",
        port: SERVER_PORT,
        path: "/get",
        logger: logger,
        timeout: 4000,
        data: {
          name: "abc"
        }
      };
      return Http.get(options, function(err, res, data) {
        var ret;
        ret = JSON.parse(data);
        expect(err).toEqual(false);
        expect(res.statusCode).toEqual(200);
        expect(ret.name).toEqual("abc");
        server.close();
        return done();
      });
    });
  });

}).call(this);
