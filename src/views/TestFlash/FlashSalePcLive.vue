<template>
  <div class="flash-sale-creation">
    <div class="mask" @click="handleClickClose"></div>

    <div class="main-container">
      <!-- <flash-sale
        v-show="currPopup === 'flashSale'"
        :targetFlashSale="targetFlashSale"
        :selectedTplInfo="skuTplSelectedToUse"
        :protocol="protocol"
        :liveId="live_id"
        :uid="uid"
        :screenShot="screenShot"
        :sellerUid="sellerUid"
        :targetCustomerNick="buyerNickName"
        :platform="platform"
        @closeFlashSale="handleClickClose"
        @useSkuTpl="handleUseSkuTpl"
        @getScreenShot="handleGetScreenShot"/>
      <sku-tpl
        v-if="currPopup === 'skuTpl'"
        :skuTplList="skuTplList"
        @close="handleClickClose"
        @editSkuTpl="handleEditSkuTpl"
        @useSkuTpl="handleUseSelectedSkuTpl"
        @createNewSkuTpl="handleCreateNewSkuTpl"/>
      <sku-tpl-form
        v-if="currPopup === 'skuTplCreation'"
        :skuTplId="currSkuTplInfo.id"
        :source="skuTplFormState"
        :initSkuNameList="currSkuNameList"
        @updateSkuList="handleUpdateSkuNameList"
        @deleteSkuTpl="handleDeleteSkuTpl"
        @close="handleClickClose" /> -->
    </div>
  </div>
</template>
<script>
export default {
  components: {
  },
  data() {
    return {
      currPopup: 'flashSale', // 当前要展示的弹窗
      targetFlashSale: false, // 是否为定向闪购
      skuTplList: [], // 模板列表
      currSkuTplInfo: {}, // 当前sku模板的信息{id: '', skuNameList}
      skuTplFormState: 'create', // sku模板的状态：创建态（create），编辑态（edit）
      skuTplSelectedToUse: {}, // 当前要使用的多规格模板的信息{id: '', skuNameList}
      showDeleteConfirm: false,
      needDeleteSkuTplId: '',
      live_id: '', // 直播间ID
      uid: '', // 买家uid,定向必填
      buyerNickName: '', // 买家昵称，定向必填
      screenShot: '',
      sellerUid: '', // 主播侧主播uid
      platform: '', // ios/android
    };
  },
  computed: {
    // 当前的规格名称列表
    currSkuNameList() {
      return (this.currSkuTplInfo || {}).skuNameList || [];
    },
  },
  // wbox: {
  //   onLoad(params) {
  //     this.route = { ...params };
  //     let query = this.route.query || {};

  //     const {
  //       protocol,
  //       live_id,
  //       uid,
  //       flash_type,
  //       nick_name,
  //     } = query;
  //     this.protocol = protocol || 'https';
  //     this.live_id = live_id || '';
  //     this.uid = uid || '';
  //     this.buyerNickName = nick_name || ''; //定向闪购用户的昵称
  //     this.targetFlashSale = Number(flash_type) === 0;

  //     wbx.wbGetWeiboUser({
  //       success: (res) => {
  //         this.sellerUid = res.uid
  //         this.init();
  //       },
  //       failure: (res) => {
  //         console.log('wbGetWeiboUser failure>> ', res);
  //         this.init();
  //       }
  //     });

  //     const { platform = '' } = wbx.getSystemInfoSync();
  //     this.platform = (platform && platform.toLowerCase()) || '';
  //   },
  //   onCustomEvent(options) {
  //     switch(options.type) {
  //       case 'wbl_get_screen_shot_result': 
  //         const args = options && options.args || '';
  //         this.screenShot = args;
  //         break;
  //       default:
  //         return;
  //     }
  //   },
  // },
  methods: {
    init() {
      this.currPopup = 'flashSale';
      this.screenShot = '';
    },
    handleClickClose() {
      const { currPopup } = this;

      switch (currPopup) {
        case 'skuTpl':
          this.currPopup = 'flashSale';

          return;
        case 'flashSale':
          // 返回直播间
          this.screenShot = '';
          return;
        case 'skuTplCreation':
          this.currPopup = 'skuTpl';

        // eslint-disable-next-line no-fallthrough
        default:
      }
    },
    handleUseSkuTpl() {
      this.getSkuTpl();
    },
    handleGetScreenShot() {
      console.log('==test');
      this.getGoodsShotFormCustom();
    },
    getGoodsShotFormCustom() {
      // eslint-disable-next-line no-underscore-dangle
    },
    /**
     * 编辑sku模板
     * @param { Object } skuTplInfo 当前需要编辑的sku模板信息
     */
    handleEditSkuTpl(skuTplInfo) {
      this.currSkuTplInfo = skuTplInfo;
      this.skuTplFormState = 'edit';
      this.currPopup = 'skuTplCreation';
    },
    /**
     * 使用选中的模板
     */
    handleUseSelectedSkuTpl(skuTplInfo) {
      this.skuTplSelectedToUse = skuTplInfo;
      this.currSkuTplInfo = {};
      this.currPopup = 'flashSale';
    },
    /**
     * 创建新模板
     */
    handleCreateNewSkuTpl() {
      this.currSkuTplInfo = {};
      this.skuTplFormState = 'create';
      this.currPopup = 'skuTplCreation';
    },
    /**
     * 更新模板列表里模板的sku名称列表
     */
    handleUpdateSkuNameList({ skuNameList = [], skuTplId = '' }) {
      // 更新当前选择编辑的sku模板信息
      if (this.currSkuTplInfo && this.currSkuTplInfo.id === skuTplId) {
        this.currSkuTplInfo.skuNameList = skuNameList;
      }

      // 重新获取
      this.getSkuTpl();
    },
    /**
     * 删除模板
     */
    handleDeleteSkuTpl(skuTplId) {
      this.showDeleteConfirm = true;
      this.needDeleteSkuTplId = skuTplId;
    },
    handleDeleteConfirm() {
      if (this.needDeleteSkuTplId === undefined || this.needDeleteSkuTplId === null) return;

      // TODO: test demo
      this.skuTplList = this.skuTplList.filter((skuTpl) => {
        // @ts-ignore
        return skuTpl.id !== this.needDeleteSkuTplId;
      });

      this.currSkuTplInfo = {};
      this.needDeleteSkuTplId = '';
      this.showDeleteConfirm = false;

      // 重新获取
      // @ts-ignore
      this.getSkuTpl('skuTpl');
    },
    handleConfirmClose() {
      this.showDeleteConfirm = false;
    },
    /**
     * 获取sku模板列表
     */
    // eslint-disable-next-line no-empty-function
    async getSkuTpl() {
    },
  },
};
</script>
<style lang="scss">
html {
  background-color: transparent;
  overflow: hidden;
}
body {
  background-color: transparent;
}
</style>
