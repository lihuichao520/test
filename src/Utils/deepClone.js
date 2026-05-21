function deepClone(obj, options = {}) {
  const { 
    handleFunction = false,  // 是否处理函数
    handleSymbol = true,      // 是否处理 Symbol
    maxDepth = Infinity       // 最大深度限制
  } = options;
  
  const hash = new WeakMap();
  
  function clone(value, depth = 0) {
    // 深度限制
    if (depth > maxDepth) return value;
    
    // 基本类型直接返回
    if (value === null || typeof value !== 'object') return value;
    
    // 循环引用处理
    if (hash.has(value)) return hash.get(value);
    
    // 处理函数
    if (typeof value === 'function' && handleFunction) {
      const fnStr = value.toString();
      const fnBody = fnStr.match(/\(([\s\S]*?)\)\s*\{([\s\S]*)\}/);
      if (fnBody) {
        const newFn = new Function(fnBody[1], fnBody[2]);
        hash.set(value, newFn);
        return newFn;
      }
      return value;
    }
    
    // 处理 Date
    if (value instanceof Date) {
      const date = new Date(value);
      hash.set(value, date);
      return date;
    }
    
    // 处理 RegExp
    if (value instanceof RegExp) {
      const reg = new RegExp(value.source, value.flags);
      hash.set(value, reg);
      return reg;
    }
    
    // 处理 Map
    if (value instanceof Map) {
      const map = new Map();
      hash.set(value, map);
      value.forEach((val, key) => {
        map.set(clone(key, depth + 1), clone(val, depth + 1));
      });
      return map;
    }
    
    // 处理 Set
    if (value instanceof Set) {
      const set = new Set();
      hash.set(value, set);
      value.forEach(val => {
        set.add(clone(val, depth + 1));
      });
      return set;
    }
    
    // 处理数组和普通对象
    const result = Array.isArray(value) ? [] : {};
    hash.set(value, result);
    
    // 复制所有属性（包括不可枚举和 Symbol）
    const keys = handleSymbol 
      ? Reflect.ownKeys(value) 
      : Object.keys(value);
    
    keys.forEach(key => {
      result[key] = clone(value[key], depth + 1);
    });
    
    return result;
  }
  
  return clone(obj);
}