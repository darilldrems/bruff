var Q = require('q');
var BruffProcessor = require('../bruff-processor');
var expect = require('chai').expect;
var assert = require('chai').assert;
var util = require('util');
const appConfig = require('../config');


describe("BruffProcessor", function () {

    var context = {
        client: {
            req: {
                headers: {

                },
                method: "POST",
                body: {
                    access_token: appConfig.test_access_token
                }
            }
        }
    };

    describe ("_runResponseFilter()", function () {
        var response = {
            status: "success",
            data: {
                name: "Ridwan"
            }
        }

        var filter = (resp) => {
            resp.data.name = "Rilo";
            return resp;
        }

        var filters = [(resp) => {
            resp.status = "succ";
            return resp;
        }, resp => {
            resp.data.age = 24;
            return resp;
        }];

        it("filter function should change response", function () {
            var result = BruffProcessor._runResponseFilter(response, filter);
            expect(result.data.name).to.be.eq('Rilo');
        });

        it("filter function should change response", function () {
            var result = BruffProcessor._runResponseFilter(response, filters);
            expect(result.status).to.be.eq('succ');
            expect(result.data.age).to.be.eq(24);
        });
    });

    describe("processOneToOne()", function () {

        var _to = {
            url: appConfig.test_server_host+'/categories',
            title: "",
            cacheKey: "",
            method: "GET",
            requires: {
                headers: {
                    "authorization": "{{client.req.body.access_token}}"
                }
            }
        };
        
        it("POST request should be mapped successfully to GET", function (done) {
            BruffProcessor
                .processOneToOne(_to, context)
                .then(function (resp){
                    var json = JSON.parse(resp.body);
                    expect(json.status).to.be.eq('success');
                    assert(json.data).isDefined();
                    done();
                })
                .catch(function (error){
                    console.log(JSON.stringify(error));
                    done();
                });
        });

        it("Process POST to POST succesfully with data transfer", function (done) {
            delete context.client.req.headers;
            context.client.req.method = "POST";
            context.client.req.body = {
                client_id: appConfig.test_client_id,
                client_secret: appConfig.test_client_secret,
                username: appConfig.test_username,
                password: appConfig.test_password
            };

            var _to = {
                url: appConfig.test_server_host+'/login',
                title: "login",
            }

            BruffProcessor
                .processOneToOne(_to, context)
                .then(function (resp) {
                    var json = JSON.parse(resp.body);
                    appConfig.test_access_token = json.auth.access_token;
                    assert(json.auth.access_token).isDefined();
                    done();
                })
                .catch(function (error) {
                    console.log(JSON.stringify(error));
                    done();
                });

        });



    });


    describe("processManyAsync", function () {
        var context = {
            client: {
                req: {
                    headers: {
                        authorization: appConfig.test_access_token
                    },
                    method: "POST"

                }
            }
        }

        

        it("Process multiple asyncronously with failed req", function (done) {
            var _tos = [{
                url: appConfig.test_server_host+"/categories",
                title: "categories",
                method: "GET"
            }, {
                url: appConfig.test_server_host+"/banks",
                title: "banks",
                method: "GET",
            }];

            BruffProcessor
                .processManyAsync(_tos, context)
                .then(function (res) {
                    var catResp = JSON.parse(res.categories.body);
                    expect(catResp.status).to.be.eq("success");
                    expect(res.banks.statusCode).to.be.eq(404);
                    done();
                });
        });

        it("Process multiple asyncronously be it post or get", function (done) {
            context.client.req = {
                headers: {
                    authorization: appConfig.test_access_token,
                },
                body: {
                        client_id: appConfig.test_client_id,
                        client_secret:  appConfig.test_client_secret,
                        username: appConfig.test_username,
                        password: appConfig.test_password
                    },
                method: "POST"
            };

            var _tos = [{
                url: appConfig.test_server_host+"/categories",
                method: "GET",
                title: "categories"
            }, {
                url: appConfig.test_server_host+"/login",
                method: "POST",
                title: "oauth",
                requires: {
                    form: {
                        client_id: context => context.client.req.body.client_id,
                        client_secret: "{{client.req.body.client_secret}}",
                        username: "{{client.req.body.username}}",
                        password: "{{client.req.body.password}}"
                    }
                }
            }];

            BruffProcessor
                .processManyAsync(_tos, context)
                .then(function (res) {
                    expect(res.categories.statusCode).to.be.eq(200);
                    expect(res.oauth.statusCode).to.be.eq(200);
                    done();
                });

        });


    });

    describe("processManySync runs succesfully", function () {
            var context = {
                client: {
                    req: {
                        headers: {
                            authorization: appConfig.test_access_token,
                        },
                        body: {
                                client_id: appConfig.test_client_id,
                                client_secret:  appConfig.test_client_secret,
                                username: appConfig.test_username,
                                password: appConfig.test_password
                            },
                        method: "POST"
                    }
                }
            }

            it("processManySync", function (done) {
                var _tos = [{
                    url: appConfig.test_server_host+"/categories",
                    method: "GET",
                    title: "categories"
                }, {
                    url: appConfig.test_server_host+"/login",
                    method: "POST",
                    title: "oauth",
                    requires: {
                        form: {
                            client_id: context => context.client.req.body.client_id,
                            client_secret: "{{client.req.body.client_secret}}",
                            username: "{{client.req.body.username}}",
                            password: "{{client.req.body.password}}"
                        }
                    }
                }];

                BruffProcessor
                    .processManySync(_tos, context)
                    .then(function (res) {
                        expect(res.categories.statusCode).to.be.eq(200);
                        expect(res.oauth.statusCode).to.be.eq(200);
                        done();
                    });
            });

            it("processManySync that are dependent", function (done) {
                var context = {
                    client: {
                        req: {
                            body: {
                                    client_id: appConfig.test_client_id,
                                    client_secret:  appConfig.test_client_secret,
                                    username: appConfig.test_username,
                                    password: appConfig.test_password,
                                    grant_type: "password"
                                },
                            method: "POST"
                        }
                    }
                }

                var _tos = [{
                    url: appConfig.test_staging_server+"/oauth/token",
                    method: "POST",
                    title: "oauth"
                }, {
                    url: appConfig.test_staging_server+"/me",
                    method: "GET",
                    title: "me",
                    requires: {
                        headers: {
                            authorization: "Bearer {{responses.0.access_token}}"
                        }
                    }
                }];

                BruffProcessor
                    .processManySync(_tos, context)
                    .then(function (res) {
                        expect(res.me.statusCode).to.be.eq(200);
                        expect(res.oauth.statusCode).to.be.eq(200);
                        done();
                    });

            });
    });
});