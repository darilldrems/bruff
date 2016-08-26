/**
 * responsible for validating the configuration to have necessary
 * key value pair before attaching to request handlers
 * @class BruffConfigValidator
 */
class BruffConfigValidator {

    /**
     * validate single _to object
     * @method _validateTask
     * @param destConfig {Object} {url:'', title:''}
     * @private
     */
    static _validateTask(destConfig) {
        //check if _to is not an array
        if (!Array.isArray(destConfig)) {
            //throw exception if title is not set
            if (!destConfig.hasOwnProperty('title')) {
                throw new Error("title is a required property of _to");
            }

            if (destConfig.hasOwnProperty('title') && destConfig.title === "") {
                throw new Error("title can not be empty");
            }

            //throw an exception if url is not set
            if (!destConfig.hasOwnProperty('url')) {
                throw new Error("url is a required property of _to");
            }

            if (typeof destConfig.url === 'string' && destConfig.url === "") {
                throw new Error("url can not be empty");
            }

            if (Array.isArray(destConfig.url) && destConfig.url.length === 0) {
              throw new Error("url can not be an empty array string");
            }
        }
    }

    /**
     * @method validateDestinationObject
     * @private
     * @throws Exception
     * @param destConfig {Object} contains the instruction for the destination
     * @static
     */
    static _validateDestinationObject(config) {
        //check if _to is Array n validate one by one and if not validate as well
        if (Array.isArray(config)) {
            for (var i = 0; i < config.length; i++) {
                var task = config[i];
                BruffConfigValidator._validateTask(task);
            }
        } {
            BruffConfigValidator._validateTask(config);
        }

    }

    /**
     * @method validateOrder
     * @private
     * @throws Exception
     * @param destinationObject {Object||Array}
     */
    static _validateOrder(destination, toOrder) {
        //validate that order is set if _to is array type
        if (Array.isArray(destination)) {
            if (toOrder === undefined || !toOrder) {
                throw new Error("order is required since _to is Array type");
            }
            //confirm order to be
            if (toOrder) {
                if (toOrder !== "sync" && toOrder !== "async") {
                    throw new Error("order should be either sync or async");
                }
            }
        }
    }

    /**
     * @method validate
     * @throws Exception
     * @param destinationConfig {Object||Array}
     * @param [order] {String}
     */
    static validate(destinationConfig, order) {
        BruffConfigValidator._validateOrder(destinationConfig, order);
        BruffConfigValidator._validateDestinationObject(destinationConfig);
    }
}

module.exports = BruffConfigValidator;
