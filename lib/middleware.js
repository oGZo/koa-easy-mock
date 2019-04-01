const path = require('path');
const yargs = require('yargs');
const getApiRelativePath = (config, ctx) => {
  let apiRelativePath = ctx.path;
  let lastDotIndex = ctx.path.lastIndexOf('.');
  // .do 类型的接口去掉后缀
  if (lastDotIndex > -1) {
    apiRelativePath = ctx.path.slice(0, lastDotIndex);
  }
  // 获取当前api实际文件Path
  if (config.apiPath) {
    apiRelativePath = apiRelativePath.slice(config.apiPath.length);
  }
  // 去除多余 /
  if (apiRelativePath[0] === '/') {
    apiRelativePath = apiRelativePath.slice(1);
  }
  return apiRelativePath;
};

const getApiRelativePathPrefix = (apiRelativePath, lastSepIndex) => {
  // api文件路径前缀
  let apiRelativePathPrefix = '';
  if (lastSepIndex > -1) {
    apiRelativePathPrefix = apiRelativePath.slice(0, lastSepIndex + 1);
  }
  return apiRelativePathPrefix;
};

const validatePath = apiPath => {
  try {
    require(apiPath);
    return true;
  } catch (err) {
    return false;
  }
};

// mock中间件
const easyMockMiddleware = (config = {}) => async (ctx, next) => {
  const currentProjectRootPath = process.cwd();
  const mockPath = config && config.apiFilePath;
  const mockFileExt = (config && config.ext) || '.js';
  const mockAbsoultePath = path.join(currentProjectRootPath, mockPath.startsWith('/') ? mockPath : `${mockPath}/`);
  const splitIdent = (config && config.splitIdent) || '/';
  const defaultGetApiPath = ctx => {
    const currentApiRelativePath = getApiRelativePath(config, ctx);
    const lastSepIndex = currentApiRelativePath.lastIndexOf('/');
    // api文件路径前缀
    const apiRelativePathPrefix = getApiRelativePathPrefix(currentApiRelativePath, lastSepIndex);
    // 当前api对应文件相对路径
    const apiRelativePath = path.join(
      apiRelativePathPrefix,
      ctx.method.toLocaleLowerCase() + '_' + currentApiRelativePath.slice(lastSepIndex + 1)
    );
    // 当前api不加方法名时对应文件相对路径
    let noMethodApiRelativePath = apiRelativePath;
    let defaultMethod = (config && config.defaultMethod) || 'get';
    // 方法相等时才做对应检测
    if (defaultMethod.toLocaleLowerCase() === ctx.method.toLocaleLowerCase()) {
      noMethodApiRelativePath = path.join(apiRelativePathPrefix, currentApiRelativePath.slice(lastSepIndex + 1));
    }
    const apiPath = path.resolve(mockAbsoultePath, apiRelativePath.split(splitIdent).join('/') + mockFileExt);
    const noMethodApiPath = path.resolve(
      mockAbsoultePath,
      noMethodApiRelativePath.split(splitIdent).join('/') + mockFileExt
    );
    return {
      apiPath,
      noMethodApiPath,
    };
  };
  const getApiPath = config.getApiPath || defaultGetApiPath;
  const isMock = config.isMock || yargs.argv.isMock || process.env.npm_config_env === 'mock' || false;
  if (isMock && config && (config.apiPath && ctx.path.startsWith(config.apiPath))) {
    const { apiPath, noMethodApiPath } = getApiPath.call(ctx, ctx);
    if (!validatePath(apiPath) && !validatePath(noMethodApiPath)) {
      ctx.body = 'Not Found';
      ctx.status = 404;
      return;
    }
    // 默认apiPath
    let currentApiPath = apiPath;
    // 如果apipath不存在 则用默认方法的
    if (!validatePath(apiPath)) {
      currentApiPath = noMethodApiPath;
    }
    // 获取api对象
    const mockObj = require(currentApiPath);
    // 删除缓存
    delete require.cache[currentApiPath];
    console.log('url', ctx.url, ctx.body || ctx.request.body);
    if (typeof mockObj === 'function') {
      mockObj.call(ctx, ctx, next);
      return;
    }
    ctx.body = mockObj;
    return;
  }
  await next();
};

const start = () => {
  const Koa = require('koa');
  const Bodyparser = require('koa-bodyparser');
  const app = new Koa();
  const argv = yargs.argv;
  const apiFilePath = argv.apiFilePath || 'mock/api';
  console.log('apiFilePath', apiFilePath);
  const apiPath = argv.apiPath || '/api';
  const port = argv.port || 3001;
  const method = argv.method;
  app.use(Bodyparser());
  app.use(
    easyMockMiddleware({
      apiPath,
      apiFilePath,
      isMock: true,
      defaultMethod: method,
    })
  );
  app.listen(port, () => {
    console.log(`mock start: http://localhost:${port}`);
  });
};

module.exports = {
  start,
  easyMockMiddleware,
};
