<template>
  <div class="login">
    <p>{{ msg }}</p>
    <div class="l-box">
      <el-form ref="form" :model="form">
        <el-form-item>
          <el-input size="small" v-model="form.username" placeholder="请输入工号" prefix-icon="el-icon-user">
            <span slot="prefix" class="inUsernm"></span>
          </el-input>
          <el-input size="small" type="password" v-model="form.password" placeholder="请输入密码" prefix-icon="el-icon-lock">
            <span slot="prefix" class="inPwd"></span>
          </el-input>
          <span>
            <el-checkbox v-model="isRemember">记住密码</el-checkbox>
          </span>
        </el-form-item>
      </el-form>
    </div>
    <el-button type="primary" size="small" @click="doSubmit">登录</el-button>
  </div>
</template>

<script>
import login from '../api/login'
export default {
  name: 'login',
  data () {
    return {
      logicSysNo: '',
      logicSysNm: '',
      msg: '项目管理平台',
      form: {
        username: '',
        password: ''
      },
      isRemember: true
    }
  },
  methods: {
    // 测试一个接口能不能请求成功
    test: function () {
      let that = this
      login
        .test({
          workAmountType: '02'
        })
        .then(function (res) {
          console.log(res)
        })
        .catch(function (err) {
          console.log(err)
          that.$message.error('测试一个接口能不能请求成功失败了')
        })
    },
    // 获取平台名称和标识
    getLogicInfo: function () {
      let that = this
      login
        .getLogicInfo()
        .then(function (res) {
          console.log(res)
          this.logicSysNo = res.logicSysNo
          this.logicSysNm = res.logicSysNm
        })
        .catch(function (err) {
          console.log(err)
          that.$message.error('获取平台名称和标识请求失败')
        })
    },
    doSubmit: function () {
      let that = this
      // 先不进行接口通配，直接跳转页面
      sessionStorage.setItem('userInfo', JSON.stringify({'userNo': '201', 'isadmin': 'Y', 'orgNo': 'F031H101310101001', 'userId': '1eedba6abc244542af02687bcce805c3', 'userNm': 'test1', 'userPwd': '123456'})) // 存储用户信息
      // that.$store.commit('getUserInfo')
      console.log('userInfo>>>' + sessionStorage.getItem('userInfo'))
      that.$router.push('/index/home') // 跳转首页
      // 用户登录接口
      /*
      login
        .login({
          username: this.form.username,
          password: this.form.password,
          logicSysNo: this.logicSysNo,
          isFullScreen: true,
          token: this.token
        })
        .then(function (res) {
          if (!res.res) {
            that.$message.error(res.msg || '登录失败')
            return false
          }
          sessionStorage.setItem('userInfo', JSON.stringify(res.user)) // 存储用户信息
          that.$store.commit('getUserInfo')
          localStorage.setItem('isRemember', that.isRemember) // 存储是否勾选记住密码
          // 判断是否记住密码
          if (that.isRemember) {
            that.setCookie(that.form.username, that.form.password, 7)
          } else {
            that.clearCookie()
          }
          that.$router.push('/index/home') // 跳转首页
        })
        .catch(function (err) {
          console.log(err)
          that.$message.error('请求失败')
        }) */
    },
    // 设置cookie
    setCookie: function (userName, userPwd, exdays) {
      var exdate = new Date()
      exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays) // 保存的天数
      // 字符串拼接cookie
      window.document.cookie =
        'userName' + '=' + userName + ';path=/;expires=' + exdate.toGMTString()
      window.document.cookie =
        'userPwd' + '=' + userPwd + ';path=/;expires=' + exdate.toGMTString()
    },
    // 读取cookie
    getCookie: function () {
      if (document.cookie.length > 0) {
        var arr = document.cookie.split('; ')
        for (var i = 0; i < arr.length; i++) {
          var arr2 = arr[i].split('=')
          // 判断查找相对应的值
          if (arr2[0] === 'userName') {
            this.form.username = arr2[1] // 获取用户名
          } else if (arr2[0] === 'userPwd') {
            this.form.password = arr2[1] // 获取密码
          }
        }
      }
    },
    // 清除cookie
    clearCookie: function () {
      this.setCookie('', '', -1)
    }
  },
  created () {
    // 全局监听enter键，是把监听事件绑定到document上，无需获取焦点之类的
    let that = this
    document.onkeydown = function (e) {
      e = window.event || e
      if (
        that.$route.path === '/login' &&
        (e.code === 'Enter' || e.code === 'enter')
      ) {
        // 验证在登录界面和按得键是回车键enter
        that.doSubmit() // 登录函数
      }
    }
  },
  mounted () {
    // this.test() // test接口能否走通
    // this.getCookie() // 获取cookie
    this.isRemember = localStorage.getItem('isRemember') === 'true' // 获取是否记住密码
    // this.$refs.loginPage.style.height = document.documentElement.clientHeight + 'px'
    // console.log(this.$refs.loginPage.style.height)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@deep: ~'>>>';
.login {
  width: 25%;
  min-width: 250px;
  font-size: 0.45rem;
  margin: 10% auto;
  p {
    color:#0043A2;
    font-size: 1.935rem; // 30px
  }
  // .l-box{
  //   form{
  //     @{deep} .el-form-item{
  //       .inUsernm {
  //         width: 100%;height:100%;display: inline-block;background-image: url("../../static/images/icon_user.png");background-size: 100% 100%;
  //       }
  //       .inPwd {
  //         width: 100%;height:100%;display: inline-block;background-image: url("../../static/images/icon_lock.png");background-size: 100% 100%;
  //       }
  //     }
  //   }
  // }
}
</style>
