<template>
  <transition name="popup-fade">
    <div
      @touchmove.stop="touchmove"
      :style="{ animationDuration: `${duration}s`, ...overlayStyle, zIndex }"
      v-show="value"
      class="popup-bg nut-mask"
      :class="overlayClass"
    ></div>
  </transition>
</template>
<script>
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
    default: () => {},
  },
  zIndex: {
    type: Number,
  },
};
export { overlayProps };
export default {
  name: 'nut-popup-overlay',
  props: overlayProps,

  methods: {
    touchmove(e) {
      if (this.lockScroll) {
        e.preventDefault();
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.popup-bg {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
}
</style>
