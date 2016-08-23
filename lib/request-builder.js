var request = require('request');
var Q = require('q');
var Url = require('url');

/**
 * responsible for building request to remote servers
 * using request module and circuit breaker pattern
 * @class RequestBuilder
 */

class RequestBuilder {

    /**
     * @class RequestBuilder
     * @constructor
     * @param options {Object} example {headers:{}, qs: {}, form: {}}
     * @param baseUrl {String} http://pwcccc.com
     */
    constructor(baseUrl, options) {
        this._requestObject = {};
        this._requestObject.uri = baseUrl;

        if (options) {
            for (var key in options) {
                if (options.hasOwnProperty(key)) {
                    this._requestObject[key] = options[key];
                }
            }
        }
    }

    /**
     * @param method {String} can either be GET or POST
     * @param [path] {String} e.g /home/school
     */
    makeRequest(method, path) {
        var deferred = Q.defer();

        var method = method.toUpperCase();
        this._requestObject.method = method;

        if (path) {
            this._requestObject.uri = Url.resolve(this._requestObject.uri, path);
        }

        var reqObject = this._requestObject;

        /*
        Fix for weird header errors.
        */

        //Not sure why. content-length seems to be the problem
        // delete reqObject.headers['content-length'];
        // delete reqObject.headers['host'];
        // delete reqObject.headers['user-agent'];
        // delete reqObject.headers['content-type'];
        // delete reqObject.headers['accept'];
        // delete reqObject.headers['connection'];
        delete reqObject.headers['accept-encoding'];


        /*
        End Fix
        */
        console.log(JSON.stringify(reqObject));
        request(reqObject, function (error, response, body){
            if (error) {
                throw new Error("Error occured in request builder for " + error);
            } else {
                deferred.resolve(response);
            }
        });

        return deferred.promise;
    }
}

module.exports = RequestBuilder;
