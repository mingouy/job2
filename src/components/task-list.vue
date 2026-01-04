<template>
  <div class="task-list">
    <div class="task-list__header">
      <h2 class="task-list__title">{{ title }}</h2>
      <span class="task-list__count">({{ tasks.length }})</span>
    </div>

    <transition-group v-if="tasks.length > 0" name="task-item" tag="ul" class="task-list__items">
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
        <div class="task-item__content">
          <h3 class="task-item__title">{{ task.title }}</h3>
          <div class="task-item__meta">
            <span class="task-item__category">{{ task.category }}</span>
            <span class="task-item__priority">
              <span class="priority-icon" :class="`priority-icon--${task.priority}`"></span>
              <span class="priority-text">{{ getPriorityText(task.priority) }}</span>
            </span>
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
            @click.stop="handleDeleteClick(task.id)"
          >
            {{ deleteConfirmTaskId === task.id ? '确认删除' : '删除' }}
          </button>
        </div>
      </li>
    </transition-group>

    <div class="task-list__empty" v-else>
      <p>暂无任务</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { isOverdue } from '../utils/date-format'
import type { Task } from '../utils/storage'

// Emits
const emit = defineEmits<{
  (e: 'mark-complete', taskId: string): void
  (e: 'delete-task', taskId: string): void
  (e: 'navigate', taskId: string): void
}>()

// Props
const { title, tasks } = defineProps<{
  title: string
  tasks: Task[]
}>()

// 确认删除状态管理
const deleteConfirmTaskId = ref<string | null>(null)

// Navigate to task detail page
const navigateToDetail = (taskId: string) => {
  emit('navigate', taskId)
}

// 获取优先级文本
const getPriorityText = (priority: string): string => {
  const priorityMap: Record<string, string> = {
    high: '高',
    medium: '中',
    low: '低',
  }
  return priorityMap[priority] || '中'
}

// 处理删除点击
const handleDeleteClick = (taskId: string) => {
  if (deleteConfirmTaskId.value === taskId) {
    emit('delete-task', taskId)
    deleteConfirmTaskId.value = null
  } else {
    deleteConfirmTaskId.value = taskId
    // 3秒后自动取消确认
    setTimeout(() => {
      if (deleteConfirmTaskId.value === taskId) {
        deleteConfirmTaskId.value = null
      }
    }, 3000)
  }
}
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

/* 待办任务 */
.task-item--todo {
  background-color: #ffffff;
  transition: all 0.3s ease;
}

/* 进行中任务 */
.task-item--doing {
  background-color: #fff9e6;
  transition: all 0.3s ease;
}

/* 已完成任务 */
.task-item--done {
  background-color: #f0f9f0;
  color: #999;
  text-decoration: line-through;
  filter: grayscale(0.7);
  transition: all 0.3s ease;
  animation: task-done 0.3s ease;
}

@keyframes task-done {
  0% {
    transform: scale(1);
    opacity: 1;
    filter: grayscale(0);
  }
  50% {
    transform: scale(1.03);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 0.9;
    filter: grayscale(0.7);
  }
}

