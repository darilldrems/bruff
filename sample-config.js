module.exports = {
    "/users/**": {
        origin: "",
        hooks: {
            action: {
                pre: [],
                post: []
            },
            filter: {
                pre: [],
                post: []
            }
        },
        cache:{
            key:"",
            rule: "",
            time: 3600
        },
        responseFilter: function () {}
    },
    "POST:/login": {
        origin: ["seq", {
            host: "",
            path: "",
            requires: {

            },
            responseFilters: function(res){},
        }, {
            host: "",
            path: "",
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
    "POST:/logout": "http://pwcstaging.com/logout"
}