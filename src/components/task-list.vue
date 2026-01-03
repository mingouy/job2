<template>
  <div class="task-list">
    <div class="task-list__header">
      <h2 class="task-list__title">{{ title }}</h2>
      <span class="task-list__count">({{ tasks.length }})</span>
    </div>

    <ul class="task-list__items" v-if="tasks.length > 0">
      <li
        v-for="task in tasks"
        :key="task.id"
        class="task-item"
        :class="{
          'task-item--overdue': isOverdue(task.deadline) && task.status !== 'done',
          'task-item--high': task.priority === 'high',
          'task-item--medium': task.priority === 'medium',
          'task-item--low': task.priority === 'low'
        }"
        @click="navigateToDetail(task.id)"
      >
        <div class="task-item__content">
          <h3 class="task-item__title">{{ task.title }}</h3>
          <div class="task-item__meta">
            <span class="task-item__category">{{ task.category }}</span>
            <span class="task-item__deadline">{{ task.deadline }}</span>
          </div>
          <p class="task-item__description">{{ task.description }}</p>
        </div>

        <div class="task-item__actions">
          <button
            class="task-item__btn task-item__btn--complete"
            @click.stop="$emit('mark-complete', task.id)"
            :disabled="task.status === 'done'"
          >
            {{ task.status === 'done' ? '已完成' : '标记完成' }}
          </button>
          <button
            class="task-item__btn task-item__btn--delete"
            @click.stop="$emit('delete-task', task.id)"
          >
            删除
          </button>
        </div>
      </li>
    </ul>

    <div class="task-list__empty" v-else>
      <p>暂无任务</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { isOverdue } from '../utils/date-format';
import type { Task } from '../utils/storage';

// Props
const props = defineProps<{
  title: string;
  tasks: Task[];
}>();

// Emits
const emit = defineEmits<{
  (e: 'mark-complete', taskId: string): void;
  (e: 'delete-task', taskId: string): void;
  (e: 'navigate', taskId: string): void;
}>();

// Router
const router = useRouter();

// Navigate to task detail page
const navigateToDetail = (taskId: string) => {
  emit('navigate', taskId);
};
</script>

<style scoped>
.task-list {
  background-color: #fff;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
}

.task-list__header {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.task-list__title {
  font-size: 1.3rem;
  color: #333;
  margin: 0;
}

.task-list__count {
  font-size: 0.9rem;
  color: #666;
  margin-left: 0.5rem;
}

.task-list__items {
  list-style: none;
  padding: 0;
  margin: 0;
}

.task-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: #fff;
}

.task-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.task-item--overdue {
  background-color: #fff5f5;
  animation: overdue-flash 1s infinite alternate;
}

@keyframes overdue-flash {
  from { background-color: #fff5f5; }
  to { background-color: #ffebee; }
}

.task-item--high {
  border-left: 4px solid #f44336;
}

.task-item--medium {
  border-left: 4px solid #ff9800;
}

.task-item--low {
  border-left: 4px solid #4caf50;
}

.task-item__content {
  flex: 1;
  margin-right: 1rem;
}

.task-item__title {
  font-size: 1.1rem;
  color: #333;
  margin: 0 0 0.5rem 0;
  font-weight: 600;
}

.task-item__meta {
  display: flex;
  gap: 1rem;
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.task-item__category {
  background-color: #e3f2fd;
  color: #1976d2;
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  font-size: 0.75rem;
}

.task-item__description {
  font-size: 0.9rem;
  color: #666;
  margin: 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.task-item__actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.task-item__btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.task-item__btn--complete {
  background-color: #4caf50;
  color: white;
}

.task-item__btn--complete:hover:not(:disabled) {
  background-color: #43a047;
  transform: scale(1.05);
}

.task-item__btn--complete:disabled {
  background-color: #e0e0e0;
  color: #9e9e9e;
  cursor: not-allowed;
}

.task-item__btn--delete {
  background-color: #f44336;
  color: white;
}

.task-item__btn--delete:hover {
  background-color: #e53935;
  transform: scale(1.05);
}

.task-list__empty {
  text-align: center;
  padding: 2rem;
  color: #9e9e9e;
  background-color: #f5f5f5;
  border-radius: 8px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .task-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .task-item__actions {
    flex-direction: row;
    width: 100%;
    margin-top: 1rem;
  }

  .task-item__btn {
    flex: 1;
  }
}
</style>