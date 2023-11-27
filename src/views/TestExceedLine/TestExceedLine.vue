<template>
  <div class="test" ref="test">
    好吃好吃好吃好吃吃好饭很好吃好吃好吃好吃好吃好吃好吃好吃好吃好吃好吃好吃
    <div class="test-text">放假诶个鸡骨<div class="angle" /></div>
    <div class="test-triangle" />
  </div>
</template>
<script>
import { isElementCollision } from '../../Utils/isExceedLine';

export default {
  name: 'TestExceedLine',
  mounted() {
    const elem = this.$refs.test && this.$refs.test;
    const isExceed3Line = isElementCollision(elem, 10, {
      fontSize: '30px',
    }, true);

    console.log('** test isexceed 2', isExceed3Line);
  },
  methods: {

  },
};
</script>
<style lang="scss" scoped>
.test {
  width: 40%;
  font-size: 30px;
  text-align: left;
}

.angle {
  position: fixed;
  display: block;
  width: 0;
  height: 0;
  border-color: transparent;
  border-style: solid;
  border-top-width: 0;
  border-bottom-color: #000;
  border-width: 5px;
}
.angle::after {
  position: absolute;
  display: block;
  width: 0;
  height: 0;
  border-color: transparent;
  border-style: solid;
  content: " ";
  border-width: 10px;
  top: 1px;
  margin-left: -10px;
  border-top-width: 0;
  border-bottom-color: #fff;
}

.test-triangle {
  width: 5px;
  height: 5px;
  border-top: 1px solid red;
  border-left: 1px solid red ;
  transform: rotate(45deg);
}
</style>
