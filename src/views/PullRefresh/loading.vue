<template>
  <div class="loading">
    <span class="loading-icon" /><span class="loading-text">{{ loadingText }}</span>
  </div>
</template>
<script>
export default {
  name: 'loading',
  props: {
    loadingText: {
      type: String,
      default: '加载中...',
    },
  },
};
</script>
<style lang="scss" scoped>
.loading {
  display: flex;
  justify-content: center;
  align-items: center;

  .loading-icon {
    display: inline-block;
    margin-right: 4px;
    width: 32px;
    height: 32px;
    background: red;
    border-radius: 16px;
  }

  .loading-text {
    color: #939393;
    font-family: "PingFang SC";
    font-weight: 400;
    font-size: 12px;
    line-height: 17px;
  }
}
</style>
