<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// 导航栏背景透明度
const headerOpacity = ref(1)

// 回到顶部按钮可见性
const showBackToTop = ref(false)

// 监听滚动事件
const handleScroll = () => {
  const scrollY = window.scrollY

  // 导航栏渐变效果
  if (scrollY > 50) {
    headerOpacity.value = 1
  } else {
    headerOpacity.value = 0.2 + (scrollY / 50) * 0.8
  }

  // 回到顶部按钮显示/隐藏
  showBackToTop.value = scrollY > 200
}

// 回到顶部
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}

// 生命周期钩子
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div class="app">
    <!-- 系统头部 -->
    <header class="app-header" :style="{ backgroundColor: `rgba(25, 118, 210, ${headerOpacity})` }">
      <h1 class="app-title">学生任务管理系统</h1>
      <div class="user-info">
        <span class="user-name">学生</span>
        <div class="user-avatar">👤</div>
      </div>
    </header>

    <!-- 导航栏 -->
    <nav class="app-nav">
      <ul class="nav-list">
        <li class="nav-item">
          <router-link to="/" class="nav-link" active-class="nav-link--active"
            >任务总览</router-link
          >
        </li>
        <li class="nav-item">
          <router-link to="/statistics" class="nav-link" active-class="nav-link--active"
            >统计分析</router-link
          >
        </li>
      </ul>
    </nav>

    <!-- 主内容区 -->
    <main class="app-main">
      <transition name="page-transition" mode="out-in">
        <router-view />
      </transition>
    </main>

    <!-- 回到顶部按钮 -->
    <button class="back-to-top" :class="{ visible: showBackToTop }" @click="scrollToTop">↑</button>

    <!-- 页脚 -->
    <footer class="app-footer">
      <p>&copy; 2026 学生任务管理系统 | <a href="#" class="footer-link">帮助中心</a></p>
    </footer>
  </div>
</template>

<style scoped>
.app {
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
}

/* 头部样式 */
.app-header {
  background-color: #1976d2;
  color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.app-title {
  font-size: 1.5rem;
  margin: 0;
  font-weight: 600;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-name {
  font-size: 1rem;
  font-weight: 500;
}

.user-avatar {
  width: 36px;
  height: 36px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.user-avatar:hover {
  background-color: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

/* 导航样式 */
.app-nav {
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.nav-list {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0 2rem;
}

.nav-item {
  margin-right: 2rem;
}

.nav-link {
  display: block;
  padding: 1rem 0;
  color: #666;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  position: relative;
}

.nav-link:hover {
  color: #1976d2;
}

.nav-link--active {
  color: #1976d2;
}

.nav-link--active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background-color: #1976d2;
  border-radius: 2px;
}

/* 主内容区 */
.app-main {
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
}

/* 页脚样式 */
.app-footer {
  background-color: white;
  color: #666;
  text-align: center;
  padding: 1rem;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.05);
  margin-top: auto;
}

.footer-link {
  color: #1976d2;
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-link:hover {
  color: #1565c0;
  text-decoration: underline;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .app-header {
    padding: 1rem;
  }

  .app-title {
    font-size: 1.2rem;
  }

  .nav-list {
    padding: 0 1rem;
  }

  .nav-item {
    margin-right: 1rem;
  }

  .app-main {
    padding: 1rem;
  }
}

/* 页面切换动画 */
.page-transition-enter-active,
.page-transition-leave-active {
  transition: all 0.3s ease;
  position: absolute;
  width: 100%;
  left: 0;
  top: 0;
}

.page-transition-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.page-transition-leave-to {
  transform: translateX(-100%);
  opacity: 0;
  transition-duration: 0.25s;
}

/* 回到顶部按钮 */
.back-to-top {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 40px;
  height: 40px;
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  opacity: 0;
  transform: translateY(20px);
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
  z-index: 1000;
}

.back-to-top.visible {
  opacity: 1;
  transform: translateY(0);
}

.back-to-top:hover {
  background-color: #1565c0;
  transform: translateY(0) scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}
</style>
