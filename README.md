# 好好度过24小时

> 24 Hours, Well Lived. · Make Every Hour Count.

一个关于时间管理、24 小时生活方式、精力与注意力、经典书籍与优质网站的高品质中文知识型网站。不是鸡汤博客，而是把**专业编辑内容、系统方法、交互工具与数据可视化**结合在一起的独立知识媒体。

## 技术栈

| 层面 | 技术 |
| --- | --- |
| 框架 | Next.js 15（App Router）+ React 19 |
| 语言 | TypeScript（严格模式） |
| 样式 | Tailwind CSS 3 + shadcn 风格组件（cva / clsx / tailwind-merge） |
| 图表 | Apache ECharts 5（按需引入，真实图表，自动 resize） |
| 图标 | lucide-react |
| 内容 | MDX（next-mdx-remote + remark-gfm）+ TypeScript 结构化数据 |
| 图片 | Unsplash 远程图 + 本地 SVG 容错占位（SmartImage） |

## 快速开始

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 生产构建与启动
npm run build
npm run start

# 类型检查
npm run typecheck
```

打开 <http://localhost:3000> 访问网站。

环境变量可选，复制示例文件即可：

```bash
cp .env.example .env.local
```

- `NEXT_PUBLIC_SITE_URL`：站点 canonical 地址，用于 SEO、sitemap 与结构化数据（默认 `https://24hours-well.example.com`，部署前请修改）。
- `GITHUB_PAGES`：设为 `true` 时启用静态导出（输出到 `out/`），并自动挂载 `/24hours-well` 子路径；本地开发无需设置。

## 页面结构

| 路径 | 说明 |
| --- | --- |
| `/` | 独立设计的首页：Hero、24 小时环形图、今日灵感、方法、文章、书籍、网站、实验室、每日行动 |
| `/articles` | 文章中心（支持分类筛选） |
| `/articles/[slug]` | 文章详情（MDX 渲染、结构化数据、延伸阅读） |
| `/methods` | 时间管理方法库（12 种方法） |
| `/methods/[slug]` | 方法详情：适用场景、步骤、案例、常见错误、相关书籍、SVG 图解 |
| `/books` | 全球经典好书（12 本，支持分类筛选） |
| `/books/[slug]` | 书籍详情：出版信息、核心观点、实践方法、相关书籍 |
| `/websites` | 全球优质网站（21 个，8 大分类） |
| `/websites/[slug]` | 网站详情：定位、价值、适用人群与真实官网链接 |
| `/lab` | 时间实验室入口 + 专注计时器 |
| `/lab/24-hours` | 24 小时分配器（可增删改类别、ECharts 环形图、实时校验） |
| `/lab/time-audit` | 时间审计（记录、统计、占比/分布图表、优化建议） |
| `/lab/planner` | 每日计划（24 小时时间轴、任务冲突检测、甘特图） |
| `/lab/weekly-review` | 每周复盘（计划 vs 实际、趋势折线图、行动建议） |
| `/about` | 关于我们、内容原则、资源声明 |
| `/sitemap.xml`、`/robots.txt` | SEO 支持 |

## 时间实验室与隐私

五个交互工具（24 小时分配器、时间审计、每日计划、每周复盘、专注计时器）**全部真实可用**，数据通过浏览器 `localStorage` 保存在用户自己的设备上，刷新后仍可读取，本站不会上传任何个人时间数据。

所有演示数据都提供明确的「演示数据」开关并标注为示例，绝不冒充真实用户数据。

## ECharts 图表

实际使用 Apache ECharts，覆盖：24 小时环形图、每日时间使用柱状图、一周时间分配趋势折线图、计划与实际对比图、时间类别占比图、专注时长趋势图、每日活动时间轴（甘特图）。图表均提供图例与 Tooltip，并随容器大小自动 resize。

## 内容原则

- 书籍的作者与出版信息依据公开资料整理，不杜撰。
- 引用标注作者与作品；无法确认出处的表述标注为编辑原创。
- 文章强调可操作性：今天做什么、明天如何改进、下周如何复盘。
- 建议标注为参考，不伪装成科学定论；不构成医疗或专业建议。

## 目录结构

```
src/
├── app/                 # 页面（App Router）
├── components/
│   ├── layout/          # 导航、Footer、页面头部
│   ├── ui/              # Button / Card / Badge / SmartImage 等
│   ├── charts/          # ECharts 封装
│   ├── illustrations/   # SVG 插画集
│   ├── content/         # 内容卡片
│   ├── home/            # 首页模块
│   └── lab/             # 交互工具组件
├── content/articles/    # MDX 深度文章（14 篇）
├── data/                # 方法 / 书籍 / 网站结构化数据
└── lib/                 # 类型、站点配置、文章加载、存储、工具函数
```

## GitHub Pages 自动部署

仓库已集成 GitHub Actions：向 `main` 分支推送代码（或手动触发 workflow）后，会自动安装依赖、静态构建并发布到 GitHub Pages。

- 工作流文件：`.github/workflows/deploy.yml`
- 线上地址：<https://yuxinrun.github.io/24hours-well/>
- 首次使用：在 GitHub 仓库 **Settings → Pages → Build and deployment** 中，将 Source 设为 **GitHub Actions**。

构建时由 workflow 注入两个环境变量：`GITHUB_PAGES=true`（静态导出 + `/24hours-well` 子路径）与 `NEXT_PUBLIC_SITE_URL`（canonical / sitemap / OG 地址）。因此 sitemap、robots、结构化数据都会自动使用正确的公开地址。

本地如需验证静态产物：

```bash
$env:GITHUB_PAGES='true'
$env:NEXT_PUBLIC_SITE_URL='https://yuxinrun.github.io/24hours-well'
npm run build
# 产物位于 out/，可用 npx serve out 本地预览
```

## 构建状态

生产构建已验证通过，共生成 75 个静态/预渲染页面；GitHub Pages 静态导出构建同样验证通过。
