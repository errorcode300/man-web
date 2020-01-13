<template>
  <el-container id="index">
    <el-header>
      <div class="i-logo" title="中资法人银行监管驾驶舱">
        <span>中资法人银行监管驾驶舱</span>
      </div>
      <div class="i-link">
        <el-link :underline="false" icon="icon_user" style="cursor: default;">{{userNm}}</el-link>
        <el-popover
          popper-class="pwdEdit"
          placement="top-start"
          width="400"
          v-model="pwdEditVisible"
          trigger="click">
          <div style="text-align: center; margin: 0">
            <el-form label-position="left" label-width="90px" size="mini">
              <el-form-item label="账户信息">
                <el-input :disabled="true" v-model="userNo"></el-input>
              </el-form-item>
              <el-form-item label="当前密码">
                <el-input placeholder="请输入当前密码" v-model="pwdEditForm.oldPwd"></el-input>
              </el-form-item>
              <el-form-item label="新密码">
                <el-input placeholder="请输入新密码" v-model="pwdEditForm.newPwd"></el-input>
              </el-form-item>
              <el-form-item label="确认新密码">
                <el-input placeholder="请再次输入新密码" v-model="pwdEditForm.confirmPwd"></el-input>
              </el-form-item>
              <el-button type="info" @click="pwdEditVisible = false">取消</el-button>
              <el-button type="primary" @click="pwdEdit">确认</el-button>
            </el-form>
          </div>
          <el-link :underline="false" slot="reference" icon="icon_lock">修改密码</el-link>
        </el-popover>
        <el-link :underline="false" icon="icon_exit" @click="logout">退出</el-link>
      </div>
    </el-header>
    <el-container>
      <el-aside width="200"><side-bar></side-bar></el-aside>
      <el-main>
        <multi-tab></multi-tab>
        <keep-alive :exclude="closingPage">
          <router-view ref="child"></router-view>
          <!-- <el-scrollbar ref="scrollbar">
            <router-view></router-view>
          </el-scrollbar> -->
        </keep-alive>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import index from '../api/index'
import sideBar from '../components/sideBar'
import multiTab from '../components/multiTab'
export default {
  data () {
    return {
      pwdEditVisible: false,
      pwdEditForm: {
        oldPwd: null,
        newPwd: null,
        confirmPwd: null
      },
      menus: [
        {
          id: 0,
          text: '首页',
          url: '/home'
        },
        {
          id: 1,
          text: '资本情况',
          url: '/index/capitalSituation'
        },
        {
          id: 2,
          text: '实体经济',
          url: '/index'
        },
        {
          id: 3,
          text: '风险视图',
          url: 'javascript:;',
          list: [
            {
              text: '信用风险',
              url: ''
            },
            {
              text: '流动性风险',
              url: ''
            },
            {
              text: '其他风险',
              url: ''
            }
          ]
        },
        {
          id: 4,
          text: '收入结构',
          url: '/'
        },
        {
          id: 5,
          text: '机构概览',
          url: '/org'
        },
        {
          id: 6,
          text: '村镇银行分析',
          url: '/bank'
        },
        {
          id: 7,
          text: '指标查询',
          url: '/idxSearch'
        },
        {
          id: 8,
          text: '用户管理与数据导入',
          url: '/userManage'
        }
      ]
    }
  },
  components: {
    sideBar,
    multiTab
  },
  // 计算属性
  computed: {
    userNm () {
      return this.$store.state.userInfo.userNm
    },
    userNo () {
      return this.$store.state.userInfo.userNo
    },
    userId () {
      return this.$store.state.userInfo.userId
    },
    closingPage () {
      return this.$store.state.closingPage
    }
  },
  methods: {
    // 修改密码
    pwdEdit: function () {
      if (!this.pwdEditForm.oldPwd) {
        this.$message.error('请输入当前密码')
        return false
      }
      if (!this.pwdEditForm.newPwd) {
        this.$message.error('请输入新密码')
        return false
      }
      if (!this.pwdEditForm.confirmPwd) {
        this.$message.error('请再次输入新密码')
        return false
      }
      if (this.pwdEditForm.confirmPwd !== this.pwdEditForm.newPwd) {
        this.$message.error('两次输入密码不一致，请重新确认')
        return false
      }
      if (this.pwdEditForm.oldPwd === this.pwdEditForm.newPwd) {
        this.$message.error('新密码与当前密码一致，请重新输入')
        return false
      }
      let that = this
      index.pwdEdit({
        pwd: this.pwdEditForm.newPwd,
        oldPwd: this.pwdEditForm.oldPwd,
        userNo: this.userNo
      })
        .then(function (res) {
          if (res.res) {
            that.$message.success('密码修改成功')
            that.$store.commit('LOGOUT') // 重新登录
          } else {
            that.$message.error(res.msg || '密码修改失败')
          }
        })
        .catch(function (err) {
          that.$message.error(err.message || '请求失败')
        })
    },
    // 注销登录
    logout: function () {
      let that = this
      that.$confirm('是否确认注销登录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$store.commit('LOGOUT')
        })
        .catch((err) => {
          console.log(err)
        })
    }
  },
  created () {
    // 全局获取信息放入vuex
    this.$store.commit('getUserInfo') // 获取用户信息
    this.$store.commit('getOrgList') // 获取机构数据
    this.$store.commit('getSelectedOrg') // 获取默认机构
  }
}
</script>
<style lang="less">
@import '../assets/css/lib.less';
@import '../assets/css/mixin.less';
#index{
  background: #eee;
  min-height: 100%;
  // 菜单部分
  &>header{
    display: block;
    height: 48px !important;
    line-height: 48px;
    background: linear-gradient(to right, rgba(64,112,243,1) 0%, rgba(11,153,255,1) 100%);
    border-bottom: 2px #0065d2 solid;
    position: relative;
    padding: 0 30px 0 20px;
    .i-logo{
      display: block;
      float: left;
      span{
        font-size: 18px;
        color: #fff;
      }
    }
    .i-link{
      float: right;
      a{
        color: #fff;
        margin-left: 40px;
        font-weight: bold;
        i{
          font-weight: bold;
        }
      }
    }
  }
  // 内容
  .el-main{
    max-width: calc(100% - 64px);
    padding: 0;
    background-color: #fff;
  }
  #multiTab + div>.el-scrollbar{
    height: calc(100vh - 136px);
    overflow-y: hidden;
  }
  // 滚动条样式
  // 滚动条的宽度
  .el-table ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  // 滚动条的滑块
  .el-table ::-webkit-scrollbar-thumb {
    cursor: pointer;
    background-color: rgba(144,147,153,.3);
    border-radius: 3px;
  }
  .el-table .el-scrollbar__thumb:hover{
    background-color: rgba(144,147,153,.5);
  }
}
// 修改密码
.el-popover.pwdEdit{
  border-radius: 10px;
  padding: 40px 40px 20px;
  box-shadow: 1px 1px 6px #d3d8e4;
  &[x-placement^=bottom] .popper__arrow{
    &::after{
      top: -22px;
      margin-left: -24px;
      border-width: 24px;
    }
    top: -48px;
    margin-left: -24px;
    border-width: 24px;
  }
  .el-form{
    text-align: center;
    .el-button{
      border-radius: 20px;
      padding: 7px 25px;
    }
  }
}
</style>
