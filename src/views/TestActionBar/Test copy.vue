<template>
  <div class="wrapper" v-if="sourceSpecs && sourceSpecs.length > 0">
    <div class="mask" @touchmove.prevent @touchmove.stop @click="onClickBack()"
      v-if="sourceSpecs && sourceSpecs.length > 0 && !pendingRequest" />
    <div :class="[
        'main-container animate__animated animate__slideInUp animate__faster',
        `${sourceSpecs && sourceSpecs.length > 2 ? 'higher' : ''}`,
      ]" v-if="sourceSpecs && sourceSpecs.length > 0 && !pendingRequest">
      <div class="content-wrapper" v-if="showInfo === 'sku'">
        <div class="close-area" v-if="!closeWithButton" @click="onClickBack('goods_list')" />
        <div :class="['header-wrapper', 'hairline-border', 'hairline-border-bottom']" @touchmove.prevent
          @touchmove.stop>
          <div class="header">
            <img class="cover" :src="currentSku.cover || goodsInfo.cover" mode="aspectFill"
              @click="previewSkuCover(currentSku.cover || goodsInfo.cover)" />
            <div class="right">
              <!-- 积分商品 -->
              <div v-if="isPointGoods" class="point-price">
                <span class="num">{{ currentSku?.price?.points || 0 }}</span>
                <span class="unit">积分</span>
                <span class="unit"> + </span>
                <span class="symbol">￥</span>
                <span class="num">{{ currentSku?.price?.buy_price || 0 }}</span>
                <span class="unit">元</span>
              </div>
              <!-- 其他 -->
              <div v-else>
                <price :discounts="discounts" :price="skuOriginPrice" :activityType="activityInfo?.activity_type"
                  :points="currentSku?.price?.points" :buyPrice="currentSku?.price?.buy_price"
                  :prefix="discountPricePrefix" :activityInfo="currentSku?.activity_list?.activity_info"
                  :hideSales="true" :can-show-activity-price="canShowActivityPrice" showWan showOnePrice />
              </div>

              <i v-if="showStock">{{ stockTip }}件</i>
              <span class="sku-name" v-if="currentSku.name">已选：{{ currentSku.name }}</span>
            </div>
            <div class="icon-close" v-if="closeWithButton" @click="onClickBack()" />
          </div>
          <div class="expiry-tip" v-if="isYiMeiGoods">{{ getExpriyText }}</div>
        </div>
        <div :class="[
            'sku-wrapper',
            `${isYiMeiGoods && getExpriyText ? 'padding-large' : ''}`,
            `${sourceSpecs && sourceSpecs.length > 2 ? 'higher' : ''}`,
          ]" v-if="sourceSpecs && sourceSpecs.length > 0" @touchmove="touchmove" @touchstart="touchstart"
          :style="true && `max-height: calc(26vh - 30px);`" ref="rollbox">
          <div class="spec-group" v-if="isBuYType">
            <div class="spec-title">
              购买方式
            </div>
            <div :class="['spec-items', 'hairline-border', 'hairline-border-bottom']">
              <div :class="['spec-item', isBuYNow ? 'active' : '']" :style="{ order: 1 }" @click="isBuYNow = true">
                <span>立即购买</span>
              </div>
              <div :class="['spec-item', !isBuYNow ? 'active' : '']" :style="{ order: 2 }" @click="isBuYNow = false">
                <span>以旧换新</span>
              </div>
            </div>
          </div>
          <div v-for="spec in displayedSpecGroup" :key="spec.spec_id" class="spec-group">
            <div class="spec-title">
              {{ spec.name }}
            </div>
            <div :class="['spec-items', 'hairline-border', 'hairline-border-bottom']">
              <div v-for="(sub, index) in getSpecOptionsByDisplayedSpecList(spec.sub)" :key="sub.spec_id"
                :class="['spec-item', specItemStye(sub.spec_id), getSpecMatchSkuRemark(sub.spec_id) && spec.name == '场次' && 'spec-item_ticket']" :style="{ order: index + 1 }"
                @click="onChangeSpecItem(sub)">
                <img v-if="isColorSpec(spec.name) && getSpecMatchSkuCover(sub.spec_id)"
                  :src="getSpecMatchSkuCover(sub.spec_id)" alt="" />
                <i v-if="checkSpecSoldOut(sub.spec_id)">售罄</i>
                <span v-if="getSpecMatchSkuRemark(sub.spec_id) && spec.name == '场次'">
                  {{ getProcessSubName(sub.name).date }}
                </span>
                <span v-else>{{ sub.name }}</span>
                <span v-if="getSpecMatchSkuRemark(sub.spec_id) && spec.name == '场次'">{{getProcessSubName(sub.name).time}}({{getSpecMatchSkuRemark(sub.spec_id)}})</span>
              </div>
            </div>
          </div>
          <div class="store-section" v-if="isYiMeiGoods" @click="onClickStore">
            <div class="spec-title-section">
              <span class="spec-title">提货城市/门店</span><span class="spec-title-right">共{{ storeList.length }}家门店</span>
            </div>
            <div v-if="currentStore.id" :class="`${currentStore.distance ? 'icon-store' : ''}`">
              <span>{{ currentStore.store_name }}</span>
              <i><span v-if="currentStore.distance && currentStore.distance <= 100">距你{{ currentStore.distance }}km |
                </span>{{ currentStore.store_address }}</i>
              <div class="store-tags">
                <span v-for="(item, index) in currentStore.tags" :key="index">{{ item }}</span>
              </div>
            </div>
          </div>
          <div class="spec-group row" v-if="showSkuCounter && isBuYNow">
            <div class="spec-title spec-title-num">
              购买数量
              <span class="limit" v-if="this.goodsInfo.buy_limit_type === 1">累计限购{{ this.goodsInfo.buy_limit_num
                }}件</span>
              <span class="limit" v-if="this.goodsInfo.buy_limit_type === 3">单次限购{{ this.goodsInfo.buy_limit_num
                }}件</span>
              <span class="purchase-limit" v-if="purchaseLimit">(活动限购{{ purchaseLimit }}件)</span>
            </div>
            <div class="purchase-volume">
              <div :class="['btn-min', `${minDisabled ? 'disabled' : ''}`]" @click="onClickMin" />
              <input class="num" v-model="purchaseVolume" :type="isIOS ? 'number' : 'tel'" @keyup="purchaseVolumeInput"
                @change="purchaseVolumeChange" @focus="purchaseVolumeFocus" @blur="purchaseInputBlur"
                pattern="[0-9]*" />
              <div :class="['btn-add', `${plusDisabled ? 'disabled' : ''}`]" @click="onClickAdd" />
            </div>
          </div>
        </div>
        <Jifen v-if="goodsInfo.forbid_buy == 2" :goodsInfo="goodsInfo" />
        <div :class="['confirm-wrapper', iosConfirm, harmonyConfirm, 'hairline-border', 'hairline-border-top']" @touchmove.prevent
          @touchmove.stop>
          <div class="confirm-wrapper-inner">
            <!-- <div v-if="isAliCredit" class="aliCreditBox">
              <div class="aliCreditBox-body">当前规格可参与花呗免息活动</div>
            </div> -->

            <!-- <div v-if="openFrom === 'cart'" :class="['confirm-button', `${btnCartDisabled ? 'disabled' : ''}`]"
              @click="confirmSelectSku">
              <span>{{ cartBtnText }}</span>
            </div> -->
            <!-- <div v-else-if="onlySelect" :class="['confirm-button', `${btnDisabledOnlySelect ? 'disabled' : ''}`]"
              @click="confirmSelectSku">
              <span>{{ conformBtnText }}</span>
            </div> -->
            <template v-else-if="currentSku.price && currentSku.price.points">
              <!-- 不降级，则左右两个按钮 -->


              <!-- 降级展示原先的只有一个按钮 -->
 -->
            </template>

 
          </div>
        </div>
      </div>
      <div class="content-wrapper" v-if="showInfo === 'store'">
        <div class="close-area" v-if="!closeWithButton" @click="onClickBack('goods_list')" />
        <div class="store-header" @touchmove.prevent @touchmove.stop>
          选中使用门店
          <div class="icon-close" v-if="closeWithButton" @click="onClickBack()" />
        </div>
        <div class="tip" @touchmove.prevent @touchmove.stop>注意：下单后使用门店无法修改，请仔细选择</div>
        <div :class="['store-item-wrapper', `${sourceSpecs && sourceSpecs.length > 2 ? 'higher' : ''}`]" scroll-y
          @touchmove="touchmove" @touchstart="touchstart" ref="rollbox">
          <store-item v-for="(item, index) in storeList" :key="index" :title="item.store_name"
            :address="item.store_address" :isInsurance="currentSku.is_insurance" :storeInfo="item"
            :price="currentSku?.price?.price || 0" :showCustomService="true" :isSelected="isSelectedStore(item.id)"
            @onClickCustomService="handleClickCustomService" @onClickStoreIcon="handleClickStoreIcon"
            @onClickStore="handleClickStore" />
        </div>
        <div
          :class="['wbox-safe-padding-bottom', 'confirm-wrapper', harmonyConfirm, 'hairline-border', 'hairline-border-top']"
          @touchmove.prevent
          @touchmove.stop
        >
          <div class="confirm-wrapper-inner">
            <div :class="['confirm-button']" @click="onClickConfirmStore">确定</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import commonMixin from '../../mixins/common';
