<template>
  <div class="task-stats">
    <h2 class="task-stats__title">任务统计</h2>

    <div class="task-stats__cards">
      <!-- 任务完成率 -->
      <div class="stat-card">
        <div class="stat-card__content">
          <h3 class="stat-card__title">任务完成率</h3>
          <div class="stat-card__value">
            <span class="stat-card__number">{{ completionRate }}%</span>
            <div class="stat-card__progress">
              <div class="stat-card__progress-bar" :style="{ width: completionRate + '%' }"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 逾期任务数 -->
      <div class="stat-card">
        <div class="stat-card__content">
          <h3 class="stat-card__title">逾期任务数</h3>
          <div class="stat-card__value stat-card__value--overdue">
            <span class="stat-card__number">{{ overdueCount }}</span>
            <span class="stat-card__label">个任务已逾期</span>
          </div>
        </div>
      </div>

      <!-- 本周新增任务数 -->
      <div class="stat-card">
        <div class="stat-card__content">
          <h3 class="stat-card__title">本周新增</h3>
          <div class="stat-card__value">
            <span class="stat-card__number">{{ thisWeekCount }}</span>
            <span class="stat-card__label">个新任务</span>
          </div>
        </div>
      </div>

      <!-- 待办任务数 -->
      <div class="stat-card">
        <div class="stat-card__content">
          <h3 class="stat-card__title">待办任务</h3>
          <div class="stat-card__value">
            <span class="stat-card__number">{{ todoCount }}</span>
            <span class="stat-card__label">个待处理</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 任务分类统计 -->
    <div class="task-stats__charts">
      <div class="chart-container">
        <h3 class="chart-container__title">任务分类占比</h3>
        <div class="category-chart">
          <div
            class="category-chart__item"
            v-for="category in categoryStats"
            :key="category.name"
          >
            <div class="category-chart__bar" :style="{ width: category.percentage + '%' }"></div>
            <div class="category-chart__info">
              <span class="category-chart__name">{{ category.name }}</span>
              <span class="category-chart__count">{{ category.count }} ({{ category.percentage }}%)</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 优先级统计 -->
      <div class="chart-container">
        <h3 class="chart-container__title">优先级分布</h3>
        <div class="priority-chart">
          <div class="priority-chart__item">
            <div class="priority-chart__bar priority-chart__bar--high" :style="{ height: priorityStats.high.percentage + '%' }"></div>
            <span class="priority-chart__label">高优先级</span>
            <span class="priority-chart__count">{{ priorityStats.high.count }}</span>
          </div>
          <div class="priority-chart__item">
            <div class="priority-chart__bar priority-chart__bar--medium" :style="{ height: priorityStats.medium.percentage + '%' }"></div>
            <span class="priority-chart__label">中优先级</span>
            <span class="priority-chart__count">{{ priorityStats.medium.count }}</span>
          </div>
          <div class="priority-chart__item">
            <div class="priority-chart__bar priority-chart__bar--low" :style="{ height: priorityStats.low.percentage + '%' }"></div>
            <span class="priority-chart__label">低优先级</span>
            <span class="priority-chart__count">{{ priorityStats.low.count }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { isOverdue } from '../utils/date-format';
import type { Task } from '../utils/storage';

// Props
const props = defineProps<{
  tasks: Task[];
}>();

// Category stats interface
interface CategoryStat {
  name: string;
  count: number;
  percentage: number;
}

// Priority stats interface
interface PriorityStat {
  count: number;
  percentage: number;
}

interface PriorityStats {
  high: PriorityStat;
  medium: PriorityStat;
  low: PriorityStat;
}

// Calculate completion rate
const completionRate = computed(() => {
  if (props.tasks.length === 0) return 0;
  const completedTasks = props.tasks.filter(task => task.status === 'done').length;
  return Math.round((completedTasks / props.tasks.length) * 100);
});

// Calculate overdue tasks
const overdueCount = computed(() => {
  return props.tasks.filter(task => {
    return isOverdue(task.deadline) && task.status !== 'done';
  }).length;
});

// Calculate this week's new tasks
const thisWeekCount = computed(() => {
  const today = new Date();
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(today.getDate() - 7);

  return props.tasks.filter(task => {
    const createTime = new Date(task.createTime);
    return createTime >= oneWeekAgo && createTime <= today;
  }).length;
});

// Calculate todo tasks
const todoCount = computed(() => {
  return props.tasks.filter(task => task.status === 'todo').length;
});

// Calculate category statistics
const categoryStats = computed<CategoryStat[]>(() => {
  const categoryMap = new Map<string, number>();

  // Count tasks by category
  props.tasks.forEach(task => {
    categoryMap.set(task.category, (categoryMap.get(task.category) || 0) + 1);
  });

  // Convert to array and calculate percentage
  return Array.from(categoryMap.entries())
    .map(([name, count]) => ({
      name,
      count,
      percentage: props.tasks.length > 0 ? Math.round((count / props.tasks.length) * 100) : 0
    }))
    .sort((a, b) => b.count - a.count);
});

// Calculate priority statistics
const priorityStats = computed<PriorityStats>(() => {
  const stats: PriorityStats = {
    high: { count: 0, percentage: 0 },
    medium: { count: 0, percentage: 0 },
    low: { count: 0, percentage: 0 }
  };

  // Count tasks by priority
  props.tasks.forEach(task => {
    stats[task.priority].count++;
  });

  // Calculate percentages
  if (props.tasks.length > 0) {
    stats.high.percentage = Math.round((stats.high.count / props.tasks.length) * 100);
    stats.medium.percentage = Math.round((stats.medium.count / props.tasks.length) * 100);
    stats.low.percentage = Math.round((stats.low.count / props.tasks.length) * 100);
  }

  return stats;
});
</script>

<style scoped>
/* Task stats container */
.task-stats {
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.task-stats__title {
  font-size: 1.2rem;
  color: #333;
  margin: 0 0 1.5rem 0;
}

/* Statistics cards */
.task-stats__cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-card__content {
  display: flex;
  flex-direction: column;
}

.stat-card__title {
  font-size: 0.9rem;
  color: #666;
  margin: 0 0 1rem 0;
  font-weight: 500;
}

.stat-card__value {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stat-card__number {
  font-size: 2rem;
  font-weight: bold;
  color: #333;
}

.stat-card__value--overdue .stat-card__number {
  color: #f44336;
}

.stat-card__label {
  font-size: 0.85rem;
  color: #666;
}

.stat-card__progress {
  height: 8px;
  background-color: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.stat-card__progress-bar {
  height: 100%;
  background-color: #4caf50;
  transition: width 0.3s ease;
  border-radius: 4px;
}

/* Charts section */
.task-stats__charts {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.chart-container {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.chart-container__title {
  font-size: 1rem;
  color: #333;
  margin: 0 0 1rem 0;
  font-weight: 600;
}

/* Category chart */
.category-chart {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.category-chart__item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.category-chart__bar {
  flex: 1;
  height: 20px;
  background-color: #1976d2;
  border-radius: 10px;
  transition: width 0.3s ease;
}

.category-chart__info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-width: 120px;
}

.category-chart__name {
  font-size: 0.9rem;
  color: #333;
  font-weight: 500;
}

.category-chart__count {
  font-size: 0.8rem;
  color: #666;
}

/* Priority chart */
.priority-chart {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  height: 200px;
  gap: 1rem;
  padding: 1rem 0;
}

.priority-chart__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
}

.priority-chart__bar {
  width: 100%;
  transition: all 0.3s ease;
  border-radius: 4px 4px 0 0;
  position: relative;
  bottom: 0;
  width: 100%;
}

.priority-chart__bar--high {
  background-color: #f44336;
}

.priority-chart__bar--medium {
  background-color: #ff9800;
}

.priority-chart__bar--low {
  background-color: #4caf50;
}

.priority-chart__label {
  font-size: 0.85rem;
  color: #666;
  text-align: center;
}

.priority-chart__count {
  font-size: 1rem;
  font-weight: bold;
  color: #333;
}

/* Responsive design */
@media (max-width: 768px) {
  .task-stats__cards {
    grid-template-columns: 1fr;
  }

  .task-stats__charts {
    grid-template-columns: 1fr;
  }

  .priority-chart {
    height: 150px;
  }

  .category-chart__info {
    flex-direction: column;
    align-items: flex-start;
    min-width: auto;
    gap: 0.2rem;
  }
}
</style>