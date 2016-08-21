var expect = require('chai').expect;

var Helpers = require('../lib/bruff-helpers');

describe("Helper", function () {
    var context = {
        client: {
            req: {
                headers: {
                    "authorization": "bearer"
                },
                body: {
                    client_id: "12345"
                },
                query: {
                    search: "bags"
                }
            }
        }
    };

    describe("parseRequestObject()", function () { 
        var rq = {
            headers: {
                test_val: "{{client.req.headers.authorization}}"
            },
            form: {
                user_id: context => context.client.req.body.client_id
            },
            qs: context => {
                return {name: context.client.req.query.search}
            }
        };

        var result = Helpers.parseRequestObject(rq, context);

        it("requestObject test_val should be bearer", function () {
            expect(result.headers.test_val).to.be.eq(context.client.req.headers.authorization);
        });

        it("requestObject user_id should be 12345", function () {
            expect(result.form.user_id).to.be.eq(context.client.req.body.client_id);
        });

        it("requestObject qs name should be bags", function () {
            expect(result.qs.name).to.be.eq(context.client.req.query.search);
        });
    });
});