import StoreItem from '../storeItem/storeItem.vue';
import { isWbox, openUrl, isIOS, getOnLaunchOptionsAsync } from '@wb/miniprogram-util';
import { getShopInfoApi, checkIsCanBuyApi } from 'api/goods';
import { getGoodsApi } from 'api/daogou';
import { checkReceiveApi, receiveApi } from '../../api/promote';
import { couponBatchReceiveApi, checkGoSubmitForSeckill } from '../../api/daogou';
import { reportCPSApi } from 'api/daogouApi';
import { debounce } from '../../util/debounce';
import { reportToSudaOrActLog, addTrack } from '../../util/logger';
import { mapState } from 'vuex';
import { ACTIVITY_TYPE } from '../../enums/activity';
import { toOrder } from 'util/order';
import { openWebView, previewImage } from 'util/bridge';
import emitter from 'util/bus';
import { isActivityStart } from 'util/activity';
import { BUY_LIMIT_TYPE } from '../../enums/goods';
import { useToast } from '@woo/wooui-next';
// import SkuUtil from 'sku-util';
import { SkuUtil, Sku, Spec } from '@weibovip/sku-util';
import { isHarmony } from 'util/platform';
import { ref, watch } from 'vue';
import { isVirtual } from '@/util/common';
import { getDistance } from 'util/amapHelper';
import { goToCustomService } from 'util/tool';
import { Price } from 'component/price';
import Jifen from '@/component/jifen/index.vue';

