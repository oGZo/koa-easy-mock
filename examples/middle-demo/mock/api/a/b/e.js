const responseClass = require(`${process.cwd()}/mock/response.class.js`);
module.exports = ctx => {
  ctx.body = {
    ...responseClass,
    data: 'e',
  };
};
