<el-cascader
  ref="cascader-el"
  :options="cateOptions"
  :value="cateName"
  @change="onChangeCate"
  >
<SkuInfoV2
  :basicData="form"
  :cateSpec="cateSpec"
  :cateType="cateType"
  :isDefaultType="isDefaultType"
  :stepType="stepType"
  :cateSpecOption="cateSpec_option"
  @change="handleChangeSku" />
      cateSpec: '',
      cateType: null,
      currCateInfo: {},
      cateSpec_option: '',

      basicData: {
        cateId: '',
      },
      skuData: {
        cover: '',
        specValue: ['', ''],
        retailPrice: '',
        stock: '',
        medical_store: '',
        retailer_uid: '',
        pin: ''
      },
      form: {
        cateId: '',
        skus: [],
      },
    handleChangeSku({ skus, skuDiff }) {
      this.isDiff.skuDiff = skuDiff
      this.form.skus = skus;
    },

    onChangeCate(value) {
      const currentLeaf = value[value.length - 1];
      let cateInfo = function findCateInfo(cateList, valuePath) {
        let currentLevel = cateList;
        let result = null;

        for (let i = 0; i < valuePath.length; i++) {
          const targetName = valuePath[i];
          const found = currentLevel.find(item => item.name === targetName);

          if (!found) {
            return null;
          }
          if (i === valuePath.length - 1) {
            result = found;
          } else {
            currentLevel = found.sub || [];
          }
        }
        return result;
      }(this.cateOptions, value)
      this.cateName = value
      this.$set(this.form, 'cateId', cateInfo.cate_id)
      this.$set(this.basicData, 'cateId', cateInfo.cate_id)
      this.handleSelectCate(cateInfo)
      const path = cateInfo?.path || '';
      const pathArr = path.split(',');
  },

<template>
  <div class="sku-info-v2">
    <!-- 未选择类目 -->
    <div v-if="!basicData.cateId" class="empty-cate" >
      <p><a @click="goToWindow">去选类目{{basicData.cateId}}</a></p>
      <p>缺失类目信息，无法填写规则</p>
    </div>

    <!-- 已选类目 -->
    <div v-else class="cate-sku-info">
      <!-- 各项规格区域 -->
      <div class="spec-list">
        <div
          class="spec-item"
          v-for="(specInfo, index) in specListInfo"
          :key="index">
          <!-- 规格名称 -->
          <div class="spec-title">
            <span v-if="!specInfo.is_option" class="required-icon">*</span>{{ specInfo.spec_name || '' }}
            <div v-if="index === 0" class="patch-upload-btn">
              <c-upload ref="patchUpload"
                        text=""
                        :listType="'text'"
                        :preview-pics="getInitSpecPics(specInfo)"
                        :uploadNum="50"
                        :maxNum="50"
                        :multipleUpload="true"
                        :customerIcon="true"
                        :previewOnce="true"
                        :needWatchPreviewPics="!specInfo.notFstInit"
                        @change="handleChangeBatchUpload($event, specInfo)">
                <template v-slot:customerIcon>
                  <span class="patch-upload-picture">批量上传图片</span>
                </template>
              </c-upload>
            </div>
          </div>

          <!-- 单项规格列表区域 -->
          <SpecList
            ref="specList"
            :specInfo="specInfo"
            :cateType="cateType"
            :skus="skus"
            @updateSpecList="(updateInfo) => handleUpdateSpecList(updateInfo, specInfo)"/>
        </div>
      </div>

      <!-- 生成的表格区域: 价格与库存 -->
      <div v-if="specListInfo && specListInfo.length > 0" class="spec-cartesian-product">
        <div class="card-title">
          <div class="left">价格与库存</div>

          <div class="right">
            <div class="batch-setting-content">
              <div class="batch-input">
                <a-input
                    placeholder="请输入售价"
                    prefix="¥"
                    :style="{ width: '120px' }"
                    v-model.trim="batchData.price"
                    @change="e => onChangeBatchPrice(e)"
                    @blur="e => onBlurBatchPrice(e)"/>
              </div>

              <div class="batch-input">
                <a-input-number
                  class="ml8"
                  v-model.trim="batchData.stock"
                  :min="0"
                  :precision="0"
                  placeholder="请输入库存"
                  :style="{ width: '120px' }"
                  @change="handleChangeBatchStock"/>
              </div>
            </div>

            <a-button
                class="ml20"
                type="primary"
                @click="handleBatchChangeStockPrice"
                :disabled="batchBtnDisabled">
                {{ '批量填写' }}
            </a-button>
          </div>
        </div>

        <!-- 根据specListInfo生成的表格内容 -->
        <a-table :row-key="getRowKey"
                  :columns="columns"
                  :data-source="skus"
                  :scroll="{ x: 1000 }"
                  :pagination="false"
                  bordered>
            <!-- 规格图片 -->
            <template slot="cover"
                      slot-scope="text,record,index">
              <a-form-model-item ref="cover"
                                prop="cover"
                                :rules="setCoverRule(index)">
                <div class="cover-wrapper">
                  <UploadWithReplace
                    style="width: 100%;height: 100%;"
                    :upload-num="1"
                    :cropOption="{ autoCropWidth: 1000, autoCropHeight: 1000, fixed: false }"
                    :preview-pics="previewPics(index)"
                    :allowCrop="Number(cateType) === 16"
                    @change="handleUpload($event, record, index)"
                  />
                </div>
              </a-form-model-item>
            </template>

            <!-- 售价 -->
            <template slot="retailPrice"
                      slot-scope="text,record,index">
              <a-form-model-item ref="price"
                                prop="retailPrice"
                                :rules="setPriceRule(index)">
                <a-input placeholder="0.00"
                        prefix="¥"
                        style="width: 80%"
                        :value="text"
                        @change="e => onChangePrice(e,record, index)"
                        @blur="e => onBlurPrice(e,record, index)" />
              </a-form-model-item>
            </template>
            <!-- 库存 -->
            <template slot="stock"
                      slot-scope="text,record,index">
              <a-form-model-item ref="stock"
                                prop="stock"
                                :rules="setStockRule(index)">
                <a-input placeholder="0"
                        style="width: 80%"
                        :value="text"
                        :disabled="disabledStock"
                        @change="e => onChangeStock(e,record, index)"
                        @blur="e => onBlurStock(e,record, index)"/>
              </a-form-model-item>
            </template>

            <!-- 第三方商品识别码 -->
            <template slot="pin" slot-scope="text,record,index">
              <a-form-model-item ref="pin">
                <a-input placeholder="请输入第三方识别码"
                        style="width: 80%"
                        :value="text"
                        @change="e => onChangeSbm(e,record,index)"/>
              </a-form-model-item>
            </template>

            <!-- 重量 -->
            <template slot="weight" slot-scope="text,record,index">
              <a-form-model-item ref="重量" prop="weight" :rules="setWeightRule(index)">
                <a-input placeholder="请输入重量"
                        style="width: 80%"
                        :value="text"
                        @change="e => onChangeWeight(e,record,index)"
                        @blur="e => onBlurWeight(e,record, index)"/>
              </a-form-model-item>
            </template>

            <!-- 操作 -->
            <template slot="options" slot-scope="text,record,index">
              <div class="options-btns-wrapper">
                <a-tooltip placement="topRight" title="不启用即本条规格不会被保存，也不会对买家展示">
                  <div class="options-switch">
                    启用
                    <a-icon type="question-circle" theme="filled" />
                  </div>
                </a-tooltip>
                <a-switch
                  class="customer-switch"
                  :checked="record.enabled"
                  default-checked
                  :disabled="false"
                  @change="(checked, e) => changeSwitch(checked, e, record, index)" />
              </div>
            </template>
          </a-table>
      </div>
    </div>
  </div>
