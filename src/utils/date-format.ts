// 日期格式化工具函数

/**
 * 格式化日期为YYYY-MM-DD格式
 * @param date - 日期对象或日期字符串
 * @returns 格式化后的日期字符串
 */
export const formatDate = (date: Date | string): string => {
  if (!date) return '';

  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

/**
 * 格式化日期为更友好的显示格式，如"2024年12月15日"
 * @param date - 日期对象或日期字符串
 * @returns 格式化后的日期字符串
 */
export const formatDateFriendly = (date: Date | string): string => {
  if (!date) return '';

  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();

  return `${year}年${month}月${day}日`;
};

/**
 * 计算两个日期之间的天数差
 * @param startDate - 开始日期
 * @param endDate - 结束日期
 * @returns 天数差
 */
export const getDaysBetween = (startDate: Date | string, endDate: Date | string): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;

  const timeDiff = end.getTime() - start.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
};

/**
 * 判断日期是否已逾期
 * @param deadline - 截止日期
 * @returns 是否已逾期
 */
export const isOverdue = (deadline: Date | string): boolean => {
  if (!deadline) return false;

  const now = new Date();
  const deadlineDate = new Date(deadline);

  if (isNaN(deadlineDate.getTime())) return false;

  now.setHours(0, 0, 0, 0);
  deadlineDate.setHours(0, 0, 0, 0);

  return deadlineDate < now;
};

/**
 * 获取相对时间描述，如"今天"、"明天"、"后天"、"3天后"
 * @param date - 日期对象或日期字符串
 * @returns 相对时间描述
 */
export const getRelativeDate = (date: Date | string): string => {
  if (!date) return '';

  const targetDate = new Date(date);
  const today = new Date();

  if (isNaN(targetDate.getTime())) return '';

  today.setHours(0, 0, 0, 0);
  targetDate.setHours(0, 0, 0, 0);

  const diffDays = getDaysBetween(today, targetDate);

  if (diffDays === 0) return '今天';
  if (diffDays === 1) return '明天';
  if (diffDays === 2) return '后天';
  if (diffDays > 2 && diffDays <= 7) return `${diffDays}天后`;
  if (diffDays > 7) return formatDateFriendly(date);
  if (diffDays === -1) return '昨天';
  if (diffDays === -2) return '前天';
  if (diffDays < -2 && diffDays >= -7) return `${Math.abs(diffDays)}天前`;
  if (diffDays < -7) return formatDateFriendly(date);

  return formatDateFriendly(date);
};

/**
 * 日期范围接口
 */
export interface DateRange {
  start: string;
  end: string;
}

/**
 * 获取本周的开始和结束日期
 * @returns 包含start和end属性的对象
 */
export const getThisWeekRange = (): DateRange => {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);

  const startOfWeek = new Date(now.setDate(diff));
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  return {
    start: formatDate(startOfWeek),
    end: formatDate(endOfWeek)
  };
};

/**
 * 获取本月的开始和结束日期
 * @returns 包含start和end属性的对象
 */
export const getThisMonthRange = (): DateRange => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const startOfMonth = new Date(year, month, 1);
  startOfMonth.setHours(0, 0, 0, 0);

  const endOfMonth = new Date(year, month + 1, 0);
  endOfMonth.setHours(23, 59, 59, 999);

  return {
    start: formatDate(startOfMonth),
    end: formatDate(endOfMonth)
  };
};