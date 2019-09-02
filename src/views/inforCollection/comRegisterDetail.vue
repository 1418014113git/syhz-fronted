<template>
  <section class="comDetail">
    <!-- 公司信息详情 -->
    <el-row>
      <el-col class="clearfix">
        <!-- <el-button style="float: right;margin-bottom:10px;" type="primary" @click="back()">返 回</el-button> -->
        <!--返回-->
        <img src="@/assets/icon/back.png"  class="goBack" @click="back">
      </el-col>
    </el-row>
    <el-collapse v-model="activeNames" @change="handleCollapseChange">
      <el-collapse-item title="企业信息" name="1">
        <el-tabs v-model="tabActiveName" @tab-click="handleTabClick">
          <el-tab-pane label="基本信息" name="first">
            <el-form :model="filters" size="small" label-width="100px" label-position="left" v-loading="formLoading">
              <el-row>
                <el-col :span="6">
                  <el-form-item label="单位名称：">
                    {{curComInfo.companyName}}
                  </el-form-item>
                  <el-form-item label="法人代表名称：" label-width="124px">
                    {{curComInfo.legalPerson}}
                  </el-form-item>
                  <el-form-item label="营业期限自：" label-width="108px">
                    {{curComInfo.startBusinessDate}}
                  </el-form-item>
                  <el-form-item label="治安负责人：" label-width="110px">
                    {{curComInfo.policePerson}}
                  </el-form-item>
                  <el-form-item label="管理级别：">
                    {{curComInfo.managerGradeName}}
                  </el-form-item>
                  <el-form-item label="主管部门：">
                    {{curComInfo.registerNumber}}
                  </el-form-item>
                  <el-form-item label="成立日期：">
                    <!-- 数据库暂时没有这个字段 -->
                    <!-- {{}} -->
                  </el-form-item>
                  <el-form-item label="联络员联系电话：" label-width="140px">
                    <!-- {{}} -->
                  </el-form-item>
                </el-col>
                <el-col :span="6" class="xddw">
                  <el-form-item label="统一信用代码：" label-width="124px">
                    {{curComInfo.unicode}}
                  </el-form-item>
                  <el-form-item label="身份证号码：" label-width="110px">
                    <span v-if="curComInfo.legalPersonCard" class="zjhm" @click="showTipsC(curComInfo.legalPersonCard)">{{curComInfo.legalPersonCard}}</span>
                    <!-- <el-button style="margin-left:10px;" type="success" @click="toMesh()">挖掘</el-button> -->
                    <card-com v-if="showCardCom" class="cardcom" :cardId="curCardId" @close="clickBlank"></card-com>
                  </el-form-item>
                  <el-form-item label="营业期限至：" label-width="110px">
                    {{curComInfo.endBusinessDate}}
                  </el-form-item>
                  <el-form-item label="治安负责人联系方式：" label-width="172px">
                    {{curComInfo.policePersonPhone}}
                  </el-form-item>
                  <el-form-item label="消防等级：">
                    {{curComInfo.fireGradeName}}
                  </el-form-item>
                  <el-form-item label="经济类型：">
                    <!-- {{curComInfo.}} -->
                  </el-form-item>
                  <el-form-item label="注册资本：">
                    （万元人民币）
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="行政区划：">
                    {{curComInfo.area}}
                  </el-form-item>
                  <el-form-item label="联系电话：">
                    {{curComInfo.legalPersonPhone}}
                  </el-form-item>
                  <el-form-item label="登记状态：">
                    {{curComInfo.registerStatus}}
                  </el-form-item>
                  <el-form-item label="单位性质：">
                    {{curComInfo.economicTypeName}}
                  </el-form-item>
                  <el-form-item label="管理部门：">
                    {{curComInfo.managerDeptName}}
                  </el-form-item>
                  <el-form-item label="主管单位：">
                    {{curComInfo.keyDeptName}}
                  </el-form-item>
                  <el-form-item label="行业分类：">
                    {{curComInfo.companyTypeName}}
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="注册地址：">
                    {{curComInfo.registerAddress}}
                  </el-form-item>
                  <el-form-item label="单位状态：">
                    {{curComInfo.companyStatus}}
                  </el-form-item>
                  <el-form-item label="单位电话：">
                    {{curComInfo.companyTel}}
                  </el-form-item>
                  <el-form-item label="单位类型：">
                    {{curComInfo.companyStyleName}}
                  </el-form-item>
                  <el-form-item label="重点等级：">
                    {{curComInfo.keyRegisterName}}
                  </el-form-item>
                  <el-form-item label="员工人数：">
                    {{curComInfo.personNumber}} 人
                  </el-form-item>
                  <el-form-item label="联络员名称：" label-width="110px">
                    <!-- {{curComInfo.createName}} -->
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="经营范围：">
                    {{curComInfo.manageScope}}
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="关联案件" name="second">
            <InvolvedCase :bh="jgbh" @listenCase="listenToChildCase"></InvolvedCase>
          </el-tab-pane>
          <el-tab-pane label="从业人员" name="third">
            <company-person :bh="jgbh" @listenPer="listenToChildPer"></company-person>
          </el-tab-pane>
        </el-tabs>
      </el-collapse-item>
      <el-collapse-item title="明细信息" name="2">
        <el-row v-loading="detailLoading">
          <el-col :span="5">
            <el-tree :data="comTypeData" :props="defaultProps" @node-click="handleNodeClick" default-expand-all class="comTree"></el-tree>
          </el-col>
          <el-col :span="19">
            <el-table :data="pageResult" v-if='isShowTable' v-loading="tableLoading" style="width:100%;" class="statisticCollect">
              <el-table-column type="index" label="序号" width="60"></el-table-column>
                <el-table-column v-for="(column,indexs) in tableColumnsCur" :key="indexs" v-if="column.prop==='purchasers'" header-align="center" align="center"
                  :prop="column.prop" :label="column.label" :width="column.width" :min-width="column.minWidth"
                  :fixed="column.fixed" :type="column.type" :formatter="column.formatter">
                  <template slot-scope="scope">
                    <div v-html="scope.row.purchasers"></div>
                  </template>
                </el-table-column>
                <el-table-column v-else-if="column.prop==='purchasePhone'" header-align="center" align="center"
                  :prop="column.prop" :label="column.label" :width="column.width" :min-width="column.minWidth"
                  :fixed="column.fixed" :type="column.type" :formatter="column.formatter">
                  <template slot-scope="scope">
                    <div v-html="scope.row.purchasePhone"></div>
                  </template>
                </el-table-column>
                <el-table-column v-else header-align="center" align="center"
                  :prop="column.prop" :label="column.label" :width="column.width" :min-width="column.minWidth"
                  :fixed="column.fixed" :type="column.type" :formatter="column.formatter">
                </el-table-column>
              <!-- <el-table-column v-for="column in tableColumnsCur" header-align="center" align="center"
                :prop="column.prop" :label="column.label" :width="column.width" :min-width="column.minWidth"
                :fixed="column.fixed" :key="column.prop" :type="column.type" :formatter="column.formatter">
              </el-table-column> -->
            </el-table>
            <!--分页栏-->
            <el-col :span="24" class="toolbar">
              <el-pagination v-if="total > 0" layout="prev, pager, next" @current-change="handleCurrentChange"
                            :page-size="pageSize" :total="total" :current-page="page" style="float:right;">
              </el-pagination>
            </el-col>
          </el-col>
        </el-row>
      </el-collapse-item>
    </el-collapse>
  </section>
