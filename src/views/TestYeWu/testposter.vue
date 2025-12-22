<template>
  <div class="star-poster" @touchmove.stop>
    <div class="mask" @click.stop="handleColse"></div>
    <div :class="['body', skuList && skuList.length > 0 ? 'body-list' : '']" >
      <div class="content-wrapper" v-if="!showGenerate && skuList && skuList.length > 0">
        <div class="content">
          <swiper :class="{'swiper':true, 'swiper-camera': skuList[0].poster_tpl == 2}" :autoplay="false" :indicator-dots="skuList && skuList.length > 1" indicator-color="#FFFFFF"
            indicator-active-color="#FF8200" @change="swiperChange">
            <block v-for="(item, index) in skuList" :key="index">
              <swiper-item>
                <div class="swiper-item" ref="swiperItem">
                  <star-poster-item :posterInfo="item" :index="index"></star-poster-item>
                </div>
              </swiper-item>
            </block>
          </swiper>
        </div>

        <div class="show-btn">
          <div class="arrow"></div>
          <a class="showSaveBtn" href="javascript:;" ref="showSaveBtn" @click.stop="handleShowOff"/>
        </div>
      </div>
      <poster-generation v-if="showGenerate" @generatePoster="handleGeneratePoster"></poster-generation>
      <div class="saveImg" v-if="!showGenerate && skuList && skuList.length > 0" @click.stop="hanldeSaveImg"></div>
    </div>
  </div>
</template>
<script>
import StarPosterItem from './StarPosterItem.vue';
import html2canvas from 'html2canvas';
import { saveImage } from '@weibovip/weibo-jsbridge';  // 引入saveImage
import { getAppEnv } from '@/common/common';
import { setWeiboSharingContent, invokeShare } from '@/utils/tool';
import { mapGetters } from 'vuex';
import { getShopIIDInfoApi } from '../../api/daogou';
import PosterGeneration from './PosterGeneration.vue';
import { uploadBase64Api } from '@/api/upload';
import { openWebView } from '../../utils/bridge';

