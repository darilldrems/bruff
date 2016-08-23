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
          base: "/cat",
          _to: {
              url: appConfig.test_server_host+"/categories",
              title: "categories",
          }
      };
      app.get(catTestMap.base, bruffRequestHandler(catTestMap, {}));

      request(app)
          .get("/cat")
          .set('Authorization', 'Bearer ' + appConfig.test_access_token)
          .expect(function(resp) {
              expect(resp.body.status).to.be.equal("success");
          })
          .expect(200, done);

  });

  it("should successfully forward for multiple sync requests", function (done) {
    var loginTestMap = {
      base: "/login",
      _to: [{
        url:  appConfig.test_staging_server+"/oauth/token",
        title: "oauth",
        method: "POST",
        requires: {
          form: {
            client_id: "{{client.req.body.client_id}}",
            client_secret: "{{client.req.body.client_secret}}",
            username: "{{client.req.body.username}}",
            password: "{{client.req.body.password}}",
            grant_type: "{{client.req.body.grant_type}}"
          }
        }
      }, {
        url: appConfig.test_staging_server+"/me",
        title: "me",
        method: "GET",
        requires: {
          headers: {
            Authorization: "Bearer {{responses.0.access_token}}"
          }
        }
      }],
      order: "sync"
    };

    app.post(loginTestMap.base, bruffRequestHandler(loginTestMap, {}));

    request(app)
      .post("/login")
      .send({
        client_id: "577e5fe42989c31100b26f14",
        client_secret: "diHopa8yFNDWofRNJIeREDmAV3HhL7bwr4umhlhPS0CgqIiOylA6Y9obfsV9VsbWBDuMUKE7MvVpIrtip4oX8zmG21I4QI1rhwjx",
        username: "+2349098090424",
        password: "jack2211989",
        grant_type: "password"
      })
      .expect(function (res) {
        // console.log(JSON.stringify(res.body));
        expect(res.body).to.be.ok;
      })
      .expect(200, done);


  });
});