</template>

<script lang="jsx">
import { cloneDeep } from 'lodash';
import SpecList from './SpecList.vue'
import retailerMixins from '@/mixin/retailer'
import UploadWithReplace from '../common/UploadWithReplace.vue';
import CUpload from '@/components/common/Upload.vue'

export default {
  mixins: [retailerMixins],
  props: {
    basicData: {
      type: Object,
      default: () => {}
    },
    cateSpec: {
      type: String
    },
    cateType: {
      type: String
    },
    isDefaultType: {
      type: String
    },
    stepType: {
      type: String
    },
    cateSpecOption: {
      type: String,
      default: ''
    }
  },
  components: {
    SpecList,
    UploadWithReplace,
    CUpload
  },
  data() {
    return {
      skuDiff: 0,
      disabledStock: false,

      // 批量修改库存和价格
      batchData: {
        stock: '',
        price: ''
      },
      batchBtnDisabled: true,

      specListInfo: [], // 规格信息, e.g, 规格[{key: 'spec0',spec_name: '款式', list: []}, {key: 'spec1',spec_name: '颜色', list: []}}
      skus: [{}] // 根据spec生成的规格信息, e.g, [{spec0: **, spec1: **, ..., specn: **, retailPrice: '', stock: '', pin: '', enabled: true }],
    }
  },
  computed: {
    columns() {
      let columns = [];

      this.specListInfo.forEach((item, index) => {
        const specKeyInfo = item || {};
        const col = index !== this.specListInfo.length - 1 ? {
          title: specKeyInfo.spec_name,
          key: specKeyInfo.key,
          dataIndex: specKeyInfo.key,
          width: 150,
          align: 'center',
          customRender: (text, record, index) => {
            return {
              children: `${text}`,
              attrs: {
                rowSpan: record[`${specKeyInfo.key}RowSpan`]
              }
            }
          }
        } : {
          title: specKeyInfo.spec_name,
          key: specKeyInfo.key,
          dataIndex: specKeyInfo.key,
          width: 150,
          align: 'center'
        };

        columns.push(col);
      });

      columns.push({
        title: '规格图',
        key: 'cover',
        dataIndex: 'cover',
        align: 'center',
        width: 120,
        scopedSlots: { customRender: 'cover' }
      });

      const stockAndPriceCols = [
        {
          title: () => (
            <Span>
              <Span style="color: #FF4D4F;">*</Span>售价
            </Span>
          ),
          key: 'retailPrice',
          dataIndex: 'retailPrice',
          align: 'center',
          width: 300,
          scopedSlots: { customRender: 'retailPrice' }
        },
        {
          title: () => (
            <a-tooltip placement="topRight" title="商品销售以此库存为准，请正确填写">
              <Span>
                <Span style="color: #FF4D4F;">*</Span>可售库存
                <a-icon type="question-circle" theme="filled" />
              </Span>
            </a-tooltip>
          ),
          key: 'stock',
          dataIndex: 'stock',
          align: 'center',
          width: 300,
          scopedSlots: { customRender: 'stock' }
        }
      ];

      columns = columns.concat(stockAndPriceCols);

      // 添加第三方识别码信息填写项
      columns.push({
        title: () => (
          <Span>第三方商品识别码</Span>
        ),
        key: 'pin',
        dataIndex: 'pin',
        width: 260,
        align: 'center',
        scopedSlots: { customRender: 'pin' }
      })
      if(this.isDefaultType==3 && this.stepType==2){
        columns.splice(columns.length-1,0,{
          title: () => (
            <Span>
              <Span style="color: #FF4D4F;">*</Span>重量（kg）
            </Span>
          ),
          key: 'weight',
          dataIndex: 'weight',
          width: 260,
          align: 'center',
          scopedSlots: { customRender: 'weight' }
        })
      }

      columns.push({
        title: '操作',
        width: 220,
        key: 'options',
        align: 'center',
        fixed: 'right',
        scopedSlots: { customRender: 'options' }
      })

      columns.push({
        title: '调序',
        width: 120,
        key: 'sort',
        align: 'center',
        fixed: 'right',
        customRender: (text, record, index) => {
          return {
            children: (
              <Div class={'operate-btns-wrapper'}>
                {
                  !this.isProvider
                    ? <P class={'sort-icons'}>
                      <ATooltip placement="top" title={'上移'}>
                        <AIcon type={'up-circle'} class={index === 0 ? 'disabled' : ''} onClick={() => this.handleSortSku(record, index, -1)}/>
                      </ATooltip>
                      <ATooltip placement="top" title={'下移'}>
                        <AIcon type={'down-circle'} class={index >= this.skus.length - 1 ? 'disabled' : ''} onClick={() => this.handleSortSku(record, index, 1)}/>
                      </ATooltip>
                      <ATooltip placement="top" title={'置顶'}>
                        <AIcon type={'vertical-align-top'} class={index === 0 ? 'disabled' : ''} onClick={() => this.handleSortSku(record, index, 0)}/>
                      </ATooltip>
                    </P> : null
                }
                {/* {
                  !this.isProvider
                    ? <P class={'custom-sort'}>
                      <AButton type="link" disabled={this.skus.length === 1} onClick={() => this.handleCustomSortSku(record, index)}>调序</AButton>
                    </P> : null
                } */}
              </Div>
            ),
            attrs: {
              rowSpan: record.spec0RowSpan
            }
          }
        }
      })

      return columns
    }
  },
  watch: {
    skus: {
      handler(data) {
        this.skuDiff++
        const skus = data.map((v) => {
          let specValueArr = [];

          this.specListInfo.forEach((specItem) => {
            specValueArr.push(v[specItem.key] || '');
          });

          return {
            cover: v.cover,
            spec_value: specValueArr.join(','),
            spec_value_arr: specValueArr || [],
            retail_price: v.retailPrice,
            stock: v.stock,
            pin: v.pin,
            weight:v.weight,
            enabled: v.enabled ? 1 : 0
          }
        })

        this.$emit('change', {
          skus,
          skuDiff: this.skuDiff
        })
      },
      deep: true
    },
    cateSpec: {
      handler(newCateSpec) {
        newCateSpec && this.initSpec(newCateSpec);
      },
      immediate: true
    },
    cateSpecOption: {
      handler() {
        this.cateSpec && this.initSpec(this.cateSpec);
      },
      immediate: true
    }
  },
  methods: {
    initSpec(cateSpec) {
      this.specListInfo = [];

      if (!cateSpec && this.isHealth) {
        this.specListInfo.push({
          key: 'spec0',
          spec_id: 0,
          spec_name: '',
          list: [
            {
              field_type: 'text',
              field_name: '',
              field_val: '',
              extra: {},
              max_len: 50,
              show_msg: '',
              cover: ''
            }
          ],
          withImg: true
        })
      }
      cateSpec && cateSpec.split(',').forEach((spec, index) => {
        const listItemObj = {
          field_type: 'text',
          field_val: '',
          field_name: spec,
          extra: {},
          max_len: spec.indexOf('规格') > -1 ? 50 : 20,
          show_msg: ''
        };

        if (index === 0) {
          listItemObj.cover = ''
        }

        this.specListInfo.push({
          key: `spec${index}`,
          spec_id: index,
          spec_name: spec,
          list: [listItemObj],
          withImg: index === 0
        })
      })

      const optionIndexStart = this.specListInfo.length;
      this.cateSpecOption && this.cateSpecOption.split(',').forEach((spec, index) => {
        const listItemObj = {
          field_type: 'text',
          field_val: '',
          field_name: `${spec}(选填)`,
          extra: {},
          max_len: spec.indexOf('规格') > -1 ? 50 : 20,
          show_msg: ''
        };

        this.specListInfo.push({
          key: `spec${optionIndexStart + index}`,
          spec_id: optionIndexStart + index,
          spec_name: `${spec}(选填)`,
          list: [listItemObj],
          withImg: false,
          is_option: true // 是否为选填
        })
      })

      this.skus = this.combineSpecs(this.specListInfo);
      this.skus = this.initSkus(this.skus);
      this.combineRow();
    },
    initSkus(skus = []) {
      return skus.map((itemSku, index) => {
        return {
          ...itemSku,
          skuId: index,
          retailPrice: '',
          stock: '',
          pin: '',
          weight:'',
          enabled: true
        }
      });
    },
    filterEmptySku() {
      const excludeKey = ['enabled', 'skuId']; // 不用判断空的属性
      this.skus = this.skus.filter((itemSku) => {
        let isEmpty = true;

        const skuKeysArr = Object.keys(itemSku);

        for (let i = 0; i < skuKeysArr.length; i++) {
          const key = skuKeysArr[i];
          if (!excludeKey.includes(key) && itemSku[key]) {
            isEmpty = false;
            break;
          }
        }

        return !isEmpty;
      });
    },
    goToWindow() {
      window.scrollTo(0, 0);
      this.$emit('setValidateField')
    },
    getRowKey(record, index) {
      return record.skuId !== undefined ? record.skuId : index
    },
    /**
     * 根据规格项个数,生成组合的sku{spec0,..., specn, cover, ...others}
     * @param specsList
     */
    combineSpecs(specsList = []) {
      if (specsList.length <= 0) {
        return [{}];
      } else {
        const [head, ...tail] = specsList;
        // 递归获取一个数组
        const othersSpec = this.combineSpecs(tail);

        const list = head.list || [];
        const pairs = list.map((item) => {
          const obj = {};
          obj[head.key] = item.field_val;

          if (head.withImg) {
            obj.cover = item.cover;
          }

          return othersSpec.map((otherItem) => {
            return {
              ...otherItem,
              ...obj
            }
          });
        });

        return [].concat(...pairs);
      }
    },
    // 获取初始的图片信息
    getInitSpecPics(specInfo = {}) {

      if (!specInfo.notFstInit) {
        specInfo.notFstInit = true; // 是否是第一次初始化
      }
      const specList = specInfo.list || [];

      if (specList.length <= 0 || (specList.length === 1 && !specList[0].cover)) {
        return [];
      } else {
        const pics = specList.map((itemSpec) => {
          return {
            url: itemSpec.cover || ''
          }
        });

        return pics;
      }
    },
    // 批量上传图片
    handleChangeBatchUpload({ fileList, upload }, specInfo = {}) {
      const generateNewSpec = (url = '') => {
        const lastSpec = specInfo.list[specInfo.list.length - 1];
        const newSpecItem = cloneDeep(lastSpec);

        newSpecItem.field_val = '';
        newSpecItem.cover = url;
        specInfo.list.push(newSpecItem);
      }

      if (fileList && fileList.length > 0) {
        fileList.forEach((fileItem, index) => {
          const specLen = specInfo.list.length;

          if (index >= specLen) {
            generateNewSpec((fileItem || {}).url);
          } else {
            specInfo.list[index].cover = specInfo.list[index].cover || (fileItem || {}).url;
          }
        });

        // 新增一个空白的
        // if (specInfo.list.length <= fileList.length) {
        //   generateNewSpec('');
        // }

        // this.handleUpdateSpecList(specInfo.list, specInfo);
      }
    },
    /**
     * 从skus中删除指定的spec值的sku
     */
    deleteSpecSkus(key, val) {
      return this.skus.filter((sku, index) => {
        return sku[key] !== val;
      });
    },
    handleUpdateSpecList(updateInfo = {}, specInfo) {
      specInfo.list = updateInfo.list || [];
      const optionType = updateInfo.type;
      const specKey = updateInfo.specKey;
      const specVal = updateInfo.specVal;

      const temSpecInfo = cloneDeep(this.specListInfo);
      const combinesku = this.combineSpecs(temSpecInfo);

      // 若是删除某项, 则先操作删除sku
      if (optionType === 'DELETE') {
        this.skus = this.deleteSpecSkus(specKey, specVal);
      }

      this.skus = this.mergeSkuData(this.skus, combinesku, optionType);

      this.combineRow();

      // spe0中，任何图片的改动都要同步更新到批量上传图片的fileList
      this.updateBatchPictures(specInfo.list);
      // console.log('=== test 最终组合结果', this.skus);
    },
    // 同步更新批量上传里维护的fileList
    updateBatchPictures(specList) {
      const patchUploadElem = this.$refs.patchUpload && this.$refs.patchUpload[0];
      if (patchUploadElem) {
        const newFileList = specList.map((item, index) => {
          return {
            name: `field${index}`,
            url: item.cover || ''
          }
        });

        patchUploadElem.changeFileList(newFileList);

        this.$nextTick(() => {
          // 通知specList组件进行更新图片顺序等
          this.$refs.specList && this.$refs.specList[0] && this.$refs.specList[0].updateSpec0FileList()
        });
      }
    },
    /**
     * 合并sku数据, 以targetskus为最终生成结果
     */
    mergeSkuData(originSkus = [], targetSkus = [], optionType) {
      let result = [];

      if (!originSkus || originSkus.length === 0) {
        result = this.initSkus(targetSkus);
        return result;
      }

      if (!targetSkus || targetSkus.length === 0) {
        return originSkus;
      }

      result = targetSkus.map((targetSku) => {
        const sameSkuIndex = originSkus.findIndex((originSku, index) => {
          let sameSpec = true;
          Object.keys(targetSku).forEach((itemKey) => {
            const reg = /^spec\d$/;
            if (reg.test(itemKey)) {
              if (originSku[itemKey] !== targetSku[itemKey]) {
                sameSpec = false;
              }
            }
          });

          return sameSpec;
        });

        // 合并同一店铺的sku
        if (sameSkuIndex >= 0) {
          const originSku = originSkus[sameSkuIndex] || {};
          return {
            ...originSku,
            ...targetSku
          }
        } else {
          return {
            ...targetSku,
            retailPrice: '',
            stock: '',
            pin: '',
            weight:'',
            enabled: true
          }
        }
      });


      return result;
    },
    /**
     * 校验价格
     */
    checkPrice(price) {
      return price.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1');
    },
    isAllZero(value) {
      const strValue = String(value).split('');
      return strValue.length > 0 && strValue.every((item) => item === '0')
    },
    updateBatchDisabled() {
      this.batchBtnDisabled = !(+this.batchData.price > 0) && !(+this.batchData.stock > 0);
    },
    onChangeBatchPrice(e) {
      this.batchData.price = this.checkPrice(this.batchData.price);
      if (+this.batchData.price > 999999.99) {
        this.batchData.price = this.batchData.price.slice(0, this.batchData.price.length - 1)
      }

      this.updateBatchDisabled();
    },
    onBlurBatchPrice(e) {
      if (+this.batchData.price > 0) {
        this.batchData.price = (+this.batchData.price).toFixed(2)
      }

      if (this.isAllZero(this.batchData.price)) {
        this.batchData.price = 0
      }
    },
    handleChangeBatchStock() {
      this.updateBatchDisabled();
    },
    /**
     * 批量修改库存和价格
     */
    handleBatchChangeStockPrice() {
      this.skus.forEach((itemSku, index) => {
        if (this.batchData.stock > 0) {
          this.updateSku('stock', this.batchData.stock, index);
        }

        if (this.batchData.price > 0) {
          this.updateSku('retailPrice', this.batchData.price, index);
        }
      });
    },
    setCoverRule(index) {
      const checkFunc = (rule, value, callback) => {
        setTimeout(() => {
          const { cover } = this.skus[index]
          if (!cover) {
            callback(new Error('请上传规格图片'))
          } else {
            callback()
          }
        }, 1000)
      }
      return { validator: checkFunc, trigger: 'change' }
    },
    // 价格规则
    setPriceRule(index) {
      const checkFunc = (rule, value, callback) => {
        const { retailPrice } = this.skus[index]
        if (!+retailPrice || +retailPrice > 999999.99) {
          callback(new Error('请输入商品售价，最多输入999,999.99'))
        } else {
          callback()
        }
      }
      return { validator: checkFunc, trigger: 'blur' }
    },
    /**
     * 更新sku数据
     */
    updateSku(key, value, skuIndex) {
      // let skuIndex = this.skus.findIndex((sku) => sku.skuId === skuId)
      if (skuIndex > -1) this.$set(this.skus[skuIndex], key, value)
    },
    previewPics(index) {
      if (this.skus[index].cover) {
        return [{ url: this.skus[index].cover }];
      } else {
        return [];
      }
    },
    /**
     * sku 图片上传
     */
    handleUpload({ upload }, record, index) {
      const url = upload.url || '';
      this.updateSku('cover', url, index)
    },
    /**
     * 监听价格输入
     */
    onChangePrice(e, record, index) {
      // const { skuId } = record
      let { value } = e.target
      value = value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1')
      if (+value > 999999.99) return false
      this.updateSku('retailPrice', value, index)
    },
    /**
     * 监听价格失焦
     */
    onBlurPrice(e, record, index) {
      // const { skuId } = record
      let { value } = e.target
      if (+value > 0) {
        value = (+value).toFixed(2)
      }
      this.updateSku('retailPrice', value, index)
    },
    setStockRule(index) {
      const checkFunc = (rule, value, callback) => {
        const { stock } = this.skus[index]
        if (!+stock) {
          callback(new Error('请输入可售库存，仅支持输入正整数'))
        } else {
          callback()
        }
      }
      return { validator: checkFunc, trigger: 'blur' }
    },
    // 设置重量的校验规则
    setWeightRule(index){
      const checkFunc = (rule, value, callback) => {
        const { weight } = this.skus[index]
        const num_weight=Number(weight)
        const [integer, decimal] = weight.toString().split('.');
        const fixLength=decimal ? decimal.length <= 1 : true;
        if (!+weight || !fixLength || num_weight>999.9) {
          callback(new Error('输入框中仅支持填写0-999.9之间的数字，支持精确到小数点后一位'))
        }else {
          callback()
        }
      }
      return { validator: checkFunc, trigger: 'blur' }
    },
    /**
     * 监听库存输入
     */
    onChangeStock(e, record, index) {
      // const { skuId } = record
      let { value } = e.target
      value = value.replace(/[^\d]/g, '')
      this.updateSku('stock', value, index)
    },
    /**
     * 监听库存失焦
     */
    onBlurStock(e, record, index) {
      // const { skuId } = record
      let { value } = e.target
      this.updateSku('stock', value, index)
    },
    /**
     * 监听第三方识别码输入
     */
    onChangeSbm(e, record, index) {
      // const { skuId } = record
      let { value } = e.target
      this.updateSku('pin', value, index)
    },
    /**
     * 监听重量输入
     */
    onChangeWeight(e, record, index){
      let { value } = e.target
      this.updateSku('weight', value, index)
    },
    onBlurWeight(e, record, index){
      let { value } = e.target
      this.updateSku('weight', value, index)
    },
    changeSwitch(checked, e, record, index) {
      // const { skuId } = record
      this.updateSku('enabled', checked, index)
    },
    // 排序
    handleSortSku(record, index, type) {
      if ((type === 0 && index <= 0) || (type === -1 && index === 0)) return;

      const count = record.spec0RowSpan || 1;
      const currToSortSkus = this.skus.splice(index, count);
      if (type === 0) { // 置顶
        this.skus.unshift(...currToSortSkus)
      } else { // 上移 / 下移
        const targetIndex = (type * count) + index;
        this.skus.splice(targetIndex, 0, ...currToSortSkus)
      }

      const newSortSpec0 = this.getTargetSpecItems(this.skus, 'spec0');
      this.sortSpec0(newSortSpec0);
      this.combineRow();
      // this.fixedRenderMiss();
    },
    /**
     * 根据最新的排序，对规格名称第一项里的list进行排序
     */
    sortSpec0(newSortList = []) {
      let spec0List = this.specListInfo[0].list;
      const finalList = [];

      newSortList.forEach((newItemVal) => {
        const targetIndex = spec0List.findIndex((spec0Item) => spec0Item.field_val == newItemVal);

        if (targetIndex > -1) {
          finalList.push(spec0List[targetIndex]);
          spec0List.splice(targetIndex, 1);
        }
      });

      this.specListInfo[0].list = finalList.concat(spec0List);

      this.$nextTick(() => {
        // 通知specList组件进行更新图片顺序等
        this.$refs.specList && this.$refs.specList[0] && this.$refs.specList[0].updateSpec0FileList()
      });
    },
    getTargetSpecItems(skus, key) {
      if (skus && skus.length > 0) {
        const skusSpecArr = skus.map((item) => {
          return item[key]
        });

        const newItems = [...new Set(skusSpecArr)]

        return newItems;
      }

      return []
    },
    /**
     * 合并单元格
     */
    combineRow() {
      this.filterEmptySku();
      if (!this.specListInfo || this.specListInfo.length <= 0) return;
      for (let i = 0; i < this.specListInfo.length - 1; i++) {
        const preKey = i > 0 ? this.specListInfo[i - 1].key : '';
        this.combineSpecRow(this.specListInfo[i].key, preKey);
      }
    },
    /**
     * 按照spec的key值来合并
     * @param key
     */
    combineSpecRow(key, preKey) {
      // preKey分成的组
      if (preKey) {
        for (let groupIndex = 0; groupIndex < this.skus.length;) {
          const count = this.skus[groupIndex][`${preKey}RowSpan`] || 1;
          const endIndex = (groupIndex + count) < this.skus.length ? groupIndex + count : this.skus.length;
          let currGroup = this.skus.slice(groupIndex, endIndex);

          this.combineTargetArrSpecRow(key, currGroup)
          groupIndex = endIndex;
        }
      } else {
        if (this.skus) {
          this.combineTargetArrSpecRow(key, this.skus);
        }
      }
    },
    /**
     * 对数组arr按照key值进行合并
     * @param key
     * @param arr
     */
    combineTargetArrSpecRow(key, arr = []) {
      for (let i = 0; i < arr.length; i++) {
        const itemSku = arr[i] || {};
        let count = 1;
        itemSku[`${key}RowSpan`] = count;

        for (let j = i + 1; j < arr.length; j++) {
          // 如果是同一个值，往后递增
          if (itemSku[key] === arr[j][key]) {
            count++;
            // 往后相同的值都设为空单元格
            arr[j][`${key}RowSpan`] = 0;
            // 只有同值第一个才设置合并的单元格数
            itemSku[`${key}RowSpan`] = count;
            if (j === arr.length - 1) {
              return;
            }
          } else {
            // 指针跳转到下一个，从下一排开始
            i = j - 1;
            break
          }
        }
      }
    }
  },
  created() {},
  mounted() {}
}
</script>