</template>

<script>
import { getComArchivesApproveStatus } from '@/utils/codetotext'
import importexport from '@/api/importexport'
import Http from '@/api/http'
import InvolvedCase from './components/InvolvedCase'
import CompanyPerson from './components/CompanyPerson'
import cardCom from '@/components/idCardTips' // 身份证号码点击弹出菜单功能
export default {
  name: 'index',
  components: {
    InvolvedCase,
    CompanyPerson,
    cardCom
  },
  data() {
    return {
      activeNames: ['1', '2'],
      tabActiveName: 'first',
      jgbh: '',
      downLoadUrl: importexport.downloadFileUrl, // nginx配置的文件下载
      ModuleName: Http.ModuleName,
      pedlarList: [], // 列表数据
      filters: {
        name: '', // 名称
        personName: '', // 法人姓名
        cardNumber: '', // 身份证
        phone: '', // 联系电话
        address: '' // 地址
      },
      curComInfo: {}, // 跳转携带的参数
      total: 0,
      page: 1,
      pageSize: 10,
      formLoading: false, // 主题信息查询loading
      tableLoading: false, // 明细表loading
      dialogImportVisible: false, // 导入弹框
      enterprise_nature: [],
      importInfo: {}, // 导入表单
      innerErrorInfoVisible: false, // 导入错误信息提示框
      errorData: [], // 导入错误信息提示
      importLoading: false, // 导入loading
      fileCon: '', // 上传的文件
      userInfo: {}, // 当前登录用户信息
      dept: {}, // 当前登录用户部门信息
      param: {}, // 携带的参数
      curTypeValue: '', // 当前点击树的value
      pageResult: [],
      tableColumnsCur: [], // 当前选中的列表项
      isShowTable: false, // 是否显示table
      detailLoading: false, // 明细信息页面加载loading
      tableColumnsEnvironment: [ // 自然保护区信息
        { prop: 'protectZoneNo', label: '保护区编号', minWidth: 100 },
        { prop: 'name', label: '名称', minWidth: 100 },
        { prop: 'grade', label: '级别', minWidth: 100 },
        { prop: 'environmentType', label: '类型', minWidth: 100 },
        { prop: 'n', label: '经度', minWidth: 100 },
        { prop: 'e', label: '维度', minWidth: 100 },
        { prop: 'area', label: '行政区域', minWidth: 100 },
        { prop: 'protectObject', label: '保护对象', minWidth: 100 },
        { prop: 'proportionG', label: '总面积（公顷）', minWidth: 140 },
        { prop: 'proportionW', label: '总面积（万亩）', minWidth: 140 }
      ],
      tableColumnsCateringIndustry: [ // 餐饮服务企业
        { prop: 'purchasers', label: '采购人以及联系方式', width: 200 }, // 以json存储
        { prop: 'cateringIndustryType', label: '类型', minWidth: 100 }, // 特大型餐馆、大型餐馆、中型餐馆、小型餐馆、快餐店、小吃店、其它
        { prop: 'createName', label: '创建人', minWidth: 100 },
        { prop: 'createDept', label: '填报部门', minWidth: 100 },
        { prop: 'createDate', label: '创建时间', minWidth: 100 }
      ],
      tableColumnsFoodMachining: [ // 食品生产、加工企业
        { prop: 'machiningSegment', label: '所处环节', minWidth: 100 }, // 生产、销售、加工、运输、仓储环节（不含养殖环节）、其它
        { prop: 'repertoryAddress', label: '仓库地址', minWidth: 100 },
        { prop: 'foodType', label: '风险种类', minWidth: 100 },
        { prop: 'createName', label: '创建人', minWidth: 100 },
        { prop: 'createDept', label: '填报部门', minWidth: 100 },
        { prop: 'createDate', label: '创建时间', minWidth: 100 }
      ],
      tableColumnsAlcoholicProduce: [ // 酒类企业
        { prop: 'machiningSegment', label: '所处环节', minWidth: 100 }, //  生产、加工、运输、仓储、其它
        { prop: 'createName', label: '创建人', minWidth: 100 },
        { prop: 'createDept', label: '填报部门', minWidth: 100 },
        { prop: 'createDate', label: '创建时间', minWidth: 100 }
      ],
      tableColumnsFoodCurrency: [ // 食品流通企业
        { prop: 'conferDate', label: '发证日期', minWidth: 100 },
        { prop: 'conferDept', label: '发证单位', minWidth: 100 },
        { prop: 'grade', label: '风险等级', minWidth: 100 }, //  高 中 低
        { prop: 'createName', label: '创建人', minWidth: 100 },
        { prop: 'createDept', label: '填报部门', minWidth: 100 },
        { prop: 'createDate', label: '创建时间', minWidth: 100 }
      ],
      tableColumnsFoodWholesale: [ // 蔬果、肉类批发市场
        { prop: 'workType', label: '经营方式', minWidth: 100 },
        { prop: 'stallNumber', label: '摊位数量', minWidth: 100 },
        { prop: 'proportion', label: '占用面积', minWidth: 100 },
        { prop: 'createName', label: '创建人', minWidth: 100 },
        { prop: 'createDept', label: '填报部门', minWidth: 100 },
        { prop: 'createDate', label: '创建时间', minWidth: 100 }
      ],
      tableColumnsDrugProduce: [ // 药品生产企业（连锁总部）
        { prop: 'purchasers', label: '采购人以及联系方式', width: 200 }, // 以json存储
        { prop: 'way', label: '进货渠道', minWidth: 100 },
        { prop: 'createName', label: '创建人', minWidth: 100 },
        { prop: 'createDept', label: '填报部门', minWidth: 100 },
        { prop: 'createDate', label: '创建时间', minWidth: 100 }
      ],
      tableColumnsDrugWholesale: [ // 药品批发经营企业
        { prop: 'property', label: '性质', minWidth: 140 },
        { prop: 'repertoryAddress', label: '仓库地址', minWidth: 100 },
        { prop: 'productType', label: '产品种类', minWidth: 100 },
        { prop: 'purchasers', label: '采购人以及联系方式', width: 200 }, // 以json存储
        { prop: 'sellWay', label: '主要销售去向', minWidth: 100 },
        { prop: 'createName', label: '创建人', minWidth: 100 },
        { prop: 'createDept', label: '填报部门', minWidth: 100 },
        { prop: 'createDate', label: '创建时间', minWidth: 160 }
      ],
      tableColumnsDrugStore: [ // 药店（连锁药店）
        { prop: 'property', label: '性质', minWidth: 120 },
        { prop: 'productType', label: '产品种类', minWidth: 100 }, // 中药、西药、中成药、护肤品、其它等
        { prop: 'purchasers', label: '销售人员以及联系方式', width: 200 }, // 以json存储
        { prop: 'sellWay', label: '主要销售去向', minWidth: 100 },
        { prop: 'createName', label: '创建人', minWidth: 100 },
        { prop: 'createDept', label: '填报部门', minWidth: 100 },
        { prop: 'createDate', label: '创建时间', minWidth: 170 }
      ],
      tableColumnsDrugHealth: [ // 保健品化妆品企业
        { prop: 'property', label: '性质', minWidth: 100 },
        { prop: 'personInfo', label: '执业人员基本情况', minWidth: 100 },
        { prop: 'purchasers', label: '销售人员以及联系方式', width: 200 }, // 以json存储
        { prop: 'sellWay', label: '主要销售去向', minWidth: 100 },
        { prop: 'createName', label: '创建人', minWidth: 100 },
        { prop: 'createDept', label: '填报部门', minWidth: 100 },
        { prop: 'createDate', label: '创建时间', minWidth: 160 }
      ],
      tableColumnsDrugApparatus: [ // 医疗器械专营企业
        { prop: 'empowerNo', label: '许可文件编号', minWidth: 140 },
        { prop: 'name', label: '许可文件名称', minWidth: 140 },
        { prop: 'validStartDate', label: '有效日期起', minWidth: 160 },
        { prop: 'validStartEnd', label: '有效日期至', minWidth: 160 },
        { prop: 'empowerDept', label: '许可机关', minWidth: 100 },
        { prop: 'empowerInfo', label: '许可内容', minWidth: 100 },
        { prop: 'status', label: '状态', minWidth: 100 }, //  有效、无效
        { prop: 'createName', label: '创建人', minWidth: 100 },
        { prop: 'createDept', label: '填报部门', minWidth: 100 },
        { prop: 'createDate', label: '创建时间', minWidth: 160 }
      ],
      tableColumnsHusbandryMeat: [ // 肉制品屠宰、加工企业（点）
        { prop: 'workProject', label: '经营项目', minWidth: 100 },
        { prop: 'machiningSegment', label: '所处环节', minWidth: 100 }, // 生产、加工、运输、仓储、其它
        { prop: 'createName', label: '创建人', minWidth: 100 },
        { prop: 'createDept', label: '填报部门', minWidth: 100 },
        { prop: 'createDate', label: '创建时间', minWidth: 160 }
      ],
      tableColumnsHusbandryCulture: [ // 养殖企业
        { prop: 'cultureType', label: '养殖类型', minWidth: 100 }, // 食用动物（牲畜、家禽、鱼类、其它食用动物）、特种养殖（狐狸、貂、貉、其它特种养殖）
        { prop: 'way', label: '销售去向', minWidth: 100 },
        { prop: 'cultureSize', label: '养殖规模', minWidth: 100 }, // 小、中、大
        { prop: 'createName', label: '创建人', minWidth: 100 },
        { prop: 'createDept', label: '填报部门', minWidth: 100 },
        { prop: 'createDate', label: '创建时间', minWidth: 160 }
      ],
      tableColumnsMedicalClinic: [ // 诊所
        { prop: 'property', label: '性质', minWidth: 100 },
        { prop: 'clinicRange', label: '主治范围', minWidth: 100 }, // 内科 外科  内外结合、其它
        { prop: 'purchaseWay', label: '采购方式', minWidth: 100 },
        { prop: 'rubbishWay', label: '医疗垃圾去向', minWidth: 100 },
        { prop: 'createName', label: '创建人', minWidth: 100 },
        { prop: 'createDept', label: '填报部门', minWidth: 100 },
        { prop: 'createDate', label: '创建时间', minWidth: 160 }
      ],
      tableColumnsMedicalOrganization: [ // 医疗机构
        { prop: 'medicalNo', label: '医疗卫生机构类别代码', minWidth: 100 },
        { prop: 'medicalName', label: '医疗机构类别代码名称', minWidth: 100 },
        { prop: 'property', label: '性质', minWidth: 100 },
        { prop: 'grade', label: '等级', minWidth: 100 }, // 三级，每级分甲、乙、丙三等，最高为三级甲等，最低为一级丙等
        { prop: 'scope', label: '主治范围', minWidth: 100 },
        { prop: 'purchaseWay', label: '采购渠道', minWidth: 100 },
        { prop: 'purchasePhone', label: '采购人员情况', width: 200 },
        { prop: 'rubbishWay', label: '医疗垃圾去向', minWidth: 120 },
        { prop: 'selfMedicalType', label: '自产药物种类', minWidth: 120 },
        { prop: 'organizationManagerNo', label: '机构分类管理代码', minWidth: 100 },
        { prop: 'isChild', label: '是否分支机构', minWidth: 120 },
        { prop: 'perentChildNo', label: '隶属关系代码', minWidth: 120 },
        { prop: 'perentChildNoName', label: '隶属关系代码名称', minWidth: 100 },
        { prop: 'createName', label: '创建人', minWidth: 100 },
        { prop: 'createDept', label: '填报部门', minWidth: 100 },
        { prop: 'createDate', label: '创建时间', minWidth: 160 }
      ],
      tableColumnsOtherPersonal: [ // 个体物流寄递企业
        { prop: 'number', label: '营业网点数量', minWidth: 100 },
        { prop: 'createName', label: '创建人', minWidth: 100 },
        { prop: 'createDept', label: '填报部门', minWidth: 100 },
        { prop: 'createDate', label: '创建时间', minWidth: 100 }
      ],
      comTypeData: [
        {
          value: '1000',
          label: '环境类',
          children: [{
            value: '01',
            label: '自然保护区信息'
          }]
        }, {
          value: '2000',
          label: '食品类',
          children: [{
            value: '02',
            label: '餐饮服务企业'
          }, {
            value: '03',
            label: '食品生产、加工企业'
          }, {
            value: '04',
            label: '酒类企业'
          }, {
            value: '05',
            label: '食品流通企业'
          }, {
            value: '06',
            label: '蔬果、肉类批发市场'
          }]
        }, {
          value: '3000',
          label: '药品保健类',
          children: [{
            value: '07',
            label: '药品生产企业（连锁总部）'
          }, {
            value: '08',
            label: '药品批发经营企业'
          }, {
            value: '09',
            label: '药店（连锁药店）'
          }, {
            value: '10',
            label: '保健品化妆品企业'
          }, {
            value: '11',
            label: '医疗器械专营企业'
          }]
        }, {
          value: '4000',
          label: '农牧业类',
          children: [{
            value: '12',
            label: '肉制品屠宰、加工企业（点）'
          }, {
            value: '13',
            label: '养殖企业'
          }]
        }, {
          value: '5000',
          label: '医疗服务类',
          children: [{
            value: '14',
            label: '诊所'
          }, {
            value: '15',
            label: '医疗机构'
          }]
        }, {
          value: '6000',
          label: '其他类',
          children: [{
            value: '16',
            label: '个体物流寄递企业'
          }]
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      curCardId: '', // 当前被点击的身份证号
      showCardCom: false // 身份证查询旁的快捷查询组件是否显示
    }
  },
  methods: {
    queryDetail(id) {
      this.formLoading = true
      this.detailLoading = true
      this.$query('companyDetail/company/' + id, {}).then((response) => {
        this.formLoading = false
        this.curComInfo = response.data
        if (response.data.count) {
          var countArr = []
          for (var index in response.data.count) {
            if (response.data.count[index] > 0) {
              countArr.push(index)
            }
          }
          for (let w = 0; w < countArr.length; w++) {
            const countItem = countArr[w]
            for (let m = 0; m < this.comTypeData.length; m++) {
              const element = this.comTypeData[m]
              for (let n = 0; n < element.children.length; n++) {
                if (countItem === element.children[n].value) {
                  const childItem = element.children[n]
                  childItem.label = childItem.label + '（' + response.data.count[countItem] + '）'
                }
              }
            }
          }
          this.handleNodeClick(this.comTypeData[0].children[0])
        }
      }).catch(() => {
        this.formLoading = false
      })
    },
    handleCollapseChange(val) {
      // console.log(val)
    },
    handleTabClick(tab, event) {
      // console.log(tab, event)
    },
    back() {
      if (this.param.type === 'personalized') { // 跳转到个性化查询
        this.$router.push({ path: '/comanalysis/perserch' })
      } else if (this.param.type === 'ajDetail') { // 跳转到案件档案
        // this.$router.push({ path: '/caseManage/detailSyh/' + this.param.ajId })
        this.$router.push({
          path: '/caseFile/index', query: { id: this.param.ajId }
        })
      } else if (this.param.type === 'perArchive') { // 跳转到人员档案
        // this.$router.push({ path: '/personnelFile/index' + this.param.ajId })
        // this.$gotoid('/personnelFile/index', JSON.stringify({ idCard: this.cardId }))
        this.$router.push({
          path: '/personnelFile/index', // 升级版人员档案
          query: { cardId: this.cardId }
        })
      } else {
        this.$router.push({ path: '/inforCollection/comRegisterArchives' })
      }
    },
    formatStatus(status) {
      return getComArchivesApproveStatus(status + '')
    },
    toMesh() { // 根据身份证号跳转挖掘
      this.$router.push({
        path: '/mesh', query: { type: 1, bm: this.cardId }
      })
    },
    handleNodeClick(data) {
      this.curTypeValue = data.value
      switch (data.value) {
        case '01':
          this.tableColumnsCur = this.tableColumnsEnvironment // 自然保护区信息
          break
        case '02':
          this.tableColumnsCur = this.tableColumnsCateringIndustry // 餐饮服务企业
          break
        case '03':
          this.tableColumnsCur = this.tableColumnsFoodMachining // 食品生产、加工企业
          break
        case '04':
          this.tableColumnsCur = this.tableColumnsAlcoholicProduce // 酒类企业
          break
        case '05':
          this.tableColumnsCur = this.tableColumnsFoodCurrency // 食品流通企业
          break
        case '06':
          this.tableColumnsCur = this.tableColumnsFoodWholesale // 蔬果、肉类批发市场
          break
        case '07':
          this.tableColumnsCur = this.tableColumnsDrugProduce // 药品生产企业（连锁总部）
          break
        case '08':
          this.tableColumnsCur = this.tableColumnsDrugWholesale // 药品批发经营企业
          break
        case '09':
          this.tableColumnsCur = this.tableColumnsDrugStore // 药店（连锁药店）
          break
        case '10':
          this.tableColumnsCur = this.tableColumnsDrugHealth // 保健品化妆品企业
          break
        case '11':
          this.tableColumnsCur = this.tableColumnsDrugApparatus // 医疗器械专营企业
          break
        case '12':
          this.tableColumnsCur = this.tableColumnsHusbandryMeat // 肉制品屠宰、加工企业（点）
          break
        case '13':
          this.tableColumnsCur = this.tableColumnsHusbandryCulture // 养殖企业
          break
        case '14':
          this.tableColumnsCur = this.tableColumnsMedicalClinic // 诊所
          break
        case '15':
          this.tableColumnsCur = this.tableColumnsMedicalOrganization // 医疗机构
          break
        case '16':
          this.tableColumnsCur = this.tableColumnsOtherPersonal // 个体物流寄递企业
          break
        default:
          break
      }
      if (data.value !== '1000' && data.value !== '2000' && data.value !== '3000' && data.value !== '4000' && data.value !== '5000' && data.value !== '6000') {
        this.queryParticularsByType(true)
      }
    },
    queryParticularsByType(flag) {
      this.tableLoading = true
      this.page = flag ? 1 : this.page
      var param = {
        pageNum: this.page,
        pageSize: this.pageSize,
        companyId: this.curComInfo.companyId
      }
      this.$query('companyArchives/' + this.curTypeValue, param).then((response) => {
        this.tableLoading = false
        this.detailLoading = false
        this.isShowTable = true
        this.pageResult = response.data.list
        this.total = response.data.totalCount
        this.tableDataDealwith()
      }).catch(() => {
        this.formLoading = false
        this.tableLoading = false
        this.detailLoading = false
      })
    },
    tableDataDealwith() {
      for (var i = 0; i < this.pageResult.length; i++) {
        if (this.pageResult[i].purchasers) {
          var t = ''
          var purchasers = JSON.parse(this.pageResult[i].purchasers)
          for (var j = 0; j < purchasers.length; j++) {
            t += `<p>${purchasers[j].name + ':' + purchasers[j].phone}</p>`
          }
          this.pageResult[i].purchasers = t
        }
        if (this.pageResult[i].purchasePhone) {
          var t1 = ''
          var purchasePhone = JSON.parse(this.pageResult[i].purchasePhone)
          for (var j1 = 0; j1 < purchasePhone.length; j1++) {
            t1 += `<p>${purchasePhone[j1].name + ':' + purchasePhone[j1].phone}</p>`
          }
          this.pageResult[i].purchasePhone = t1
        }
      }
    },
    handleCurrentChange(val) {
      this.page = val
      this.queryParticularsByType(false)
    },
    handleCurrentChangeGLAJ(val) {
      // this.page = val
      // this.query(false)
    },
    listenToChildCase(evtValue) {
      this.$emit('listen2', '0')
    },
    listenToChildPer(evtValue) {
      this.$emit('listen3', '0')
    },
    showTipsC(val) {
      this.curCardId = val
      this.showCardCom = true
    },
    clickBlank() {
      this.showCardCom = false
    }
  },
  mounted() {
    // this.userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
    // this.dept = JSON.parse(sessionStorage.getItem('depToken'))[0]
    // this.param = JSON.parse(sessionStorage.getItem(this.$route.path))
    // if (this.param.type && this.param.type === 'personalized') { // 个性化查询过来的
    //   this.queryDetail(this.param.id)
    // } else if (this.param.type && this.param.type === 'ajDetail') { // 案件档案过来的
    //   this.queryDetail(this.param.id)
    // } else {
    //   this.curComInfo = JSON.parse(sessionStorage.getItem(this.$route.path))// 批次列表页传递过来的参数
    // }
  },
  activated: function() { // 因为查询页被缓存，所以此页面需要此生命周期下才能刷新数据
    this.curComInfo = {}
    this.pageResult = []
    this.tableColumnsCur = []
    this.userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
    this.dept = JSON.parse(sessionStorage.getItem('depToken'))[0]
    this.param = JSON.parse(sessionStorage.getItem(this.$route.path))
    if (this.param.type && this.param.type === 'personalized') { // 个性化查询过来的
      this.queryDetail(this.param.id)
    } else if (this.param.type && this.param.type === 'ajDetail') { // 案件档案过来的
      this.queryDetail(this.param.id)
    } else if (this.param.type && this.param.type === 'perArchive') { // 人员档案过来的
      this.queryDetail(this.param.id)
    } else {
      this.curComInfo = JSON.parse(sessionStorage.getItem(this.$route.path))// 批次列表页传递过来的参数
    }
  }
}
</script>

<style>
p > span {
  display: inline-block;
  height: 30px;
  line-height: 30px;
  margin-right: 20px;
}
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.comDialog .el-dialog__body {
  padding: 10px 20px 10px 20px;
}
.el-table--scrollable-x .el-table__body-wrapper {
  overflow-x: auto;
}
.comTree .is-current {
  background: #005892;
}
.comDetail .el-collapse-item__content {
  padding: 0 0 25px 0;
}
.comDetail .el-tabs {
  border: none;
  background: none;
  padding: 0 20px;
}
.cardcom{
  position: absolute;
  top: -25px;
  left:50%;
}
.zjhm {
  cursor: pointer;
}
.zjhm:hover {
  color: #3da1ff;
}
@media only screen and (max-width: 1366px) {
  .cardcom {
    left:84%;
  }
}
</style>
