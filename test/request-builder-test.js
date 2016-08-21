var RequestBuilder = require('../lib/request-builder');
var expect = require('chai').expect;

describe("RequestBuilder()", function () {
    it("Property in constructor should match", function () {

        var createdObject = {
            headers: {
                Authorization: "Bearer 12345"
            },
            form: {
                name: "Ridwan Olalere"
            },
            qs: {
                age: 12
            }
        };

        var req = new RequestBuilder("http://localhost:8089", createdObject); 
        req.makeRequest("GET", "/categories/home")
            .then(function (resp) {
                //whatever
            });
        
        expect(req._requestObject).to.have.property('headers');
        expect(req._requestObject.headers).to.have.property('Authorization', 'Bearer 12345');
        expect(req._requestObject).to.have.property('form');
        expect(req._requestObject.form).to.have.property('name', 'Ridwan Olalere');
        expect(req._requestObject).to.have.property('qs');
        expect(req._requestObject.qs).to.have.property('age', 12);
        expect(req._requestObject.uri).to.be.eql("http://localhost:8089/categories/home");
        expect(req._requestObject.method).to.be.eql("GET");

    });

    it("Get Request should be successful", function (done) {
        new RequestBuilder("https://pwcstaging.herokuapp.com/", {})
            .makeRequest("GET")
            .then(function (resp) {
                expect(resp.statusCode).to.be.eql(200);
                done();
            });
    });
});