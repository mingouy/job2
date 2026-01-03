// 任务数据存储键名
const TASK_STORAGE_KEY = 'task_management_tasks'
// 分类数据存储键名
const CATEGORY_STORAGE_KEY = 'task_management_categories'

// 任务接口定义
export interface Task {
  id: string
  title: string
  category: string
  priority: 'high' | 'medium' | 'low'
  deadline: string
  status: 'todo' | 'doing' | 'done'
  description: string
  createTime: string
}

// 分类接口定义
export interface Category {
  id: string
  name: string
}

// 1. 任务数据操作
// 保存任务到LocalStorage
export const saveTaskToLocal = (task: Task): void => {
  const existingTasks = JSON.parse(localStorage.getItem(TASK_STORAGE_KEY) || '[]')
  existingTasks.push(task)
  localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify(existingTasks))
}

// 从LocalStorage获取所有任务
export const getTasksFromLocal = (): Task[] => {
  return JSON.parse(localStorage.getItem(TASK_STORAGE_KEY) || '[]')
}

// 更新LocalStorage中的任务
export const updateTaskToLocal = (updatedTask: Task): void => {
  let existingTasks: Task[] = JSON.parse(localStorage.getItem(TASK_STORAGE_KEY) || '[]')
  existingTasks = existingTasks.map((task) =>
    task.id === updatedTask.id ? { ...task, ...updatedTask } : task,
  )
  localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify(existingTasks))
}

// 更新任务状态
export const updateTaskStatus = (taskId: string, newStatus: Task['status']): void => {
  let existingTasks: Task[] = JSON.parse(localStorage.getItem(TASK_STORAGE_KEY) || '[]')
  existingTasks = existingTasks.map((task) =>
    task.id === taskId ? { ...task, status: newStatus } : task,
  )
  localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify(existingTasks))
}

// 从LocalStorage删除任务
export const deleteTaskFromLocal = (taskId: string): void => {
  let existingTasks: Task[] = JSON.parse(localStorage.getItem(TASK_STORAGE_KEY) || '[]')
  existingTasks = existingTasks.filter((task) => task.id !== taskId)
  localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify(existingTasks))
}

// 2. 分类数据操作
// 保存分类到LocalStorage
export const saveCategoryToLocal = (category: Category): void => {
  const existingCats = JSON.parse(localStorage.getItem(CATEGORY_STORAGE_KEY) || '[]')
  existingCats.push(category)
  localStorage.setItem(CATEGORY_STORAGE_KEY, JSON.stringify(existingCats))
}

// 从LocalStorage获取所有分类
export const getCategoriesFromLocal = (): Category[] => {
  return JSON.parse(localStorage.getItem(CATEGORY_STORAGE_KEY) || '[]') || [
    { id: '1', name: 'ASP.NET程序设计' },
    { id: '2', name: '金融数据分析' },
    { id: '3', name: '软件测试技术' },
    { id: '4', name: '金融市场基础' },
    { id: '5', name: '个人计划' }
  ]
}

// 更新分类
export const updateCategoryToLocal = (updatedCat: Category): void => {
  let existingCats: Category[] = JSON.parse(localStorage.getItem(CATEGORY_STORAGE_KEY) || '[]')
  existingCats = existingCats.map((cat) =>
    cat.id === updatedCat.id ? { ...cat, ...updatedCat } : cat,
  )
  localStorage.setItem(CATEGORY_STORAGE_KEY, JSON.stringify(existingCats))
}

// 删除分类
export const deleteCategoryFromLocal = (catId: string): void => {
  let existingCats: Category[] = JSON.parse(localStorage.getItem(CATEGORY_STORAGE_KEY) || '[]')
  existingCats = existingCats.filter((cat) => cat.id !== catId)
  localStorage.setItem(CATEGORY_STORAGE_KEY, JSON.stringify(existingCats))
}