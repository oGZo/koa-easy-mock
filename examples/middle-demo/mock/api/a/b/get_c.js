const responseClass = require(`${process.cwd()}/mock/response.class.js`);
module.exports = (ctx) => {
    ctx.body = {
        ...responseClass,
        data: {
            "nCode": 1000001,
            "resultList": [
                10590
            ]
        },
    }
}