<template>
  <div class="select-card">
    <!-- 顶部吸顶部分 -->
    <div class="select-card__head">
      <div class="head-left">左侧</div>
      <div class="head-right" @click="handleClick">{{ headRightTxt }}</div>
    </div>

    <!-- 中间主体区域 -->
    <van-checkbox-group v-model="result" ref="checkboxGroup">
      <div
        class="select-card__card"
        v-for="(option, index) in options"
        :key="index"
      >
        <div class="select-card__check" v-show="showEditState">
          <van-checkbox :name="option.id" checked-color="#ee0a24">
          </van-checkbox>
        </div>
        <div class="select-card__wrap">
          <div class="select-card__top">
            <div class="select-card__img">
              <img src="" />
            </div>

            <div class="select-card__info">
              <div class="select-card__title">测试测试title</div>
              <div class="select-card__base">baseinfo</div>
            </div>
          </div>

          <!-- 按钮区域 -->
          <div class="select-card__btns"></div>
        </div>
      </div>
    </van-checkbox-group>

    <!-- 底部吸底部分 -->
    <div v-if="showEditState" class="select-card__footer">
      <div class="select-card__btn">
        <div class="select-card__all" @click="checkAll">全选</div>
        <div class="select-card__del-btn" @click="deleteSelected">删除</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  name: 'SelectCard',
  data() {
    return {
      headRightTxt: '批量删除',
      showEditState: false,
      selectAllSelected: false,
      result: [], // 存放选中的结果
      options: [
        {
          name: 'test1',
          id: 1,
        },
        {
          name: 'test2',
          id: 2,
        },
        {
          name: 'test3',
          id: 3,
        },
      ],
    };
  },
  mounted() {},
  methods: {
    handleClick() {
      this.showEditState = !this.showEditState;
      this.headRightTxt = this.showEditState ? '完成' : '批量删除';
    },
    checkAll() {
      this.selectAllSelected = !this.selectAllSelected;
      this.$refs.checkboxGroup.toggleAll(this.selectAllSelected);
    },
    deleteSelected() {
      console.log('删除选中的', this.result);
    },
  },
};
</script>
<style lang="scss" scoped src="./select-card.scss"></style>
