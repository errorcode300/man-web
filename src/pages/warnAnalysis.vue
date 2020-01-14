<!--
  描述：预警分析
  创建日期：2019年12月16日
  修改日期：
-->
<template>
  <div id="warnAnalysis">
    <div class="w-select">
      <el-date-picker
        v-model="selectedDate"
        type="month"
        align="right"
        size="mini"
        placeholder="选择时点"
        format="yyyy/MM"
        value-format="yyyyMM"
        clear-icon=''
        @change="changeDate"
        style="margin-right: 10%;">
      </el-date-picker>
      <el-button size="mini" @click="dialogTableVisible = true"><span>{{selectedOrgStr || '选择机构'}}</span><i class="icon-choose-org el-icon--right"></i></el-button>
      <el-dialog title="选择机构" :visible.sync="dialogTableVisible">
        <el-form>
          <el-form-item>
            <el-input :value="orgPreviewStr" :disabled="true"></el-input>
            <el-scrollbar>
              <el-tree
              :data="treeNodes"
              show-checkbox
              :check-strictly="true"
              node-key="text"
              ref="tree"
              :default-checked-keys="defaultKeys"
              :props="defaultProps"
              @check="orgChecked">
            </el-tree>
            </el-scrollbar>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="changeOrg">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <div class="w-table">
      <p>预警分析
        <!-- 橙色预警为指标值介于监管值【95%，100%）（负向指标）或（100%，105%】（正向指标），蓝色预警为指标值介于监管值【90%，100%）（负向指标）或（100%，110%】（正向指标） -->
        <span><i class="icon-warn-red"></i>红色预警: 超出监管标准&nbsp;&nbsp;<i class="icon-warn-orange"></i>橙色预警: 指标值介于监管值【95%，100%）（负向指标）或（100%，105%】（正向指标）&nbsp;&nbsp;<i class="icon-warn-blue"></i>蓝色预警: 指标值介于监管值【90%，100%）（负向指标）或（100%，110%】（正向指标）</span>
        <el-button class="exportBtn" @click="tableExportToExcel">导出excel<i class="el-icon-download el-icon--right"></i></el-button>
      </p>
      <el-table
        :data="tableData"
        style="width: 100%;"
        border
        stripe
        height="calc(100vh - 260px)">
        <el-table-column
          prop="orgNm"
          label="机构名称">
        </el-table-column>
        <el-table-column
          prop="modNo"
          label="模块名称">
        </el-table-column>
        <el-table-column
          prop="idxNm"
          label="指标名称">
        </el-table-column>
        <el-table-column
          prop="reguStd"
          label="监管标准">
        </el-table-column>
        <el-table-column
          prop="currVal"
          label="指标数值">
        </el-table-column>
        <el-table-column
          prop="dataRgType"
          label="口径">
          <template v-slot="scope">
            <span v-if="scope.row.dataRgType === '01'">法人</span>
            <span v-else-if="scope.row.dataRgType === '02'">并表</span>
          </template>
        </el-table-column>
        <el-table-column
          label="预警级别">
          <template v-slot="scope">
            <div>
              <span v-if="scope.row.color == 'red'" style="color: red">红色预警</span>
              <span v-else-if="scope.row.color == 'blue'" style="color: blue">蓝色预警</span>
              <span v-else-if="scope.row.color == 'orange'" style="color: orange">橙色预警</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <span>共{{totalNum}}条，<span>当前{{currentNum.start}}-{{currentNum.end}}条</span></span>
        <el-pagination
          background
          hide-on-single-page
          :current-page="currentPage"
          @current-change="changeCurrentPage"
          layout="prev, pager, next"
          prev-text="上一页"
          next-text="下一页"
          :page-size="pageSize"
          :total="totalNum">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import lib from '../api/lib'
