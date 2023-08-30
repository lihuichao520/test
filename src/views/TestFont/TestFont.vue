<template>
  <div class="test-font">
    <div class="_top_1w2qq_49">
      <div class="_title_1w2qq_89">秒杀价</div>
      <div class="_sales_1w2qq_94"><span>销量415</span></div>
      <div class="_limit_1w2qq_114"><span>限购44</span></div>
    </div>

    <div class="test-top">
      <div class="title">秒杀价</div>
      <div class="icon-group">
        <div class="icon-inner">
          <span class="sales">销量415</span>
          <span class="limit">限购44</span>
        </div>
      </div>
    </div>

    <!-- 测试横滑 -->
    <div class="test-scroll-y">
      <div class="test-wrapper">
        <div class="test-item" v-for="(item, index) in list" :key="index">哈哈哈哈</div>
      </div>
    </div>

    <div class="test-bg">
    </div>

    <upgrade-popup></upgrade-popup>
  </div>
</template>
<script>
import UpgradePopup from '../../components/UpgradePopup/UpgradePopup.vue';

export default {
  components: { UpgradePopup },
  name: 'TestFont',
  data() {
    return {
      list: [{}, {}, {}],
    };
  },
};
</script>
<style lang="scss" scoped>
._top_1w2qq_49,
.test-top {
  position: relative;
  top: 100px;
  left: 100px;
  display: flex;
  border: 1px solid red;
}

._title_1w2qq_89 {
  font-size: 12px;
  margin-right: 5px;
}

._sales_1w2qq_94 {
  position: relative;
  display: flex;
  align-items: center;

  span {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    white-space: nowrap;
    height: 28px;
    border-radius: 14px;
    padding: 0px 8px;
    background-color: rgba(0, 0, 0, 0.2);
    font-size: 18px;
    transform: scale(0.5);
    transform-origin: left;
  }
}

._limit_1w2qq_114 {
  display: flex;
  margin-left: 5px;
  align-items: center;

  span {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    white-space: nowrap;
    height: 28px;
    border-radius: 14px;
    padding: 0px 8px;
    background-color: rgba(0, 0, 0, 0.2);
    font-size: 18px;
    transform: scale(0.5);
    transform-origin: left;
  }
}

.test-top {
  .title {
    font-size: 12px;
    margin-right: 5px;
  }

  .icon-group {
    position: relative;
    display: flex;
    align-items: center;
  }

  .icon-inner {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    white-space: nowrap;
    height: 28px;
    font-size: 18px;
    transform: scale(0.5);
    transform-origin: left;

    span {
      margin-right: 5px;
      padding: 0px 8px;
      background-color: rgba(0, 0, 0, 0.2);
      border-radius: 14px;
    }
  }
}

.test-scroll-y {
  margin: 0 23px;
  box-sizing: border-box;

  .test-wrapper {
    width: 100%;
    font-size: 0;
    white-space: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
  }

  .test-item {
    display: inline-block;
    width: 200px;
    height: 200px;
    margin-right: 5px;
    background: red;
  }

  .test-item:first-child {
    margin-left: -5px; // 左移
  }
}

.test-bg {
  width: 270px;
  height: 111px;
  background: url(../../assets/upgrade-checked.png) no-repeat;
  background-size: 100% 100%;
}
</style>
