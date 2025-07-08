<template>
  <div ref="actionButton"
    :class="[
    'action-button',
    `action-button_${type}`,
    disabled ? 'action-button_disabled' : '']"
    @click.stop="handleClick"
  >
    <div class="action-button__content">
      <span>{{ btnTxt }}</span>
    </div>
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: 'TestActionBar',
  data() {
    return {
      parentElem: null,
    };
  },
  props: {
    btnTxt: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'orange', // yellow
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    isFirst() {
      if (this.parentElem) {
        return this.$refs.actionButton && this.$refs.actionButton === this.parentElem.children[0];
      }

      return false;
    },
    isLast() {
      if (this.parentElem) {
        const children = this.parentElem.children;
        return this.$refs.actionButton && children.length > 0 ? this.$refs.actionButton === children[children.length - 1];
      }

      return false;
    },
  },
  methods: {
    handleClick() {
      this.$emit('onClick');
    },
  },
  mounted() {
    if (this.$refs.actionButton) {
      this.parentElem = this.$refs.actionButton.parentElement;
    }
  },
};
</script>
<style lang="scss" scoped>
</style>
