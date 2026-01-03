<template>
  <div class="task-form-wrapper">
    <div class="task-form-overlay" @click="$emit('close')"></div>
    <div class="task-form">
      <div class="task-form__header">
        <h2 class="task-form__title">{{ isEdit ? '编辑任务' : '添加任务' }}</h2>
        <button class="task-form__close" @click="$emit('close')">&times;</button>
      </div>

      <form class="task-form__content" @submit.prevent="submitForm">
        <!-- 成功提示 -->
        <div class="success-toast" :class="{ visible: showSuccessToast }">
          <span class="success-toast__icon">✓</span>
          <span class="success-toast__message">{{ successMessage }}</span>
        </div>
        <div class="form-group">
          <label for="title" class="form-group__label">任务名称 *</label>
          <input
            type="text"
            id="title"
            v-model="formData.title"
            class="form-group__input"
            :class="formValidationStatus.title"
            placeholder="请输入任务名称"
            required
            @input="clearValidationStatus('title')"
          />
          <div class="form-group__error" :class="{ visible: errors.title }" v-if="errors.title">
            {{ errors.title }}
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="category" class="form-group__label">所属分类</label>
            <select
              id="category"
              v-model="formData.category"
              class="form-group__select"
              :class="formValidationStatus.category"
              @change="clearValidationStatus('category')"
            >
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

          <div class="form-group">
            <label for="priority" class="form-group__label">优先级</label>
            <select
              id="priority"
              v-model="formData.priority"
              class="form-group__select"
              :class="formValidationStatus.priority"
              @change="clearValidationStatus('priority')"
            >
              <option value="high">高</option>
              <option value="medium">中</option>
              <option value="low">低</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label for="deadline" class="form-group__label">截止日期 *</label>
          <input
            type="date"
            id="deadline"
            v-model="formData.deadline"
            class="form-group__input"
            :class="formValidationStatus.deadline"
            required
            @input="clearValidationStatus('deadline')"
          />
          <div
            class="form-group__error"
            :class="{ visible: errors.deadline }"
            v-if="errors.deadline"
          >
            {{ errors.deadline }}
          </div>
        </div>

        <div class="form-group">
          <label for="description" class="form-group__label">任务描述</label>
          <textarea
            id="description"
            v-model="formData.description"
            class="form-group__textarea"
            placeholder="请输入任务描述"
            rows="4"
          ></textarea>
        </div>

        <div class="form-group">
          <label for="attachment" class="form-group__label">附件上传</label>
          <input type="file" id="attachment" @change="handleFileUpload" class="form-group__file" />
          <div class="form-group__preview" v-if="attachmentPreview">
            <span class="form-group__preview-text">{{ attachmentPreview.name }}</span>
            <button type="button" class="form-group__remove" @click="removeAttachment">移除</button>
          </div>
        </div>

        <div class="task-form__actions">
          <button
            type="button"
            class="task-form__btn task-form__btn--cancel"
            @click="$emit('close')"
          >
            取消
          </button>
          <button type="submit" class="task-form__btn task-form__btn--submit">保存</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { validateTaskForm } from '../utils/validator'
import type { Task } from '../utils/storage'
import type { TaskFormData, FormValidationResult } from '../utils/validator'

// Props
const props = defineProps<{
  task?: Task
}>()

// Emits
const emit = defineEmits<{
  (e: 'save', taskData: Task): void
  (e: 'close'): void
}>()

// Form data
const formData = ref<TaskFormData>({
  title: '',
  category: 'ASP.NET程序设计',
  priority: 'medium',
  deadline: '',
  description: '',
  status: 'todo',
})

// File upload
const selectedFile = ref<File | null>(null)
const attachmentPreview = ref<File | null>(null)

// Form errors
const errors = ref<Record<string, string>>({
  title: '',
  deadline: '',
  priority: '',
  status: '',
  description: '',
})

// Form validation status
const formValidationStatus = ref<Record<string, 'error' | 'valid' | ''>>({
  title: '',
  deadline: '',
  priority: '',
  status: '',
  description: '',
})

// Success toast
const showSuccessToast = ref(false)
const successMessage = ref('')

// Show success toast
const showSuccess = (message: string) => {
  successMessage.value = message
  showSuccessToast.value = true
  setTimeout(() => {
    showSuccessToast.value = false
  }, 3000)
}

// Is edit mode
const isEdit = computed(() => !!props.task)

// Watch for task prop changes
watch(
  () => props.task,
  (newTask) => {
    if (newTask) {
      formData.value = {
        title: newTask.title,
        category: newTask.category,
        priority: newTask.priority,
        deadline: newTask.deadline,
        description: newTask.description,
        status: newTask.status,
      }
    } else {
      resetForm()
    }
  },
  { immediate: true, deep: true },
)

// Reset form
const resetForm = () => {
  formData.value = {
    title: '',
    category: 'ASP.NET程序设计',
    priority: 'medium',
    deadline: '',
    description: '',
    status: 'todo',
  }
  attachmentPreview.value = null
  selectedFile.value = null
  Object.keys(errors.value).forEach((key) => {
    errors.value[key] = ''
  })
}

