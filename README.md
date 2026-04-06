# 铁路编组识别工作站

## 项目简介

铁路编组识别工作站是一套基于 AI 视觉识别技术的智能化铁路货运管理系统。通过视频流分析,实现火车车厢编号、集装箱号的自动识别与编组信息的智能采集,解决传统人工核查效率低、安全隐患大、成本高昂等痛点。

## 核心功能

- **智能识别**: 自动识别火车车厢编号(车号)、车型、集装箱号
- **实时监控**: 支持视频流实时处理,WebSocket 推送识别进度
- **异常复核**: 智能检测识别异常(遮挡、模糊、低置信度),支持人工复核
- **数据管理**: 完整的任务管理、历史记录查询、统计分析
- **报告导出**: 生成编组清单报告,支持 PDF/Excel/CSV 格式

## 技术架构

### 前端技术栈
- **框架**: Vue 3 (Composition API)
- **路由**: Vue Router 4
- **状态管理**: Pinia
- **样式**: Tailwind CSS (Material Design 3 风格)
- **构建工具**: Vite

### 后端接口
详见 [API_SPECIFICATION.md](./API_SPECIFICATION.md)

## 快速开始

### 一键启动（推荐）

**Windows 用户:**
```bash
start.bat
```

**Linux/Mac 用户:**
```bash
./start.sh
```

或使用 Python 脚本:
```bash
python start.py
```

脚本会自动检查环境、安装依赖并启动开发服务器。

### 手动启动

#### 环境要求
- Node.js >= 16.0.0
- npm >= 8.0.0

#### 安装依赖
```bash
npm install
```

#### 开发模式
```bash
npm run dev
```

#### 生产构建
```bash
npm run build
```

#### 预览构建结果
```bash
npm run preview
```

## 项目结构

```
src/
├── assets/           # 静态资源
│   └── style.css     # 全局样式
├── components/       # 公共组件
│   ├── TopNav.vue    # 顶部导航栏
│   ├── Toast.vue     # 消息提示组件
│   └── Loading.vue   # 加载状态组件
├── views/            # 页面视图
│   ├── Workspace.vue # 识别工作区
│   └── History.vue   # 历史任务库
├── router/           # 路由配置
│   └── index.js
├── stores/           # Pinia 状态管理
│   ├── task.js       # 任务状态
│   └── auth.js       # 认证状态
├── services/         # API 服务层
│   ├── api.js        # HTTP 客户端
│   └── websocket.js  # WebSocket 客户端
├── App.vue           # 根组件
└── main.js           # 入口文件
```

## 功能模块

### 1. 识别工作区 (Workspace)
- 视频上传与任务创建
- 实时识别进度展示
- 车厢/集装箱识别结果查看
- 异常复核与人工标注

### 2. 历史任务库 (History)
- 任务列表查询与筛选
- 统计数据概览
- 报告导出

## 配置说明

### 环境变量
创建 `.env.development` 和 `.env.production` 文件:

```bash
# API 基础路径
VITE_API_BASE_URL=http://localhost:3000/api/v1

# WebSocket 地址
VITE_WS_URL=ws://localhost:3000/api/v1/ws
```

## 开发规范

- 遵循 Vue 3 Composition API 最佳实践
- 使用 Tailwind CSS 工具类进行样式开发
- 组件命名采用 PascalCase
- 文件命名采用 kebab-case

## API 文档

完整的 API 接口规范请参考 [API_SPECIFICATION.md](./API_SPECIFICATION.md)

## 许可证

MIT License

## 联系方式

如有问题或建议,请提交 Issue 或 Pull Request。
