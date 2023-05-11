<template>
  <a-form :form="form" @submit="handleSubmit">
    <!-- <a-form-item
      v-for="(k, index) in form.getFieldValue('keys')"
      :key="k"
      v-bind="index === 0 ? formItemLayout : formItemLayoutWithOutLabel"
      :label="index === 0 ? 'Passengers' : ''"
      :required="false"
    >
       <a-input
        v-decorator="[
          `names[${k}]`,
          {
            validateTrigger: ['change', 'blur'],
            rules: [
              {
                required: true,
                whitespace: true,
                message: 'Please input passenger\'s name or delete this field.',
              },
            ],
          },
        ]"
        placeholder="passenger name"
        style="width: 60%; margin-right: 8px"
      />
      <CustomInput
        v-decorator="[
          `names[${k}]`,
          {
            validateTrigger: ['change', 'blur'],
            rules: [
              {
                required: true,
                whitespace: true,
                message: 'Please input passenger\'s name or delete this field.',
              },
            ],
          },
        ]"
        placeholder="passenger name"
        style="width: 60%; margin-right: 8px"></CustomInput>
      <a-icon
        v-if="form.getFieldValue('keys').length > 1"
        class="dynamic-delete-button"
        type="minus-circle-o"
        :disabled="form.getFieldValue('keys').length === 1"
        @click="() => remove(k)"
      />
    </a-form-item>
    <a-form-item v-bind="formItemLayoutWithOutLabel">
      <a-button type="dashed" style="width: 60%" @click="add">
        <a-icon type="plus" /> Add field
      </a-button>
    </a-form-item>
    <a-form-item v-bind="formItemLayoutWithOutLabel">
      <a-button type="primary" html-type="submit">
        Submit
      </a-button>
    </a-form-item> -->
<a-form-model-item>
    <div
        class="personal-info__base"
        v-for="(person, index) in personalList"
        :key="index">
        <a-row :gutter="24">
          <a-col :span="8">
              <a-form-model-item
                ref="name"
                prop="name"
                label="姓名"
                :label-col="{span: 6}"
                :wrapper-col="{span: 18}"
                :rules="setNameRule(index)"
                >
                <a-input
                  type="text"
                  :value="person.name"
                  placeholder="请输入姓名"
                  class="personal-info__input"
                  @blur="e => onBlurName(e, index)"
                  @change="e => onChangeName(e, index)">
                </a-input>
              </a-form-model-item>
          </a-col>
          <a-col :span="11">
            <a-form-model-item
              ref="idCard"
              prop="idCard"
              label="身份证号码"
              :label-col="{span: 8}"
              :wrapper-col="{span: 16}"
              :rules="setIDCardRule(index)">

              <a-input
                type="text"
                :value="person.id"
                placeholder="请输入身份证号码"
                class="personal-info__input"
                @blur="e => onBlurIDCard(e, index)"
                @change="e => onChangeIDCard(e, index)"
              ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="3">
            <a-icon
              v-if="showAddBtn(index)"
              type="plus-circle-o"
              class="personal-info__add"
              @click="handleAddPerson">
            </a-icon>
            <a-icon
              v-if="showRemoveBtn"
              type="minus-circle-o"
              @click="handleRemovePerson(index)">
            </a-icon>
          </a-col>
        </a-row>
      </div>
      </a-form-model-item>

      <!-- <a-form-model-item label="股东信息">
      <div
        class="personal-info__base"
        v-for="(person, index) in personalList"
        :key="index">
        <a-row :gutter="24">
          <a-col :span="8">
              <a-form-model-item
                ref="name"
                prop="name"
                label="姓名"
                :label-col="{span: 6}"
                :wrapper-col="{span: 18}"
                :rules="setNameRule(index)"
                >
                <a-input
                  type="text"
                  :value="person.name"
                  placeholder="请输入姓名"
                  class="personal-info__input"
                  @blur="e => onBlurName(e, index)"
                  @change="e => onChangeName(e, index)">
                </a-input>
              </a-form-model-item>
          </a-col>
          <a-col :span="11">
            <a-form-model-item
              ref="idCard"
              prop="idCard"
              label="身份证号码"
              :label-col="{span: 8}"
              :wrapper-col="{span: 16}"
              :rules="setIDCardRule(index)">

              <a-input
                type="text"
                :value="person.id"
                placeholder="请输入身份证号码"
                class="personal-info__input"
                @blur="e => onBlurIDCard(e, index)"
                @change="e => onChangeIDCard(e, index)"
              ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="3">
            <a-icon
              v-if="showAddBtn(index)"
              type="plus-circle-o"
              class="personal-info__add"
              @click="handleAddPerson">
            </a-icon>
            <a-icon
              v-if="showRemoveBtn"
              type="minus-circle-o"
              @click="handleRemovePerson(index)">
            </a-icon>
          </a-col>
        </a-row>
      </div>
    </a-form-model-item> -->
  </a-form>