export default {
  mixins: [commonMixin],
  components: {
    'store-item': StoreItem,
    'price': Price,
    Jifen,
  },
  data() {
    return {
      skuUtil: null,
      cover: '',
      price: '',
      sourceSpecs: [],
      skus: [],
      specs: [],
      sourceSkus: [],
      currentHeight: 0,
      purchaseVolume: 1,
      selectedStore: {
        name: '',
        desc: '',
      },
      currentStore: {
        name: '',
        desc: '',
      },
      loadingStore: true,
      originUrl: '',
      buyerUid: '',
      isCouponReceive: false,
      hasNoValidCoupon: true,
      query: '',
      goodsInfo: {},
      isAnimationFinished: false,
      pendingRequest: true,
      pendingInitRequest: true,
      specListData: [],
      reportOnce: {},
      serverTime: 0,
      pid_only: '',
      pageQuery: '',
      isBuYNow: true,
      purchaseInputFocus: false,
      bodyTop: 0, // 当前窗口滚动位置
      isIOS,
      page: '',
    };
  },
  props: {
    protocol: {
      type: String,
      default: 'https',
    },
    goods_id: {
      type: String,
      default: '',
    },
    shop_id: {
      type: [String, Number],
      default: '',
    },
    pid: {
      type: String,
      default: '',
    },
    chan: {
      type: String,
      default: '',
    },
    busi_from: {
      type: String,
      default: 'live',
    },
    live_id: {
      type: String,
      default: '',
    },
    anchor_id: {
      type: String,
      default: '',
    },
    cid: {
      type: String,
      default: 'live',
    },
    iid: {
      type: String,
      default: '',
    },
    uid: {
      type: [String, Number],
      default: '',
    },
    uid_weibo: {
      type: [String, Number],
      default: '',
    },
    defaultShow: {
      type: String,
      default: 'sku',
    },
    defaultGoodsInfo: {
      type: Object,
      default: null,
    },
    closeWithButton: {
      type: Boolean,
      default: false,
    },
    defaultStore: {
      type: Object,
      default: null,
    },
    defaultSku: {
      type: Object,
      default: null,
    },
    mode: {
      type: String,
      default: 'series', // sku与门店是否串连选择 【single, series】
    },
    groupId: {
      type: String,
      default: '', // 拼团id
    },
    couponIds: {
      type: String,
      default: '', // 优惠券ids，逗号分隔
    },
    btnTitle: {
      type: String,
      default: '', // 优惠券文案
    },
    addressId: {
      type: String,
      default: '', // 当前选中的地址
    },
    defaultServerTime: {
      type: Number,
      default: 0, // 服务器时间
    },
    retailerWeiboId: {
      type: [String, Number],
      default: '', // 默认客服uid
    },
    act_code: {
      type: String,
      default: '', // 活动链接标识
    },
    mark_id: {
      type: String,
      default: '', // 广告标识
    },
    detailSource: {
      type: String,
      default: '', // 商详
    },
    currentLocation: {
      type: Object,
      default: () => {
        return null;
      },
    },
    onlySelect: {
      type: Boolean,
      default: false, // 仅用于选择sku，不跳转购买
    },
    conformBtnText: {
      type: String,
      default: '确定',
    },
    showSkuCounter: {
      type: Boolean,
      default: true, // 是否显示sku数量选择器
    },
    openFrom: {
      type: String,
      default: '', // 打开来源
    },
    gold_recycle: {
      type: Number,
      default: 0, // 是否是黄金以旧换新
    },
    search_word: {
      type: String,
      default: '', // 搜索词-从搜索结果的url带过来
    },
    pageMode: {
      type: String,
      default: 'default',
    },
    isEjournal: {
      type: Boolean,
      default: false,
    },
    modulesState: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    ...mapState(['appEnv']),
    purchaseMax() {
      let defaultMax = 3000; // 最大购买数量
      if (Number(this.modulesState?.fans_book) === 1) {
        // 图书白名单商家fans_book最大数量是50000
        defaultMax = 50000;
      }
      return defaultMax;
    },
    // 是否显示购买方式
    isBuYType() {
      if (this.gold_recycle === 1) {
        return this.buyBtnText !== '立即拼团' && this.buyBtnText !== '立即秒杀' && !this.isPointGoods;
      }
      return false;
    },
    actionableSpecIdList() {
      return (this.skuUtil && this.currentSku && this.skuUtil.specOptions) || [];
    },
    displayedSpecGroup() {
      return (this.sourceSpecs && this.sourceSpecs.filter((spec) => spec.sub && spec.sub.length > 0)) || [];
    },
    bodyHeight() {
      if (isWbox) {
        return WBXEnvironment.deviceHeightNoScale;
      } else {
        return document.body.clientHeight;
      }
    },
    iosConfirm() {
      return isIOS && 'wbox-safe-padding-bottom';
    },
    harmonyConfirm() {
      return isHarmony && 'harmony-safe-padding-bottom';
    },
    skuOriginPrice() {
      return this.currentSku?.price?.price;
    },
    discounts() {
      const price = this.currentSku?.price?.price;
      const buy_price = this.currentSku?.price?.buy_price;
      return price === buy_price ? '' : buy_price;
    },
    discountPricePrefix() {
      const price = this.currentSku?.price || {};
      return price.prefix || '';
    },
    // skuStyle() {
    //   return {
    //     maxHeight: `${this.bodyHeight * 0.6 - 190}px`,
    //   };
    // },
    // storeStyle() {
    //   return {
    //     maxHeight: `${this.bodyHeight * 0.6 - 150}px`,
    //   };
    // },
    btnCartDisabled() {
      return (
        !(this.currentSku && this.currentSku.sku_id && Number(this.currentSku.stock) > 0)
        || !this.currentSku.spec_id.split(',').every((id) => this.skuUtil.currentSelectedSpecIds.includes(Number(id))) // 如果当前选择的spec，有不匹配当前Sku的，按钮不可购买
        || this.isCpsNotInvited
      );
    },
    btnDisabled() {
      return (
        !(this.currentSku && this.currentSku.sku_id && Number(this.currentSku.stock) > 0)
        || this.presell
        || !this.currentSku.spec_id.split(',').every((id) => this.skuUtil.currentSelectedSpecIds.includes(Number(id))) // 如果当前选择的spec，有不匹配当前Sku的，按钮不可购买
        || this.isCpsNotInvited || this.fansLevelNotMet
        || Number(this.defaultGoodsInfo.is_gift) === 1
      );
    },
    btnDisabledOnlySelect() {
      // 加入购物车按钮，始终可以点击
      if (this.openFrom === 'cart') return false;
      return this.btnDisabled;
    },
    selectedStoreId() {
      return this.selectedStore.id || '';
    },
    storeList() {
      const storesWithDistance = this.currentSku.stores.map((store) => {
        if (!store.latitude || !store.longitude || !this.currentLocation) {
          return store;
        }

        return {
          ...store,
          distance: getDistance(this.currentLocation.lat, this.currentLocation.lon, store.latitude, store.longitude).toFixed(1),
        };
      })
        .sort((a, b) => {
          // 同城>非同城>大于距离无法获取（销量）
          const compSale = (Number(b.sales_volume) || 0) - (Number(a.sales_volume) || 0);
          if (!a.distance && !b.distance) {
            return compSale;
          }
          if (!a.distance) {
            return 1;
          }
          if (!b.distance) {
            return -1;
          }
          if ((a.distance === b.distance) || Number(a.distance) > 100 && Number(b.distance) > 100) {
            return compSale;
          }
          return a.distance - b.distance;
        }) || [];
      const stores = storesWithDistance || [];
      return stores;
    },
    // currentSku() {
    //   const sku = this.defaultSku || this.sourceSkus.filter((sku) => sku.stock && Number(sku.stock) > 0)[0];
    //   if (!sku) {
    //     return {};
    //   }
    //   this.$emit('onChangeSku', sku);
    //   return sku;
    // },
    isAliCredit() {
      return this.currentSku && this.currentSku.is_in_ins;
    },
    stock() {
      const sku = this.currentSku || {};
      const stock = +sku.stock || this.goodsInfo.stock;
      return stock;
    },
    purchaseLimit() {
      return this.currentSku.activity_list?.activity_info.buy_limit ?? 0;
    },
    maxPurchaseVolume() {
      const stock = Number(this.stock);
      const buyLimit = Number(this.goodsInfo.buy_limit_num);
      let maxPurchaseVolume = undefined;

      if (buyLimit > 0) {
        maxPurchaseVolume = stock - buyLimit > 0 ? buyLimit : stock;
      } else {
        maxPurchaseVolume = stock;
      }

      if (Number(this.activityInfo.activity_type) === 4) {
        const activityLimit = Number(this.activityInfo.buy_limit);
        const activityStock = Number(this.activityInfo.activity_stock);
        let minLimit = undefined;
        let minStock = undefined;

        if (buyLimit > 0) {
          minLimit = buyLimit - activityLimit > 0 ? activityLimit : buyLimit;
        } else {
          minLimit = activityLimit;
        }

        minStock = Math.min(stock, activityStock);
        let maxThred = 0;

        if (minLimit && minLimit > 0) {
          maxThred = minLimit - minStock > 0 ? minStock : minLimit;
        } else {
          maxThred = minStock;
        }

        // 电子刊限制50
        if (this.isEjournal) {
          maxThred = maxThred > 50 ? 50 : maxThred;
        }

        return maxThred;
      }

      // 电子刊限制50
      if (this.isEjournal) {
        maxPurchaseVolume = maxPurchaseVolume > 50 ? 50 : maxPurchaseVolume;
      }
      return maxPurchaseVolume;
    },
    plusDisabled() {
      // 商家秒杀以活动库存为主
      let activityPurchaseLimit = false;
      if (Number(this.activityInfo.activity_type) === 4) {
        activityPurchaseLimit = this.purchaseVolume - this.maxPurchaseVolume >= 0 ? true : false;
      }

      console.log('=== test plusdisabled', activityPurchaseLimit);

      return this.purchaseVolume >= this.maxPurchaseVolume || this.isPointGoods || activityPurchaseLimit;
    },
    minDisabled() {
      return this.purchaseVolume <= 1 || this.isPointGoods;
    },
    isYiMeiGoods() {
      const type = (this.goodsInfo || {}).type;
      return String(type) === '2'; // 是否是医美商品
    },
    getExpriyText() {
      const { expiry_type, expiry_value } = this.goodsInfo;
      if (!expiry_value || !this.isYiMeiGoods) {
        return '';
      }
      return String(expiry_type) === '1'
        ? `${expiry_value.split(',')[0]} - ${expiry_value.split(',')[1]} 有效`
        : `核销有效期${expiry_value}天`;
    },
    isInActivity() {
      return (
        this.currentSku.activity_list
        && this.currentSku.activity_list.activity_info
        && this.currentSku.activity_list.activity_info.activity_type
      );
    },
    isActivityStart() {
      return isActivityStart(this.currentSku.activity_list);
    },
    haActivityStock() {
      return (
        this.currentSku.activity_list
        && this.currentSku.activity_list.activity_info
        && this.currentSku.activity_list.activity_info.activity_stock > 0
      );
    },
    activityInfo() {
      return (this.currentSku.activity_list && this.currentSku.activity_list.activity_info) || {};
    },
    outOfStock() {
      return this.currentSku.stock <= 0;
    },
    cartBtnText() {
      if (this.outOfStock) {
        return '已抢光';
      }
      return '加入购物车';
    },
    buyBtnText() {
      if (Number(this.defaultGoodsInfo.is_gift) === 1) {
        return '非卖品不支持下单';
      }
      if (this.isCpsNotInvited) {
        return '尚未开售，可先收藏';
      }
      if (this.outOfStock) {
        return '已抢光';
      }
      let btnText = '立即购买';
      let key = 'data_exp.product_page.sku_0btn';
      if ((!this.isCouponReceive && !this.hasNoValidCoupon) || this.btnTitle || this.couponIds) {
        btnText = this.btnTitle || '领券购买';
        key = 'data_exp.product_page.sku_1btn';
      }
      if (this.isInActivity && this.isActivityStart && this.haActivityStock) {
        switch (Number(this.activityInfo.activity_type)) {
          case ACTIVITY_TYPE.SecKill:
          case ACTIVITY_TYPE.MerchantSeckill:
            btnText = '立即秒杀';
            key = 'data_exp.product_page.sku_2btn';
            break;
          case ACTIVITY_TYPE.PinTuan:
            btnText = this.groupId ? '立即拼团' : btnText;
            key = this.groupId === '0' ? 'data_exp.product_page.sku_3btn' : 'data_exp.product_page.sku_4btn';
            break;
        }
      }
      reportToSudaOrActLog('xd_chan', { wbxd_stats: key }, this.appEnv);
      if (Number(this.gold_recycle) === 1 && !this.isBuYNow) {
        reportToSudaOrActLog('xd_chan', { wbxd_stats: 'data_exp.product_page.sku_spec_recycling_yjhx' });
        btnText = '通过“以旧换新”购买';
      }
      return btnText;
    },
    buyBtnClass() {
      let btnClass = '';
      if ((!this.isCouponReceive && !this.hasNoValidCoupon) || this.btnTitle || this.couponIds) {
        btnClass = 'coupon';
      }
      if (this.isInActivity && this.isActivityStart && this.haActivityStock) {
        switch (Number(this.activityInfo.activity_type)) {
          case ACTIVITY_TYPE.SecKill:
          case ACTIVITY_TYPE.MerchantSeckill:
            btnClass = 'activity';
            break;
          case ACTIVITY_TYPE.PinTuan:
            btnClass = this.groupId ? 'activity' : btnClass;
            break;
        }
      }
      return btnClass;
    },
    skuPrice() {
      let skuPrice = this.currentSku.price && this.currentSku.price.price;
      const price = this.currentSku.price && this.currentSku.price.price; // 正常价
      const buy_price = this.currentSku.price && this.currentSku.price.buy_price; // 券后价
      if ((!this.isCouponReceive && !this.hasNoValidCoupon) || Number(price) > Number(buy_price)) {
        skuPrice = buy_price;
      }
      if (
        this.isInActivity
        && this.isActivityStart
        && this.haActivityStock
        && this.activityInfo
        && this.activityInfo.activity_price
        && this.isBuyWithActivity
      ) {
        if (Number(this.activityInfo.activity_type) === ACTIVITY_TYPE.PinTuan && this.groupId) {
          return this.activityInfo.activity_price || 0;
        } else if (Number(this.activityInfo.activity_type) === ACTIVITY_TYPE.SecKill) {
          return this.activityInfo.activity_price || 0;
        } else if (Number(this.activityInfo.activity_type) === ACTIVITY_TYPE.MerchantSeckill) {
          return this.activityInfo.activity_price || 0;
        } else {
          if (skuPrice === 0) {
            return skuPrice;
          }
          return skuPrice || this.goodsInfo.goods_price?.min_price;
        }
      } else {
        if (skuPrice === 0) {
          return skuPrice;
        }
        return skuPrice || this.goodsInfo.goods_price?.min_price;
      }
    },
    stockTip() {
      let tip = `库存 ${this.currentSku.stock}`;
      if (this.isInActivity && this.isActivityStart && this.haActivityStock) {
        switch (Number(this.activityInfo.activity_type)) {
          case ACTIVITY_TYPE.SecKill:
          case ACTIVITY_TYPE.MerchantSeckill:
            return (tip = `秒杀库存剩余 ${(this.activityInfo && this.activityInfo.activity_stock) || 0}`);
          case ACTIVITY_TYPE.PinTuan:
            return (tip = this.groupId
              ? `拼团库存剩余 ${(this.activityInfo && this.activityInfo.activity_stock) || 0}`
              : tip);
          default:
            return (tip = `库存 ${this.currentSku.stock}`);
        }
      }
      return tip;
    },
    presell() {
      const saleTime = this.goodsInfo?.sale_time_stamp;
      const now = this.defaultServerTime || this.serverTime;
      if (saleTime && now && saleTime > now) {
        return true;
      }
      return false;
    },
    isBuyWithActivity() {
      return (
        ((this.isInActivity && this.isActivityStart && this.activityInfo.activity_type === ACTIVITY_TYPE.SecKill)
          || (this.isInActivity && this.groupId && this.activityInfo.activity_type === ACTIVITY_TYPE.PinTuan)
          || (this.isInActivity && this.isActivityStart && this.activityInfo.activity_type === ACTIVITY_TYPE.MerchantSeckill))
        && this.haActivityStock
      );
    },
    // 是否是虚拟商品（虚拟充值，会员服务，教育培训）
    isVirtualGoods() {
      const type = (this.goodsInfo || {})?.goods_type;
      return isVirtual(type);
    },
    // 是否是积分商品
    isPointGoods() {
      return Number(this.activityInfo.activity_type) === 3;
    },
    isCpsNotInvited() {
      const cpsInfo = this.goodsInfo && this.goodsInfo.cps_info;
      return cpsInfo && cpsInfo.cps_type === 3 && cpsInfo.exc_users.length === 0; // 专属计划未邀约
    },
    canShowActivityPrice() {
      // activity_type === 2拼团的情况，如果选择单独购买，不展示活动价
      if (this.activityInfo?.activity_type === 2) {
        console.log('groupid', this.groupId);
        return !!this.groupId;
      }
      // 其他情况根据buy_price确定是否展示活动价
      if (!this.activityInfo.activity_type && this.currentSku?.price?.buy_price) {
        return true;
      }
      return this.activityInfo?.activity_type === 2 || this.activityInfo?.activity_type === 4;
    },
    fansLevelNotMet() {
      const forbidBuy = this.goodsInfo && this.goodsInfo.forbid_buy;

      return forbidBuy && Number(forbidBuy) === 1;
    },
    showStock() {
      // let show = true;
      // // 图书类目，不显示库存
      if (this.defaultGoodsInfo && String(this.defaultGoodsInfo.goods_id) === '1654015502187') {
        return false;
      }
      if (!this.modulesState) {
        return false;
      }
      return Number(this.modulesState?.hide_stock) !== 1;
    },
    // 是否显示支付前置的样式
    isPrePayment() {
      if (!this.modulesState) {
        return false;
      }
      return Number(this.modulesState?.hide_pre_payment) !== 1;
    },
    starttime() {
      return (this.activityInfo?.start_time ?? 0) * 1000;
    },
    showPreheating() {
      const isPreheat = Number(this.activityInfo?.is_preheat ?? 0); // is_preheat: 【1:预热 0:不预热】
      const preheatPeriod = Number(this.activityInfo?.preheat_period ?? 0) * 60 * 1000; // preheat_period: 【预热时间,单位为分钟】
      const preheatingTime = this.starttime - preheatPeriod ?? 0;
      const now = this.defaultServerTime || this.serverTime;

      return isPreheat === 1 && now >= preheatingTime;
    },
    type() {
      if (!this.goodsInfo?.goods_id) {
        return -1;
      }
      if (this.goodsInfo?.state === 0) {
        return 0.1;
      }

      if (this.goodsInfo.skus.length === 0) {
        return 0.2;
      }

      if (this.isCpsNotInvited) {
        return 0.3;
      }

      /**
       * 24小时内才展示活动状态
       */
      const diff = 24 * 60 * 60 * 1000;
      const activityType = Number(this.activityInfo?.activity_type ?? 0);
      const now = this.defaultServerTime || this.serverTime;
      if (this.starttime - now <= diff) {
        if (this.activityInfo?.activity_stock > 0) {
          if (activityType === 1) {
            // 秒杀
            if (this.currentSku?.display_btn_title) {
              // 有券
              if (now > this.starttime) {
                // 时间到了
                return 2;
              } else {
                // 时间没到
                return 5;
              }
            } else {
              // 没券
              if (now > this.starttime) {
                // 时间到了
                return 2;
              } else {
                // 时间没到
                return 4;
              }
            }
          } else if (activityType === 2) {
            if (this.currentSku?.stock <= 0) {
              // 已抢光
              return 0;
            }
            if (this.currentSku?.display_btn_title) {
              // 有券
              return 7;
            }
            return 6;
          }
        }
      }

      // 商家秒杀
      if (this.activityInfo?.activity_stock > 0) {
        if (activityType === 4) {
          if (this.currentSku?.display_btn_title) {
            // 有券
            if (now > this.starttime) {
              // 时间到了
              return 2;
            } else if (this.showPreheating) {
              // 时间没到 但设置预热时间了
              return 5;
            }
          } else {
            // 没券
            if (now > this.starttime) {
              // 时间到了
              return 2;
            } else if (this.showPreheating) {
              // 时间没到
              return 4;
            }
          }
        }
      }

      // 普通
      if (this.currentSku?.state === 0) {
        return 0.1;
      }
      if (this.currentSku?.stock <= 0) {
        // 已抢光
        return 0;
      }
      if (this.currentSku?.display_btn_title && activityType !== 3) {
        // 有券
        return 3;
      } else {
        // 没券
        return 1;
      }
    },
    showAddCart() {
      if (!this.modulesState) {
        return true;
      }
      const hide_add_cart = this.modulesState?.hide_add_cart;
      return hide_add_cart === 0;
    },
    showCart() {
      // 铁粉专属
      const tiefen = this.goodsInfo.forbid_buy && this.goodsInfo.forbid_buy === 1;
      return [1, 2, 3, 4, 5].includes(this.type) && !tiefen && this.showAddCart;
    },
  },

  setup() {
    const toast = useToast();
    const rollbox = ref(null);
    const currentSku = ref(null);
    const showInfo = ref('sku');
    let targetY = 0;
    let sHeight = 0;
    let cliHeight = 0;
    watch(currentSku, () => {
      // console.log('rollbox ', rollbox.value?.scrollHeight);
      setTimeout(() => {
        if (rollbox.value) {
          sHeight = rollbox.value.scrollHeight; // 内容的可滚动高度
          cliHeight = rollbox.value.clientHeight; // 当前内容容器的高度
        }
      }, 200);
    });
    watch(showInfo, () => {
      // console.log('rollbox ', rollbox.value?.scrollHeight);
      setTimeout(() => {
        if (rollbox.value) {
          sHeight = rollbox.value.scrollHeight; // 内容的可滚动高度
          cliHeight = rollbox.value.clientHeight; // 当前内容容器的高度
        }
      }, 200);
    });
    const touchstart = (e) => {
      targetY = Math.floor(e.targetTouches[0].clientY); // 手指起始触摸位置
    };
    const touchmove = (e) => {
      const top = rollbox.value.scrollTop;
      const newTargetY = Math.floor(e.targetTouches[0].clientY);
      // console.log(targetY, newTargetY, 'old-new');
      // console.log(top, sHeight, cliHeight, 'height');
      if (top <= 0 && newTargetY - targetY > 0 && e.cancelable) {
        console.log('下拉到页面顶部');
        e.preventDefault();
      } else if (top >= sHeight - cliHeight && newTargetY - targetY < 0 && e.cancelable) {
        console.log('上翻到页面底部');
        e.preventDefault();
      }
    };

    return {
      toast,
      rollbox,
      touchstart,
      touchmove,
      currentSku,
      showInfo,
    };
  },

  async mounted() {
    this.showInfo = this.defaultShow;
    this.buyerUid = this.uid || '';
    const { query } = await getOnLaunchOptionsAsync();
    this.pid_only = query.pid;
    this.pageQuery = query.page || '';
    this.page = query.page || '';
    if (this.gold_recycle === 1) {
      reportToSudaOrActLog('xd_chan', { wbxd_stats: 'data_act.product_page.sku_spec_recycling_yjhx' });
    }
    const initProcesser = () => {
      if (this.defaultGoodsInfo) {
        this.initData(this.defaultGoodsInfo);
        this.pendingRequest = false;
        this.$nextTick(() => {
          this.isAnimationFinished = true;
        });
      } else {
        this.init()
          .then(() => {
            this.getShopInfo()
              .then(() => {
                this.checkCouponReceive();
              })
              .catch(() => {
                setTimeout(() => {
                  this.closeContainer();
                }, 500);
                this.pendingRequest = false;
              });
          })
          .catch(() => {
            setTimeout(() => {
              this.closeContainer();
            }, 500);
            this.pendingRequest = false;
          });
      }
    };
    if (!this.buyerUid && isWbox && wbx.wbGetWeiboUser) {
      wbx.wbGetWeiboUser({
        success: (res) => {
          this.buyerUid = res.uid;
          initProcesser();
        },
        failure: (res) => {
          console.log('wbGetWeiboUser failure>> ', res);
        },
      });
    } else {
      initProcesser();
    }
    reportToSudaOrActLog('xd_chan', { wbxd_stats: 'data_exp.product_page.sku_spec' }, this.appEnv);
    this.reportOnce = {
      sku_spec: () => {
        reportToSudaOrActLog('xd_chan', { wbxd_stats: 'data_act.product_page.sku_spec' }, this.appEnv);
      },
    };
    // TODO
    // setTimeout(() => {
    //     if(this.pendingInitRequest) { //如果超时都没拿到接口返回 关闭容器
    //       wbx.showToast({
    //         title: '网络开小差了~',
    //         icon: 'warn',
    //         duration: 3000
    //       })
    //       setTimeout(() => {
    //         this.closeContainer();
    //       }, 3000);
    //     }
    //   }, 6000);
  },
  methods: {
    init(mode = 'init') {
      return new Promise((resolve, reject) => {
        getGoodsApi({
          goods_id: this.goods_id,
          shop_id: this.shop_id,
        })
          .then((res) => {
            this.pendingInitRequest = false;
            if (String(res.code) === '0') {
              const data = res.data || {};
              if (res.time) {
                this.serverTime = res.time;
              }
              // TODO 商品已下架处理
              // if(Number(data.state) === 0 || this.sourceSpecs.length === 0) {
              //   setTimeout(() => {
              //     wbx.showToast({
              //       title: '商品已下架',
              //       icon: 'warn',
              //       duration: 3000
              //     })
              //   }, 0);
              // this.notifyRenderFinished();
              //   setTimeout(() => {
              //     this.closeContainer();
              //   }, 4000);
              //   return
              // }
              this.initData(data);
              if (this.busi_from !== 'live') {
                this.$nextTick(() => {
                  this.animationFinished();
                  // this.adjustHeight(this.halfLayerHeight); //接口回来后弹起高度
                });
              } else {
                this.$nextTick(() => {
                  this.animationFinished();
                  // this.notifyRenderFinished();
                });
              }
              return resolve();
            } else {
              // this.notifyRenderFinished();
              return reject();
            }
          })
          .catch((err) => {
            this.pendingInitRequest = false;
            this.animationFinished();
            // TODO
            // wbx.showToast({
            //   title: '获取商品信息失败',
            //   icon: 'warn',
            //   duration: 3000
            // })
            this.$nextTick(() => {
              // this.notifyRenderFinished();
            });
            return reject();
          });
      });
    },
    initData(goodsInfo) {
      const data = goodsInfo || {};
      this.sourceSpecs = [...data.specs];
      this.sourceSkus = [...data.skus];
      this.skus = this.sourceSkus.map(
        (sku) =>
          new Sku(
            sku.sku_id,
            sku.cover,
            sku.spec_id.split(',').map((id) => Number(id)),
            sku.stock,
            sku.name
          )
      );
      this.specs = this.sourceSpecs.map(
        (spec) =>
          new Spec(
            spec.spec_id,
            spec.name,
            spec.pid,
            spec.sub.map((sub) => new Spec(sub.spec_id, sub.name, sub.pid))
          )
      );
      this.cover = data.cover;
      this.goodsInfo = data;
      this.skuUtil = new SkuUtil(this.skus, this.specs);
      this.changeSku(this.defaultSku, 'silent');
      if (this.currentSku.spec_id) {
        this.skuUtil.resetActionableSpecIdsBySelectedList(this.currentSku.spec_id.split(',').map((id) => Number(id)));
      }
      this.$nextTick(() => {
        if (this.defaultStore) {
          this.currentStore = this.defaultStore;
          this.selectedStore = this.currentStore;
        } else {
          this.currentStore = this.storeList[0] || {};
          this.selectedStore = this.currentStore;
        }
      });
    },
    onClickClose() {
      this.closeContainer();
    },
    animationFinished() {
      // this.isAnimationFinished = true;
      // this.$nextTick(() => {
      setTimeout(() => {
        this.isAnimationFinished = true;
      }, 0);
      // })
    },
    getShopInfo() {
      return new Promise((resolve, reject) => {
        getShopInfoApi({
          pid: this.pid,
          shop_id: this.shop_id,
        })
          .then((res) => {
            if (String(res.code) === '0') {
              this.merchant_uid = (res.data && res.data.shop && res.data.shop.uid) || '';
              resolve();
            }
            reject();
          })
          .catch((err) => {
            reject();
          });
      });
    },
    checkCouponReceive() {
      checkReceiveApi({
        goods_id: this.goods_id,
        uid: this.buyerUid,
        shop_id: this.merchant_uid, // 这里的shop_id是商家uid
        sku_id: this.currentSku.sku_id,
        sku_count: 1,
      })
        .then((res) => {
          if (String(res.code) === '0') {
            this.isCouponReceive = res.data && Number(res.data.receive) === 1;
            this.hasNoValidCoupon = res.data && Number(res.data.coupon_valid) === 0;
            this.pendingRequest = false;
          }
          this.pendingRequest = false;
        })
        .catch((err) => {
          this.pendingRequest = false; // 失败也要展示
        });
    },
    // initStore(mode='init') {
    //   adapGet(`${this.protocol}://shop.sc.weibo.com/aj/h5/store/store/getAll`, {}, {
    //     isMapi: false,
    //     success: res => {
    //       if (res.code === "100000") {
    //         let data = res.data || {};
    //         this.storeList = data;
    //         this.currentStore = this.storeList[0] || {};
    //         this.selectedStore = this.currentStore;
    //       }
    //     },
    //     fail: err => {
    //       console.log(err);
    //     }
    //   });
    // },
    specItemStye(specId) {
      const isSpecNotActionable = !this.actionableSpecIdList.some((id) => Number(id) === Number(specId));
      const isSpecSoldOut = this.checkSpecSoldOut(specId);
      if (isSpecNotActionable || isSpecSoldOut) {
        return 'disabled';
      }
      const isSpecAcvive = this.skuUtil && this.skuUtil.checkSpecAcvive(specId);
      if (isSpecAcvive) {
        return 'active';
      }
      return '';
    },
    checkSpecSoldOut(specId) {
      const isSpecSoldOut =
        this.actionableSpecIdList.some((id) => Number(id) === Number(specId))
        && this.skuUtil 
        && this.skuUtil.checkSpecOutOfStock(specId);
      return isSpecSoldOut;
    },
    getQueryStr(data) {
      const strArr = [];
      for (const [key, value] of Object.entries(data)) {
        strArr.push(`${key}=${value}`);
      }
      return strArr.length > 0 ? strArr.join('&') : '';
    },
    async onClickConfirm() {
      if (this.purchaseVolume === 0) {
        this.toast.warn('购买数量不能为0');
        return;
      }
      if (Number(this.gold_recycle) === 1 && !this.isBuYNow) {
        reportToSudaOrActLog('xd_chan', { wbxd_stats: 'data_exp.product_page.sku_spec_recycling_yjhx_submit_button' });
        const url = `https://shop.e.weibo.com/pages/gold/gold?ids=${this.goods_id}&sku_id=${this.currentSku.sku_id}&shop_id=${this.shop_id}&chan=${this.chan}&pid=${this.pid}&page=recycling_yjhx2`;
        openWebView(url);
        return;
      }
      if (this.btnDisabled || !this.checkBuyLimit()) {
        return;
      }
      const execCanBuyApi = this.pageMode === 'seckill' ? checkGoSubmitForSeckill : checkIsCanBuyApi;
      const canBuyRes = await execCanBuyApi(
        this.goods_id,
        this.currentSku.sku_id,
        this.purchaseVolume,
        (this.groupId && this.activityInfo.activity_stock) || Number(this.activityInfo.activity_type) === 4
          ? this.activityInfo.activity_id
          : '',
        this.groupId
      );
      if (canBuyRes.code !== 0 && canBuyRes.code !== 100000) {
        this.toast.error(canBuyRes.msg || '暂时不可购买');
        return;
      }
      let wait = 500;
      let couponInfo = {};
      if (!this.isCouponReceive && !this.hasNoValidCoupon) {
        // 原直播间内逻辑
        couponInfo = (await this.receiveCoupon()).data || {};
        wait = 3000;
        reportToSudaOrActLog('xd_chan', { wbxd_stats: 'data_act.product_page.sku_1btn' }, this.appEnv);
      } else if (this.couponIds) {
        // 如果传入了couponId, 就领取这个券
        try {
          const receiveRes = await couponBatchReceiveApi({
            coupon_id: this.couponIds,
            store_weibo_uid: this.uid_weibo,
          });
          if (receiveRes.code === 100000) {
            this.toast.success('已自动为您领取最优优惠券，下单更省钱');
            wait = 3000;
          } else if (receiveRes.msg) {
            this.toast.warn(receiveRes.msg);
          }
          reportToSudaOrActLog('xd_chan', { wbxd_stats: 'data_act.product_page.sku_1btn' }, this.appEnv);
        } catch (e) {
          wait = 500;
          console.log(e); // 领券失败也不阻塞下单
        }
      } else {
        let key = 'data_act.product_page.sku_0btn';
        if (this.isBuyWithActivity) {
          switch (Number(this.activityInfo.activity_type)) {
            case ACTIVITY_TYPE.SecKill:
              key = 'data_act.product_page.sku_2btn';
              break;
            case ACTIVITY_TYPE.PinTuan:
              key = this.groupId === '0' ? 'data_act.product_page.sku_3btn' : 'data_act.product_page.sku_4btn';
              break;
          }
        }
        reportToSudaOrActLog('xd_chan', { wbxd_stats: key }, this.appEnv);
      }
      const submitParams = {
        shopId: this.shop_id,
        skuId: this.currentSku.sku_id,
        buyerUid: this.buyerUid,
        goodsId: this.goods_id,
        storeId: (this.currentStore && this.currentStore.id) || '',
        pid: this.pid,
        pid_only: this.pid_only,
        skuCount: this.purchaseVolume,
        liveid: this.live_id,
        live_id: this.live_id,
        chan: this.chan || '',
        addressId: this.addressId || '',
        activityType: (this.isInActivity && this.isActivityStart && this.activityInfo.activity_type) || '',
        iid: this.iid || '',
        act_code: this.act_code || '',
        mark_id: this.mark_id || '',
        first_source: this.appEnv.query.first_source || '',
        mid: this.appEnv.query.mid || '',
        detail_source: this.detailSource || '',
        page: this.pageQuery || '',
        groupId:
          this.isInActivity
          && Number(this.activityInfo.activity_type) === ACTIVITY_TYPE.PinTuan
          && this.activityInfo.activity_stock
          && this.groupId !== undefined
            ? this.groupId
            : '',
        page_id: '',
        start_time: '',
        end_time: '',
        search_word: this.search_word,
      };
      if (this.page === 'super_topic') {
        submitParams.page_id = this.defaultGoodsInfo?.super_topic?.page_id || '';
        submitParams.start_time = this.defaultGoodsInfo?.super_topic?.start_time || '';
        submitParams.end_time = this.defaultGoodsInfo?.super_topic?.end_time || '';
      }
      if (Number(submitParams.activityType) === 3) {
        submitParams.points = this.currentSku?.price?.points || 0;
      }
      if (this.pageMode === 'seckill') {
        submitParams.page_mode = 'seckill';
      }
      submitParams.wait_time = wait;
      if (this.goodsInfo.forbid_buy === 2) {
        submitParams.activityType = 0
      }
      debounce(() => {
        toOrder(submitParams);
        this.$emit('onClose');
      }, wait)();
    },
    receiveCoupon() {
      return new Promise((resolve, reject) => {
        receiveApi({
          goods_id: this.goods_id,
          weibo_uid: this.uid_weibo,
          sku_id: this.currentSku.sku_id,
          sku_count: this.purchaseVolume,
          shop_id: this.merchant_uid, // 这里的shop_id是商家uid
        })
          .then((res) => {
            if (String(res.code) === '0') {
              setTimeout(() => {
                wbx.showToast({
                  title: '已自动为您领取最优优惠券，下单更省钱',
                  icon: 'success',
                  duration: 3000,
                });
              }, 0);
              return resolve(res);
            } else if (String(res.code) === '110004') {
              setTimeout(() => {
                wbx.showToast({
                  title: '很遗憾，券被抢光',
                  icon: 'warn',
                  duration: 3000,
                });
              }, 0);
              return resolve(res);
            }
            return resolve(res);
          })
          .catch((err) => {
            // TODO
            // setTimeout(() => {
            //   wbx.showToast({
            //     title: err.msg || '抱歉，领券失败',
            //     icon: "warn",
            //     duration: 3000
            //   });
            // }, 0);
            return resolve(err); // 领券失败也不要阻塞下单),
          });
      });
    },
    changeSku(sku, mode = '') {
      if (sku) {
        this.currentSku = sku;
        if (mode !== 'silent') {
          this.$emit('onChangeSku', this.currentSku);
        }
      }
    },
    confirmSelectSku(mode = '') {
      if (this.openFrom === 'cart') {
        if (this.purchaseVolume === 0) {
          this.toast.warn('购买数量不能为0');
          return;
        }
        const isValid = this.checkBuyLimit();
        if (!isValid) {
          return;
        }
      }
      if (mode !== 'silent') {
        this.$emit('onConfirmSelect', this.currentSku, this.purchaseVolume);
        if (this.presell) {
          emitter.emit('presellRemind', 'cart');
        }
      }
    },
    onClickMin() {
      if (this.purchaseVolume > 0 && !this.minDisabled) {
        this.purchaseVolume -= 1;
      } else {
        this.toast.warn('商品数量最小为1');
      }
    },
    onClickAdd() {
      if (this.isYiMeiGoods && this.purchaseVolume >= 10) {
        this.toast.warn('商品至多购买10件，请分开结算');
      } else if (this.purchaseVolume < this.purchaseMax && !this.plusDisabled) {
        this.purchaseVolume += 1;
      } else {
        // TODO: 弹toast提示
        // if (this.purchaseLimit && this.plusDisabled) {
        //   this.toast.warn(`每人限购${this.purchaseLimit}件`);
        // } else {
        // this.toast.warn(this.isVirtualGoods ? '件数超过范围了~' : '超出库存范围～');
        // }
        this.showMaxtip();
      }
    },
    purchaseVolumeInput(e) {
      const value = e.target.value;
      this.purchaseVolume = value.replace(/[^\d]/g, '');
      const actStock = this.activityInfo?.activity_stock ?? 0;
      // const max = this.purchaseLimit || actStock || this.stock || this.purchaseMax;
      // 取this.purchaseLimit, actStock, this.stock, this.purchaseMax中不为0且最小的值

      const buyLimit = Number(this.goodsInfo.buy_limit_num);
      const max = Math.min(
        ...[this.purchaseLimit, actStock, this.stock, this.purchaseMax, buyLimit].filter((item) => item !== 0)
      );
      if (this.isYiMeiGoods && this.purchaseVolume > 10) {
        if (max > 10) {
          this.toast.warn('商品至多购买10件，请分开结算');
          this.purchaseVolume = 10;
        } else {
          this.showMaxtip();
          this.purchaseVolume = max;
        }
      } else if (this.isEjournal && this.purchaseVolume > 50) {
        if (max > 50) {
          this.toast.warn('商品单次最多购买50件');
          this.purchaseVolume = 50;
        } else {
          this.showMaxtip();
          this.purchaseVolume = max;
        }
      } else if (this.purchaseVolume > max) {
        // this.toast.warn(this.isVirtualGoods ? '件数超过范围了~' : '超出库存范围～');
        this.showMaxtip();
        this.purchaseVolume = max;
      }
    },
    showMaxtip() {
      const buyLimit = Number(this.goodsInfo.buy_limit_num); // 不限购时， this.goodsInfo.buy_limit_num为0
      const activityLimit = Number(this.activityInfo.buy_limit);

      let minLimit = 0;

      if (buyLimit > 0) {
        minLimit = buyLimit - activityLimit > 0 ? activityLimit : buyLimit;
      } else {
        minLimit = activityLimit || 0;
      }

      // const stock = Number(this.stock);
      // const activityStock = Number(this.activityInfo.activity_stock ?? 0);
      // const minStock = stock - activityStock > 0 ? activityStock : stock;
      this.toast.warn(minLimit > 0 ? `该商品每人限购${minLimit}件或已达到库存上限～` : '已达到库存上限～');
    },
    purchaseVolumeChange() {
      // 删除第一位0
      const value = this.purchaseVolume.toString();
      if (value.length > 1 && value[0] === '0') {
        this.purchaseVolume = Number(value.slice(1));
      } else {
        this.purchaseVolume = Number(value);
      }
    },
    purchaseVolumeFocus() {
      const roolboxEl = this.$refs.rollbox;
      const sHeight = roolboxEl.scrollHeight;
      this.purchaseInputFocus = true;
      this.bodyTop = document.documentElement.scrollTop || document.body.scrollTop;
      setTimeout(() => {
        roolboxEl.scrollBy(0, sHeight);
      }, 300);
    },
    purchaseInputBlur() {
      this.purchaseInputFocus = false;
      const scrollEl = document.documentElement || document.body;
      scrollEl.scrollTo(0, this.bodyTop);
    },

    onChangeSpecItem(item) {
      const isSpecNotActionable = !this.actionableSpecIdList.some((id) => Number(id) === Number(item.spec_id));
      const isSpecSoldOut = this.checkSpecSoldOut(item.spec_id);
      if (isSpecNotActionable || isSpecSoldOut) {
        return;
      }
      const targetSku = this.skuUtil.findTargetSku(item.spec_id);
      if (!targetSku) {
        return;
      }
      // this.sourceSkus = this.skus.filter((sku) => sku.spec_id.split(',').includes(String(item.spec_id))); // 根据选择的spec找到匹配的sku
      this.changeSku(this.sourceSkus.find((sku) => Number(sku.sku_id) === Number(targetSku.skuId)));
      this.$nextTick(() => {
        this.currentStore = this.storeList[0] || {};
        this.selectedStore = this.currentStore;
      });
      try {
        setTimeout(() => {
          this.reportOnce.sku_spec && this.reportOnce.sku_spec();
          this.reportOnce.sku_spec = null;
        }, 0);
      } catch (e) {
        console.log('log error', e);
      }
    },
    getSpecOptionsByDisplayedSpecList(specs) {
      return (specs && specs.filter((spec) => this.actionableSpecIdList.includes(Number(spec.spec_id)))) || [];
    },
    onClickBack(backTo) {
      let query = {};
      let queryStr = {};
      let goodsList = {};
      switch (backTo) {
        case 'goods_list':
          if (!this.live_id || !this.cid || !this.anchor_id) {
            this.closeContainer();
            return; // 从购物袋过来的 就再回购物袋
          }
          query = {
            protocol: this.protocol,
            live_id: this.live_id,
            anchor_id: this.anchor_id,
            cid: this.cid,
            busi_from: 'live',
          };
          queryStr = this.getQueryStr(query);
          goodsList = `https://m.weibo.cn/c/wbox?id=td7r7aawwr&page=pages/goodsList/goodsList&${queryStr}`;
          this.goto(goodsList);
          break;
        case 'sku':
          this.showInfo = 'sku';
          break;
        default:
          this.$emit('onClose');
          return;
      }
    },
    onClickStore(id) {
      this.showInfo = 'store';
    },
    handleClickStore(store) {
      this.selectedStore = store;
    },
    async handleClickCustomService(store) {
      const { id, store_weibo_uid } = store;
      const { goods_id } = this.goodsInfo;
      goToCustomService({
        uid: store_weibo_uid || this.retailerWeiboId || 7583809100,
        storeId: id,
        goodsId: goods_id,
      });
    },
    handleClickStoreIcon(store) {
      try {
        if (this.pid_only) {
          // 同店计佣
          reportCPSApi({
            trace_pid: this.pid_only,
            trace_type: '2',
            goods_id: this.goods_id,
            shop_id: this.shop_id,
            trace_pos: this.pageQuery,
            trace_url: window.location.href,
            trace_msg: this.chan,
            retail_uid: this.goodsInfo.weibo_uid,
            iid: this.iid,
          });
        }
      } catch (e) {
        console.log(e);
      }
      let storeUrl = `https://shop.e.weibo.com/v2/store-detail?storeId=${store.id}`;
      const { weibo_kefu_uid } = this.goodsInfo;
      if (weibo_kefu_uid) {
        storeUrl += `&kefu_uid=${weibo_kefu_uid}`;
      }
      openWebView(storeUrl);
    },
    isSelectedStore(storeId) {
      return this.selectedStoreId === storeId;
    },
    onClickConfirmStore() {
      this.currentStore = this.selectedStore;
      if (this.mode === 'series') {
        this.showInfo = 'sku';
      }
      this.$emit('onChangeStore', this.currentStore, this.mode);
    },
    isColorSpec(specName) {
      return specName === '颜色' || specName === '颜色分类';
    },
    getSpecMatchSkuRemark(specId) {
      const getRemark = () => {
        const resultSkus = this.sourceSkus.filter((sku) => {
          const skuSpecs = sku.spec_id.split(',');
          return skuSpecs.length > 0 && skuSpecs.includes(String(specId));
        });
        return (resultSkus[0] && resultSkus[0].remark) || '';
      };

      if (this.currentSku) {
        const skuSpecs = this.currentSku.spec_id.split(',');
        if (skuSpecs.length > 0 && skuSpecs.includes(String(specId))) {
          return this.currentSku.remark;
        } else {
          const remark = getRemark();
          return remark;
        }
      } else {
        const remark = getRemark();
        return remark;
      }
    },
    getSpecMatchSkuCover(specId) {
      const resultSkus = this.sourceSkus.filter((sku) => {
        const skuSpecs = sku.spec_id.split(',');
        return skuSpecs.length > 0 && skuSpecs.includes(String(specId));
      });
      return (resultSkus[0] && resultSkus[0].cover) || '';
    },
    previewSkuCover(cover) {
      previewImage([cover]);
    },
    checkBuyLimit() {
      // 当商品未报名活动或活动未开始时，以所设置的商品限购数为准
      if (
        !this.isInActivity
        && this.goodsInfo.buy_limit_type === BUY_LIMIT_TYPE.GoodsLimit
        && this.goodsInfo.buy_limit_num
        && this.purchaseVolume > Number(this.goodsInfo.buy_limit_num)
      ) {
        this.toast.success(`该商品每人限购${this.goodsInfo.buy_limit_num}件~`);
        return false;
      }

      // 单次限购判断
      if (
        !this.isInActivity
        && this.goodsInfo.buy_limit_type === BUY_LIMIT_TYPE.GoodsOnceLimit
        && this.goodsInfo.buy_limit_num
        && this.purchaseVolume > Number(this.goodsInfo.buy_limit_num)
      ) {
        this.toast.success(`该商品单次限购${this.goodsInfo.buy_limit_num}件~`);
        return false;
      }

      /// 秒杀限购校验 （当商品活动生效时，限购以活动限购为准）
      if (this.isInActivity && this.isActivityStart) {
        // 极端场景下会出现商家在设置营销活动时“活动限购”数量大于“商品限购”数量，此时以“商品限购”为准；
        let limit = this.activityInfo.buy_limit;
        if (
          this.goodsInfo.buy_limit_type === BUY_LIMIT_TYPE.GoodsLimit
          && limit
          && this.goodsInfo.buy_limit_num
          && Number(limit) > Number(this.goodsInfo.buy_limit_num)
        ) {
          limit = this.goodsInfo.buy_limit_num;
        }
        if (limit && Number(this.count) > Number(limit)) {
          // TODO
          this.toast.success(`该商品每人限购${limit}件~`);
          return false;
          // return uni.showToast({
          //   title: `该商品每人限购${limit}件~`,
          //   icon: 'none'
          // });
        }
      }

      // TODO: 商家秒杀限购校验 暂时保持线上原样
      // if (this.isInActivity && isActivityStart) {
      //   const orderedNum = 0; //
      //   if (this.purchaseLimit && this.purchaseVolume + orderedNum - this.purchaseLimit > 0) {
      //     this.toast.warn(`本活动商品限购${this.purchaseLimit}件`);
      //     return false;
      //   }
      // }
      return true;
    },
    getProcessSubName(subName = '') {
      const arr = subName.split(' ');
      return {
        date: arr[0] || '',
        time: arr.length > 1 ? arr[1] : '',
      };
    },
  },
};
</script>
<style lang="scss" scoped>
$ui_base: 414;
//视觉稿(414视觉稿转换)
@function _vw_($px) {
  @return ($px / $ui_base) * 100vw;
}
//直播间折叠屏问题，使用px开发
@keyframes slidein {
  from {
    transform: translateY(100%);
  }

  // 50% { transform: translateY(50%) !important;}

  to {
    transform: translateY(0%);
  }
}

