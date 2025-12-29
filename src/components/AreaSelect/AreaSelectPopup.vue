<template>
  <Modal
    :show="showModal"
    :title="'指定地区运费'"
    :showClose="true"
    class="area-select-popup"
    @click-overlay="handleClosePopup"
    @close="handleClosePopup"
  >
    <template #content>
      <div class="select-area-wrapper">
        <div class="selected-info-box">
          <div class="selected-title">已选择地区</div>
          <div class="selected-list-box">
            <div v-if="selectedInfoList && selectedInfoList.length > 0" class="selected-list">
              <div
                class="selected-area-item"
                v-for="(selectedItem, selectedIndex) in selectedInfoList"
                :key="selectedIndex"
              >
                <span class="selected-area-txt">{{ selectedItem.name }}</span
                ><span class="close-area" @click.stop="handleClearAreaItem(selectedItem)" />
              </div>
            </div>
            <div v-else class="selected-empty">请至少选择一个地区</div>
            <div class="select-tab-menu">
              <van-tabs
                class="primary-tabs"
                v-model:active="activeMenuTab"
                :swipe-threshold="1"
                :lazy-render="false"
                @click-tab="handleSetMenuTabs"
              >
                <van-tab v-for="(tab, index) in MenuTabs" :key="index" :name="tab.key">
                  <template #title>
                    <span class="tab-title">
                      {{ tab.name }}
                      <span
                        v-if="tab.num"
                        :class="['tab-num', Number(tab.num) >= 10 ? 'tab-num_large' : '']"
                        >{{ tab.num }}</span
                      >
                    </span>
                  </template>
                </van-tab>
              </van-tabs>
            </div>
          </div>
        </div>
        <div class="select-plane">
          <div v-if="activeMenuTab === 'province'" class="province-list">
            <div class="select-list-item" v-for="(province, index) in provinceList" :key="index">
              <div class="left-check-info" @click.stop="toggleSelectProvice(province)">
                <span
                  :class="[
                    'check-icon',
                    isProvinceSelected(province.id) ? 'check-icon_active' : ''
                  ]"
                />
                <div class="item-name">{{ province.name }}</div>
              </div>
              <div class="right-next-inco" @click.stop="handleSelecCity(province, index)">
                <span class="right-arrow" />
              </div>
            </div>
          </div>
          <div v-else-if="activeMenuTab === 'city'" :class="{ 'city-list': minLevel !== 'area' }">
            <div class="select-list-item" v-for="(city, index) in cityList" :key="index">
              <div class="left-check-info" @click.stop="toggleSelectCity(city)">
                <span :class="['check-icon', isCitySelected(city.id) ? 'check-icon_active' : '']" />
                <div class="item-name">{{ city.name }}</div>
              </div>

              <div
                v-if="minLevel === 'area'"
                class="right-next-inco"
                @click.stop="handleSelectArea(city, index)"
              >
                <span class="right-arrow" />
              </div>
            </div>
          </div>
          <div v-else-if="activeMenuTab === 'area'" class="area-list">
            <div class="select-list-item" v-for="(region, index) in regionList" :key="index">
              <div class="left-check-info" @click.stop="toggleSelectRegion(region)">
                <span
                  :class="['check-icon', isRegionSelected(region.id) ? 'check-icon_active' : '']"
                />
                <div class="item-name">{{ region.name }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <ActionBar class="next-bar" isSingle>
        <ActionButton class="next-btn" :btnTxt="btnTxt" @onClick="handleSelectSure" />
      </ActionBar>
    </template>
  </Modal>
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue'

import Modal from '../Modal/Modal.vue'
import ActionBar from '../ActionBar/ActionBar.vue'
import ActionButton from '../ActionBar/ActionButton.vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  areaList: {
    type: Array,
    default: () => []
  },
  btnTxt: {
    type: String,
    default: '确定'
  },
  minLevel: {
    type: String,
    default: 'city' // 最低一级到area, 即区一级
  }
})

