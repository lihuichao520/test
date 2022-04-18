<template>
  <div ref="menu-item" class="menu-item" @click="handleMenuItem">
    <span
      v-if="showArrow"
      :class="['menu-item__arrow', arrowUp && 'menu-item__arrow-up']"
    ></span>
    <span class="menu-item__text">{{ text }}</span>
  </div>
</template>
<script>
export default {
  name: 'MenuItem',
  props: {
    text: {
      type: String,
      default: () => {},
    },
    showArrow: {
      type: Boolean,
      default: false,
    },
    defaultArrowUp: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      arrowUp: false,
    };
  },
  watch: {
    defaultArrowUp: {
      handler(newVal) {
        this.arrowUp = newVal;
      },
      immediate: true,
    },
  },
  methods: {
    handleMenuItem() {
      this.arrowUp = !this.arrowUp;
      this.$refs['menu-item'].scrollIntoView();
      this.$emit('handleMenuItem', this.arrowUp);
    },
  },
};
</script>
<style lang="scss" scoped>
.menu-item {
  display: inline-block;
  font-size: 0;
  overflow: hidden;

  span {
    display: inline-block;
    font: 24px/28px a;
  }

  &__text {
    max-width: 80px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  &__arrow {
    float: right;
    margin: 12px 0 0 4px;
    border-width: 6px;
    border-style: solid;
    border-color: #06a43a transparent transparent transparent;
  }

  &__arrow-up {
    margin: 6px 0 0 4px; // 12 - border-width;
    border-color: transparent transparent yellowgreen transparent;
  }
}
</style>
