<!--
  描述：需求信息
-->
<template>
  <div id="requireInfo">
    <el-row class="req_autocomplete">
      <el-col :span="6">
        <el-autocomplete
          class="inline-input"
          v-model="requireNo"
          :fetch-suggestions="querySearch"
          style="margin-left: 20px;"
          size="mini"
          placeholder="请输入需求编号"
          @select="handleSelect"
        >
          <template slot="prepend">需求编号:</template>
        </el-autocomplete>
      </el-col>
      <el-col :span="6">
        <el-autocomplete
          class="inline-input"
          v-model="requireName"
          :fetch-suggestions="querySearch"
          style="margin-left: 20px;"
          size="mini"
          placeholder="请输入需求名称"
          :trigger-on-focus="false"
          @select="handleSelect"
        >
          <template slot="prepend">需求名称:</template></el-autocomplete>
      </el-col>
      <el-col :span="6">
        <!-- <div class="sub-title">是否逾期:</div> -->
        <el-select
          v-model="isOverDue"
          clearable
          collapse-tags
          style="margin-left: 20px;"
          size="mini"
          placeholder="是否逾期"
          @change="isOverDueChange">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="6">
        <!-- <div class="sub-title">是否报工:</div> -->
        <el-select
          v-model="isSub"
          clearable
          style="margin-left: 20px;"
          size="mini"
          placeholder="是否报工"
          @change="isSubChange">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-col>
    </el-row>
    <div class="button">
      <el-button size="mini" @click="selectCondition">搜索</el-button>
      <el-button size="mini" @click="clearFilter">清除所有过滤器</el-button>
    </div>
    <el-table
      :data="tableData"
      stripe
      border
      ref="multipleTable"
      tooltip-effect="dark"
      style="width: 100%"
      height="420"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="40">
      </el-table-column>
      <el-table-column
        fixed
        sortable
        prop="requireNo"
        label="需求编号"
        width="150">
      </el-table-column>
      <el-table-column
        fixed
        prop="requireName"
        label="需求名称"
        width="300">
      </el-table-column>
      <el-table-column
        prop="flowName"
        label="需求流程"
        width="120">
      </el-table-column>
      <el-table-column
        prop="workAmountType"
        label="工作类型"
        width="120">
      </el-table-column>
      <el-table-column
        prop="sysName"
        label="所属系统"
        width="120">
      </el-table-column>
      <el-table-column
        prop="staffName"
        label="业务人员"
        width="120">
      </el-table-column>
      <el-table-column
        sortable
        prop="money"
        label="总金额"
        width="120">
      </el-table-column>
      <el-table-column
        sortable
        prop="planDate"
        label="计划时间"
        width="120">
      </el-table-column>
      <el-table-column
        sortable
        prop="onlineDate"
        label="上线时间"
        width="120">
      </el-table-column>
      <el-table-column
        prop="nodeName"
        label="流程节点"
        width="120">
      </el-table-column>
      <el-table-column
        prop="userName"
        label="流程负责人"
        width="120">
      </el-table-column>
      <el-table-column
        prop="sts"
        label="状态"
        width="80">
      </el-table-column>
      <el-table-column
        prop="isSub"
        label="是否报工"
        width="90"
        :filters="[{ text: '是', value: 'Y' }, { text: '否', value: 'N' }]"
        :filter-method="filterIsSub">
        <template v-slot="scope">
          <span v-if="scope.row.priority === 'Y'">是</span>
          <span v-else-if="scope.row.priority === 'N'">否</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="priority"
        label="优先级"
        width="90"
        :filters="[{ text: '高', value: 'A' }, { text: '中', value: 'B' }, { text: '低', value: 'C' }]"
        :filter-method="filterPriority">
        <template v-slot="scope">
          <span v-if="scope.row.priority === 'A'">高</span>
          <span v-else-if="scope.row.priority === 'B'">中</span>
          <span v-else-if="scope.row.priority === 'C'">低</span>
        </template>
      </el-table-column>
      <el-table-column
        sortable
        prop="payDate"
        label="付款时间"
        width="120">
      </el-table-column>
      <el-table-column
        prop="isOverDate"
        label="是否逾期"
        width="90"
        :filters="[{ text: '是', value: 'Y' }, { text: '否', value: 'N' }]"
        :filter-method="filterIsOverDate">
        <template v-slot="scope">
          <span v-if="scope.row.priority === 'Y'">是</span>
          <span v-else-if="scope.row.priority === 'N'">否</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="tableFooter">
      <el-button size="small" @click="toggleSelection()">取消选择</el-button>
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[20, 50, 200, 500]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageTotal">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  // 组件名称
  name: 'requireInfo',
  // 组件参数 接收来自父组件的数据
  props: {},
  // 局部注册的组件
  components: {},
  // 组件状态值
  data () {
    return {
      // 搜索框相关变量
      restaurants: [],
      requireNo: '',
      requireName: '',
      options: [{
        value: 'Y',
        label: '是'
      }, {
        value: 'N',
        label: '否'
      }],
      isOverDue: [],
      isSub: [],
      // 表格相关变量
      tableData: [{
        requireNo: 'X20191105000015',
        requireName: '王小虎',
        flowName: '上海',
        workAmountType: '普陀区',
        sysName: '上海市普陀区金沙江路 1518 弄',
        staffName: 200333,
        money: '2016-05-03',
        planDate: '王小虎',
        onlineDate: '上海',
        nodeName: '普陀区',
        userName: '上海市普陀区金沙江路 1518 弄',
        sts: 200333,
        isSub: '2016-05-03',
        priority: 'C',
        payDate: '上海',
        isOverDate: '普陀区'
      }, {
        requireNo: '2016-05-03',
        requireName: '王小虎',
        flowName: '上海',
        workAmountType: '普陀区',
        sysName: '上海市普陀区金沙江路 1518 弄',
        staffName: 200333,
        money: '2016-05-03',
        planDate: '王小虎',
        onlineDate: '上海',
        nodeName: '普陀区',
        userName: '上海市普陀区金沙江路 1518 弄',
        sts: 200333,
        isSub: '2016-05-03',
        priority: 'C',
        payDate: '上海',
        isOverDate: '普陀区'
      }, {
        requireNo: '2016-05-03',
        requireName: '王小虎',
        flowName: '上海',
        workAmountType: '普陀区',
        sysName: '上海市普陀区金沙江路 1518 弄',
        staffName: 200333,
        money: '2016-05-03',
        planDate: '王小虎',
        onlineDate: '上海',
        nodeName: '普陀区',
        userName: '上海市普陀区金沙江路 1518 弄',
        sts: 200333,
        isSub: '2016-05-03',
        priority: 'C',
        payDate: '上海',
        isOverDate: '普陀区'
      }, {
        requireNo: '2016-05-03',
        requireName: '王小虎',
        flowName: '上海',
        workAmountType: '普陀区',
        sysName: '上海市普陀区金沙江路 1518 弄',
        staffName: 200333,
        money: '2016-05-03',
        planDate: '王小虎',
        onlineDate: '上海',
        nodeName: '普陀区',
        userName: '上海市普陀区金沙江路 1518 弄',
        sts: 200333,
        isSub: '2016-05-03',
        priority: 'C',
        payDate: '上海',
        isOverDate: '普陀区'
      }, {
        requireNo: '2016-05-03',
        requireName: '王小虎',
        flowName: '上海',
        workAmountType: '普陀区',
        sysName: '上海市普陀区金沙江路 1518 弄',
        staffName: 200333,
        money: '2016-05-03',
        planDate: '王小虎',
        onlineDate: '上海',
        nodeName: '普陀区',
        userName: '上海市普陀区金沙江路 1518 弄',
        sts: 200333,
        isSub: '2016-05-03',
        priority: 'C',
        payDate: '上海',
        isOverDate: '普陀区'
      }, {
        requireNo: '2016-05-03',
        requireName: '王小虎',
        flowName: '上海',
        workAmountType: '普陀区',
        sysName: '上海市普陀区金沙江路 1518 弄',
        staffName: 200333,
        money: '2016-05-03',
        planDate: '王小虎',
        onlineDate: '上海',
        nodeName: '普陀区',
        userName: '上海市普陀区金沙江路 1518 弄',
        sts: 200333,
        isSub: '2016-05-03',
        priority: 'C',
        payDate: '上海',
        isOverDate: '普陀区'
      }, {
        requireNo: '2016-05-03',
        requireName: '王小虎',
        flowName: '上海',
        workAmountType: '普陀区',
        sysName: '上海市普陀区金沙江路 1518 弄',
        staffName: 200333,
        money: '2016-05-03',
        planDate: '王小虎',
        onlineDate: '上海',
        nodeName: '普陀区',
        userName: '上海市普陀区金沙江路 1518 弄',
        sts: 200333,
        isSub: '2016-05-03',
        priority: 'C',
        payDate: '上海',
        isOverDate: '普陀区'
      }, {
        requireNo: '2016-05-03',
        requireName: '王小虎',
        flowName: '上海',
        workAmountType: '普陀区',
        sysName: '上海市普陀区金沙江路 1518 弄',
        staffName: 200333,
        money: '2016-05-03',
        planDate: '王小虎',
        onlineDate: '上海',
        nodeName: '普陀区',
        userName: '上海市普陀区金沙江路 1518 弄',
        sts: 200333,
        isSub: '2016-05-03',
        priority: 'C',
        payDate: '上海',
        isOverDate: '普陀区'
      }, {
        requireNo: '2016-05-03',
        requireName: '王小虎',
        flowName: '上海',
        workAmountType: '普陀区',
        sysName: '上海市普陀区金沙江路 1518 弄',
        staffName: 200333,
        money: '2016-05-03',
        planDate: '王小虎',
        onlineDate: '上海',
        nodeName: '普陀区',
        userName: '上海市普陀区金沙江路 1518 弄',
        sts: 200333,
        isSub: '2016-05-03',
        priority: 'C',
        payDate: '上海',
        isOverDate: '普陀区'
      }, {
        requireNo: '2016-05-03',
        requireName: '王小虎',
        flowName: '上海',
        workAmountType: '普陀区',
        sysName: '上海市普陀区金沙江路 1518 弄',
        staffName: 200333,
        money: '2016-05-03',
        planDate: '王小虎',
        onlineDate: '上海',
        nodeName: '普陀区',
        userName: '上海市普陀区金沙江路 1518 弄',
        sts: 200333,
        isSub: '2016-05-03',
        priority: 'C',
        payDate: '上海',
        isOverDate: '普陀区'
      }, {
        requireNo: '2016-05-03',
        requireName: '王小虎',
        flowName: '上海',
        workAmountType: '普陀区',
        sysName: '上海市普陀区金沙江路 1518 弄',
        staffName: 200333,
        money: '2016-05-03',
        planDate: '王小虎',
        onlineDate: '上海',
        nodeName: '普陀区',
        userName: '上海市普陀区金沙江路 1518 弄',
        sts: 200333,
        isSub: '2016-05-03',
        priority: 'C',
        payDate: '上海',
        isOverDate: '普陀区'
      }, {
        requireNo: '2016-05-03',
        requireName: '王小虎',
        flowName: '上海',
        workAmountType: '普陀区',
        sysName: '上海市普陀区金沙江路 1518 弄',
        staffName: 200333,
        money: '2016-05-03',
        planDate: '王小虎',
        onlineDate: '上海',
        nodeName: '普陀区',
        userName: '上海市普陀区金沙江路 1518 弄',
        sts: 200333,
        isSub: '2016-05-03',
        priority: 'C',
        payDate: '上海',
        isOverDate: '普陀区'
      }, {
        requireNo: '2016-05-03',
        requireName: '王小虎',
        flowName: '上海',
        workAmountType: '普陀区',
        sysName: '上海市普陀区金沙江路 1518 弄',
        staffName: 200333,
        money: '2016-05-03',
        planDate: '王小虎',
        onlineDate: '上海',
        nodeName: '普陀区',
        userName: '上海市普陀区金沙江路 1518 弄',
        sts: 200333,
        isSub: '2016-05-03',
        priority: 'C',
        payDate: '上海',
        isOverDate: '普陀区'
      }, {
        requireNo: '2016-05-03',
        requireName: '王小虎',
        flowName: '上海',
        workAmountType: '普陀区',
        sysName: '上海市普陀区金沙江路 1518 弄',
        staffName: 200333,
        money: '2016-05-03',
        planDate: '王小虎',
        onlineDate: '上海',
        nodeName: '普陀区',
        userName: '上海市普陀区金沙江路 1518 弄',
        sts: 200333,
        isSub: '2016-05-03',
        priority: 'C',
        payDate: '上海',
        isOverDate: '普陀区'
      }, {
        requireNo: '2016-05-03',
        requireName: '王小虎',
        flowName: '上海',
        workAmountType: '普陀区',
        sysName: '上海市普陀区金沙江路 1518 弄',
        staffName: 200333,
        money: '2016-05-03',
        planDate: '王小虎',
        onlineDate: '上海',
        nodeName: '普陀区',
        userName: '上海市普陀区金沙江路 1518 弄',
        sts: 200333,
        isSub: '2016-05-03',
        priority: 'C',
        payDate: '上海',
        isOverDate: '普陀区'
      }, {
        requireNo: '2016-05-03',
        requireName: '王小虎',
        flowName: '上海',
        workAmountType: '普陀区',
        sysName: '上海市普陀区金沙江路 1518 弄',
        staffName: 200333,
        money: '2016-05-03',
        planDate: '王小虎',
        onlineDate: '上海',
        nodeName: '普陀区',
        userName: '上海市普陀区金沙江路 1518 弄',
        sts: 200333,
        isSub: '2016-05-03',
        priority: 'C',
        payDate: '上海',
        isOverDate: '普陀区'
      }, {
        requireNo: '2016-05-03',
        requireName: '王小虎',
        flowName: '上海',
        workAmountType: '普陀区',
        sysName: '上海市普陀区金沙江路 1518 弄',
        staffName: 200333,
        money: '2016-05-03',
        planDate: '王小虎',
        onlineDate: '上海',
        nodeName: '普陀区',
        userName: '上海市普陀区金沙江路 1518 弄',
        sts: 200333,
        isSub: '2016-05-03',
        priority: 'C',
        payDate: '上海',
        isOverDate: '普陀区'
      }, {
        requireNo: '2016-05-03',
        requireName: '王小虎',
        flowName: '上海',
        workAmountType: '普陀区',
        sysName: '上海市普陀区金沙江路 1518 弄',
        staffName: 200333,
        money: '2016-05-03',
        planDate: '王小虎',
        onlineDate: '上海',
        nodeName: '普陀区',
        userName: '上海市普陀区金沙江路 1518 弄',
        sts: 200333,
        isSub: '2016-05-03',
        priority: 'C',
        payDate: '上海',
        isOverDate: '普陀区'
      }, {
        requireNo: '2016-05-03',
        requireName: '王小虎',
        flowName: '上海',
        workAmountType: '普陀区',
        sysName: '上海市普陀区金沙江路 1518 弄',
        staffName: 200333,
        money: '2016-05-03',
        planDate: '王小虎',
        onlineDate: '上海',
        nodeName: '普陀区',
        userName: '上海市普陀区金沙江路 1518 弄',
        sts: 200333,
        isSub: '2016-05-03',
        priority: 'C',
        payDate: '上海',
        isOverDate: '普陀区'
      }, {
        requireNo: '2016-05-03',
        requireName: '王小虎',
        flowName: '上海',
        workAmountType: '普陀区',
        sysName: '上海市普陀区金沙江路 1518 弄',
        staffName: 200333,
        money: '2016-05-03',
        planDate: '王小虎',
        onlineDate: '上海',
        nodeName: '普陀区',
        userName: '上海市普陀区金沙江路 1518 弄',
        sts: 200333,
        isSub: '2016-05-03',
        priority: 'C',
        payDate: '上海',
        isOverDate: '普陀区'
      }, {
        requireNo: '2016-05-03',
        requireName: '王小虎',
        flowName: '上海',
        workAmountType: '普陀区',
        sysName: '上海市普陀区金沙江路 1518 弄',
        staffName: 200333,
        money: '2016-05-03',
        planDate: '王小虎',
        onlineDate: '上海',
        nodeName: '普陀区',
        userName: '上海市普陀区金沙江路 1518 弄',
        sts: 200333,
        isSub: '2016-05-03',
        priority: 'A',
        payDate: '上海',
        isOverDate: '普陀区'
      }],
      // 分页相关变量
      pageSize: 20,
      pageTotal: 500,
      currentPage: 1
    }
  },
  // 计算属性
  computed: {
  },
  // 侦听器
  watch: {
  },
  // 组件方法
  methods: {
    // input输入框相关方法
    querySearch (queryString, cb) {
      var restaurants = this.restaurants
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter (queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    loadAll () {
      return [
      ]
    },
    handleSelect (item) {
      console.log(item)
    },
    // select选择器相关方法
    isOverDueChange (value) {
      if (value === this.isOverDue) {
        console.log(value)
        console.log(this.isOverDue)
      }
    },
    isSubChange (value) {
      if (value === this.isSub) {
        console.log(value)
        console.log(this.isSub)
      }
    },
    // 表格相关方法
    toggleSelection (rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    selectCondition () { // 按条件过滤
      // filterIsSub(this.isSub, row, column)
      console.log(this.requireNo)
      console.log(this.requireName)
      console.log(this.isOverDue)
      console.log(this.isSub)
      this.filterIsSub(this.isSub)
    },
    clearFilter () { // 清空全部筛选
      this.$refs.multipleTable.clearFilter()
      this.requireNo = ''
      this.requireName = ''
      this.isOverDue = []
      this.isSub = []
    },
    filterIsSub (value, row, column) { // 筛选是否报工
      const property = column['property']
      return row[property] === value
    },
    filterPriority (value, row, column) { // 筛选优先级
      console.log(value)
      console.log(row)
      console.log(column)
      const property = column['property']
      return row[property] === value
    },
    filterIsOverDate (value, row, column) { // 筛选是否逾期
      const property = column['property']
      return row[property] === value
    },
    // 分页相关方法
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
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
    this.restaurants = this.loadAll()
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
#requireInfo{
  .req_autocomplete{
    .el-col{
      .sub-title{
        float: left;
        font-size: 0.8rem;
      }
      .el-autocomplete{
        float: left;
      }
      .el-select{
        float: left;
      }
    }
  }
  .button{
    width: 98%;
    padding: 5px;
  }
  .tableFooter{
    widows: 100%;
    .el-button{
      float: left;
    }
    .block{
      float: left;
    }
  }
}
</style>