const showModal = ref(true)
// 菜单栏
const MenuTabs = ref([
  {
    key: 'province',
    name: '省份',
    value: 1
  },
  {
    key: 'city',
    name: '城市',
    value: 2
  }
])

const activeMenuTab = ref('province')
const provinceList = ref(props.areaList)
const cityList = ref([])
const regionList = ref([])
const selectedProvince = ref({}) // prov_12: ['1201', '1203'], key是选中的省份，value是该省份下选中的城市
const selectedCity = ref({}) // city_1201: ['120101'],key是选中的城市，value是该省份下选中的区县
const currSelectedProvince = ref({}) // 当前被选中的省份
const currSelectedCity = ref({}) // 当前被选中的城市

const selectedInfoList = computed(() => {
  let result = []

  Object.entries(selectedProvince.value).forEach(([provKey, selectedCityIds]) => {
    const provinceId = provKey.replace('prov_', '')
    const province = provinceList.value.find((p) => p.id === provinceId)
    if (!province) return

    const allCities = province.children || []
    const allCityIds = allCities.map((city) => city.id)
    const selectedCityIdArray = Array.isArray(selectedCityIds) ? selectedCityIds : []

    // 没有城市或没有选中的城市，跳过
    if (allCities.length === 0 || selectedCityIdArray.length === 0) {
      return
    }

    if (props.minLevel !== 'area') {
      // 检查是否选中了该省份下的所有城市
      const allCitiesSelected =
        allCityIds.length === selectedCityIdArray.length &&
        allCityIds.every((cityId) => selectedCityIdArray.includes(cityId))

      if (allCitiesSelected) {
        // 全部选中，只显示省份名
        result.push({
          ids: [province.id],
          isProvince: true,
          name: province.name
        })
      } else {
        // 部分选中，显示每个选中的城市
        selectedCityIdArray.forEach((cityId) => {
          const city = allCities.find((c) => c.id === cityId)
          if (city) {
            result.push({
              ids: [province.id, city.id],
              isProvince: false,
              name: `${province.name}-${city.name}`
            })
          }
        })
      }
    } else {
      // 部分选中，显示每个选中的城市
      selectedCityIdArray.forEach((cityId) => {
        const city = allCities.find((c) => c.id === cityId)
        if (city) {
          const allRegions = city.children || []
          const selectedRegions = selectedCity.value[`city_${city.id}`] || []

          selectedRegions.forEach((regionId) => {
            const regionInfo = allRegions.find((c) => c.id === regionId)

            if (regionInfo) {
              result.push({
                ids: [province.id, city.id, regionInfo.id],
                isProvince: false,
                name: `${province.name}-${city.name}-${regionInfo.name}`
              })
            }
          })
        }
      })
    }
  })

  return result
})

const emit = defineEmits(['delete', 'changeSelected', 'close'])

watch(
  () => props.show,
  (val) => {
    showModal.value = val

    if (val) {
      provinceList.value = props.areaList

      if (props.minLevel === 'area') {
        MenuTabs.value.push({
          key: 'area',
          name: '区县',
          value: 3
        })
      } else {
        MenuTabs.value = MenuTabs.value.filter((item) => item.key !== 'area')
      }
    }
  },
  {
    immediate: true
  }
)

watch(
  () => showModal.value,
  (val) => {
    if (!val) {
      emit('close')
    }
  }
)

const handleClosePopup = () => {
  showModal.value = false
}

const handleSetMenuTabs = (tabInfo = {}) => {}

