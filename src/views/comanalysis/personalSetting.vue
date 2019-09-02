<template>
  <section class="personalSetting">
    <el-row class="inspect_edit">
      <img src="@/assets/icon/back.png"  class="goBacks" @click="toback">   <!--返回-->
    </el-row>
    <el-col :span="4">
      <el-tree :data="treeData" node-key="id" :props="defaultProps" @node-click="handleNodeClick" :render-content="renderContent" :default-expand-all="true" :highlight-current="true" :expand-on-click-node="false"
></el-tree>
      <!-- <el-menu :default-openeds="['1']">
        <el-submenu index="1">
          <template slot="title"><svg-icon icon-class="all"></svg-icon>&emsp;食药环数据资源</template>
          <el-menu-item-group>
            <el-menu-item index="1-1">案件信息</el-menu-item>
            <el-menu-item index="1-2">嫌疑人信息</el-menu-item>
            <el-menu-item index="1-3">案件关联单位信息</el-menu-item>
            <el-menu-item index="1-4">情报线索信息</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </el-menu> -->
    </el-col>
    <el-col :span="18" :offset="1">
      <el-row type="flex" justify="space-between">
        <el-col :span="4">
          <el-button type="primary" @click="submit" class="submit_btn">确认</el-button>
        </el-col>
        <el-col :span="20" class="all_check_wrap">
          <el-checkbox v-model="check2" @change="handelCheck2">全选可高级搜索查询字段</el-checkbox>
          <el-checkbox v-model="check1" @change="handelCheck1">全选可高级搜索列表显示字段</el-checkbox>
          <el-checkbox v-model="check0" @change="handelCheck0">全选可简单查询比对字段</el-checkbox>
        </el-col>
      </el-row>
      <el-table :data="dataList" v-loading="loading" style="width: 100%;margin-top:20px;" v-if="dataShow">
        <el-table-column type="index" label="序号" width="100" align="center"></el-table-column>
        <el-table-column prop="column_description" label="字段名称" align="center"></el-table-column>
        <el-table-column prop="se" label="可简单查询比对字段" align="center">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.is_contrast" :disabled="!scope.row.abled_contrast"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column prop="se" label="可高级搜索列表显示字段" align="center">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.is_show" :disabled="!scope.row.abled_show"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column prop="se" label="可高级搜索查询字段" align="center">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.is_search" :disabled="!scope.row.abled_search"></el-checkbox>
          </template>
        </el-table-column>
      </el-table>

    </el-col>
  </section>
</template>