// Submit form
const submitForm = () => {
  const validationResult: FormValidationResult = validateTaskForm(formData.value)

  // Reset validation status
  Object.keys(formValidationStatus.value).forEach((key) => {
    formValidationStatus.value[key as keyof typeof formValidationStatus.value] = ''
  })

  if (validationResult.isValid) {
    const taskData: Task = {
      ...formData.value,
      id: isEdit.value ? props.task!.id : Date.now().toString(),
      createTime: isEdit.value
        ? props.task!.createTime
        : (new Date().toISOString().split('T')[0] as string),
    }

    emit('save', taskData)

    // Show success toast
    showSuccess(isEdit.value ? '任务更新成功！' : '任务添加成功！')

    resetForm()
  } else {
    errors.value = validationResult.errors

    // Set validation status for each field
    Object.keys(validationResult.errors).forEach((key) => {
      formValidationStatus.value[key as keyof typeof formValidationStatus.value] = 'error'
    })

    // Set valid status for fields without errors
    Object.keys(formData.value).forEach((key) => {
      if (!validationResult.errors[key as keyof typeof validationResult.errors]) {
        formValidationStatus.value[key as keyof typeof formValidationStatus.value] = 'valid'
      }
    })
  }
}

// Clear validation status on input
const clearValidationStatus = (field: keyof typeof formValidationStatus.value) => {
  formValidationStatus.value[field] = ''
  errors.value[field] = ''
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
.task-form-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.task-form-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

.task-form {
  position: relative;
  background-color: white;
  border-radius: 8px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.task-form__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e0e0e0;
}

.task-form__title {
  font-size: 1.5rem;
  color: #333;
  margin: 0;
}

.task-form__close {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #666;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.task-form__close:hover {
  background-color: #f5f5f5;
  color: #333;
}

.task-form__content {
  padding: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group__label {
  display: block;
  font-size: 0.9rem;
  color: #333;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-group__input,
.form-group__select,
.form-group__textarea {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 1rem;
  transition: all 0.3s ease;
  font-family: inherit;
  position: relative;
  overflow: hidden;
}

/* 输入框聚焦动画 */
.form-group__input:focus,
.form-group__select:focus,
.form-group__textarea:focus {
  outline: none;
  border-color: #1976d2;
  box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.2);
  transform: scaleX(1.01);
  transition: all 0.2s ease;
}

/* 输入框完成标识 */
.form-group {
  position: relative;
}

.form-group__input.valid,
.form-group__select.valid,
.form-group__textarea.valid {
  border-color: #52c41a;
  box-shadow: 0 0 0 2px rgba(82, 196, 26, 0.2);
}

/* 表单验证反馈动画 */
.form-group__error {
  color: #f44336;
  font-size: 0.8rem;
  margin-top: 0.3rem;
  opacity: 0;
  transform: translateY(10px);
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}

.form-group__error.visible {
  opacity: 1;
  transform: translateY(0);
  animation: error-flash 0.4s ease;
}

@keyframes error-flash {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* 闪烁提醒动画 */
@keyframes flash {
  0%,
  100% {
    border-color: #ff4d4f;
  }
  50% {
    border-color: transparent;
  }
}

.form-group__input.error,
.form-group__select.error,
.form-group__textarea.error {
  animation: flash 0.4s ease-in-out;
  border-color: #ff4d4f;
  box-shadow: 0 0 0 2px rgba(255, 77, 79, 0.2);
}

/* 保存按钮加载动画 */
.task-form__btn--submit.loading {
  opacity: 0.7;
  pointer-events: none;
  position: relative;
  overflow: hidden;
}

.task-form__btn--submit.loading::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20px;
  height: 20px;
  margin: -10px 0 0 -10px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 成功提示动画 */
.success-toast {
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: #52c41a;
  color: white;
  padding: 12px 20px;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  opacity: 0;
  transform: translateY(-20px);
  transition: all 0.3s ease;
  z-index: 10000;
  display: flex;
  align-items: center;
  gap: 8px;
}

.success-toast.visible {
  opacity: 1;
  transform: translateY(0);
  animation: toast-slide-in 0.3s ease;
}

.success-toast.hidden {
  opacity: 0;
  transform: translateY(-20px);
  transition: all 0.3s ease;
}

@keyframes toast-slide-in {
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }
  70% {
    opacity: 1;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 文件上传动画 */
.form-group__file {
  display: block;
  margin-bottom: 0.5rem;
  transition: all 0.3s ease;
}

.form-group__file:hover {
  opacity: 0.8;
  transform: scale(1.02);
}

/* 预览文件动画 */
.form-group__preview {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem;
  background-color: #f5f5f5;
  border-radius: 4px;
  font-size: 0.9rem;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.3s ease;
  animation: preview-slide-in 0.3s ease forwards;
}

@keyframes preview-slide-in {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 移除按钮动画 */
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
  transform: scale(1.05);
  box-shadow: 0 2px 8px rgba(255, 77, 79, 0.3);
}

.form-group__remove:active {
  transform: scale(0.95);
}

.form-group__textarea {
  resize: vertical;
  min-height: 100px;
}

.form-group__file {
  display: block;
  margin-bottom: 0.5rem;
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

.task-form__actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e0e0e0;
}

.task-form__btn {
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.task-form__btn--cancel {
  background-color: #f5f5f5;
  color: #666;
}

.task-form__btn--cancel:hover {
  background-color: #e0e0e0;
}

.task-form__btn--submit {
  background-color: #1976d2;
  color: white;
}

.task-form__btn--submit:hover {
  background-color: #1565c0;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.3);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .task-form {
    margin: 1rem;
    max-height: calc(100vh - 2rem);
  }

  .task-form__header,
  .task-form__content {
    padding: 1rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .task-form__actions {
    flex-direction: column;
  }

  .task-form__btn {
    width: 100%;
  }
}
</style>