const handleClearAreaItem = (selectedItem = {}) => {
  if (selectedItem.isProvince) {
    const provinceId = selectedItem.ids[0]

    // 直接清空该省份
    delete selectedProvince.value[`prov_${provinceId}`]
  } else {
    if (props.minLevel !== 'area') {
      const provinceId = selectedItem.ids[0]
      const cityId = selectedItem.ids[1]
      const currentCities = [...selectedProvince.value[`prov_${provinceId}`]]

      selectedProvince.value = {
        ...selectedProvince.value,
        [`prov_${provinceId}`]: currentCities.filter((code) => code !== cityId)
      }
    } else {
      const provinceId = selectedItem.ids[0]
      const cityId = selectedItem.ids[1]
      const regionId = selectedItem.ids[2]

      const currentRegions = [...selectedCity.value[`city_${cityId}`]]

      selectedCity.value = {
        ...selectedCity.value,
        [`city_${cityId}`]: currentRegions.filter((code) => code !== regionId)
      }

      if (
        !selectedCity.value[`city_${cityId}`] ||
        selectedCity.value[`city_${cityId}`].length <= 0
      ) {
        const currentCities = [...selectedProvince.value[`prov_${provinceId}`]]

        selectedProvince.value = {
          ...selectedProvince.value,
          [`prov_${provinceId}`]: currentCities.filter((code) => code !== cityId)
        }
      }
    }
  }
}

const handleSelecCity = (province = {}, index: any) => {
  cityList.value = provinceList.value[index].children || []
  currSelectedProvince.value = province
  activeMenuTab.value = 'city'
}

const handleSelectArea = (city = {}, index: any) => {
  regionList.value = cityList.value[index].children || []
  currSelectedCity.value = city
  activeMenuTab.value = 'area'
}

const getAllCitiesIdAccordingToProvince = (provinceId: any) => {
  const provinceIndex = provinceList.value.findIndex((item) => item.id === provinceId)
  const list = provinceList.value[provinceIndex].children || []
  return list.map((item) => {
    return item.id
  })
}

/**
 * 根据城市ID查找城市对象
 * @param {string} cityId - 要查找的城市ID
 * @returns {Object|null} - 找到的城市对象，如果未找到则返回null
 */
const findCityById = (cityId) => {
  // 遍历所有省份
  for (const province of provinceList.value) {
    // 如果省份有children数组
    if (province.children && Array.isArray(province.children)) {
      // 在省份的children中查找城市
      const city = province.children.find((city) => city.id === cityId)
      if (city) {
        return city.children || []
      }
    }
  }
  return []
}

const getAllRegionIdAccordingToCity = (cityId) => {
  const list = findCityById(cityId) || []
  return list.map((item) => {
    return item.id
  })
}

// 检查省份是否选中
const isProvinceSelected = (provinceId: any) => {
  return !!(
    selectedProvince.value[`prov_${provinceId}`] &&
    selectedProvince.value[`prov_${provinceId}`].length > 0
  )
}

// 检查城市是否选中
const isCitySelected = (cityId: any) => {
  const provinceId = currSelectedProvince.value.id
  return selectedProvince.value[`prov_${provinceId}`]?.includes(cityId) || false
}

// 检查区县是否被选中
const isRegionSelected = (regionId: any) => {
  const cityId = currSelectedCity.value.id
  return selectedCity.value[`city_${cityId}`]?.includes(regionId) || false
}

// 省份选中
const toggleSelectProvice = (province) => {
  if (province.id) {
    if (selectedProvince.value[`prov_${province.id}`] !== undefined) {
      const newState = { ...selectedProvince.value }
      delete newState[`prov_${province.id}`] // 清空其所有选中的城市
      selectedProvince.value = newState
    } else {
      selectedProvince.value = {
        ...selectedProvince.value,
        [`prov_${province.id}`]: getAllCitiesIdAccordingToProvince(province.id) // 选中该省下所有城市
      }

      // 若到区县一级，则默认选中全部
      if (props.minLevel === 'area') {
        const allCity = selectedProvince.value[`prov_${province.id}`]

        if (allCity && allCity.length > 0) {
          allCity.forEach((cityId) => {
            selectedCity.value = {
              ...selectedCity.value,
              [`city_${cityId}`]: getAllRegionIdAccordingToCity(cityId) // 选中该省下所有城市
            }
          })
        }
      }
    }
  }
}

