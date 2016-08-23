var assert = require('chai').assert;
var expect = require('chai').expect;
var request = require('supertest');
var express = require('express');
var bodyParser = require('body-parser');
var bruffRequestHandler = require('../lib/bruff-request-handler');
var appConfig = require('../lib/config');
var reqquest = require('request');

var app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

describe("BruffRequestHandler", function () {
  it("Should successfully forward request to destination server", function (done) {
      var catTestMap = {
          base: "",
          _to: {
              url: appConfig.test_server_host+"/categories",
              title: "categories",
          }
      };
      app.get("/cat", bruffRequestHandler(catTestMap, {}));

      request(app)
          .get("/cat")
          .set('Authorization', 'Bearer ' + appConfig.test_access_token)
          .expect(function(resp) {
              console.log("in here");
              console.log(JSON.stringify(resp.body));
          })
          .expect(200, done);

  });
});
