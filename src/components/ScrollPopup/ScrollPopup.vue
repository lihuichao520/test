<template>
  <div class="scroll-pop-up"></div>
</template>
<script>
export default {
  data() {
    return {
      lockScroll: null,
    };
  },
  methods: {
    LockScroll() {
      const lockedList = new Set();
      lock() {
        lockedList.add(this);
        // 省略其他逻辑
      }
      unlock() {
        lockedList.delete(this);
        if (lockedList.size <= 0) {
          this.destroy();
        }
      }
    },
    componentDidMount() {
      const opts = this.props.selector ? { selector: this.props.selector } : undefined;
      this.lockScroll = new LockScroll(opts);
      this.updateScrollFix();
    },
    updateScrollFix() {
      const { lock } = this.props;
      if (lock) {
        this.lockScroll.lock();
      } else {
        this.lockScroll.unlock();
      }
    },
    componentDidUpdate(prevProps: ScrollFixProps) {
      if (prevProps.lock !== this.props.lock) {
        this.updateScrollFix();
      }
    },
    componentWillUnmount() {
      console.log('scrollfix component will unmount!');
      this.lockScroll.unlock();
    },
  },
};
</script>
