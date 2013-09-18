(function() {
  var DEFAULT_PORT, DEFAULT_TIMEOUT, get, http, post, querystring;

  http = require("http");

  querystring = require('querystring');

  /*
  Agent = require('agentkeepalive')
  keepaliveAgent = new Agent({
    maxSockets:30 
    maxKeepAliveRequests:0  # max requests per keepalive socket, default is 0, no limit.
    maxKeepAliveTime: 10000  # keepalive for 30 seconds
  })
  */


  /*
  options=
      host:"192.168.1.1"
      port:"3000"
      path:"/home"
      header:
          "content-type":"text/xml"
      data:
          "name":"lin"
          age:30
      isFailNot200:true
      logger:null      #logger.debug  logger.error
      timeOut:10000    #10s
  */


  DEFAULT_PORT = 80;

  DEFAULT_TIMEOUT = 10000;

  post = function(options, cb) {
    var beginTime, logger, myOptions, postStr, req, timeout;
    beginTime = new Date().getTime();
    myOptions = {
      host: options.host,
      port: options.port || DEFAULT_PORT,
      path: options.path,
      method: 'POST',
      headers: {}
    };
    postStr = null;
    if (options['headers'] != null) {
      myOptions.headers = options['headers'];
    }
    if (options['data'] != null) {
      postStr = JSON.stringify(options['data']);
      myOptions.headers['Content-Type'] = 'application/json;charset=utf-8';
      myOptions.headers['Content-Length'] = Buffer.byteLength(postStr, 'utf8');
    }
    logger = options.logger;
    req = http.request(myOptions, function(res) {
      var data;
      res.setEncoding('utf8');
      data = '';
      res.on('data', function(chunk) {
        return data += chunk;
      });
      return res.on('end', function() {
        var costTime;
        if (logger) {
          costTime = new Date().getTime() - beginTime;
          logger.debug("post " + myOptions.host + ":" + myOptions.port + " " + myOptions.path + " " + res.statusCode + ",cost " + costTime + "ms\ndata=" + postStr + "\nretData=" + data);
        }
        return cb(false, res, data);
      });
    });
    req.on('error', function(e) {
      var costTime;
      if (logger) {
        costTime = new Date().getTime() - beginTime;
        logger.error("post " + myOptions.host + ":" + myOptions.port + " " + myOptions.path + ",cost " + costTime + "ms,error:" + e + "\ndata=" + postStr);
      }
      return cb(e);
    });
    if (postStr) {
      req.write(postStr, 'utf8');
    }
    timeout = options.timeout || DEFAULT_TIMEOUT;
    req.setTimeout(timeout);
    req.on('timeout', function() {
      return req.abort();
    });
    return req.end();
  };

  get = function(options, cb) {
    var beginTime, logger, myOptions, paramStr, postStr, req, timeout;
    beginTime = new Date().getTime();
    myOptions = {
      host: options.host,
      port: options.port || 80,
      path: options.path,
      method: 'GET',
      headers: {}
    };
    postStr = null;
    if (options['headers'] != null) {
      myOptions.headers = options['headers'];
    }
    if (options['data'] != null) {
      paramStr = querystring.stringify(options.data);
      if (myOptions.path.indexOf("?") > 0) {
        myOptions.path = myOptions.path + "&" + paramStr;
      } else {
        myOptions.path = myOptions.path + "?" + paramStr;
      }
    }
    logger = options.logger;
    req = http.request(myOptions, function(res) {
      var data;
      res.setEncoding('utf8');
      data = '';
      res.on('data', function(chunk) {
        return data += chunk;
      });
      return res.on('end', function() {
        var costTime;
        if (logger) {
          costTime = new Date().getTime() - beginTime;
          logger.debug("get " + myOptions.host + ":" + myOptions.port + " " + myOptions.path + " " + res.statusCode + ",cost " + costTime + "ms\ndata=" + postStr + "\nretData=" + data);
        }
        return cb(false, res, data);
      });
    });
    req.on('error', function(e) {
      var costTime;
      if (logger) {
        costTime = new Date().getTime() - beginTime;
        logger.error("get " + myOptions.host + ":" + myOptions.port + " " + myOptions.path + ",cost " + costTime + "ms,error:" + e + "\ndata=" + postStr);
      }
      return cb(e);
    });
    timeout = options.timeout || DEFAULT_TIMEOUT;
    req.setTimeout(timeout);
    req.on('timeout', function() {
      return req.abort();
    });
    return req.end();
  };

  module.exports.post = post;

  module.exports.get = get;

}).call(this);
