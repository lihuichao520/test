<template>
  <div class="menu-item">
    <span class="menu-item__text">{{ text }}</span
    ><span v-if="showArrow" class="menu-item__arrow"></span>
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
  },
};
</script>
<style lang="scss" scoped>
</style>
