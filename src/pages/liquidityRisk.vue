<!--
  描述：流动性风险
  创建日期：2019年10月21日
  修改日期：
-->
<template>
  <div id="liquidityRisk">
    <div class="l-select">
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
          <!-- dialogTableVisible = false -->
          <el-button type="primary" @click="changeOrg">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <el-scrollbar ref="scrollbar">
      <div class="l-chartBox">
        <el-col v-for="item in cols" :key="item.id">
          <p class="title2">{{item.title}}</p>
          <div v-if="item.id == 1" :id="'l-myChart' + item.id" style="height: calc((100vh - 285px) * 0.4);"></div>
          <div v-else :id="'l-myChart' + item.id" style="height: calc((100vh - 195px) * 0.4);"></div>
          <template v-if="item.id === 1">
            <p class="comparative" v-for="item2 in item.comparative" :key="item2.id">
              <span>{{item2.title}} : </span>
              <span v-if="item2.value >= 0" style="color: #FD0202">{{item2.value}}</span>
              <span v-else style="color: #399467">{{item2.value}}</span>
            </p>
          </template>
        </el-col>
      </div>
      <div class="l-table">
        <p>流动性风险
          <el-button class="exportBtn" @click="tableExportToExcel">导出excel<i class="el-icon-download el-icon--right"></i></el-button>
        </p>
        <el-table
          :data="tableData"
          style="width: 100%;"
          border
          stripe
          height="calc(100vh - 146px)"
          @cell-click="cellClick">
          <el-table-column
            prop="idxNm"
            label="指标名称">
            <template v-slot='scope'>
              <el-popover placement="right" width="300" trigger="click">
                <p>计算公式</p><p>{{scope.row.formula}}</p>
                <span slot="reference">{{scope.row.idxNm}}</span>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            prop="reguStd"
            label="监管标准">
          </el-table-column>
          <el-table-column
            prop="juriAvg"
            label="辖内平均">
          </el-table-column>
          <el-table-column
            prop="currVal"
            label="本期数值">
            <template v-slot="scope">
              <template v-if="scope.row.reguSign === '>='">
                <span v-if="!scope.row.currValNoUnit">{{scope.row.currVal}}</span>
                <span v-else-if="scope.row.currValNoUnit >= scope.row.reguVal">{{scope.row.currVal}}</span>
                <span v-else style="color: red">{{scope.row.currVal}}</span>
              </template>
              <template v-else-if="scope.row.reguSign === '<='">
                <span v-if="!scope.row.currValNoUnit">{{scope.row.currVal}}</span>
                <span v-else-if="scope.row.currValNoUnit <= scope.row.reguVal">{{scope.row.currVal}}</span>
                <span v-else style="color: red">{{scope.row.currVal}}</span>
              </template>
              <template v-else>{{scope.row.currVal}}</template>
            </template>
          </el-table-column>
          <el-table-column
            prop="freq"
            label="频度"
            sortable>
            <template v-slot="scope">
              <span v-if="scope.row.freq == 0">日</span>
              <span v-else-if="scope.row.freq == 1">月度</span>
              <span v-else-if="scope.row.freq == 2">季度</span>
              <span v-else-if="scope.row.freq == 3">半年</span>
              <span v-else-if="scope.row.freq == 4">年度</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="combqVal"
            label="比上期">
          </el-table-column>
          <el-table-column
            prop="combyVal"
            label="比年初">
          </el-table-column>
          <el-table-column
            prop="comlyVal"
            label="比同期">
          </el-table-column>
        </el-table>
        <el-dialog title="近三年历史数据" :visible.sync="dialogThreeYearVisible">
          <el-table
            v-if="dialogThreeYearVisible"
            :data="threeYearTableData"
            style="width: 100%;margin-top: 20px;"
            border
            stripe>
            <el-table-column
              prop="month"
              label="">
            </el-table-column>
            <el-table-column v-for="item in threeYearProps" :key="item" :prop="item" :label="item">
            </el-table-column>
          </el-table>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="dialogThreeYearVisible = false">确 定</el-button>
          </span>
        </el-dialog>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