// 城市选中切换
const toggleSelectCity = (city = {}) => {
  const provinceId = currSelectedProvince.value.id

  // 直接点击到二级时，此时要给对应的provinceId的selectedProvince赋值为空
  if (!selectedProvince.value[`prov_${provinceId}`]) {
    selectedProvince.value[`prov_${provinceId}`] = []
  }
  const currentCities = [...selectedProvince.value[`prov_${provinceId}`]]

  if (currentCities.includes(city.id)) {
    // 移除城市
    selectedProvince.value = {
      ...selectedProvince.value,
      [`prov_${provinceId}`]: currentCities.filter((code) => code !== city.id)
    }

    // 若到区县一级，则清空其所有选中的区县
    if (props.minLevel === 'area') {
      const newState = { ...selectedCity.value }
      delete newState[`city_${city.id}`]
      selectedCity.value = newState
    }
  } else {
    // 添加城市
    selectedProvince.value = {
      ...selectedProvince.value,
      [`prov_${provinceId}`]: [...currentCities, city.id]
    }

    if (props.minLevel === 'area') {
      // 选中该城市下的所有区县
      selectedCity.value = {
        ...selectedCity.value,
        [`city_${city.id}`]: getAllRegionIdAccordingToCity(city.id) // 选中该省下所有城市
      }
    }
  }
}

// 切换区县
const toggleSelectRegion = (region = {}) => {
  const provinceId = currSelectedProvince.value.id
  const cityId = currSelectedCity.value.id

  // 确保省份被选中
  if (!selectedProvince.value[`prov_${provinceId}`]) {
    selectedProvince.value[`prov_${provinceId}`] = []
  }

  if (!selectedCity.value[`city_${cityId}`]) {
    selectedCity.value[`city_${cityId}`] = []
  }

  // 获取当前选中的区县
  const currentRegions = [...selectedCity.value[`city_${cityId}`]]

  if (currentRegions.includes(region.id)) {
    // 已选中，移除
    selectedCity.value = {
      ...selectedCity.value,
      [`city_${cityId}`]: currentRegions.filter((code) => code !== region.id)
    }

    // 如果没有选中的区县，移除该城市的记录
    if (!selectedCity.value[`city_${cityId}`] || selectedCity.value[`city_${cityId}`].length <= 0) {
      const newState = { ...selectedCity.value }
      delete newState[`city_${cityId}`]
      selectedCity.value = newState

      const currentCities = [...selectedProvince.value[`prov_${provinceId}`]]
      selectedProvince.value = {
        ...selectedProvince.value,
        [`prov_${provinceId}`]: currentCities.filter((code) => code !== cityId)
      }
    }
  } else {
    // 未选中，添加
    selectedCity.value = {
      ...selectedCity.value,
      [`city_${cityId}`]: [...currentRegions, region.id]
    }

    const currentCities = [...selectedProvince.value[`prov_${provinceId}`]]
    if (!currentCities.includes(cityId)) {
      selectedProvince.value = {
        ...selectedProvince.value,
        [`prov_${provinceId}`]: [...currentCities, cityId]
      }
    }
  }
}

// 确认当前选择的地区，然后进行下一步
const handleSelectSure = () => {
  emit('changeSelected', {
    selectedProvince: { ...selectedProvince.value },
    selectedInfoList: [...selectedInfoList.value]
  })
  showModal.value = false
}
</script>
<style lang="scss" scoped>
@import '@/assets/variables.scss';
.select-area-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;

  .selected-info-box {
    padding: 0 pxTo430(16);
  }

  .selected-title {
    color: #333333;
    font-family: 'PingFang SC';
    font-weight: 500;
    font-size: pxTo430(14);
    line-height: pxTo430(16);
    letter-spacing: 0px;
  }

  .selected-list-box {
    margin-top: pxTo430(10);
  }

  .select-plane {
    flex: 1;
    padding: 0 pxTo430(16) pxTo430(24);
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    box-sizing: border-box;
  }

  .selected-empty {
    color: #939393;
    font-family: 'PingFang SC';
    font-weight: 400;
    font-size: pxTo430(12);
    line-height: pxTo430(14);
  }
}

