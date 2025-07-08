<template>
  <div ref="actionButton"
    :class="[
    'action-button',
    `action-button_${type}`,
    disabled ? 'action-button_disabled' : '',
    isFirst ? 'action-button_fst' : '',
    isLast ? 'action-button_last' : '',
    large ? 'action-button_large' : ''
    ]"
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
    large: {
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
        const { children } = this.parentElem;
        return children.length > 0 && this.$refs.actionButton === children[children.length - 1];
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
.action-button {
  width: 100%;
  height: 44Px;

  background: orange;
}

.action-button_orange {
  background: linear-gradient(270deg, #FD481A 1.88%, #FF6C23 100%);
}

.action-button_yellow {
  background: linear-gradient(90deg, #FFA033 6.45%, #FF8C00 88.88%);
}

.action-button_fst {
  border-top-left-radius: 6Px;
  border-bottom-left-radius: 6Px;
}

.action-button_last {
  border-top-right-radius: 6Px;
  border-bottom-right-radius: 6Px;
}

.action-button__content {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;

  span {
    font-family: 'PingFang SC';
    font-weight: 500;
    font-style: Medium;
    font-size: 16Px;
    line-height: 18Px;
    letter-spacing: 0px;
    text-align: center;
    color: #FFF;
  }
}

.action-button_large {
  .action-button__content {
    span {
      font-size: 17Px;
      line-height: 24PX;
    }
  }
}
</style>
