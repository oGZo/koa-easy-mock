const responseClass = require(`${process.cwd()}/mock/response.class.js`);
module.exports = ctx => {
  ctx.body = {
    ...responseClass,
    data: {
      a: 1,
      body: ctx.req.body || ctx.request.body,
      query: ctx.query,
    },
    code: 1,
    message: '测试一下no method',
  };
};
