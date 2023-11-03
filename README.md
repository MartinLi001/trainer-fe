```bash
npm install
```

or

```bash
yarn
```

Scripts provided in `package.json`. It's safe to modify or add additional script:

### Start project dev

```bash
yarn start

// qa环境
yarn start:qa
```

### Build project

```bash
yarn build
```

### 通过 Docker 运行项目

`npm build` 本地生成 `dist` 目录，通过 Docker 启动 Nginx 代理

```bash
echo 'PROJECT_NAME=$PROJECT_NAME\nPROJECT_VERSION=$PROJECT_VERSION\nPROJECT_PORT=8089' > build.env # $PROJECT_NAME 可以取 package.json 的 name;$PROJECT_VERSION 可以去 package.json 的 version;8089 为 Nginx 代理自定义本地端口
# 示例: echo 'PROJECT_NAME=trainer\nPROJECT_VERSION=1.0.0\nPROJECT_PORT=8089' > build.env
docker-compose --env-file build.env build
docker-compose --env-file build.env up -d
```

### 公共环境变量配置

文件路径 ` /config/config.xxx.ts`

### 更换头部 logo

直接替换掉目录 `/src/assets/` 目录下 `logo.png` 图片即可，大小 `heihgt: 30px`

### 更换头部 title

~~直接替换 `/config/defaultSettings.ts` 文件下 `title` 字段即可~~ 包含在`logo`图片内

### 更换浏览器 tab ico 图标

直接替换 `/public/` 文件下 `favicon.ico` 文件替换即可

### 更换 copyRight

直接替换 `/config/defaultSettings.ts` 文件下 `copyRight` 字段即可
