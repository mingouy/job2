<template>
  <div class="statistics">
    <!-- 头部导航 -->
    <header class="statistics__header">
      <div class="statistics__container">
        <div class="statistics__back">
          <router-link to="/" class="statistics__back-link">← 返回任务列表</router-link>
        </div>
        <h1 class="statistics__title">统计分析</h1>
      </div>
    </header>

    <!-- 主要内容 -->
    <main class="statistics__main">
      <div class="statistics__container">
        <!-- 统计卡片和图表 -->
        <div class="statistics__content">
          <!-- 任务统计组件 -->
          <task-stats :tasks="tasks" />

          <!-- 数据导出 -->
          <div class="statistics__export-section">
            <div class="statistics__export-card">
              <h2 class="statistics__export-title">数据导出</h2>
              <p class="statistics__export-description">
                导出当前所有任务数据，包括已完成和未完成的任务。导出的文件将包含完整的任务信息，可用于备份或数据分析。
              </p>
              <button class="statistics__export-btn" @click="exportTasks">导出任务数据</button>
              <span class="statistics__export-note">
                导出的文件格式为 JSON，包含所有任务的详细信息。
              </span>
            </div>
          </div>

          <!-- 任务完成趋势 -->
          <div class="statistics__trend-section">
            <div class="statistics__trend-card">
              <h2 class="statistics__trend-title">任务完成趋势</h2>
              <div class="statistics__trend-content">
                <!-- Chart.js Bar Chart for task completion trends -->
                <div class="chart-container">
                  <Bar :data="taskTrendData" :options="chartOptions" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import TaskStats from '../components/task-stats.vue'
import type { Task } from '../utils/storage'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js'
import { Bar } from 'vue-chartjs'

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title)

// Tasks data
const tasks = ref<Task[]>([])

// Load tasks from LocalStorage
const loadTasks = async () => {
  const localTasks = localStorage.getItem('tasks')
  if (localTasks) {
    tasks.value = JSON.parse(localTasks)
  } else {
    // Load from JSON file if LocalStorage is empty
    try {
      const data = await import('../data/tasks.json')
      tasks.value = data.default as Task[]
      localStorage.setItem('tasks', JSON.stringify(tasks.value))
    } catch (error) {
      console.error('Failed to load tasks:', error)
      tasks.value = []
    }
  }
}

// Initialize data
onMounted(async () => {
  await loadTasks()
})

// Export tasks to JSON file
const exportTasks = () => {
  const taskData = JSON.stringify(tasks.value, null, 2)
  const blob = new Blob([taskData], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'task-statistics.json'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// Prepare chart data for task completion trends
const taskTrendData = computed(() => {
  // Get last 7 days
  const labels: string[] = []
  const completedCounts: number[] = []
  const totalCounts: number[] = []

  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0] as string
    labels.push(dateStr.slice(5) as string) // Show MM-DD format

    // Count completed tasks on this date
    const completed = tasks.value.filter((task) => {
      return task.status === 'done' && task.deadline === dateStr
    }).length

    // Count total tasks due on this date
    const total = tasks.value.filter((task) => {
      return task.deadline === dateStr
    }).length

    completedCounts.push(completed)
    totalCounts.push(total)
  }

  return {
    labels,
    datasets: [
      {
        label: '已完成任务',
        data: completedCounts,
        backgroundColor: '#4caf50',
        borderRadius: 4,
      },
      {
        label: '未完成任务',
        data: totalCounts.map((total, index) => total - (completedCounts[index] || 0)),
        backgroundColor: '#ff6b6b',
        borderRadius: 4,
      },
    ],
  }
})

// Chart options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: '近7天任务完成趋势',
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        precision: 0,
      },
    },
  },
}

// Calculate task completion trends for the simple chart
const completedLastWeek = computed(() => {
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 14)
  const today = new Date()
  today.setDate(today.getDate() - 7)

  return tasks.value.filter((task) => {
    const deadline = new Date(task.deadline)
    return deadline >= oneWeekAgo && deadline < today && task.status === 'done'
  }).length
})

const totalLastWeek = computed(() => {
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 14)
  const today = new Date()
  today.setDate(today.getDate() - 7)

  return tasks.value.filter((task) => {
    const deadline = new Date(task.deadline)
    return deadline >= oneWeekAgo && deadline < today
  }).length
})

