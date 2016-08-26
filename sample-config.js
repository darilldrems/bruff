/**
 * Draft
 * 
 */

module.exports = {
    gateway:[
        {
            base: "",
            _to: {
                url: "",
                title: ""
            }
        },
        {
            base: "",
            _to: {
                url: "",
                title: "",
                cacheKey: "",
                method: ""
            }
        },
        {
            base: "",
            _to: [{
                url: "",
                title: "",
                method: "",
                responseFilter: "",
                cacheKey: "",
                requires: {
                    headers: {

                    },
                    form: {

                    },
                    qs: {

                    }
                }
            },
            {

            }
            ],
            order: "sync" || "async"
        },
    ],
    config: {
        cache: {
            time: 3600,
            get: function get() {},
            set: function set() {}
        },
        logging: {

        }
    }
}