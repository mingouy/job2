import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/home-view.vue')
    },
    {
      path: '/task-detail/:id?',
      name: 'taskDetail',
      component: () => import('../views/task-detail.vue')
    },
    {
      path: '/statistics',
      name: 'statistics',
      component: () => import('../views/statistics-view.vue')
    }
  ]
})

export default router
