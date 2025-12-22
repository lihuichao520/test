const DOMAIN = location.hostname
const PATH = '/'
const DAYS = 30

export const timestamp = dateStr => {
  dateStr = dateStr.substring(0, 19)
  dateStr = dateStr.replace(/-/g, '/')
  var timeTamp = new Date(dateStr).getTime()
  return timeTamp / 1000
}

export const getParameter = key => {
  var reg = new RegExp('(^|&)' + key + '=([^&]*)(&|$)', 'i')
  var r = window.location.search.substr(1).match(reg)
  var context = ''
  if (r) {
    context = r[2]
  }
  reg = null
  r = null
  return context || ''
}

export const isLogin = () => {
  return false
}

export const setCookie = (key, val, domain, path) => {
  const exp = new Date()
  const dmn = domain || DOMAIN
  const pth = path || PATH
  exp.setTime(exp.getTime() + DAYS * 24 * 60 * 60 * 1000)
  document.cookie = key + '=' + window.encodeURI(val) + ';expires=' + exp.toUTCString() + ';path=' + pth + ';domain=' + dmn
}

export const getCookie = key => {
  let arr
  let reg = new RegExp('(^| )' + key + '=([^;]*)(;|$)')
  if ((arr = document.cookie.match(reg))) return window.decodeURI(arr[2])
  else return null
}

export const delCookie = (key, domain, path) => {
  let exp = new Date()
  const dmn = domain || DOMAIN
  const pth = path || PATH
  let val = getCookie(key)
  exp.setTime(exp.getTime() - 1)
  if (val != null) {
    document.cookie = key + '=;expires=' + exp.toUTCString() + ';path=' + pth + ';domain=' + dmn
  }
}

export const formatDate = (data, fmt) => {
  let o = {
    'M+': data.getMonth() + 1,
    'd+': data.getDate(),
    'h+': data.getHours(),
    'm+': data.getMinutes(),
    's+': data.getSeconds(),
    'q+': Math.floor((data.getMonth() + 3) / 3),
    S: data.getMilliseconds()
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (data.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
    }
  }

  return fmt
}
/**
 * 根据ID查找获取树节点
 * @param {*array} tree  嵌套数组
 * @param {*number | string} id
 * @param {*opts} 数组属性值参数字典
 */
export const findTreeNodeByID = (tree = [], id = 1, opts = { id: 'id', children: 'children' }) => {
  const loopFind = function (source) {
    for (let i = 0; i < source.length; i++) {
      const node = source[i];
      if (node[opts.id] === id) {
        return node
      }
      if (node[opts.children] && node[opts.children].length) {
        const inner = loopFind(node[opts.children])
        if (inner) {
          return inner
        }
      }
    }
  }
  const result = loopFind(tree)
  return result
}

/**
 * 根据叶子节点获取路径
 * @param {*array} tree  源数组
 * @param {*number | string} leafValue 查找结点值
 * @param {*opts} 配置选项：nodeType-查找结点的属性，returnVal-返回值，children-源数组嵌套子结点名
 */
export const getPathByLeaf = (tree, leafValue, opt = { nodeType: 'id', returnVal: 'id', children: 'children' }) => {
  let result = []
  const loopFind = function (source) {
    for (let i = 0; i < source.length; i++) {
      const node = source[i];
      result.push(node[opt.returnVal])
      if (node[opt.nodeType] === leafValue) {
        return result
      }
      if (node[opt.children] && node[opt.children].length) {
        if (loopFind(node[opt.children])) {
          return result
        } else {
          result.pop()
        }
      } else {
        result.pop()
      }
    }
  }
  const finded = loopFind(tree)
  return finded
}

/**
 * 查找一个数组元素是否出现在另一个数组，返回第一个找到的元素位置
 * @param {*array} source  源数组
 * @param {*array} target 目标数组
 */
export const findTargetOfArray = (source = [], target = []) => {
  let index = -1
  source.forEach(item => {
    index = target.findIndex(res => res === item)
    if (index > -1) {
      return index
    }
  })
  return index
}

/**
 * 拷贝
 * @param {*} target
 * @returns
 */
export function merge(target) {
  for (var i = 1, j = arguments.length; i < j; i++) {
    var source = arguments[i];
    for (var prop in source) {
      if (source.hasOwnProperty(prop)) {
        var value = source[prop];
        if (value !== undefined) {
          target[prop] = value;
        }
      }
    }
  }
  return target;
}

// 简易的深拷贝，不处理特殊值
export const simpleDeepClone = (obj) => {
  try {
    return JSON.parse(JSON.stringify(obj));
  } catch (e) {
    return obj;
  }
}

// 节流函数
export function throttle(fn, wait = 300) {
  var previous = null;
  var timer = null;

  return function () {
    const now = +new Date();
    const _this = this;

    if (!previous) {
      previous = now;
    }

    clearTimeout(timer);
    if (now - previous > wait) {
      fn.apply(_this, arguments);
      previous = now;
    } else {
      timer = setTimeout(() => {
        fn.apply(_this, arguments);
      }, wait);
    }
  };
}

