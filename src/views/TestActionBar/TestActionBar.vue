<template>
  <div class="test-action-bar safe-area-bottom safe-padding-area">
    <div class="action-bar">
      <div class="action-left">
        <ActionIcon :actionTitle="'店铺'"/>
        <ActionIcon :actionTitle="'客服'"/>
        <ActionIcon :actionTitle="'购物车'"/>
      </div>
      <div class="action-right">
        <ActionButton />
      </div>
    </div>
  </div>
</template>
<script>
import ActionButton from './ActionButton.vue';
import ActionIcon from './ActionIcon.vue';

export default {
  components: { ActionIcon, ActionButton },
  name: 'TestActionBar',
  data() {
    return {

    };
  },
};
</script>
<style lang="scss" scoped>
.safe-area-bottom {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}

.test-action-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  box-sizing: border-box;
  background: lightyellow;
}

/* 安全边距媒体查询 */
.safe-padding-area {
    padding: 0 14Px; /* 默认值 */
}

.action-bar {
  display: flex;
  align-items: center;
  height: 54Px;
  background: lightgreen;

  .action-left {
    display: flex;
    align-items: center;
    background: lightblue;
  }

  .action-right {
    flex: 1;
    height: 44Px;
    margin-left: 14Px;
    background: lightpink;
  }
}

/* 屏幕宽度小于360px：安全边距12px */
@media (max-width: 359px) {
    .safe-padding-area {
        padding: 0 12Px;
    }
}

/* 屏幕宽度360px-414px：安全边距13px */
@media (min-width: 360px) and (max-width: 413px) {
    .safe-padding-area {
        padding: 0 13Px;
    }
}

/* 屏幕宽度414px-550px：安全边距14px */
@media (min-width: 414px) and (max-width: 549px) {
    .safe-padding-area {
        padding: 0 14Px;
    }
}

/* 屏幕宽度550px以上：安全边距20px */
@media (min-width: 550px) {
    .safe-padding-area {
        padding: 0 20Px;
    }

    .action-right {
      margin-left: 20Px;
    }
}
</style>
