<template>
  <div
    class="cate_certs"
    :class="isNested ? 'cate_nested' : ''"
    v-if="showCateCert">
    <template v-for="field in fieldsData">
      <a-form-model-item
        v-if="field.meetCondition ? field.meetCondition : getRenderCondition(field)"
        class="inline-label"
        :class="{'form-nested-item': field.field_type === 'nested'}"
        :key="field.field_id"
        :prop="isNested ? null : field.field_key"
        :label="field.field_name"
        :required="field.rules && (field.rules || {}).required"
        :rules="disabled ? null : isNested ? nestedFieldRule(field) : field.field_type === 'nested' ? setNestedRules(field) : field.rules">
        <!-- 嵌套类型 -->
        <template v-if="field.field_type === 'nested' && multiFieldsData[field.field_key]">
          <p v-if="field.show_msg" class="msg-tip" v-html="field.show_msg"></p>
          <CateCert
            v-for="(child, index) in multiFieldsData[field.field_key]"
            :key="index"
            @onDel="onChildDel"
            :parentKey="field.field_key"
            @updateParent="updateParent"
            :childIndex="index"
            :disabled="disabled || field.disabled"
            :extendFields="child" isNested />
          <a-row type="flex" v-if="field.field_type === 'nested' && !disabled && !field.disabled">
            <!-- 资质证明及合同 -->
            <a-button v-if="field.field_key === 'qualification_labor_contract'" :style="{'color': '#1890ff'}" type="link" @click="handleFieldAdd(field, multiFieldsData[field.field_key])">
                <a-icon type="plus-circle" />新增{{field.field_name}}
            </a-button>
            <a-button v-else type="primary" @click="handleFieldAdd(field, multiFieldsData[field.field_key])">添加</a-button>
          </a-row>
        </template>
        <!-- input类型 -->
        <div v-if="field.field_type === 'text'">
          <a-input
            :value="field.field_val"
            @change="(e) => onChangeInput(e,field)"
            :disabled="disabled || field.disabled"
            :placeholder="`请输入${field.field_name}`"
            :maxLength="field.field_upper_limit && Number(field.field_upper_limit)"
            :type="field.field_upper_limit && Number(field.field_upper_limit) > 300 ? 'textarea' : 'text'"
            autoSize
             />
          <p v-if="field.show_msg" class="msg-tip" v-html="field.show_msg"></p>
        </div>
        <!-- 上传图片类型 -->
        <a-row class="upload-popover" v-else-if="field.field_type === 'upload_pic'">
          <a-popover placement="rightBottom"
                      title="提示"
                      content="格式为.jpg/.jpeg/.png，每个文件大小不超过5M">
            <c-upload text="上传图片"
              :uploadNum="(field.field_upper_limit && Number(field.field_upper_limit)) || 5"
              :maxNum="(field.field_upper_limit && Number(field.field_upper_limit)) || 5"
              class="cmn-upload-photo"
              add-watermark
              :preview-pics="initPreviewFiles(field)"
              :disabled="disabled || field.disabled"
              @change="handleChangeUpload($event, field.field_key, field)" />
            <a-button class="popover-btn"></a-button>
          </a-popover>
          <p v-if="field.show_msg" class="msg-tip" v-html="field.show_msg"></p>
        </a-row>
        <!-- pdf -->
        <a-row class="upload-popover" v-else-if="field.field_type === 'upload_pdf'" type="flex">
          <a-popover placement="rightBottom" class="mr10">
            <template slot="content">
              <p>格式为PDF，每个文件大小不超过5M</p>
            </template>
            <template slot="title">
              <span>提示</span>
            </template>
            <c-upload text="上传PDF"
              accept=".pdf"
              listType="text"
              defalutName="文件"
              :preview-pics="initPreviewFiles(field)"
              :uploadNum="(field.field_upper_limit && Number(field.field_upper_limit)) || 1"
              :maxNum="(field.field_upper_limit && Number(field.field_upper_limit)) || 10"
              :disabled="disabled || field.disabled"
              @change="handleChangeUpload($event, field.field_key, field)" />
            <a-button class="popover-btn"></a-button>
          </a-popover>
          <p v-if="field.show_msg" class="msg-tip" v-html="field.show_msg"></p>
        </a-row>
        <!-- pdf.zip.rar -->
        <a-row class="upload-popover" v-else-if="field.field_type === 'upload_zip'" type="flex">
          <a-popover placement="rightBottom"  class="mr10">
            <template slot="content">
              <p>支持pdf和压缩的文件格式（zip、rar）</p>
            </template>
            <template slot="title">
              <span>提示</span>
            </template>
            <c-upload text="上传PDF或者压缩文件（zip、rar）"
              accept=".pdf,.zip,.rar,application/x-rar-compressed,application/zip,application/x-zip-compressed,application/octet-stream"
              listType="text"
              defalutName="文件"
              :preview-pics="initPreviewFiles(field)"
              :uploadNum="(field.field_upper_limit && Number(field.field_upper_limit)) || 1"
              :maxNum="(field.field_upper_limit && Number(field.field_upper_limit)) || 10"
              :disabled="disabled || field.disabled"
              @change="handleChangeUpload($event, field.field_key, field)" />
            <a-button class="popover-btn"></a-button>
          </a-popover>
          <a v-if="field.field_key === 'job_qualification_certificate'" :style="{marginLeft: '10px'}" target="_blank" href="https://lf2i7oxold.feishu.cn/docx/KmsXdypwZogw7txM2QXc9J0tn4b">
            入驻类目对应教师证书要求
          </a>
          <p v-if="field.show_msg" class="msg-tip" v-html="field.show_msg"></p>
        </a-row>

        <!-- select -->
        <div v-else-if="field.field_type === 'select'">
          <a-select
              :placeholder="`请选择${field.field_name}`"
              :value="field.field_val"
              :disabled="disabled || field.disabled"
              @change="handleChangeSelectOption($event, field)">
              <a-select-option
                v-for="(option, index) in field.selectOptions"
                :key="index"
                :value="option.value">
                {{ option.label || ''}}
              </a-select-option>
          </a-select>
          <p v-if="field.show_msg" class="msg-tip" v-html="field.show_msg"></p>
        </div>

        <!-- datetime -->
        <div v-else-if="field.field_type === 'datetime'">
          <a-date-picker
            :placeholder="getDateTimePlaceholder(field)"
            :value="field.field_val"
            :format="field.format || 'YYYY-MM-DD'"
            :disabled="disabled || field.disabled"
            style="width:260px"
            @change="(date, dateStr) => handleChangeDate(date, dateStr, field)" />

            <p v-if="field.show_msg" class="msg-tip" v-html="field.show_msg"></p>
        </div>

        <!-- time -->
        <div v-else-if="field.field_type === 'time_range'">
          <a-date-picker
            :value="field.field_val[0]"
            style="width:260px"
            placeholder="开始时间"
            :format="field.format || 'YYYY-MM-DD'"
            :disabledDate="(time) => disabledStartDate(time, field)"
            :disabled="disabled || field.disabled"
            show-time
            @change="(date, dateStr) => handleTimeRangeChange(date, dateStr, field, 0)" />

          <div class="tips" style="margin: 0 20px; display: inline-block">至</div>

          <a-date-picker
            :value="field.field_val[1]"
            style="width:260px"
            :disabledDate="(time) => disabledEndDate(time, field)"
            placeholder="到期时间"
            :format="field.format || 'YYYY-MM-DD'"
            :disabled="disabled || field.disabled"
            show-time
            @change="(date, dateStr) => handleTimeRangeChange(date, dateStr, field, 1)" />
        </div>
      </a-form-model-item>
    </template>

    <div class="opt_btn_box" v-if="isNested && !disabled">
      <!-- <a-button type="danger" @click="handleFieldDel">删除</a-button> -->
      <a-icon type="delete" :style="{'font-size': '24px', color: 'red'}" @click="handleFieldDel"/>
    </div>
  </div>
