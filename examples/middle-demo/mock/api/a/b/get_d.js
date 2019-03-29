const responseClass = require(`${process.cwd()}/mock/response.class.js`);
module.exports = {
    ...responseClass,
    data: {
        a: 1
    },
    code: 1,
    message: '测试一下' 
}