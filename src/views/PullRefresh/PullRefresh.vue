<template>
<div :class="['pull-refresh']" ref="pullRefreshRoot">
  <div
    :class="['pull-refresh__track']"
    :style="trackStyle"
    ref="pullRefreshTrack"
    @touchstart="onTouchStart"
    @touchend="onTouchEnd"
    @touchcancel="onTouchEnd"
  >
    <!-- 提示区域 -->
    <div :class="['pull-refresh__head']" :style="headStyle">
      <template v-if="status !== 'normal'">
        <slot v-if="status === 'loading'" name="loading">
          <loading :loadingText="loadingText"/>
        </slot>
        <template v-else>
          <slot v-if="status === 'loosing'" name="loosing">
            <div v-if="loosingText" :class="['pull-refresh__text']">
              <span class="loosing-icon" /><span>{{ loosingText }}</span>
            </div>
          </slot>

          <slot v-if="status === 'pulling'" name="pulling">
            <div v-if="pullingText" :class="['pull-refresh__text']">
              <span class="pulling-icon" /><span>{{ pullingText }}</span>
            </div>
          </slot>

          <slot v-if="status === 'success'" name="success">
            <div v-if="successText" :class="['pull-refresh__text']">
              <span class="success-icon" /><span>{{ successText }}</span>
            </div>
          </slot>
        </template>
      </template>
    </div>

    <!-- 内容区域 -->
    <slot></slot>
  </div>
</div>
</template>

<script>
import loading from './loading.vue';

const TAP_OFFSET = 5;
const DEFAULT_HEAD_HEIGHT = 50;
const isBrowser = typeof window !== 'undefined';

