<template>
  <div class="personal-info">
      <span class="personal-info__name">
        <label>姓名:</label>
        <a-input type="text" v-model="name"  @change="handleNameChange"/>
      </span>
      <span class="personal-info__id">
        <label>身份证号: </label>
        <a-input type="text"  v-model="id" placeholder="请输入身份证号" @change="handleIDChange"/>
    </span>
  </div>
</template>
<script>
export default {
  props: {
    label: {
      type: String,
      default: '',
    },
  },
  data() {
    const value = this.value || {};

    return {
      name: value.name || '',
      id: value.id || '',
    };
  },

  watch: {
    value: {
      deep: true,
      immediate: true,
      handler(value = {}) {
        this.name = value.name || '';
        this.id = value.id || '';
      },
    },
  },
  methods: {
    handleNameChange(name) {
      this.triggerChange(name);
    },
    handleIDChange(id) {
      this.triggerChange(id);
    },
    triggerChange(changedValue) {
      this.$emit('change', { ...this.$data, ...changedValue });
    },
  },
};
</script>
<style scoped>
.personal-info__name {
  display: inline-block;
  margin-right: 20px;
  width: 35%;
}

.personal-info__id {
  display: inline-block;
  width: 60%;
}
</style>
