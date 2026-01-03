<template>
  <div class="task-filter">
    <h3 class="task-filter__title">任务筛选</h3>

    <form class="task-filter__form">
      <div class="form-row">
        <div class="form-group">
          <label for="status" class="form-group__label">状态</label>
          <select
            id="status"
            v-model="filterParams.status"
            class="form-group__select"
            @change="updateFilter"
          >
            <option value="all">全部</option>
            <option value="todo">待办</option>
            <option value="doing">进行中</option>
            <option value="done">已完成</option>
          </select>
        </div>

        <div class="form-group">
          <label for="priority" class="form-group__label">优先级</label>
          <select
            id="priority"
            v-model="filterParams.priority"
            class="form-group__select"
            @change="updateFilter"
          >
            <option value="all">全部</option>
            <option value="high">高</option>
            <option value="medium">中</option>
            <option value="low">低</option>
          </select>
        </div>

        <div class="form-group">
          <label for="timeRange" class="form-group__label">时间范围</label>
          <select
            id="timeRange"
            v-model="filterParams.timeRange"
            class="form-group__select"
            @change="updateFilter"
          >
            <option value="all">全部</option>
            <option value="today">今天</option>
            <option value="week">本周</option>
            <option value="month">本月</option>
            <option value="overdue">已逾期</option>
          </select>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group form-group--full">
          <label for="search" class="form-group__label">搜索任务</label>
          <input
            type="text"
            id="search"
            v-model="filterParams.search"
            class="form-group__input"
            placeholder="输入任务名称搜索"
            @input="updateFilter"
          />
        </div>
      </div>

      <button type="button" class="task-filter__reset" @click="resetFilter">重置筛选</button>
    </form>

    <!-- 移动端筛选菜单 -->
    <div class="task-filter__mobile">
      <button class="task-filter__toggle" @click="toggleMobileFilter">
        筛选 <span class="task-filter__count">({{ activeFilterCount }})</span>
        <span class="task-filter__arrow" :class="{ 'task-filter__arrow--open': showMobileFilter }"
          >▼</span
        >
      </button>

      <div class="task-filter__mobile-content" v-if="showMobileFilter">
        <!-- 移动端筛选内容，与桌面端相同 -->
        <form class="task-filter__form">
          <div class="form-row">
            <div class="form-group">
              <label for="status-mobile" class="form-group__label">状态</label>
              <select
                id="status-mobile"
                v-model="filterParams.status"
                class="form-group__select"
                @change="updateFilter"
              >
                <option value="all">全部</option>
                <option value="todo">待办</option>
                <option value="doing">进行中</option>
                <option value="done">已完成</option>
              </select>
            </div>

            <div class="form-group">
              <label for="priority-mobile" class="form-group__label">优先级</label>
              <select
                id="priority-mobile"
                v-model="filterParams.priority"
                class="form-group__select"
                @change="updateFilter"
              >
                <option value="all">全部</option>
                <option value="high">高</option>
                <option value="medium">中</option>
                <option value="low">低</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="timeRange-mobile" class="form-group__label">时间范围</label>
              <select
                id="timeRange-mobile"
                v-model="filterParams.timeRange"
                class="form-group__select"
                @change="updateFilter"
              >
                <option value="all">全部</option>
                <option value="today">今天</option>
                <option value="week">本周</option>
                <option value="month">本月</option>
                <option value="overdue">已逾期</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group form-group--full">
              <label for="search-mobile" class="form-group__label">搜索任务</label>
              <input
                type="text"
                id="search-mobile"
                v-model="filterParams.search"
                class="form-group__input"
                placeholder="输入任务名称搜索"
                @input="updateFilter"
              />
            </div>
          </div>

          <button type="button" class="task-filter__reset" @click="resetFilter">重置筛选</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'

// Emits
const emit = defineEmits(['filter-change'])

// Filter parameters
const filterParams = reactive({
  status: 'all',
  priority: 'all',
  timeRange: 'all',
  search: '',
})

// Mobile filter toggle
const showMobileFilter = ref(false)

// Calculate active filter count
const activeFilterCount = computed(() => {
  let count = 0
  if (filterParams.status !== 'all') count++
  if (filterParams.priority !== 'all') count++
  if (filterParams.timeRange !== 'all') count++
  if (filterParams.search) count++
  return count
})

// Update filter
const updateFilter = () => {
  emit('filter-change', { ...filterParams })
}

// Reset filter
const resetFilter = () => {
  filterParams.status = 'all'
  filterParams.priority = 'all'
  filterParams.timeRange = 'all'
  filterParams.search = ''
  emit('filter-change', { ...filterParams })
}

// Toggle mobile filter
const toggleMobileFilter = () => {
  showMobileFilter.value = !showMobileFilter.value
}

// Watch for external filter changes
const props = defineProps({
  initialFilter: {
    type: Object,
    default: null,
  },
})

watch(
  () => props.initialFilter,
  (newFilter) => {
    if (newFilter) {
      Object.assign(filterParams, newFilter)
    }
  },
  { immediate: true, deep: true },
)
</script>

<style scoped>
.task-filter {
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
}

.task-filter__title {
  font-size: 1.2rem;
  color: #333;
  margin: 0 0 1rem 0;
}

.task-filter__form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;
  margin: 0;
}

