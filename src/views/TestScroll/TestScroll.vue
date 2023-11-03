<template>
  <div class="test-sroll">
    <div class="outer-content">外部滚动</div>

    <div class="inner-scroll">
      <div class="inner-content">内部滚动</div>
    </div>

    <div class="outer-content-footer">外部滚动footer</div>

    <div class="pop-up">
      <div class="mask" @touchmove.prevent @touchmove.stop></div>

      <!-- <div class="pop-up__body" @touchmove.prevent>
        <div class="pop-up__content">弹窗内容啊</div>
      </div> -->

      <!-- 当弹窗内部的区域存在可滚动的区域时 -->
      <div class="pop-up__body">
        <div class="pop-up__text" @touchmove.prevent @touchmove.stop>
          弹窗不可滚动区域啊
        </div>
        <div
          class="pop-up__scroll"
          ref="popupScroll"
          @touchstart="handleTouchStart"
          @touchmove="handleTouchMove"
        >
          <div class="pop-up__list">弹窗可滚动区域啊啊</div>
        </div>
        <!-- 横滑区域 -->
        <div
          class="pop-up__scrollX"
          ref="popupScrollX"
          @touchstart="handleTouchStartX"
          @touchmove="handleTouchMoveX"
        >
          <div class="pop-up__listX">弹窗可滚动区域啊啊</div>
        </div>
        <div class="pou-up__footer" @touchmove.prevent @touchmove.stop>
          弹窗底部不可滚动区域啊
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'TestScroll',
  data() {
    return {
      startX: 0,
      startY: 0,
      targetX: 0,
      targetY: 0,

      oldX: 0,
      oldY: 0,
      newX: 0,
      newY: 0,

      scrollHeigth: 0, // 滚动高度
      clientHeigth: 0, // 容器高度
      scrollHeigthX: 0, // 滚动高度
      clientHeigthX: 0, // 容器高度
    };
  },
  mounted() {
    const scrollElem = this.$refs.popupScroll;
    const scrollElemX = this.$refs.popupScrollX;

    this.scrollHeigth = (scrollElem && scrollElem.scrollHeight) || 0;
    this.clientHeigth = (scrollElem && scrollElem.clientHeight) || 0;
    this.scrollHeigthX = (scrollElemX && scrollElemX.scrollHeight) || 0;
    this.clientHeigthX = (scrollElemX && scrollElemX.clientHeight) || 0;
  },
  methods: {
    handleTouchStart(e) {
      this.startX = e.targetTouches[0].clientX;
      this.startY = e.targetTouches[0].clientY;
    },
    handleTouchMove(e) {
      this.targetX = e.targetTouches[0].clientX;
      this.targetY = e.targetTouches[0].clientY;

      const scrollElem = this.$refs.popupScroll;
      const scrollTop = (scrollElem && scrollElem.scrollTop) || 0;

      console.log('*** test move xy', this.targetX, this.startY);

      // 判断是否超出可滚动的范围，若超出，则禁止滑动
      if (
        scrollTop >= this.scrollHeigth - this.clientHeigth
        && this.startY - this.targetY > 0
        && e.cancelable
      ) {
        console.log('上滑到底部');
        e.preventDefault();
      } else if (scrollTop <= 0 && this.targetY - this.startY > 0 && e.cancelable) {
        console.log('下拉到顶部');
        e.preventDefault();
      }
    },

    /**
     * 横滑部分
     */
    handleTouchStartX(e) {
      this.oldX = e.targetTouches[0].clientX;
      this.oldY = e.targetTouches[0].clientY;
    },
    handleTouchMoveX(e) {
      this.newX = e.targetTouches[0].clientX;
      this.newY = e.targetTouches[0].clientY;

      const scrollElemX = this.$refs.popupScrollX;
      const scrollTop = (scrollElemX && scrollElemX.scrollTop) || 0;

      const gapX = this.newX - this.oldX;
      const gapY = this.newY - this.oldY;

      // 判断是否超出可滚动的范围 和是否为竖滑，若超出，则禁止滑动
      if (
        scrollTop >= this.scrollHeigthX - this.clientHeigthX
        && gapY < 0
        && e.cancelable
        && Math.abs(gapY) > Math.abs(gapX)
      ) {
        console.log('上滑到底部');
        e.preventDefault();
      } else if (scrollTop <= 0 && gapY > 0 && e.cancelable && Math.abs(gapY) > Math.abs(gapX)) {
        console.log('下拉到顶部');
        e.preventDefault();
      }
    },
  },
};
</script>
<style lang="scss">
html,
body,
#app {
  width: 100%;
  height: 100%;
  background: lightgoldenrodyellow;
}

.test-scroll {
  position: relative;
  width: 100%;
  height: 100%;
  overflow-y: auto;
}

.outer-content,
.outer-content-footer {
  width: 100%;
  height: 300px;
}

.inner-scroll {
  width: 100%;
  height: 300px;
  overflow-y: scroll;

  .inner-content {
    width: 100%;
    height: 600px;
    background: lightseagreen;
  }
}

// 弹窗
.pop-up {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 100;

  .mask {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: black;
    opacity: 0.4;
  }

  .pop-up__body {
    position: relative;
    left: 50%;
    top: 50%;
    width: 200px;
    height: 300px;
    background: #fff;
    transform: translate(-50%, -50%);
    z-index: 101;
  }

  // 当弹窗内部的区域存在可滚动的区域时
  .pop-up__scroll {
    width: 100%;
    height: 200px;
    overflow-x: hidden;
    overflow-y: auto;

    .pop-up__list {
      width: 100%;
      height: 400px;
      background: lightgreen;
    }
  }

  // 当弹窗内部的区域存在可滚动的区域时
  .pop-up__scrollX {
    width: 100%;
    height: 100px;
    white-space: nowrap;
    overflow-x: auto;
    overflow-y: hidden;

    .pop-up__listX {
      width: 200%;
      height: 100%;
      background: lightcoral;
    }
  }
}
</style>