.close-area {
  height: 35vh;
  background-color: transparent;
  position: fixed;
  top: 0px;
  right: 0px;
  width: 100%;
  z-index: 999;
}

@keyframes slideleft {
  from {
    transform: translateX(-50%);
  }

  to {
    transform: translateX(-50%);
  }
}

@keyframes slideright {
  from {
    transform: translateX(100%);
  }

  to {
    transform: translateX(0%);
  }
}

.wrapper {
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: 1000;
  top: 0px;
  left: 0px;
}

.mask {
  position: fixed;
  z-index: 1000;
  width: 100%;
  height: 100%;
  background-color: black;
  opacity: 0.4;
}

.main-container {
  background-color: #ffffff;
  width: 100%;
  border-radius: _vw_(10) _vw_(10) 0px 0px;
  position: absolute;
  bottom: 0;
  height: 60vh;

  &.higher {
    height: 70vh;
  }

  // max-height: 80vh;
  // min-height: 50vh;
  transform: translateY(100%);
  z-index: 1001;
  animation-duration: 300ms !important;

  .content-wrapper {
    // float: left;
    width: 100%;
    height: 100%;
  }

  .header-wrapper {
    width: 100%;
    // height: 140px;
    display: flex;
    flex-direction: column;
    background-color: #ffffff;
    border-radius: _vw_(10) _vw_(10) 0px 0px;
    overflow: hidden;
  }

  .hairline-border-bottom {
    border-bottom-color: #e6e6e6;
  }

  .hairline-border-top {
    border-top-color: #e6e6e6;
  }

  .header {
    // position: absolute;
    // top: 0;
    // width: 90%;
    padding: _vw_(18) _vw_(15);
    // padding-left: 12px;
    // background-color: #ffffff;
    border-radius: _vw_(10) _vw_(10) 0px 0px;
    z-index: 1001;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;

    // margin-bottom: 16px;
    .icon-close {
      background-image: url(../../res/common/drawer-close.png);
      background-size: 100%;
      width: _vw_(12);
      height: _vw_(12);
      position: absolute;
      top: _vw_(16.6);
      right: _vw_(16);
    }

    .cover {
      width: _vw_(80);
      height: _vw_(80);
      border-radius: _vw_(6);
      object-fit: cover;
    }

    .right {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      margin-left: 12px;

      .price {
        color: #ff8200;
        line-height: 24px;
        font-weight: 600;
        margin-top: 4px;
        margin-bottom: 3px;
        font-family: 'PingFangSC-Medium';
        font-size: 24px;
        font-weight: 600;
        padding: 0px;

        b {
          font-size: 16px;
        }
      }

      .point-price {
        position: relative;
        margin-right: 8px;
        font-family: PingFangSC-Medium;
        font-size: 16px;
        color: #ff8200;
        line-height: 24px;

        .unit {
          position: relative;
          bottom: 1px;
        }

        .symbol {
          font-size: 16px;
        }

        .num {
          font-size: 24px;
        }
      }

      i {
        font-family: 'PingFangSC-Regular';
        font-size: 12px;
        color: #939393;
        letter-spacing: 0.34px;
        font-weight: 400;
        font-style: normal;
        margin-bottom: 3px;
        padding: 0px;
      }

      .sku-name {
        color: #333333;
        display: block;
        font-family: 'PingFangSC-Regular';
        font-size: 12px;
        color: #333333;
        line-height: 14px;
        font-weight: 400;
      }
    }
  }

  .store-section {
    margin-bottom: 14px;

    div {
      display: flex;
      flex-direction: column;
      margin-top: 5px;
    }

    .spec-title-section {
      display: flex;
      flex-direction: row;
      position: relative;
      justify-content: space-between;
      margin-right: 16px;

      &:after {
        background-image: url('https://h5.sinaimg.cn/upload/100/1610/2022/08/19/arrow_right.png');
        background-size: 100%;
        position: absolute;
        content: '';
        width: 8px;
        height: 14px;
        right: -12px;
        top: 8px;
      }
    }

    .spec-title-right {
      font-size: 14px;
      color: #939393;
      letter-spacing: 0.4px;
      font-weight: 500;
      font-family: PingFangSC-Regular;
    }

    .spec-title {
      font-size: 14px;
      color: #333333;
      letter-spacing: 0.4px;
      font-weight: 500;
      font-family: PingFangSC-Regular;

      span {
        font-family: 'PingFangSC-Regular';
        font-size: 12px;
        color: #333333;
        font-weight: 400;
      }

      i {
        font-family: 'PingFangSC-Regular';
        font-size: 11px;
        color: #939393;
        text-align: justify;
        line-height: 18px;
        font-weight: 400;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        max-height: 35px;
      }
    }

    .icon-store {
      padding-left: 18px;
      position: relative;

      &::before {
        content: '';
        position: absolute;
        left: 0px;
        top: 6px;
        width: 16px;
        height: 16px;
        background-image: url(../../res/icon-store.png);
        background-repeat: no-repeat;
        background-size: 100%;
      }
    }

    .store-tags {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      align-items: flex-start;
      flex-direction: row;
      margin-top: 2px;

      span {
        font-family: PingFangSC-Regular;
        font-size: 10px;
        color: #ff8200;
        margin-right: 5px;
        margin-top: 2px;
        display: inline-block;
        height: 16px;
        line-height: 16px;
        padding: 2px 2px 0 3px;
        border-radius: 2px;
        position: relative;

        &::after {
          position: absolute;
          content: '';
          width: 200%;
          height: 200%;
          border: 1px solid rgba(255, 130, 0, 0.6);
          left: -50%;
          top: -50%;
          transform: scale(0.5);
        }
      }
    }

    span {
      font-family: 'PingFangSC-Regular';
      font-size: 12px;
      color: #333333;
      font-weight: 400;
      margin: 5px 0;
    }

    i {
      font-family: 'PingFangSC-Regular';
      font-size: 12px;
      color: #939393;
      text-align: justify;
      line-height: 18px;
      font-weight: 400;
      font-style: normal;

      span {
        color: #939393;
      }

      // display: -webkit-box;
      // -webkit-line-clamp: 2;
      // -webkit-box-orient: vertical;
      // overflow: hidden;
      // max-height: 35px;
    }
  }

  .expiry-tip {
    color: #939393;
    // width: 344px;
    height: 28px;
    background: #f7f8f9;
    border-radius: 6px;
    font-family: 'PingFangSC-Regular';
    font-size: 12px;
    line-height: 28px;
    font-weight: 400;
    padding: 0 4px;
    margin: 0 12px 12px;
    // left: 20px;
    // margin-left: 20px;
    // margin-right: 20px;
    // margin-bottom: 14px;
  }

  .buy-type {
    padding: 16px;
    overflow-y: scroll;
  }

  .sku-wrapper {
    padding: 16px 16px 124px 16px;
    // margin-top: -28px;
    // margin-bottom: 100px;
    overflow-y: scroll;
    max-height: 30vh;

    &.higher {
      max-height: 40vh;
    }

    &.padding-large {
      // margin-top: 10px;
      padding-bottom: 180px;
      max-height: 26vh;
    }

    .spec-group {
      margin-bottom: 14px;

      &.row {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
      }

      .spec-title {
        font-family: 'PingFangSC-Regular';
        font-size: 14px;
        line-height: 14px;
        color: #333333;
        letter-spacing: 0.4px;
        // font-weight: 500;
        margin-bottom: 16px;
        font-style: normal;

        .limit {
          font-size: 14px;
          color: rgb(128, 127, 127);
          padding-left: 14px;
        }

        .purchase-limit {
          color: rgb(128, 127, 127);
          padding-left: 4px;
        }
      }

      .spec-title-num {
        margin-bottom: 0;
      }

      .spec-items {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        align-items: center;
        justify-content: flex-start;
      }

      .spec-item {
        min-width: 30px;
        height: 34px;
        margin-right: 12px;
        color: #939393;
        letter-spacing: 0.34px;
        line-height: 34px;
        font-weight: 400;
        padding: 0 12px;
        margin-bottom: 12px;
        background: rgba(255, 255, 255, 0.1);
        // border: 1px solid #939393;
        border-radius: 17px;
        font-family: 'PingFangSC-Regular';
        font-size: 14px;
        color: #939393;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        border-color: #939393;

        &::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 200%;
          height: 200%;
          transform: scale(0.5);
          transform-origin: left top;
          border-radius: 68px;
          box-sizing: border-box;
          border: 1px solid #939393;
          border-color: inherit;
        }

        span {
          max-width: 100%;
          display: inline-block;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }

        img {
          width: 24px;
          height: 24px;
          object-fit: cover;
          margin-right: 6px;
        }

        &.active {
          color: #ff8200;
          background: rgba(255, 130, 0, 0.1);
          // border: 1px solid #ff8200;
          color: #ff8200;
          border-color: #ff8200;
        }

        &.disabled {
          color: #c9c9c9;
          background: #f6f6f6;

          &::after {
            border: 0;
          }
        }

        i {
          position: absolute;
          top: -10px;
          right: -10px;
          font-size: 10px;
          background-color: #cccccc;
          font-style: normal;
          padding: 0 5px;
          border-radius: 6px;
          line-height: 20px;
          color: #ffffff;
          opacity: 1;
          z-index: 1;
        }
      }

      .spec-item_ticket {
        flex-wrap: wrap;
        max-width: _vw_(280);
        height: auto;
        padding-left: _vw_(20);
        padding-top: _vw_(8);
        padding-bottom: _vw_(8);
        line-height: _vw_(16);
        border-radius: 34px;
        span {
          display: block;
          width: 100%;
          text-overflow: clip;
          white-space: normal;
          overflow: visible;
          text-align: left;
        }
      }

      .purchase-volume {
        display: flex;
        flex-direction: row;
        align-items: center;

        .num {
          font-family: PingFangSC-Medium;
          font-size: 14px;
          color: #333333;
          letter-spacing: 0;
          line-height: 24px;
          // margin: 0 12px;
          width: 46px;
          text-align: center;
          background: #f5f5f5;
          border-radius: 4px;
          border: none;

          &:disabled,
          &[disabled] {
            -webkit-text-fill-color: #333;
            opacity: 1;
          }
        }

        .btn-min {
          width: 12px;
          height: 12px;
          background-size: 100%;
          background-image: url(../../res/btn-min.png);
          margin-right: 11px;

          &.disabled {
            opacity: 0.4;
          }
        }

        .btn-add {
          width: 12px;
          height: 12px;
          background-size: 100%;
          background-image: url(../../res/btn-add.png);
          margin-left: 11px;

          &.disabled {
            opacity: 0.6;
          }
        }
      }
    }
  }

  .confirm-wrapper {
    width: 100%;
    position: fixed;
    bottom: 0px;
    left: 0px;
    background-color: #ffffff;
    height: 54px;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2;

    &-inner {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 10px _vw_(14) 2px;
      width: 100%;
      box-sizing: border-box;
    }
  }

  .confirm-button {
    // position: absolute;
    // margin-bottom: 26px;
    // bottom: 0;
    width: 100%;
    font-size: 16px;
    color: #f0241b;
    text-align: center;
    // left: 50%;
    // transform: translateX(-50%);
    // padding-top: _vw_(1.5);
    line-height: 42px;
    background-color: #ffffff;
    height: 42px;
    background-image: linear-gradient(90deg, #ff8200 0%, #ffbc33 99%);
    border-radius: 21px;

    font-family: 'PingFangSC-Medium';
    font-size: 16px;
    color: #ffffff;
    text-align: center;
    font-weight: 500;

    &.activity {
      background-image: linear-gradient(90deg, #ff2d61 0%, #ff7e53 100%);
    }

    &.coupon {
      background-image: linear-gradient(90deg, #ff2d61 0%, #ff7e53 100%);
    }

    &.disabled {
      opacity: 0.5;
      color: rgba(255, 255, 255, 0.4);
    }

    .jifen-btn {
      color: #FFFFFF;
      font-family: PingFang SC;
      font-weight: 400;
      font-size: 16px;
      line-height: normal;
      letter-spacing: 0px;
      text-align: center;
    }

    .jifen-buzhu {
      height: 100%;
      display: flex;
      flex-direction: column;

      .buzhu-tip {
        color: #FFFFFF;
        font-family: PingFang SC;
        font-weight: 400;
        font-size: 12px;
        height: 12px;
        line-height: 12px;
        letter-spacing: 0px;
        text-align: center;
        margin-top: 7px;
      }

      .buzhu-btn {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        color: #FFFFFF;
        // margin-top: 2px;
        font-family: PingFang SC;
        font-weight: 500;
        font-size: 16px;
        line-height: 16px;
        // height: 16px;
        letter-spacing: 0px;
        text-align: center;
      }
    }
  }

  .pre-payment-button-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 21px;
    overflow: hidden;
    width: 100%;

    .confirm-button {
      width: 50%;
      border-radius: 0;
    }
  }

  .tip {
    font-family: 'PingFangSC-Regular';
    font-size: 12px;
    background: #fed;
    color: #ff8200;
    line-height: 35px;
    background: rgba(255, 130, 0, 0.05);
    white-space: nowrap;
    position: relative;
    width: 100%;
    height: 35px;
    text-align: center;
  }

  .store-item-wrapper {
    padding: 0 12px;
    padding-top: 24px;
    //padding-left: 12px;
    overflow-x: hidden;
    overflow-y: scroll;
    height: 100%;
    padding-bottom: 200px;
    max-height: 40vh;

    .higher {
      max-height: 45vh;
    }

    // padding-bottom: 200px;
    // max-height: 60vh;
    // display: flex;
    // flex-direction: column;
    // justify-content: center;
    // align-items: center;
  }

  .store-header {
    padding: _vw_(18) _vw_(15);
    border-radius: _vw_(10) _vw_(10) 0px 0px;
    z-index: 1001;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;

    .icon-close {
      background-image: url(../../res/common/drawer-close.png);
      background-size: 100%;
      width: _vw_(12);
      height: _vw_(12);
      position: absolute;
      top: _vw_(16.6);
      right: _vw_(16);
    }
  }

  .aliCreditBox {
    width: 100%;
    height: 34px;
    position: absolute;
    bottom: 100%;
    background: #fed;
    color: #ff8200;

    .aliCreditBox-body {
      width: 100%;
      position: absolute;
      // background: #ffeedd;
      line-height: 34px;
      font-family: 'PingFangSC-Regular';
      text-align: center;
      left: 50%;
      top: 0px;
      transform: translateX(-50%);
      font-family: 'PingFangSC-Regular';
      font-size: 12px;
      text-align: center;
      font-weight: 400;
    }
  }
}

@media screen and (min-width: 600px) {
  .mask {
    width: 600px;
    left: 50%;
    transform: translateX(-50%);
  }

  .main-container {
    width: 600px;
    left: 50%;
    transform: translateX(-50%);
    animation-name: smallslidein;
  }

  @keyframes smallslidein {
    from {
      transform: translateY(100%);
      transform: translateX(-50%);
    }

    to {
      transform: translateY(0%);
      transform: translateX(-50%);
    }
  }
}
</style>
