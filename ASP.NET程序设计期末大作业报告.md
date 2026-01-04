# 学生任务管理系统设计与实现

## 期末大作业报告

学院：商学院  
专业：\***\*\_\_\*\***  
班级：\***\*\_\_\*\***  
学号：\***\*\_\_\*\***  
学生：\***\*\_\_\*\***  
授课教师：陈木生  
时间：2025年12月31日

## 1. 项目概述

### 1.1 主题选择

随着大学生活的日益丰富，学生需要管理各种学习任务、项目和活动。传统的纸质笔记本或简单的电子表格已经无法满足现代学生的需求，他们需要一个功能强大、界面友好的任务管理系统。因此，我选择了学生任务管理系统作为本次大作业的主题，旨在帮助学生更好地管理学习任务、提高学习效率。

### 1.2 核心功能

- **任务管理**：添加、编辑、删除和查看任务
- **任务分类**：支持多种任务分类，如课程作业、项目任务、个人计划等
- **优先级管理**：支持高、中、低三种优先级设置
- **状态管理**：任务状态包括待办、进行中、已完成
- **截止日期提醒**：逾期任务自动标记并显示警示动画
- **搜索筛选**：支持按关键词、分类、状态和优先级筛选任务
- **统计分析**：提供任务完成情况统计和可视化图表
- **响应式设计**：适配桌面端、平板和手机等多种设备
- **动画效果**：丰富的交互动画，提升用户体验

### 1.3 设计理念

- **用户体验优先**：界面简洁直观，操作流畅，提供丰富的反馈机制
- **响应式设计**：适配不同设备，确保在各种屏幕尺寸下都能良好显示
- **模块化开发**：采用组件化设计，提高代码复用性和可维护性
- **类型安全**：使用TypeScript确保代码质量和类型安全
- **性能优化**：优化渲染性能，确保动画流畅
- **可扩展性**：设计时考虑未来功能扩展，如团队协作、云同步等

## 2. 技术栈说明

### 2.1 核心技术

- **Vue 3**：使用Composition API进行组件开发，提供更好的逻辑复用和类型推断
- **TypeScript**：提供类型安全，减少运行时错误，提高代码质量
- **Vue Router**：实现单页应用的路由管理
- **LocalStorage**：用于本地数据持久化，模拟后端数据存储

### 2.2 样式与动画

- **BEM CSS**：采用BEM命名规范，确保CSS类名的唯一性和可读性
- **CSS Transitions**：实现平滑的过渡效果
- **CSS Keyframes**：实现复杂的动画效果，如加载动画、闪烁效果等
- **Vue Transition Components**：使用`<transition>`和`<transition-group>`组件实现元素进入/离开动画

### 2.3 数据可视化

- **Chart.js**：用于绘制任务完成趋势图表
- **vue-chartjs**：Chart.js的Vue封装，方便在Vue组件中使用

### 2.4 构建工具

- **Vite**：现代化的前端构建工具，提供快速的开发体验和优化的构建输出
- **ESLint**：代码质量检查工具，确保代码符合最佳实践
- **Prettier**：代码格式化工具，保持代码风格一致

## 3. 项目结构

### 3.1 文件目录结构

```
src/
├── assets/            # 静态资源文件
├── components/        # Vue组件
│   ├── loading.vue    # 加载动画组件
│   ├── task-filter.vue # 任务筛选组件
│   ├── task-form.vue  # 任务表单组件
│   ├── task-list.vue  # 任务列表组件
│   └── task-stats.vue # 任务统计组件
├── data/              # 初始数据文件
│   └── tasks.json     # 初始任务数据
├── utils/             # 工具函数
│   ├── date-format.ts # 日期格式化工具
│   ├── storage.ts     # 本地存储工具
│   └── validator.ts   # 表单验证工具
├── views/             # 页面组件
│   ├── home-view.vue  # 首页
│   ├── statistics-view.vue # 统计分析页面
│   └── task-detail.vue # 任务详情页面
├── App.vue            # 根组件
├── main.ts            # 入口文件
└── router.ts          # 路由配置
```

### 3.2 核心组件/页面功能介绍

#### 3.2.1 App.vue

- 应用的根组件
- 实现了页面切换动画
- 实现了导航栏滚动渐变效果
- 实现了回到顶部按钮

#### 3.2.2 home-view.vue

- 首页组件，展示任务列表
- 集成了任务筛选、添加和列表展示功能
- 实现了任务加载状态管理

#### 3.2.3 task-detail.vue

