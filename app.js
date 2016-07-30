var express = require('express');
var router = express.Route();
var app = express();

router.get("/home", function (req, res) {
    res.send("home");
});

router.get("/fb", function (req, res) {
    res.send("fb");
});
console.log(router.stack);
app.use(router);
app.listen(8089, function () {
    console.log(JSON.stringify(express));
    console.log("welcome");
});