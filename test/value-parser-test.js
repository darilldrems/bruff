var expect = require('chai').expect;
var ValueParser = require('../value-parser');

describe("ValueParser.parse()", function () {
    var context = {
            client: {
                body: {
                    name: "Ridwan Olalere"
                }
            }
        };

    it("It should successfully parse function", function () {
        
        var val = function(contxt) {
            return contxt.client.body.name;
        };

        var result = ValueParser.parse(val, context);
        expect(result).to.be.eql("Ridwan Olalere");
    });

    it("It should successfully parse template tags", function () {
        var val = "My name is {{client.body.name}}";
        var result = ValueParser.parse(val, context);
        expect(result).to.be.eql("My name is Ridwan Olalere");
    });

});