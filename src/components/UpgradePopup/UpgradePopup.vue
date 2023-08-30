<template>
  <div class="upgrade-popup" @touchmove.stop>
    <div class="body">
      <div class="content">
        <div class="icon"></div>
        <!-- <div class="title"></div> -->
        <div class="subtitle">{{ subtitle || 'jjjj'}}</div>
        <div :class="['lv-img', `lv-img${level}`]"></div>
        <div class="tip">持续升级可得更多奖励哦</div>
        <!-- <div class="btn">
          <div class="btn-detail" @click="handleDetail">查看详情</div>
        </div> -->
      </div>

      <div class="close" @click.stop="onClose"></div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'UpgradePopup',
  props: {
    level: {
      type: Number,
      default: 0,
    },
    levelTip: {
      type: String,
      default: '',
    },
    pmMsgId: {
      type: String,
      default: '',
    },
    uid: {
      type: [Number, String],
    },
  },
  computed: {
    subtitle() {
      // 升级为xx颜究员（Lv5）
      const lvToNick = {
        // 0: '颜选新人',
        1: '萌新颜究员',
        2: '白金颜究员',
        3: '黄金颜究员',
        4: '铂金颜究员',
        5: '资深颜究员',
      };
      // const tipStrArr = this.levelTip && this.levelTip.split('，');
      // let tipStr = tipStrArr.length > 1 ? tipStrArr[1] : '';
      // tipStr = tipStr.replace(/（[^)]*）/g, '');
      // tipStr = tipStr.replace(/!/g, '');
      // tipStr = tipStr ? tipStr.trim() : '';

      // return `${tipStr}LV${this.level}`;

      return `升级为 ${lvToNick[this.level] || ''}Lv${this.level}`;
    },
  },
  mounted() {
  },
  methods: {
    onClose() {
      this.$emit('onClose');
    },
  },
};
</script>
<style lang="scss" scoped src="./UpgradePopup.scss"></style>
