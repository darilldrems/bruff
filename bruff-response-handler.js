function buildResponse(resp, typ) {
    if (typ === 'oneToOne') {
        // return httpResp.status(resp.statusCode).json(JSON.parse(resp.body));
        console.log("in hereeeeeeeeee");
        return {
            status: resp.statusCode,
            body: resp.body
        }
    }
}


module.exports = buildResponse;