<script>
  export default {
    name: 'personalSetting',
    data() {
      return {
        configFlag: 0,
        treeData: [{
          id: 0,
          icon: 'all',
          label: '食药环数据资源',
          children: [{
            id: 1,
            icon: 'lawcase',
            label: '案件信息'
          }, {
            id: 2,
            icon: 'xyr',
            label: '嫌疑人信息'
          }, {
            id: 3,
            icon: 'company',
            label: '案件关联单位信息'
          }, {
            id: 4,
            icon: 'clue',
            label: '情报线索信息'
          }]
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        curNode: 0,
        dataList: [],
        loading: false,
        check0: false,
        check1: false,
        check2: false,
        dataShow: false,
        curUser: {},
        curDept: {},
        dataAJList: [
          {
            column_name: 'BARXM',
            column_description: '报案人姓名',
            is_contrast: false,
            abled_contrast: false,
            is_show: false,
            abled_show: true,
            is_search: false,
            abled_search: true
          }, {
            column_name: 'BARBM',
            column_description: '报案人别名',
            is_contrast: false,
            abled_contrast: false,
            is_show: false,
            abled_show: true,
            is_search: false,
            abled_search: true
          }, {
            column_name: 'BARXB_NAME',
            column_description: '报案人性别',
            is_contrast: false,
            abled_contrast: false,
            is_show: false,
            abled_show: true,
            is_search: false,
            abled_search: true
          }, {
            column_name: 'BARCSRQ',
            column_description: '报案人出生日期',
            is_contrast: false,
            abled_contrast: false,
            is_show: false,
            abled_show: true,
            is_search: false,
            abled_search: true
          }, {
            column_name: 'BARZJHM',
            column_description: '报案人证件号码',
            is_contrast: false,
            abled_contrast: false,
            is_show: false,
            abled_show: true,
            is_search: false,
            abled_search: true
          }, {
            column_name: 'BARDW',
            column_description: '报案人单位',
            is_contrast: false,
            abled_contrast: false,
            is_show: false,
            abled_show: true,
            is_search: false,
            abled_search: true
          }, {
            column_name: 'BARLXFS',
            column_description: '报案人联系方式',
            is_contrast: false,
            abled_contrast: false,
            is_show: false,
            abled_show: true,
            is_search: false,
            abled_search: true
          }, {
            column_name: 'BARHJSZDSSXQ_NAME',
            column_description: '报案人户籍所在地省市县区',
            is_contrast: false,
            abled_contrast: false,
            is_show: false,
            abled_show: true,
            is_search: false,
            abled_search: true
          }, {
            column_name: 'BARSJJZDSSXQ_NAME',
            column_description: '报案人实际居住地省市县区',
            is_contrast: false,
            abled_contrast: false,
            is_show: false,
            abled_show: true,
            is_search: false,
            abled_search: true
          }, {
            column_name: 'AJXZ_NAME',
            column_description: '案件性质',
            is_contrast: false,
            abled_contrast: false,
            is_show: false,
            abled_show: true,
            is_search: false,
            abled_search: true
          }, {
            column_name: 'AJSX_NAME',
            column_description: '案件属性',
            is_contrast: false,
            abled_contrast: false,
            is_show: false,
            abled_show: true,
            is_search: false,
            abled_search: true
          }, {
            column_name: 'BASJ',
            column_description: '报案时间',
            is_contrast: false,
            abled_contrast: false,
            is_show: false,
            abled_show: true,
            is_search: false,
            abled_search: true
          }, {
            column_name: 'SLDW_NAME',
            column_description: '受理单位',
            is_contrast: false,
            abled_contrast: false,
            is_show: false,
            abled_show: true,
            is_search: false,
            abled_search: true
          }, {
            column_name: 'SLSJ',
            column_description: '受理时间',
            is_contrast: false,
            abled_contrast: true,
            is_show: false,
            abled_show: true,
            is_search: false,
            abled_search: true
          }, {
            column_name: 'ZBDW_NAME',
            column_description: '主办单位',
            is_contrast: false,
            abled_contrast: false,
            is_show: false,
            abled_show: true,
            is_search: false,
            abled_search: true
          }, {
            column_name: 'YSDW_NAME',
            column_description: '移送单位',
            is_contrast: false,
            abled_contrast: false,
            is_show: false,
            abled_show: true,
            is_search: false,
            abled_search: true
          }, {
            column_name: 'YSSJ',
            column_description: '移送时间',
            is_contrast: false,
            abled_contrast: false,
            is_show: false,
            abled_show: true,
            is_search: false,
            abled_search: true
          }, {
            column_name: 'LADW_NAME',
            column_description: '立案单位',
            is_contrast: false,
            abled_contrast: false,
            is_show: false,
            abled_show: true,
            is_search: false,
            abled_search: true
          }, {
            column_name: 'LARQ',
            column_description: '立案日期',
            is_contrast: false,
            abled_contrast: true,
            is_show: false,
            abled_show: false,
            is_search: false,
            abled_search: false
          }, {
            column_name: 'PARQ',
            column_description: '破案日期',
            is_contrast: false,
            abled_contrast: false,
            is_show: false,
            abled_show: true,
            is_search: false,
            abled_search: true
          }, {
            column_name: 'PADW_NAME',
            column_description: '破案单位',
            is_contrast: false,
            abled_contrast: true,
            is_show: false,
            abled_show: true,
            is_search: false,
            abled_search: true
          }, {
            column_name: 'JARQ',
            column_description: '结案日期',
            is_contrast: false,
            abled_contrast: false,
            is_show: false,
            abled_show: true,
            is_search: false,
            abled_search: true
          }, {
            column_name: 'GDDW_NAME',
            column_description: '归档单位',
            is_contrast: false,
            abled_contrast: false,
            is_show: false,
            abled_show: true,
            is_search: false,
            abled_search: true
          }, {
            column_name: 'GDRQ',
            column_description: '归档日期',
            is_contrast: false,
            abled_contrast: false,
            is_show: false,
            abled_show: true,
            is_search: false,
            abled_search: true
          }, {
            column_name: 'GDSPDW_NAME',
            column_description: '归档审批单位',
            is_contrast: false,
            abled_contrast: false,
            is_show: false,
            abled_show: true,
            is_search: false,
            abled_search: true
          }, {
            column_name: 'SSZRQ_NAME',
            column_description: '所属责任区',
            is_contrast: false,
            abled_contrast: false,
            is_show: false,
            abled_show: true,
            is_search: false,
            abled_search: true
          }, {
            column_name: 'CZDW_NAME',
            column_description: '案件操作单位',
            is_contrast: false,
            abled_contrast: false,
            is_show: false,
            abled_show: true,
            is_search: false,
            abled_search: true
          }, {
            column_name: 'XZ_DCQKTBDW_NAME',
            column_description: '案件调查情况填表单位',
            is_contrast: false,
            abled_contrast: false,
            is_show: false,
            abled_show: true,
            is_search: false,
            abled_search: true
          }, {
            column_name: 'SAJZ',
            column_description: '涉案价值',
            is_contrast: false,
            abled_contrast: false,
            is_show: false,
            abled_show: true,
            is_search: false,
            abled_search: true
          }],
        dataXYRList: [
          {
            column_name: 'XYRBH',
            column_description: '嫌疑人编号',
            is_contrast: true,
            abled_contrast: false,
            is_show: true,
            abled_show: false,
            is_search: true,
            abled_search: false
          }, {
            column_name: 'XM',
            column_description: '嫌疑人姓名',
            is_contrast: true,
            abled_contrast: false,
            is_show: true,
            abled_show: false,
            is_search: true,
            abled_search: false
          }, {
            column_name: 'WHCD',
            column_description: '嫌疑人文化程度',
            is_contrast: false,
            abled_contrast: false,
            is_show: false,
            abled_show: true,
            is_search: false,
            abled_search: true
          }, {
            column_name: 'HYZK',
            column_description: '嫌疑人婚姻状况',
            is_contrast: false,
            abled_contrast: false,
            is_show: false,
            abled_show: true,
            is_search: false,
            abled_search: true
          }
        ],
        dataAJGLDWList: [
          {
            column_name: 'DWDH',
            column_description: '单位联系方式',
            is_contrast: false,
            abled_contrast: false,
            is_show: false,
            abled_show: true,
            is_search: false,
            abled_search: true
          }, {
            column_name: 'SWDJH',
            column_description: '单位税务登记号',
            is_contrast: false,
            abled_contrast: false,
            is_show: false,
            abled_show: true,
            is_search: false,
            abled_search: true
          }, {
            column_name: 'WFFZSS',
            column_description: '违法犯罪事实',
            is_contrast: false,
            abled_contrast: false,
            is_show: false,
            abled_show: true,
            is_search: false,
            abled_search: true
          }, {
            column_name: 'CFRQ',
            column_description: '处罚日期',
            is_contrast: false,
            abled_contrast: false,
            is_show: false,
            abled_show: true,
            is_search: false,
            abled_search: true
          }, {
            column_name: 'CFLX_NAME',
            column_description: '处罚类型',
            is_contrast: false,
            abled_contrast: false,
            is_show: false,
            abled_show: true,
            is_search: false,
            abled_search: true
          }, {
            column_name: 'CFQK',
            column_description: '处罚情况',
            is_contrast: false,
            abled_contrast: false,
            is_show: false,
            abled_show: true,
            is_search: false,
            abled_search: true
          }, {
            column_name: 'CFDW_NAME',
            column_description: '处罚单位',
            is_contrast: false,
            abled_contrast: false,
            is_show: false,
            abled_show: true,
            is_search: false,
            abled_search: true
          }, {
            column_name: 'BAR_NAME',
            column_description: '办案人',
            is_contrast: false,
            abled_contrast: false,
            is_show: false,
            abled_show: true,
            is_search: false,
            abled_search: true
          }, {
            column_name: 'WFZJ',
            column_description: '违法证据',
            is_contrast: false,
            abled_contrast: false,
            is_show: false,
            abled_show: true,
            is_search: false,
            abled_search: true
          }, {
            column_name: 'ZJZRR',
            column_description: '直接责任人',
            is_contrast: false,
            abled_contrast: false,
            is_show: false,
            abled_show: true,
            is_search: false,
            abled_search: true
          }, {
            column_name: 'ZGRY',
            column_description: '主管人员',
            is_contrast: false,
            abled_contrast: false,
            is_show: false,
            abled_show: true,
            is_search: false,
            abled_search: true
          }, {
            column_name: 'JYSM',
            column_description: '简要说明',
            is_contrast: false,
            abled_contrast: false,
            is_show: false,
            abled_show: true,
            is_search: false,
            abled_search: true
          }, {
            column_name: 'DJDW_NAME',
            column_description: '登记单位',
            is_contrast: false,
            abled_contrast: false,
            is_show: false,
            abled_show: true,
            is_search: false,
            abled_search: true
          }, {
            column_name: 'DJR_NAME',
            column_description: '登记人',
            is_contrast: false,
            abled_contrast: false,
            is_show: false,
            abled_show: true,
            is_search: false,
            abled_search: true
          }, {
            column_name: 'DJRQ',
            column_description: '登记日期',
            is_contrast: false,
            abled_contrast: false,
            is_show: false,
            abled_show: true,
            is_search: false,
            abled_search: true
          }, {
            column_name: 'CZDW_NAME',
            column_description: '操作单位',
            is_contrast: false,
            abled_contrast: false,
            is_show: false,
            abled_show: true,
            is_search: false,
            abled_search: true
          }, {
            column_name: 'CZR_NAME',
            column_description: '操作人',
            is_contrast: false,
            abled_contrast: false,
            is_show: false,
            abled_show: true,
            is_search: false,
            abled_search: true
          }, {
            column_name: 'CZSJ',
            column_description: '操作时间',
            is_contrast: false,
            abled_contrast: false,
            is_show: false,
            abled_show: true,
            is_search: false,
            abled_search: true
          }, {
            column_name: 'SJSSJE',
            column_description: '实际损失金额',
            is_contrast: false,
            abled_contrast: false,
            is_show: false,
            abled_show: true,
            is_search: false,
            abled_search: true
          }, {
            column_name: 'SAJE',
            column_description: '涉案金额',
            is_contrast: false,
            abled_contrast: false,
            is_show: false,
            abled_show: true,
            is_search: false,
            abled_search: true
          }, {
            column_name: 'WHSSJE',
            column_description: '挽回损失金额',
            is_contrast: false,
            abled_contrast: false,
            is_show: false,
            abled_show: true,
            is_search: false,
            abled_search: true
          }, {
            column_name: 'ZXFS_NAME',
            column_description: '执行方式',
            is_contrast: false,
            abled_contrast: false,
            is_show: false,
            abled_show: true,
            is_search: false,
            abled_search: true
          }
        ],
        dataQBXSList: [
          {
            column_name: 'GJC',
            column_description: '情报线索关键词',
            is_contrast: false,
            abled_contrast: true,
            is_show: false,
            abled_show: true,
            is_search: false,
            abled_search: true
          }, {
            column_name: 'XSPJ',
            column_description: '线索评级',
            is_contrast: false,
            abled_contrast: true,
            is_show: false,
            abled_show: true,
            is_search: false,
            abled_search: true
          }, {
            column_name: 'CJR_NAME',
            column_description: '情报线索采集人',
            is_contrast: false,
            abled_contrast: false,
            is_show: false,
            abled_show: true,
            is_search: false,
            abled_search: true
          }, {
            column_name: 'ASJFSDSSSS_NAME',
            column_description: '发生地所属省市',
            is_contrast: false,
            abled_contrast: false,
            is_show: false,
            abled_show: true,
            is_search: false,
            abled_search: true
          }
        ]
      }
    },
    methods: {
      renderContent(h, { node, data, store }) {
        return (
          <span class='custom-tree-node'>
            <span class='svgwrap'>
              <svg-icon icon-class={node.icon}></svg-icon>
            </span>
            <span>{node.label}</span>
          </span>)
      },
      handleNodeClick(data) {
        this.curNode = data.id
        this.dataShow = true
        this.check0 = false
        this.check1 = false
        this.check2 = false
        if (data.id === 1) {
          this.query('aj')
        } else if (data.id === 2) {
          this.query('xyr')
        } else if (data.id === 3) {
          this.query('ajgldw')
        } else if (data.id === 4) {
          this.query('qbxs')
        }
      },
      handelCheck0(val) {
        if (val) {
          this.dataList.forEach(element => {
            if (element.abled_contrast) {
              element.is_contrast = true
            }
          })
        } else {
          this.dataList.forEach(element => {
            if (element.abled_contrast) {
              element.is_contrast = false
            }
          })
        }
      },
      handelCheck1(val) {
        if (val) {
          this.dataList.forEach(element => {
            if (element.abled_show) {
              element.is_show = true
            }
          })
        } else {
          this.dataList.forEach(element => {
            if (element.abled_show) {
              element.is_show = false
            }
          })
        }
      },
      handelCheck2(val) {
        if (val) {
          this.dataList.forEach(element => {
            if (element.abled_search) {
              element.is_search = true
            }
          })
        } else {
          this.dataList.forEach(element => {
            if (element.abled_search) {
              element.is_search = false
            }
          })
        }
      },
      getLabel() {

      },
      query(menuType) {
        this.loading = true
        // this.dataList = this.dataAJList
        const para = {
          type: '1',
          userid: this.curUser.id,
          condition: menuType
        }
        this.$query('config', para).then((response) => {
          this.dataList = []
          this.loading = false
          // 未配置 前端页面写默认数据
          if (response.data[0].config === 0) {
            this.configFlag = 0
            if (menuType === 'aj') {
              this.dataList = this.dataAJList
            } else if (menuType === 'xyr') {
              this.dataList = this.dataXYRList
            } else if (menuType === 'ajgldw') {
              this.dataList = this.dataAJGLDWList
            } else if (menuType === 'qbxs') {
              this.dataList = this.dataQBXSList
            }
          } else {
            // 已配置
            this.configFlag = 1
            this.dataList = response.data
            // if (response.data[0].business_type === '1') { // 案件

            // }
          }
        }).catch(() => {
          this.loading = false
        })
      },
      submit() {
        this.loading = true
        if (this.curNode !== 1 && this.curNode !== 2 && this.curNode !== 3 && this.curNode !== 4) {
          this.$message.error('请选择资源类型')
          return false
        }
        const param = {
          condition: this.curNode, // 1 2 3 4
          user_id: this.curUser.id,
          dept_id: this.curDept.id,
          config: this.configFlag,
          configlist: this.dataList
        }
        this.$update('saveconfig/save', param).then(response => {
          this.loading = false
          if (response.data === 'ok') {
            this.$router.push('/comanalysis/perserch')
          }
        }).catch(() => {
          this.loading = false
        })
      },
      getSelectLabel(array, val) {
        for (let i = 0; i < array.length; i++) {
          if (array[i].value === val) {
            return array[i].label
          }
        }
        return ''
      },
      toback() {
        this.$router.back(-1)
      }
    },
    mounted() {
      this.curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
      this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
    }
  }
</script>

<style>
.personalSetting .clearfix::after {
	clear: both;
	display: block;
	content: '';
}
.personalSetting .all_check_wrap .el-checkbox {
	float: right;
}
.personalSetting .el-checkbox {
	margin-left: 30px;
}
.personalSetting .submit_btn {
	padding: 5px 20px;
}
.personalSetting .svgwrap {
	margin-right: 10px;
}
.goBacks {
  float: right;
  margin: 0 53px 6px 0;
  cursor: pointer;
}
</style>