// 防抖函数
export const debounce = function (fn, delay = 300) {
  let timer = null;

  return function () {
    let context = this;
    let args = arguments;
    if (timer) {
      clearTimeout(timer);

      timer = setTimeout(function () {
        fn.apply(context, args);
      }, delay);
    } else {
      timer = setTimeout(function () {
        fn.apply(context, args);
      }, delay);
    }
  };
};

/**
 * 判断数组是否重复
 * @param {Array} arr 必传
 * @param {String} field 非必传，有则默认数组元素为对象,取key为field的值进行判断
 */
export function isRepeatArr(arr, field) {
  let hash = {};
  for (let i in arr) {
    let key = field ? arr[i][field] : arr[i];
    if (hash[key]) {
      return true;
    }
    hash[key] = true;
  }
  return false;
}

/**
 * @param {*} arr 源数组
 * @param {*} field 目标字段（数组元素为基础类型时可不传）
 * @returns 去重后的数组
 */
export const uniqueArr = (arr = [], field = '') => {
  const res = {}
  arr.forEach(v => {
    if (field) { // 对象字段判断
      if (!Object.keys(res).includes(v[field])) res[v[field]] = v
    } else {
      if (!Object.keys(res).includes(v)) res[v] = v
    }
  })
  return Object.values(res)
}

/**
 * @param {*} content 文本内容
 * @returns 图片链接数组
 */
export const extractImgs = (content) => {
  let reg = /(< img|<img).*?(?:>|\/>)/gim // 匹配所有图片标签
  let srcReg = /src=['"]?([^'"]*)['"]?/i // 匹配图片中的src
  if (!content.match(reg) || content.match(reg).length === 0) {
    return '';
  }
  const arr = content.match(reg).map(val => {
    let src = val.match(srcReg)
    return src && src.length ? src[1] : ''
  });
  return arr.filter(item => item !== '').join(',');
}

/**
 * 将图片地址转化为base64
 * @param {string} url 图片地址
 * @param {*} callback 回调函数
 * @param {string} outputFormat 图片输出格式
 */
export const convertImgToBase64 = (url, outputFormat) => {
  return new Promise((resolve, reject) => {
    try {
      let canvas = document.createElement('CANVAS');
      let ctx = canvas.getContext('2d');
      let img = new Image();
      const time = new Date().getTime();
      const paramStrArr = url ? url.split('?') : [];
      const hasSearchParam = paramStrArr && paramStrArr.length > 1 && paramStrArr[1];
      const timeStamp = hasSearchParam ? `&t=${time}` : `?t=${time};`;

      // setTimeout不写在ios中_img.onload不执行
      // setTimeout(() => {
      //   reject(new Error('onload not excute'));
      //   return true;
      // }, 2000);

      // 跨域处理
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        canvas.height = img.height;
        canvas.width = img.width;
        ctx.drawImage(img, 0, 0);

        let dataURL = canvas.toDataURL(outputFormat || 'image/png');

        // callback.call(this, dataURL);
        canvas = null;
        resolve({
          success: true,
          dataURL
        })
      }

      img.onerror = (err) => {
        reject(err);
      }

      img.src = url + `${timeStamp}`;
    } catch (err) {
      console.log('conver catch err', err);
      reject(err);
    }
  });
}

/**
 * base64转file
 * @param {*} base64
 * @param {*} fileName
 * @returns
 */
export const base64ToFile = (base64, fileName) => {
  let arr = base64.split(',');
  let type = arr[0].match(/:(.*?);/)[1];
  let bstr = atob(arr[1]);
  let n = bstr.length;
  let u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], fileName, { type });
}

export const loadImage = (url, callback) => {
  let img = new Image();

  img.src = url;

  if (img.complete) {
    // 如果图片已经存在于浏览器缓存中，则直接调用回调处理后续
    callback(img);
    return;
  }

  img.onload = () => {
    // 图片下载完毕，调用回调处理后续
    callback(img);
  }
}

export const isObject = (obj) => {
  return Object.prototype.toString.call(obj) === '[object Object]';
}

export const getUuid = () => {
  return 'xxxxxxxx-xxxx-xxxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// 超过位数的数字转换为万
// 转换为万的条件: limit = 1 时，超过10000即转换, limit = 10 时，超过100000即转换
export function numberToWan(num, limit = 10) {
  if (typeof num !== 'number') {
    return num;
  }
  if (num < 10000 * limit) {
    return num;
  }
  try {
    let result = (~~((num * 100) / 10000) / 100).toFixed(2);
    // 去掉小数点后面的0
    result = result.replace(/(\.0+|0+)$/, '');
    return `${result}万`;
  } catch (e) {
    return num;
  }
}
