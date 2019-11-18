<template>
  <section class="personalSearch">
    <!--工具条-->

    <!--返回-->
    <el-form :inline="true"
             :model="filters"
             size="mini"
             @submit.native.prevent>
      <el-row type="flex"
              justify="center">
        <el-form-item class="wordinput">
          <el-input placeholder="输入关键字搜索"
                    v-model.trim="filters.word"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     size="small"
                     v-on:click="searchs"
                     style="font-size:14px;height:30px;">搜应用</el-button>
        </el-form-item>
      </el-row>
    </el-form>
    <el-table :data="list"
              v-loading="listLoading"
              style="width: 80%;margin:0 auto;">
      <el-table-column prop="name"
                       label="应用名称"
                       min-width="20%"></el-table-column>
      <el-table-column prop="mk"
                       label="所属模块"
                       min-width="20%"></el-table-column>
      <el-table-column prop="info"
                       label="应用信息"
                       min-width="30%"></el-table-column>

      <!-- <el-table-column prop="views" label="阅读数" sortable min-width="4%"></el-table-column> -->
      <el-table-column label="操作"
                       width="100">
        <template slot-scope="scope">
          <el-button type="primary"
                     @click="handleEdit(scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--工具条-->
    <el-col :span="24"
            class="toolbar">
      <el-pagination v-if="total > 0"
                     layout="total, sizes, prev, pager, next, jumper"
                     @current-change="handleCurrentChange"
                     :page-sizes="[15,30,50,100]"
                     @size-change="handleSizeChange"
                     :page-size="pageSize"
                     :current-page="page"
                     :total="total"
                     style="width: 50%;margin:0 auto;">
      </el-pagination>
    </el-col>
  </section>
</template>

