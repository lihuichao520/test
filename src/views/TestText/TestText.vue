<template>
  <div class="test-text">
    <div>test text</div>
    <div class="carrying__text">
      美国高洁丝产后卫生巾 4片产妇透气排恶露加长夜安裤安睡
    </div>

    <!-- 测试三角形箭头 -->
    <div class="test-arrow"></div>
  </div>
</template>
<script>
export default {
  name: 'TestText',
};
</script>
<style lang="scss" scoped>
.test-text {
  width: 217px;
  height: auto;
}

// 商品描述部分(超长截断遇到空格或者行高问题导致的截断)
.carrying__text {
  display: -webkit-box;
  margin: 12px 12px 0 13px;
  width: 192px;
  height: 56px;
  font-size: 27.2px; ///29px HYQiHei-EZS;
  font-family: HYQiHei-EZS;
  line-height: 29px;
  color: #636363;
  text-align: left;
  overflow: hidden;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-wrap: break-word;
  text-overflow: ellipsis;
}

// 利用旋转等方式绘制三角形
.test-arrow {
  width: 200px;
  height: 200px;
  border: solid green;
  border-width: 0 0 10px 10px;
  /* transform: skew(-10deg, -10deg); */
  transform: rotate(-45deg) skew(-10deg, -10deg);
}
</style>
