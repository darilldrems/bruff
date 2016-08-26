var ValueParser = require('./value-parser');
var xtend = require('xtend');

/**
 * static class function for holding methods that
 * can quickly be used anywhere in the application
 */
var Helpers = (function () {

    function parseObject(obj, context) {
        var newObj = {};
        if (typeof obj !== 'function') {
            for (var n in obj) {
                if (obj.hasOwnProperty(n)) {
                    newObj[n] = ValueParser.parse(obj[n], context);
                }
            }
            return newObj;
        }

        return obj(context);
    }

    /**
     * responsible for parsing require or request object {headers:{}, qs: {}, form:{}}
     * into values
     * @method parseRequestObject
     */
    function parseRequestObject(obj, context) {
        for (var n in obj) {
            if (obj.hasOwnProperty(n)) {
                obj[n] = parseObject(obj[n], context);
            }
        }

        return obj;
    }

    /**
     * get random number between range min and max inclusive
     * @param  {int} min minimum inclusive
     * @param  {int} max maximum inclusive
     * @return int
     */
    function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    return {
        parseRequestObject: parseRequestObject,
        getRandomInt: getRandomInt
    }
})();

module.exports = Helpers;
