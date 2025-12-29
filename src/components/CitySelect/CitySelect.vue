<template>
  <div class="city-select-pop-up">
    <div class="mask" @click="onClose"></div>

    <div class="city-select-wrapper" @animationend="animationFinish" @webkitAnimationEnd="animationFinish">
      <div class="city-select-title hairline-border hairline-border-bottom">
        <div class="title">城市选择</div>
        <div class="close" @click="onClose"></div>
      </div>

      <!-- 内容区域 -->
      <div class="city-select-container" ref="citySelectContainer">
        <div class="city-select-content" ref="citySelectContent">
          <div class="hot-city">
            <div class="hot-city__title">热门城市</div>

            <div class="hot-city__list">
              <span
                class="hot-city__item"
                v-for="(hotCity, index) in hotCityList"
                :key="index"
                @click="handleClickCity(hotCity)">
                {{ hotCity.name }}
              </span>
            </div>
          </div>

          <div class="city-sort-box">
            <div class="city-list" v-for="(cityInfo, index) in cityList" :key="index">
              <div class="sort-letter" :ref="cityInfo.letter">{{ cityInfo.letter }}</div>

              <div class="sort-item">
                <div
                  class="sort-name"
                  v-for="(item, itemIndex) in cityInfo.city_list"
                  :key="itemIndex"
                  @click="handleClickCity(item)">
                  {{ item.name }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import BScroll from 'better-scroll';

export default {
  name: 'CitySelect',
  data() {
    return {
      scroll: null,
    };
  },
  props: {
    cityList: {
      type: Array,
      default: () => [],
    },
    hotCityList: {
      type: Array,
      default: () => [],
    },
    showCitySelector: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    showCitySelector(val) {
      if (val) {
        this.initScroll();
      }
    },
    cityList: {
      handler() {
        this.initScroll();
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    initScroll() {
      if (this.$refs.citySelectContainer) {
        setTimeout(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.citySelectContainer, {
              scrollY: true,
              click: true,
              probeType: 1,
            });

            console.log('=== test this.scroll');
          } else {
            console.log('=== test update', this.scroll);
            this.scroll.refresh();
          }
        }, 600);
      }
    },
    handleClickCity(cityInfo) {
      this.$emit('onSelectCity', cityInfo);
    },
    upToTop() {
      const citySelectElem = this.$refs.citySelectContainer && this.$refs.citySelectContainer ? this.$refs.citySelectContainer : null;

      console.log('=== test city top', citySelectElem, this.scroll);

      if (citySelectElem && this.scroll) {
        this.scroll.scrollToElement(citySelectElem);
      }
    },
    toSelectedCityLetter(letter, cityInfo) {
      if (!letter) return;

      const letterElem = this.$refs[letter] ? this.$refs[letter][0] : null;

      if (letterElem) {
        this.scroll.scrollToElement(letterElem);
      }

      console.log('==== to selected city letter', letter, cityInfo);
    },
    onClose() {
      this.$emit('onClose');
    },
    animationFinish() {
      this.$emit('animationFinish');
    },
  },
  mounted() {
    this.initScroll();
  },
  beforeDestroy() {
    this.scroll && this.scroll.destroy();
  },
};
</script>
<style lang="scss" scoped src="./citySelect.scss"></style>
<style lang="scss">
.city-select-box.van-popup {
  -webkit-overflow-scrolling: auto;
}
</style>
