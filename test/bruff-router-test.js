var assert = require('chai').assert;
var bruffRouter = require('../lib/bruff-router');

describe("bruff-router", function () {
    it("It should contain passed values", function () {

        var setup = {
            gateway: [
                {
                    base: "POST:/login",
                    _to: {
                      url: "http://bbg.com",
                      title: "cories"
                    }
                },
                {
                    base: "GET:/categories",
                    _to: {
                      url: "http://bbg.com",
                      title: "categories"
                    }
                },
                {
                    base: "/home",
                    _to: {
                      url: "http://bbg.com",
                      title: "cat"
                    }
                }
            ],
            config: {

            }
        };

        var router = bruffRouter(setup);

        assert("/login".match(router.stack[0].regexp));
        assert("/categories".match(router.stack[1].regexp));
        assert("/home".match(router.stack[2].regexp));
    });
});
