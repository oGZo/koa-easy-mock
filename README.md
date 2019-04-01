## koa-easy-mock

### 使用方式
### 1. CLI（命令行）直接使用
#### 参数

| key        | type    | description                      | default  |
| --------   | -----:  | -------------------------------: | :----:   |
| port       | number  | 端口                              |  3001    |
| apiPath    | string  | 接口地址                           |  /api    |
| apiFilePath| string  | api文件放置地址                    |   mock/   |
| method     | string  | 默认方法该方法的mock数据可不加(get_)  |   get    |

### mock数据结构示例  ![示例](http://gz-public.oss-cn-shenzhen.aliyuncs.com/wiki/WechatIMG4.png)
#### 用法
```
# 安装koa-easy-mock包
npm i -g koa-easy-mock / npm i -D koa-easy-mock

# 工程根目录下使用该命令
easy-mock --apiFilePath=mock/api --port=3001 --apiPath=/api

```

### 2. 以middeware(中间件)的形式使用
#### 参数
| key           | type     | description                         | default             |
| --------      | -------: | ---------------------------------:  | :-----------------: |
| getApiPath    | function | 获取api方法                          |  defaultGetApiPath  |
| apiPath       | string   | 接口地址                             |  /api               |
| apiFilePath   | string   | api文件放置地址                       |   mock              |
| isMock        | boolean  |  是否使用mock                        |   undefined          |
| defaultMethod | string   |  默认方法该方法的mock数据可不加(get_)   |   get                |

#### 用法

```
# 安装包
npm i -D koa-easy-mock

#启动node服务服务 例子如下：
const Koa = require('koa');
const app = new Koa();
const easyMock = require('koa-easy-mock');

const port = 3001;

app.use(easyMock.easyMockMiddleware({
    apiFilePath: 'mock/api',
    apiPath: '/api',
    isMock: true
}))
app.listen(port, () => {
    console.log(`mock start: http://localhost:${port}`);
})

```
