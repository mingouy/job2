<template>
  <div class="task-detail">
    <!-- 头部导航 -->
    <header class="task-detail__header">
      <div class="task-detail__container">
        <div class="task-detail__back">
          <router-link to="/" class="task-detail__back-link">← 返回任务列表</router-link>
        </div>
        <h1 class="task-detail__title">{{ isEdit ? '编辑任务' : '任务详情' }}</h1>
      </div>
    </header>

    <!-- 主要内容 -->
    <main class="task-detail__main">
      <div class="task-detail__container">
        <div class="task-detail__content">
          <!-- 任务信息表单 -->
          <div class="task-detail__form-section">
            <form class="task-detail__form" @submit.prevent="submitForm">
              <div class="form-row">
                <div class="form-group">
                  <label for="title" class="form-group__label">任务名称 *</label>
                  <input
                    type="text"
                    id="title"
                    v-model="formData.title"
                    class="form-group__input"
                    placeholder="请输入任务名称"
                    required
                  />
                  <div class="form-group__error" v-if="errors.title">{{ errors.title }}</div>
                </div>

                <div class="form-group">
                  <label for="category" class="form-group__label">所属分类</label>
                  <select id="category" v-model="formData.category" class="form-group__select">
                    <option value="ASP.NET程序设计">ASP.NET程序设计</option>
                    <option value="金融数据分析">金融数据分析</option>
                    <option value="软件测试">软件测试</option>
                    <option value="数据库原理">数据库原理</option>
                    <option value="Python机器学习">Python机器学习</option>
                    <option value="高等数学">高等数学</option>
                    <option value="UI设计">UI设计</option>
                    <option value="操作系统">操作系统</option>
                    <option value="英语四级">英语四级</option>
                    <option value="计算机网络">计算机网络</option>
                    <option value="个人计划">个人计划</option>
                  </select>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="priority" class="form-group__label">优先级</label>
                  <select id="priority" v-model="formData.priority" class="form-group__select">
                    <option value="high">高</option>
                    <option value="medium">中</option>
                    <option value="low">低</option>
                  </select>
                </div>

                <div class="form-group">
                  <label for="status" class="form-group__label">任务状态</label>
                  <select id="status" v-model="formData.status" class="form-group__select">
                    <option value="todo">待办</option>
                    <option value="doing">进行中</option>
                    <option value="done">已完成</option>
                  </select>
                </div>

                <div class="form-group">
                  <label for="deadline" class="form-group__label">截止日期 *</label>
                  <input
                    type="date"
                    id="deadline"
                    v-model="formData.deadline"
                    class="form-group__input"
                    required
                  />
                  <div class="form-group__error" v-if="errors.deadline">{{ errors.deadline }}</div>
                </div>
              </div>

              <div class="form-group">
                <label for="description" class="form-group__label">任务描述</label>
                <textarea
                  id="description"
                  v-model="formData.description"
                  class="form-group__textarea"
                  placeholder="请输入任务描述"
                  rows="6"
                ></textarea>
              </div>

              <div class="form-group">
                <label for="attachment" class="form-group__label">附件上传</label>
                <input
                  type="file"
                  id="attachment"
                  @change="handleFileUpload"
                  class="form-group__file"
                />
                <div class="form-group__preview" v-if="attachmentPreview">
                  <span class="form-group__preview-text">{{ attachmentPreview.name }}</span>
                  <button type="button" class="form-group__remove" @click="removeAttachment">
                    移除
                  </button>
                </div>
              </div>
            </form>
          </div>

          <!-- 操作区 -->
          <div class="task-detail__action-section">
            <div class="task-detail__actions">
              <button
                type="button"
                class="task-detail__btn task-detail__btn--save"
                @click="submitForm"
              >
                保存修改
              </button>

              <button type="button" class="task-detail__btn task-detail__btn--back" @click="goBack">
                返回列表
              </button>

              <button
                type="button"
                class="task-detail__btn task-detail__btn--delete"
                @click="deleteTask"
              >
                删除任务
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { validateTaskForm } from '../utils/validator'
import type { Task } from '../utils/storage'
import type { FormValidationResult } from '../utils/validator'

// Router and Route
const router = useRouter()
const route = useRoute()

// Check if we're in edit mode
const isEdit = computed(() => !!route.params.id)

// Form data
const formData = reactive<Task>({
  id: Date.now().toString(),
  title: '',
  category: 'ASP.NET程序设计',
  priority: 'medium',
  deadline: '',
  status: 'todo',
  description: '',
  createTime: new Date().toISOString().split('T')[0] as string,
})

// Errors
const errors = reactive<Record<string, string>>({
  title: '',
  deadline: '',
  priority: '',
  status: '',
  description: '',
})

// File upload
const attachmentPreview = ref<File | null>(null)
const selectedFile = ref<File | null>(null)

