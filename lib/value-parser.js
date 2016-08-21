var BruffTemplateParser = require('./bruff-template-parser');

/**
 * responsible for parsing values to string.
 * because a _to property value can either be a valid js function
 * or template string "{{client.req.body.name}}"
 * @class ValueParser
 */
class ValueParser {

    /**
     * parses the val to string
     * @method parse
     * @static
     * @param val {String|Function}
     * @param context {Object} the handler context at the time its been called
     */
    static parse(val, context) {
        var result;

        if (typeof val === 'function') {
            result = val(context);
        } else {
            result = BruffTemplateParser.parse(context, val);
        }

        return result;
    }
}

module.exports = ValueParser;