export default {
  components: { loading },
  name: 'PullRefresh',
  props: {
    disabled: Boolean, // 是否禁用下拉刷新
    value: Boolean, // 是否处于加载中状态
    headHeight: { // 顶部内容高度
      type: [Number, String],
      default: DEFAULT_HEAD_HEIGHT,
    },
    successText: {
      type: String,
      default: '',
    },
    pullingText: {
      type: String,
      default: '下拉刷新',
    },
    loosingText: {
      type: String,
      default: '释放更新',
    },
    loadingText: {
      type: String,
      default: '加载中...',
    },
    pullDistance: [Number, String], // 触发下拉刷新的距离
    successDuration: { // 刷新成功提示展示时长(ms)
      type: [Number, String],
      default: 500,
    },
    animationDuration: { // 动画时长
      type: [Number, String],
      default: 300,
    },
  },

  data() {
    return {
      state: {
        status: 'normal', // 'normal','loading','loosing','pulling','success';
        distance: 0,
        duration: 0,
      },
      reachTop: false,
      // touch: useTouch(),
      scrollParent: null,
      trackElement: null,

      startX: 0,
      startY: 0,
      deltaX: 0,
      deltaY: 0,
      offsetX: 0,
      offsetY: 0,
      direction: '', // '' | 'vertical' | 'horizontal'
      isTap: true,
    };
  },
  computed: {
    status() {
      return this.state.status;
    },
    headStyle() {
      return {
        height: `${this.headHeight}px`,
      };
    },
    trackStyle() {
      return {
        transitionDuration: `${this.state.duration}ms`,
        transform: this.state.distance
          ? `translate3d(0, ${this.state.distance}px, 0)`
          : '',
      };
    },
    isVertical() {
      return this.direction === 'vertical';
    },
    isHorizontal() {
      return this.direction === 'horizontal';
    },
  },
  watch: {
    value(newVal) {
      this.state.duration = Number(this.animationDuration);
      if (newVal) {
        this.setStatus(Number(this.headHeight), true);
      } else if (this.$slots.success || this.successText) {
        this.showSuccessTip();
      } else {
        this.setStatus(0);
      }
    },
  },

  mounted() {
    this.scrollParent = this.getScrollParent(this.$refs.pullRefreshRoot);
    this.trackElement = this.$refs.pullRefreshTrack;

    if (this.trackElement) {
      this.trackElement.addEventListener('touchmove', this.onTouchMove, {
        passive: false,
      });
    }
  },
  beforeDestroy() {
    if (this.trackElement) {
      this.trackElement.removeEventListener('touchmove', this.onTouchMove);
    }
  },
  methods: {
    getScrollTop(el) {
      const top = 'scrollTop' in el ? el.scrollTop : el.pageYOffset;

      // iOS scroll bounce cause minus scrollTop
      return Math.max(top, 0);
    },
    isTouchable() {
      return (
        this.status !== 'loading'
        && this.status !== 'success'
        && !this.disabled
      );
    },
    ease(distance) {
      const pullDistance = Number(this.pullDistance || this.headHeight);
      if (distance > pullDistance) {
        if (distance < pullDistance * 2) {
          // eslint-disable-next-line no-param-reassign
          distance = pullDistance + (distance - pullDistance) / 2;
        } else {
          // eslint-disable-next-line no-param-reassign
          distance = pullDistance * 1.5 + (distance - pullDistance * 2) / 4;
        }
      }
      return Math.round(distance);
    },
    setStatus(distance, isLoading) {
      const pullDistance = Number(this.pullDistance || this.headHeight);
      this.state.distance = distance;

      if (isLoading) {
        this.state.status = 'loading';
      } else if (distance === 0) {
        this.state.status = 'normal';
      } else if (distance < pullDistance) {
        this.state.status = 'pulling';
      } else {
        this.state.status = 'loosing';
      }
      console.log('=== 当前的状态', this.state.status);

      this.$emit('change', {
        status: this.state.status,
        distance,
      });
    },
    showSuccessTip() {
      this.state.status = 'success';
      setTimeout(() => {
        this.setStatus(0);
      }, Number(this.successDuration));
    },
    getDirection(x, y) {
      if (x > y) {
        return 'horizontal';
      }
      if (y > x) {
        return 'vertical';
      }
      return '';
    },
    reset() {
      this.deltaX = 0;
      this.deltaY = 0;
      this.offsetX = 0;
      this.offsetY = 0;
      this.direction = '';
      this.isTap = true;
    },
    start(event) {
      this.reset();
      this.startX = event.touches[0].clientX;
      this.startY = event.touches[0].clientY;
      console.log('==== test touch start x', this.startX, this.startY);
    },
    move(event) {
      const touch = event.touches[0];
      // safari back will set clientX to negative number
      this.deltaX = (touch.clientX < 0 ? 0 : touch.clientX) - this.startX;
      this.deltaY = touch.clientY - this.startY;
      this.offsetX = Math.abs(this.deltaX);
      this.offsetY = Math.abs(this.deltaY);

      // lock direction when distance is greater than a certain value
      const LOCK_DIRECTION_DISTANCE = 10;
      if (
        !this.direction
        || (this.offsetX < LOCK_DIRECTION_DISTANCE
          && this.offsetY < LOCK_DIRECTION_DISTANCE)
      ) {
        this.direction = this.getDirection(this.offsetX, this.offsetY);
      }

      if (
        this.isTap
        && (this.offsetX > TAP_OFFSET || this.offsetY > TAP_OFFSET)
      ) {
        this.isTap = false;
      }

      console.log('==== test touch move', this.deltaY, this.direction);
    },
    checkPosition(event) {
      this.reachTop = this.getScrollTop(this.scrollParent) === 0;
      if (this.reachTop) {
        this.state.duration = 0;
        this.start(event);
      }
    },
    onTouchStart(event) {
      if (this.isTouchable()) {
        this.checkPosition(event);
      }
    },
    onTouchMove(event) {
      if (this.isTouchable()) {
        if (!this.reachTop) {
          this.checkPosition(event);
        }

        this.move(event);

        console.log('=== test 滑动', this.deltaY);

        if (this.reachTop && this.deltaY >= 0 && this.isVertical) {
          event.preventDefault();
          this.setStatus(this.ease(this.deltaY));
        }
      }
    },
    onTouchEnd() {
      if (this.reachTop && this.deltaY >= 0 && this.isTouchable()) {
        this.state.duration = Number(this.animationDuration);
        if (this.status === 'loosing') {
          this.setStatus(Number(this.headHeight), true);
          this.$emit('input', true);
          this.$nextTick(() => {
            this.$emit('refresh');
          });
        } else {
          this.setStatus(0);
        }
      }
    },
    isElement(node) {
      return (
        node
        && node.nodeType === 1
        && node.tagName !== 'HTML'
        && node.tagName !== 'BODY'
      );
    },
    // 获取滚动父元素
    getScrollParent(el, root = isBrowser ? window : undefined) {
      let node = el;
      // 判断元素是否可滚动
      const overflowScrollReg = /scroll|auto|overlay/i;

      while (node && node !== root && this.isElement(node)) {
        const { overflowY } = window.getComputedStyle(node);
        if (overflowScrollReg.test(overflowY)) {
          return node;
        }
        node = node.parentNode;
      }

      return root;
    },
  },
};
</script>

<style lang="scss" scoped>
.pull-refresh {
  overflow: hidden;

  &__track {
    position: relative;
    height: 100%;
    transition-property: transform;
  }

  &__head {
    position: absolute;
    left: 0;
    width: 100%;
    height: 50px;
    overflow: hidden;
    color: #939393;
    font-size: 12px;
    line-height: 17px;
    text-align: center;
    transform: translateY(-100%);
  }
}

</style>