// Load tasks from LocalStorage
const tasks = ref<Task[]>([])

// Load tasks data
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

// Load task data if editing
const loadTaskData = () => {
  if (isEdit.value) {
    const taskId = route.params.id as string
    const task = tasks.value.find((t) => t.id === taskId)
    if (task) {
      Object.assign(formData, task)
    } else {
      // Task not found, redirect to home
      router.push('/')
    }
  }
}

// Initialize data
onMounted(async () => {
  await loadTasks()
  loadTaskData()
})

// Submit form
const submitForm = () => {
  const validationResult: FormValidationResult = validateTaskForm(formData)

  if (validationResult.isValid) {
    // Save to LocalStorage
    if (isEdit.value) {
      // Update existing task
      const taskIndex = tasks.value.findIndex((t) => t.id === formData.id)
      if (taskIndex !== -1) {
        tasks.value[taskIndex] = { ...formData }
      }
    } else {
      // Add new task
      tasks.value.push({ ...formData })
    }

    localStorage.setItem('tasks', JSON.stringify(tasks.value))

    // Redirect to home
    router.push('/')
  } else {
    // Clear previous errors
    Object.keys(errors).forEach((key) => {
      errors[key] = ''
    })
    // Assign new errors
    Object.assign(errors, validationResult.errors)
  }
}

// Delete task
const deleteTask = () => {
  if (isEdit.value && confirm('确定要删除这个任务吗？')) {
    tasks.value = tasks.value.filter((task) => task.id !== formData.id)
    localStorage.setItem('tasks', JSON.stringify(tasks.value))
    router.push('/')
  }
}

// Go back
const goBack = () => {
  router.push('/')
}

// Handle file upload
const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0] || null
  if (file) {
    selectedFile.value = file
    attachmentPreview.value = file
  }
}

// Remove attachment
const removeAttachment = () => {
  selectedFile.value = null
  attachmentPreview.value = null
  const fileInput = document.getElementById('attachment') as HTMLInputElement
  if (fileInput) {
    fileInput.value = ''
  }
}
</script>

<style scoped>
/* Task detail container */
.task-detail {
  font-family: 'Microsoft YaHei', sans-serif;
  background-color: #f5f5f5;
  min-height: 100vh;
}

/* Header */
.task-detail__header {
  background-color: #1976d2;
  color: white;
  padding: 1rem 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.task-detail__container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.task-detail__title {
  font-size: 1.5rem;
  margin: 0;
  text-align: center;
}

.task-detail__back {
  margin-bottom: 1rem;
}

.task-detail__back-link {
  color: white;
  text-decoration: none;
  font-size: 1rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.task-detail__back-link:hover {
  text-decoration: underline;
}

/* Main content */
.task-detail__main {
  padding: 2rem 0;
}

.task-detail__content {
  background-color: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.task-detail__form-section {
  margin-bottom: 2rem;
}

/* Form styles */
.task-detail__form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group__label {
  font-size: 0.9rem;
  color: #333;
  font-weight: 500;
}

.form-group__input,
.form-group__select,
.form-group__textarea {
  padding: 0.8rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 1rem;
  transition: all 0.3s ease;
  font-family: inherit;
}

.form-group__input:focus,
.form-group__select:focus,
.form-group__textarea:focus {
  outline: none;
  border-color: #1976d2;
  box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.2);
}

.form-group__textarea {
  resize: vertical;
  min-height: 100px;
}

.form-group__file {
  display: block;
}

.form-group__preview {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem;
  background-color: #f5f5f5;
  border-radius: 4px;
  font-size: 0.9rem;
}

.form-group__preview-text {
  color: #666;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 0.5rem;
}

.form-group__remove {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 0.3rem 0.8rem;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.form-group__remove:hover {
  background-color: #e53935;
}

.form-group__error {
  color: #f44336;
  font-size: 0.8rem;
  margin-top: 0.3rem;
}

/* Actions section */
.task-detail__action-section {
  border-top: 1px solid #e0e0e0;
  padding-top: 2rem;
}

.task-detail__actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.task-detail__btn {
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.task-detail__btn--save {
  background-color: #4caf50;
  color: white;
}

.task-detail__btn--save:hover {
  background-color: #43a047;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

.task-detail__btn--back {
  background-color: #f5f5f5;
  color: #666;
}

.task-detail__btn--back:hover {
  background-color: #e0e0e0;
}

.task-detail__btn--delete {
  background-color: #f44336;
  color: white;
}

.task-detail__btn--delete:hover {
  background-color: #e53935;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(244, 67, 54, 0.3);
}

/* Responsive design */
@media (max-width: 768px) {
  .task-detail__container {
    padding: 0 1rem;
  }

  .task-detail__content {
    padding: 1rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .task-detail__actions {
    flex-direction: column;
  }

  .task-detail__btn {
    width: 100%;
  }
}
</style>
