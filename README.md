# 栈桥

一个用来自己走通前端 CI/CD 的小项目。页面是发布台，流水线负责把这个页面打成镜像并在本机跑起来。

本地用 Docker 走完全流程是合适的做法：检查、测试和构建都发生在镜像里面，和之后 Gitee 拉同一个 `Dockerfile` 构建的结果一致。Gitee Go 自带的 Node 构建环境版本偏旧，Next.js 16 需要 Node 22，所以云端也直接构建镜像，而不是改用平台里的 `build@nodejs`。

## 本地开发

```bash
npm install
npm run dev
```

浏览器打开 [http://127.0.0.1:43123](http://127.0.0.1:43123)。

## 本地走完全流程

先安装 [Docker Desktop](https://www.docker.com/products/docker-desktop/)，终端里要能运行 `docker compose version`。

```bash
npm run pipeline
```

这条命令做四件事：

1. 读取版本号、当前 git 提交和构建时间。
2. `docker compose build`。镜像内依次执行 `npm run lint`、`npm run test`、`npm run build`。
3. 用新镜像替换正在运行的容器。
4. 请求 `http://127.0.0.1:41821/api/health`，直到返回 `ok: true`。

完成后打开 [http://127.0.0.1:41821](http://127.0.0.1:41821)。这一步不需要镜像仓库，镜像只留在你的机器上，名字是 `zhanqiao:local`。

只想在不打镜像的情况下跑检查：

```bash
npm run check
```

## 推到 Gitee 之后

仓库里已经放了 `.workflow/MasterPipeline.yml`。把代码推到 Gitee 的 `main` 或 `master` 后：

1. 在仓库里开通 Gitee Go。账号需要绑定手机号。
2. 在流水线变量里填这四项：
   - `DOCKER_REGISTRY`：Docker Hub 用 `docker.io`。如果平台报仓库地址不对，改成 `hub.docker.com`。阿里云填你的地域地址，例如 `registry.cn-hangzhou.aliyuncs.com`。
   - `DOCKER_USERNAME`
   - `DOCKER_PASSWORD`：仓库的访问令牌，不要用登录密码。
   - `DOCKER_IMAGE`：例如 `你的用户名/zhanqiao`。
3. 推一次 `main` 或 `master`。Gitee 会按 Dockerfile 构建，检查或测试失败时镜像构建会失败，通过后推到上面的仓库。

Gitee 的镜像构建插件会把镜像推到远程仓库，所以这一步需要你自己的仓库账号。本地的 `npm run pipeline` 不推远程，适合先把流程跑顺。

云端构建默认不会带上本机那种 git 短哈希，镜像标签用的是 Gitee 的构建号 `${GITEE_PIPELINE_BUILD_NUMBER}`。页面上的提交号在没传构建参数时显示 `local`。
