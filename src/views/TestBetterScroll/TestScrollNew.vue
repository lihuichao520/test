<template>
   <div class="test-better">
      <div class="mask" @click="onClose"></div>

      <div class="container" ref="container">
        <div class="content">
          <div class="item">
          </div>

          <div class="item">
          </div>
        </div>
      </div>
   </div>
</template>
<script>
// eslint-disable-next-line import/no-extraneous-dependencies
import BScroll from 'better-scroll';

export default {
  name: 'TestScrollNew',
  data() {
    return {
      scroll: null,
      show: false,
    };
  },
  props: {
    showCitySelector: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    showCitySelector: {
      handler(val) {
        this.show = val;
        console.log('== tes shoooooo', this.show);
        this.handleOpened();
      },
      immediate: true,
    },
  },
  methods: {
    onClose() {
      console.log('== test close');
      this.$emit('onClose');
    },
    handleOpened() {
      console.log('=== test 动画结束时');
      this.$nextTick(() => {
        this.scroll = new BScroll(this.$refs.container, {
          observeDOM: true,
          scrollY: true,
          click: true,
          probeType: 1,
        });

        console.log('==== test show after animated', this.show, this.scroll);
      });
    },
  },
  mounted() {
    console.log('===test mounted');
  },
};
</script>
<style lang="scss" scoped>

.test-better {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 2000;

  .mask {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.40);
    z-index: 2000;
  }
}
.container {
  position: absolute;
  bottom: 0;
  padding: 0 20px;
  width: 100%;
  height: 500px;
  box-sizing: border-box;
  background: yellow;
  overflow: hidden;
  z-index: 2001;
  animation: slideIn 300ms;

  .content {
    background: red;
    padding-bottom: 503px;
  }

  @keyframes slideIn {
    0% { height: 0; }
    100% { height: 500px; }
  }
}
</style>
