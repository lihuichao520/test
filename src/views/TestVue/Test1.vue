<template>
  <div class="test1" @click="handleClick">{{ count }}</div>
</template>
<script>
import { debounce } from 'lodash';

export default {
  data() {
    return {
      count: 0,
    };
  },
  props: {
    testName: {
      type: String,
      default: 'a',
    },
  },
  methods: {
    handleClick: debounce(function () {
      this.count += 1;
      console.log('==test 500毫秒一次', this.testName, this.count);
      const time = new Date().toLocaleTimeString();
      console.log(`${this.testName}执行点击操作: ${time}`);
    }, 2000),
  },
};
</script>
