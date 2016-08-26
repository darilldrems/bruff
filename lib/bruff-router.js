var express = require('express');
var expressRouter = new express.Router();

/**
 * private 
 * responsible for holding the bruff request handler function which 
 * gets called when a request is made to the path
 */
var bruffRequestHandler = require('./bruff-request-handler');

var bruffRouter = function (setup) {

    /**
     * splits a map key "GET:/users/:id" into 
     * method and path to used by express Router object
     */
    function splitIntoMethodAndPath(pathAndMethod) {
        var methodAndPath = {
            method: "any".toUpperCase(),
            path: pathAndMethod
        };

        var splitted = pathAndMethod.split(":");
        if (splitted.length > 1) {
            methodAndPath.method = splitted[0].toUpperCase();
            methodAndPath.path = pathAndMethod.replace(splitted[0] + ':', '');
        }

        return methodAndPath;
    }

    /**
     * destination and base routes with instructions on 
     * how to transfer, cache, filter responses from remote 
     * server
     */
    var gateway = setup.gateway;

    /**
     * setup config such as cache time, cache contract
     */
    var config = setup.config;

    for (var i = 0; i < gateway.length; i++) {
        var baseMethodAndPath = splitIntoMethodAndPath(gateway[i].base);
        if (baseMethodAndPath.method === "GET") {
            expressRouter.get(baseMethodAndPath.path, bruffRequestHandler(gateway[i], config));
        } else if (baseMethodAndPath.method === "POST") {
            expressRouter.post(baseMethodAndPath.path, bruffRequestHandler(gateway[i], config));
        } else {
            expressRouter.all(baseMethodAndPath.path, bruffRequestHandler(gateway[i], config))
        }
    }

    return expressRouter;
};

module.exports = bruffRouter;