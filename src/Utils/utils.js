import Vue from 'vue';
import overlayComponent from './overlay.vue';

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
    if ((modalStack.length - 1) < 0) return null;

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
    const {
      id, zIndex, duration, overlayClass, overlayStyle,
    } = config;

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
      topStack.vm.$emit('click-overlay');
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
    default: '',
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

export {
  overlayManager,
  overlayProps,
  getProps,
};
