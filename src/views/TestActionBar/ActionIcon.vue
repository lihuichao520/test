<template>
  <div :class="[
    'action-icon',
    large ? 'action-icon_large' : '',
    needMarginRt ? 'action-icon-rt' : '']"
  >
    <img :src="imgSrc" />
    <span class="action-title">{{ actionTitle }}</span>
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: 'TestActionBar',
  data() {
    return {

    };
  },
  props: {
    imgSrc: {
      type: String,
      default: '',
    },
    actionTitle: {
      type: String,
      default: '',
    },
    large: {
      type: Boolean,
      default: false,
    },
    needMarginRt: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
<style lang="scss" scoped>
.action-icon {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: 40Px;
  height: 48Px;

  img {
    display: block;
    width: 28Px;
    height: 28Px;
  }

  .action-title {
    margin-top: 2Px;
    height: 18Px;
    color: #636363;
    font-family: 'PingFang SC';
    font-weight: 400;
    font-size: 13px;
    line-height: 18Px;
    letter-spacing: 0px;
    text-align: center;
  }
}

.action-icon_large {
  width: 54Px;
  height: 48Px;
}

.action-icon-rt {
  margin-right: 8Px;
}

/* 屏幕宽度小于414px: 距离右边距4px*/
@media (max-width: 413px) {
  .action-icon-rt {
    margin-right: 4Px;
  }
}

/* 屏幕宽度414px-550px：距离右边距4px */
@media (min-width: 414px) and (max-width: 549px) {
  .action-icon-rt {
    margin-right: 8Px;
  }
}

/* 屏幕宽度550px以上：安全边距20px */
@media (min-width: 550px) {
  .action-icon-rt {
    margin-right: 20Px;
  }
}
</style>
