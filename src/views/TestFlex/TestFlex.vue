<template>
  <div class="test-flex">
    <!-- 测试justify-content: space-evenly的兼容性问题 -->
    <div class="test-flex__wrap">
      <div class="test-flex__tab" v-for="(tab, index) in tabs" :key="index">
        {{ tab.name }}
      </div>
    </div>

    <!-- justify-content: space-evenly的替代方案 -->
    <!-- 方案1: 利用flex-grow实现每个子元素占用相同空间 -->
    <div class="test-flex__wrap2">
      <div class="test-flex__tab" v-for="(tab, index) in tabs" :key="index">
        {{ tab.name }}
      </div>
    </div>

    <!-- justify-content: space-evenly的替代方案 -->
    <!-- 方案2: 利用 space-between, 从效果上来看，方案2与justify-content: space-evenly最为相似(存在换行的时候有所差异)-->
    <div class="test-flex__wrap3">
      <div class="test-flex__tab" v-for="(tab, index) in tabs" :key="index">
        {{ tab.name }}
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'TestFlex',
  data() {
    return {
      tabs: [
        {
          name: 'tab1',
        },
        {
          name: 'tab2',
        },
        {
          name: 'tab3',
        },
        // {
        //   name: 'tab4',
        // },
        // {
        //   name: 'tab5',
        // },
        // {
        //   name: 'tab6',
        // },
        // {
        //   name: 'tab3',
        // },
        // {
        //   name: 'tab3',
        // },
        // {
        //   name: 'tab3',
        // },
        // {
        //   name: 'tab3',
        // },
        // {
        //   name: 'tab3',
        // },
        // {
        //   name: 'tabN',
        // },
      ],
    };
  },
};
</script>
<style lang="scss" scoped src="./test-flex.scss"></style>
