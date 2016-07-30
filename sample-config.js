module.exports = {
    //key can be any valid express path
    "airtime/(*)": {
        title: "",
        origin: "/{{context.client.req.params.0}}",
        host: "mtn",
        preHooks: [], //an array of functions which will be middlewares to be called before the responseHandler
        cache:{
            key:"",
            time: 3600
        },
        responseFilter: function () {} //can be a function or a string
    },
    "POST:/**": {
        origin: ["seq", {
            host: "",
            method: "",
            path: "",
            requires: {

            },
            responseFilters: function(res){},
        }, {
            host: "",
            path: "#{context.req[0].response.user.id}",
            requires: {
                headers: {
                    "Authorization": ["{req[0].query.name}", "Bearer", (one, two) => {return (two + " " + one)}]
                },
                body: {

                },
                queryString: {

                }
            }
        }],
        responseFilter: function(globalRes){}
    },
    "POST:/logout": "http://pwcstaging.com/logout",
    "/identity/(%)": "http://identity.pwcstaging.com/{{context.client.req.params.0}}"
}