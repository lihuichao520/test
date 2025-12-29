<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
/**** 顶部导航栏适配 ****/
/* 对 iPhone全面屏的适配 */
@media only screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) {

  /* iPhone XS Max */
  .wbox-safe-padding-top {
    padding-top: 44px !important;
  }
}

@media only screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) {

  /* iPhone XR */
  .wbox-safe-padding-top {
    padding-top: 48px !important;
  }
}

@media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 2) {

  /* iPhone XR 视图放大 */
  .wbox-safe-padding-top {
    padding-top: 44px !important;
  }
}

@media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {

  /* iPhone XS \ iPhone X  \ iPhone XS Max 视图放大 */
  .wbox-safe-padding-top {
    padding-top: 50px !important;
  }
}

@media only screen and (device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) {

  /* iPhone 13+ */
  .wbox-safe-padding-top {
    padding-top: 47px !important;
  }
}

@media only screen and (device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) {

  /* iPhone 14 Pro \ iPhone 15 \ iPhone 15 Pro 16/15 Pro/15/14 Pro*/

  .wbox-safe-padding-top {
    padding-top: 54px !important;
  }
}

@media only screen and (device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) {
  // 14 Plus/13 Pro Max/12 Pro Max
  .wbox-safe-padding-top {
    padding-top: 47px !important;
  }
}

@media only screen and (device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) {

  /* iPhone 14 Pro Max \ iPhone 15 plus \ iPhone 15 Pro Max */
  .wbox-safe-padding-top {
    padding-top: 54px !important;
  }
}

@media only screen and (device-width: 402px) and (device-height: 874px) and (-webkit-device-pixel-ratio: 3) {

  /* iPhone 14 Pro Max \ iPhone 15 plus \ iPhone 15 Pro Max */
  .wbox-safe-padding-top {
    padding-top: 62px !important;
  }
}

@media only screen and (device-width: 440px) and (device-height: 956px) and (-webkit-device-pixel-ratio: 3) {

  /* iPhone 14 Pro Max \ iPhone 15 plus \ iPhone 15 Pro Max */
  .wbox-safe-padding-top {
    padding-top: 62px !important;
  }
}
</style>
