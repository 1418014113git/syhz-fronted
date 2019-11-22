import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'
export const constantRouterMap = [
  {
    path: '/login',
    // component: () => import('@/views/login/index')  // 默认仅有PKI登录
    component: () => import('@/views/mainLogin/index') // 有用户名，密码登录和PKI登录
  },
  {
    path: '/ukTest', // 默认仅有PKI登录
    component: () => import('@/views/login/ukTest')
  },
  {
    path: '/mainLogin', // 只有用户名，密码登录，没有PKI
    component: () => import('@/views/mainLogin/index')
  },
  {
    path: '/',
    component: Layout,
    redirect: '/portal',
    name: '首页',
    iconCls: 'fa fa-play-circle-o',
    leaf: true,
    children: [
      { path: '/workbench', component: () => import('@/views/workbench/index'), name: '工作台' },
      { path: '/zhyp/caseTrend', component: () => import('@/views/comanalysis/caseTrend'), name: '案件时间及特征分析' },
      // { path: '/caseManage', component: () => import('@/views/caseManage/index'), name: '案件管理' },
      {
        path: '/caseManage',
        component: () => import('@/views/caseManage/index'),
        name: '案件管理',
        meta: { keepAlive: false },
        children: []
      },
      { path: '/caseManage/caseSpaceAnalysis', component: () => import('@/views/caseManage/caseSpaceAnalysis'), name: '案件的空间变化趋势分析' },
      { path: '/specialTasks', component: () => import('@/views/specialTasks/index'), name: '专项任务' },
      // { path: '/inspection', component: () => import('@/views/inspection/index'), name: '检验鉴定' },
      {
        path: '/inspection',
        component: () => import('@/views/inspectIdent/inspectIdent_list'),
        name: '检验鉴定',
        children: [
          // { path: '/inspection', component: () => import('@/views/caseManage/index'), name: '检验鉴定列表' }
          // { path: '/apply', component: () => import('@/views/caseManage/casedb'), name: '申请检验鉴定' }
        ]
      },
      // { path: '/jyjglist', component: () => import('@/views/inspection/jyjglist'), name: '检验机构列表' },
      // { path: '/intellSystem', component: () => import('@/views/intellSystem/index'), name: '线索列表' },
      { path: '/handlingGuide/alzyList', component: () => import('@/views/handlingGuide/alzy_list'), name: '案例指引列表' },
      { path: '/handlingGuide/alzy/add', component: () => import('@/views/handlingGuide/alzyEdit'), name: '案例指引添加' },
      { path: '/handlingGuide/alzy/edit', component: () => import('@/views/handlingGuide/alzyEdit'), name: '案例指引编辑' },
      { path: '/handlingGuide/alzy/detail', component: () => import('@/views/handlingGuide/alzyDetail'), name: '案例指引详情' },
      { path: '/handlingGuide/flfg', component: () => import('@/views/handlingGuide/flfg'), name: '法律法规' },
      { path: '/handlingGuide/flfgList', component: () => import('@/views/handlingGuide/flfg_list'), name: '法律法规列表' },
      { path: '/handlingGuide/flfg/add', component: () => import('@/views/handlingGuide/flfgEdit'), name: '法律法规添加' },
      { path: '/handlingGuide/flfg/edit', component: () => import('@/views/handlingGuide/flfgEdit'), name: '法律法规编辑' },
      { path: '/handlingGuide/flfg/detail', component: () => import('@/views/handlingGuide/flfgDetail'), name: '法律法规详情' },
      { path: '/handlingGuide/gfzdList', component: () => import('@/views/handlingGuide/gfzd_list'), name: '规范制度列表' },
      { path: '/handlingGuide/gfzd/add', component: () => import('@/views/handlingGuide/gfzdEdit'), name: '规范制度添加' },
      { path: '/handlingGuide/gfzd/edit', component: () => import('@/views/handlingGuide/gfzdEdit'), name: '规范制度编辑' },
      { path: '/handlingGuide/gfzd/detail', component: () => import('@/views/handlingGuide/gfzdDetail'), name: '规范制度详情' },
      { path: '/handlingGuide/knowLedgeBase', component: () => import('@/views/handlingGuide/knowLedgeBase'), name: '知识库管理' },
      { path: '/handlingGuide/totalList', component: () => import('@/views/handlingGuide/totalList'), name: '知识库统计分析' },
      // { path: '/handlingGuide/hybzList', component: () => import('@/views/handlingGuide/hybz_list'), name: '行业标准' },
      { path: '/handlingGuide/hybzList', component: () => import('@/views/handlingGuide/hybz_list'), name: '行业标准' },
      { path: '/handlingGuide/hybz/add', component: () => import('@/views/handlingGuide/hybzEdit'), name: '行业标准添加' },
      { path: '/handlingGuide/hybz/edit', component: () => import('@/views/handlingGuide/hybzEdit'), name: '行业标准编辑' },
      { path: '/handlingGuide/hybz/detail', component: () => import('@/views/handlingGuide/hybzDetail'), name: '行业标准详情' },
      // { path: '/apply', component: () => import('@/views/inspection/apply'), name: '申请检验鉴定' },
      // { path: '/jybg', component: () => import('@/views/inspection/jybg'), name: '检验鉴定报告' },
      { path: '/jyjgSave', component: () => import('@/views/inspection/jyjgSave'), name: '增加检验机构' },
      { path: '/jyjsx', component: () => import('@/views/inspection/jyjsx'), name: '检验鉴定介绍信' },
      { path: '/jysp', component: () => import('@/views/inspection/jysp'), name: '检验鉴定审批' },
      // { path: '/caseManage/ajxcqs', component: () => import('@/views/caseManage/ajxcqs'), name: '案件协查签收' },
      // { path: '/caseManage/ajxcsh', component: () => import('@/views/caseManage/ajxcsh'), name: '案件协查审核' },
      { path: '/caseManage/ajrl', component: () => import('@/views/caseManage/ajrl'), name: '案件认领' },
      { path: '/caseManage/detail/:id', component: () => import('@/views/caseManage/detail'), name: '案件详情' },
      // { path: '/caseManage/investigation', component: () => import('@/views/caseManage/investigation'), name: '集群战役列表' },
      // { path: '/caseManage/investigation/add', component: () => import('@/views/caseManage/investigation_edit'), name: '添加集群战役' },
      // { path: '/caseManage/investigation/edit/:id', component: () => import('@/views/caseManage/investigation_edit'), name: '编辑集群战役' },
      // { path: '/caseManage/investigation/detail/:id', component: () => import('@/views/caseManage/investigation_detail'), name: '集群战役详情' },
      { path: '/specialTasks/add', component: () => import('@/views/specialTasks/edit'), name: '添加任务' },
      { path: '/specialTasks/edit/:id', component: () => import('@/views/specialTasks/edit'), name: '专项任务编辑' },
      { path: '/specialTasks/results/:taskId', component: () => import('@/views/specialTasks/results'), name: '成果列表' },
      { path: '/specialTasks/reportResults/:taskId', component: () => import('@/views/specialTasks/reportResults'), name: '上报成果添加' },
      { path: '/specialTasks/reportResults/:taskId/:id', component: () => import('@/views/specialTasks/reportResults'), name: '上报成果修改' },
      { path: '/specialTasks/resultsDetail/:id', component: () => import('@/views/specialTasks/resultsDetail'), name: '成果详情' },
      { path: '/specialTasks/resultsDetail/:type/:taskId/:id', component: () => import('@/views/specialTasks/resultsDetail'), name: '专项任务成果详情' },
      { path: '/specialTasks/resultsReview/:taskId/:id', component: () => import('@/views/specialTasks/resultsReview'), name: '上报成果审核' },
      { path: '/specialTasks/total', component: () => import('@/views/specialTasks/total'), name: '专项任务信息汇集' },
      { path: '/specialTasks/specialTasksTable', component: () => import('@/views/specialTasks/specialTasksTable'), name: '专项任务分析表' },
      { path: '/tztg/index', component: () => import('@/views/notice/index'), name: '通知通报列表' },
      { path: '/tztg/list', component: () => import('@/views/notice/list'), name: '通知通报列表' },
      { path: '/tztg/save', component: () => import('@/views/notice/edit'), name: '发布通知通报' },
      { path: '/tztg/edit/:id', component: () => import('@/views/notice/edit'), name: '编辑通知通报' },
      { path: '/tztg/detail/:id', component: () => import('@/views/notice/detail'), name: '通知通报信息详情' },
      { path: '/caseManage/index', component: () => import('@/views/caseManage/index'), name: '案件列表' },
      { path: '/caseManage/ajrl', component: () => import('@/views/caseManage/ajrl'), name: '案件认领列表' },
      { path: '/caseManage/statistics', component: () => import('@/views/caseManage/caseStatistics'), name: '考核评比' },
      // { path: '/caseManage/statisInvestigation', component: () => import('@/views/caseManage/statisInvestigation'), name: '集群战役' }, // 此集群战役针对案件侦办与打击处理情况统计表单独写的
      { path: '/caseManage/statisHandle', component: () => import('@/views/caseManage/statisHandle'), name: '打击处理人员信息' }, // 此打击处理人员情况针对案件统计表单独写的，查询的是人员信息
      { path: '/caseManage/statisDblist', component: () => import('@/views/caseManage/statisDblist'), name: '大案侦办' }, //  此大案侦办列表针对案件侦办与打击处理情况统计表单独写的
      { path: '/intellSystem/edit/:id', component: () => import('@/views/intellSystem/edit'), name: '信息采集编辑' },
      { path: '/intellSystem/keyword', component: () => import('@/views/intellSystem/keyword'), name: '线索要素' },
      { path: '/intellSystem/keyword/add', component: () => import('@/views/intellSystem/keyword_edit'), name: '线索要素添加' },
      { path: '/intellSystem/keyword/edit/:id', component: () => import('@/views/intellSystem/keyword_edit'), name: '线索要素编辑' },
      { path: '/comanalysis/highindustry', component: () => import('@/views/comanalysis/highindustry'), name: '高发行业分析' },
      { path: '/comanalysis/highriskarea', component: () => import('@/views/openLayersMap/index'), name: '高危地区案发分析' },
      { path: '/comanalysis/riskvehicle', component: () => import('@/views/riskvehicleMap/index'), name: '危化车辆轨迹分析' },
      { path: '/zhyp/caseTrend', component: () => import('@/views/comanalysis/caseTrend'), name: '警情分析' },
      { path: '/zhyp/hightCaseTrend', component: () => import('@/views/comanalysis/HightCaseTrend'), name: '案件变化态势量化报表' },
      { path: '/caseAssist/list', component: () => import('@/views/caseAssist/assist_list'), name: '案件协查列表' },
      { path: '/caseAssist/add', component: () => import('@/views/caseAssist/assist_edit'), name: '新增案件协查' },
      { path: '/caseAssist/edit/:id', component: () => import('@/views/caseAssist/assist_edit'), name: '编辑案件协查' },
      { path: '/caseAssist/detail/:id', component: () => import('@/views/caseAssist/assist_detail'), name: '案件协查详情' },
      { path: '/inspectIdent/apply/:id', component: () => import('@/views/inspectIdent/inspectIdent_apply'), name: '申请检验鉴定' },
      { path: '/inspectIdent/detail/:id', component: () => import('@/views/inspectIdent/inspectIdent_detail'), name: '检验鉴定详情' },
      { path: '/inspectIdent/list', component: () => import('@/views/inspectIdent/inspectIdent_list'), name: '检验鉴定列表' },
      { path: '/workflow/index/:type', component: () => import('@/views/workFlow/index'), name: '工作流程' },
      { path: '/workflow/examine/:type/:id', component: () => import('@/views/workFlow/examine'), name: '流程审核' },
      { path: '/intellSystem/intellAdd', component: () => import('@/views/intellSystem/intell_add'), name: '线索添加' },
      { path: '/intellSystem/intellCount', component: () => import('@/views/intellSystem/intell_count'), name: '线索统计分析' },
      { path: '/intellSystem/companyPersonList/:id', component: () => import('@/views/intellSystem/company_person_list'), name: '人员企业要素列表' },
      { path: '/warlyWarn/special', component: () => import('@/views/warlywarning/specialWarn'), name: '专题预警模型' },
      { path: '/special/caseByMode', component: () => import('@/views/warlywarning/specialCase'), name: '专题预警模型搜索' },
      { path: '/handlingGuide/inspecorgList', component: () => import('@/views/handlingGuide/inspecorg_list'), name: '检验机构列表' },
      { path: '/handlingGuide/inspecorgEdit', component: () => import('@/views/handlingGuide/inspecorg_edit'), name: '检验机构编辑' },
      { path: '/micro/difficult', component: () => import('@/views/learnfaq/index'), name: '疑难解答' },
      { path: '/micro/difficult/detail/:id', component: () => import('@/views/learnfaq/detail'), name: '疑难解答详情' },
      { path: '/micro/difficult/save', component: () => import('@/views/learnfaq/question'), name: '疑难解答提问' },
      { path: '/specialTasks/specialTasksCount', component: () => import('@/views/specialTasks/specialTasksCount'), name: '专项任务分析展现' },
      { path: '/learn/myqa', component: () => import('@/views/learnfaq/myQA'), name: '我的记录' },
      { path: '/micro/index', component: () => import('@/views/microClass/index'), name: '在线课堂参考' },
      { path: '/micro/onlineClassRoom', component: () => import('@/views/microClass/onlineClassRoom'), name: '在线课堂' },
      { path: '/micro/moreVideo', component: () => import('@/views/microClass/moreList'), name: '更多视频' },
      { path: '/micro/moreAudio', component: () => import('@/views/microClass/moreList'), name: '更多音频' },
      { path: '/micro/moreDocument', component: () => import('@/views/microClass/moreList'), name: '更多文档' },
      { path: '/micro/uploadFile', component: () => import('@/views/microClass/uploadFile'), name: '上传培训资料' },
      { path: '/micro/myLearning', component: () => import('@/views/microClass/myLearning'), name: '我的学习' },
      { path: '/micro/trainMaterial', component: () => import('@/views/microClass/trainMaterial'), name: '培训资料' },
      { path: '/micro/videoPlayer', component: () => import('@/views/microClass/player'), name: '视频课程' },
      { path: '/micro/audioPlayer', component: () => import('@/views/microClass/player'), name: '音频课程' },
      { path: '/micro/documentPlayer', component: () => import('@/views/microClass/player'), name: '文档课程' },
      { path: '/micro/player', component: () => import('@/views/microClass/player'), name: '在线课堂视频播放' },
      { path: '/micro/totalList', component: () => import('@/views/microClass/totalList'), name: '培训资料统计分析' },
      { path: '/micro/learningIntegral', component: () => import('@/views/microClass/learningIntegral'), name: '学习积分' },
      { path: '/micro/integralMonth', component: () => import('@/views/microClass/integralMonth'), name: '月积分排名' },
      { path: '/micro/integralTotal', component: () => import('@/views/microClass/integralTotal'), name: '总积分排名' },
      { path: '/micro/integralSet', component: () => import('@/views/microClass/integralSet'), name: '积分规则' },
      { path: '/micro/integralDetail', component: () => import('@/views/microClass/integralDetail'), name: '积分明细' },
      { path: '/intell/cascade/:id', component: () => import('@/views/intellSystem/cascade'), name: '线索串并展示' },
      { path: '/wjw/xs', component: () => import('@/views/wjw/WjwXs'), name: '新生儿信息' },
      { path: '/wjw/xs/:id', component: () => import('@/views/wjw/XsDetail'), name: '新生儿详细信息' },
      { path: '/wjw/yy', component: () => import('@/views/wjw/WjwYy'), name: '医院就诊信息' },
      { path: '/wjw/yy/:id', component: () => import('@/views/wjw/YyDetail'), name: '医院就诊详细信息' },
      { path: '/log/index', component: () => import('@/views/log/index'), name: '系统操作日志' },
      { path: '/log/LoginIndex', component: () => import('@/views/log/login'), name: '登录日志' },
      { path: '/hospital/list', component: () => import('@/views/hospital/index'), name: '医疗机构信息列表' },
      { path: '/hospital/detail/:id', component: () => import('@/views/hospital/detail'), name: '医疗机构详情' },
      { path: '/businessWork/:type', component: () => import('@/views/workbench/list'), name: '签收列表' },
      { path: '/inspect/result/add/:id', component: () => import('@/views/inspectIdent/inspectIdent_result'), name: '检验鉴定报告' },
      { path: '/examineReview/index', component: () => import('@/views/examineReview/index'), name: '环境食品药品犯罪侦查总队考核表' },
      { path: '/comanalysis/perserch', component: () => import('@/views/comanalysis/personalSearch'), name: '外部资源查询' },
      { path: '/comanalysis/persetting', component: () => import('@/views/comanalysis/personalSetting'), name: '外部资源配置' },
      { path: '/message/list', component: () => import('@/views/portal/components/Messages'), name: '消息中心' },
      { path: '/log/leagueCityCountLog', component: () => import('@/views/log/leagueCityCountLog.vue'), name: '各市登录统计' },
      { path: '/log/applicationAccess', component: () => import('@/views/log/applicationAccess.vue'), name: '应用访问统计' },
      { path: '/config/configSetting', component: () => import('@/views/config/sets.vue'), name: '配置管理' },
      { path: '/config/restricted', component: () => import('@/views/config/components/restricted_person.vue'), name: '管控名单' },
      { path: '/log/operateCheck', component: () => import('@/views/log/operateCheck.vue'), name: '应用系统用户操作检查表' },
      { path: '/caseManage/caseClaimStatistical', component: () => import('@/views/caseManage/caseClaimStatistical'), name: '案件认领统计' },
      { path: '/synthesizeAnalysis/socialIntegrationResources', component: () => import('@/views/synthesizeAnalysis/socialIntegrationResources'), name: '外部资源统计' },
      { path: '/interfaceDataCollect/interfaceSave', component: () => import('@/views/interfaceDataCollect/interfaceSave'), name: '边界化平台录入' },
      { path: '/interfaceDataCollect/interfaceList', component: () => import('@/views/interfaceDataCollect/interfaceList'), name: '边界化平台列表' },
      { path: '/interfaceDataCollect/interfaceDetail', component: () => import('@/views/interfaceDataCollect/interfaceDetail'), name: '边界化平台详情' },
      { path: '/sysnotice/SysNoticeSave', component: () => import('@/views/sysnotice/SysNoticeSave'), name: '系统通知录入' },
      { path: '/sysnotice/SysNoticeList', component: () => import('@/views/sysnotice/SysNoticeList'), name: '系统通知列表' },
      { path: '/sysnotice/SysNoticeEdit', component: () => import('@/views/sysnotice/SysNoticeEdit'), name: '系统通知修改' },
      { path: '/sysnotice/SysNoticeDetail/:id', component: () => import('@/views/sysnotice/SysNoticeDetail'), name: '系统公告' },
      { path: '/mesh', component: () => import('@/views/chart/mesh'), name: '关系挖掘' },
      { path: '/personnelFile/index', component: () => import('@/views/personnelFile/index'), name: '人员档案' }, // 人员档案升级主界面 20190624
      { path: '/caseFile/index', component: () => import('@/views/caseFile/index'), name: '案件档案' }, // 案件档案升级主界面 20190704
      { path: '/404', component: () => import('@/views/404') },
      { path: '/log/indexAbnormal', component: () => import('@/views/log/indexAbnormal'), name: '系统日志-设定异常' },
      { path: '/inspectIdent/statisAnalysis', component: () => import('@/views/inspectIdent/statisAnalysis'), name: '统计分析' }, // 案件管理-检验鉴定-统计分析
      { path: '/inspectIdent/collect', component: () => import('@/views/inspectIdent/collect'), name: '汇总' }, // 案件管理-检验鉴定-汇总
      { path: '/baseInfoCount/index', component: () => import('@/views/baseInfo/baseInfoCount'), name: '数据统计分析' },
      { path: '/baseInfoCount/intellCount', component: () => import('@/views/baseInfo/intellCount'), name: '线索信息统计' },
      { path: '/baseInfoCount/caseCount', component: () => import('@/views/baseInfo/caseCount'), name: '案件信息统计' },
      { path: '/baseInfoCount/template', component: () => import('@/views/baseInfo/xlsTemplate'), name: '上报模板管理' },
      { path: '/sysCheck/runArg', component: () => import('@/views/sysCheck/runArg'), name: '系统检测-运行参数' },
      { path: '/ipconfig/blacklist', component: () => import('@/views/ipconfig/black/list'), name: 'IP配置' },
      { path: '/ipconfig/save/:yys', component: () => import('@/views/ipconfig/black/edit'), name: '添加黑白名单' },
      { path: '/ipconfig/edit/:id', component: () => import('@/views/ipconfig/black/edit'), name: '编辑黑白名单' },
      { path: '/oneclickQuery/list', component: () => import('@/views/oneclickQuery/list'), name: '一键搜应用' },
      { path: '/lyricalinfo/analysis', component: () => import('@/views/intellSystem/lyricalinfo/analysis/lyricalinfoAnalysis'), name: '舆情研判' }, // 舆情分析
      { path: '/lyricalInfo/analysisRecord', component: () => import('@/views/intellSystem/lyricalInfo/analysisRecord'), name: '分析报告' },
      { path: '/lyricalinfo/analysisDetail', component: () => import('@/views/intellSystem/lyricalinfo/analysis/analysis'), name: '事件舆情分析' }, // 舆情分析
      { path: '/lyricalInfo/alarmInfo', component: () => import('@/views/intellSystem/lyricalInfo/alarmInfo/alarmInfo_list'), name: '舆情信息' }, // 舆情警情信息
      { path: '/lyricalInfo/alarmInfo/detail', component: () => import('@/views/intellSystem/lyricalInfo/alarmInfo/alarmInfo_detail'), name: '舆情详情' }, // 舆情警情信息详情
      { path: '/lyricalInfo/lyricalAnalysisAll', component: () => import('@/views/intellSystem/lyricalinfo/analysisAll/analysisAll'), name: '舆情分析' }, // 舆情分析
      { path: '/internalInfo/internalInfo', component: () => import('@/views/intellSystem/internalInfo/internalInfo_list'), name: '内部资源信息' }, // 内部资源信息
      { path: '/internalInfo/internalInfoDetail', component: () => import('@/views/intellSystem/internalInfo/internalInfo_detail'), name: '内部资源信息详情' }, // 内部资源信息详情页面
      { path: '/educational/achievement', component: () => import('@/views/handlingGuide/exam_list'), name: '考试统计' }, // 考试统计
      { path: '/educational/achievement/:id', component: () => import('@/views/handlingGuide/achievement_list'), name: '成绩管理' }, // 成绩管理
      { path: '/intellSystem/bigPictrue', component: () => import('@/views/intellSystem/bigPictrue'), name: '环食药一张图' },
      { path: '/systemDock/other/apiMonitor', component: () => import('@/views/systemDock/other/apiMonitor/index'), name: 'API监控' }, // 系统对接-API监控
      { path: '/systemDock/other/audit', component: () => import('@/views/systemDock/other/audit/index'), name: '审计' }, // 系统对接-审计
      { path: '/systemDock/other/stat', component: () => import('@/views/systemDock/other/stat/index'), name: '统计' }, // 系统对接-统计
      { path: '/oneclickQuery/list/:id', component: () => import('@/views/oneclickQuery/list'), name: '一键搜应用' },
      { path: '/intellSystem/lyricalInfo', component: () => import('@/views/intellSystem/lyricalInfo/alarmInfo/alarmInfo_list'), name: '舆情信息' }, // 舆情分析
      { path: '/intellSystem/analysisJudgment', component: () => import('@/views/intellSystem/analysisJudgment/policeSentiment'), name: '分析研判' }, // 警情分析研判
      { path: '/analysisJudgment/person', component: () => import('@/views/intellSystem/analysisJudgment/person'), name: '人员动态分析研判' }, // 人员动态分析研判
      { path: '/analysisJudgment/policeSentiment', component: () => import('@/views/intellSystem/analysisJudgment/policeSentiment'), name: '警情分析研判' }, // 警情分析研判
      { path: '/analysisJudgment/caseAnalysis', component: () => import('@/views/intellSystem/analysisJudgment/caseAnalysis'), name: '案事分析研判' }, // 案事分析研判
      { path: '/analysis/analysisDetail', component: () => import('@/views/intellSystem/lyricalInfo/analysis/analysisDetail'), name: '舆情研判详情' }, // 案事分析研判
      { path: '/educational/ExamPractice', component: () => import('@/views/handlingGuide/examPractice'), name: '考试练兵' },
      { path: '/educational/ExamPractice/examDetail', component: () => import('@/views/handlingGuide/examDetail'), name: '开始考试' },
      { path: '/educational/onlineTraining/manage', component: () => import('@/views/handlingGuide/curriculumManage'), name: '课程管理' },
      { path: '/educational/onlineTraining/learn', component: () => import('@/views/handlingGuide/curriculumLearn'), name: '课程学习' },
      { path: '/educational/onlineTraining/beginLearning', component: () => import('@/views/handlingGuide/curriculumLearnDetail'), name: '正在学习' },
      { path: '/knowledgeBase/institutionalNorms', component: () => import('@/views/knowledgeBase/institutionalNorms'), name: '规范制度' },
      { path: '/knowledgeBase/institutionalNormsInfo', component: () => import('@/views/knowledgeBase/institutionalNormsInfo'), name: '规范制度详情' },
      // { path: '/knowledgeBase/knowledgeBank', component: () => import('@/views/knowledgeBase/knowledgeBank'), name: '知识库管理' },
      // { path: '/knowledgeBase/knowledgeAdd', component: () => import('@/views/knowledgeBase/knowledgeAdd'), name: '添加资料' },
      // { path: '/knowledgeBase/knowledgeUpdate', component: () => import('@/views/knowledgeBase/knowledgeUpdate'), name: '编辑资料' },
      // { path: '/knowledgeBase/knowledgeDetial', component: () => import('@/views/knowledgeBase/knowledgeDetial'), name: '资料详情' },
      { path: '/knowledgeBase/userIntegral', component: () => import('@/views/knowledgeBase/userIntegral'), name: '用户积分制' },
      { path: '/knowledgeBase/userIntegralAdd', component: () => import('@/views/knowledgeBase/userIntegralAdd'), name: '积分制添加界面' },
      { path: '/knowledgeBase/userIntegralUpdate', component: () => import('@/views/knowledgeBase/userIntegralUpdate'), name: '积分制界面' },
      // { path: '/educational/questionBank', component: () => import('@/views/educational/questionBank'), name: '静态题库管理 ' },
      { path: '/handlingGuide/examOnLine', component: () => import('@/views/handlingGuide/examPractice'), name: '网上考试' },
      { path: '/handlingGuide/zsk', component: () => import('@/views/handlingGuide/flfg'), name: '知识库' },
      { path: '/handlingGuide/trainingOnLine', component: () => import('@/views/microClass/index'), name: '网上培训' },
      { path: '/handlingGuide/testbaseManage', component: () => import('@/views/handlingGuide/testbaseManage/index'), name: '题库管理' }, // 题库管理--试题模块
      { path: '/handlingGuide/testbaseManage/detail', component: () => import('@/views/handlingGuide/testbaseManage/detail'), name: '试题详情' },
      { path: '/handlingGuide/testbaseManage/add', component: () => import('@/views/handlingGuide/testbaseManage/edit'), name: '添加试题' },
      { path: '/handlingGuide/testbaseManage/edit', component: () => import('@/views/handlingGuide/testbaseManage/edit'), name: '编辑试题' },
      { path: '/handlingGuide/examineManage', component: () => import('@/views/handlingGuide/examineManage/index'), name: '考试管理' },
      { path: '/handlingGuide/examineManage/edit', component: () => import('@/views/handlingGuide/examineManage/edit'), name: '编辑考试' },
      { path: '/handlingGuide/examineManage/add', component: () => import('@/views/handlingGuide/examineManage/edit'), name: '添加考试' },
      { path: '/handlingGuide/examineManage/detail', component: () => import('@/views/handlingGuide/examineManage/detail'), name: '考试详情' },
      // { path: '/handlingGuide/educationalFreeSettings_detail/:id', component: () => import('@/views/handlingGuide/educationalFreeSettings_detail'), name: '考试管理详情' },
      // { path: '/handlingGuide/educationalFreeSettings_edit/:id', component: () => import('@/views/handlingGuide/educationalFreeSettings_edit'), name: '考试管理编辑' },
      // { path: '/handlingGuide/educationalFreeSettings_setting/:id', component: () => import('@/views/handlingGuide/educationalFreeSettings_setting'), name: '设置考题' },
      // { path: '/handlingGuide/educationalFreeSettings_stk/:id', component: () => import('@/views/handlingGuide/educationalFreeSettings_stk'), name: '选择考题' },
      // { path: '/handlingGuide/educationalFreeSettings_rule/:id', component: () => import('@/views/handlingGuide/educationalFreeSettings_rule'), name: '规则设置' },
      { path: '/handlingGuide/examPaperManage', component: () => import('@/views/handlingGuide/examPaperManage/index'), name: '试卷管理' }, // 试卷列表
      { path: '/handlingGuide/addExamPaper', component: () => import('@/views/handlingGuide/examPaperManage/addExamPaper'), name: '添加试卷' }, // 添加试卷
      { path: '/handlingGuide/editExamPaper', component: () => import('@/views/handlingGuide/examPaperManage/editExamPaper'), name: '修改试卷' }, // 修改试卷
      { path: '/handlingGuide/goOverExamPaper/examIndex', component: () => import('@/views/handlingGuide/goOverExamPaper/examIndex'), name: '考试阅卷列表' }, // 阅卷列表
      { path: '/handlingGuide/goOverExamPaper/index', component: () => import('@/views/handlingGuide/goOverExamPaper/index'), name: '阅卷列表' }, // 阅卷列表
      { path: '/handlingGuide/goOverExamPaper/settingScore', component: () => import('@/views/handlingGuide/goOverExamPaper/settingScore'), name: '阅卷' }, // 阅卷
      { path: '/handlingGuide/examTrainingManage/index', component: () => import('@/views/handlingGuide/examTrainingManage/index'), name: '考试练兵列表' }, // 考试练兵
      { path: '/handlingGuide/examTrainingManage/trainingOnline', component: () => import('@/views/handlingGuide/examTrainingManage/trainingOnline'), name: '在线考试' }, // 在线考试
      { path: '/handlingGuide/examTrainingManage/paperExamed', component: () => import('@/views/handlingGuide/examTrainingManage/paperExamed'), name: '已考试详情' }, // 已考试详情
      { path: '/handlingGuide/examTrainingManage/scoreRanking', component: () => import('@/views/handlingGuide/examTrainingManage/scoreRanking'), name: '成绩排名' }, // 成绩排名
      { path: '/handlingGuide/examineManage/statistical', component: () => import('@/views/handlingGuide/examineManage/statistical'), name: '考试统计分析' }, // 考试统计分析
      { path: '/basicService/deptInfo/index', component: () => import('@/views/basicService/deptInfo/index'), name: '机构信息列表' },
      { path: '/basicService/deptInfo/detail', component: () => import('@/views/basicService/deptInfo/detail'), name: '机构信息' },
      { path: '/basicService/deptInfo/edit', component: () => import('@/views/basicService/deptInfo/edit'), name: '编辑机构信息' },
      { path: '/basicService/teamStatistical', component: () => import('@/views/basicService/basicStatistical/teamStatistical'), name: '队伍基本情况统计' },
      { path: '/basicService/deptStatistical', component: () => import('@/views/basicService/basicStatistical/deptStatistical'), name: '单位机构基本情况' },
      { path: '/basicService/personInfo', component: () => import('@/views/basicService/personInfo/index'), name: '人员信息' }, // 人员信息
      { path: '/basicService/personList', component: () => import('@/views/basicService/personInfo/personList'), name: '人员信息列表' },
      { path: '/groups/groupsList', component: () => import('@/views/groups/groupsList'), name: '常用组列表' },
      { path: '/groups/groupsSave', component: () => import('@/views/groups/groupsSave'), name: '添加常用组' },
      { path: '/groups/groupsEdit', component: () => import('@/views/groups/groupsEdit'), name: '编辑常用组' },
      { path: '/groups/groupsDetail', component: () => import('@/views/groups/groupsDetail'), name: '常用组详情' }, // 人员信息
      { path: '/basicService/equip', component: () => import('@/views/basicService/equip/index'), name: '装备信息' }, // 装备信息
      { path: '/basicService/equip/detail', component: () => import('@/views/basicService/equip/detail'), name: '配备项目明细' }, // 配备项目明细
      { path: '/basicService/equipNorm', component: () => import('@/views/basicService/equipNorm/index'), name: '装备配备标准' }, // 装备配备标准
      { path: '/basicService/equipNorm/classify', component: () => import('@/views/basicService/equipNorm/equipClassify'), name: '装备分类管理' }, // 装备分类管理
      { path: '/basicService/equipStatistical', component: () => import('@/views/basicService/basicStatistical/equipStatistical'), name: '装备信息统计' }, // 装备信息统计
      { path: '/notice/index', component: () => import('@/views/notice/noticeList'), name: '站内通知' },
      { path: '/notice/add', component: () => import('@/views/notice/noticeEdit'), name: '发布站内通知' },
      { path: '/notice/edit', component: () => import('@/views/notice/noticeEdit'), name: '编辑站内通知' },
      { path: '/notice/forward', component: () => import('@/views/notice/noticeEdit'), name: '转发站内通知' },
      { path: '/notice/detail', component: () => import('@/views/notice/noticeDetail'), name: '站内通知详情' },
      { path: '/notice/message', component: () => import('@/views/notice/noticeMessageList'), name: '站内消息' },
      { path: '/notice/webSocket', component: () => import('@/views/notice/webSocket'), name: '消息提醒' },
      { path: 'ajdeptreceive/save', component: () => import('@/views/ajdeptreceive/save'), name: '保存案件认领关系' }, // 案件认领关系
      { path: 'ajdeptreceive/edit', component: () => import('@/views/ajdeptreceive/edit'), name: '修改案件认领关系' }, // 案件认领关系
      { path: 'ajdeptreceive/list', component: () => import('@/views/ajdeptreceive/list'), name: '案件认领关系列表' },
      { path: '/caseAssist/caseType', component: () => import('@/views/caseAssist/caseType'), name: '案件类别与罪名' },
      { path: '/caseManage/dbList', component: () => import('@/views/caseManage/caseOversee/dbList'), name: '案件督办列表' },
      { path: '/caseManage/dbApply', component: () => import('@/views/caseManage/caseOversee/dbApply'), name: '申请案件督办' },
      { path: '/caseManage/toup/dbApply', component: () => import('@/views/caseManage/caseOversee/dbApply'), name: '申请上级督办' },
      { path: '/caseManage/dbDetail', component: () => import('@/views/caseManage/caseOversee/dbDetail'), name: '案件督办详情' },
      { path: '/caseManage/db/batchList', component: () => import('@/views/caseManage/caseOversee/batchList'), name: '案件督办批次列表' },
      { path: '/caseManage/db/batchRelease', component: () => import('@/views/caseManage/caseOversee/batchRelease'), name: '督办批次发布' },
      { path: '/caseManage/db/batchDetail', component: () => import('@/views/caseManage/caseOversee/batchDetail'), name: '督办批次详情' },
      { path: '/caseManage/dbStatistical', component: () => import('@/views/caseManage/caseOversee/dbStatistical'), name: '案件督办统计' },
      { path: '/jqcampaign', component: () => import('@/views/caseManage/jqCampaign/mainList'), name: '集群战役' },
      { path: '/jqcampaign/clueList', component: () => import('@/views/caseManage/jqCampaign/clueList'), name: '线索列表' },
      { path: '/jqCampaign/detail', component: () => import('@/views/caseManage/jqCampaign/mainDetail'), name: '集群战役详情 ' },
      { path: '/jqCampaign/jqzyAdd', component: () => import('@/views/caseManage/jqCampaign/jqzyAdd'), name: '申请集群战役 ' },
      { path: '/reportTemplate', component: () => import('@/views/reportTemplate/index'), name: '常规报表模板' },
      { path: '/caseManage/caseList', component: () => import('@/views/caseManage/caseList'), name: '案件查询统计' }
    ]
  },
  { path: '/portal', component: () => import('@/views/portal/index'), name: '门户' },
  { path: '/exportanjtb', component: () => import('@/views/caseManage/exportanjtb'), name: '案件侦办统计表导出页' },
  { path: '/exportTeam', component: () => import('@/views/basicService/basicStatistical/exportTeam'), name: '队伍基本情况统计导出页' },
  { path: '/exportEquip', component: () => import('@/views/basicService/basicStatistical/exportEquip'), name: '装备信息统计导出页' },
  { path: '*', redirect: '/404', hidden: true } // 全不匹配的情况下，返回404，路由按顺序从上到下，依次匹配。最后一个*能匹配全部
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

