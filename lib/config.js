(function() {
  var INDEX_FILE, configFile, fs, getFileConfig, loadConfig, merge, merge_config, path,
    __hasProp = {}.hasOwnProperty;

  path = require("path");

  fs = require("fs");

  merge_config = function(c1, c2, env) {
    var k, v;
    for (k in c2) {
      if (!__hasProp.call(c2, k)) continue;
      v = c2[k];
      if (typeof v === 'object' && !(v instanceof RegExp) && c1[k]) {
        merge_config(c1[k], v);
      } else {
        c1[k] = v;
      }
    }
    return c1;
  };

  merge = function(config, configFileName, env) {
    var configName, config_env, e, youConfig;
    configName = path.basename(configFileName);
    try {
      youConfig = require(configFileName);
      if (youConfig['environment'] != null) {
        config_env = youConfig.environment[env];
        delete youConfig.environment;
        merge_config(youConfig, config_env);
      }
    } catch (_error) {
      e = _error;
      console.trace("" + e);
      process.exit(1);
    }
    return config[configName] = youConfig;
  };

  getFileConfig = function(configFileName, env) {
    var configName, config_env, e, youConfig;
    configName = path.basename(configFileName);
    try {
      youConfig = require(configFileName);
      if (youConfig['environment'] != null) {
        config_env = youConfig.environment[env];
        delete youConfig.environment;
        merge_config(youConfig, config_env);
      }
    } catch (_error) {
      e = _error;
      console.trace("" + e);
      process.exit(1);
    }
    return youConfig;
  };

  configFile = function(config, filePath) {
    var e, env, myConfig;
    env = config.__env;
    try {
      myConfig = getFileConfig(filePath, env);
      return merge_config(config, myConfig, env);
    } catch (_error) {
      e = _error;
      console.error("error when config file=" + filePath);
      console.trace("" + e);
      return process.exit(1);
    }
  };

  INDEX_FILE = "index.js";

  loadConfig = function(dir, env) {
    var baseName, config, file, fileNames, indexFile, name, _i, _len;
    if (env == null) {
      env = 'test';
    }
    indexFile = path.join(dir, INDEX_FILE);
    config = getFileConfig(indexFile, env);
    fileNames = fs.readdirSync(dir);
    if (fileNames) {
      for (_i = 0, _len = fileNames.length; _i < _len; _i++) {
        name = fileNames[_i];
        if (INDEX_FILE === name || !/\.js$/.test(name)) {
          continue;
        }
        baseName = path.basename(name, '.js');
        file = path.join(dir, baseName);
        merge(config, file, env);
      }
    }
    config.__env = env;
    return config;
  };

  module.exports.loadConfig = loadConfig;

}).call(this);
