import { useState, useEffect } from 'react';

/**
 * 防抖 Hook
 * @param {any} value 要防抖的值
 * @param {number} delay 延迟时间（毫秒）
 * @returns {any} 防抖后的值
 */
export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // 设置定时器
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // 清除定时器
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;