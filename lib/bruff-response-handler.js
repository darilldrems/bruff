var _ = require('underscore');

/**
 * responsible for going through
 * responses from upstream server to find the appropriate
 * aggregate response status and body
 * @class BruffResponseHandler
 * @static
 */
class BruffResponseHandler {

    /**
     * @method buildResponse
     * @param resp {Object}
     */
    static buildResponse(resp) {

        var statusCodes = [];
        var respBodies = {};


        for (var instance in resp) {
            if (resp.hasOwnProperty(instance)) {
                statusCodes.push(resp[instance].statusCode);
                
                respBodies[instance] = resp[instance].body;
                // if (resp[instance].statusCode >= 500) {
                //
                // } else {
                //     respBodies[instance] = JSON.parse(resp[instance].body);
                // }
            }
        }

        //if all the status codes eql 200
        if (_.every(statusCodes, el => el === 200)) {
            return {
                status: 200,
                body: respBodies
            }
        }

        //if fail and success respond with statusCode 206 and data
        //if some succeeds and some fails
        if (_.some(statusCodes, el => el === 200)) {
            return {
                status: 206,
                body: respBodies
            }
        }

        //if all fail with same status code
        var first = statusCodes[0];
        if (_.every(statusCodes, el => el === first)) {
            return {
                status: first,
                body: respBodies
            }
        }

        //if all fail with different status codes return status 424
        return {
            status: 424,
            body: respBodies
        }

    }
}


module.exports = BruffResponseHandler;