/* 状态标签动画 */
.task-status {
  display: inline-block;
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.task-status--todo {
  background-color: #e3f2fd;
  color: #1976d2;
}

.task-status--doing {
  background-color: #fff9e6;
  color: #ff9800;
  animation: status-pulse 1.5s infinite alternate;
}

.task-status--done {
  background-color: #f0f9f0;
  color: #4caf50;
}

@keyframes status-pulse {
  from {
    opacity: 0.7;
    transform: scale(1);
  }
  to {
    opacity: 1;
    transform: scale(1.05);
  }
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
  flex-wrap: wrap;
  gap: 0.8rem;
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 0.5rem;
  align-items: center;
}

/* 优先级样式 */
.task-item__priority {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  transition: all 0.3s ease;
  animation: priority-rotate 0.5s ease;
}

/* 优先级图标 */
.priority-icon {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  position: relative;
  transition: all 0.3s ease;
}

/* 高优先级 */
.priority-icon--high {
  background-color: #ff4d4f;
  animation: priority-high 1s infinite alternate;
}

.priority-icon--high::after {
  content: '!';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 10px;
  color: white;
  font-weight: bold;
}

/* 中优先级 */
.priority-icon--medium {
  background-color: #faad14;
  animation: priority-medium 1.5s infinite alternate;
}

.priority-icon--medium::after {
  content: '△';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 8px;
  color: white;
  font-weight: bold;
}

/* 低优先级 */
.priority-icon--low {
  background-color: #52c41a;
  animation: priority-low 2s infinite alternate;
}

.priority-icon--low::after {
  content: '○';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 8px;
  color: white;
  font-weight: bold;
}

/* 优先级文本 */
.priority-text {
  font-size: 0.75rem;
  font-weight: 500;
}

/* 优先级动画 */
@keyframes priority-rotate {
  0% {
    transform: rotate(0deg) scale(1);
  }
  50% {
    transform: rotate(180deg) scale(1.1);
  }
  100% {
    transform: rotate(360deg) scale(1);
  }
}

@keyframes priority-high {
  from {
    transform: scale(1);
    box-shadow: 0 0 4px rgba(255, 77, 79, 0.5);
  }
  to {
    transform: scale(1.2);
    box-shadow: 0 0 8px rgba(255, 77, 79, 0.8);
  }
}

@keyframes priority-medium {
  from {
    transform: scale(1);
    box-shadow: 0 0 4px rgba(250, 173, 20, 0.5);
  }
  to {
    transform: scale(1.1);
    box-shadow: 0 0 6px rgba(250, 173, 20, 0.7);
  }
}

@keyframes priority-low {
  from {
    transform: scale(1);
    box-shadow: 0 0 4px rgba(82, 196, 26, 0.5);
  }
  to {
    transform: scale(1.1);
    box-shadow: 0 0 6px rgba(82, 196, 26, 0.7);
  }
}

/* 优先级标签颜色 */
.task-item--high .task-item__priority {
  background-color: rgba(255, 77, 79, 0.1);
  color: #ff4d4f;
}

.task-item--medium .task-item__priority {
  background-color: rgba(250, 173, 20, 0.1);
  color: #faad14;
}

.task-item--low .task-item__priority {
  background-color: rgba(82, 196, 26, 0.1);
  color: #52c41a;
}

/* 优先级切换动画 */
.task-item__priority:hover {
  transform: scale(1.1);
  transition: all 0.3s ease;
}

/* 优先级标签动画 */
.task-item__priority {
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.task-item__priority::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);
  transition: left 0.5s ease;
}

.task-item__priority:hover::after {
  left: 100%;
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

/* 任务项添加/删除动画 */
.task-item-enter-active {
  animation: task-item-enter 0.35s ease-out;
}

.task-item-leave-active {
  animation: task-item-leave 0.3s ease-in;
  position: absolute;
  width: calc(100% - 2rem);
}

@keyframes task-item-enter {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  50% {
    transform: translateY(-5px) scale(1.02);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes task-item-leave {
  0% {
    opacity: 1;
    height: auto;
    padding: 1rem;
    margin-bottom: 0.8rem;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    height: 0;
    padding: 0;
    margin-bottom: 0;
    transform: scale(0.9);
  }
}

/* 确认删除抖动动画 */
@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  10%,
  30%,
  50%,
  70%,
  90% {
    transform: translateX(-3px);
  }
  20%,
  40%,
  60%,
  80% {
    transform: translateX(3px);
  }
}

.shake {
  animation: shake 0.3s ease-in-out;
}

/* 任务状态切换动画 */
.task-item {
  transition: all 0.3s ease;
  overflow: hidden;
  position: relative;
}

/* 待办→进行中动画 */
.task-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 0;
  background-color: rgba(255, 193, 7, 0.1);
  transition: width 0.4s ease;
  z-index: -1;
}

.task-item:hover::before {
  width: 100%;
}

/* 完成任务动画 */
.task-item__btn--complete:disabled {
  opacity: 0.7;
  transition: all 0.3s ease;
}

.task-item__btn--complete:not(:disabled):active {
  transform: scale(0.95);
}

/* 优先级标签动画 */
.task-item__category {
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.task-item__category::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transition: left 0.5s ease;
}

.task-item:hover .task-item__category::after {
  left: 100%;
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
