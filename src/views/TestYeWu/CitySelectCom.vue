<template>
  <div class="test-city-select">
      <city-select
        ref="citySelectContainer"
        :show-city-selector="showCitySelector"
        :hotCityList="hotCityList"
        :city-list="newCityList"
        @onSelectCity="onSelectCity"
        @animationFinish="hanldeAnimationFinish"
        @onClose="handleHideCitySelector">
      </city-select>

      <!-- 右侧滚动条 -->
      <SlideBar
        :show-bar="showSlideBar"
        :city-list="newCityList"
        @upToTop="handleClickToCityTop"
        @toElement="handleToCityLetter">
      </SlideBar>
  </div>
</template>
<script>
export default {
  data() {
    return {
      showCitySelector: false,

      // 城市选择
      showSlideBar: false,
      newCityList: [],
      hotCityList: [],
      curBannerIndex: 0,
    };
  },
  methods: {
    onSelectCity(item) {
      console.log('=== test current selectcity', item);
    },
    /**
     * 隐藏选择城市的弹窗
     */
    handleHideCitySelector() {
      this.showCitySelector = false;
      this.showSlideBar = false;
    },
    // 点击“顶部”，回到城市选择弹窗顶部
    handleClickToCityTop() {
      if (this.$refs.citySelectContainer) {
        this.$refs.citySelectContainer.upToTop();
      }
    },
    /**
     * 根据选择的字母定位到相应的字母模块
     */
    handleToCityLetter(letter, cityInfo) {
      if (this.$refs.citySelectContainer) {
        this.$refs.citySelectContainer.toSelectedCityLetter(letter, cityInfo);
      }
    },
    hanldeAnimationFinish() {
      this.showSlideBar = true;
    },
  },
};
</script>
