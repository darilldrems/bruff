var BruffConfigValidator = require('./bruff-config-validator');
var BruffProcessor = require('./bruff-processor');
var buildResponse = require('./bruff-response-handler');
var xtend = require('xtend');

var bruffRequestHandler = function (map, config) {
    /**
     * this represents the gateway mapping instruction
     */
    var destination = map._to;
    var config = config;
    var toOrder = map.order;

    var isCacheEnabled = config.cache !== undefined ? true : false;
    var cacheTimeInSeconds = isCacheEnabled ? config.cache.time : 0;

    if (isCacheEnabled) {
        var cacheClient = {
            get: config.cache.get,
            set: config.cache.set
        };
    }     

    BruffConfigValidator.validate(destination, toOrder);

    function errorFunc(err) {
        throw new Error(err);
    }

    return function (req, res) {

        /**
         * global object which will carry information about requests and response to be
         * used for autowiring in config/instruction values
         */
        var context = { client: {} }; //client represents the client making the request
        
        context.client.req = {
            headers: xtend({}, req.headers),
            query: xtend({}, req.query),
            method: req.method,
            body: req.body
        };

        var response;

        //check if destination server is an array of servers to be called
        //and responses merged if not do the single request to remote server
        if (Array.isArray(destination)) {
            if (toOrder && toOrder === 'sync') {
                //process many requests to destination synchronously
                BruffProcessor
                    .processManySync(destination, context)
                    .then(function (resp) {
                        response = resp;
                    })
                    .catch(errorFunc);

            } else {
                //process many requests to destination servers asynchronously
                BruffProcessor
                    .processManyAsync(destination, context)
                    .then(function (resp){
                        response = resp;
                    })
                    .catch(errorFunc);
            }

        } else {

            BruffProcessor
                .processOneToOne(destination, context)
                .then(function (resp) {
                    var respBody = res.body
                    if (resp.statusCode !== 500) {
                        respBody = JSON.parse(resp.body)
                    }
                    return res.status(resp.statusCode).json(respBody);
                })
                .catch(errorFunc);
        }
    }
};

module.exports = bruffRequestHandler;