<script>
export default {
  data() {
    return {
      filters: {
        word: ''
      },
      total: 0,
      page: 1,
      pageSize: 15,
      list: [],
      lists: [],
      oldlist: [],
      listLoading: false
    }
  },
  methods: {
    searchs() {
      this.list = []
      var serchlist = this.lists
      for (var i = 0; i < serchlist.length; i++) {
        if (this.filters.word === '') {
          this.list = this.lists
        } else if (serchlist[i].name.indexOf(this.filters.word) !== -1) {
          this.list.push(serchlist[i])
        }
      }
      this.total = this.list.length
      this.oldlist = this.list
      this.query()
    },
    handleEdit(row) {
      this.$router.push({ path: row.url })
    },
    handleSizeChange(val) {
      this.page = 1
      this.pageSize = val
      this.query()
    },
    handleCurrentChange(currentPage) {
      this.page = currentPage
      this.query()
    },
    query() {
      this.list = this.oldlist
      var newlist = []
      if (this.total !== 0) {
        for (var i = (this.page - 1) * this.pageSize; i < this.pageSize * this.page; i++) {
          if (this.list[i]) {
            newlist.push(this.list[i])
          }
        }
      }
      this.list = newlist
    }
  },

  mounted() {
    this.lists = [
      {
        'name': '案件协查',
        'mk': '案件管理',
        'url': '/caseAssist/list',
        'info': '用于案件协查'
      },
      {
        'name': '案件管理',
        'mk': '案件管理',
        'url': '/caseManage',
        'info': '用于案件管理'
      },
      {
        'name': '全国性协查',
        'mk': '案件管理',
        'url': '/caseManage/investigation',
        'info': '用于全国性协查'
      },
      {
        'name': '案件认领',
        'mk': '案件管理',
        'url': '/caseManage/ajrl',
        'info': '用于案件认领'
      },
      {
        'name': '专项任务列表',
        'mk': '专项任务',
        'url': '/specialTasks',
        'info': '用于专项任务列表'
      },
      {
        'name': '添加专项任务',
        'mk': '专项任务',
        'url': '/specialTasks/add',
        'info': '用于添加专项任务'
      },
      {
        'name': '企业列表',
        'mk': '信息核查',
        'url': '/inforCollection',
        'info': '用于企业列表'
      },
      {
        'name': '人员列表',
        'mk': '信息核查',
        'url': '/inforCollection/personnelList',
        'info': '用于人员列表'
      },
      {
        'name': '法律法规',
        'mk': '办案指引',
        'url': '/handlingGuide/flfgList',
        'info': '用于法律法规'
      },
      {
        'name': '行业标准',
        'mk': '办案指引',
        'url': '/handlingGuide/hybzList',
        'info': '用于行业标准'
      },
      {
        'name': '案例指引',
        'mk': '办案指引',
        'url': '/handlingGuide',
        'info': '用于案例指引'
      },
      {
        'name': '信息查询',
        'mk': '综合研判',
        'url': 'http://znjs.gat.nm',
        'info': '用于信息查询'
      },
      {
        'name': '电子档案',
        'mk': '综合研判',
        'url': '/zhyp/caseTrend',
        'info': '用于电子档案'
      },
      {
        'name': '人案关系挖掘',
        'mk': '综合研判',
        'url': '/zhyp/caseTrend',
        'info': '用于人案关系挖掘'
      },
      {
        'name': '专题预警分析',
        'mk': '综合研判',
        'url': '/warlyWarn/special',
        'info': '用于专题预警分析'
      },
      {
        'name': '高发行业分析',
        'mk': '专题预警分析',
        'url': '/comanalysis/highindustry',
        'info': '用于高发行业分析'
      },
      {
        'name': '危化车辆轨迹分析',
        'mk': '专题预警分析',
        'url': '/comanalysis/riskvehicle',
        'info': '用于危化车辆轨迹分析'
      },
      {
        'name': '案件督办',
        'mk': '案件管理',
        'url': '/caseManage/dblist',
        'info': '用于案件督办'
      },
      {
        'name': '案件查询',
        'mk': '案件管理',
        'url': '/caseManage',
        'info': '用于案件查询'
      },
      {
        'name': '线索列表',
        'mk': '情报线索',
        'url': '/intellSystem',
        'info': '用于线索列表'
      },
      {
        'name': '线索采集',
        'mk': '情报线索',
        'url': '/intellSystem/intellAdd',
        'info': '用于线索采集'
      },
      {
        'name': '线索统计分析',
        'mk': '情报线索',
        'url': '/intellSystem/intellCount',
        'info': '用于线索统计分析'
      },
      {
        'name': '学习交流',
        'mk': '办案指引',
        'url': '/learn/index',
        'info': '用于学习交流'
      },
      {
        'name': '视频微课堂',
        'mk': '办案指引',
        'url': '/micro/index',
        'info': '用于视频微课堂'
      },
      {
        'name': '违法企业黑名单列表',
        'mk': '信息核查',
        'url': '/inforCollection/compblackList',
        'info': '用于违法企业黑名单列表'
      },
      {
        'name': '违法个人信息列表',
        'mk': '信息核查',
        'url': '/inforCollection/personblackList',
        'info': '用于违法个人信息列表'
      },
      // {
      //   'name': '新谷查询',
      //   'mk': '信息查询',
      //   'url': 'http://znjs.gat.nm',
      //   'info': '用于新谷查询'
      // },
      // {
      //   'name': '业务查询',
      //   'mk': '信息查询',
      //   'url': 'http://znjs.gat.nm',
      //   'info': '用于业务查询'
      // },
      // {
      //   'name': '关联查询',
      //   'mk': '信息查询',
      //   'url': 'http://znjs.gat.nm',
      //   'info': '用于关联查询'
      // },
      {
        'name': '案件档案',
        'mk': '电子档案',
        'url': '/caseManage/index',
        'info': '用于案件档案'
      },
      {
        'name': '违法企业档案',
        'mk': '电子档案',
        'url': '/inforCollection/compblackList',
        'info': '用于违法企业档案'
      },
      {
        'name': '违法黑名单人员档案',
        'mk': '电子档案',
        'url': '/inforCollection/personblackList',
        'info': '用于违法黑名单人员档案'
      },
      {
        'name': '专题案件模型分析预测',
        'mk': '专题预警分析',
        'url': '/special/caseByMode',
        'info': '用于专题案件模型分析预测'
      },
      {
        'name': '专项任务分析展现',
        'mk': '专项任务',
        'url': '/specialTasks/specialTasksCount',
        'info': '用于专项任务分析展现'
      },
      {
        'name': '专题案件模型',
        'mk': '专题预警分析',
        'url': '/warlyWarn/special',
        'info': '用于专题案件模型'
      },
      // {
      //   'name': '从案到人分析',
      //   'mk': '人案关系挖掘',
      //   'url': 'http://znjs.gat.nm',
      //   'info': '用于从案到人分析'
      // },
      // {
      //   'name': '从人到案分析',
      //   'mk': '人案关系挖掘',
      //   'url': 'http://znjs.gat.nm',
      //   'info': '用于从人到案分析'
      // },
      // {
      //   'name': '人案关联引擎',
      //   'mk': '人案关系挖掘',
      //   'url': 'http://znjs.gat.nm',
      //   'info': '用于人案关联引擎'
      // },
      {
        'name': '检验鉴定列表',
        'mk': '检验鉴定',
        'url': '/inspectIdent/list',
        'info': '用于检验鉴定列表'
      },
      {
        'name': '申请检验鉴定',
        'mk': '检验鉴定',
        'url': '/inspectIdent/apply/0',
        'info': '用于申请检验鉴定'
      },
      {
        'name': '检验机构列表',
        'mk': '检验鉴定',
        'url': '/handlingGuide/inspecorgList',
        'info': '用于检验机构列表'
      },
      {
        'name': '新生儿信息',
        'mk': '电子档案',
        'url': '/wjw/xs',
        'info': '用于新生儿信息'
      },
      {
        'name': '医院就诊信息',
        'mk': '电子档案',
        'url': '/wjw/yy',
        'info': '用于医院就诊信息'
      },
      {
        'name': '个性化查询',
        'mk': '信息查询',
        'url': '/comanalysis/perserch',
        'info': '用于个性化查询'
      },
      {
        'name': '发案趋势',
        'mk': '其他1',
        'url': '/zhyp/caseTrend',
        'info': '用于发案趋势'
      },
      {
        'name': '高危地区案发分析',
        'mk': '其他1',
        'url': '/comanalysis/highriskarea',
        'info': '用于高危地区案发分析'
      },
      {
        'name': '高发案件类型分析',
        'mk': '其他1',
        'url': '/zhyp/hightCaseTrend',
        'info': '用于高发案件类型分析'
      },
      {
        'name': '审核待办',
        'mk': '其他1',
        'url': '//',
        'info': '用于审核待办'
      },
      {
        'name': '签收待办',
        'mk': '其他1',
        'url': '//',
        'info': '用于签收待办'
      },
      {
        'name': '个性化查询',
        'mk': '其他1',
        'url': '/comanalysis/perserch',
        'info': '用于个性化查询'
      },
      {
        'name': '企业采集',
        'mk': '信息核查',
        'url': '/inforCollection/add',
        'info': '用于企业采集'
      },
      {
        'name': '人员采集',
        'mk': '信息核查',
        'url': '/inforCollection/personnelEdit',
        'info': '用于人员采集'
      },
      {
        'name': '临时管控',
        'mk': '其他1',
        'url': '//',
        'info': '用于临时管控'
      },
      {
        'name': '登录日志',
        'mk': '其他',
        'url': '/log/LoginIndex',
        'info': '用于登录日志'
      },
      {
        'name': '系统操作日志',
        'mk': '其他',
        'url': '/log/Index',
        'info': '用于系统操作日志'
      },
      {
        'name': '通知通报列表',
        'mk': '其他',
        'url': '/tztg/list',
        'info': '用于通知通报列表'
      },
      {
        'name': '考核排名',
        'mk': '其他',
        'url': '/examineReview/index',
        'info': '用于考核排名'
      },
      {
        'name': '高发案件类别统计',
        'mk': '其他',
        'url': '//',
        'info': '用于高发案件类别统计'
      },
      {
        'name': '大要案推送列表',
        'mk': '其他',
        'url': '//',
        'info': '用于大要案推送列表'
      },
      {
        'name': '案件统计',
        'mk': '其他1',
        'url': '/examineReview/index',
        'info': '用于案件统计'
      },
      {
        'name': '关系挖掘',
        'mk': '专题预警分析',
        'url': '/mesh',
        'info': '用于关系挖掘'
      },
      {
        'name': '盟市登录统计',
        'mk': '其他',
        'url': '/log/leagueCityCountLog',
        'info': '用于盟市登录统计'
      },
      {
        'name': '应用访问统计',
        'mk': '其他',
        'url': '/log/applicationAccess',
        'info': '用于应用访问统计'
      },
      {
        'name': '系统配置',
        'mk': '其他',
        'url': '/config/configSetting',
        'info': '用于系统配置'
      },
      {
        'name': '综合研判',
        'mk': '综合研判',
        'url': '',
        'info': '用于综合研判'
      },
      {
        'name': '专项任务',
        'mk': '专项任务',
        'url': '',
        'info': '用于专项任务'
      },
      {
        'name': '信息核查',
        'mk': '信息核查',
        'url': '',
        'info': '用于信息核查'
      },
      {
        'name': '检验鉴定',
        'mk': '检验鉴定',
        'url': '',
        'info': '用于检验鉴定'
      },
      {
        'name': '办案指引',
        'mk': '办案指引',
        'url': '',
        'info': '用于办案指引'
      },
      {
        'name': '情报线索',
        'mk': '情报线索',
        'url': '',
        'info': '用于情报线索'
      },
      {
        'name': '其他',
        'mk': '其他',
        'url': '',
        'info': '用于其他'
      },
      {
        'name': '其他1',
        'mk': '其他1',
        'url': '',
        'info': '用于其他1'
      },
      {
        'name': '用户操作检查表',
        'mk': '其他',
        'url': '/log/operateCheck',
        'info': '用于用户操作检查表'
      },
      {
        'name': '企业档案',
        'mk': '信息核查',
        'url': '/inforCollection',
        'info': '用于企业档案'
      },
      {
        'name': '公司信息',
        'mk': '企业档案',
        'url': '/inforCollection/comRegisterArchives',
        'info': '用于公司信息'
      },
      {
        'name': '摊贩信息',
        'mk': '企业档案',
        'url': '/inforCollection/comPedlarArchives',
        'info': '用于摊贩信息'
      },
      {
        'name': '案件认领统计',
        'mk': '案件认领',
        'url': '/caseManage/caseClaimStatistical',
        'info': '用于案件认领统计'
      },
      {
        'name': '案件认领',
        'mk': '案件认领',
        'url': '/caseManage/ajrl',
        'info': '用于案件认领'
      },
      {
        'name': '案件侦办统计',
        'mk': '案件管理',
        'url': '/caseManage/statistics',
        'info': '用于案件侦办统计'
      },
      {
        'name': '边界系统数据采集',
        'mk': '其他',
        'url': '/interfaceDataCollect/interfaceList',
        'info': '用于边界系统数据采集'
      }
    ]
    this.list = this.lists
    this.total = this.list.length
    this.oldlist = this.list
    var i = this.$route.params.id
    this.query()
    if (i) {
      this.filters.word = i
      this.searchs()
    }
  } }
</script>
<style>
.wordinput .el-form-item__content {
  width: 400px;
}
</style>
