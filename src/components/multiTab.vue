<!--
  描述：多标签页
  创建日期：2019年10月21日
  修改日期：
-->
<template>
  <div id="multiTab">
    <el-tabs v-model="activeTab" type="card" @tab-remove="removeTab" @tab-click="clickTab">
      <el-tab-pane v-for="tab in tabList" :key="tab.name" :label="tab.tabName" :name="tab.name" :closable="tab.name !== 'home'">
      </el-tab-pane>
    </el-tabs>
   <!-- <el-tabs v-model="activeTab" type="card" @tab-remove="removeTab" @tab-click="clickTab">
    <el-tab-pane
     v-for="tab in tabs"
     :key="tab.name"
     :label="tab.tabName"
     :name="tab.name"
     :closable="tab.name !== 'home'"
    >
    </el-tab-pane>
   </el-tabs> -->
  </div>
</template>

<script>
export default {
  // 组件名称
  name: 'multiTab',
  // 组件参数 接收来自父组件的数据
  props: {},
  // 局部注册的组件
  components: {},
  // 组件状态值
  data () {
    return {
      activeTab: 'home'
    }
  },
  // 计算属性
  computed: {
    tabList () { // tab列表
      return this.$store.state.tabList
    }
  },
  // 侦听器
  watch: {
    // 监听store的值, 获取当前页面
    '$store.state.currentPage' (tab) {
      this.activeTab = tab.name
    }
  },
  // 组件方法
  methods: {
    clickTab (tab) {
      if (tab.name !== this.$store.state.currentPage.name) {
        this.$router.push(this.tabList[1 * tab.index].path)
      }
    },
    removeTab (name) {
      this.$store.commit('tabRemove', name)
    }
  },
  // 以下是生命周期钩子
  /**
  * 在实例初始化之后，组件属性计算之前，如data属性等
  */
  beforeCreate () {
  },
  /**
  * 组件实例创建完成，属性已绑定，但DOM还未生成，el属性还不存在
  */
  created () {
    // 初始化获取当前tab页
    setTimeout(() => {
      this.activeTab = this.$store.state.currentPage.name ? this.$store.state.currentPage.name : ''
    }, 500)
  },
  /**
  * 在挂载开始之前被调用：相关的 render 函数首次被调用。
  */
  beforeMount () {
  },
  /**
  * el 被新创建的 vm.el 替换，并挂载到实例上去之后调用该钩子。
  * 如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.el 也在文档内。
  */
  mounted () {
  },
  /**
  * 数据更新时调用，发生在虚拟 DOM 重新渲染和打补丁之前。
  * 你可以在这个钩子中进一步地更改状态，这不会触发附加的重渲染过程。
  */
  beforeUpdate () {
  },
  /**
  * 由于数据更改导致的虚拟 DOM 重新渲染和打补丁，在这之后会调用该钩子。
  * 当这个钩子被调用时，组件 DOM 已经更新，所以你现在可以执行依赖于 DOM 的操作。
  */
  updated () {
  },
  /**
  * keep-alive 组件激活时调用。 仅针对keep-alive 组件有效
  */
  activated () {
  },
  /**
  * keep-alive 组件停用时调用。 仅针对keep-alive 组件有效
  */
  deactivated () {
  },
  /**
  * 实例销毁之前调用。在这一步，实例仍然完全可用。
  */
  beforeDestroy () {
  },
  /**
  * Vue 实例销毁后调用。调用后，Vue 实例指示的所有东西都会解绑定，
  * 所有的事件监听器会被移除，所有的子实例也会被销毁。
  */
  destroyed () {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<!--使用了scoped属性之后，父组件的style样式将不会渗透到子组件中，-->
<!--然而子组件的根节点元素会同时被设置了scoped的父css样式和设置了scoped的子css样式影响，-->
<!--这么设计的目的是父组件可以对子组件根元素进行布局。-->
<style lang="less" scoped>
@deep: ~'>>>';
#multiTab{
  @{deep} .el-tabs__header{
    margin: 0;
    margin-top: 5px;
    border-bottom: 1px solid rgb(21, 32, 185);
    .el-tabs__nav{
      border: none;
    }
    .el-tabs__item{
      margin-left: 5px;
      border: 1px solid #aaa;
      border-bottom: none;
      height: 1.5rem;
      line-height: 1.5rem;
      // &:first-child{
      //   border-left: none;
      // }
      // &:last-child{
      //   border-right: 2px solid #F2F2F2;
      // }
      // .el-icon-close{
      //   margin-left: 0;
      // }
    }
  }
}
</style>
