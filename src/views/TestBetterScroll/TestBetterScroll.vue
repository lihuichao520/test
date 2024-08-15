<template>
  <div class="test">
    <div class="btn" @click="handleShow">点击展示弹窗</div>
    <TestScroll
      v-if="showCitySelector"
      @onClose="handleClose"
      :showCitySelector="showCitySelector">
    </TestScroll>
  </div>

</template>
<script>
import TestScroll from './TestScrollNew.vue';

export default {
  components: { TestScroll },
  name: 'TestBetterScroll',
  data() {
    return {
      showCitySelector: false,
    };
  },
  methods: {
    handleShow() {
      this.showCitySelector = true;
      console.log('== test show city', this.showCitySelector);
    },
    handleClose() {
      this.showCitySelector = false;
      console.log('== close', this.showCitySelector);
    },
  },
};
</script>
<style lang="scss" scoped>
.container {
  position: relative;
  padding: 0 20px;
  width: 100%;
  height: 500px;
  box-sizing: border-box;
  background: yellow;
  overflow: hidden;

  .content {
    background: red;
    padding-bottom: 503px;
  }
}
</style>
