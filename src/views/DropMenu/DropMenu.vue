<template>
  <div class="drop-menu">
    <div ref="menuWrap" class="drop-menu__wrap">
      <div class="drop-menu__menu">
        <div class="drop-menu__item" v-for="(tab, index) in tabs" :key="index">
          <menu-item
            :text="tab.name"
            :showArrow="true"
            :defaultArrowUp="currTab === tab.name"
            @handleMenuItem="handleMenuItem(tab, $event)"
          ></menu-item>
        </div>
      </div>
    </div>
    <div class="drop-menu__menu-content">
      <div
        class="drop-menu__mask"
        v-for="(tab, index) in tabs"
        v-show="currTab === tab.name && showMenu"
        :ref="`mask${tab.name}`"
        :key="index"
        :style="{
          top: `${top}px`,
        }"
      >
        <div class="drop-menu__over"></div>
        <div class="drop-menu__list">
          <div
            class="drop-menu__list-item"
            v-for="(item, index) in tab.option"
            :key="index"
            @click="handleOptionClick(item, tab)"
          >
            {{ item.text }}
          </div>
        </div>
      </div>
    </div>
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
          name: 'tabtabtabtabtab1',
          option: [
            { text: 'option1', key: '1' },
            { text: 'option2', key: '2' },
          ],
        },
        {
          name: 'tab2',
        },
        {
          name: 'tab3',
        },
        {
          name: 'tab4',
        },
      ],
      top: 0,
      currTab: '',
      showMenu: false,
    };
  },
  mounted() {
    const menuElem = this.$refs.menuWrap;
    const { height, top } = (menuElem && menuElem.getBoundingClientRect()) || { height: 0, top: 0 };
    console.log('test menuElem', menuElem, height, top);

    this.top = height + top || 0;
  },
  methods: {
    handleMenuItem(tab, show) {
      console.log(show, tab, this.$refs[`mask${tab.name}`]);
      // const menuElem = this.$refs[`mask${tab.name}`] && this.$refs[`mask${tab.name}`][0];
      // if (!show) {
      //   menuElem.style.top = 0;
      // }
      this.currTab = tab.name;
      this.showMenu = show;
    },
    handleOptionClick(item, tab) {
      console.log('select item:', item, tab);
      this.showMenu = false;
      this.currTab = '';
    },
  },
};
</script>
<style lang="scss" scoped src="./drop-menu.scss"></style>
