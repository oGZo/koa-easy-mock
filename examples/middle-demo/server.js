const Koa = require('koa');
const app = new Koa();
const easyMock = require('../../');
const Bodyparser = require('koa-bodyparser');

const port = 3001;

app.use(Bodyparser());
app.use(
  easyMock.easyMockMiddleware({
    apiFilePath: 'mock/api',
    apiPath: '/api',
  })
);
app.listen(port, () => {
  console.log(`mock start: http://localhost:${port}`);
});
