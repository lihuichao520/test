<template>
  <!-- 侧边滚动条 -->
  <div :class="['slide-bar', showBar ? 'slide-bar_show' : '']">
    <div class="to-top"
      :data-letter="'topUp'"
      @click="handleClicktoTop"
      @touchstart.stop.prevent="toTopTouchstart"
      @touchmove.stop.prevent="toTopTouchmove"
      @touchend.stop.prevent="toTopTouchEnd">
      顶部
    </div>

    <!-- 字母列表 -->
    <div class="slide-list" ref="slideList">
      <div
        v-for="(item, index) in cityList"
        :class="['slide-item', getActiveClass(item)]"
        :key="index"
        :data-letter="item.letter"
        @touchstart.stop.prevent="cityTouchstart"
        @touchmove.stop.prevent="cityTouchmove"
        @touchend.stop.prevent="cityTouchend">
        <div class="slide-item__inner">
          {{ item.letter }}
          <div class="slide-item__icon" v-if="isSelected(item)"><span>{{ item.letter }}</span></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'SlideBar',
  data() {
    return {
      slideCityList: [],
      slideItemHeight: 0, // 字母标签的高度
      starY: 0, // 开始触摸的坐标
      startIndex: '',
      endY: 0,
      endIndex: '',
      isTouching: false, // 是否在触摸过程中
      touchSelectedIndex: '',
    };
  },
  props: {
    cityList: {
      type: Array,
      default: () => [],
    },
    selectedLetter: {
      type: String,
      default: '',
    },
    showBar: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    cityList: {
      handler(val) {
        if (val) {
          this.slideCityList = [...val];
          this.slideCityList.unshift({
            letter: '顶部',
          });
        }
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    getActiveClass(item) {
      if (this.isTouching) {
        return this.cityList && this.cityList.length > 0 && this.cityList[this.touchSelectedIndex] && this.cityList[this.touchSelectedIndex].letter === item.letter ? 'slide-item_active' : '';
      }

      return this.selectedLetter === item.letter ? 'slide-item_active' : '';
    },
    isSelected(item) {
      if (this.isTouching) {
        return !!(this.cityList && this.cityList.length > 0 && this.cityList[this.touchSelectedIndex] && this.cityList[this.touchSelectedIndex].letter === item.letter);
      }

      return !!(this.selectedLetter === item.letter);
    },
    handleClicktoTop() {
      this.$emit('upToTop');
    },
    toTopTouchstart() {
      this.$emit('upToTop');
    },
    toTopTouchmove(e) {
      const rectInfo = e.target.getBoundingClientRect();
      const pageY = e.changedTouches[0].pageY;
      const maxThred = rectInfo.y + rectInfo.height;

      if (pageY > maxThred) {
        const fstSlideItemElem = document.querySelector('.slide-list .slide-item');
        const fstSlideRect = fstSlideItemElem.getBoundingClientRect();
        this.slideItemHeight = fstSlideItemElem.offsetHeight;
        this.starY = fstSlideRect.y;
        this.startIndex = 0;

        this.scrollToMovingElem(pageY);
        console.log('=== test toTop moving', pageY, rectInfo);
      }
    },
    toTopTouchEnd() {
      this.isTouching = false;
    },
    // 触发scroll滚动事件
    scrollToElement(letter) {
      console.log('=== test scroll to letter', letter, this.touchSelectedIndex);
      this.$emit('toElement', letter);
    },
    getIndex(list, query) {
      return list.findIndex((val) => val && val.letter === query);
    },
    cityTouchstart(e) {
      this.isTouching = true;
      this.slideItemHeight = e.target.offsetHeight;
      const currLetter = e.target.outerText || e.target.getAttribute('data-letter');
      this.starY = e.changedTouches[0].pageY;
      this.startIndex = this.getIndex(this.cityList, currLetter);

      this.touchSelectedIndex = this.startIndex;
      this.scrollToElement(currLetter, this.cityList[this.touchSelectedIndex]);
    },
    // 触摸过程中，根据距离变化计算滚动到的位置
    cityTouchmove(e) {
      const pageY = e.changedTouches[0].pageY;
      const slideListElem = this.$refs.slideList;
      const listY = slideListElem ? slideListElem.getBoundingClientRect().y : 0;

      if (pageY < listY) {
        console.log('=== test 进入顶部区域');
        this.isTouching = false;
        this.$emit('upToTop');
      } else {
        this.scrollToMovingElem(pageY);
      }
    },
    cityTouchend() {
      this.isTouching = false;
    },
    scrollToMovingElem(pageY) {
      this.isTouching = true;
      this.endY = pageY;
      const distance = this.endY - this.starY;
      const gapIndex = Math.ceil(distance / this.slideItemHeight);

      this.endIndex = Math.min(
        Math.max(this.startIndex + gapIndex, 0),
        this.cityList.length - 1,
      );

      const currLetter = this.cityList[this.endIndex].letter;
      this.touchSelectedIndex = this.endIndex;
      this.scrollToElement(currLetter, this.cityList[this.touchSelectedIndex]);
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.slideItemHeight = document.querySelector('.slide-list .slide-item').offsetHeight;
    });
  },
};
</script>
<style lang="scss" scoped>
  // 侧边滚动条
  .slide-bar {
    position: fixed;
    right: 12*$px414To375;
    top: 322*$px414To375;
    width: 20*$px414To375;
    text-align: center;
    z-index: 2017;
    opacity: 0;

    .to-top {
      padding-bottom: 6*$px414To375;
      color: #737373;
      font-family: PingFang SC;
      font-weight: regular;
      font-size: 10*$px414To375;
      line-height: 10*$px414To375;
      letter-spacing: 0px;
      text-align: right;
    }

    .slide-list {
      padding: 11*$px414To375 0;
      border-radius: 20*$px414To375;
      background: #F8F8F7;
      box-sizing: border-box;
    }

    .slide-item {
      display: flex;
      justify-content: center;
      align-items: center;
      // margin: 5*$px414To375 0;

      &__inner {
        width: 14*$px414To375;
        height: 14*$px414To375;
        color: #606060;
        font-family: PingFang SC;
        font-size: 8*$px414To375;
        line-height: 14*$px414To375;
        letter-spacing: 0px;
        text-align: center;
        box-sizing: border-box;
      }

      &_active {
        .slide-item__inner {
          position: relative;
          color: #fff;
          background: #FF8200;
          border-radius: 14*$px414To375;
        }

        .slide-item__icon {
          position: absolute;
          top: 50%;
          left: -32*$px414To375;
          transform: translateY(-50%);
          display: flex;
          justify-content: flex-start;
          align-items: center;
          width: 30*$px414To375;
          height: 23.6*$px414To375;
          color: #333333;
          font-family: PingFangSC-Medium;
          font-size: 17*$px414To375;
          line-height: 24.27*$px414To375;
          letter-spacing: 0px;
          text-align: center;
          box-sizing: border-box;
          background: url(../../assets/blogGrass/city-select-bg.png) no-repeat;
          background-size: 100% 100%;

          span {
            padding-left: 6*$px414To375;
            text-align: left;
          }
        }
      }
    }
  }

  .slide-bar_show {
    opacity: 1;
  }

  /* 屏幕宽度550px以上：安全边距14px */
  @media (min-width: 550px) {
    .slide-bar {
      top: 38vh;
    }
  }
</style>
