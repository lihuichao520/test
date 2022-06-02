<template>
  <div>
    <a-form-model ref="ruleForm" :model="form" :rules="rules">
      <a-form-model-item label="优惠券领取时间" ref="receive">
        <a-date-picker
          show-time
          style="width: 260px"
          placeholder="请选择优惠券领取开始时间"
          @change="changeFormat"
          name="receive_start"
          v-model="form.moment_receive_start_time"
        />
        <div class="tips" style="margin: 0 20px">至</div>
        <a-date-picker
          show-time
          style="width: 260px"
          placeholder="请选择优惠券领取结束时间"
          @blur="
            () => {
              $refs.receive.onFieldBlur();
            }
          "
          @change="
            (e) => {
              $refs.receive.onFieldChange();
              let time = e.format('YYYY-MM-DD HH:mm:ss');
              this.form.receive_end_time = time;
            }
          "
          v-model="form.moment_receive_end_time"
        />
      </a-form-model-item>
    </a-form-model>
  </div>
</template>
<script>
import moment from 'moment';

export default {
  name: 'TestDatePicker',
  data() {
    return {
      form: {
        moment_receive_end_time: null,
        moment_receive_start_time: null,
        moment_start_time: null,
        moment_end_time: null,
      },
      rules: {},
    };
  },
  methods: {
    changeFormat(e) {
      console.log(e, '11111');
      const time = e.format('YYYY-MM-DD HH:mm:ss');
      console.log(time, '//time');
      // this.form.moment_receive_start_time = moment(time, 'YYYY-MM-DD HH:mm:ss');
      this.$set(this.form.moment_receive_start_time, moment(time, 'YYYY-MM-DD HH:mm:ss'));
      console.log(this.form.moment_receive_start_time, '//this.form.moment_receive_start_time');
      this.form.receive_start_time = time;
    },
  },
};
</script>
