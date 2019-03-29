const Koa = require('koa');
const app = new Koa();
const easyMock = require('../../');

const port = 3001;

app.use(easyMock.easyMockMiddle({
    apiFilePath: 'mock/api',
    apiPath: '/api'
}))
app.listen(port, () => {
    console.log(`mock start: http://localhost:${port}`);
})