var expect = require('chai').expect;
var assert = require('chai').assert;
var BruffResponseHandler = require('../lib/bruff-response-handler.js');

describe("BruffResponseHandler", function () {
    describe("buildResponse()", function () {

        it("All successful responses expected status code is 200", function () {
            var allResponseSuccessful = {class: {statusCode: 200, body:JSON.stringify({name: 'Ridwan'})},
                                             clazz: {statusCode: 200, body:JSON.stringify({balance: 200})}};
            var result = BruffResponseHandler.buildResponse(allResponseSuccessful);
            expect(result.status).to.be.eq(200);
            expect(result.body.class.name).to.be.eq("Ridwan");
            expect(result.body.clazz.balance).to.be.eq(200);
        });

        it("All failed with same error status expects same error status", function () {
            var responses = {
                class: {statusCode: 500, body: "//shduuyakakas//sjhd"},
                clazz: {statusCode: 500, body: "yamamyama"}
            };

            var result = BruffResponseHandler.buildResponse(responses);
            expect(result.status).to.be.eq(500);
            expect(result.body.class).to.be.eq("//shduuyakakas//sjhd");
            expect(result.body.clazz).to.be.eq("yamamyama");
        });

        it("Some failed and some pass", function () {
            var responses = {
                class: {statusCode: 200, body: JSON.stringify({name: 'Rilo'})},
                clazz: {statusCode: 404, body: JSON.stringify({message: 'Not found'})},
                mine: {statusCode: 500, body: "server error"}
            };

            var result = BruffResponseHandler.buildResponse(responses);
            expect(result.status).to.be.eq(206);
            expect(result.body.class.name).to.be.eq('Rilo');
            expect(result.body.mine).to.be.eq("server error");
            expect(result.body.clazz.message).to.be.eq('Not found');
        });

        it("All failed with different status codes", function () {
            var responses = {
                class: {statusCode: 404, body: JSON.stringify({message: 'Not found'}) },
                clazz: {statusCode: 400, body: JSON.stringify({message: 'UnAuthorized'})}
            }
            var result = BruffResponseHandler.buildResponse(responses);
            expect(result.status).to.be.eq(424);
            expect(result.body.class.message).to.be.eq('Not found');
            expect(result.body.clazz.message).to.be.eq('UnAuthorized');
        });

    });
});