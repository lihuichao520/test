<template>
  <div>test 响应性</div>
</template>
<script>
/* reactive响应性通过proxy来实现
 * 所以reactive的响应性有局限性：
 * 受限于proxy的特性。
 * （1）要通过proxy返回的实例访问的属性才能被拦截，所以若将一个响应式对象的属性 赋值或解构 给一个本地变量时，
 * 那将不会触发get/set，从而无响应性。但若变量指向的是一个非原始类型的值，那对象的修改仍具有响应性。
 * import { reactive, watchEffect } from 'vue'

    const state = reactive({
    count: 0,
    user: {
        name: 'Alice',
        age: 25
    }
    })

    // ❌ 错误：解构会丢失响应性
    let { count } = state
    count++  // 这只是修改了本地变量，不会触发更新
    console.log(state.count) // 仍然是 0

    // ❌ 错误：直接赋值给本地变量
    let localCount = state.count
    localCount++  // 同样不会影响原始响应式对象
    console.log(state.count) // 仍然是 0

    // ✅ 正确：直接修改响应式对象的属性
    state.count++  // 这会触发响应式更新

    // 演示响应式丢失
    watchEffect(() => {
    console.log('state.count 变化:', state.count)  // 会触发
    console.log('localCount 变化:', localCount)    // 不会触发
    })

    嵌套对象的响应性保持
    const state = reactive({
        nested: {
            deep: {
                value: 100
            }
        }
    })

    // 即使解构了外层，内层对象仍然保持响应性
    let { nested } = state
    nested.deep.value = 200  // ✅ 这个修改仍然是响应式的！

    watchEffect(() => {
    console.log('深层属性变化:', state.nested.deep.value)  // 会输出 200
    })

    // 为什么？因为 nested 仍然指向同一个代理对象
    console.log(nested === state.nested)  // true
 * （2）reactive()返回的代理尽管行为上表现的像原始对象，但通过===运算符还是能比较出他们的不同。
    const original = { name: 'Vue' }
    const reactiveProxy = reactive(original)

    // 代理对象 !== 原始对象
    console.log(reactiveProxy === original)  // false

    // 代理对象 === 代理对象（同一个代理）
    console.log(reactiveProxy === reactive(original))  // true

    // 特殊情况：嵌套代理
    const state = reactive({
    obj: original
    })

    console.log(state.obj === original)  // false (state.obj 是代理)
    console.log(state.obj === reactiveProxy)  // true (指向同一个代理)

    // 对原始对象的修改不会触发响应式
    original.name = 'React'
    console.log(state.obj.name)  // 仍然是 'Vue'（不会同步）

    // 实用技巧：使用 toRaw() 获取原始对象
    import { toRaw } from 'vue'
    const rawState = toRaw(state)
    console.log(rawState === original)  // false（但 rawState 是原始对象）
*/
function reactive(obj) {
  return new Proxy(obj, {
    get(target, key) {
      track(target, key);
      return target[key];
    },
    set(target, key, value) {
      target[key] = value;
      trigger(target, key);
    },
  });
}

// ref 通过getter/setter来实现响应性
function ref(value) {
  const refObject = {
    get value() {
      track(refObject, "value");
      return value;
    },
    set value(newValue) {
      value = newValue;
      trigger(refObject, "value");
    },
  };

  return refObject;
}

// 依赖收集/追踪订阅者
/**
 * 副作用订阅者被存储在一个weakMap<target, Map<key, Set<effect>>>的数据结构里
 * // WeakMap {
    //   targetObj1 -> Map {
    //     'name' -> Set { effect1, effect2 },
    //     'age'  -> Set { effect3 }
    //   },
    //   targetObj2 -> Map {
    //     'name' -> Set { effect2, effect3 }
    //   }
    // }
 */
let activeEffect; // 当前活跃的副作用
function track(target, key) {
  if (activeEffect) {
    // 获取target，key的订阅者集合，数据结构是Set
    const effects = getSubscribersForProperty(target, key);
    effects.add(activeEffect); // 将当前活跃的副作用添加进依赖的订阅者集合里
  }
}

// 依赖变化，触发更新
function trigger(target, key) {
  const effects = getSubscribersForProperty(target, key);
  effects.forEach((effect) => effect());
}

// 副作用（能自动跟踪其依赖的副作用）
function update() {
  a2 = a0 + a1;
}

function whenDepsChange(update) {
  const effect = () => {
    activeEffect = effect; // 将当前effect设置为全局激活状态
    update(); // 执行更新函数（触发依赖收集）
    activeEffect = null; // 清理全局状态
  };

  effect();
}
/**
 * // 1. 初始化
whenDepsChange(update)

// 执行过程：
// Step 1: 创建 effect 函数
// Step 2: 立即执行 effect()
//   ├─ activeEffect = effect  (全局标记当前正在执行的 effect)
//   ├─ update() 执行
//   │   └─ 读取 data.count → 触发 getter → track()
//   │       └─ track 内部：dep.add(activeEffect)  ⇐ 收集当前 effect
//   └─ activeEffect = null  (清理标记)
// Step 3: 完成初始执行

// 2. 后续数据变化
data.count = 1
//   ↓ 触发 setter → trigger()
//   ↓ 遍历 dep 中的所有 effect
//   ↓ 重新执行 effect() 
//   ↓ (注意：activeEffect 在 effect 内部重新设置)
 */

export default {
  data() {
    return {};
  },
  methods: {},
};
</script>
<style lang="scss" scoped></style>
