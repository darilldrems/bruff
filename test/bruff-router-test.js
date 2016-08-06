var assert = require('chai').assert;
var bruffRouter = require('../lib/bruff-router');

describe("bruff-router", function () {
    it("It should contain passed values", function () {

        var setup = {
            gateway: [
                {
                    base: "POST:/login",
                    _to: {

                    }
                },
                {
                    base: "GET:/categories",
                    _to: {
                        
                    }
                },
                {
                    base: "/home",
                    _to: {
                        
                    }
                }
            ]
        };

        var router = bruffRouter(setup);
        
        assert("/login".match(router.stack[0].regexp));
        assert("/categories".match(router.stack[1].regexp));
        assert("/home".match(router.stack[2].regexp));
    });
});