// @ts-ignore
export default {
  components: { StarPosterItem, PosterGeneration },
  name: 'StarPoster',
  data() {
    return {
      currSwipeIndex: 0,
      generateImging: false,
      isShowing: false, // 是否点击了炫耀一下
      posterPicObj: {}
    };
  },
  props: {
    skuList: {
      type: Array,
      default: () => []
    },
    showGenerate: {
      type: Boolean,
      default: false
    },
    source: {
      type: String,
      default: ''
    },
  },
  computed: {
    ...mapGetters({
      account: 'account',
    }),
  },
  methods: {
    handleShowOff() {
      if (this.isShowing) return;

      this.isShowing = true;

      try {
        this.generateImage('SENDBLOG');
      } catch(err) {
        console.log('== generate img error', err);
      }

      this.track('act');
    },
    swiperChange(e) {
      this.currSwipeIndex = e.detail.current;
    },
    handleColse() {
      document.body.classList.remove('lock-html');
      this.$emit('closePopup');
    },
    hanldeSaveImg() {
      try {
        this.generateImage();
      } catch(err) {
      }

      const map = {
          PAY: `data_act.zhifu.postersave_a`,
          DETAIL: `data_act.zhifu.postersave_c`,
          LIST: `data_act.zhifu.postersave_b`,
      };

      const trackINfo = map[this.source || ''];

      if (trackINfo) {
        this.reportToSudaWithStoreManage('zhifu', {
          wbxd_stats: trackINfo,
        });
      }
    },
    async sharePoster() {
      const currIndex = this.currSwipeIndex || 0;
      let shareInfo = {};

      if (this.skuList && this.skuList.length > 0) {
        shareInfo = this.skuList[currIndex] ? this.skuList[currIndex] || {} : (this.skuList[0] || {});
      } else {
        shareInfo = {}
      }

      let shareConent = shareInfo.content;
      const content = encodeURIComponent(shareConent);
      const pics = [this.posterPicObj] || [];

      this.isShowing = false;

      openWebView(`sinaweibo://sendweibo?content=${content}&pics=${JSON.stringify(pics)}`);
    },
    generateImage(taskName = '') {
      const self = this;
      const swiperItemElem = self.$refs['swiperItem'];
      const currIndex = this.currSwipeIndex || 0;
      const currentElem = swiperItemElem && swiperItemElem.length > 0 ? swiperItemElem[currIndex] : null;
      // @ts-ignore
      // const scale = self.getDPR();

      if(!currentElem) {
        uni.showToast({
          icon: 'none',
          title: '生成图片失败,请重试～'
        });

        return;
      }

      uni.showToast({
        icon: 'none',
        title: '正在生成'
      });

      if (this.generateImging) {
        return;
      }

      this.generateImging = true;

      this.$nextTick(() => {
        const currentElemWidth = currentElem.clientWidth;
        const currentElemHeight = currentElem.clientHeight;

        setTimeout(() => {
          html2canvas(currentElem, {
            allowTaint: true,
            width: currentElemWidth,
            height: currentElemHeight,
            useCORS: true,
            // scale,
          }).then(async (canvas) => {
            // 将canvas转换成图片渲染到页面上
            self.imgBase64 = canvas.toDataURL('image/png');// base64数据
            await self.upLoadBase64(self.imgBase64, taskName).catch(result => result);

            self.generateImging = false;
          }).catch((err) => {
            self.generateImging = false;
            uni.showToast({
              icon: 'none',
              title: '图片保存失败'
            });
          });
        }, 0);
      });
    },
    getDPR() {
      if (window.devicePixelRatio && window.devicePixelRatio > 1) {
        return window.devicePixelRatio;
      }
      return 1;
    },
    async upLoadBase64(imgBase64, taskName = '') {
      const data = {
        content: imgBase64 || '',
      };

      const res = await uploadBase64Api(data.content).catch(result => result);//uploadBase64Api().catch((res) => res);

      if (res && res.code === 0) {
        this.$nextTick(() => {
          console.log('== test url ', res.data.url);
          this.testUrl = res.data.url;
          const data = res.data || {};
          this.posterPicObj = {
            thumbnail: data.thumb,
            original: data.url,
            pid: data.pic_id
          }
          if (taskName === 'SENDBLOG') {
            this.sharePoster()
          }
          this.downloadImg(res.data.url || imgBase64);
        });
      } else {
        console.log('上传失败', res);
      }
    },
    downloadImg(url) {
      saveImage({
        image_url: url,
        onSuccess: () => {
          uni.showToast({
            icon: 'none',
            title: '图片已保存到本地相册'
          });
        },
        onFail: () => {
          uni.showToast({
            icon: 'none',
            title: '图片保存失败'
          });
        }
      });
    },
    handleGeneratePoster() {
      this.$emit('getPosterAgain');
    },
    track(trackType = 'exp') {
      const map = {
          PAY: `data_${trackType}.zhifu.poster_a`,
          DETAIL: `data_${trackType}.zhifu.poster_c`,
          LIST: `data_${trackType}.zhifu.poster_b`,
      };

      const trackINfo = map[this.source || ''];

      if (trackINfo) {
        this.reportToSudaWithStoreManage('zhifu', {
          wbxd_stats: trackINfo,
        });
      }
    }
  },
  mounted() {
    this.track('exp');
    document.body.classList.add('lock-html'); // 解决滚动穿透
  },
  beforeDestroy() {
    document.body.classList.remove('lock-html'); // 解决滚动穿透
  }
}
</script>
// item
<template>
  <div class="star-poster-item">
    <img src="../../static/images/star-poster/poster-bg.png" class="star-poster-img"/>
    <div class="title">
        <span class="dear">DEAR</span>
        <div class="appellation">
          <span class="appellation-content"><span class="name">{{ fansName }}</span><span v-if="nickName">@{{ nickName || '' }}</span></span><span class="colon">:</span>
          <div class="appellation-bg"></div>
      </div>
    </div>

    <div class="content">
      <span class="text-indent"></span><span>你是第&nbsp;<span class="ranked">{{ rank }}</span>&nbsp;位解锁 <span class="goods-title">{{ goodsTitle || '' }}</span>&nbsp;的Fans。愿这一份热爱可予你更多欢喜和期待，勇敢地奔赴人间山海～</span>
    </div>

    <!-- sku的封面图 -->
    <div class="sku-picture">
      <img :src="skuUrl" v-if="goodsSkuPictrue" />
    </div>

    <!-- 水印图片 -->
    <water-logo
      class="poster-logo"
      :logoUrl="logoUrl"
      :orderNum="rank"
      :nickName="nickName"
      :textColor="toneValue">
    </water-logo>

    <!-- 二维码 -->
    <div class="qrcode" v-html="canvasTpl">
    </div>
      <!-- <canvas class="qrcode-canvas" canvas-id="qrcode" /> -->

  </div>
