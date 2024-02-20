<template>
  <!-- <div class="test-text"> -->
    <!-- <div>test text</div>
    <div class="carrying__text">
      美国高洁丝产后卫生巾 4片产妇透气排恶露加长夜安裤安睡
    </div> -->

    <!-- 测试三角形箭头 -->
    <!-- <div class="test-arrow"></div>

    <div class="test-border-box__wrap">
      <div class="test-border-box"></div>
    </div> -->
  <!-- </div> -->
  <!-- <div class="wrap">
    <div class="content">
      <div class="detail">jhha好好睡</div>

      <div class="btns">
        <button>返回直播间</button>
      </div>
    </div>
  </div> -->
  <div class="test-add">
        <!-- 测试+号 -->
    <div class='delWrapper'>
      <div class='del'></div>
    </div>

    <div class="add"></div>
  </div>
</template>
<script>
export default {
  name: 'TestText',
};
</script>
<style lang="scss" scoped>
.test-text {
  width: 217px;
  height: auto;
}

// 商品描述部分(超长截断遇到空格或者行高问题导致的截断)
.carrying__text {
  display: -webkit-box;
  margin: 12px 12px 0 13px;
  width: 192px;
  height: 56px;
  font-size: 27.2px; ///29px HYQiHei-EZS;
  font-family: HYQiHei-EZS;
  line-height: 29px;
  color: #636363;
  text-align: left;
  overflow: hidden;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-wrap: break-word;
  text-overflow: ellipsis;
}

// 利用旋转等方式绘制三角形
.test-arrow {
  width: 200px;
  height: 200px;
  border: solid green;
  border-width: 0 0 10px 10px;
  /* transform: skew(-10deg, -10deg); */
  transform: rotate(-45deg) skew(-10deg, -10deg);
}

// 边框
.test-border-box__wrap {
  margin-left: 20px;
  border: 1px solid #febcb5;
  border-radius: 7px;
}
.test-border-box {
  margin: 0;
  // width: 200px;
  height: 200px;
  border-width: 2px;
  border-style: solid;
  border-color: red #d53128 #d53128 #ff665e;
  border-radius: 6px;
  background: #ff3f35;
}

// 弹窗
.wrap {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  font-size: 32rpx;
  z-index: 99;

  .content{
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 30px 0 0;
    width: 270px;
    box-sizing: border-box;
    background-color: #fff;
    border-radius: 12px;
    z-index: 99;

    .detail {
      min-height: 40px;
      padding: 0 12px;
      text-align: center;
      color: #343a40;
      font-size: 15px;
      font-weight: bold;
      box-sizing: border-box;
    }

    .btns {
      position: relative;
      display: flex;
      justify-content: space-around;
      margin-top: 20px;
      // border-top: 1px solid #d0d0d0;

      button {
        display: inline-block;
        line-height: 40px;
        box-sizing: border-box;
        width: 50%;
        height: 40px;
        font-size: 16px;
        text-align: center;
        border: none;
        background: none;
        border-radius: 0;
      }

      button:only-child {
          border-left: none;
          color: #FF8200;
      }
    }

    .btns::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 200%;
      height: 200%;
      border-top: 1px solid #d0d0d0;
      transform-origin: 0 0;
      transform: scale(0.5, 0.5);
      box-sizing: border-box;
    }
  }
}

.delWrapper{
  position: relative;
  width: 20px;
  height: 20px;
  // top: 24px;
  // right: 20px;
}
.del{
  position: absolute;
  width:20px;
  height: 20px;
  border: 1px solid;
  border-radius: 20px;
}

.del::before,.del::after {
  position: absolute;
  content: ' ';
  // background-color: #898989;
  width: 0px;
  height: 13px;
  border: 1px solid #898989;
  left: 9px;
  top: 2px;
}
.del::before {
  transform: rotate(45deg);
}
.del::after {
  transform: rotate(-45deg);
}

.add {
  position: relative;
  width: 16px;
  height: 16px;
  border-radius: 16px;
  background: #ff3f35;
}

.add::before,
.add::after {
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
  width: 8.3px;
  height: 1px;
  // border: 1px solid #fff;
  background: #fff;
  // transform: translate(-100%, -100%);
}

.add::before {
  // border: 1px solid blue;
  transform: rotate(45deg) translate(-50%, -50%);
  transform-origin: top left;
}
.add::after {
  transform: rotate(-45deg) translate(-50%, -50%);
  transform-origin: top left;
}
</style>