</template>

<script>

// let id = 0;
export default {
  data() {
    return {
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 4 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 20 },
        },
      },
      formItemLayoutWithOutLabel: {
        wrapperCol: {
          xs: { span: 24, offset: 0 },
          sm: { span: 20, offset: 4 },
        },
      },
      personalList: [{}, {}],
    };
  },
  computed: {
    showRemoveBtn() {
      return this.personalList && this.personalList.length > 1;
    },
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: 'dynamic_form_item' });
    this.form.getFieldDecorator('keys', { initialValue: [], preserve: true });
  },
  methods: {
    remove(k) {
      const { form } = this;
      // can use data-binding to get
      const keys = form.getFieldValue('keys');
      // We need at least one passenger
      if (keys.length === 1) {
        return;
      }

      // can use data-binding to set
      form.setFieldsValue({
        keys: keys.filter((key) => key !== k),
      });
    },

    add() {
      // const { form } = this;
      // // can use data-binding to get
      // const keys = form.getFieldValue('keys');
      // const nextKeys = keys.concat(id += 1);
      // // can use data-binding to set
      // // important! notify form to detect changes
      // form.setFieldsValue({
      //   keys: nextKeys,
      // });
    },

    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          const { keys, names } = values;
          console.log('Received values of form: ', values);
          console.log(
            'Merged values:',
            keys.map((key) => names[key]),
          );
        }
      });
    },
    showAddBtn(index) {
      return this.personalList && (this.personalList.length - 1) === index;
    },
    setNameRule(index) {
      const checkFunc = (rule, value, callback) => {
        const { name } = this.personalList[index];

        if (!name) {
          callback(new Error('姓名为必填项'));
        } else {
          callback();
        }
      };

      return { validator: checkFunc, trigger: ['change', 'blur'] };
    },
    setIDCardRule(index) {
      const checkFunc = (rule, value, callback) => {
        const { id } = this.personalList[index];

        if (!id) {
          callback(new Error('身份证号码为必填项'));
        } else {
          callback();
        }
      };

      return { validator: checkFunc, trigger: ['change', 'blur'] };
    },
    onChangeName(e, index) {
      const { value } = e.target;

      this.updatePersonInfo('name', value, index);
    },
    onBlurName(e, index) {
      const { value } = e.target;

      this.updatePersonInfo('name', value, index);
    },
    onBlurIDCard(e, index) {
      const { value } = e.target;

      this.updatePersonInfo('id', value, index);
    },
    onChangeIDCard(e, index) {
      const { value } = e.target;

      this.updatePersonInfo('id', value, index);
    },
    /**
     * 更新人员信息
     */
    updatePersonInfo(key, value, personIndex) {
      this.personalList = this.personalList.map((item, itemIndex) => {
        if (itemIndex === personIndex) {
          // eslint-disable-next-line no-param-reassign
          item[key] = value;
        }

        return item;
      });
    },
    /*
     * 添加人员信息
     */
    handleAddPerson() {
      this.personalList.push({
        name: '',
        index: '',
      });

      console.log('add this.shareholder', this.personalList);
    },
    /**
     * 删除人员信息
     */
    handleRemovePerson(index) {
      this.personalList.splice(index, 1);
      console.log('remove this.shareholder', this.personalList);
    },

    /**
     * 更新人员列表
     */
    updatePersonalList(newList) {
      this.$emit('update', {
        personalList: newList || [],
        fieldKey: this.fieldKey || '',
      });
    },
  },
};
</script>
<style>
.dynamic-delete-button {
  cursor: pointer;
  position: relative;
  top: 4px;
  font-size: 24px;
  color: #999;
  transition: all 0.3s;
}
.dynamic-delete-button:hover {
  color: #777;
}
.dynamic-delete-button[disabled] {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>
