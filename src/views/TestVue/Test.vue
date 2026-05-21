<template>
  <div class="test">
    <Test1 :testName="'a'"></Test1>
    <Test1 :testName="'b'"></Test1>
    <Test2 :testName="'a'"></Test2>
    <Test2 :testName="'b'"></Test2>
    <input type="radio" v-model="pick" :value="first" />
    <input type="radio" v-model="pick" :value="second" />
    {{ pick }}
  </div>
</template>
<script>
import Test1 from './Test1.vue';
import Test2 from './Test2.vue';

export default {
  data() {
    return {
      pick: false,
      first: 'first',
      second: 'second',
    };
  },
  components: {
    Test1,
    Test2,
  },
  methods: {
  },
};
</script>
