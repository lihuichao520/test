<template>
            <!-- 其他类目规格信息 -->
          <SkuInfoV2
            ref="sku"
            :cateSpec="cateSpec"
            :basicData="form"
            :skuData="skuData"
            :isDefaultType="isDefaultType"
            :stepType="stepType"
            :cateSpecOption="cateSpec_option"
            @change="handleChangeSku"/>
          <!-- 通用类目基本信息扩展字段 -->
          <JSX :jsx="renderExtendFields" />
</template>
<script lang="jsx">
export default {
  data() {
    return {
      catePath: '',
      specTypes: null, // 规格的组件类型
      specOptions: null, // 已选类目规格选项列表
      specTipMsg: null, // 类目规格提示信息
      needRemark: false // 规格信息是否需要备注
    }
  },
  handleChangeUpload({ fileList, upload }, fieldKey, field) {
    const pics = []
    fileList.forEach(file => {
      pics.push(file.url)
    })
    this.form[fieldKey] = pics.join(',')

    if (this.form.hasOwnProperty(`list${fieldKey}`)) {
      this.handleShowChildExtend(fieldKey, pics, field.field_type);
    }
  },
  // 联动表单项处理
  handleShowChildExtend(parentFieldKey, value, parentFieldType) {
    const tempExtendFields = []

    // 选择有联动子选项，把符合条件的子选项加入到extendFields去展示
    this.invisibleData.forEach(child => {
      const extra = JSON.parse(child.extra)
      if (extra.parent_trigger) {
        if (parentFieldType === 'upload') {
          const parentTriggerIsObj = isObject(extra.parent_trigger)
          const hasTriggerKey = parentTriggerIsObj ? extra.parent_trigger.hasOwnProperty(parentFieldKey) : (extra.parent_trigger === parentFieldKey)

          if (hasTriggerKey && value && value.length > 0 && !child.triggered) {
            // this.extendFields.push(child)
            child.triggered = true
            tempExtendFields.push(child)
          }
        } else {
          const parentTrigger = extra.parent_trigger[parentFieldKey]
          const hasExistIndex = this.extendFields.findIndex((item) => {
            return item.field_key === child.field_key
          });
          if (parentTrigger && parentTrigger.includes(value) && parentFieldKey !== 'delivery_time' && !(hasExistIndex >= 0)) {
            // delivery_time 发货时间的联动选项，直接在ratio子选项中处理过了，不需要再处理
            this.extendFields.push(child)
          }
        }
      }
    })
    // 把不符合条件的子选项从extendFields删除
    this.extendFields = this.extendFields.filter(child => {
      try {
        if (child.extra) {
          const extra = JSON.parse(child.extra)
          if (extra.parent_trigger) {
            if (parentFieldType === 'upload') {
              const parentTriggerIsObj = isObject(extra.parent_trigger)
              const hasTriggerKey = parentTriggerIsObj ? extra.parent_trigger.hasOwnProperty(parentFieldKey) : (extra.parent_trigger === parentFieldKey)

              if (hasTriggerKey) {
                child.triggered = value && value.length > 0
                return value && value.length > 0
              } else {
                child.triggered = true
                return true
              }
            } else {
              const parentTrigger = extra.parent_trigger[parentFieldKey]
              if (parentTrigger && parentTrigger.includes(value) === false) {
                return false
              }
            }
          }
        }
      } catch (e) {
        console.log(e)
      }
      return true
    })

    // 将图片上传后要展示的附加字段插入到相应的位置
    if (parentFieldType === 'upload') {
      const insertIndex = this.getFieldIndex(parentFieldKey);

      this.extendFields.splice(insertIndex + 1, 0, ...tempExtendFields)
    }
  },
  getFieldIndex(fieldKey) {
    let index = -1
    if (!this.extendFields || !this.extendFields.length) return -1

    for (let i = 0; i < this.extendFields.length; i++) {
      if (this.extendFields[i].field_key === fieldKey) {
        index = i
        break;
      }
    }

    return index
  },
  handleDateTimeChange(date, dateStr, field) {
    this.form[field.field_key] = date ? date.valueOf() : ''
  },
  renderDateTime(field) {
    return (
      <a-date-picker
        placeholder="请选择日期"
        v-model={this.form[`${field.field_key}display`]}
        defaultValue={undefined}
        format={field.format || 'YYYY-MM-DD'}
        style="width:260px"
        onChange={(date, dateStr) => this.handleDateTimeChange(date, dateStr, field)}/>
    )
  },
  renderExtendFields(h, context) {
    return (
      <div>

        {
          this.extendFields.map(field => {
            return (
              <a-form-model-item
                class="inline-label extend-field-form-wrap"
                key={field.field_id}
                prop={field.field_key}
                label={field.field_key === 'series_id' ?field.extra==''?field.field_name : JSON.parse(field.extra).rename : field.field_name}
                label-col={field.field_key === 'brand_product_qualification_name' ? { span: 6 } : null}
                wrapper-col={field.field_key === 'brand_product_qualification_name' ? { span: 18 } : null}
                rules={field.rules}>
                {
                  field.field_type === 'datetime' && this.renderDateTime(field)
                }
              </a-form-model-item>
            )
          })
        }
      </div>
    )
  },
  // 初始化类目的规格信息
  handleSpecInit(cateInfo) {
    if (cateInfo.path) {
      this.catePath = cateInfo.path
    }
    if (cateInfo.extra) {
      try {
        const extra = JSON.parse(cateInfo.extra)
        const specsList = extra.spec_options || []
        const typesList = extra.spec_type || []
        this.needRemark = Number(extra.need_remark) === 1;

        this.specOptions = {}
        this.specTipMsg = {}
        this.specTypes = {}
        specsList.forEach(item => {
          this.specOptions[item.spec_title] = item.option_list || []
          this.specTipMsg[item.spec_title] = item.show_tip_msg || ''
        })
        typesList.forEach(item => {
          this.specTypes[item.spec_title] = item.type_name || ''
        })
      } catch (e) {
        this.specOptions = null;
        this.specTipMsg = null;
        this.needRemark = false;
      }
    } else {
      this.needRemark = false;
    }
  },
  // 初始化具有品牌扩展字段的类目规格信息
  handleExtendBrandSpecInit(extend_field_list) {
    if (!extend_field_list || !extend_field_list.length) {
      return null
    }
    const brandField = extend_field_list.find(item => item.field_key === 'brand_name');
    if (brandField && brandField.extra) {
      this.handleSelectSearchChange(brandField.field_val, brandField)
    }
  },
      async getDraftExtendField(params) {
      if (!params.cate_id || !params.type) return
      try {
        const res = await getDraftExtendFieldApi(params)
        if (res.code === 0) {
          this.invisibleData.forEach(item => {
            this.form[`show${item.field_key}`] = false;
            this.form[item.field_key] = ''
            item.triggered = false
          })
          this.invisibleData = [];
          if (res.data && Array.isArray(res.data) && res.data.length > 0) {
            res.data.forEach((field, index) => {
              // 特殊处理
              if (field.field_key === 'hide_stock' && this.isEJournals) {
                field.field_default_val = '1';
              }
            })
          }
          this.initExtendFields(res.data, () => {
            this.extendFields.forEach((field, index) => {
              // 特殊处理
              if (field.field_key === 'hide_stock' && this.isEJournals) {
                field.field_default_val = '1';
              }
            })
          })
        }
      } catch (error) {
        console.log(error)
      }
    },
      handleSelectCate(cateInfo) {
      this.$refs.sku.onSelectCate && this.$refs.sku.onSelectCate()
      this.cateSpec = cateInfo.spec
      this.cateType = cateInfo.type
      this.currCateInfo = cateInfo || {}
      this.cateSpec_option = cateInfo.spec_optional || '';
      this.handleSpecInit(cateInfo)
      this.getDraftExtendField({ type: cateInfo.type, cate_id: cateInfo.cate_id })
    },
      // 初始化扩展字段数据
    initExtendFields(data, onCb) {
      this.extendFields = []
      // 解决重选泪目，扩展字段填写没重制的问题
      setTimeout(() => {
        this.extendFields = data || []
        let obj, children_extra;
        const tempForm = {}

        this.extendFields.forEach((field, index) => {
          // console.log('*** edit befoe', field, index);
          if (field.field_type === 'datetime') {
            const timeStamp = Number(field.field_val || field.field_default_val)
            tempForm[field.field_key] = timeStamp || ''
            tempForm[`${field.field_key}display`] = timeStamp && !isNaN(timeStamp) ? moment(new Date(timeStamp)) : undefined
          } else {
            tempForm[field.field_key] = field.field_val || field.field_default_val
          }

          children_extra = field.extra ? JSON.parse(field.extra).parent_trigger : '';
          if (field.extra && children_extra) {
            this.invisibleData.push(this.extendFields.slice(index, index + 1)[0])

            if (isObject(children_extra)) {
              for (let i in children_extra) {
                obj = {
                  parent_linkage: i || '',
                  children_linkae: field.field_key,
                  children_value: children_extra[i] || '',
                  children_name: field.field_name || ''
                };
                this.extendFields_extra.push(obj)
              }
            } else if (children_extra) {
              obj = {
                parent_linkage: children_extra || '',
                children_linkae: field.field_key,
                children_value: '',
                children_name: field.field_name || ''
              };
              this.extendFields_extra.push(obj)
            }

            this.eachChilren(obj.parent_linkage);

            // 如果是编辑页面有值的一开始就要绑值。 还有展示。
            this.invisibleData.forEach(item => {
              if (item.field_key === 'presale_time' && +item.field_val === 0) {
                item.field_val = '';
                tempForm[item.field_key] = '';
              }
              this.form[item.field_key] = item.field_val_show
            })
          }

          // console.log('*** edit after', field, index);
        })

        for (let i = 0; i < this.extendFields.length; i++) {
          children_extra = this.extendFields[i].extra ? JSON.parse(this.extendFields[i].extra).parent_trigger : '';
          // 实物电子刊, 要展示京东物流，但是实物电子刊没有is_gift,后端又无法去掉parent_trigger,所以前端处理
          if ((this.currCateInfo.cateId || this.currCateInfo.cate_id) === '8566' && this.extendFields[i].field_key === 'jdl_guarantee_service') {
            children_extra = ''
          }

          if (this.extendFields[i].extra && children_extra) {
            this.extendFields.splice(i, 1)
            i--
          }
        }

        this.extendFields.forEach(item => {
          this.extendFields_extra.forEach(value => {
            if (item.field_key === value.parent_linkage && value.children_value.includes(item.field_val)) {
              this.form[`show${value.children_linkae}`] = true
            }
          })

          // 处理联动数据，处理存在子选项的extendField
          if (item.extra && JSON.parse(item.extra) && JSON.parse(item.extra).child_trigger) {
            const itemFieldVal = item.field_key === 'is_gift' ? item.field_val || item.field_default_val || '0' : item.field_val;
            this.handleShowChildExtend(item.field_key, itemFieldVal, item.field_type);
          }
        })
        this.form = Object.assign({}, this.form, tempForm)
        onCb && onCb(this.extendFields)
      })
    },
  // 保存预览后，不再走copy逻辑, 而是正常的回显逻辑
  getData(data, isPreview = false) {
    const {} = data
    this.basicData = {
      root_cate,
      cateId: cateId || cate_id,
      cateName: cateName ? cateName.split(',') : [],
      sub_cate,
      goods_id,

    }
    this.cateType = type;
    this.cateName = cateName ? cateName.split(',') : []
    this.$set(this.form, 'name', name)
    this.$set(this.form, 'cateId', cateId || cate_id)
    this.currCateInfo.pid = sub_cate;
    this.currCateInfo.cateId = this.basicData.cateId

    this.initExtendFields(extend_field_list, (extendFields) => this.handleExtendBrandSpecInit(extendFields))
    // 处理类目中的规格信息
    try {
      const selectedCateInfo = findTreeNodeByID(this.cateOptions, cateId, { id: 'cate_id', children: 'sub' });
      this.handleSpecInit(selectedCateInfo)
    } catch (e) {}
    this.cateSpec = cateSpec || ''
    this.cateSpec_option = cate_spec_optional || '';
    this.skuData = skus.map((v) => {
      const {
        cover,
        images,
        spec_value,
        retail_price,
        stock,
        medical_store,
        retailer_uid,
        pin,
        weight,
        remark,
        enabled,
        sku_id
      } = v
      let finalStock = stock;
      let finalSkuId = sku_id;

      if (['modifyCopy', 'goodsCopy', 'editCopy'].includes(this.sourcePage) && !isPreview) {
        finalStock = 0;
        finalSkuId = '';
      }
      return {
        cover,
        images,
        specValue: spec_value.split(','),
        retailPrice: retail_price,
        stock: finalStock,
        medical_store,
        retailer_uid,
        pin,
        weight,
        remark,
        enabled,
        sku_id: finalSkuId
      }
    })
  },
  async getDraftInfo() {
    try {
      const res = await getDraftInfoApi(this.draftId)

      if (res.code === 0) {
        this.serveTime = res.time
        const newData = res.data
        newData.cateId = res.data.cateId || res.data.cate_id
        this.goodsInfo = newData
        this.getData(newData)
      }
    } catch (error) {}
  },
  async activated() {
    await this.getDraftInfo()
  },
}
</script>
