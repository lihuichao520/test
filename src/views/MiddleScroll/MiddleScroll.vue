<template>
  <!-- H5页面头部吸顶，底部吸底，中间自适应滚动布局 -->
  <!-- 方案一: flex + colunm -->
  <!-- <div class="middle-scroll">
    <div class="middle-scroll__header"></div>
    <div class="middle-scroll__body">
      <ul>
        <li>1.这是内容，这是内容……</li>
        <li>2.这是内容，这是内容……</li>
        <li>3.这是内容，这是内容……</li>
        <li>4.这是内容，这是内容……</li>
        <li>5.这是内容，这是内容……</li>
        <li>6.这是内容，这是内容……</li>
        <li>7.这是内容，这是内容……</li>
        <li>8.这是内容，这是内容……</li>
        <li>9.这是内容，这是内容……</li>
      </ul>
    </div>
    <div class="middle-scroll__footer"></div>
  </div> -->

  <!-- 方案二： -->
  <div class="middle-scroll2">
    <div class="middle-scroll2__header"></div>
    <div class="middle-scroll2__body">
      <ul>
        <li>1.这是内容，这是内容……</li>
        <li>2.这是内容，这是内容……</li>
        <li>3.这是内容，这是内容……</li>
        <li>4.这是内容，这是内容……</li>
        <li>5.这是内容，这是内容……</li>
        <li>6.这是内容，这是内容……</li>
        <li>7.这是内容，这是内容……</li>
        <li>8.这是内容，这是内容……</li>
        <li>9.这是内容，这是内容……</li>
      </ul>
    </div>
    <div class="middle-scroll2__footer"></div>
  </div>
</template>
<script>
export default {
  name: 'MiddleScroll',
};
</script>
<style lang="scss" scoped src="./middle-scroll.scss"></style>
<style>
html,
body,
#app {
  width: 100%;
  height: 100%;
}

* {
  padding: 0;
  margin: 0;
}
</style>
