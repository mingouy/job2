<template>
  <div class="app-container">
    <!-- 头部 -->
    <header class="app-header">
      <div class="app-header__container">
        <h1 class="app-header__title">学生任务管理系统</h1>
        <div class="app-header__user">
          <div class="app-header__avatar">U</div>
          <span class="app-header__nickname">学生</span>
        </div>
      </div>
    </header>

    <!-- 导航 -->
    <nav class="app-nav">
      <div class="app-nav__container">
        <ul class="app-nav__list">
          <li class="app-nav__item">
            <router-link to="/" class="app-nav__link app-nav__link--active">任务总览</router-link>
          </li>
          <li class="app-nav__item">
            <router-link to="/statistics" class="app-nav__link">统计分析</router-link>
          </li>
        </ul>
      </div>
    </nav>

    <!-- 主内容区 -->
    <main class="app-main">
      <div class="app-main__container">
        <!-- 左侧：任务列表 -->
        <div class="app-main__left">
          <!-- 任务筛选 -->
          <TaskFilter @filter-change="handleFilterChange" />

          <!-- 待办任务 -->
          <section class="task-section">
            <h2 class="task-section__title">待办任务（优先级排序）</h2>
            <TaskList
              title="待办任务"
              :tasks="filteredTasks.todo"
              @mark-complete="markTaskComplete"
              @delete-task="deleteTask"
              @navigate="navigateToDetail"
            />
          </section>

          <!-- 进行中任务 -->
          <section class="task-section">
            <h2 class="task-section__title">进行中任务</h2>
            <TaskList
              title="进行中任务"
              :tasks="filteredTasks.doing"
              @mark-complete="markTaskComplete"
              @delete-task="deleteTask"
              @navigate="navigateToDetail"
            />
          </section>

          <!-- 已完成任务 -->
          <section class="task-section">
            <h2 class="task-section__title">已完成任务</h2>
            <TaskList
              title="已完成任务"
              :tasks="filteredTasks.done"
              @mark-complete="markTaskComplete"
              @delete-task="deleteTask"
              @navigate="navigateToDetail"
            />
          </section>

          <!-- 逾期提醒 -->
          <section v-if="overdueTasks.length > 0" class="overdue-reminder">
            <h3 class="overdue-reminder__title">🔔 逾期提醒</h3>
            <ul class="overdue-reminder__list">
              <li v-for="task in overdueTasks" :key="task.id" class="overdue-reminder__item">
                <router-link :to="`/task-detail/${task.id}`" class="overdue-reminder__link">{{ task.title }}</router-link>
                <span class="overdue-reminder__date">{{ task.deadline }}</span>
              </li>
            </ul>
          </section>
        </div>

        <!-- 右侧：快捷操作和统计 -->
        <div class="app-main__right">
          <!-- 任务统计卡片 -->
          <TaskStats :tasks="tasks" />
        </div>
      </div>
    </main>

    <!-- 快速添加任务按钮 -->
    <button class="add-task-btn" @click="showAddForm = true">
      <span class="add-task-btn__icon">+</span>
      <span class="add-task-btn__text">添加任务</span>
    </button>

    <!-- 添加任务表单弹窗 -->
    <TaskForm
      v-if="showAddForm"
      @save="addTask"
      @close="showAddForm = false"
    />

    <!-- 页脚 -->
    <footer class="app-footer">
      <div class="app-footer__container">
        <p class="app-footer__text">© 2024 学生任务管理系统 | 帮助中心</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import TaskList from '../components/task-list.vue';
import TaskForm from '../components/task-form.vue';
import TaskFilter from '../components/task-filter.vue';
import TaskStats from '../components/task-stats.vue';
import type { Task } from '../utils/storage';
import { isOverdue } from '../utils/date-format';

// Router
const router = useRouter();

// Tasks data
const tasks = ref<Task[]>([]);

// Add form visibility
const showAddForm = ref(false);

// Filter parameters
const filterParams = ref({
  status: 'all',
  priority: 'all',
  timeRange: 'all',
  search: ''
});

// Load tasks from LocalStorage or JSON
const loadTasks = async () => {
  // Try to load from LocalStorage first
  const localTasks = localStorage.getItem('tasks');
  if (localTasks) {
    tasks.value = JSON.parse(localTasks);
  } else {
    // Load from JSON file if LocalStorage is empty
    try {
      const data = await import('../data/tasks.json');
      tasks.value = data.default as Task[];
      // Save to LocalStorage
      localStorage.setItem('tasks', JSON.stringify(tasks.value));
    } catch (error) {
      console.error('Failed to load tasks from JSON:', error);
      // Fallback to empty array
      tasks.value = [];
    }
  }
};

// Initialize tasks
onMounted(() => {
  loadTasks();
});

// Save tasks to LocalStorage
const saveTasks = () => {
  localStorage.setItem('tasks', JSON.stringify(tasks.value));
};

// Handle filter change
const handleFilterChange = (params: typeof filterParams.value) => {
  filterParams.value = params;
};

