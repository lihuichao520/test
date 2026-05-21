<template>
  <div class="parent">

  </div>
</template>
<script>
// 1、本文件是主线程, 利用worker.js文件创建一个worker
const worker = new Worker('worker.js');
const channel = new MessageChannel();

// 2、把port2 发送给Worker
worker.postMessage({
  type: 'init',
  port: channel.port2,
},
[channel.port2]);


// 3、主线程通过port1接收信息进行通信
channel.port1.onmessage = (e) => {
  console.log('主线程收到：', e.data);
}

// 4、主线程也可以给worker线程发送消息
channel.port1.postMessage('hello from main');


// worker.js文件里，可以设置接收消息的回调
self.onmessage = (e) => {
  const {type, port} = e.data;

  if (type === 'init') {
    port.onmessage = (e) => {
      console.log('Worker 收到：', e.data); // hello from main
      port.postMessage('hello from worker');
    }
  }
}

export default {
  data() {
    return {
      
    };
  },
};
</script>
<style lang="scss" scoped>
  
</style>
