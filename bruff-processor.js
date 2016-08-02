var ValueParser = require('./value-parser');
var xtend = require('xtend');
var Q = require('q');
var Helpers = require('./bruff-helpers');
var RequestBuilder = require('./request-builder');

/**
 * this class is responsible for processing requests
 * to the destination servers. can process one to one 
 * or one to many
 * @clas BruffProcessor
 */
class BruffProcessor {

    static _doTask(destination, context) {
        var deferred = Q.defer();

        //set the method to use for remote call to variable method
        //either use destination method if set or use request method used by client
        var method = destination.method || context.client.req.method;
        var url = ValueParser.parse(destination.url, context);

        var requestObject = {};
        requestObject.headers = context.client.req.headers;
        //set request default values base on the method
        if (method === "GET") {
            requestObject.form = context.client.req.body;
        } else {
            requestObject.qs = context.client.req.query;
        }
        
        //if destination has requires override the default request values with it
        if (destination.hasOwnProperty('requires')) {
            //TODO parse values in the require section
            //with context values
            var destRequirement = Helpers.parseRequestObject(destination.requires, context);

            //override the request object with values in require
            requestObject = xtend(requestObject, destRequirement);
        }

        new RequestBuilder(url, requestObject)
            .makeRequest(method)
            .then(function (resp) {
                deferred.resolve(resp);
            })
            .catch(function (error) {
                deferred.reject(error);
            });

        return deferred.promise;
    }

    static processOneToOne(destination, context) {
        BruffProcessor._doTask(destination, context);
    }

    static processOneToMany(order, destinations, context) {

    }

    static processManyAsync() {

    }

    static processManySync() {
        
    }
}

module.exports = BruffProcessor;