- 任务详情页面
- 支持任务的编辑和删除
- 实现了任务表单验证

#### 3.2.4 statistics-view.vue

- 统计分析页面
- 展示任务完成情况统计
- 使用Chart.js绘制任务完成趋势图
- 支持数据导出功能

#### 3.2.5 task-list.vue

- 任务列表组件
- 实现了任务项的展示、状态切换和删除功能
- 支持任务项的动画效果
- 实现了逾期任务的警示动画

#### 3.2.6 task-form.vue

- 任务表单组件
- 支持任务的添加和编辑
- 实现了表单验证和反馈动画
- 实现了成功提示动画

#### 3.2.7 task-filter.vue

- 任务筛选组件
- 支持按关键词、分类、状态和优先级筛选任务
- 实现了筛选表单的动画效果

#### 3.2.8 loading.vue

- 加载动画组件
- 实现了旋转加载图标和文字提示
- 可复用在各个页面的加载状态

## 4. 功能实现

### 4.1 任务管理功能

#### 4.1.1 任务添加与编辑

**实现思路**：使用Vue的响应式系统管理表单数据，通过validateTaskForm函数进行表单验证，验证通过后保存任务数据到LocalStorage。

**关键代码片段**：

```typescript
// 表单提交处理
const submitForm = () => {
  const validationResult: FormValidationResult = validateTaskForm(formData);

  if (validationResult.isValid) {
    const taskData: Task = {
      ...formData,
      id: isEdit.value ? props.task!.id : Date.now().toString(),
      createTime: isEdit.value
        ? props.task!.createTime
```

        : (new Date().toISOString().split('T')[0] as string),
    };

    emit('save', taskData);
    showSuccess(isEdit.value ? '任务更新成功！' : '任务添加成功！');
    resetForm();
  } else {
    errors.value = validationResult.errors;
    // 设置验证状态
    Object.keys(validationResult.errors).forEach((key) => {
      formValidationStatus.value[key as keyof typeof formValidationStatus.value] = 'error';
    });
    // 设置无错误字段为valid状态
    Object.keys(formData.value).forEach((key) => {
      if (!validationResult.errors[key as keyof typeof validationResult.errors]) {
        formValidationStatus.value[key as keyof typeof formValidationStatus.value] = 'valid';
      }
    });
  }
};
```

#### 4.1.2 任务删除功能
**实现思路**：实现了确认删除机制，点击删除按钮后显示"确认删除"，再次点击才真正删除任务，防止误操作。

**关键代码片段**：
```typescript
// 确认删除状态管理
const deleteConfirmTaskId = ref<string | null>(null);

// 处理删除点击
const handleDeleteClick = (taskId: string) => {
  if (deleteConfirmTaskId.value === taskId) {
    emit('delete-task', taskId);
    deleteConfirmTaskId.value = null;
  } else {
    deleteConfirmTaskId.value = taskId;
    // 3秒后自动取消确认
    setTimeout(() => {
      if (deleteConfirmTaskId.value === taskId) {
        deleteConfirmTaskId.value = null;
      }
    }, 3000);
  }
};
```

### 4.2 任务筛选与搜索

#### 4.2.1 筛选功能
**实现思路**：使用计算属性根据筛选条件过滤任务列表，支持按分类、状态和优先级进行组合筛选。

**关键代码片段**：
```typescript
// 过滤任务
const filteredTasks = computed(() => {
  return tasks.value.filter(task => {
    // 关键词搜索
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.value.toLowerCase());
    // 分类筛选
    const matchesCategory = selectedCategory.value === 'all' || task.category === selectedCategory.value;
    // 状态筛选
    const matchesStatus = selectedStatus.value === 'all' || task.status === selectedStatus.value;
    // 优先级筛选
    const matchesPriority = selectedPriority.value === 'all' || task.priority === selectedPriority.value;
    
    return matchesSearch && matchesCategory && matchesStatus && matchesPriority;
  });
});
```

### 4.3 动画效果实现

#### 4.3.1 页面切换动画
**实现思路**：使用Vue Router的`<transition>`组件包裹`<router-view>`，定义页面进入和离开的动画效果。

**关键代码片段**：
```vue
<!-- App.vue -->
<transition name="page-transition" mode="out-in">
  <router-view />
</transition>

<style>
.page-transition-enter-active,
.page-transition-leave-active {
  transition: all 0.3s ease;
}

.page-transition-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.page-transition-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>
```

#### 4.3.2 任务项动画
**实现思路**：使用`<transition-group>`组件包裹任务列表，定义任务项的进入和离开动画。

**关键代码片段**：
```vue
<transition-group
  v-if="tasks.length > 0"
  name="task-item"
  tag="ul"
  class="task-list__items"
