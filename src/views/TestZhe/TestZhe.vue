<template>
  <div class="test-zhe">
    <div class="input-list">
      <div class="input-item">
        jignyaowei: <input v-model="jingyaowei" type="number" />
      </div>
      <div class="input-item">
        fangliang: <input v-model="fangliang" type="number" />
      </div>
      <div class="input-item">
        zheshu: <input v-model="zheshu" type="number"/>
      </div>
      <div class="input-item">
        zhekuan: <input v-model="zhekuan" type="number"/>
      </div>
      <!-- // 自定义群们来计算褶深 -->
      <!-- <div class="input-item">
        qunmen : <input v-model="qunmen" type="number"/>
      </div> -->
      <!-- 自定义褶深计算群面 -->
      <div class="input-item">
        zheshen: <input v-model="zheshen" type="number"/>
      </div>
    </div>

    <div class="zhe-kuan">{{ zhekuan }} / {{ zheshen }}</div>
    <div class="finanl-yao-wei">{{ finalYaoWei }}</div>
    <div class="finanl-yao-wei">qunman:{{ qunmen }}</div>
    <div class="total-length">每片的用量: {{  totalLength }}</div>
    <div class="total-buliang">totalbuliang: {{ totalBuliang }}</div>
    <div class="scroll-list">
      <div class="preview">
        <div
          class="preview-qunmen"
          :style="{
            width: `${Number(qunmen) * 2}px`,
            borderRight: '1px solid red'
          }">
          {{ qunmen }}
        </div>
        <div class="preview-zhe" v-for="index in Number(zheshu * 2)" :key="index">
          <div
            v-if="index !== (Number(zheshu) + 1) && index > Number(zheshu)"
            class="zheshen-wrapper"
            :style="{
              width: `${Number(zheshen) * 2}px`,
              borderLeft: '1px solid blue'
            }">
          </div>
          <div class="zhekuan-wrapper" :style="{width: `${Number(zhekuan) * 2 * 2}px`}">
            {{ Number(zhekuan) * 2 }}
          </div>
          <div
            v-if="index !== Number(zheshu) && index <= Number(zheshu)"
            class="zheshen-wrapper"
            :style="{
              width: `${Number(zheshen) * 2}px`,
              borderRight: '1px solid blue'
            }">
          </div>
        </div>
        <div
          class="preview-qunmen"
          :style="{
            width: `${Number(qunmen) * 2}px`,
            borderLeft: '1px solid red'
          }">
          {{ qunmen }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'TestZhe',
  data() {
    return {
      // <!-- 自定义褶深计算群面 -->
      // qunmen: 0,
      zhekuan: 0,
      // <!-- 自定义褶深计算群面 -->
      zheshen: 0,
      jingyaowei: 0,
      fangliang: 0,
      zheshu: 0,
      fengfeng: 4, // 4或4的倍数, 缝份的预留尺寸
    };
  },
  computed: {
    finalYaoWei() {
      return Number(this.jingyaowei) + Number(this.fangliang);
    },
    // qunmen * 2 + zheshen * (zheshu - 1) * 4 === finalyaowei(自定义群们来计算褶深)
    // zheshen() {
    //   return (this.finalYaoWei - Number(this.qunmen) * 2) / ((Number(this.zheshu) - 1) * 4);
    // },

    // 由总的腰围和褶深计算出群们的宽度（一般在23-28之间）
    qunmen() {
      return (this.finalYaoWei - (this.zheshen * (this.zheshu - 1) * 4)) / 2;
    },
    totalLength() {
      // eslint-disable-next-line max-len
      return Number(this.qunmen) * 2 + (this.zhekuan * 2 * this.zheshu + this.zheshen * (this.zheshu - 1)) * 2;
    },
    totalBuliang() {
      return this.totalLength * 2 + this.fengfeng;
    },
  },
  methods: {
    computedFinalZhekuan() {
      console.log('==test qunmen zhekuan / zheshen', this.qunmen, this.zhekuan, this.zheshen);
    },
  },
};
</script>
<style lang="scss" scoped>
.input-list {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  .input-item {
    margin-top: 10px;
  }
}

.scroll-list {
  width: 100%;
  white-space: nowrap;
  overflow-x: auto;
  overflow-y: hidden;
}

.preview {
  display: inline-block;
  height: 100px;
  font-size: 0;
  vertical-align: top;

  &-qunmen {
    display: inline-block;
    height: 100px;
    font-size: 16px;
    line-height: 100px;
    vertical-align: top;
    background:#c0ecc0;
  }

  &-zhe {
    display: inline-block;
    height: 100px;
    font-size: 16px;
    line-height: 100px;
    vertical-align: top;
    background:#24a824;
    .zhekuan-wrapper {
      display: inline-block;
      height: 100px;
      vertical-align: top;
      border-right: 1px solid red;
    }

    .zheshen-wrapper {
      display: inline-block;
      height: 100px;
      vertical-align: top;
    }
  }
  &-zhe:nth-child(6) {
    .zhekuan-wrapper {
      border: 0px solid blue;
    }
  }

  &-zhe:nth-child(n+7) {
    background: yellow;
    .zhekuan-wrapper {
      display: inline-block;
      height: 100px;
      border-left: 1px solid red;
      border-right: 0px solid red;
    }
  }

  &-zhe:nth-child(7) {
    .zhekuan-wrapper {
      border: 0px solid blue;
    }
  }

}
</style>
