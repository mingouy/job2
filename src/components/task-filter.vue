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
          >
        </div>
      </div>
      
      <button 
        type="button" 
        class="task-filter__reset"
        @click="resetFilter"
      >
        重置筛选
      </button>
    </form>
    
    <!-- 移动端筛选菜单 -->
    <div class="task-filter__mobile">
      <button class="task-filter__toggle" @click="toggleMobileFilter">
        筛选 <span class="task-filter__count">({{ activeFilterCount }})</span>
        <span class="task-filter__arrow" :class="{ 'task-filter__arrow--open': showMobileFilter }">▼</span>
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
              >
            </div>
          </div>
          
          <button 
            type="button" 
            class="task-filter__reset"
            @click="resetFilter"
          >
            重置筛选
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue';

// Emits
const emit = defineEmits(['filter-change']);

// Filter parameters
const filterParams = reactive({
  status: 'all',
  priority: 'all',
  timeRange: 'all',
  search: ''
});

// Mobile filter toggle
const showMobileFilter = ref(false);

// Calculate active filter count
const activeFilterCount = computed(() => {
  let count = 0;
  if (filterParams.status !== 'all') count++;
  if (filterParams.priority !== 'all') count++;
  if (filterParams.timeRange !== 'all') count++;
  if (filterParams.search) count++;
  return count;
});

// Update filter
const updateFilter = () => {
  emit('filter-change', { ...filterParams });
};

// Reset filter
const resetFilter = () => {
  filterParams.status = 'all';
  filterParams.priority = 'all';
  filterParams.timeRange = 'all';
  filterParams.search = '';
  emit('filter-change', { ...filterParams });
};

// Toggle mobile filter
const toggleMobileFilter = () => {
  showMobileFilter.value = !showMobileFilter.value;
};

// Watch for external filter changes
const props = defineProps({
  initialFilter: {
    type: Object,
    default: null
  }
});

watch(() => props.initialFilter, (newFilter) => {
  if (newFilter) {
    Object.assign(filterParams, newFilter);
  }
}, { immediate: true, deep: true });
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
}

.form-group__select:focus,
.form-group__input:focus {
  outline: none;
  border-color: #1976d2;
  box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.2);
}

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
}

.task-filter__reset:hover {
  background-color: #e0e0e0;
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