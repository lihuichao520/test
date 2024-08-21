<template>
  <div class="test-swipe">
    <div class="card-title">
      test title啊啊哈哈打电话
    </div>

    <div class="my-swipe card-list_mini" >
      <div class="my-swipe-inner" ref="cardList">
        <van-swipe
          v-if="showSwipe"
          class="swiper-wrapper"
          :loop="true"
          :show-indicators="false"
          :vertical="true"
          :height="swipeHeight"
          :autoplay="5000">
          <van-swipe-item
            v-for="(blog, index) in blogList"
            :key="index">
            <div
              class="card-item"
              @click="goToBlog(blog)">
              <div class="image-wrapper">
                <img src="" />
              </div>

              <div class="content">
                <div class="title">博文内容博文内容博文博文内容内容博文jagjdkgja</div>
                <div class="subtitle">
                  <div class="avatar">
                    <img src="" />
                  </div>
                  <div class="nick_name">@博主昵称</div>
                </div>
              </div>
            </div>
          </van-swipe-item>
        </van-swipe>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'TestSwipe',
  data() {
    return {
      blogList: [{}, {}, {}, {}],
      swipeHeight: 0,
      showSwipe: false,
    };
  },
  methods: {
    goToBlog(blog) {
      console.log('=== test blog', blog);
    },
  },
  mounted() {
    const cardListElem = this.$refs.cardList;
    const reactObj = cardListElem.getBoundingClientRect();
    console.log('==test styleObje', reactObj.height);

    this.swipeHeight = reactObj.height / 2;
    this.showSwipe = true;
  },
};
</script>
<style lang="scss" scoped>
$px414To375: 2px;

.test-swipe {
  width: 188*$px414To375;
  border-radius: 8*$px414To375;
  background: linear-gradient(180deg, #FFBAF0 0%, #D999FF 20%);

  .card-list_mini {
    height: 122*$px414To375;
    padding: 12*$px414To375;
    width: 100%;
    border-radius: 8*$px414To375;
    background: #FDF7FF;
    box-sizing: border-box;
  }

  .my-swipe-inner {
    width: 100%;
    height: 98*$px414To375;
  }
  .swiper-wrapper {
    width: 100%;
    height: 98*$px414To375;
    overflow: hidden;
  }

  .card-item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: 44*$px414To375;
    box-sizing: border-box;

    .image-wrapper {
      margin-right: 5*$px414To375;
      width: 44*$px414To375;
      height: 44*$px414To375;
      border-radius: 2*$px414To375;
      overflow: hidden;

      img {
        display: block;
        width: 44*$px414To375;
        height: 44*$px414To375;
        border-radius: 2*$px414To375;
      }
    }

    .content {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: flex-start;
      width: 127*$px414To375;
      height: 44*$px414To375;
      box-sizing: border-box;

      .title {
        display: -webkit-box;
        line-clamp: 2;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        padding-left: 1*$px414To375;
        color: #333333;
        font-family: PingFang SC;
        font-size: 12*$px414To375;
        line-height: 15*$px414To375;
        letter-spacing: 0;
        text-align: left;
        overflow: hidden;
      }

      .subtitle {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin-top: 2*$px414To375;
        height: 12*$px414To375;
        color: #939393;
        font-family: PingFang SC;
        font-size: 10*$px414To375;
        line-height: 10*$px414To375;
        letter-spacing: 0px;
        text-align: left;
      }

      .avatar {
        margin-right: 1*$px414To375;
        width: 12*$px414To375;
        height: 12*$px414To375;
        border-radius: 50%;
        overflow: hidden;

        img {
          display: inline-block;
          width: 12*$px414To375;
          height: 12*$px414To375;
          border-radius: 50%;
        }
      }

    }
  }

  img[src=""],img:not([src]){
    opacity:0;
  }
}
</style>
