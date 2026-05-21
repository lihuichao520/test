import Vue from "vue";
import overlayComponent from "./overlay.vue";

let modalStack = [];
let zIndexNum = 1000;
let overlay;

// 动态更新遮罩层
function mount(Component, data) {
  const instance = new Vue({
    props: Component.props,
    render(h) {
      return h(Component, {
        props: this.$props,
        ...data,
      });
    },
  }).$mount();

  return instance;
}

const overlayManager = {
  // 获取最新zIndex
  getZIndex(id) {
    if (!id) {
      zIndexNum += 1;
      return zIndexNum;
    }

    const overlayExm = modalStack.find((res) => res.config.id === id);

    if (overlayExm) {
      return overlay.config.zIndex;
    }

    zIndexNum += 1;
    return zIndexNum;
  },

  // 获取当前即最外层弹窗实例
  get topStack() {
    if (modalStack.length - 1 < 0) return null;

    return modalStack[modalStack.length - 1];
  },

  // 更新遮罩层
  updateOverlay() {
    const { clickHandle, topStack } = overlayManager;

    // 单例
    if (!overlay) {
      overlay = mount(overlayComponent, {
        nativeOn: {
          click: clickHandle,
        },
      });
    }

    if (topStack) {
      const { vm, config } = topStack;
      const el = vm.$el;

      if (el && el.parentNode && el.parentNode.nodeType !== 11) {
        el.parentNode.appendChild(overlay.$el);
      } else {
        document.body.appendChild(overlay.$el);
      }

      Object.assign(overlay, config, {
        value: true,
      });
    } else {
      overlay.value = false;
    }
  },

  // 打开遮罩层，同时将最新弹窗实例推入堆栈
  openModal(vm, config) {
    const { id, zIndex, duration, overlayClass, overlayStyle } = config;

    modalStack.push({
      vm,
      config: {
        id,
        zIndex,
        duration,
        overlayClass,
        overlayStyle,
      },
    });

    overlayManager.updateOverlay();
  },

  clickHandle() {
    const { topStack } = overlayManager;

    // 防止多次点击
    if (modalStack.length && topStack.vm.closeOnClickOverlay) {
      topStack.vm.$emit("click-overlay");
      topStack.vm.close();
    }
  },

  closeOverlay(vm) {
    if (modalStack.length > 0) {
      if (overlayManager.topStack.vm === vm) {
        modalStack.pop();
        overlayManager.updateOverlay();
      } else {
        modalStack = modalStack.filter((item) => item.vm !== vm);
      }
    }
  },
};

// function updateOverlay() {
//   const { clickHandle, topStack } = overlayManager;

//   if (!overlay) {
//     overlay = mount(overlayComponent);
//   }

//   if (topStack) {
//     const { vm, config } = topStack;
//     const el = vm.$el;

//     if (el && el.parentNode && el.parentNode.nodeType !== 11) {
//       el.parentNode(overlay.$el);
//     } else {
//       document.body(overlay.$el);
//     }

//     Object.assign(overlay, config, {
//       value: true,
//     });
//   } else {
//     overlay.value = false;
//   }
// }
const overlayProps = {
  value: {
    type: Boolean,
    default: false,
  },
  overlay: {
    type: Boolean,
    default: true,
  },
  lockScroll: {
    type: Boolean,
    default: true,
  },
  duration: {
    type: Number,
    default: 0.3,
  },
  closeOnClickOverlay: {
    type: Boolean,
    default: true,
  },
  overlayClass: {
    type: String,
    default: "",
  },
  overlayStyle: {
    type: Object,
    default() {
      return null;
    },
  },
  zIndex: {
    type: Number,
  },
};

function getProps() {
  if (!this) return {};
  const obj = {};

  Object.keys(overlayProps).forEach((res) => {
    obj[res] = this[res];
  });
  return obj;
}

// /**
//  * 根据ID查找获取树节点
//  * @param {*array} tree  嵌套数组
//  * @param {*number | string} id
//  * @param {*opts} 数组属性值参数字典
//  */
// export const findTreeNodeByID = (tree = [], id = 1, opts = { id: 'id', children: 'children' }) => {
//   const loopFind = function (source) {
//     for (let i = 0; i < source.length; i++) {
//       const node = source[i];
//       if (node[opts.id] === id) {
//         return node
//       }
//       if (node[opts.children] && node[opts.children].length) {
//         const inner = loopFind(node[opts.children])
//         if (inner) {
//           return inner
//         }
//       }
//     }
//   }
//   const result = loopFind(tree)
//   return result
// }

// /**
//  * 根据叶子节点获取路径
//  * @param {*array} tree  源数组
//  * @param {*number | string} leafValue 查找结点值
//  * @param {*opts} 配置选项：nodeType-查找结点的属性，returnVal-返回值，children-源数组嵌套子结点名
//  */
// export const getPathByLeaf = (tree, leafValue, opt = { nodeType: 'id', returnVal: 'id', children: 'children', nodeName: 'name' }) => {
//   let result = []
//   const loopFind = function (source) {
//     for (let i = 0; i < source.length; i++) {
//       const node = source[i];
//       result.push({
//         id: node[opt.returnVal],
//         name: node[opt.nodeName]
//       })

//       if (node[opt.nodeType] === leafValue) {
//         return result
//       }
//       if (node[opt.children] && node[opt.children].length) {
//         if (loopFind(node[opt.children])) {
//           return result
//         } else {
//           result.pop()
//         }
//       } else {
//         result.pop()
//       }
//     }
//   }
//   const finded = loopFind(tree)
//   return finded
// }

