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
        Fix for weird header errors
        */

        //Not sure why. content-length seems to be the problem
        delete reqObject.headers['content-length'];

        /*
        End Fix
        */

        request(reqObject, function (error, response, body){
            if (error) {
                throw new Error("Error occured in request builder for " + reqObject.uri);
            } else {
                if (response.statusCode === 200) {
                    //parse the response data
                    var data = JSON.parse(response.body);
                    //check if the json response contains status property
                    //if it does check if it is success else reject the promise to 
                    //indicate failure
                    if (data.status !== undefined && data.status !== "success") {
                        deferred.reject(response);
                    } else {
                        deferred.resolve(response);
                    }
                } else {
                    deferred.reject(response);
                }
            }
        });        

        return deferred.promise;
    }
}

module.exports = RequestBuilder;