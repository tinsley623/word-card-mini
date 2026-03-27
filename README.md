# 词卡小程序 · 一字一世界

微信小程序版词卡应用，深度挖掘汉字与英文单词的灵魂含义。基于 Taro + React 开发，调用 LLM 实时生成词卡内容。

## 功能

- 输入单个汉字或英文单词，AI 实时生成深度解析
- 词卡包含：字源溯析、核心意象、深层解析、一语道破
- 生成词卡图片并保存到相册
- 内置演示数据（道、意、Serendipity），无网络也可体验

## 技术栈

| 技术 | 说明 |
|---|---|
| [Taro](https://taro.zone/) 4.x | 跨端开发框架 |
| React 18 | UI 框架 |
| Sass | 样式预处理 |
| DeepSeek API | LLM 词卡内容生成 |
| Canvas API | 小程序端图片生成 |

## 项目结构

```
word-card-mini/
├── config/                 # Taro 编译配置
├── src/
│   ├── api/
│   │   └── analyze.js      # LLM API 调用层
│   ├── components/
│   │   └── CardContent/    # 词卡内容组件
│   ├── pages/
│   │   ├── home/           # 首页（搜索 + 推荐词）
│   │   └── wordcard/       # 词卡页（解析 + 保存图片）
│   ├── app.js              # 应用入口
│   ├── app.config.js       # 路由配置
│   └── app.scss            # 全局样式
├── project.config.json     # 微信小程序配置
└── package.json
```

## 开发

```bash
# 安装依赖
npm install --legacy-peer-deps

# 开发模式（热更新）
npm run dev:weapp

# 生产构建
npm run build:weapp
```

构建产物在 `dist/` 目录，用微信开发者工具导入该目录预览。

## 配置

### 小程序 AppID

在 `project.config.json` 中修改 `appid` 字段为你的小程序 AppID。

### API 域名白名单

在微信公众平台 → 开发管理 → 开发设置 → 服务器域名中，将以下域名添加到 **request 合法域名**：

```
https://word-card-eight.vercel.app
```

## Web 版

Web 版词卡：[word-card](https://github.com/tinsley623/word-card)

部署地址：https://word-card-eight.vercel.app/

## 许可证

MIT
