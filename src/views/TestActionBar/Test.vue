<template>
  <div class="test">
    <TestActionBar isSingle>
        <ActionButton btnTxt="立即购买" />
    </TestActionBar>
  </div>
</template>
<script>
import ActionButton from './ActionButton.vue';
// import ActionIcon from './ActionIcon.vue';
import TestActionBar from './TestActionBar.vue';

export default {
  components: { TestActionBar, ActionButton },
  name: 'Test',
  data() {
    return {

    };
  },
};
</script>
<style lang="scss" scoped>
</style>
