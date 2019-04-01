const path = require('path');
const yargs = require('yargs');

const easyMockMiddle = (config = {}) => async(ctx, next) => {
    const currentProjectRootPath = process.cwd();
    const mockPath = config && config.apiFilePath;
    const mockFileExt = config && config.ext || '.js';
    const mockAbsoultePath = path.join(currentProjectRootPath, mockPath.startsWith('/') ? mockPath : `${mockPath}/`);
    const splitIdent = config && config.splitIdent || '/';
    const defaultGetApiPath = (ctx) => {
        let apiRelativePath = ctx.path;
        let lastDotIndex = ctx.path.lastIndexOf('.');
        // .do 类型的接口去掉后缀
        if(lastDotIndex > -1) {
            apiRelativePath = ctx.path.slice(0, lastDotIndex);
        }
        // 获取当前api实际文件Path
        if (config.apiPath) {
            apiRelativePath = apiRelativePath.slice(config.apiPath.length);
        }
        // 去除多余 /
        if(apiRelativePath[0] === '/') {
            apiRelativePath = apiRelativePath.slice(1);
        }
        // 添加方法
        let lastSepIndex = apiRelativePath.lastIndexOf('/');
        // api文件路径前缀
        let apiRelativePathPrefix = '';
        if(lastSepIndex > -1){
            apiRelativePathPrefix = apiRelativePath.slice(0, lastSepIndex + 1);
        }
        apiRelativePath = path.join(apiRelativePathPrefix, ctx.method.toLocaleLowerCase() + '_' + apiRelativePath.slice(lastSepIndex + 1));
        return path.resolve(mockAbsoultePath, apiRelativePath.split(splitIdent).join('/') + mockFileExt);
    }
    const getApiPath = config.getApiPath || defaultGetApiPath;
    const isMock = config.isMock || yargs.argv.isMock || process.env.npm_config_env === 'mock' || false;
    if(isMock && config && (config.apiPath && ctx.path.startsWith(config.apiPath))) {
        let apiPath = getApiPath.call(ctx, ctx);
        try{
            const mockObj = require(apiPath);
            delete require.cache[apiPath];
            console.log('url', ctx.url, ctx.body);
            if(typeof mockObj === 'function'){
                mockObj.call(ctx, ctx, next);
                return;
            }
            ctx.body = mockObj;
        }catch(err){
            ctx.body = 'Not Found';
            ctx.status = 404;
        } finally{
            return;
        }
    }
    await next();
}


const start = () => {
    const Koa = require('koa');
    const Bodyparser = require('koa-bodyparser');
    const app = new Koa();
    const argv = yargs.argv;
    const apiFilePath = argv.apiFilePath || 'mock/api';
    console.log('apiFilePath', apiFilePath);
    const apiPath = argv.apiPath || '/api';
    const port = argv.port || 3001;
    app.use(Bodyparser())
    app.use(easyMockMiddle({
        apiPath,
        apiFilePath,
        isMock: true
    }))
    app.listen(port, () => {
        console.log(`mock start: http://localhost:${port}`);
    })
}

module.exports = {
    start,
    easyMockMiddle,
};