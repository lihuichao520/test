<template>
  <transition
    :name="transitionName"
    @after-enter="handleTransitionEnter"
    @after-leave="handleTransitionLeave"
  >
    <div
      :class="['popup-box', `popup-${position}`, { round }]"
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
      this.$$emit('after-enter');
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
  },
};
</script>
<style lang="scss" scoped>
</style>