const completedLastWeekPercentage = computed(() => {
  if (totalLastWeek.value === 0) return 0
  return Math.round((completedLastWeek.value / totalLastWeek.value) * 100)
})

const completedThisWeek = computed(() => {
  const today = new Date()
  const oneWeekLater = new Date()
  oneWeekLater.setDate(today.getDate() + 7)

  return tasks.value.filter((task) => {
    const deadline = new Date(task.deadline)
    return deadline >= today && deadline < oneWeekLater && task.status === 'done'
  }).length
})

const totalThisWeek = computed(() => {
  const today = new Date()
  const oneWeekLater = new Date()
  oneWeekLater.setDate(today.getDate() + 7)

  return tasks.value.filter((task) => {
    const deadline = new Date(task.deadline)
    return deadline >= today && deadline < oneWeekLater
  }).length
})

const completedThisWeekPercentage = computed(() => {
  if (totalThisWeek.value === 0) return 0
  return Math.round((completedThisWeek.value / totalThisWeek.value) * 100)
})

const totalNextWeek = computed(() => {
  const oneWeekLater = new Date()
  oneWeekLater.setDate(oneWeekLater.getDate() + 7)
  const twoWeeksLater = new Date()
  twoWeeksLater.setDate(twoWeeksLater.getDate() + 14)

  return tasks.value.filter((task) => {
    const deadline = new Date(task.deadline)
    return deadline >= oneWeekLater && deadline < twoWeeksLater
  }).length
})
</script>

<style scoped>
/* Statistics container */
.statistics {
  font-family: 'Microsoft YaHei', sans-serif;
  background-color: #f5f5f5;
  min-height: 100vh;
}

/* Header */
.statistics__header {
  background-color: #1976d2;
  color: white;
  padding: 1rem 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.statistics__container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.statistics__title {
  font-size: 1.5rem;
  margin: 0;
  text-align: center;
}

.statistics__back {
  margin-bottom: 1rem;
}

.statistics__back-link {
  color: white;
  text-decoration: none;
  font-size: 1rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.statistics__back-link:hover {
  text-decoration: underline;
}

/* Main content */
.statistics__main {
  padding: 2rem 0;
}

.statistics__content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Export section */
.statistics__export-section {
  background-color: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.statistics__export-card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  text-align: center;
}

.statistics__export-title {
  font-size: 1.3rem;
  color: #333;
  margin: 0;
  font-weight: 600;
}

.statistics__export-description {
  color: #666;
  line-height: 1.6;
  max-width: 600px;
}

.statistics__export-btn {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.statistics__export-btn:hover {
  background-color: #43a047;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

.statistics__export-note {
  font-size: 0.8rem;
  color: #999;
}

/* Trend section */
.statistics__trend-section {
  background-color: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.statistics__trend-card {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.statistics__trend-title {
  font-size: 1.3rem;
  color: #333;
  margin: 0;
  font-weight: 600;
}

.statistics__trend-content {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Chart container */
.chart-container {
  width: 100%;
  max-width: 800px;
  height: 400px;
  margin: 0 auto;
  background-color: #f5f5f5;
  padding: 1rem;
  border-radius: 8px;
}

/* Trend chart (legacy) */
.trend-chart {
  width: 100%;
  max-width: 600px;
  height: 300px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.trend-chart__labels {
  display: flex;
  justify-content: space-around;
  font-size: 1rem;
  color: #666;
}

.trend-chart__bars {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  height: 250px;
  gap: 2rem;
  background-color: #f5f5f5;
  padding: 1rem;
  border-radius: 8px;
}

.trend-chart__bar-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  height: 100%;
  position: relative;
}

.trend-chart__bar {
  width: 100%;
  transition: all 0.3s ease;
  border-radius: 4px 4px 0 0;
  position: absolute;
  bottom: 0;
  width: 100%;
}

.trend-chart__bar--done {
  background-color: #4caf50;
}

.trend-chart__bar--todo {
  background-color: #2196f3;
}

.trend-chart__value {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: #333;
}

/* Responsive design */
@media (max-width: 768px) {
  .statistics__container {
    padding: 0 1rem;
  }

  .statistics__export-section,
  .statistics__trend-section {
    padding: 1rem;
  }

  .trend-chart__bars {
    gap: 1rem;
  }

  .trend-chart__value {
    font-size: 0.8rem;
  }
}
</style>
