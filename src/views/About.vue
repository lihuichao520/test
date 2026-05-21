<template>
  <div class="parent">
    <div class="header"></div>
    <div class="content"></div>
    <div class="footer"></div>
  </div>
  <!-- <div class="gallery">
  <div class="card">
    <div class="card-img"><img src="https://img.netbian.com/file/2025/0118/small195135LgiZr1737201095.jpg" style="object-fit: fill;"></div>
    <div class="card-content">
      <div class="card-title">fill</div>
      <div>拉伸填满，会变形</div>
    </div>
  </div>
  <div class="card">
    <div class="card-img"><img src="https://img.netbian.com/file/2025/0118/small195135LgiZr1737201095.jpg" style="object-fit: contain;"></div>
    <div class="card-content">
      <div class="card-title">contain</div>
      <div>完整显示，可能有留白</div>
    </div>
  </div>
  <div class="card">
    <div class="card-img"><img src="https://img.netbian.com/file/2025/0118/small195135LgiZr1737201095.jpg" style="object-fit: cover;"></div>
    <div class="card-content">
      <div class="card-title">cover</div>
      <div>填满容器，会裁剪边缘</div>
    </div>
  </div>
  <div class="card">
    <div class="card-img"><img src="https://img.netbian.com/file/2025/0118/small195135LgiZr1737201095.jpg" style="object-fit: none; object-position: center;"></div>
    <div class="card-content">
      <div class="card-title">none + center</div>
      <div>原始尺寸，居中显示</div>
    </div>
  </div>
</div> -->
  <!-- <div class="container">
    <div class="item auto">内容很短</div>
    <div class="item auto">我是很长很长的内容，用来演示效果</div>
    <div class="item auto">中</div>
  </div> -->
  <!-- <div class="fold-wrapper">
    <div class="text-wrapper" :class="{ noHeight: isOpen }">
      <div
        class="fold-icon"
        :class="[isOpen ? 'fold-icon_unfold' : 'fold-icon_fold']"
        @click.stop="isOpen = !isOpen">
      </div>
      {{ text }}
    </div>
  </div> -->

  <!-- 画三角形 -->
  <!-- <div class="trangle-wrapper">
    <div class="trangle"></div>
  </div> -->
</template>
<script>
export default {
  data() {
    return {
      text: '啦聊得很好读后感好好ddddd干哈哈干哈很尬哈哈记录卡都感觉阿拉贡记录卡估计拉攻击老大过啦搭嘎久啊估计打卡噶干哈和嘎嘎哈哈干哈干哈，超长文本',
      isOpen: false,
    };
  },
};
</script>
<style lang="scss" scoped>
  .parent {
    display: flex;
    flex-direction: column;
    width: 300px;
    height: 600px;
    background: yellow;

    div {
      width: 100%;
    }

    .header {
      height: 200px;
      background: red;
    }

    .content {
      height: 100%;
      background: blue;
    }

    .footer {
      height: 200px;
      background: black;
    }
  }

  .gallery {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    font-family: Arial, sans-serif;
  }
  .card {
    width: 150px;
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
  }
  .card-img {
    width: 100%;
    height: 200px;
    background-color: #f5f5f5;
  }
  .card-img img {
    width: 100%;
    height: 100%;
  }
  .card-content {
    padding: 12px;
  }
  .card-title {
    font-weight: bold;
    margin-bottom: 8px;
  }
.container {
  display: flex;
  width: 800px; /* 固定宽度的父容器 */
  border: 1px solid #ccc;
  gap: 10px;
}

.item {
  padding: 10px;
  background-color: #f0f0f0;
  border: 1px solid #999;
}

.auto {
  flex: auto; /* 关键样式 */
}

.fold-wrapper {
  display: flex;
  width: 100%;
  text-align: left
}

.text-wrapper {
  position: relative;
  max-height: 3em; // 1.5*2
  line-height: 1.5;
  overflow: hidden;
  transition: all 1s;

  &::before {
    content: "";
    float: right;
    height: 100%;
    background: yellow;
    margin-bottom: -24px;
  }

  &.noHeight {
    max-height: none;

    &::after {
      visibility: hidden;
    }
  }

  &::after {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    background: red;
  }
}

.text {
  // &.noHeight {
  //   max-height: none;

  //   &::after {
  //     visibility: hidden;
  //   }
  // }

  // &::after {
  //   content: "";
  //   position: absolute;
  //   width: 100%;
  //   height: 100%;
  //   background: #fff;
  // }
}

.fold-icon {
  float: right;
  clear: both;
  font-size: 14px;
  color: red;

  &_fold::before {
    content: "...";
    margin-right: 5px;
    color: blue;
  }

  &_fold::after {
    content: "展开";
  }

  &_unfold::after {
    content: "收起";
  }
}

// 画三角形
.trangle-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
}

.trangle {
  width: 0;
  height: 0;
  // border: 30px solid red;
  border-style: solid;
  border-width: 0 50px 50px;
  // border-width: 50px;
  border-color: transparent transparent red;
}

// 单行文本两端对齐
.label {
  display: inline-block;
  width: 200px;
  height: 30px;
  text-align: justify;
  text-align-last: justify;
  /**兼容IE */
  text-justify: distribute-all-lines;

  &::after {
    content: '';
    display: inline-block;
    width: 100%; // 或者padding-left: 100%;
    height: 0;
  }
}
</style>