>
  <li
    v-for="task in tasks"
    :key="task.id"
    class="task-item"
    :class="{
      'task-item--overdue': isOverdue(task.deadline) && task.status !== 'done',
      'task-item--high': task.priority === 'high',
      'task-item--medium': task.priority === 'medium',
      'task-item--low': task.priority === 'low',
      shake: deleteConfirmTaskId === task.id,
    }"
    @click="navigateToDetail(task.id)"
  >
    <!-- 任务内容 -->
  </li>
</transition-group>

<style>
.task-item-enter-active {
  animation: task-item-enter 0.35s ease-out;
}

.task-item-leave-active {
  animation: task-item-leave 0.3s ease-in;
  position: absolute;
  width: calc(100% - 2rem);
}

@keyframes task-item-enter {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  50% {
    transform: translateY(-5px) scale(1.02);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes task-item-leave {
  from {
    opacity: 1;
    height: auto;
    padding: 1rem;
    margin-bottom: 0.8rem;
    transform: scale(1);
  }
  to {
    opacity: 0;
    height: 0;
    padding: 0;
    margin-bottom: 0;
    transform: scale(0.9);
  }
}
</style>
```

#### 4.3.3 逾期任务警示动画
**实现思路**：通过CSS动画实现逾期任务的闪烁效果，使用`@keyframes`定义从浅红色到深红色的背景色变化，并添加阴影效果。

**关键代码片段**：
```css
.task-item--overdue {
  background-color: #fff5f5;
  animation: overdue-flash 1.2s infinite alternate;
  box-shadow: 0 0 6px #ff6b6b;
}

@keyframes overdue-flash {
  from {
    background-color: #fff5f5;
    box-shadow: 0 0 6px #ff6b6b;
  }
  to {
    background-color: #ffe0e0;
    box-shadow: none;
  }
}
```

## 5. 测试说明

### 5.1 浏览器兼容性测试
| 浏览器 | 版本 | 兼容性 | 备注 |
|--------|------|--------|------|
| Chrome | 120+ | ✅ | 完全兼容 |
| Firefox | 115+ | ✅ | 完全兼容 |
| Safari | 17+ | ✅ | 完全兼容 |
| Edge | 120+ | ✅ | 完全兼容 |
| 微信浏览器 | 最新版 | ✅ | 完全兼容 |
| QQ浏览器 | 最新版 | ✅ | 完全兼容 |

### 5.2 功能测试情况
| 功能模块 | 测试项 | 测试结果 | 备注 |
|----------|--------|----------|------|
| 任务管理 | 添加任务 | ✅ | 成功 |
| 任务管理 | 编辑任务 | ✅ | 成功 |
| 任务管理 | 删除任务 | ✅ | 成功，带确认机制 |
| 任务管理 | 标记完成 | ✅ | 成功 |
| 任务筛选 | 关键词搜索 | ✅ | 成功 |
| 任务筛选 | 分类筛选 | ✅ | 成功 |
| 任务筛选 | 状态筛选 | ✅ | 成功 |
| 任务筛选 | 优先级筛选 | ✅ | 成功 |
| 统计分析 | 任务统计 | ✅ | 成功 |
| 统计分析 | 趋势图表 | ✅ | 成功 |
| 统计分析 | 数据导出 | ✅ | 成功 |
| 动画效果 | 页面切换 | ✅ | 流畅 |
| 动画效果 | 任务项动画 | ✅ | 流畅 |
| 动画效果 | 表单动画 | ✅ | 流畅 |
| 动画效果 | 逾期警示 | ✅ | 明显 |
| 响应式设计 | 桌面端 | ✅ | 正常显示 |
| 响应式设计 | 平板 | ✅ | 正常显示 |
| 响应式设计 | 手机 | ✅ | 正常显示 |

## 6. 问题与总结

### 6.1 开发过程中遇到的问题及解决方法

#### 6.1.1 问题1：页面切换动画闪烁
**问题描述**：在实现页面切换动画时，发现页面切换过程中会出现闪烁现象。

**解决方法**：
1. 使用`mode="out-in"`属性确保旧元素完全离开后新元素才进入
2. 为动画元素添加`overflow: hidden`和`position: relative`属性
3. 优化CSS动画，确保动画属性的连续性

#### 6.1.2 问题2：TypeScript类型错误
**问题描述**：在开发过程中遇到了一些TypeScript类型错误，如类型不匹配、未定义属性等。

**解决方法**：
1. 为所有组件的props和emit定义明确的类型
2. 使用类型断言时确保类型安全
3. 为复杂数据结构定义接口
4. 定期运行`npm run type-check`检查类型错误

#### 6.1.3 问题3：动画性能问题
**问题描述**：在任务列表较长时，动画效果出现卡顿现象。

**解决方法**：
1. 使用`transform`和`opacity`属性进行动画，避免触发重排
2. 为动画元素添加`will-change`属性，提示浏览器优化
3. 限制同时显示的任务数量，实现虚拟滚动（本次项目未实现，可作为后续优化方向）

#### 6.1.4 问题4：表单验证反馈不明显
**问题描述**：初始版本中，表单验证错误提示不够明显，用户体验不佳。

**解决方法**：
1. 添加了错误提示的淡入动画
2. 为错误的输入框添加了边框颜色和阴影效果
3. 实现了表单字段的实时验证反馈

### 6.2 项目收获

1. **技术能力提升**：
   - 熟练掌握了Vue 3 Composition API的使用
   - 提高了TypeScript的应用能力
   - 学习了如何实现流畅的动画效果
   - 掌握了响应式设计的实现方法

2. **开发经验积累**：
   - 学会了如何进行需求分析和系统设计
   - 掌握了组件化开发的最佳实践
   - 提高了代码质量和可维护性意识
   - 学会了如何进行测试和调试

3. **用户体验设计**：
   - 理解了用户体验的重要性
   - 学习了如何设计直观易用的界面
   - 掌握了如何通过动画提升用户体验

### 6.3 项目不足与改进方向

1. **数据持久化**：当前使用LocalStorage进行数据存储，数据易丢失，未来可以考虑接入后端API或使用IndexedDB进行更可靠的数据存储。

2. **用户认证**：目前系统不支持用户登录，无法实现多用户使用，未来可以添加用户认证功能。

3. **云同步**：当前数据只存储在本地，无法在多设备间同步，未来可以考虑添加云同步功能。

4. **提醒功能**：目前只有逾期任务的视觉提醒，未来可以添加邮件或短信提醒功能。

5. **团队协作**：当前系统只支持单用户使用，未来可以考虑添加团队协作功能，支持任务共享和分配。

6. **性能优化**：对于大量任务的场景，需要进一步优化渲染性能，如实现虚拟滚动、分页加载等。

## 7. 参考文献

[1] Vue.js官方文档. https://v3.vuejs.org/  
[2] TypeScript官方文档. https://www.typescriptlang.org/  
[3] Vue Router官方文档. https://router.vuejs.org/  
[4] Chart.js官方文档. https://www.chartjs.org/  
[5] BEM CSS命名规范. https://getbem.com/  
[6] Vite官方文档. https://vitejs.dev/  
[7] ESLint官方文档. https://eslint.org/  
[8] Prettier官方文档. https://prettier.io/  
[9] CSS动画指南. https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Animations/Using_CSS_animations  


## 8. 附录

### 8.1 主要依赖版本
```json
{
  "name": "task-management-system",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "run-p type-check \"build-only {@}\" --",
    "build-only": "vite build",
    "preview": "vite preview",
    "lint": "eslint . --fix --cache",
    "type-check": "vue-tsc --build"
  },
  "dependencies": {
    "chart.js": "^4.4.8",
    "vue": "^3.4.38",
    "vue-chartjs": "^5.3.0",
    "vue-router": "^4.3.3"
  },
  "devDependencies": {
    "@types/node": "^22.5.5",
    "@vitejs/plugin-vue": "^5.2.0",
    "@vue/eslint-config-typescript": "^13.0.0",
    "@vue/tsconfig": "^0.5.1",
    "eslint": "^9.13.0",
    "eslint-plugin-vue": "^9.29.0",
    "npm-run-all2": "^6.2.2",
    "typescript": "~5.6.2",
    "vite": "^6.0.3",
    "vue-tsc": "^2.1.6"
  }
}
```

### 8.2 项目运行说明
1. 安装依赖：`npm install`
2. 启动开发服务器：`npm run dev`
3. 构建生产版本：`npm run build`
4. 预览生产版本：`npm run preview`
5. 运行类型检查：`npm run type-check`
6. 运行代码检查：`npm run lint`

### 8.3 项目地址
- 本地代码仓库：`c:\kechenglunwen\task-management-system`
- GitHub仓库：https://github.com/mingouy/job2.git

---

**报告结束**