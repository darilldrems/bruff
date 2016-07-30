var assert = require('chai').assert;
var bruffRouter = require('../bruff-router');

describe("bruff-router", function () {
    it("It should contain passed values", function () {
        var map = {
            "POST:/login": {},
            "GET:/categories": {},
            "/home": {}
        };

        var router = bruffRouter(map);

        assert("/login".match(router.stack[0].regexp));
        assert("/categories".match(router.stack[1].regexp));
        assert("/home".match(router.stack[2].regexp));
    });
});