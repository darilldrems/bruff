var assert = require('chai').assert;
var expect = require('chai').expect;
var request = require('supertest');
var express = require('express');
var bodyParser = require('body-parser');
var bruffRequestHandler = require('../bruff-request-handler');
var appConfig = require('../config');
var reqquest = require('request');

var app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

describe("BruffRequestHandler", function () {

    describe("Forwarder", function () {
        it("Should successfully forward categories and return response", function (done) {
            var catTestMap = {
                base: "",
                _to: {
                    url: appConfig.test_server_host+"/categories",
                    title: "categories",
                }
            };
            app.get("/cat", bruffRequestHandler(catTestMap, {}));
            // var callback = bruffRequestHandler(catTestMap, {});
            // var callback = (function () {
            //     return function (req, res) {
            //         console.log("Its happening here too");
            //         // console.log(JSON.stringify(Object.clone(req)));
            //         // var context = {bruff_client:{}};
            //         // context.bruff_client.bruff_req = req;
            //         // console.log(JSON.stringify(context));
            //         return res.json({name: "Ridwan"});
            //     }
            // })();

            // var simple = function (req, res) {
                
            //     console.log(JSON.stringify(req));
            //     return res.json({name: "Ridwan"});
            // }
            // app.get("/categories", simple);

            request(app)
                .get("/cat")
                .set('Authorization', 'Bearer ' + appConfig.test_access_token)
                .expect(function(resp) {
                    console.log(JSON.stringify(resp));
                })
                .expect(200, done);

        });


    });
});