.form-group {
  margin: 0;
}

.form-group--full {
  grid-column: 1 / -1;
}

.form-group__label {
  display: block;
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-group__select,
.form-group__input {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  font-family: inherit;
  position: relative;
  overflow: hidden;
}

/* 筛选条件聚焦动画 */
.form-group__select:focus,
.form-group__input:focus {
  outline: none;
  border-color: #1976d2;
  box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.2);
  transform: scaleX(1.01);
  transition: all 0.2s ease;
}

/* 筛选条件切换动画 */
.form-group__select {
  cursor: pointer;
}

.form-group__select:active {
  transform: scale(0.98);
  transition: transform 0.1s ease;
}

/* 搜索框动画 */
.search-container {
  position: relative;
}

.form-group__input.search {
  padding-right: 2.5rem;
  transition: all 0.3s ease;
}

/* 清除搜索按钮 */
.search-clear {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #999;
  font-size: 1.2rem;
  cursor: pointer;
  opacity: 0;
  transform: translateY(-50%) scale(0.8);
  transition: all 0.2s ease;
  z-index: 10;
}

.search-clear.visible {
  opacity: 1;
  transform: translateY(-50%) scale(1);
  transition: all 0.2s ease;
}

.search-clear:hover {
  color: #666;
  transform: translateY(-50%) scale(1.1);
}

/* 搜索输入动画 */
.form-group__input.search:focus {
  border-color: #1976d2;
  box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.2);
}

/* 搜索结果清空动画 */
.form-group__input.search.clearing {
  animation: clear-animation 0.15s ease;
}

@keyframes clear-animation {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}

/* 筛选结果更新动画 */
.filter-updating {
  opacity: 0.5;
  transition: opacity 0.3s ease;
}

/* 重置按钮动画 */
.task-filter__reset {
  background-color: #f5f5f5;
  color: #666;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  align-self: flex-start;
  position: relative;
  overflow: hidden;
}

.task-filter__reset:hover {
  background-color: #e0e0e0;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.task-filter__reset:active {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.task-filter__reset.resetting {
  animation: reset-flash 0.4s ease;
  background-color: #ffe0e0;
  color: #ff4d4f;
}

@keyframes reset-flash {
  0%,
  100% {
    background-color: #f5f5f5;
    color: #666;
  }
  50% {
    background-color: #ffe0e0;
    color: #ff4d4f;
  }
}

/* 移动端筛选菜单动画 */
.task-filter__mobile-content {
  background-color: white;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-top: 0.5rem;
  padding: 1rem;
  position: absolute;
  width: calc(100% - 2rem);
  z-index: 100;
  opacity: 0;
  transform: translateY(-10px);
  transition: all 0.3s ease;
  pointer-events: none;
}

.task-filter__mobile-content.show {
  opacity: 1;
  transform: translateY(0);
  pointer-events: all;
  animation: slide-down 0.3s ease;
}

@keyframes slide-down {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 筛选标签动画 */
.filter-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.8rem;
  background-color: #e3f2fd;
  color: #1976d2;
  border-radius: 16px;
  font-size: 0.8rem;
  font-weight: 500;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
  animation: tag-fade-in 0.3s ease;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-tag:hover {
  background-color: #bbdefb;
  transform: scale(1.05);
}

.filter-tag__remove {
  background: none;
  border: none;
  color: #1976d2;
  font-size: 1rem;
  cursor: pointer;
  padding: 0;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.filter-tag__remove:hover {
  background-color: rgba(25, 118, 210, 0.1);
  color: #1565c0;
  transform: scale(1.2);
}

@keyframes tag-fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 筛选条件计数动画 */
.task-filter__count {
  background-color: rgba(255, 255, 255, 0.2);
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  font-size: 0.8rem;
  margin-left: 0.5rem;
  transition: all 0.3s ease;
  animation: count-pulse 0.6s ease;
}

@keyframes count-pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* 箭头旋转动画 */
.task-filter__arrow {
  font-size: 0.8rem;
  transition: transform 0.3s ease;
  animation: arrow-bounce 1s infinite alternate;
}

.task-filter__arrow--open {
  transform: rotate(180deg);
  animation: none;
}

@keyframes arrow-bounce {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(3px);
  }
}

/* Mobile filter */
.task-filter__mobile {
  display: none;
}

.task-filter__toggle {
  width: 100%;
  background-color: #1976d2;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
}

.task-filter__toggle:hover {
  background-color: #1565c0;
}

.task-filter__count {
  background-color: rgba(255, 255, 255, 0.2);
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  font-size: 0.8rem;
  margin-left: 0.5rem;
}

.task-filter__arrow {
  font-size: 0.8rem;
  transition: transform 0.3s ease;
}

.task-filter__arrow--open {
  transform: rotate(180deg);
}

.task-filter__mobile-content {
  background-color: white;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-top: 0.5rem;
  padding: 1rem;
  position: absolute;
  width: calc(100% - 2rem);
  z-index: 100;
}

/* Desktop only styles */
@media (min-width: 769px) {
  .task-filter__mobile {
    display: none;
  }
}

/* Mobile styles */
@media (max-width: 768px) {
  .task-filter__form {
    display: none;
  }

  .task-filter__mobile {
    display: block;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .task-filter__reset {
    width: 100%;
  }
}
</style>