import lib from '../api/lib'
import dataFunc from '../utils/dataFunc'
// import scrollEvent from '../utils/scrollEvent'
export default {
  // 组件名称
  name: 'liquidityRisk',
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
      cols: [ // 排版
        {
          id: 1,
          title: '流动性比例',
          idxStr: 'XE111001',
          comparative: [
            {
              id: 1,
              title: '较年初',
              value: '',
              unit: '%'
            },
            {
              id: 2,
              title: '较去年同期',
              value: '',
              unit: '%'
            },
            {
              id: 3,
              title: '较上期',
              value: '',
              unit: '%'
            }
          ]
        },
        {
          id: 2,
          title: '存款偏离度',
          idxStr: 'XE111014'
        },
        {
          id: 3,
          title: '人民币超额备付金率',
          idxStr: 'XE111008'
        }
      ],
      chartArr: [], // echarts实例数组
      tableData: [],
      dialogThreeYearVisible: false,
      threeYearProps: null, // 近三年表格表头
      threeYearTableData: null // 近三年历史数据
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
    }
  },
  // 侦听器
  watch: {
    '$store.state.isCollapse' () {
      if (this.$store.state.currentPage.name === 'liquidityRisk') {
        setTimeout(() => {
          Object.values(this.chartArr).map(i => {
            i.resize()
          })
        }, 500)
      }
    },
    '$store.state.currentPage' () {
      if (this.$store.state.currentPage.name === 'liquidityRisk') {
        setTimeout(() => {
          Object.values(this.chartArr).map(i => {
            i.resize()
          })
        }, 500)
      }
    },
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
      this.getIdxData(this.cols[0].idxStr, 'l-myChart1') // 请求指标数据
      this.getIdxDateData(this.cols[1].idxStr, 'l-myChart2') // 请求过去十二个月历史数据
      this.getIdxDateData(this.cols[2].idxStr, 'l-myChart3') // 请求过去十二个月历史数据
      this.getTableData('liquidityRisk')
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
    // 获取指标数据
    getIdxData: function (idxNos, moduleId) {
      let that = this
      lib.getIdxData({
        idxNos: idxNos,
        orgNo: this.selectedOrg,
        dataDt: this.lastDateOfMonth
      })
        .then((res) => {
          if (res.res) {
            that.callbackChart(idxNos, moduleId, res.data)
            // 加载变更指标的三项属性
            for (let i = 0; i < that.cols.length; i++) {
              if (that.cols[i].idxStr === idxNos && that.cols[i].comparative) {
                // 仪表盘的空值处理
                Object.values(res.data)[0] = dataFunc.toNotNull(Object.values(res.data)[0])
                that.cols[i].comparative[0].value = Object.values(res.data)[0].combyVal
                that.cols[i].comparative[1].value = Object.values(res.data)[0].comlyVal
                that.cols[i].comparative[2].value = Object.values(res.data)[0].combqVal
              }
            }
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    // 获取过去十二个月数据
    getIdxDateData: function (idxNos, moduleId) {
      let that = this
      lib.getIdxDateData({
        idxNos: idxNos,
        orgNo: this.selectedOrg,
        dataDt: this.lastDateOfMonth
      })
        .then((res) => {
          if (res.res) {
            that.callbackChart(idxNos, moduleId, res.data)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    // 查询数据回调方法，处理数据
    callbackChart: function (idxNos, moduleId, data) {
      let dataObj
      if (moduleId === 'l-myChart1') {
        dataObj = Object.values(data)
      } else if (moduleId === 'l-myChart2') {
        dataObj = dataFunc.dateToMonth(Object.values(data))
      } else if (moduleId === 'l-myChart3') {
        dataObj = dataFunc.dateToMonth(Object.values(data))
      }
      this.initEcharts(idxNos, moduleId, dataObj)
    },
    // echarts配置
    initEcharts: function (idxNos, moduleId, dataObj) {
      let that = this
      // 各自配置图表
      switch (moduleId) {
        case 'l-myChart1': {
        // chart1
          let chart1 = this.$echarts.init(document.getElementById('l-myChart1'))
          let extend = dataFunc.getGaugeRange(dataObj[0].currVal, 10, 75, 25)
          let nums = {
            'min': extend.min,
            'max': extend.max,
            'value': dataObj[0].currVal,
            'interVal': extend._interVal,
            'splitNumber': extend._splitNumber,
            'standard': 25
          }
          let option1 = {
            tooltip: {
              formatter: '{a} : {c}%'
            },
            toolbox: {
              feature: {
                saveAsImage: {
                  name: '流动性比例_' + that.selectedOrgStr + '_' + that.selectedDate,
                  title: '保存'
                }
              },
              right: '0.5%'
            },
            series: [
              {
                type: 'gauge',
                name: '流动性比例',
                radius: '110%',
                center: ['50%', '60%'],
                startAngle: 225,
                endAngle: -45,
                data: [{value: nums.value, name: ''}],
                min: nums.min,
                max: nums.max,
                splitNumber: 5,
                axisLine: {
                  show: true,
                  lineStyle: {
                    color: [
                      [0.33333333333333, '#5789EA'], [0.66666666666666, '#13C5F1'], [1, '#AA8DF5']
                    ],
                    width: 12
                  }
                },
                splitLine: {
                  show: true,
                  length: 12,
                  lineStyle: {
                    color: '#ADADAD'
                  }
                },
                axisTick: {
                  show: true
                },
                axisLabel: {
                  show: true,
                  distance: 12,
                  formatter: function (value) {
                    if (Math.abs(value - nums.standard) < nums.splitNumber / 10 * nums.interVal) {
                      return ''
                    }
                    return value
                  },
                  color: '#9E9E9E',
                  fontSize: 15,
                  rich: {
                    red: {
                      color: 'red',
                      fontSize: 15
                    }
                  }
                },
                pointer: {
                  show: true,
                  length: '85%'
                },
                detail: {
                  show: true,
                  offsetCenter: [0, '45%'],
                  formatter: function (value) {
                    return isNaN(value) ? '{a|\n流动性比例}' : '{b|' + value.toFixed(2) + dataObj[0].unit + '}' + '{a|\n流动性比例}'
                  },
                  color: '#949494',
                  fontSize: 14,
                  rich: {
                    a: {
                      color: '#9E9E9E',
                      fontSize: 14,
                      height: 20
                    },
                    b: {
                      color: '#009FFF',
                      fontSize: 16,
                      height: 30,
                      fontWeight: 'bold'
                    }
                  }
                }
              },
              {
                type: 'gauge',
                name: '流动性比例',
                radius: '110%',
                center: ['50%', '60%'],
                startAngle: 225,
                endAngle: -45,
                data: [{value: nums.value, name: ''}],
                min: nums.min,
                max: nums.max,
                axisLine: {
                  show: false
                },
                splitLine: {
                  show: false,
                  length: 12
                },
                axisTick: {
                  show: false
                },
                axisLabel: {
                  show: true,
                  distance: 12,
                  formatter: function (value) {
                    if (value === nums.standard) {
                      return '{red|' + value + '}'
                    }
                  },
                  color: '#9E9E9E',
                  fontSize: 15,
                  rich: {
                    red: {
                      color: 'red',
                      fontSize: 15
                    }
                  }
                },
                pointer: {
                  show: false
                },
                detail: {
                  show: false
                }
              }
            ]
          }
          if (nums.splitNumber) {
            option1.series[1].splitNumber = nums.splitNumber
          }
          chart1.setOption(option1)
          this.chartArr['chart1'] = chart1
          break
        }
        case 'l-myChart2': {
        // chart2
          let chart2 = this.$echarts.init(document.getElementById('l-myChart2'))
          let extend = dataFunc.getLineAxis(dataObj[0].values)
          let chart2numbers = {
            'xdate': dataObj[0].dateMonth,
            'ydata': dataObj[0].values,
            'unit': dataObj[0].unit,
            'min': extend.min,
            'max': extend.max,
            'interval': extend.interval
          }
          let option2 = {
            tooltip: {
              trigger: 'axis'
            },
            color: ['#AA8DF5'],
            toolbox: {
              feature: {
                saveAsImage: {
                  name: '存款偏离度_' + that.selectedOrgStr + '_' + that.selectedDate,
                  title: '保存'
                }
              },
              right: '0.5%'
            },
            xAxis: {
              type: 'category',
              boundaryGap: true,
              data: chart2numbers.xdate,
              axisLabel: {
                interval: 0,
                textStyle: {
                  color: '#8A8A8A'
                }
              },
              axisLine: {
                show: false
              },
              axisTick: {
                show: true,
                alignWithLabel: true,
                inside: true,
                length: 4,
                lineStyle: {
                  color: '#E3E3E3',
                  width: '6'
                }
              },
              z: 10
            },
            yAxis: {
              axisLine: {
                show: false
              },
              axisTick: {
                show: false
              },
              axisLabel: {
                color: '#8A8A8A',
                formatter: '{value}' + chart2numbers.unit,
                margin: 10
              },
              min: chart2numbers.min,
              max: chart2numbers.max,
              interval: chart2numbers.interval
            },
            series: [
              {
                type: 'line',
                name: '存款偏离度',
                symbol: 'emptyCircle',
                symbolSize: 1,
                smooth: true,
                data: chart2numbers.ydata,
                areaStyle: {
                  color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                      offset: 0, color: '#96BAF2' // 0% 处的颜色
                    }, {
                      offset: 1, color: '#fff' // 100% 处的颜色
                    }],
                    global: false // 缺省为 false
                  }
                },
                lineStyle: { // 系列级个性化折线样式
                  width: 2,
                  type: 'solid',
                  color: '#B3A0F6'
                }
              }
            ],
            // 处理y轴name显示不完全的情况
            grid: {
              left: 60,
              right: 30,
              y: 48,
              bottom: 40
            }
          }
          chart2.setOption(option2)
          this.chartArr['chart2'] = chart2
          break
        }
        case 'l-myChart3': {
        // chart3
          let chart3 = this.$echarts.init(document.getElementById('l-myChart3'))
          let extend = dataFunc.getLineAxis(dataObj[0].values)
          let chart3numbers = {
            'xdate': dataObj[0].dateMonth,
            'ydata': dataObj[0].values,
            'unit': dataObj[0].unit,
            'min': extend.min,
            'max': extend.max,
            'interval': extend.interval
          }
          let option3 = {
            tooltip: {
              trigger: 'axis'
            },
            color: ['#0D98FF'],
            toolbox: {
              feature: {
                saveAsImage: {
                  name: '人民币超额备付金率_' + that.selectedOrgStr + '_' + that.selectedDate,
                  title: '保存'
                }
              },
              right: '0.5%'
            },
            xAxis: {
              type: 'category',
              boundaryGap: true,
              data: chart3numbers.xdate,
              axisLabel: {
                interval: 0,
                textStyle: {
                  color: '#8A8A8A'
                }
              },
              axisLine: {
                show: false
              },
              axisTick: {
                show: true,
                alignWithLabel: true,
                inside: true,
                length: 4,
                lineStyle: {
                  color: '#E3E3E3',
                  width: '6'
                }
              },
              z: 10
            },
            yAxis: {
              axisLine: {
                show: false
              },
              axisTick: {
                show: false
              },
              axisLabel: {
                color: '#8A8A8A',
                formatter: '{value}' + chart3numbers.unit,
                margin: 10
              },
              min: chart3numbers.min,
              max: chart3numbers.max,
              interval: chart3numbers.interval
            },
            series: [
              {
                type: 'line',
                name: '人民币超额备付金率',
                symbol: 'emptyCircle',
                symbolSize: 1,
                smooth: true,
                data: chart3numbers.ydata,
                areaStyle: {
                  color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                      offset: 0, color: '#60ECEE' // 0% 处的颜色
                    }, {
                      offset: 1, color: '#fff' // 100% 处的颜色
                    }],
                    global: false // 缺省为 false
                  }
                },
                lineStyle: { // 系列级个性化折线样式
                  width: 2,
                  type: 'solid',
                  color: '#0D98FF'
                }
              }
            ],
            // 处理y轴name显示不完全的情况
            grid: {
              left: 60,
              right: 30,
              y: 48,
              bottom: 40
            }
          }
          chart3.setOption(option3)
          this.chartArr['chart3'] = chart3
          break
        }
        default: {
          break
        }
      }
    },
    // 获取表格数据
    getTableData: function (modNo) {
      let that = this
      lib.getTableData({
        modNo: modNo,
        orgNo: that.selectedOrg,
        dataDt: that.lastDateOfMonth
      })
        .then(res => {
          let dataObj = dataFunc.toArray(res.data)
          that.callbackTable(modNo, dataObj)
        })
        .catch(err => {
          console.log(err)
          that.$message.error('获取表格数据失败')
        })
    },
    // 查询数据回调方法，处理数据
    callbackTable: function (moduleId, dataObj) {
      if (moduleId === 'liquidityRisk') {
        // 调用统一方法生成表格数组
        let tableDataArr = dataFunc.toTableArr(dataObj)
        this.tableData = tableDataArr
      }
    },
    // 单元格点击事件
    cellClick: function (row, column, cell, event) {
      if (column.property === 'currVal') {
        this.getIdxThreeDateData(row.idxNo, row.freq)
      }
    },
    // 获取近三年历史数据
    getIdxThreeDateData: function (idxNos, freq) {
      let that = this
      lib.getIdxThreeDateData({
        idxNos: idxNos,
        orgNo: that.selectedOrg,
        dataDt: that.lastDateOfMonth
      })
        .then(res => {
          let dataObj = dataFunc.threeYearTableData(Object.values(res.data)[0], freq)
          that.threeYearProps = dataObj.tableProps
          that.threeYearTableData = dataObj.tableData
          that.dialogThreeYearVisible = true
        })
        .catch(err => {
          console.log(err)
          that.$message.error('请求失败')
        })
    },
    // 表格导出
    tableExportToExcel: function () {
      let that = this
      // 获取表格二维数组
      let arr = [['指标名称', '监管标准', '辖内平均', '本期数值', '频度', '比上期', '比年初', '比同期']]
      this.tableData.map(i => {
        let currentArr = []
        let freq = i.freq
        if (freq === '0') {
          freq = '日'
        } else if (freq === '1') {
          freq = '月度'
        } else if (freq === '2') {
          freq = '季度'
        } else if (freq === '3') {
          freq = '半年'
        } else if (freq === '4') {
          freq = '年度'
        }
        currentArr.push(i.idxNm, i.reguStd, i.juriAvg, i.currVal, freq, i.combqVal + i.unit, i.combyVal + i.unit, i.comlyVal + i.unit)
        arr.push(currentArr)
      })
      lib.exportData({
        content: arr
      })
        .then(res => {
          if (res) {
            const blob = new Blob([res]) // 创建blob对象
            const fileName = '流动性风险_' + that.selectedOrgStr + '_' + that.selectedDate + '.xls' // 文件名称
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
      let arr = [['指标名称', '监管标准', '辖内平均', '本期数值', '频度', '比上期', '比年初', '比同期']]
      this.tableData.map(i => {
        let currentArr = []
        let freq = i.freq
        if (freq === '0') {
          freq = '日'
        } else if (freq === '1') {
          freq = '月度'
        } else if (freq === '2') {
          freq = '季度'
        } else if (freq === '3') {
          freq = '半年'
        } else if (freq === '4') {
          freq = '年度'
        }
        currentArr.push(i.idxNm, i.reguStd, i.juriAvg, i.currVal, freq, i.combqVal + i.unit, i.combyVal + i.unit, i.comlyVal + i.unit)
        arr.push(currentArr)
      })
      lib.exportDataPdf({
        content: arr
      })
        .then(res => {
          const blob = new Blob([res]) // 创建blob对象
          const fileName = '流动性风险_' + that.selectedOrgStr + '_' + that.selectedDate + '.pdf' // 文件名称
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
    let that = this
    // 监听页面尺寸变化
    window.onresize = function () {
      if (that.$store.state.currentPage.name === 'liquidityRisk') {
        Object.values(that.chartArr).map(i => {
          i.resize()
        })
      }
    }
    // scrollEvent.headerFixed(this.$refs) // 监听滚动
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
#liquidityRisk {
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
  .l-select {
    padding: 10px;
    @{deep} .el-date-editor {
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
    // the pop-up windows of ORG
  }
  .l-chartBox {
    display: flex;
    padding: 0 10px 10px;
    &>:nth-child(n+2) {
      margin-left: 10px;
    }
    .el-col{
      width: calc(33% - 3px);
      border-radius: 4px;
      background: #fff;
      .title{
        text-align: left;
        padding: 6px 0px 6px 36px;
        border-bottom: 3px solid #eee;
        .titleStyle;
        position: relative;
        float: left;
        width: calc(70% - 36px);
        &::before{
          content: ' ';
          position: absolute;
          top: 50%;
          left: 20px;
          transform: translateY(-50%);
          width: 3px;
          height: 18px;
          background: #0B98FF;
        }
      }
      .frequentness{
        text-align: right;
        margin: 0;
        padding: 6px 36px 6px 0px;
        border-bottom: 3px solid #eee;
        font-size: 14px;
        position: relative;
        float: left;
        width: calc(30% - 36px);
      }
      .title2 {
        text-align: left;
        padding: 8px 12px 8px 36px;
        border-bottom: 3px solid #eee;
        .titleStyle;
        position: relative;
        &::before {
          content: ' ';
          position: absolute;
          top: 50%;
          left: 20px;
          transform: translateY(-50%);
          width: 3px;
          height: 18px;
          background: #0B98FF;
        }
      }
      &>div{
        clear: both;
      }
      .comparative {
        text-align: center;
        margin: 1% 0px;
        padding: 6px 0px;
        font-size: 14px;
        position: relative;
        width: calc(33% - 0px);
        float: left;
      }
      &>:nth-child(n+4) {
        border-left: 1px solid #eee;
      }
    }
  }

  .l-table {
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
    }
    @{deep} .el-table{
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
        padding-left: 8%;
      }
    }
  }
}
</style>