// specLIst
<template>
  <div class="spec-content-wrapper">
    <!-- 左侧spec项 -->
    <div
      :class="['spec-content-item', specWithImg ? 'spec-content-item_with-img' : '']"
      v-for="(field, index) in specList"
      :key="index">
      <!-- 图片 -->
      <a-form-model-item
        v-if="specWithImg"
        ref="cover"
        prop="cover"
        class="upload-item"
        :rules="setCoverRule(index)">
        <div class="opt-preview">
          <c-upload
            :ref="`upload${specInfo.key}`"
            :style="{width: '36px', height: '36px'}"
            :text="''"
            :upload-num="1"
            :cropOption="{ autoCropWidth: 1000, autoCropHeight: 1000, fixed: false }"
            :preview-pics="previewPics(index)"
            :allowCrop="Number(cateType) === 16"
            :customerIcon="true"
            @change="handleUpload($event, index)">
            <template v-slot:customerIcon>
              <div class="opt-preview-upload-icon" />
            </template>
          </c-upload>
        </div>
      </a-form-model-item>

      <!-- 输入框 -->
      <a-form-model-item
        class="inline-form-item"
        :ref="`inline-form-item${specInfo.key}`"
        :prop="specInfo.key"
        :rules="setSpecItemRule(index)">
          <a-input
            :value="field.field_val"
            :disabled="field.disabled"
            :placeholder="`请输入${field.field_name || ''}`"
            :maxLength="field.max_len && Number(field.max_len)"
            @change="(e) => onChangeInput(e, field, index)"
            @focus="(e) => onFocusInput(e, field, index)"
            @blur="(e) => onBlurInput(e, field, index)"
          />

        <!-- 尺寸 -->
        <!-- <SizeSelect :show="specName == '尺寸' && field.focus" @close="handleSizeClose(index)"/> -->
      </a-form-model-item>

      <!-- 操作按钮 -->
      <div class="opt_btn_box">
        <a-icon type="delete" :style="{'font-size': '20px', color: specList && specList.length > 1 ? 'red' : 'gray'}" @click.stop="handleFieldDel(index)"/>
      </div>
    </div>

    <!-- 增加一个spec项 -->
    <a-button
      class="right-add"
      :disabled="addDisabled"
      @click.stop="addNewField">
      <a-icon type="plus" />
    </a-button>
  </div>
