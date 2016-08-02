var assert = require('chai').assert;
var BruffTemplateParser = require('../bruff-template-parser');

describe("bruff-template-parser", function () {

    it("It should parse the template correctly", function () {
        var template = "Welcome {{name}}!";
        var view = {
            name: "Ridwan"
        }
        var result = "Welcome Ridwan!";

        var parserResult = BruffTemplateParser.parse(view, template);

        assert(result === parserResult);
    });
});