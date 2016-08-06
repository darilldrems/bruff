An express API gateway inspired by netflix zuul

## What is Bruff

Bruff is a simple Nodejs express middleware library that allows you to create an API gateway with a simple
Javascript object literal configuration. It has the ability to route requests to multiple upstream server
asynchronously and synchronously if dependency exist.

## Why did we build Bruff

Our client applications (Web and Mobile) consume resources from different microservices in order to perform
different operations. The mobile client particularly had performance issues due to the fact that it called multiple
endpoints from different services to perform a user action and or got response data more than it needed which increased
latency. To solve this problem we found ourselves building a new kind of middlewares called Backend For Frontend which will
do all the hard work of calling multiple services, aggregating their responses and trimming out unneeded fields in the response
for the client app. This approach increased the mobile client performance greatly. 
A good example will be for a user to log in into our mobile app the app needs to get access token from a service, if it
successfully gets the access token then it needs to call another service to get the bio information of the user whose access
token was retrieved and then login. The BFF came in to provide the mobile client with one new endpoint called /login then the 
BFF will do the work of calling /oauth endpoint and the /me endpoint to get the details.

Because we realised we will be building a lot of middleware applications like this, we decided to enbark on the journey
of looking for a framework for this and we found Netflix Zuul. The problem is we could not use Netflix zuul because 
our engineering team could not support development in Java so we embarked on the journey of building a simple BFF framework
in Nodejs.

## What can Bruff do for you?
+ Dynamic routing - Bruff can route single request, multiple dependent and multiple independent requests to different upstream servers
+ It can allow you filter responses from upstream servers to specific responses needed by client applications.
+ You can enable caching in Bruff express.
+ Others - because Bruff in itself is an express middleware you can do other things such as authentication with 
other express middlewares. You only need to call your middleware before calling bruff.

### Getting started
To get started with Bruff you need to install the bruff npm module
```
npm install bruff-express --save
```

Create a bruff configuration module which holds the information and instruction you have for bruff e.g gateway.js

```Javascript
module.exports = {
    gateway: [
        {
            base: "POST:/login", //the client will request for the endpoint
            _to: [{ //bruff will make request to these two endpoints for you
                url: "localhost:8987/oauth/token",
                title: "oauth",
                requires: {
                    form: {
                        username: "{{client.req.body.username}}", //bruff knows to use username from the client request
                        password: "{{client.req.body.password}}",
                        client_id: context => context.client.req.body.clientId,
                        client_secret: context => context.client.req.body.clientSecret
                    }
                }
            }, {
                url: "localhost:8787/me"
                title: "me",
                cacheKey: "{{client.responses.0.access_token}}", //bruff knows to cache the response of this endpoint with access token from the response of the endpoint above
                requires: {
                    headers: {
                        Authorization: "Bearer {{responses.0.access_token}}" //bruff knows to send the request with header set to access token from response of the request above
                    }
                }
            }],
            order: "sync" //tells bruff that the _to endpoints need to happen one after the other because the last one neeeds the response from the first one
        }
    ],
    config: {
        cache: {
            time: 3600, //number of seconds to cache
            get: function () {},
            set: function () {}
        }
    }
}
```
Once you have your configuration set you can then go to your app.js and do :
```
var bruff = require('bruff-express');
var bruffConfig = require('./gateway);
var express = require('express);

var app = express();

app.use(bruff(bruffConfig));

app.list(8989);
```
