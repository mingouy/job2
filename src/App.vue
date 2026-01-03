<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
</script>

<template>
  <div class="app">
    <!-- 系统头部 -->
    <header class="app-header">
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
      <router-view />
    </main>

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
</style>
