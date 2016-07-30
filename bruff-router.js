var express = require('express');
var expressRouter = new express.Router();

/**
 * private 
 * responsible for holding the bruff request handler function which 
 * gets called when a request is made to the path
 */
var bruffRequestHandler = require('./bruff-request-handler');

var bruffRouter = function (maps) {

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
            methodAndPath.path = splitted[1];
        }

        return methodAndPath;
    }

    /**
     * loops through the map keys to set the paths
     * and methods on express router to pass to the bruff request handler
     */
    for (var path in maps) {
        if (maps.hasOwnProperty(path)) {
            var mapInstruction = splitIntoMethodAndPath(path);
            if (mapInstruction.method === "GET") {
                expressRouter.get(mapInstruction.path, bruffRequestHandler(maps[path]));
            } else if (mapInstruction.method === "POST") {
                expressRouter.post(mapInstruction.path, bruffRequestHandler(maps[path]));
            } else {
                expressRouter.get(mapInstruction.path, bruffRequestHandler(maps[path]));
            }
        }
    }

    return expressRouter;
};

module.exports = bruffRouter;