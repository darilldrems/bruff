var bruffRequestHandler = function (data) {
    /**
     * this represents the gateway mapping instruction
     */
    var instruction = data;

    return function (req, res, next) {

         //if the instruction is a string then use forwarder
         //to forward the exact request from the server
        if (typeof instruction === 'string') {
            //TODO just use the forwarder and return the exact response from origin server
            
        }         

        /**
         * cache instruction will be used for generating cache key
         * and time. response will not be cached
         */
        var cacheInstruction = instruction.cache;

        /**
         * global object which will carry information about requests and response to be
         * used for autowiring in config/instruction values
         */
        var context = { client: {} }; //client represents the client making the request
        
        context.client.req = req;

        /**
         * this represents the remote server endpoint client request should be forwarded to
         * it can be string: "", object literal {} or array []
         * if it is string the client request will be directly mapped to the server endpoint
         * if it is object literal it will check customizations before sending to the server
         * if it is [] the first element must be instruction on how to forward request either
         * sequencially or parallel
         */
        var origin = instruction.origin;

        //check if origin is truthy if not probably throw exception
        if (origin) {
            if (typeof origin === 'string') {
                //TODO build the string value if it contains context template tags
                //TODO: make the request to server 
            }

            if (typeof origin === 'object') {
                //TODO treat origin as object, customize request and call server
            }

            if (Array.isArray(origin)) {
                //TODO treat origin an array and perform action
            }

        } else {
            //TODO: throw an exception here
        }

        
        
       

    }
};

module.exports = bruffRequestHandler;