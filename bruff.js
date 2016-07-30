var bruffRouter = require('./bruff-router');

var bruff = function (app, maps, settings) {
    //TODO: validatate schema

    //to bind gateway paths
    app.use(bruffRouter(maps));
    
}

module.exports = bruff;