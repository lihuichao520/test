<template>
  <div class="drop-menu">
    <div class="drop-menu__menu" v-for="(tab, index) in tabs" :key="index">
      <div class="drop-menu__item">
        <menu-item :text="tab.name" :showArrow="true"></menu-item>
      </div>
    </div>
    <div class="drop-menu__list"></div>
  </div>
</template>
<script>
import MenuItem from '../../components/MenuItem.vue';

export default {
  components: { MenuItem },
  name: '',
  data() {
    return {
      tabs: [
        {
          name: 'tab1',
        },
        {
          name: 'tab2',
        },
        {
          name: 'tab3',
        },
      ],
    };
  },
};
</script>
<style lang="scss" scoped src="./drop-menu.scss"></style>
