<template>
  <el-container id="index">
    <el-header>
      <div class="i-logo" title="项目管理平台">
        <span>项目管理平台</span>
      </div>
      <el-aside width="200"><side-bar></side-bar></el-aside>
    </el-header>
  </el-container>
</template>

<script>
import sideBar from '../components/sideBar'
import multiTab from '../components/multiTab'
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App. Your Home'
    }
  },
  // 组件
  components: {
    sideBar,
    multiTab
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<!--使用了scoped属性之后，父组件的style样式将不会渗透到子组件中，-->
<!--然而子组件的根节点元素会同时被设置了scoped的父css样式和设置了scoped的子css样式影响，-->
<!--这么设计的目的是父组件可以对子组件根元素进行布局。-->
<style lang="less" scoped>
  #index{
    background-color: #F9F9F9;
    .i-logo{
      background-color: #F9F9F9;
      text-align: left;
      span{
        // color: yellow;
      }
    }
  }
</style>
