/**
 * 防抖函数
 * @param {Function} func 要防抖的函数
 * @param {number} wait 等待的毫秒数
 * @param {boolean} immediate 是否立即执行
 * @returns {Function} 防抖后的函数
 */
function debounce(func, wait = 300, immediate = false) {
  let timeoutId = null;
  let result;
  
  const debounced = function(...args) {
    const context = this;
    
    // 清除之前的定时器
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    // 如果立即执行
    if (immediate) {
      // 如果还没有定时器，说明是第一次调用或等待期已过
      const callNow = !timeoutId;
      // 设置定时器，在等待时间后清除定时器ID
      timeoutId = setTimeout(() => {
        timeoutId = null;
      }, wait);
      
      // 如果是立即执行模式且没有定时器，立即执行函数
      if (callNow) {
        result = func.apply(context, args);
      }
    } else {
      // 延迟执行模式
      timeoutId = setTimeout(() => {
        func.apply(context, args);
      }, wait);
    }
    
    return result;
  };
  
  // 取消防抖
  debounced.cancel = function() {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };
  
  // 立即执行（强制立即执行并重置防抖）
  debounced.flush = function(...args) {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    return func.apply(this, args);
  };
  
  return debounced;
}

/**
 * React Hook 版本的防抖函数
 * @param {any} value 要防抖的值
 * @param {number} delay 延迟时间
 * @returns {any} 防抖后的值
 */
export const useDebounce = (value, delay = 300) => {
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

/**
 * 异步防抖函数（适用于异步操作）
 * @param {Function} asyncFunc 异步函数
 * @param {number} wait 等待时间
 * @returns {Function} 防抖后的异步函数
 */
export const asyncDebounce = (asyncFunc, wait = 300) => {
  let timeoutId;
  let pendingPromise;
  
  return function(...args) {
    // 清除之前的定时器
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    // 取消之前的 pending promise（如果可用）
    if (pendingPromise && pendingPromise.cancel) {
      pendingPromise.cancel();
    }
    
    // 创建新的 Promise，并添加取消方法
    let cancel;
    pendingPromise = new Promise((resolve, reject) => {
      cancel = () => {
        reject(new Error('Debounced function cancelled'));
      };
    });
    pendingPromise.cancel = cancel;
    
    // 返回一个 Promise
    return new Promise((resolve, reject) => {
      timeoutId = setTimeout(async () => {
        try {
          const result = await asyncFunc.apply(this, args);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      }, wait);
      
      // 将取消方法暴露给返回的 Promise
      pendingPromise.cancel = () => {
        clearTimeout(timeoutId);
        reject(new Error('Debounced function cancelled'));
      };
    });
  };
};

export default debounce;