</template>
<script lang="jsx">
import CUpload from '@/components/common/Upload.vue'
import { simpleDeepClone, isObject } from '@/utils/utils'
import { debounce } from 'lodash'
import moment from 'moment'

export default {
  name: 'CateCert',
  props: {
    extendFields: {
      type: Array,
      default: () => []
    },
    isNested: {
      type: Boolean,
      default: false
    },
    childIndex: {
      type: Number,
      default: 0
    },
    parentKey: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    showCateCert: {
      type: Boolean,
      default: true
    },
    parentTiggerKey: {
      type: String,
      default: ''
    }
  },
  components: {
    CUpload
  },
  inject: ['onExtendFieldChange'],
  data() {
    this.updateParent = debounce(this.updateParent, 500);
    return {
      fieldsData: [],
      multiFieldsData: {},
      multiFieldsDefault: {},
      moudleLinkedWithField: {} // 关联关系
    }
  },
  watch: {
    extendFields: {
      handler(newVal) {
        this.abstractMultiField(newVal)
        this.copyToData(newVal)
        this.processData();
        this.adjustOrder(this.fieldsData);
        this.moudleLinkedWithField = {};
      },
      deep: true,
      immediate: true
    },
    showCateCert(newVal) {
      this.parentTiggerKey && this.emitListener(this.parentTiggerKey, null, newVal);
    }
  },
  computed: {
  },
  mounted() {
  },
  methods: {
    handleChangeUpload({ fileList, upload }, type, field) {
      let data = fileList.map(file => { return { url: file.url } })

      if (this.isNested) {
        this.$emit('updateParent', {
          parentKey: this.parentKey,
          val: data,
          key: field.field_key,
          index: this.childIndex
        })
      } else {
        this.onExtendFieldChange(type, data)
        this.emitListener(type, field, data);
      }
    },
    initPreviewFiles(record) {
      // 解决新增后删除dom更新错误问题
      if (Array.isArray(record.field_val)) return record.field_val;
      if (!record || !record.field_val || !record.field_val.split) return;
      let fileUrl = record.field_val.split(',') || []
      return fileUrl.map((file) => ({ url: file }))
    },
    copyToData(extendFields = []) {
      this.fieldsData = extendFields.map(field => {
        if (!field.field_val) {
          field.field_val = ['select', 'datetime'].includes(field.field_type) ? undefined : ''
        }
        return { ...field }
      })
    },
    // 处理嵌套扩展字段
    abstractMultiField(extendFields = []) {
      extendFields.forEach(item => {
        if (item.field_type === 'nested') {
          const defaultVal = item.field_val ? (Array.isArray(item.field_val) ? item.field_val : JSON.parse(item.field_val)) : []
          const formatData = (index) => {
            const sourceData = Array.isArray(item.field_option) ? item.field_option : JSON.parse(item.field_option)
            const data = sourceData.map(field => {
              if (index > -1) {
                field.field_val = defaultVal[index][field.field_key]
              } else {
                field.field_val = ''
              }
              return field
            })
            return simpleDeepClone(data)
          }
          // 获取嵌套字段的默认值，用于添加作为初始值
          this.multiFieldsDefault[item.field_key] = formatData()
          // 获取嵌套字段列表
          if (defaultVal.length) {
            const arr = []
            defaultVal.forEach((item, index) => {
              arr.push(formatData(index))
            })
            this.multiFieldsData[item.field_key] = arr
          } else {
            this.multiFieldsData[item.field_key] = [ formatData() ]
          }
        }
      });
    },
    // 嵌套类型添加一条数据
    handleFieldAdd(parent, field) {
      if (field.length >= +parent.field_upper_limit) {
        this.$message.warning(`最多添加${parent.field_upper_limit}条数据~`);
        return;
      }
      this.multiFieldsData[parent.field_key].push(simpleDeepClone(this.multiFieldsDefault[parent.field_key]))
      this.$forceUpdate();
    },
    // 嵌套类型删除一条数据
    handleFieldDel() {
      this.$emit('onDel', this.parentKey, this.childIndex)
    },
    onChildDel(key, index) {
      if (!key || !this.multiFieldsData[key]) {
        return;
      }
      if (this.multiFieldsData[key].length <= 1) {
        this.$message.warning('至少需要保留一条数据~');
        return;
      }
      const result = this.multiFieldsData[key].filter((item, i) => i !== index);
      this.multiFieldsData[key] = result;
      this.$forceUpdate();
      this.onExtendFieldChange(key, this.multiFieldsData[key])
    },
    // 嵌套资质的校验规则处理
    nestedFieldRule(field) {
      const checkFunc = (rule, value, callback) => {
        if (field.rules && (field.rules || {}).required && !field.field_val.trim()) {
          callback(new Error(`${field.field_name}不能为空`))
        } else {
          callback()
        }
      }
      return { validator: checkFunc, trigger: field.rules ? field.rules.trigger : 'change' }
    },
    // 设置嵌套校验规则
    setNestedRules(field) {
      let { rules, field_lower_limit, field_upper_limit, field_name } = field;
      const _nestedRequired = (rule, value, callback) => {
        // console.log('=====123456', rule, value);
        let finalVal = value
        if (field.field_type === 'nested') {
          finalVal = finalVal ? (Array.isArray(finalVal) ? finalVal : JSON.parse(finalVal)) : []
        }

        if ((rules || {}).required && (!finalVal || !finalVal.length)) {
          callback(new Error(rules.message))
        } else if (field_lower_limit && (!finalVal || finalVal.length < Number(field_lower_limit))) {
          callback(new Error(`至少上传${field_lower_limit}份${field_name}`))
        } else if (field_upper_limit && (!finalVal || finalVal.length > Number(field_upper_limit))) {
          callback(new Error(`至多上传${field_upper_limit}份${field_name}`))
        } else {
          let isError = 0;
          (finalVal || []).forEach(v => {
            Array.isArray(v) && (v || []).forEach(sub => {
              if (sub.rules && sub.rules.required && (!sub.field_val || !sub.field_val.length)) {
                callback(new Error(`请完善${field_name}`))
                isError++;
              }
            })
          })
          if (!isError) callback();
        }
      }
      return { required: (rules || {}).required, validator: _nestedRequired, trigger: 'change' };
    },
    onChangeInput(e, field) {
      const val = e.target.value
      if (this.isNested) {
        this.$emit('updateParent', {
          parentKey: this.parentKey,
          val,
          key: field.field_key,
          index: this.childIndex
        })
      }
      this.fieldsData = this.fieldsData.map(item => {
        if (item.field_key === field.field_key) {
          item.field_val = val
        }
        return item
      })
      this.onExtendFieldChange(`${field.field_key}`, e.target.value);
    },
    updateParent({ parentKey, val, key, index }) {
      const currentField = this.multiFieldsData[parentKey][index]
      const target = currentField.find(item => item.field_key === key)
      target.field_val = val
      this.onExtendFieldChange(parentKey, this.multiFieldsData[parentKey])
    },
    /**
     * 处理数据
     */
    processData() {
      this.fieldsData.forEach((field) => {
        if (field.field_type === 'select') {
          const fieldOption = isObject(field.field_option) ? field.field_option : (field.field_option ? JSON.parse(field.field_option) : {});
          field.field_val = field.field_val || undefined;

          field.selectOptions = this.mapOptionToSelectOptions(fieldOption);
        } else if (field.field_type === 'datetime') {
          field.field_val = field.field_val ? moment(new Date(Number(field.field_val))) : undefined
        } else if (field.field_type === 'time_range') {
          let originVal = field.field_val;
          if (!Array.isArray(originVal)) {
            try {
              originVal = originVal ? JSON.parse(originVal) : [];
            } catch (err) {
              console.log('json pares err', err);
              originVal = []
            }
          }

          field.field_val = []
          if (Array.isArray(originVal)) {
            if (originVal.length === 1) {
              const timeStamp = Number(originVal[0])
              field.field_val[0] = timeStamp && !isNaN(timeStamp) ? moment(new Date(timeStamp)) : undefined
              field.field_val[1] = undefined;
            } else if (originVal.length === 0) {
              field.field_val = [];
              field.field_val[0] = undefined;
              field.field_val[1] = undefined;
            } else {
              originVal.forEach((item, index) => {
                const timeStamp = Number(item)
                field.field_val[index] = timeStamp && !isNaN(timeStamp) ? moment(new Date(timeStamp)) : undefined
              })
            }
          } else {
            field.field_val = [];
            field.field_val[0] = undefined;
            field.field_val[1] = undefined;
          }
        } else if (field.field_type === 'nested') {
          const defaultVal = field.field_val ? (Array.isArray(field.field_val) ? field.field_val : JSON.parse(field.field_val)) : []
          field.field_val = defaultVal
        }
      });
    },
    /**
     * 将field_option 映射为 select可用的格式
     * @param {*} options
     */
    mapOptionToSelectOptions(options = {}) {
      return Object.keys(options).map((key) => {
        return {
          label: options[key],
          value: key
        }
      });
    },
    /**
     * 处理select的可选项变化
     * @param {*} optionVal
     * @param {*} field
     */
    handleChangeSelectOption(optionVal, field) {
      const targetVal = optionVal;

      if (this.isNested) {
        this.$emit('updateParent', {
          parentKey: this.parentKey,
          val: targetVal,
          key: field.field_key,
          index: this.childIndex
        })
      }

      this.fieldsData = this.fieldsData.map(item => {
        if (item.field_key === field.field_key) {
          item.field_val = targetVal
        }
        return item
      })

      this.onExtendFieldChange(`${field.field_key}`, optionVal);
    },
    /**
     * 更新日期组件
     * @param {*} date
     * @param {*} dateStr
     * @param {*} field
     */
    handleChangeDate(date, dateStr, field) {
      const targetDate = date;

      if (this.isNested) {
        this.$emit('updateParent', {
          parentKey: this.parentKey,
          val: targetDate,
          key: field.field_key,
          index: this.childIndex
        })
      }

      this.fieldsData = this.fieldsData.map(item => {
        if (item.field_key === field.field_key) {
          item.field_val = targetDate
        }
        return item
      })

      const timeStamp = targetDate ? targetDate.valueOf() : ''
      this.onExtendFieldChange(`${field.field_key}`, timeStamp);
    },
    /**
     * 更新timerange组件
     * @param {*} date
     * @param {*} dateStr
     * @param {*} field
     * @param {*} index
     */
    handleTimeRangeChange(date, dateStr, field, index) {
      let fieldValue = [];

      this.fieldsData = this.fieldsData.map(item => {
        if (item.field_key === field.field_key && item.field_type === 'time_range') {
          item.field_val[index] = date

          item.field_val.forEach((date) => {
            fieldValue.push(date ? date.valueOf() : undefined);
          })
        }
        return item
      })

      this.onExtendFieldChange(`${field.field_key}`, fieldValue);
    },
    /**
     * 开始时间和结束时间的约束
     */
    disabledStartDate(startTime, field) {
      const endTime = field.field_val.length > 2 ? field.field_val[1] : undefined;

      if (!startTime || !endTime) {
        return false;
      }

      return startTime.valueOf() > endTime.valueOf();
    },
    /**
     * 开始时间和结束时间的约束
     */
    disabledEndDate(endTime, field) {
      const startTime = field.field_val.length > 1 ? field.field_val[0] : undefined;

      if (!startTime || !endTime) {
        return false;
      }

      return startTime.valueOf() >= endTime.valueOf();
    },
    /**
     * 获取条目是否渲染的条件
     */
    getRenderCondition(field) {
      // console.log('*** get render', field, field.field_name, field.meetCondition);
      if (field.extra) {
        try {
          const triggerFieldKey = this.getTriggerFieldKey(field);

          if (triggerFieldKey) {
            if (field[`on${triggerFieldKey}`]) {
              // 更新状态
              // console.log('** test filed update', field, field.meetCondition)
              return field.meetCondition;
            } else {
              // 初始状态
              const depField = this.getDependenceField(this.fieldsData, triggerFieldKey);
              const meetCondition = depField ? this.isMeetEmitCondition(triggerFieldKey, depField) : this.showCateCert;
              field.meetCondition = meetCondition;
              // 推入依赖者队列
              this.onListener(triggerFieldKey, field);

              // console.log('** depende filed, test filed push', depField, triggerFieldKey, field, meetCondition)
              return meetCondition;
            }
          } else {
            field.meetCondition = this.showCateCert;
            return this.showCateCert
          }
        } catch (err) {
          console.log('err', err);
          return false;
        };
      }

      return true;
    },
    /**
     * 建立field_key和其所关联模块的关联关系
     */
    onListener(fieldKey, field) {
      this.moudleLinkedWithField[fieldKey] = this.moudleLinkedWithField[fieldKey] ? this.moudleLinkedWithField[fieldKey].concat(field) : [field];
      field[`on${fieldKey}`] = true;

      // console.log('**** catecert association', this.moudleLinkedWithField);
    },
    /**
     * 触发fieldKey对应的监听者们
     * @param {*} fieldKey
     */
    emitListener(fieldKey, field, currVal) {
      if (fieldKey && this.moudleLinkedWithField[fieldKey]) {
        const isMeetCondition = field ? this.isMeetEmitCondition(fieldKey, field, currVal) : this.parentTiggerKey && this.showCateCert;

        this.moudleLinkedWithField[fieldKey].forEach((triggerField) => {
          triggerField.meetCondition = isMeetCondition || false;
          // console.log('*** moudleLinkedWithField', triggerField);
        });

        this.$forceUpdate();
      }
    },
    /**
    * 满足触发条件
    * @param {*} fieldKey
    */
    isMeetEmitCondition(fieldKey, field, currVal) {
      if (field.field_type === 'upload_pic') {
        if (!currVal) {
          const originVal = this.initPreviewFiles(field);

          return originVal && originVal.length > 0;
        } else {
          return currVal.length > 0;
        }
      }

      return false;
    },
    /**
     * 获取依赖者
     * @param {*} fields
     * @param {*} targetFieldKey
     */
    getDependenceField(fields = [], targetFieldKey) {
      const targetFields = fields.filter((field) => {
        return field.field_key === targetFieldKey;
      });

      return targetFields && targetFields.length > 0 ? targetFields[0] : undefined;
    },
    /**
     * 调整顺序
     */
    adjustOrder(fields = []) {
      const triggerKeyFieldsMap = {};

      // 父组件来触发时，不需要来调整顺序
      if (this.parentTiggerKey) return;

      for (let index = 0; index < fields.length;) {
        const field = fields[index];

        try {
          const triggerKey = this.getTriggerFieldKey(field);

          if (triggerKey) {
            triggerKeyFieldsMap[triggerKey] = triggerKeyFieldsMap[triggerKey] ? triggerKeyFieldsMap[triggerKey].concat(field) : [field];
            fields.splice(index, 1);
          } else {
            index += 1;
          }
        } catch (err) {
          console.log('some err happen when adjust order', err);
        }
      }

      for (let index = 0; index < fields.length;) {
        const fieldKey = (fields[index] || {}).field_key;

        if (triggerKeyFieldsMap[fieldKey] && triggerKeyFieldsMap[fieldKey].length > 0) {
          fields.splice(index + 1, 0, ...triggerKeyFieldsMap[fieldKey]);
          index = index + triggerKeyFieldsMap[fieldKey].length + 1;
        } else {
          index += 1;
        }
      }

      // console.log('*** adjust order after insert', fields);
    },
    /**
     * 获取能触发field的key
     * @param {*} field
     */
    getTriggerFieldKey(field) {
      let triggerFieldKey = null;
      const keyMap = {
        'medical_certificate': 'license'
      }

      try {
        if (field.extra) {
          const extraInfo = isObject(field.extra) ? field.extra : JSON.parse(field.extra);
          const parentTigger = (extraInfo || {}).parent_trigger || {}

          if (isObject(parentTigger)) {
            Object.keys(parentTigger).forEach((propKey) => {
              const tempKey = keyMap[propKey] ? keyMap[propKey] : propKey

              if (tempKey) {
                triggerFieldKey = tempKey
              }
            })
          } else {
            triggerFieldKey = keyMap[extraInfo.parent_trigger] ? keyMap[extraInfo.parent_trigger] : extraInfo.parent_trigger;
          }
        }
      } catch (err) {
        // console.log('some err happens when get trigger key', err);
      }

      return triggerFieldKey;
    },
    /**
     * 建立field_key和其所关联模块的关联关系
     */
    establishAssociation(fieldArr = []) {
      const moudleLinkedWithField = {};
      const keyMap = {
        'medical_certificate': 'license'
      }

      if (!Array.isArray(fieldArr)) return;

      try {
        fieldArr.forEach((field, index) => {
          if (field.extra) {
            const extraInfo = isObject(field.extra) ? field.extra : JSON.parse(field.extra)
            const parentTigger = (extraInfo || {}).parent_trigger || {}

            if (isObject(parentTigger)) {
              Object.keys(parentTigger).forEach((propKey) => {
                const triggerFieldKey = keyMap[propKey] ? keyMap[propKey] : propKey

                if (triggerFieldKey) {
                  moudleLinkedWithField[triggerFieldKey] = moudleLinkedWithField[triggerFieldKey] ? moudleLinkedWithField[triggerFieldKey].concat(field) : [field]
                }
              })
            } else {
              const triggerFieldKey = parentTigger ? keyMap[parentTigger] : parentTigger

              if (triggerFieldKey) {
                moudleLinkedWithField[triggerFieldKey] = moudleLinkedWithField[triggerFieldKey] ? moudleLinkedWithField[triggerFieldKey].concat(field) : [field]
              }
            }
          }
        })
      } catch (err) {
        // console.log('*** test err', err);
      };

      return moudleLinkedWithField || {};
    },
    getDateTimePlaceholder(field = {}) {
      const keyToHolder = {
        'issue_date_related_business_license': '发证',
        'registration_date_related_business_reg': '备案'
      }

      return field.field_key && keyToHolder[field.field_key] ? `请选择${keyToHolder[field.field_key]}日期` : '请选择日期';
    }
  }
}
</script>