import dataFunc from '../utils/dataFunc'
export default {
  // 组件名称
  name: 'warnAnalysis',
  // 组件参数 接收来自父组件的数据
  props: {},
  // 局部注册的组件
  components: {},
  // 组件状态值
  data () {
    return {
      dialogTableVisible: false, // 弹窗
      defaultProps: {
        children: 'children',
        label: 'text'
      },
      selectedDate: '', // 选择日期
      selectedOrg: null, // 选择机构结果
      selectedOrgStr: null, // 选择机构结果字符串
      defaultKeys: [], // 树形控件默认勾选项
      orgPreview: null, // 选择机构弹窗预览数组
      orgPreviewStr: null, // 选择机构弹窗预览字符串
      tableData: [],
      totalNum: 0, // 指标总数
      pageSize: 10, // 每页指标展示数目
      currentPage: 1 // 当前页面页码
    }
  },
  // 计算属性
  computed: {
    treeNodes () {
      return this.$store.state.orgList
    },
    // 获取当前选择月末日期
    lastDateOfMonth () {
      return this.selectedDate + '' + new Date(this.selectedDate.substr(0, 4), this.selectedDate.substr(4, 2), 0).getDate()
    },
    // 当前显示文件序号
    currentNum () {
      return {
        start: Math.max((this.currentPage - 1) * this.pageSize + 1, 1),
        end: Math.min((this.currentPage * this.pageSize), this.totalNum)
      }
    }
  },
  // 侦听器
  watch: {
    'dialogTableVisible' () {
      if (this.dialogTableVisible) {
        // 机构默认反显
        this.$nextTick(() => {
          this.selectedParent(this.$refs.tree.getCheckedNodes()[0])
        })
      }
    }
  },
  // 组件方法
  methods: {
    // 初始化页面
    initPage: function () {
      this.getWarnData('warnAnalysis')
    },
    // 时点修改
    changeDate: function () {
      this.initPage()
    },
    // 获取默认机构
    getDefaultOrg: function () {
      // 选择机构默认展示
      let defaultOrg = this.$store.state.selectedOrg // 获取默认选中机构
      this.selectedOrg = defaultOrg.orgNo
      this.selectedOrgStr = defaultOrg.orgNm
      this.orgPreview = defaultOrg // 树结构当前勾选机构数组
      this.orgPreviewStr = this.selectedOrgStr // 树结构当前勾选结果展示
      this.defaultKeys = [defaultOrg.orgNm] // 配合呈现树形控件默认勾选效果
    },
    // 机构勾选
    orgChecked: function (org, treeNodes) {
      if (treeNodes.checkedKeys.length > 0) {
        // 机构单选
        this.$refs.tree.setCheckedKeys([org.text])
        this.selectedParent(org)
        // 获取选中机构数据
        this.orgPreviewStr = org.data.orgShnm
        this.orgPreview = org.data
        this.selectedOrg = org.data.orgNo
      } else if (treeNodes.checkedKeys.length === 0) {
        this.getDefaultOrg()
        this.$nextTick(() => {
          this.selectedParent(this.$refs.tree.getCheckedNodes()[0])
        })
      }
    },
    // 机构反显
    selectedParent: function (currentObj) {
      let currentNode = this.$refs.tree.getNode(currentObj)
      if (currentNode.parent.key !== undefined) {
        this.$refs.tree.setChecked(currentNode.parent, true)
        this.selectedParent(currentNode.parent)
      }
    },
    // 机构选中确定
    changeOrg: function () {
      this.selectedOrgStr = this.orgPreviewStr
      this.dialogTableVisible = false
      this.initPage()
    },
    // 获取表格数据
    getWarnData: function (modNo) {
      let that = this
      lib.getWarnData({
        orgNos: that.selectedOrg,
        dataDt: that.lastDateOfMonth,
        pageSize: this.pageSize,
        pageNum: this.currentPage
      })
        .then((res) => {
          if (res.res) {
            that.totalNum = res.num
            let dataObj = dataFunc.toArray(res.data)
            that.callbackTable(modNo, dataObj)
          }
        })
        .catch(err => {
          console.log(err)
          that.$message.error('获取数据失败')
        })
    },
    // 查询数据回调方法，处理数据
    callbackTable: function (moduleId, dataObj) {
      if (moduleId === 'warnAnalysis') {
        // 调用统一方法生成表格数组
        let tableDataArr = dataFunc.toTableArr(dataObj)
        // 模块名称转换
        tableDataArr.map(i => {
          switch (i.modNo) {
            case 'home': {
              i.modNo = '首页'
              break
            }
            case 'capitalPosition': {
              i.modNo = '资本情况'
              break
            }
            case 'realEcoLoan': {
              i.modNo = '实体经济'
              break
            }
            case 'realEcoProject': {
              i.modNo = '实体经济'
              break
            }
            case 'creditRisk': {
              i.modNo = '信用风险'
              break
            }
            case 'liquidityRisk': {
              i.modNo = '流动性风险'
              break
            }
            case 'otherRisk': {
              i.modNo = '其他风险'
              break
            }
            case 'income': {
              i.modNo = '收入结构'
              break
            }
            case 'shareholders': {
              i.modNo = '股东情况'
              break
            }
            case 'orgPeople': {
              i.modNo = '人员数'
              break
            }
            case 'orgFinancial': {
              i.modNo = '机构财务报表'
              break
            }
            case 'bankAnalysis': {
              i.modNo = '村镇银行分析'
              break
            }
          }
        })
        this.tableData = tableDataArr
      }
    },
    // 表格导出
    tableExportToExcel: function () {
      let that = this
      // 获取表格二维数组
      // let arr = [['机构名称'].concat(this.cols)]
      // this.tableData.map(i => {
      //   let currentArr = []
      //   currentArr.push(i.orgNm, i.employeesNum, i.rEmployeesNum, i.newEmployeesNum, i.pieNum, i.vioNum, i.informerNum, i.expNum, i.bigExpNum)
      //   arr.push(currentArr)
      // })
      lib.expWarnData({
        orgNos: that.selectedOrg,
        dataDt: that.lastDateOfMonth
      })
        .then(res => {
          if (res) {
            const blob = new Blob([res]) // 创建blob对象
            const fileName = '预警分析_' + that.selectedOrgStr + '_' + that.selectedDate + '.xls' // 文件名称
            if ('download' in document.createElement('a')) {
              const link = document.createElement('a')
              link.download = fileName
              link.style.display = 'none'
              link.href = URL.createObjectURL(blob)
              document.body.appendChild(link)
              link.click() // 执行下载
              URL.revokeObjectURL(link.href) // 释放url
              document.body.removeChild(link)
            } else {
              navigator.msSaveBlob(blob, fileName)
            }
          }
        })
        .catch(err => {
          console.log(err)
          that.$message.error('表格导出失败')
        })
    },
    // 导出为pdf
    tableExportToPdf: function () {
      let that = this
      // 获取表格二维数组
      let arr = [['机构名称'].concat(this.cols)]
      this.tableData.map(i => {
        let currentArr = []
        currentArr.push(i.orgNm, i.employeesNum, i.rEmployeesNum, i.newEmployeesNum, i.pieNum, i.vioNum, i.informerNum, i.expNum, i.bigExpNum)
        arr.push(currentArr)
      })
      lib.exportDataPdf({
        content: arr
      })
        .then(res => {
          const blob = new Blob([res]) // 创建blob对象
          const fileName = '预警分析_' + that.selectedOrgStr + '_' + that.selectedDate + '.pdf' // 文件名称
          if ('download' in document.createElement('a')) {
            const link = document.createElement('a')
            link.download = fileName
            link.style.display = 'none'
            link.href = URL.createObjectURL(blob)
            document.body.appendChild(link)
            link.click() // 执行下载
            URL.revokeObjectURL(link.href) // 释放url
            document.body.removeChild(link)
          } else {
            navigator.msSaveBlob(blob, fileName)
          }
        })
        .catch(err => {
          console.log(err)
          that.$message.error('pdf导出失败')
        })
    },
    // 切换当前页码
    changeCurrentPage: function (val) {
      this.currentPage = val
      this.getWarnData('warnAnalysis')
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
    this.getDefaultOrg() // 获取默认机构
    // this.selectedDate = new Date().getFullYear() + '' + (new Date().getMonth() + 1) // 获取当前月
    var year = new Date().getFullYear()
    var month = new Date().getMonth()
    if (month === 0) {
      month = 12
      year = year - 1
    }
    this.selectedDate = year + '' + month
    this.initPage()
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
@import '../assets/css/mixin.less';
@deep: ~'>>>';
#warnAnalysis{
  background: #eee;
  min-height: calc(100% - 36px);
    // 弹窗样式
  @{deep} .el-dialog{
    width: 40vw;
    min-width: 615px;
    border-radius: 10px;
    overflow: hidden;
    margin: auto;
    .el-dialog__header{
      position: relative;
      background: linear-gradient(to right, rgba(64,112,243,1) 0%, rgba(11,153,255,1) 100%);
      padding: 14px 40px 10px;
      .el-dialog__title{
        color: #fff;
        font-size: 16px;
        line-height: 16px;
      }
      button{
        top: 50%;
        transform: translateY(-50%);
        i{
          color: #fff;
        }
      }
    }
    .el-dialog__wrapper{
      overflow: hidden;
    }
    .el-dialog__body {
      padding: 0px 40px;
      .el-form .el-form-item {
        margin: 0px;
        .el-form-item__content {
          .el-input {
            padding: 14px 0px;
            .el-input__inner {
              height: 36px;
            }
          }
          .el-scrollbar{
            border: 1px solid #C2C2C2;
            border-radius: 5px;
            height: 50vh;
            min-height: 300px;
          }
          // 改变tree选择框样式
          .el-checkbox__inner{
            border-radius: 50%;
          }
          .el-tree {
            background: none;
            overflow-y: auto;
            .el-tree-node {
              .el-tree-node__content {
                display: block;
                border-bottom: 1px solid #DADADA;
                height: 46px;
                margin-right: 19px;
                margin-left: 19px;
                .el-tree-node__expand-icon {
                  float: right;
                  padding: 17px;
                }
                .el-checkbox {
                  line-height: 46px;
                  padding: 0px 8px;
                  margin: 0px;
                }
              }
              .el-tree-node__children {
                .el-tree-node {
                  .el-tree-node__content {
                    padding-left: 22px !important;
                  }
                  .el-tree-node__children {
                    .el-tree-node {
                      .el-tree-node__content {
                        padding-left: 44px !important;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    .el-dialog__footer {
      padding: 20px;
      text-align: center;
      .el-button {
        background-color: #0d98ff;
        padding: 7px 25px;
        border-radius: 50px;
      }
    }
  }
  .w-select{
    padding: 10px;
    @{deep} .el-date-editor{
      width: 300px;
    }
    & > .el-button{
      padding: 8px 36px 6px 12px;
      position: relative;
      span{
        span{
          text-align: left;
          width: 160px;
          display: inline-block;
          text-overflow: ellipsis;
          overflow: hidden;
        }
        i{
          position: absolute;
          // background: #0B98FF;
          color: #fff;
          height: 30px;
          line-height: 30px;
          width: 30px;
          top: 0;
          right: 0;
          font-weight: bold;
          font-size: 16px;
        }
      }
    }
  }
  .w-table{
    margin: 0 10px;
    padding: 0px 10px 10px 10px;
    border-radius: 4px;
    background: #fff;
    &>p{
      text-align: left;
      padding: 15px 12px 15px 22px;
      .titleStyle;
      position: relative;
      &::before{
        content: ' ';
        position: absolute;
        top: 50%;
        left: 10px;
        transform: translateY(-50%);
        width: 3px;
        height: 18px;
        background: #0B98FF;
      }
      &>span{
        width: 70%;
        font-size: 10px;
        color: #999;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        i{
          margin-right: 5px;
          position: relative;
          top: 2px;
        }
      }
    }
    @{deep} .el-table{
      margin-top: 10px;
      border-color: #D0D0D0;
      border-radius: 4px;
      & td, & th{
        color: #666;
        border-color: #D0D0D0;
      }
      & th{
        padding: 6px 0;
        background: #FAFAFA;
      }
      & td{
        padding: 8px 0;
        font-size: 12px;
      }
      .cell{
        line-height: 18px;
        padding-left: 16%;
      }
    }
    @{deep} .pagination{
      overflow: hidden;
      padding: 20px 7px 0;
      &>span{
        font-size: 12px;
        color: #666;
        display: inline-block;
        line-height: 32px;
      }
      .el-pagination{
        float: right;
        .btn-next, .btn-prev{
          border: 2px solid #D8E2E9;
          background-color: #fff;
        }
        .btn-next:disabled, .btn-prev:disabled{
          background-color: #FAFAFA;
        }
        .el-pager li{
          border: 2px solid #D8E2E9;
          background-color: #fff;
          line-height: 24px;
        }
        .el-pager li:not(.disabled).active{
          background-color: #409EFF;
          border: none;
          line-height: 28px;
        }
        button span:not([class*=suffix]){
          height: 24px;
          line-height: 24px;
        }
      }
      .btn-prev, .btn-next{
        padding: 0 12px;
      }
    }
  }
}
</style>