// Filtered tasks by status
const filteredTasks = computed(() => {
  // Apply search filter first
  let filtered = [...tasks.value].filter(task => {
    return task.title.toLowerCase().includes(filterParams.value.search.toLowerCase());
  });

  // Apply priority filter
  if (filterParams.value.priority !== 'all') {
    filtered = filtered.filter(task => task.priority === filterParams.value.priority);
  }

  // Apply time range filter
  filtered = filtered.filter(task => {
    const taskDate = new Date(task.deadline);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (filterParams.value.timeRange) {
      case 'today':
        return taskDate.toDateString() === today.toDateString();
      case 'week':
        const oneWeekLater = new Date();
        oneWeekLater.setDate(today.getDate() + 7);
        return taskDate >= today && taskDate <= oneWeekLater;
      case 'month':
        const oneMonthLater = new Date();
        oneMonthLater.setMonth(today.getMonth() + 1);
        return taskDate >= today && taskDate <= oneMonthLater;
      case 'overdue':
        return isOverdue(task.deadline) && task.status !== 'done';
      default:
        return true;
    }
  });

  // Separate by status
  return {
    todo: filtered
      .filter(task => task.status === 'todo')
      .sort((a, b) => {
        // Sort by priority first, then by deadline
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      }),
    doing: filtered.filter(task => task.status === 'doing'),
    done: filtered.filter(task => task.status === 'done')
  };
});

// Overdue tasks
const overdueTasks = computed(() => {
  return tasks.value.filter(task => {
    return isOverdue(task.deadline) && task.status !== 'done';
  });
});

// Mark task as complete
const markTaskComplete = (taskId: string) => {
  const task = tasks.value.find(t => t.id === taskId);
  if (task) {
    task.status = 'done';
    saveTasks();
  }
};

// Delete task
const deleteTask = (taskId: string) => {
  if (confirm('确定要删除这个任务吗？')) {
    tasks.value = tasks.value.filter(task => task.id !== taskId);
    saveTasks();
  }
};

// Navigate to task detail
const navigateToDetail = (taskId: string) => {
  router.push(`/task-detail/${taskId}`);
};

// Add new task
const addTask = (taskData: Task) => {
  tasks.value.push(taskData);
  saveTasks();
  showAddForm.value = false;
};
</script>

<style scoped>
/* App container */
.app-container {
  font-family: 'Microsoft YaHei', sans-serif;
  background-color: #f5f5f5;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Header */
.app-header {
  background-color: #1976d2;
  color: white;
  padding: 1rem 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.app-header__container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.app-header__title {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
}

.app-header__user {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.app-header__avatar {
  width: 40px;
  height: 40px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.app-header__nickname {
  font-size: 0.9rem;
}

/* Navigation */
.app-nav {
  background-color: white;
  border-bottom: 1px solid #e0e0e0;
}

.app-nav__container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

.app-nav__list {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
}

.app-nav__item {
  margin-right: 2rem;
}

.app-nav__link {
  display: block;
  padding: 1rem 0;
  color: #666;
  text-decoration: none;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
  border-bottom: 2px solid transparent;
}

.app-nav__link:hover,
.app-nav__link--active {
  color: #1976d2;
  border-bottom-color: #1976d2;
}

/* Main content */
.app-main {
  flex: 1;
  padding: 2rem 0;
}

.app-main__container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 2rem;
}

.app-main__left {
  display: flex;
  flex-direction: column;
}

.app-main__right {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Task section */
.task-section {
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.task-section__title {
  font-size: 1.2rem;
  color: #333;
  margin: 0 0 1rem 0;
  font-weight: 600;
}

/* Overdue reminder */
.overdue-reminder {
  background-color: #ffebee;
  border: 1px solid #ffcdd2;
  border-radius: 8px;
  padding: 1.5rem;
  margin-top: 1.5rem;
}

.overdue-reminder__title {
  font-size: 1.1rem;
  color: #c62828;
  margin: 0 0 1rem 0;
  font-weight: 600;
}

.overdue-reminder__list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.overdue-reminder__item {
  margin-bottom: 0.8rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.overdue-reminder__item:last-child {
  margin-bottom: 0;
}

.overdue-reminder__link {
  color: #c62828;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
}

.overdue-reminder__link:hover {
  text-decoration: underline;
}

.overdue-reminder__date {
  font-size: 0.85rem;
  color: #666;
}

/* Add task button */
.add-task-btn {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  font-size: 2rem;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  z-index: 100;
}

.add-task-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(76, 175, 80, 0.4);
}

.add-task-btn__text {
  display: none;
  font-size: 1rem;
  font-weight: 500;
}

.add-task-btn:hover .add-task-btn__text {
  display: inline;
}

.add-task-btn:hover .add-task-btn__icon {
  display: none;
}

/* Footer */
.app-footer {
  background-color: #333;
  color: white;
  text-align: center;
  padding: 1.5rem 0;
  margin-top: auto;
}

.app-footer__container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

.app-footer__text {
  font-size: 0.9rem;
  margin: 0;
}

/* Responsive design */
@media (max-width: 768px) {
  .app-header__container {
    flex-direction: column;
    gap: 1rem;
    padding: 0 1rem;
  }

  .app-header__title {
    font-size: 1.2rem;
  }

  .app-nav__container {
    padding: 0 1rem;
  }

  .app-nav__item {
    margin-right: 1rem;
  }

  .app-nav__link {
    font-size: 0.9rem;
    padding: 0.8rem 0;
  }

  .app-main__container {
    grid-template-columns: 1fr;
    padding: 0 1rem;
  }

  .app-main__right {
    display: none;
  }

  .add-task-btn {
    bottom: 1rem;
    right: 1rem;
    width: 50px;
    height: 50px;
    font-size: 1.5rem;
  }

  .add-task-btn__text {
    display: none;
  }
}
</style>