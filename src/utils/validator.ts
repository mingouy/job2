// 表单验证工具函数

/**
 * 验证结果接口
 */
export interface ValidationResult {
  isValid: boolean
  message: string
}

/**
 * 完整表单验证结果接口
 */
export interface FormValidationResult {
  isValid: boolean
  errors: Record<string, string>
}

/**
 * 任务表单数据接口
 */
export interface TaskFormData {
  title: string
  deadline: string
  description: string
  priority: 'high' | 'medium' | 'low'
  status: 'todo' | 'doing' | 'done'
  category: string
}

/**
 * 验证任务名称
 * @param title - 任务名称
 * @returns 验证结果，包含isValid和message
 */
export const validateTaskTitle = (title: string): ValidationResult => {
  if (!title || title.trim() === '') {
    return { isValid: false, message: '任务名称不能为空' }
  }
  if (title.length > 100) {
    return { isValid: false, message: '任务名称不能超过100个字符' }
  }
  return { isValid: true, message: '' }
}

/**
 * 验证截止日期
 * @param deadline - 截止日期，格式为YYYY-MM-DD
 * @returns 验证结果，包含isValid和message
 */
export const validateDeadline = (deadline: string): ValidationResult => {
  if (!deadline) {
    return { isValid: false, message: '截止日期不能为空' }
  }

  const deadlineDate = new Date(deadline)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  deadlineDate.setHours(0, 0, 0, 0)

  if (deadlineDate < today) {
    return { isValid: false, message: '截止日期不能早于今天' }
  }

  return { isValid: true, message: '' }
}

/**
 * 验证任务描述
 * @param description - 任务描述
 * @returns 验证结果，包含isValid和message
 */
export const validateTaskDescription = (description: string): ValidationResult => {
  if (description && description.length > 500) {
    return { isValid: false, message: '任务描述不能超过500个字符' }
  }
  return { isValid: true, message: '' }
}

/**
 * 验证任务优先级
 * @param priority - 任务优先级
 * @returns 验证结果，包含isValid和message
 */
export const validateTaskPriority = (priority: string): ValidationResult => {
  const validPriorities: Array<'high' | 'medium' | 'low'> = ['high', 'medium', 'low']
  if (!priority || !validPriorities.includes(priority as 'high' | 'medium' | 'low')) {
    return { isValid: false, message: '优先级必须是高、中或低' }
  }
  return { isValid: true, message: '' }
}

/**
 * 验证任务状态
 * @param status - 任务状态
 * @returns 验证结果，包含isValid和message
 */
export const validateTaskStatus = (status: string): ValidationResult => {
  const validStatuses: Array<'todo' | 'doing' | 'done'> = ['todo', 'doing', 'done']
  if (!status || !validStatuses.includes(status as 'todo' | 'doing' | 'done')) {
    return { isValid: false, message: '状态必须是待办、进行中或已完成' }
  }
  return { isValid: true, message: '' }
}

/**
 * 完整的任务表单验证
 * @param taskData - 任务数据
 * @returns 验证结果，包含isValid和errors
 */
export const validateTaskForm = (taskData: TaskFormData): FormValidationResult => {
  const errors: Record<string, string> = {}
  let isValid = true

  const titleValidation = validateTaskTitle(taskData.title)
  if (!titleValidation.isValid) {
    errors.title = titleValidation.message
    isValid = false
  }

  const deadlineValidation = validateDeadline(taskData.deadline)
  if (!deadlineValidation.isValid) {
    errors.deadline = deadlineValidation.message
    isValid = false
  }

  const descriptionValidation = validateTaskDescription(taskData.description)
  if (!descriptionValidation.isValid) {
    errors.description = descriptionValidation.message
    isValid = false
  }

  const priorityValidation = validateTaskPriority(taskData.priority)
  if (!priorityValidation.isValid) {
    errors.priority = priorityValidation.message
    isValid = false
  }

  const statusValidation = validateTaskStatus(taskData.status)
  if (!statusValidation.isValid) {
    errors.status = statusValidation.message
    isValid = false
  }

  return { isValid, errors }
}
