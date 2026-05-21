<template>
  <div class="test1" @click="debouncedClick">{{ count }}</div>
</template>
<script>
import { debounce } from 'lodash';

export default {
  data() {
    return {
      count: 1,
      debouncedClick: null,
    };
  },
  props: {
    testName: {
      type: String,
      default: 'a',
    },
  },
  methods: {
    handleClick() {
      this.count += 1;
      console.log('==test 500毫秒一次', this.testName, this.count);
    },
  },
  created() {
    // 每个实例都有了自己的预置防抖的处理函数
    // @ts-ignore
    this.debouncedClick = debounce(this.handleClick, 2000);
  },
  beforeDestroy() {
    // @ts-ignore
    this.debouncedClick.cancel();
  },
};
</script>