.selected-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  .selected-area-item {
    display: flex;
    align-items: center;
    justify-content: center;

    margin-right: pxTo430(10);
    padding: 0 pxTo430(8);
    height: pxTo430(24);

    color: #333333;
    font-family: 'PingFang SC';
    font-weight: 400;
    font-size: pxTo430(14);
    line-height: pxTo430(18);
    letter-spacing: 0px;

    border-radius: pxTo430(6);
    background: #f4f4f4;
    box-sizing: border-box;
  }

  .close-area {
    display: block;
    margin-left: pxTo430(4);
    width: pxTo430(14);
    height: pxTo430(14);
    background: url(../../assets/common/close-gray-circle.png) no-repeat;
    background-size: 100% 100%;
  }
}

.select-tab-menu {
  position: relative;
  width: 100%;
  box-sizing: border-box;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    height: 1px;
    width: 100%;
    background: #eeeeee;
    transform: scaleY(0.5);
    transform-origin: 0 0;
    box-sizing: border-box;
  }
}

/* 一级Tab样式 */
::v-deep .primary-tabs.van-tabs--line {
  .van-tabs__wrap {
    padding: 0 pxTo430(1) !important;
    width: 100%;
    height: pxTo430(46);
    box-sizing: border-box;
    border: 0 solid !important;
    background-color: #fff;
  }

  .van-tabs__nav--line {
    margin-right: 0 !important;
    padding: 0 !important;
    background-color: transparent;
  }

  .van-tab {
    display: flex;
    align-items: center;
    flex: none;

    position: relative;
    padding: 0 pxTo430(15);
    height: pxTo430(46);

    color: #636363;
    font-family: 'PingFang SC';
    font-weight: 400;
    font-size: pxTo430(16);
    line-height: pxTo430(20);
    letter-spacing: 0px;
    text-align: center;

    box-sizing: border-box;
  }

  .van-tab--active {
    color: #333333;
    font-weight: 500;
  }

  .van-tabs__line {
    bottom: 1px;
    width: pxTo430(20);
    height: pxTo430(3);
    border-radius: pxTo430(6);
    background: linear-gradient(270deg, #ff1f66 0%, #ff4d4d 100%);
  }
}

.select-list-item {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;

  width: 100%;
  height: pxTo430(48);
  box-sizing: border-box;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    height: 1px;
    width: 100%;
    background: #e6e6e6;
    transform: scaleY(0.5);
    transform-origin: 0 0;
    box-sizing: border-box;
  }

  &:last-child::after {
    display: none;
  }
}

.left-check-info {
  display: flex;
  align-items: center;
  height: 100%;

  .item-name {
    color: #333333;
    font-family: 'PingFang SC';
    font-weight: 400;
    font-size: pxTo430(14);
    line-height: pxTo430(20);
    letter-spacing: 0px;
  }
}

.city-list,
.area-list {
  .left-check-info {
    flex: 1;
  }
}

.right-next-inco {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex: 1;
  height: 100%;

  .right-arrow {
    display: block;
    width: pxTo430(16);
    height: pxTo430(16);
    background: url(../../assets/common/right-arrow.png) no-repeat;
    background-size: 100% 100%;
  }
}

.check-icon {
  display: block;
  margin-right: pxTo430(12);
  width: pxTo430(20);
  height: pxTo430(20);
  background: url(../../assets/merchant/checkbox-off.png) no-repeat;
  background-size: 100% 100%;
}

.check-icon_active {
  background: url(../../assets/merchant/checkbox-on.png) no-repeat;
  background-size: 100% 100%;
}
</style>
