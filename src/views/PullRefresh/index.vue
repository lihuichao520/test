<template>
  <div class="test-pull-refresh">
    <pull-refresh
      class="pull-refresh-wrap"
      ref="pullRefreshWrap"
      v-model="refreshing"
      head-height="50"
      :success-text="loadedTxt"
      @refresh="onPullRefresh">
      <div class="test-content">哈哈哈哈哈哈</div>

      <div>底部</div>
    </pull-refresh>
    <!-- <van-pull-refresh
      class="pull-refresh-wrap"
      ref="pullRefreshWrap"
      v-model="refreshing"
      head-height="50"
      :success-text="loadedTxt"
      @refresh="onPullRefresh">
      <div class="test-content">哈哈哈哈哈哈</div>

      <div>底部</div>
    </van-pull-refresh> -->
  </div>
</template>
<script>
import PullRefresh from './PullRefresh.vue';

export default {
  data() {
    return {
      refreshing: false,
      isLoading: false,
      finished: false, // 是否已经加载完成，加载完不再触发load事件
      error: false,
      loadedTxt: '刷新成功',
    };
  },
  components: { PullRefresh },
  methods: {
    onPullRefresh() {
    },
  },
};
</script>
<style lang="scss" scoped>
.test-pull-refresh {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding-bottom: calc(90px + constant(safe-area-inset-bottom));
  padding-bottom: calc(90px + env(safe-area-inset-bottom));
  width: 100%;
  box-sizing: border-box;
  background: #F2F2F2;
}

.pull-refresh-wrap {
  width: 100%;
  height: calc(100vh - (90px + constant(safe-area-inset-bottom)));
  height: calc(100vh - (90px + env(safe-area-inset-bottom)));
  overflow-y: auto;
}

.test-content {
  height: 150vh;
}

</style>