// export const GPS = {
//   PI: 3.14159265358979324,
//   x_pi: (3.14159265358979324 * 3000.0) / 180.0,
//   delta(lat, lon) {
//     // Krasovsky 1940
//     //
//     // a = 6378245.0, 1/f = 298.3
//     // b = a * (1 - f)
//     // ee = (a^2 - b^2) / a^2;
//     const a = 6378245.0; //  a: 卫星椭球坐标投影到平面地图坐标系的投影因子。
//     const ee = 0.00669342162296594323; //  ee: 椭球的偏心率。
//     let dLat = this.transformLat(lon - 105.0, lat - 35.0);
//     let dLon = this.transformLon(lon - 105.0, lat - 35.0);
//     const radLat = (lat / 180.0) * this.PI;
//     let magic = Math.sin(radLat);
//     magic = 1 - ee * magic * magic;
//     const sqrtMagic = Math.sqrt(magic);
//     dLat = (dLat * 180.0) / (((a * (1 - ee)) / (magic * sqrtMagic)) * this.PI);
//     dLon = (dLon * 180.0) / ((a / sqrtMagic) * Math.cos(radLat) * this.PI);
//     return { lat: dLat, lon: dLon };
//   },

//   // GPS---高德
//   gcj_encrypt(wgsLat, wgsLon) {
//     if (this.outOfChina(wgsLat, wgsLon)) {
//       return { lat: wgsLat, lon: wgsLon };
//     }

//     const d = this.delta(wgsLat, wgsLon);
//     return { lat: wgsLat + d.lat, lon: wgsLon + d.lon };
//   },
//   outOfChina(lat, lon) {
//     if (lon < 72.004 || lon > 137.8347) {
//       return true;
//     }
//     if (lat < 0.8293 || lat > 55.8271) {
//       return true;
//     }
//     return false;
//   },
//   transformLat(x, y) {
//     let ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
//     ret += ((20.0 * Math.sin(6.0 * x * this.PI) + 20.0 * Math.sin(2.0 * x * this.PI)) * 2.0) / 3.0;
//     ret += ((20.0 * Math.sin(y * this.PI) + 40.0 * Math.sin((y / 3.0) * this.PI)) * 2.0) / 3.0;
//     ret += ((160.0 * Math.sin((y / 12.0) * this.PI) + 320 * Math.sin((y * this.PI) / 30.0)) * 2.0) / 3.0;
//     return ret;
//   },
//   transformLon(x, y) {
//     let ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
//     ret += ((20.0 * Math.sin(6.0 * x * this.PI) + 20.0 * Math.sin(2.0 * x * this.PI)) * 2.0) / 3.0;
//     ret += ((20.0 * Math.sin(x * this.PI) + 40.0 * Math.sin((x / 3.0) * this.PI)) * 2.0) / 3.0;
//     ret += ((150.0 * Math.sin((x / 12.0) * this.PI) + 300.0 * Math.sin((x / 30.0) * this.PI)) * 2.0) / 3.0;
//     return ret;
//   },
// };

// export const getDistance = function (lat1, lng1, lat2, lng2) {
//   const radLat1 = (lat1 * Math.PI) / 180.0;
//   const radLat2 = (lat2 * Math.PI) / 180.0;
//   const a = radLat1 - radLat2;
//   const b = (lng1 * Math.PI) / 180.0 - (lng2 * Math.PI) / 180.0;
//   let s = 2
//     * Math.asin(
//       // eslint-disable-next-line no-restricted-properties
//       Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)),
//     );
//   s *= 6378.137; // EARTH_RADIUS;
//   s = Math.round(s * 10000) / 10000;
//   return s;
// };

// /**
//  * 判断是否为pad
//  */
// const _isTablet = () => {
//   try {
//     let userAgent = window.navigator.userAgent || window.navigator.vendor || window.opera;
//     userAgent = userAgent.toLowerCase();

//     // 关键UA检测点
//     const isOtherPad = /ipad|playbook|silk/.test(userAgent); // iPad明确标识
//     const isAndroid = /android/.test(userAgent);
//     const isAndroidTablet = isAndroid && !/mobile/.test(userAgent); // Android平板通常不含"Mobile"

//     // 屏幕尺寸检测（Pad通常最小宽度）
//     const hasLargeScreen = window.innerWidth >= 768;
//     const isTouchDevice = 'ontouchstart' in window || window.navigator.maxTouchPoints;

//     return (isAndroidTablet || isOtherPad) && hasLargeScreen && isTouchDevice;
//     // eslint-disable-next-line no-empty
//   } catch (err) {}
// };

// export const isTablet = _isTablet();

// const _isFoldableScreen = () => {
//   try {
//     const { width, height } = window.screen;
//     const aspectRatio = width / height;
//     const clientWidth = document.documentElement.clientWidth;
//     const devicePixelRatio = window.devicePixelRatio;
//     const cornerWidth = 1200 / devicePixelRatio;
//     const isFold = clientWidth > 500 && clientWidth > cornerWidth;

//     // 常见折叠屏特征：超长宽比或特殊比例 // 折叠态常见比例 (如 Galaxy Fold: 4:6 展开 -> 23:25 折叠)// 纵向折叠情况// 高分辨率设备
//     return (aspectRatio > 2.5 || aspectRatio < 0.4 || Math.max(width, height) > 3000 || isFold) && !isPC();
//     // eslint-disable-next-line no-empty
//   } catch (err) {}
// };

export const isFoldableScreen = _isFoldableScreen();

export { overlayManager, overlayProps, getProps };
