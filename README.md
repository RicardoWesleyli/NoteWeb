# NoteWeb - 现代化个人导航站

NoteWeb 是一个简洁、美观且功能强大的个人导航网站项目。它旨在帮助用户高效管理常用的网络资源，提供个性化的上网入口。

![NoteWeb Preview](./public/preview.png)
*(注意：请确保添加预览图到 public/preview.png，或者删除此行)*

## ✨ 主要特性

- **🎨 现代化 UI 设计**：基于 Tailwind CSS 构建，简洁大方，完美支持深色模式（Dark Mode）。
- **📱 响应式布局**：完美适配桌面端、平板和移动端设备。
- **🔍 快速搜索**：内置实时搜索功能，快速定位目标链接。
- **⚙️ 可视化管理**：
  - 提供强大的**设置面板**。
  - 内置 **JSON 编辑器**，支持直接编辑分类和链接数据。
  - 支持数据**实时预览**、**格式化**、**重置**和**下载**备份。
- **🌍 国际化支持**：完整支持中文和英文切换（i18n）。
- **💾 本地存储**：所有个性化修改（数据、主题、语言）均自动保存至浏览器本地存储（LocalStorage），无需后端数据库。
- **📜 每日格言**：随机展示励志格言，点亮每一天。

## 🛠️ 技术栈

- **核心框架**: [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **构建工具**: [Vite](https://vitejs.dev/)
- **样式方案**: [Tailwind CSS](https://tailwindcss.com/)
- **图标库**: [Lucide React](https://lucide.dev/)
- **动画库**: [Framer Motion](https://www.framer.com/motion/)
- **国际化**: [i18next](https://www.i18next.com/)
- **状态管理**: Context API + LocalStorage

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/your-username/NoteWeb.git
cd NoteWeb
```

### 2. 安装依赖

本项目推荐使用 [pnpm](https://pnpm.io/)。

```bash
pnpm install
```

### 3. 启动开发服务器

```bash
pnpm run dev
```

浏览器访问 `http://localhost:5175` 即可查看效果。

### 4. 构建生产版本

```bash
pnpm run build
```

构建产物位于 `dist` 目录。

## 📦 部署指南

本项目已配置好 **GitHub Pages** 一键部署流程。

### 前置准备

1. 确保你的项目已关联到 GitHub 仓库。
2. 确保 `vite.config.ts` 中的 `base` 配置正确（如果是部署到 `https://username.github.io/repo-name/`，`base` 应设为 `./` 或 `/repo-name/`）。

### 方式一：使用 GitHub Actions 自动部署（推荐）

本项目包含 GitHub Actions 工作流，支持代码推送后自动部署。

1. 进入 GitHub 仓库页面。
2. 点击 **Settings** -> **Pages**。
3. 在 **Build and deployment** -> **Source** 中选择 **GitHub Actions**。
4. 以后每次将代码推送到 `main` 分支时，GitHub 会自动构建并更新网站。

### 方式二：本地手动部署

如果你不使用 GitHub Actions，也可以在本地直接部署：

1. 运行以下命令，系统会自动构建并将 `dist` 目录推送到远程仓库的 `gh-pages` 分支：

   ```bash
   pnpm run deploy
   ```

2. 进入 GitHub 仓库页面 -> **Settings** -> **Pages**。
3. 在 **Build and deployment** -> **Source** 中选择 **Deploy from a branch**。
4. **Branch** 选择 `gh-pages`，文件夹选择 `/ (root)`，点击 **Save**。

稍等片刻，即可通过 GitHub Pages 链接访问你的导航站。

## 📝 数据管理

你可以在网页右上角的 **设置** 图标中打开管理面板：

- **链接管理**：直接编辑 JSON 配置，添加、删除或修改导航链接。
- **分组管理**：自定义分类名称、图标和排序。

所有修改会立即生效并保存到本地。

## 📄 许可证

[MIT](./LICENSE) License
