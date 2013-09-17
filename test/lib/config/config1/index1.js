(function() {
  module.exports = {
    app: "test",
    person: {
      name: "job",
      age: 300
    },
    http: {
      port: 3000
    },
    logDir: "a/b/c",
    environment: {
      test1: {
        http: {
          port: 4001
        },
        logDir: "test1"
      },
      test2: {
        http: {
          port: 4002
        },
        logDir: "test2"
      }
    }
  };

}).call(this);
