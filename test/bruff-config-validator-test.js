var expect = require('chai').expect;
var BruffConfigValidator = require('../lib/bruff-config-validator');

describe("BruffConfigValidator.validate()", function () {

    it("Should throw error if title not set", function () {
        var dest =  {
            url: "http://localhost:8080/homepage"
        };

        function testError() {
            BruffConfigValidator.validate(dest);
        }

        expect(testError).to.throw('title is a required property of _to');
    });

    it("Should throw error if url is not set", function () {
        var dest =  {
            title: "http://localhost:8080/homepage"
        };

        function testError() {
            BruffConfigValidator.validate(dest);
        }

        expect(testError).to.throw('url is a required property of _to');
    });

    it("Should throw if title is empty", function () {
        var dest =  {
            title: "",
            url: ""
        };

        function testError() {
            BruffConfigValidator.validate(dest);
        }

        expect(testError).to.throw('title can not be empty');
    });

    it("Should throw if url is empty", function () {
        var dest =  {
            title: "hello",
            url: ""
        };

        function testError() {
            BruffConfigValidator.validate(dest);
        }

        expect(testError).to.throw('url can not be empty');
    });

    it("Should throw exception if destination is array and no order set", function () {
        var dest = [
            {
                title: "home",
                url: "http://localhost:8989"
            }
        ];

        function testError() {
            BruffConfigValidator.validate(dest);
        }

        expect(testError).to.throw('order is required since _to is Array type');
    });

    it("Should throw exception if order is invalid", function () {
        var dest = [
            {
                title: "home",
                url: "http://localhost:8989"
            }
        ];

        function testError() {
            BruffConfigValidator.validate(dest, 'synca');
        }

        expect(testError).to.throw('order should be either sync or async');
    })
    

});