</template>
<script>
import WaterLogo from './WaterLogo.vue';
// import uQRCode from '@/pages-order/uni_modules/Sansnn-uQRCode/components/uqrcode/common/uqrcode';
import QRCode from 'qrcode';
import { convertImgToBase64 } from '../../utils/tool';

export default {
  components: { WaterLogo },
  name: 'StarPosterItem',
  data() {
    return {
      canvasTpl: `<canvas id="qrcode-canvas0" class="qrcode-canvas"></canvas>`,
      skuUrl: ''
    };
  },
  props: {
    posterInfo: {
      type: Object,
      default: () => {}
    },
    index: {
      default: 0
    }
  },
  computed: {
    fansName() {
      return this.posterInfo && this.posterInfo.fans_named ? this.posterInfo.fans_named : '';
    },
    rank() {
      return (this.posterInfo || {}).sort || '';
    },
    goodsTitle() {
      return (this.posterInfo || {}).title || '';
    },
    nickName() {
      if ((this.posterInfo || {}).nickname && (this.posterInfo || {}).nickname.length > 7) {
        const name = (this.posterInfo || {}).nickname.slice(0, 6);
        return name + '...';
      } else {
        return (this.posterInfo || {}).nickname || '';
      }
    },
    goodsSkuPictrue() {
      return (this.posterInfo || {}).goods_cover || '';
    },
    logoUrl() {
      return (this.posterInfo || {}).image || '';
    },
    toneValue() {
      return (this.posterInfo || {}).tone_value || '';
    },
    goodsUrl() {
      return (this.posterInfo || {}).goods_url || '';
    }
  },
  mounted() {
    // this.makeQrCode();

    const idName = `qrcode-canvas${this.index}`;
    this.canvasTpl = `<canvas id="${idName}" class="qrcode-canvas"></canvas>`;

    this.$nextTick(() => {
      this.toQrCode();
      this.getSkuUrl(this.goodsSkuPictrue); // 将图片转成base64,防止跨域和生成海报时的图床有安全验证而缺失图片
    });
  },
  methods: {
    makeQrCode() {
      this.$nextTick(() => {
        uQRCode
          .make({
            canvasId: 'qrcode',
            componentInstance: this,
            size: 44,
            margin: 1,
            text: this.goodsUrl,
            backgroundColor: '#ffffff',
            foregroundColor: '#000000',
            fileType: 'png',
            errorCorrectLevel: uQRCode.errorCorrectLevel.H
          })
          .then(res => {
            console.log('== make code', res);
          });
      });
    },
    toQrCode() {
      let canvas = document.getElementById(`qrcode-canvas${this.index || 0}`)
      // let ctx = canvas.getContext('2d');
      // ctx.clearRect(0, 0, canvas.width, canvas.height);
      // ctx.fileStyle = "rgba(0, 0, 0, 0)";
      // ctx.fillRect(0, 0, canvas.width, canvas.height );

      QRCode.toCanvas(canvas, this.goodsUrl, function (error) {
        if (error) console.error(error)
        console.log('success!')
      })
      canvas.style.width = '48px'
      canvas.style.height = '48px'
      canvas.style.marginRight = '1px';
    },
    getSkuUrl(url) {
      convertImgToBase64(url)
        .then((res) => {
          if (res.success) {
            this.skuUrl = res.dataURL;
          } else {
            this.skuUrl = url;
          }
        })
        .catch((error) => {
          this.skuUrl = url;
        });
    },
  }
}
</script>

// video
<template>
    <view class="video-anim">
      <view class="video-content" v-html="cavansSrc"></view>
    </view>
</template>
<script>
import parseAPNG from 'apng-js';

