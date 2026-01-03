# 学生任务管理系统

## 项目概述

学生任务管理系统是为学生设计的任务管理工具，帮助学生高效规划时间、把控任务进度。系统集成了学习任务（如课程作业、实验报告、考试复习）和个人计划（如预习安排、技能提升）的全生命周期管理，适配各类专业的课程学习场景。

## 技术栈

- HTML5
- CSS3
- JavaScript
- Vue 3
- Vue Router
- Element Plus（可选）
- Axios（可选）
- LocalStorage（数据持久化）

## 项目结构

```
src/
├── components/          # 组件目录
│   ├── task-list.vue   # 任务列表组件
│   ├── task-form.vue   # 任务表单组件
│   ├── task-filter.vue # 任务筛选组件
│   └── task-stats.vue   # 任务统计组件
├── views/              # 页面目录
│   ├── home-view.vue       # 首页 - 任务总览
│   ├── task-detail.vue     # 任务详情/编辑页
│   └── statistics-view.vue # 统计分析页
├── assets/             # 静态资源
├── utils/              # 工具函数
│   ├── validator.js    # 表单验证
│   ├── date-format.js  # 日期格式化
│   └── storage.js      # 本地存储
├── router/             # 路由配置
│   └── index.ts        # 路由定义
├── data/               # 模拟数据
│   └── tasks.json      # 初始任务数据
├── App.vue             # 根组件
└── main.ts             # 入口文件
```

## 安装和运行

### 安装依赖

```bash
npm install
```

### 开发模式运行

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

### 代码检查和格式化

```bash
# 运行 ESLint 检查
npm run lint

# 使用 Prettier 格式化代码
npm run format

# 类型检查
npm run type-check
```

## 核心功能

1. **任务总览**：展示待办任务、进行中任务和已完成任务，支持任务筛选和快速添加
2. **任务详情/编辑**：支持任务的添加、编辑和删除，包含完整的表单验证
3. **统计分析**：展示任务完成率、逾期任务数、本周新增任务数等统计数据，支持数据导出
4. **任务状态管理**：支持任务状态的切换（待办→进行中→已完成）
5. **优先级管理**：支持高、中、低优先级设置
6. **截止日期提醒**：自动识别逾期任务并显示提醒

## 浏览器兼容性

- Chrome 120+
- Firefox 119+
- Edge 120+

## 响应式设计

- PC端：1920×1080分辨率
- 移动端：37
5×667分辨率

## 数据持久化

系统使用 LocalStorage 实现数据持久化，刷新页面后数据不会丢失。初始数据从 `src/data/tasks.json` 文件加载。

## 许可证

MIT