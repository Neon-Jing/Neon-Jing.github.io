# Hongji Li 个人主页

这个个人主页基于 [PRISM](https://github.com/xyjoey/PRISM) 学术主页模板搭建。

## 修改内容

大部分页面内容都由配置文件驱动：

- `content/` 是默认英文内容。
- `content_zh/` 是中文内容。
- `public/` 存放头像、favicon 等静态资源。

举几个常用例子：

- 想改姓名、头衔、头像或 GitHub 链接，编辑 `content/config.toml`。
- 想改首页自我介绍，编辑 `content/bio.md` 和 `content_zh/bio.md`。
- 想新增项目，在 `content/projects.toml` 里追加一个 `[[items]]`。
- 想把研究笔记换成正式论文，更新 `content/publications.bib`。

## 本地运行

```bash
npm install
npm run dev
```

然后打开 `http://localhost:3000`。

## 构建

```bash
npm run build
```

项目使用 Next.js 静态导出，构建产物会生成在 `out/` 目录。

## 发布到 GitHub Pages

当前 GitHub 账号是 `Neon-Jing`。如果要发布成根主页，仓库名应该是：

```text
Neon-Jing/Neon-Jing.github.io
```

这样发布地址就是：

```text
https://Neon-Jing.github.io
```

如果仓库名是 `hongji-li.github.io`，它不会变成 `https://hongji-li.github.io`，而是项目页：`https://Neon-Jing.github.io/hongji-li.github.io/`。如果你想要 `https://hongji-li.github.io`，GitHub 账号或组织名也必须叫 `hongji-li`。

本项目的 `next.config.ts` 也保留了项目页路径兼容：如果以后仓库名不是 `<账号名>.github.io`，GitHub Actions 构建时会自动设置 `basePath` 和 `assetPrefix`，避免图片和样式资源 404。

发布步骤：

```bash
git remote set-url origin git@github.com:Neon-Jing/Neon-Jing.github.io.git
git push -u origin main
```

在 GitHub 仓库页面进入 **Settings -> Pages -> Build and deployment**，把 **Source** 改成 **GitHub Actions**。之后每次 push 到 `main`，GitHub 都会自动构建并发布 `out/` 目录。