</template>

<script lang="jsx">
import CUpload from '@/components/common/Upload.vue'
import { cloneDeep } from 'lodash';
// import SizeSelect from './SizeSelect.vue';

export default {
  data() {
    return {
      specList: [],
      addDisabled: false
    }
  },
  props: {
    specInfo: {
      type: Object,
      default: () => {}
    },
    cateType: {
      type: String
    },
    goodsIsOnline: {
      type: Boolean,
      default: false
    },
    needOfflineBeforeDelete: {
      type: Boolean,
      default: false
    },
    skus:{
      type:Array,
      default:()=>[],
    }
  },
  components: {
    CUpload
    // SizeSelect
  },
  computed: {
    specWithImg() {
      return this.specInfo.withImg;
    },
    originSpecList() {
      return this.specInfo.list || [];
    },
    specName() {
      return this.specInfo.spec_name || '';
    },
    // 是否为选填字段
    isOption() {
      return this.specInfo.is_option;
    }
  },
  watch: {
    originSpecList: {
      handler(newVal) {
        this.copyToData(newVal)
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    copyToData(FieldsList = []) {
      this.specList = FieldsList.map(field => {
        return { ...field }
      })
    },
    onFocusInput(e, field, index) {
      this.updateSpecList('focus', true, index);
    },
    onBlurInput(e, field, index) {
      if (field.field_val) {
        setTimeout(() => {
          const formItemElems = this.$refs[`inline-form-item${this.specInfo.key}`];
          let currElems = null;
          if (formItemElems && index < formItemElems.length) {
            currElems = formItemElems[index];
          }

          // 规格重复，则置空
          if (currElems && currElems.validateState === 'error') {
            this.updateSpecList('field_val', '', index);
            this.updateSpecListInfo({});
          }
        }, 300);
      }
    },
    onChangeInput(e, field, index) {
      console.log(1111111);
      const val = e.target.value;

      // field.field_val = val;
      this.updateSpecList('field_val', val, index);
      this.updateSpecListInfo({});
    },
    /**
     * 增加一条spec
     */
    addNewField() {
      const lastIndex = this.specList.length - 1;
      const lastField = this.specList[lastIndex] || {};

      const newField = cloneDeep(lastField);
      newField.field_val = '';
      newField.skuId = '';
      newField.focus = false;
      newField.cover = '';

      this.specList.push(newField);

      this.updateSpecListInfo({ type: 'ADD', fieldVal: newField.field_val });
    },
    handleSizeClose(index) {
      this.$set(this.specList[index], 'focus', false)
    },
    // 删除某个条目
    handleFieldDel(index) {
      if (this.specList && this.specList.length <= 1) {
        return;
      }

      // 商品是上架状态，删除某个条目，需要先下架商品
      if (this.goodsIsOnline && this.needOfflineBeforeDelete) {
        this.$confirm({
          title: '确认下架商品',
          content: '下架商品才能删除规格项，确定要下架商品吗？',
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            this.$emit('offlineGoods');
          }
        })
      } else {
        const fieldVal = this.specList[index].field_val;
        this.specList.splice(index, 1);
        this.$message.success('删除成功');
        this.updateSpecListInfo({ type: 'DELETE', fieldVal });
      }
    },
    /**
     * 更新某条spec的信息
     * @param key
     * @param value
     * @param index
     */
    updateSpecList(key, value, index) {
      if (index > -1 && index < this.specList.length) {
        this.$set(this.specList[index], key, value);
      }
    },
    // 更新列表中的数据
    updateSpecListInfo({ type = 'UPDATE', fieldVal }) {
      console.log('=== 当前的speclist', this.specList, type, fieldVal);

      this.$emit('updateSpecList', {
        list: this.specList,
        specKey: this.specInfo.key,
        specVal: fieldVal,
        type
      });
    },
    setSpecItemRule(index) {
      const checkFunc = (rule, value, callback) => {
        const { field_val } = this.specList[index];
        const sameValArr = this.specList.filter((item) => field_val && item.field_val === field_val);
        if (sameValArr && sameValArr.length > 1) {
          callback(new Error('规格重复，请重新填写'))
        } else if (!field_val) {
          // 是选填的话，所有都未填，或者所有都填了，就不报错, 否则报错
          if (this.isOption) {
            const hasValueItem = this.specList.filter((item) => item.field_val);

            if (hasValueItem && hasValueItem.length > 0) {
              callback(new Error(`请输入${this.specName}`))
            } else {
              callback()
            }
          } else {
            callback(new Error(`请输入${this.specName}`))
          }
        } else {
          if (field_val.includes(',')) {
            callback(new Error(`不支持输入,请修改`))
          } else {
            callback()
          }
        }
      }
      return { validator: checkFunc, trigger: 'blur' }
    },
    setCoverRule(index) {
      const checkFunc = (rule, value, callback) => {
        setTimeout(() => {
          const { cover } = this.specList[index]
          if (!cover) {
            callback(new Error('请上传规格图片'))
          } else {
            callback()
          }
        }, 1000)
      }
      return { validator: checkFunc, trigger: 'blur' }
    },
    previewPics(index) {
      if (this.specList[index].cover) {
        return [{ url: this.specList[index].cover }];
      } else {
        return [];
      }
    },
    handleUpload({ upload }, index) {
      const url = upload ? upload.url : '';
      this.updateSpecList('cover', url, index);
      this.updateSpecListInfo({});
    },
    updateSpec0FileList() {
      if (this.specWithImg) {
        const uploadKey = `upload${this.specInfo.key}`;
        const uploadElem = this.$refs[uploadKey];

        this.specList.forEach((itemField, index) => {
          uploadElem[index].updateFileList(0, itemField.cover);
        });
      }
    }
  }
}
</script>

// 编辑态的sku组合
specListInfo: [], // 规格信息, e.g, 规格[{key: 'spec0',spec_name: '款式', list: []}, {key: 'spec1',spec_name: '颜色', list: []}}
      skus: [{
        skuId: 0,
        cover: '',
        images: '',
        specValue: [],
        retailPrice: '',
        stock: '',
        medical_store: [],
        retailer_uid: '',
        pin: '',
        weight:'',
        activity_type: '',
        enabled: true
      }],
      allCombSkus: [], // 根据规格项生成的所有sku组合，在会大于等于渲染出来的skus， 规格项之间的排列组合会allCombSkus中做增删改，从而不受skus的影响
    specData() {
      const specData = []
      if (!this.cateSpec && this.isHealth) {
        specData.push({
          index: 0,
          key: '',
          maxLength: 50
        })
      } else {
        this.cateSpec.split(',').forEach((spec, index) => {
          if (spec.indexOf('规格') > -1) {
            specData.push({
              index,
              key: spec,
              maxLength: 50
            })
          } else {
            specData.push({
              index,
              key: spec,
              maxLength: 20
            })
          }
        })
      }
      return specData
    },
  watch: {
    skuData: {
      handler(newVal) {
        if (newVal) {
          this.skus = newVal.map((v, i) => {
            v.isModifyStock = false
            v.specValue = v.specValue.map(spec => {
              return spec
            })
            v.enabled = String(v.enabled) === '1';
            v.skuId = v.sku_id || v.skuId;

            return v
          })
          // this.filterSameSpecSku();
          this.initSpec(this.cateSpec);

          // 页面滚动到指定sku所在位置
          this.$nextTick(() => {
            const ref = this.$refs.skuTable
            const skuEl = ref?.$el?.querySelector(`[data-row-key="${this.anchorSku}"]`)
            if (skuEl) {
              skuEl.style.animation = 'bgflash 2s linear forwards'
              const pos = skuEl.getBoundingClientRect()
              const offset = pos.top + 100
              window.scrollTo({
                top: offset,
                behavior: 'smooth'
              })
            }
          })
        }
      },
      immediate: true
    },
    skus: {
      handler(data) {
        this.skuDiff++
        const skus = data.map((v) => {
          const {
            skuId,
            cover,
            images,
            specValue,
            retailPrice,
            stock,
            pin,
            weight,
            enabled
          } = v;

          const formattedSku = {
            sku_id: skuId,
            cover,
            images: images ? images : '',
            spec_value: specValue.join(',') || '',
            spec_value_arr: specValue || [],
            retail_price: retailPrice,
            stock,
            pin,
            weight,
            enabled: enabled ? 1 : 0
          }

          if (v.hasOwnProperty('sync_groupby_stock')) {
            formattedSku.sync_groupby_stock = v.sync_groupby_stock
          }
          return formattedSku
        })

        this.$emit('change', {
          skus,
          skuDiff: this.skuDiff
        })
      },
      deep: true
    },
    cateSpec: {
      handler(newCateSpec) {
        newCateSpec && this.initSpec(newCateSpec);
      },
      immediate: true
    },
    cateSpecOption: {
      handler() {
        this.cateSpec && this.initSpec(this.cateSpec);
      },
      immediate: true
    }
  },
 filterSameSpecSku() {
      // 根据spec_value进行去重
      let specValuesArr = [];
      let filterSkus = [];
      this.skus.forEach(sku => {
        const key = sku.specValue.join(',');
        if (!specValuesArr.includes(key)) {
          specValuesArr.push(key);
          filterSkus.push(sku);
        }
      });

      this.skus = filterSkus;
    },
    /**
     * 由sku推算出specInfo里的list信息
     */
    getSpecListInitInfo(skus) {
      if (skus && skus.length > 0) {
        const skusArr = skus.map((item) => {
          return item.specValue
        });
        const columsSpec = this.extractColumns(skusArr);

        return columsSpec;
      }

      return []
    },
    /**
     * 提取二维数组的列信息
     */
    extractColumns(arr) {
      // 处理空数组
      if (arr.length === 0 || arr[0].length === 0) return [];

      // 获取列数（假设所有行长度一致）
      const columnsCount = arr[0].length;
      // 遍历每一列，提取数据
      let colArr = Array.from({ length: columnsCount }, (_, columnIndex) =>
        arr.map(row => row[columnIndex])
      );

      // 去重
      colArr = colArr.map((itemCol) => {
        return [...new Set(itemCol)]
      });

      return colArr;
    },
    /**
     * 根据specFieldList取spec值的第一张图片
     * [
     *  款1 [cover1, cover2, ...]
     *  款2 [cover3, coverx, ...]
     * ]
     * @param skus
     */
    getSpecCovers(fieldValue, skus) {
      const sameFieldValCovers = [];
      if (skus && skus.length > 0) {
        skus.forEach((sku) => {
          if (sku.specValue && sku.specValue[0] === fieldValue) {
            sameFieldValCovers.push(sku.cover);
          }
        });
        return sameFieldValCovers[0] || '';
      }

      return '';
    },
    initSpec(cateSpec) {
      this.specListInfo = [];
      this.filterSameSpecSku();
      const specFieldList = this.getSpecListInitInfo(this.skus);

      if (!cateSpec && this.isHealth) {
        const field_val = specFieldList[0] && specFieldList[0].length > 0 ? specFieldList[0][0] : '';
        this.specListInfo.push({
          key: 'spec0',
          spec_id: 0,
          spec_name: '',
          list: [
            {
              field_type: 'text',
              field_name: '',
              field_val: field_val || '',
              extra: {},
              max_len: 50,
              show_msg: '',
              cover: ''
            }
          ],
          withImg: true
        })
      }
      cateSpec && cateSpec.split(',').forEach((spec, index) => {
        let fieldList = [];
        if (specFieldList && index < specFieldList.length) {
          const listValArr = specFieldList[index] || [];

          fieldList = listValArr.map((itemField, itemIndex) => {
            const listItemObj = {
              field_type: 'text',
              field_val: itemField || '',
              field_name: spec,
              extra: {},
              max_len: spec.indexOf('规格') > -1 ? 50 : 20,
              show_msg: ''
            };

            if (index === 0) {
              const fstCover = this.getSpecCovers(itemField, this.skus);
              listItemObj.cover = fstCover || '';
            }

            return listItemObj;
          });
        } else {
          const listItemObj = {
            field_type: 'text',
            field_val: '',
            field_name: spec,
            extra: {},
            rules: {},
            max_len: spec.indexOf('规格') > -1 ? 50 : 20,
            show_msg: ''
          };

          if (index === 0) {
            listItemObj.cover = '';
          }

          fieldList.push(listItemObj);
        }

        this.specListInfo.push({
          key: `spec${index}`,
          spec_id: index,
          spec_name: spec,
          list: fieldList,
          withImg: index === 0
        })
      })

      const optionIndexStart = this.specListInfo.length;
      this.cateSpecOption && this.cateSpecOption.split(',').forEach((spec, index) => {
        let fieldList = [];
        const finalIndex = optionIndexStart + index;
        if (specFieldList && finalIndex < specFieldList.length) {
          const listValArr = specFieldList[finalIndex] || [];

          fieldList = listValArr.map((itemField, itemIndex) => {
            const listItemObj = {
              field_type: 'text',
              field_val: itemField || '',
              field_name: `${spec}(选填)`,
              extra: {},
              max_len: spec.indexOf('规格') > -1 ? 50 : 20,
              show_msg: ''
            };
            return listItemObj;
          });
        } else {
          const listItemObj = {
            field_type: 'text',
            field_val: '',
            field_name: `${spec}(选填)`,
            extra: {},
            rules: {},
            max_len: spec.indexOf('规格') > -1 ? 50 : 20,
            show_msg: ''
          };

          fieldList.push(listItemObj);
        }

        this.specListInfo.push({
          key: `spec${optionIndexStart + index}`,
          spec_id: optionIndexStart + index,
          spec_name: `${spec}(选填)`,
          list: fieldList,
          withImg: false,
          is_option: true // 是否为选填
        })
      })

      const combinesku = this.combineSpecs(this.specListInfo);
      this.skus = this.initSkus(this.skus);
      this.allCombSkus = this.mergeSkuData(this.skus, combinesku, 'INIT');
      this.combineRow();

      // console.log('=== test 初始化规格信息', this.specListInfo, this.skus);
    },
    /**
     * 将sku中的specvalue转化为spec0： **， spec1: **， ..., specn：**
     * @param skus
     */
    initSkus(skus = []) {
      return skus.map((itemSku, index) => {
        this.specListInfo.forEach((itemSpec, itemIndex) => {
          const specKey = itemSpec.key;
          itemSku[specKey] = itemSku.specValue && itemIndex < itemSku.specValue.length ? itemSku.specValue[itemIndex] : '';
        });

        return {
          ...itemSku
        }
      });
    },
    filterEmptySku() {
      const excludeKey = ['enabled', 'skuId', 'specValue', 'isNewSku']; // 不用判断空的属性
      this.skus = this.skus.filter((itemSku) => {
        let isEmpty = true;

        const skuKeysArr = Object.keys(itemSku);

        for (let i = 0; i < skuKeysArr.length; i++) {
          const key = skuKeysArr[i];
          if (!excludeKey.includes(key) && itemSku[key]) {
            isEmpty = false;
            break;
          }
        }

        return !isEmpty;
      });
    },
    getRowKey(record, index) {
      return record.skuId || index
    },
    /**
     * 根据spec0----specn更新sku中的SpecValue
     * @param sku
     */
    updateSpecValue(sku = {}) {
      let finalSpecValueArr = [];

      // Object.keys(sku).forEach((itemKey) => {
      //   const reg = /^spec\d$/;
      //   if (reg.test(itemKey)) {
      //     finalSpecValueArr.push(sku[itemKey]);
      //   }
      // });

      this.specListInfo.forEach((specItem) => {
        finalSpecValueArr.push(sku[specItem.key] || '');
      });

      return finalSpecValueArr;
    },
    /**
     * 根据规格项个数,生成组合的sku{spec0,..., specn, cover, ...others}
     * @param specsList
     */
    combineSpecs(specsList = []) {
      if (specsList.length <= 0) {
        return [{}];
      } else {
        const [head, ...tail] = specsList;
        // 递归获取一个数组
        const othersSpec = this.combineSpecs(tail);

        const list = head.list || [];
        const pairs = list.map((item) => {
          const obj = {};
          obj[head.key] = item.field_val;

          if (head.withImg) {
            obj.cover = item.cover;
          }

          return othersSpec.map((otherItem) => {
            return {
              ...otherItem,
              ...obj
            }
          });
        });

        return [].concat(...pairs);
      }
    },
    /**
     * 从所有组合skus中删除指定的spec值的sku
     */
    deleteSpecSkus(key, val) {
      return this.allCombSkus.filter((sku, index) => {
        return sku[key] !== val;
      });
    },
    handleUpdateSpecList(updateInfo = {}, specInfo) {
      specInfo.list = updateInfo.list || [];
      const optionType = updateInfo.type;
      const specKey = updateInfo.specKey;
      const specVal = updateInfo.specVal;

      // 新组合出来的
      const temSpecInfo = cloneDeep(this.specListInfo);
      const combinesku = this.combineSpecs(temSpecInfo);

      // 若是删除某项, 则先操作删除sku
      if (optionType === 'DELETE') {
        this.allCombSkus = this.deleteSpecSkus(specKey, specVal);
      }

      this.allCombSkus = this.mergeSkuData(this.allCombSkus, combinesku, optionType);
      // 所有变动同步更新到最终的skus
      this.skus = this.allCombSkus;
      this.combineRow();

      // spe0中，任何图片的改动都要同步更新到批量上传图片的fileList
      this.updateBatchPictures(specInfo.list);
      // console.log('=== test 最终组合结果', this.skus, this.allCombSkus);
    },
    /**
     * 合并sku数据, 以targetskus为最终生成结果
     */
    mergeSkuData(originSkus = [], targetSkus = [], optionType) {
      let result = [];

      if (!originSkus || originSkus.length === 0) {
        result = this.initSkus(targetSkus);
        return result;
      }

      if (!targetSkus || targetSkus.length === 0) {
        return originSkus;
      }

      result = targetSkus.map((targetSku, targetIndex) => {
        targetSku.specValue = this.updateSpecValue(targetSku);
        const sameSkuIndex = originSkus.findIndex((originSku, index) => {
          let sameSpec = true;
          Object.keys(targetSku).forEach((itemKey) => {
            const reg = /^spec\d$/;
            if (reg.test(itemKey)) {
              if (originSku[itemKey] !== targetSku[itemKey]) {
                sameSpec = false;
              }
            }
          });

          return sameSpec;
        });

        // 合并相同skus, 但若是targetSkus中已存在该规格，那么就创建新的
        if (sameSkuIndex >= 0) {
          const originSku = originSkus[sameSkuIndex] || {};

          const sameTargetSkuIndex = targetSkus.findIndex((sku, index) => {
            return String(sku.skuId) === String(originSku.skuId);
          });

          if (sameTargetSkuIndex >= 0) {
            return {
              ...targetSku,
              retailPrice: '',
              skuId: '',
              stock: '',
              pin: '',
              isNewSku: true,
              enabled: true,
              state: originSku.state
            }
          } else {
            targetSku.skuId = originSku.skuId;
            return {
              ...originSku,
              ...targetSku
            }
          }
        } else {
          let newsku = {};
          let enabled = true;

          if (optionType === 'DELETE' || optionType === 'ADD' || optionType === 'INIT') {
            newsku = {
              ...targetSku,
              retailPrice: '',
              weight:'',
              skuId: '',
              stock: '',
              pin: '',
              isNewSku: true,
              enabled: optionType === 'INIT' ? false : enabled
            }
          } else {
            // TODO: 待测试
            const originSku = targetIndex < originSkus.length ? originSkus[targetIndex] : {};

            if (originSku.enabled !== null && originSku.enabled !== undefined) {
              enabled = originSku.enabled;
            }

            newsku = {
              ...targetSku,
              retailPrice: originSku.retailPrice || '',
              skuId: originSku.skuId || '',
              stock: originSku.stock || '',
              pin: originSku.pin || '',
              weight:originSku.weight || '',
              enabled,
              state: originSku.state
            }

            targetSku.skuId = newsku.skuId;
          }

          return newsku;
        }
      });

      return result;
    },
/**
     * 合并单元格(只在合并单元格的时候，去掉空sku， 不影响原来的排列顺序)
     */
    combineRow() {
      this.filterEmptySku();
      if (!this.specListInfo || this.specListInfo.length <= 0) return;
      for (let i = 0; i < this.specListInfo.length - 1; i++) {
        const preKey = i > 0 ? this.specListInfo[i - 1].key : '';
        this.combineSpecRow(this.specListInfo[i].key, preKey);
      }
    },
    /**
     * 按照spec的key值来合并
     * @param key
     */
    combineSpecRow(key, preKey) {
      // preKey分成的组
      if (preKey) {
        for (let groupIndex = 0; groupIndex < this.skus.length;) {
          const count = this.skus[groupIndex][`${preKey}RowSpan`] || 1;
          const endIndex = (groupIndex + count) < this.skus.length ? groupIndex + count : this.skus.length;
          let currGroup = this.skus.slice(groupIndex, endIndex);

          this.combineTargetArrSpecRow(key, currGroup)
          groupIndex = endIndex;
        }
      } else {
        if (this.skus) {
          this.combineTargetArrSpecRow(key, this.skus);
        }
      }
    },
    /**
     * 对数组arr按照key值进行合并
     * @param key
     * @param arr
     */
    combineTargetArrSpecRow(key, arr = []) {
      for (let i = 0; i < arr.length; i++) {
        const itemSku = arr[i] || {};
        let count = 1;
        itemSku[`${key}RowSpan`] = count;

        for (let j = i + 1; j < arr.length; j++) {
          // 如果是同一个值，往后递增
          if (itemSku[key] === arr[j][key]) {
            count++;
            // 往后相同的值都设为空单元格
            arr[j][`${key}RowSpan`] = 0;
            // 只有同值第一个才设置合并的单元格数
            itemSku[`${key}RowSpan`] = count;
            if (j === arr.length - 1) {
              return;
            }
          } else {
            // 指针跳转到下一个，从下一排开始
            i = j - 1;
            break
          }
        }
      }
    },
        // 排序
    handleSortSku(record, index, type) {
      if ((type === 0 && index <= 0) || (type === -1 && index === 0)) return;
      const count = record.spec0RowSpan || 1;
      const currToSortSkus = this.skus.splice(index, count);

      if (type === 0) { // 置顶
        this.skus.unshift(...currToSortSkus)
      } else { // 上移 / 下移
        const targetIndex = (type * count) + index;
        this.skus.splice(targetIndex, 0, ...currToSortSkus)
      }

      const newSortSpec0 = this.getTargetSpecItems(this.skus, 'spec0');
      this.sortSpec0(newSortSpec0);
      this.combineRow();

      this.fixedRenderMiss();
    },
    /**
     * 根据最新的排序，对规格名称第一项里的list进行排序
     */
    sortSpec0(newSortList = []) {
      let spec0List = this.specListInfo[0].list;
      const finalList = [];

      newSortList.forEach((newItemVal) => {
        const targetIndex = spec0List.findIndex((spec0Item) => spec0Item.field_val == newItemVal);

        if (targetIndex > -1) {
          finalList.push(spec0List[targetIndex]);
          spec0List.splice(targetIndex, 1);
        }
      });

      this.specListInfo[0].list = finalList.concat(spec0List);
      this.$nextTick(() => {
        // 通知specList组件进行更新图片顺序等
        this.$refs.specList && this.$refs.specList[0] && this.$refs.specList[0].updateSpec0FileList()
      });
    },
    getTargetSpecItems(skus, key) {
      if (skus && skus.length > 0) {
        const skusSpecArr = skus.map((item) => {
          return item[key]
        });

        const newItems = [...new Set(skusSpecArr)]

        return newItems;
      }

      return []
    },
