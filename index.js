var express = require('express');
var bruffRequestHandler = require('./bruff-request-handler');
var appConfig = require('./config');

var app = express();

// app.get('/home', function (req, res) {
//     res.json({name: "Ridwan"});
// });

var catTestMap = {
                base: "",
                _to: {
                    url: appConfig.test_server_host+"/categories",
                    title: "categories"
                }
            };
app.get("/categories", bruffRequestHandler(catTestMap, {}));

app.listen(8989);