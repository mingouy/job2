<template>
  <div class="loading-container" :class="{ 'loading-container--visible': visible }">
    <div class="loading-content">
      <div class="loading-icon">
        <div class="loading-task-icon">📋</div>
        <div class="loading-circle"></div>
      </div>
      <div class="loading-text">{{ text }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  visible: boolean;
  text?: string;
}>();
</script>

<style scoped>
.loading-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, visibility 0.3s ease;
}

.loading-container--visible {
  opacity: 1;
  visibility: visible;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
  border-radius: 12px;
  background-color: white;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.loading-icon {
  position: relative;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-task-icon {
  font-size: 3rem;
  position: relative;
  z-index: 2;
  animation: icon-pulse 2s ease-in-out infinite alternate;
}

.loading-circle {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 4px solid transparent;
  border-top-color: #1976d2;
  border-radius: 50%;
  animation: spin 2s linear infinite;
}

.loading-circle::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 4px solid transparent;
  border-bottom-color: #1976d2;
  border-radius: 50%;
  animation: spin 1.5s linear infinite reverse;
}

.loading-text {
  font-size: 1.2rem;
  color: #666;
  font-weight: 500;
  animation: text-fade 1.5s ease-in-out infinite alternate;
}

/* 动画定义 */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes icon-pulse {
  from {
    transform: scale(1) rotate(0deg);
    opacity: 0.8;
  }
  to {
    transform: scale(1.1) rotate(10deg);
    opacity: 1;
  }
}

@keyframes text-fade {
  from {
    opacity: 0.7;
    transform: translateY(0);
  }
  to {
    opacity: 1;
    transform: translateY(-5px);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .loading-content {
    padding: 1.5rem;
    margin: 1rem;
  }

  .loading-icon {
    width: 60px;
    height: 60px;
  }

  .loading-task-icon {
    font-size: 2.5rem;
  }

  .loading-text {
    font-size: 1rem;
  }
}
</style>