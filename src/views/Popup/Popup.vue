<template>
  <transition
    :name="transitionName"
    @after-enter="handleTransitionEnter"
    @after-leave="handleTransitionLeave"
  >
    <div
      :class="['popup-box', `popup-box_${position}`]"
      v-show="show"
      @click="handleClickPopupBody"
    >
      <slot v-if="showSlot"></slot>

      <div
        class="icon"
        v-if="closeable"
        :class="['close-icon', `close-icon_${closePosition}`]"
        @click="handleClickClose"
      ></div>
    </div>
  </transition>
</template>
<script>
import { overlayProps } from '../../Utils/overlay.vue';
// eslint-disable-next-line import/extensions
import { overlayManager } from '../../Utils/utils.js';
// eslint-disable-next-line import/extensions
import { on, off } from '../../Utils/event.js';

const popupProps = {
  // 过度动画
  transition: String,

  // 内容的位置
  position: {
    type: String,
    default: 'center',
  },

  // 指定挂载的容器
  containerSelector: {
    type: String,
    default: '',
  },

  // 按钮部分
  closeable: {
    type: Boolean,
    default: false,
  },
  closePosition: {
    type: String,
    default: 'right-top', // 默认右上角
  },
};
export default {
  name: 'Popup',
  data() {
    return {
      transitionName: 'popup-fade-center',
      hasShow: false, // 是否已经展示
      showSlot: true,
    };
  },
  props: {
    id: {
      type: String,
      default: '',
    },
    show: {
      type: Boolean,
      default: false,
    },
    ...overlayProps, // zIndex
    ...popupProps,
  },
  watch: {
    show(val) {
      if (val) {
        this.showPopup();
      } else {
        this.close();
      }
    },
    containerSelector() {
      this.mountToSpecifiedContainer();
    },
  },
  // watch: {
  //   showPopup: {
  //     immediate: true,
  //     handler(newval) {
  //       /*
  //        * 方法一：弹窗的时候直接禁止body滚动
  //        * 好处： 简单
  //        * 缺点： pc，android正常，ios失效
  //        * 原理：禁止滚动，滚动穿透依旧在
  //        */
  //       // const { body } = document;
  //       // if (newval) {
  //       //   body.classList.add('hiddenDocument');
  //       // } else {
  //       //   body.classList.remove('hiddenDocument');
  //       // }
  //       /* ******* 分割线 ******** */
  //       /**
  //        * 方法二： 给body设置fixed定位
  //        * 好处： 简单，兼容性没问题（pc, android, ios）都可
  //        * 缺点： 用户体验不好
  //        *      （1）弹窗后滚动的页面立即弹回顶部
  //        *      （2）若内容宽度不够100%，则会靠右侧
  //        */
  //       // const { body } = document;
  //       // if (newval) {
  //       //   body.classList.add('setFix');
  //       // } else {
  //       //   body.classList.remove('setFix');
  //       // }
  //     },
  //   },
  // },
  created() {
    // eslint-disable-next-line no-unused-expressions
    this.transition
      ? (this.transitionName = this.transition)
      : (this.transitionName = `popup-slide-${this.position}`);
  },
  mounted() {
    if (this.show) {
      this.showPopup();
    }

    this.mountToSpecifiedContainer();
  },
  methods: {
    /**
     * 显示弹窗
     */
    showPopup() {
      this.hasShow = true;
      this.$emit('afterShowPopup');

      //* ********** 分隔符 ************ */
      // 获取当前pop的配置信息，然后渲染蒙层
      const config = {
        id: this.id,
        zIndex: this.zIndex ? this.zIndex : overlayManager.getZIndex(this.id),
      };

      this.renderOverlay(config);

      // 判断是否要禁止滚动穿透
      /**
       * 方法三: 利用touchmove来解决滚动穿透
       *  优点： 兼容性好，体验好，而且可以很好的支持横滑
       *  缺点： 代码逻辑有些多
       */
      if (this.lockScroll) {
        on(document, 'touchstart', this.touchStart);
        off(document, 'touchmove', this.touchMove);
      }

      // 设置内容区域的zIndex
      this.$el.style.zIndex = this.zIndex ? this.zIndex + 1 : overlayManager.getZIndex();
    },
    /**
     * 渲染蒙层(一个蒙层看蒙层渲染在哪里合适)
     */
    renderOverlay(config) {
      if (!this.show) {
        return;
      }

      overlayManager.openModal(this, config);
    },
    /**
     * 关闭弹层
     */
    close() {
      if (!this.hasShow) return;

      this.hasShow = false;

      // 一些在关闭之前处理的事情
      if (this.lockScroll) {
        off(document, 'touchstart', this.touchStart);
        off(document, 'touchmove', this.touchMove);
      }

      // 关闭蒙层，关闭弹层
      overlayManager.closeOverlay(this);
      this.$emit('close', false);
    },
    /**
     * 挂载到指定容器
     */
    mountToSpecifiedContainer() {
      const currElem = this.$el;
      const { containerSelector } = this;
      let containerElem = '';

      if (containerSelector) {
        containerElem = document.querySelector(containerSelector);

        if (containerElem && containerElem !== currElem.parentNode) {
          containerElem.appendChild(currElem);
        }
      }
    },
    /**
     * 动画进入后
     */
    handleTransitionEnter() {
      console.log('** test transition enter');
      this.$emit('after-enter');
    },
    /**
     * 关闭动画结束后
     */
    handleTransitionLeave() {
      console.log('** test transition leave');
      this.$emit('after-leave');
    },
    /**
     * 点击内容区域
     */
    handleClickPopupBody() {
      console.log('** test click body');
      this.$emit('click-content', this);
    },
    /**
     * 点击关闭按钮
     */
    handleClickClose() {
      console.log('** test click close');
      this.$emit('close', false);
    },
    touchStart(event) {
      this.resetTouchInfo();

      this.startX = event.touches[0].clientX;
      this.startY = event.touches[0].clientY;
    },
    touchMove(event) {
      const newX = event.touches[0].clientX;
      const newY = event.touches[0].clientY;

      this.deltaX = newX - this.startX;
      this.deltaY = newY - this.startY;

      const scrollDirection = Math.abs(this.deltaX) > Math.abs(this.deltaY) ? 'H' : 'V';
      const currScrollElem = this.getScroller(event.target);
      const { scrollHeight, clientHeight, scrollTop } = currScrollElem || {};

      if (
        (scrollTop <= 0 && this.deltaY > 0)
        || (scrollTop <= scrollHeight - clientHeight && this.deltaY < 0)
      ) {
        if (event.cancelable && scrollDirection === 'V') {
          event.preventDefault();
        }
      }
    },
    resetTouchInfo() {
      this.deltaX = 0;
      this.deltaY = 0;
      this.startX = 0;
      this.startY = 0;
    },
    getScroller(elem) {
      let scrollElem = elem;
      const scrollReg = /scroll|auto/i;

      while (scrollElem && scrollElem.tagName !== 'HTML' && scrollElem.nodeType === 1) {
        const { overflowY } = window.getComputedStyle(scrollElem);

        if (scrollReg.test(overflowY)) {
          return scrollElem;
        }

        scrollElem = scrollElem.parentNode;
      }

      return null;
    },
  },
};
</script>
<style lang="scss" scoped src="./popup.scss"></style>
<style>
/** 方法一： 直接禁止滑动 */
.hiddenDocument {
  overflow: hidden;
}

/** 方法二： 设置fixed定位 */
.setFix {
  position: fixed;
}
</style>
