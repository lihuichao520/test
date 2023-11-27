<template>
  <div class="test-popup">
    <div class="inner-document-content">
      猜猜我是谁？ 农场里谁在吵?
      <div class="center-padding"></div>
      <div class="click-show-btn" @click="handleClickShow">点击展示</div>
    </div>

    <Popup
      :show="showPopup"
      :class="['popup']"
      @afterShowPopup="handlePopupShowed"
      @close="handlePopupClose"
      @click="handleClickContent"
    >
      哈哈哈，我是内容呀
    </Popup>
  </div>
</template>
<script>
import Popup from './Popup.vue';

export default {
  name: 'TestPopup',
  components: {
    Popup,
  },
  data() {
    return {
      showPopup: false,
    };
  },
  mounted() {
    this.showPopup = true;
  },
  // watch: {
  //   showPopup: {
  //     immediate: true,
  //     handler(newval) {
  //       /*
  //        * 方法一：弹窗的时候直接禁止body滚动
  //        * 好处： 简单
  //        * 缺点： pc，android正常，ios失效
  //        * 原理：禁止滚动，滚动穿透依旧在
  //        */
  //       // const { body } = document;
  //       // if (newval) {
  //       //   body.classList.add('hiddenDocument');
  //       // } else {
  //       //   body.classList.remove('hiddenDocument');
  //       // }

  //       /* ******* 分割线 ******** */
  //       /**
  //        * 方法二： 给body设置fixed定位
  //        * 好处： 简单，兼容性没问题（pc, android, ios）都可
  //        * 缺点： 用户体验不好
  //        *      （1）弹窗后滚动的页面立即弹回顶部
  //        *      （2）若内容宽度不够100%，则会靠右侧
  //        */
  //       const { body } = document;
  //       if (newval) {
  //         body.classList.add('setFix');
  //       } else {
  //         body.classList.remove('setFix');
  //       }
  //     },
  //   },
  // },
  methods: {
    handleClickShow() {
      this.showPopup = true;
    },
    handlePopupShowed() {
      console.log('** pop up showed');
    },
    handlePopupClose(show) {
      this.showPopup = show;
      console.log('** pop up close');
    },
    handleClickContent() {
      console.log('** click content');
    },
  },
};
</script>
<style lang="scss" scoped>
.test-popup {
  width: 100%;
  height: 100%;
  overflow-y: auto;
}
.inner-document-content {
  height: 1094px;
}

.center-padding {
  height: 200px;
}

.popup {
  width: 100px;
  height: 100px;
  background: yellow;
}
</style>
