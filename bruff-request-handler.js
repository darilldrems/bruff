var BruffConfigValidator = require('./bruff-config-validator');

var bruffRequestHandler = function (map, config) {
    /**
     * this represents the gateway mapping instruction
     */
    var destination = map._to;
    var config = config;
    var toOrder = map.order;

    var isCacheEnabled = config.cache !== undefined ? true : false;
    var cacheTimeInSeconds = isCacheEnabled ? 0 : config.cache.time;
    if (isCacheEnabled) {
        var cacheClient = {
            get: config.cache.get,
            set: config.cache.set
        };
    }     

    BruffConfigValidator.validate(destination, toOrder);

    return function (req, res, next) {

        /**
         * global object which will carry information about requests and response to be
         * used for autowiring in config/instruction values
         */
        var context = { client: {} }; //client represents the client making the request
        
        context.client.req = req;

        //check if destination server is an array of servers to be called
        //and responses merged if not do the single request to remote server
        if (Array.isArray(destination)) {
            
        } else {

        }
    }
};

module.exports = bruffRequestHandler;