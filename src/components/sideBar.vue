<!--
  描述：侧边栏
-->
<template>
  <div id="sideBar">
    <el-menu mode="horizontal" :default-active="activityMenu" class="el-menu-vertical-demo" :unique-opened="true" :collapse="isCollapse" background-color="#0043A2" text-color="#fff" active-text-color="#fff">
      <!-- 开关切换图标 -->
      <!-- <i :class="[isCollapse ? 'el-icon-d-arrow-right': 'el-icon-d-arrow-left']" @click="handleChange" style="margin-top: 20px;"></i> -->
      <template v-for="menu in menus">
        <!-- 菜单组 -->
        <el-submenu v-if="menu.list" :key="menu.id" :index="menu.url">
          <template slot="title">
            <i :class="menu.icon"></i>
            <span slot="title">{{menu.text}}</span>
          </template>
          <el-menu-item v-for="(item, index) in menu.list" :key="index" :index="item.url" :to="item.url" @click="goPage(item.url)">
            <i :class="item.icon"></i>
            <span slot="title">{{item.text}}</span>
          </el-menu-item>
        </el-submenu>
        <!-- 菜单 -->
        <el-menu-item v-else :key="menu.id" :index="menu.url" @click="goPage(menu.url)">
          <i :class="menu.icon"></i>
          <span slot="title">{{menu.text}}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script>
import store from '../vuex/index'
export default {
  // 组件名称
  name: 'sideBar',
  // 组件参数 接收来自父组件的数据
  props: {},
  // 局部注册的组件
  components: {},
  // 组件状态值
  data () {
    return {
      // isCollapse: true,
      menus: [
        {
          id: 0,
          text: '首页',
          url: '/index/home',
          icon: 'icon_menu_home'
        },
        {
          id: 1,
          text: '工作信息管理',
          url: '/index/workPlat',
          icon: 'icon_menu_home'
        },
        {
          id: 2,
          text: '工作信息管理',
          url: '/index/baseInfo',
          icon: 'icon_menu_home'
        },
        {
          id: 3,
          text: '工作信息管理',
          url: '/index/viewInfo',
          icon: 'icon_menu_home'
        },
        {
          id: 4,
          text: '工作信息管理',
          url: '/index/clockInfo',
          icon: 'icon_menu_home'
        },
        {
          id: 5,
          text: '工作信息管理',
          url: '/index/workinfo',
          icon: 'icon_menu_home',
          list: [
            {
              id: 11,
              text: '工作流程管理',
              url: '/index/workingProcess',
              icon: 'icon_menu_list'
            },
            {
              id: 12,
              text: '需求信息管理',
              url: '/index/requireInfo',
              icon: 'icon_menu_list'
            },
            {
              id: 13,
              text: '生产问题管理',
              url: '/index/prodProblem',
              icon: 'icon_menu_list'
            },
            {
              id: 14,
              text: '工作记录管理',
              url: '/index/workRecore',
              icon: 'icon_menu_list'
            }
          ]
        },
        {
          id: 6,
          text: '工作信息管理',
          url: '/index/clockInfoSel',
          icon: 'icon_menu_home'
        },
        {
          id: 7,
          text: '工作信息管理',
          url: '/index/sysInfo',
          icon: 'icon_menu_home'
        }
      ],
      activityMenu: '/index/home'
    }
  },
  // 计算属性
  computed: {
    isadmin () {
      return this.$store.state.userInfo.isadmin
    },
    isCollapse () {
      return this.$store.state.isCollapse
    }
  },
  // 侦听器
  watch: {
    '$store.state.currentPage' (tab) {
      this.activityMenu = tab.path
    }
  },
  // 组件方法
  methods: {
    handleChange () {
      this.$store.commit('handleChange')
      // this.isCollapse = !this.isCollapse
      // this.$store.state.isCollapse = this.isCollapse
    },
    // 跳转页面
    goPage: function (url) {
      if (store.state.currentPage.path !== url) {
        this.$router.push(url)
      }
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
    // 初始化获取当前菜单
    setTimeout(() => {
      this.activityMenu = this.$store.state.currentPage.path
    }, 500)
    this.handleChange()
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
  #sideBar{
    // height: 10%;
    background-color: rgb(37, 131, 98);
    width: 80%;
    min-width: 800px;
    margin: 0 auto;
    // @{deep} .el-menu{
    //   height: 100%;
    // }
    @{deep} .el-menu{
      text-align: left;
      color: #fff;
      border-right: none;
      &>i{
        margin-left: 25px;
        margin-bottom: 10px;
      }
      .el-menu-item{
        height: 2.5rem;
        line-height: 2.2rem;
        color: inherit;
        i{
          color: inherit;
        }
        &:focus, &:hover{
          background: #222532;
        }
        &.is-active:focus, &.is-active:hover{
          background: linear-gradient(to right, rgba(64,112,243,1) 0%, rgba(11,153,255,1) 100%);
          border: 0;
        }
      }
      .el-submenu{
        .el-submenu__title{
          text-align: left;
          color: inherit;
          i{
            color: inherit;
          }
          &:focus, &:hover{
            background: #222532;
          }
          &.is-active:focus, &.is-active:hover{
            background: linear-gradient(to right, rgba(64,112,243,1) 0%, rgba(11,153,255,1) 100%);
            border: 0;
          }
        }
        .el-menu{
          i{
            font-size: 12px;
          }
          span{
            color: #cfcfcf;
          }
        }
      }
    }
  }
  .el-menu-item.is-active{
    background: linear-gradient(to right, rgba(64,112,243,1) 0%, rgba(11,153,255,1) 100%);
    border: 0;
  }
</style>
