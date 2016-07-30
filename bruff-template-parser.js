var Mustache = require('mustache');

/**
 * responsible for parsing values that use template tags
 * to dynamically pass context
 * @class BruffTemplateParser
 */

class BruffTemplateParser {

    /**
     * @method parse
     * @static
     * @param context {Object}
     * @param template {String}
     */
    
    static parse(context, template) {
        return Mustache.render(template, context);
    }
}

module.exports = BruffTemplateParser;