export default {
  name: 'VideoAnim',
  data() {
    return {
      cavansSrc: `<canvas id="canvasVideo"></canvas>`,
    }
  },
  mounted() {
    this.loadPng();
  },
  methods: {
    // 获取图片并转化成 ArrayBuffer
    getImgBuffer(url) {
      return new Promise(async resolve => {
        const blob = await fetch(url).then(res => res.blob()).catch(result => result);
        const reader = new FileReader();
        reader.readAsArrayBuffer(blob);
        reader.onload = () => {
          resolve(reader.result);
        };
      });
    },
    async createApngPlayer(url, ctx, options = {}) {
      const imgBuffer = await this.getImgBuffer(url);
      const apng = parseAPNG(imgBuffer);

      if (apng instanceof Error) {
        return null;
      } else {
        Object.keys(options).forEach(key => {
          apng[key] = options[key];
        });
        const player = await apng.getPlayer(ctx);
        return player;
      }
    },
    async loadPng() {
      const canvas = document.querySelector('#canvasVideo')
      canvas.width = 750;
      canvas.height = 914;
      canvas.style = 'zoom: 0.5';
      const ctx = canvas.getContext('2d');

      try {
        const player1 = await this.createApngPlayer('https://js.t.sinajs.cn/t6/ec/statics/cmn/sources/poster-video.png', ctx, { numPlays: 1 }).catch(res => res); // 设置图1的 numPlays 为1，让其只播放一次

        if (player1 && player1.play) {
          player1.play(); // 图1播放
          player1.on('end', () => { // 监听图1的播放，当其播放完毕时，马上开始图2的播放
            console.log('== test end');
            this.$emit('videoPlayEnd', true);
          });
        } else {
          this.$emit('videoPlayEnd', false);
        }
      } catch(err) {
        this.$emit('videoPlayEnd', false);
      }
    }
  }
}
</script>
/**
 * 将图片地址转化为base64
 * @param {string} url 图片地址
 * @param {*} callback 回调函数
 * @param {string} outputFormat 图片输出格式
 */
export const convertImgToBase64 = (url, outputFormat = '') => {
  return new Promise((resolve, reject) => {
    try {
      let canvas = document.createElement('CANVAS');
      let ctx = canvas.getContext('2d');
      let img = new Image();
      const time = new Date().getTime();
      const paramStrArr = url ? url.split('?') : [];
      const hasSearchParam = paramStrArr && paramStrArr.length > 1 && paramStrArr[1];
      const timeStamp = hasSearchParam ? `&t=${time}` : `?t=${time};`;

      // setTimeout不写在ios中_img.onload不执行
      // setTimeout(() => {
      //   reject(new Error('onload not excute'));
      //   return true;
      // }, 2000);

      // 跨域处理
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const dWidth = Number(opt.width);
        const dHeight = Number(opt.height);
        const radio = dWidth / dHeight;
        const originRadio = img.width / img.height;
        const imgW = Number(img.width);
        const imgH = Number(img.height)

        if (dWidth > 0 && dHeight > 0 && imgW > 0 && imgH > 0 && (imgH > dHeight || imgW > dWidth) &&  radio != originRadio) {
          // 宽大
          if ((originRadio - radio) > 0) {
            const finalW = (dWidth * imgH) / dHeight;
            canvas.width = finalW;
            canvas.height = imgH;
            const x = (imgW - finalW) / 2;

            ctx.drawImage(img, x, 0, finalW, imgH, 0, 0, finalW, imgH);
          } else {
            // 高大
            const finalH = (dHeight * imgW) / dWidth;
            canvas.width = imgW;
            canvas.height = finalH;
            const y = (imgH - finalH) / 2;
            ctx.drawImage(img, 0, y, imgW, finalH, 0, 0, imgW, finalH);
          }
        } else {
          canvas.height = img.height;
          canvas.width = img.width;

          ctx.drawImage(img, 0, 0);
        }

        // ctx.drawImage(img, 0, 0);

        let dataURL = canvas.toDataURL(outputFormat || 'image/png');

        // callback.call(this, dataURL);
        canvas = null;
        resolve({
          success: true,
          dataURL
        })
      }

      img.onerror = (err) => {
        reject(err);
      }

      img.src = url + `${timeStamp}`;
    } catch (err) {
      console.log('conver catch err', err);
      reject(err);
    }
  });
