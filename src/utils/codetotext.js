/* 案件协查级别 */
export function getAssistLevelText(type) {
  if (type === '1') {
    return '特提'
  }
  if (type === '2') {
    return '特急'
  }
  if (type === '3') {
    return '加急'
  }
  if (type === '4') {
    return '平急'
  }
  if (type === '5') {
    return '一般'
  }
}

/* 案件协查状态 */
export function getAssistStatusText(status) {
  if (status === '0') {
    return '草稿'
  }
  if (status === '1') {
    return '待审核'
  }
  if (status === '2') {
    return '审核未通过'
  }
  if (status === '3') {
    return '待上级审核'
  }
  if (status === '4') {
    return '审核通过'
  }
  if (status === '5') {
    return '待签收'
  }
  if (status === '6') {
    return '进行中'
  }
  if (status === '7') {
    return '已结束'
  }
  if (status === '8') {
    return '已结束'
  }
}

/* 业务审核流程状态 */
export function getStatusSelect() {
  return [{
    label: '草稿', value: '0'
  },
  {
    label: '待审核', value: '1'
  },
  {
    label: '审核未通过', value: '2'
  },
  {
    label: '待上级审核', value: '3'
  },
  {
    label: '审核通过', value: '4'
  },
  {
    label: '待签收', value: '5'
  },
  {
    label: '进行中', value: '6'
  },
  {
    label: '已结束', value: '7'
  }
  ]
}

/* 协查级别 */
export function getAssistLevel() {
  return [{
    label: '特提(12小时内办结)', value: '1'
  },
  {
    label: '特急(48小时内办结)', value: '2'
  },
  {
    label: '加急(72小时内办结)', value: '3'
  },
  {
    label: '平急(7日内办结)', value: '4'
  },
  {
    label: '一般', value: '5'
  }
  ]
}

/* 工作流 flow 状态 */
export function getWFlowStatus() {
  return [{
    label: '待审核', value: '1'
  },
  {
    label: '审批中', value: '2'
  },
  {
    label: '通过', value: '3'
  },
  {
    label: '驳回', value: '4'
  },
  {
    label: '已过期', value: '5'
  },
  {
    label: '向上级申请', value: '6'
  }
  ]
}

/* 工作流 flow 状态 text */
export function getWFlowStatusText(status) {
  if (status === '1') {
    return '待审核'
  }
  if (status === '2') {
    return '审批中'
  }
  if (status === '3') {
    return '通过'
  }
  if (status === '4') {
    return '驳回'
  }
  if (status === '5') {
    return '已过期'
  }
  if (status === '6') {
    return '向上级申请'
  }
}

/* 专题预警搜索条件 */
export function getWarnCondition() {
  return [
    { value: 'ajmc', label: '案件名称' },
    { value: 'ajzt', label: '案件状态' },
    { value: 'ajlbName', label: '案件类别' },
    { value: 'ajlb1Name', label: '案件类别1' },
    { value: 'ajlb2Name', label: '案件类别2' },
    { value: 'ajxz', label: '案件性质' },
    { value: 'fadzssxqName', label: '案发地址' },
    { value: 'zagjName', label: '作案工具' },
    { value: 'jzzasdName', label: '作案手段' },
    { value: 'syhsjly', label: '食药环类型' },
    { value: 'whcd', label: '危害程度' },
    { value: 'fasjsx', label: '发案时间' },
    { value: 'xwbx', label: '行为表现' },
    { value: 'qklj', label: '前科劣迹' },
    { value: 'rjjw', label: '人际交往' }
  ]
}

/* 专题预警搜索条件 text */
export function getWarnCondText(type) {
  if (type === 'ajmc') {
    return '案件名称'
  }
  if (type === 'ajzt') {
    return '案件状态'
  }
  if (type === 'ajlbName') {
    return '案件类别'
  }
  if (type === 'ajlb1Name') {
    return '案件类别1'
  }
  if (type === 'ajlb2Name') {
    return '案件类别2'
  }
  if (type === 'ajxz') {
    return '案件性质'
  }
  if (type === 'fadzssxqName') {
    return '案发地址'
  }
  if (type === 'zagjName') {
    return '作案工具'
  }
  if (type === 'jzzasdName') {
    return '作案手段'
  }
  if (type === 'syhsjly') {
    return '食药环类型'
  }
  if (type === 'whcd') {
    return '危害程度'
  }
  if (type === 'fasjsx') {
    return '发案时间'
  }
  if (type === 'xwbx') {
    return '行为表现'
  }
  if (type === 'qklj') {
    return '前科劣迹'
  }
  if (type === 'rjjw') {
    return '人际交往'
  }
}

/* 专题预警搜索条件类型 */
export function getWarnCondType() {
  return [
    { value: 1, label: '等于' },
    { value: 2, label: '不等于' },
    { value: 3, label: '大于' },
    { value: 4, label: '大于等于' },
    { value: 5, label: '小于' },
    { value: 6, label: '小于等于' },
    { value: 7, label: '包含' },
    { value: 8, label: '不包含' }
  ]
}

/* 专题预警搜索条件类型 text */
export function getWarnCondTypeText(type) {
  if (type === 1) {
    return '等于'
  }
  if (type === 2) {
    return '不等于'
  }
  if (type === 3) {
    return '大于'
  }
  if (type === 4) {
    return '大于等于'
  }
  if (type === 5) {
    return '小于'
  }
  if (type === 6) {
    return '小于等于'
  }
  if (type === 7) {
    return '包含'
  }
  if (type === 8) {
    return '不包含'
  }
}

export function getWhcdList() {
  return [
    { label: '特大', value: '1' },
    { label: '重大', value: '2' },
    { label: '一般', value: '3' },
    { label: '轻微', value: '4' },
    { label: '其它', value: '9' }
  ]
}

// 危害程度
export function getWhcdText(type) {
  if (type === '1') {
    return '特大'
  }
  if (type === '2') {
    return '重大'
  }
  if (type === '3') {
    return '一般'
  }
  if (type === '4') {
    return '轻微'
  }
  if (type === '9') {
    return '其它'
  }
}

/* 督办等级 */
export function getDBLevel() {
  return [
    {
      code: '1', code_name: '中央督办'
    },
    {
      code: '2', code_name: '部督办'
    },
    {
      code: '3', code_name: '厅督办'
    },
    {
      code: '4', code_name: '市督办'
    },
    {
      code: '5', code_name: '一般案件'
    },
    {
      code: '9', code_name: '其他'
    }
  ]
}

/* 督办等级 text */
export function getDBLevelText(type) {
  if (type === '1') {
    return '中央督办'
  }
  if (type === '2') {
    return '部督办'
  }
  if (type === '3') {
    return '厅督办'
  }
  if (type === '4') {
    return '市督办'
  }
  if (type === '5') {
    return '一般案件'
  }
  if (type === '9') {
    return '其他'
  }
}

// 民族
export function getMZSelect() {
  return [{
    label: '汉族', value: '01'
  }, {
    label: '蒙古族', value: '02'
  }, {
    label: '回族', value: '03'
  }, {
    label: '藏族', value: '04'
  }, {
    label: '维吾尔族', value: '05'
  }, {
    label: '苗族', value: '06'
  }, {
    label: '彝族', value: '07'
  }, {
    label: '壮族', value: '08'
  }, {
    label: '布依族', value: '09'
  }, {
    label: '朝鲜族', value: '10'
  }, {
    label: '满族', value: '11'
  }, {
    label: '侗族', value: '12'
  }, {
    label: '瑶族', value: '13'
  }, {
    label: '白族', value: '14'
  }, {
    label: '土家族', value: '15'
  }, {
    label: '哈尼族', value: '16'
  }, {
    label: '哈萨克族', value: '17'
  }, {
    label: '傣族', value: '18'
  }, {
    label: '黎族', value: '19'
  }, {
    label: '傈僳族', value: '20'
  }, {
    label: '佤族', value: '21'
  }, {
    label: '畲族', value: '22'
  }, {
    label: '高山族', value: '23'
  }, {
    label: '拉祜族', value: '24'
  }, {
    label: '水族', value: '25'
  }, {
    label: '东乡族', value: '26'
  }, {
    label: '纳西族', value: '27'
  }, {
    label: '景颇族', value: '28'
  }, {
    label: '柯尔克孜族', value: '29'
  }, {
    label: '土族', value: '30'
  }, {
    label: '达斡尔族', value: '31'
  }, {
    label: '仫佬族', value: '32'
  }, {
    label: '羌族', value: '33'
  }, {
    label: '布朗族', value: '34'
  }, {
    label: '撒拉族', value: '35'
  }, {
    label: '毛南族', value: '36'
  }, {
    label: '仡佬族', value: '37'
  }, {
    label: '锡伯族', value: '38'
  }, {
    label: '阿昌族', value: '39'
  }, {
    label: '普米族', value: '40'
  }, {
    label: '塔吉克族', value: '41'
  }, {
    label: '怒族', value: '42'
  }, {
    label: '乌孜别克族', value: '43'
  }, {
    label: '俄罗斯族', value: '44'
  }, {
    label: '鄂温克族', value: '45'
  }, {
    label: '崩龙族', value: '46'
  }, {
    label: '保安族', value: '47'
  }, {
    label: '裕固族', value: '48'
  }, {
    label: '京族', value: '49'
  }, {
    label: '塔塔尔族', value: '50'
  }, {
    label: '独龙族', value: '51'
  }, {
    label: '鄂伦春族', value: '52'
  }, {
    label: '赫哲族', value: '53'
  }, {
    label: '门巴族', value: '54'
  }, {
    label: '珞巴族', value: '55'
  }, {
    label: '基诺族', value: '56'
  }, {
    label: '其它', value: '57'
  }, {
    label: '入籍族', value: '58'
  }, {
    label: '外国血统', value: '98'
  }, {
    label: '不祥', value: '99'
  }]
}

// 文化程度
export function getWHCDSelect() {
  return [{
    label: '研究生', value: '10'
  }, {
    label: '研究生毕业', value: '11'
  }, {
    label: '研究生肄业', value: '19'
  }, {
    label: '大学本科', value: '20'
  }, {
    label: '大学毕业', value: '21'
  }, {
    label: '相当大学毕业', value: '28'
  }, {
    label: '大学肄业', value: '29'
  }, {
    label: '专科毕业', value: '31'
  }, {
    label: '大学专科和专科学校', value: '33'
  }, {
    label: '相当专科毕业', value: '38'
  }, {
    label: '专科肄业', value: '39'
  }, {
    label: '中等专业学校或中等技术学校', value: '40'
  }, {
    label: '中专毕业', value: '41'
  }, {
    label: '中技毕业', value: '42'
  }, {
    label: '相当中专或中技毕业', value: '48'
  }, {
    label: '中专或中技肄业', value: '49'
  }, {
    label: '技工学校', value: '50'
  }, {
    label: '技工学校毕业', value: '51'
  }, {
    label: '技工学校肄业', value: '59'
  }, {
    label: '高中', value: '60'
  }, {
    label: '高中毕业', value: '61'
  }, {
    label: '职业高中毕业', value: '62'
  }, {
    label: '农业高中毕业', value: '63'
  }, {
    label: '相当高中毕业', value: '68'
  }, {
    label: '高中肄业', value: '69'
  }, {
    label: '初中', value: '70'
  }, {
    label: '初中毕业', value: '71'
  }, {
    label: '职业初中毕业', value: '72'
  }, {
    label: '农业初中毕业', value: '73'
  }, {
    label: '相当初中毕业', value: '78'
  }, {
    label: '初中肄业', value: '79'
  }, {
    label: '小学', value: '80'
  }, {
    label: '小学毕业', value: '81'
  }, {
    label: '相当小学毕业', value: '88'
  }, {
    label: '小学肄业', value: '89'
  }, {
    label: '学龄前儿童', value: '99'
  }, {
    label: '文盲或半文盲', value: '90'
  }]
}

// 婚姻状况
export function getHYZKSelect() {
  return [{
    label: '未婚', value: '10'
  }, {
    label: '已婚', value: '20'
  }, {
    label: '初婚', value: '21'
  }, {
    label: '再婚', value: '22'
  }, {
    label: '复婚', value: '23'
  }, {
    label: '丧偶', value: '30'
  }, {
    label: '离婚', value: '40'
  }, {
    label: '未说明的婚姻状况', value: '90'
  }]
}

// 岗位
export function getZYLBSelect() {
  return [{
    label: '法学研究人员', value: '014'
  }, {
    label: '教育学研究人员', value: '015'
  }, {
    label: '土木建筑工程技术人员', value: '032'
  }, {
    label: '化工工程技术人员', value: '035'
  }, {
    label: '冶金工程技术人员', value: '036'
  }, {
    label: '矿业工程技术人员', value: '037'
  }, {
    label: '工业管理技术人员', value: '038'
  }, {
    label: '测绘、水文技术人员', value: '039'
  }, {
    label: '气象、地震技术人员', value: '040'
  }, {
    label: '地质工程技术人员', value: '041'
  }, {
    label: '农业技术人员', value: '044'
  }, {
    label: '林业技术人员', value: '045'
  }, {
    label: '兽医', value: '046'
  }, {
    label: '其它工程技术人员和农林技术人员', value: '049'
  }, {
    label: '科学技术管理人员和辅助人员', value: '050'
  }, {
    label: '科学技术管理人员', value: '051'
  }, {
    label: '飞机机械技术人员', value: '062'
  }, {
    label: '船舶指挥和领航人员', value: '063'
  }, {
    label: '船舶轮机技术人员', value: '064'
  }, {
    label: '其它飞机、船舶技术人员', value: '069'
  }, {
    label: '卫生技术人员', value: '070'
  }, {
    label: '城市街道群防员', value: '074'
  }, {
    label: '农村乡村卫生技术人员', value: '075'
  }, {
    label: '法律工作人员', value: '100'
  }, {
    label: '考古和文物工作人员', value: '147'
  }, {
    label: '中国共产党基层组织负责人', value: '222'
  }, {
    label: '共青团、工会、妇联负责人', value: '223'
  }, {
    label: '售货人员', value: '410'
  }, {
    label: '其它商业工作人员', value: '490'
  }, {
    label: '其他服务性工作人员', value: '599'
  }, {
    label: '菜农', value: '613'
  }, {
    label: '林业劳动者', value: '620'
  }, {
    label: '其他化学工人', value: '739'
  }, {
    label: '其他生产工人、运输工人和有关人', value: '990'
  }, {
    label: '科学技术辅助人员', value: '052'
  }, {
    label: '农业劳动者', value: '610'
  }, {
    label: '电气和电子工程技术人员', value: '033'
  }, {
    label: '轻工、纺织技术人员', value: '042'
  }, {
    label: '飞机和船舶技术人员', value: '060'
  }, {
    label: '粮农', value: '611'
  }, {
    label: '卫生技术人员', value: '080'
  }, {
    label: '农副产品收购人员', value: '431'
  }, {
    label: '机械工程技术人员', value: '034'
  }, {
    label: '食品、饮料技术人员', value: '043'
  }, {
    label: '飞机驾驶员和领航人员', value: '061'
  }]
}
export function getXBSelect() {
  return [{
    label: '男', value: '1'
  }, {
    label: '女', value: '2'
  }, {
    label: '其它', value: '0'
  }]
}
/* 线索类型 text */
export function getSYHText(type) {
  if (type === '1') {
    return '食品'
  }
  if (type === '2') {
    return '药品'
  }
  if (type === '3') {
    return '环境'
  }
  /*
  if (type === '4') {
    return '食药'
  }*/
}
// 案件状态
export function getAJZTSelect() {
  return [{
    label: '未受理', value: '001'
  }, {
    label: '受理', value: '101'
  }, {
    label: '立案', value: '102'
  }, {
    label: '不予立案', value: '103'
  }, {
    label: '破案', value: '104'
  }, {
    label: '销案', value: '105'
  }, {
    label: '转治安案件', value: '106'
  }, {
    label: '结案', value: '107'
  }, {
    label: '归档', value: '108'
  }, {
    label: '移送', value: '109'
  }, {
    label: '调查取证', value: '202'
  }, {
    label: '不予处理', value: '203'
  }, {
    label: '终止调查', value: '204'
  }, {
    label: '转刑事案件', value: '205'
  }, {
    label: '调解', value: '208'
  }, {
    label: '处罚', value: '209'
  }, {
    label: '复议', value: '300'
  }, {
    label: '诉讼', value: '301'
  }, {
    label: '撤销行政处罚', value: '302'
  }, {
    label: '当场处罚', value: '303'
  }, {
    label: '简易调解', value: '304'
  }]
}

// 案件类别
export function getSYHFLLBList() {
  return [{
    value: '1', label: '食品',
    children: [{
      value: '10', label: '涉肉类'
    }, {
      value: '11', label: '涉盐犯罪案件'
    }, {
      value: '12', label: '假烟案件'
    }, {
      value: '13', label: '假酒案件'
    },
    // {
    //   value: '14', label: '假酒案件'
    // },
    {
      value: '15', label: '涉保健品案件'
    }, {
      value: '16', label: '农资类',
      children: [{
        value: '1600', label: '种子案件',
        children: [{
          value: '160001', label: '假高粱种子案'
        }, {
          value: '160002', label: '假马铃薯种子案'
        }, {
          value: '160003', label: '玉米种子案'
        }, {
          value: '160004', label: '辣椒种苗案'
        }, {
          value: '160005', label: '胡萝卜种子案'
        }, {
          value: '160006', label: '其他'
        }]
      }, {
        value: '1601', label: '农药案件'
      }, {
        value: '1602', label: '肥料案件'
      }, {
        value: '1603', label: '兽药案件'
      }, {
        value: '1604', label: '饲料案件'
      }, {
        value: '1605', label: '其他'
      }]

    }, {
      value: '17', label: '涉面粉'
    }, {
      value: '18', label: '水'
    }, {
      value: '19', label: '其他'
    }]
  }, {
    value: '2', label: '药品',
    children: [{
      value: '201', label: '针剂类'
    }, {
      value: '202', label: '减肥药类'
    }, {
      value: '203', label: '鼻炎药类'
    }, {
      value: '204', label: '高血压类'
    }, {
      value: '205', label: '抗癌药类'
    }, {
      value: '206', label: '假化肥类'
    }, {
      value: '207', label: '假农药类'
    }, {
      value: '208', label: '其他'
    }]
  }, {
    value: '3', label: '环境'
  }]
}

/* 案件类别 text */
export function getAJLBText(type) {
  if (type === '1') return '食品'
  if (type === '10') return '涉肉类'
  if (type === '11') return '涉盐犯罪案件'
  if (type === '12') return '假烟案件'
  if (type === '13') return '假酒案件'
  if (type === '14') return '假酒案件'
  if (type === '15') return '涉保健品案件'
  if (type === '16') return '农资类'
  if (type === '1600') return '种子案件'
  if (type === '160001') return '假高粱种子案'
  if (type === '160002') return '假马铃薯种子案'
  if (type === '160003') return '玉米种子案'
  if (type === '160004') return '辣椒种苗案'
  if (type === '160005') return '胡萝卜种子案'
  if (type === '160006') return '其他'
  if (type === '1601') return '农药案件'
  if (type === '1602') return '肥料案件'
  if (type === '1603') return '兽药案件'
  if (type === '1604') return '饲料案件'
  if (type === '1605') return '其他'
  if (type === '17') return '涉面粉'
  if (type === '18') return '水'
  if (type === '19') return '其他'
  if (type === '2') return '药品'
  if (type === '201') return '针剂类'
  if (type === '202') return '减肥药类'
  if (type === '203') return '鼻炎药类'
  if (type === '204') return '高血压类'
  if (type === '205') return '抗癌药类'
  if (type === '206') return '假化肥类'
  if (type === '207') return '假农药类'
  if (type === '208') return '其他'
  if (type === '3') return '环境'
}

// 案件属性
export function getAJSXList() {
  return [{
    value: '01', label: '涉黑'
  }, {
    value: '02', label: '涉网'
  }, {
    value: '03', label: '集团'
  }, {
    value: '04', label: '涉外'
  }, {
    value: '05', label: '涉黄'
  }, {
    value: '06', label: '涉毒'
  }, {
    value: '07', label: '涉赌'
  }, {
    value: '08', label: '涉枪'
  }, {
    value: '09', label: '恐怖'
  }, {
    value: '10', label: '命案'
  }, {
    value: '11', label: '涉邪'
  }, {
    value: '12', label: '经侦'
  }, {
    value: '13', label: '涉爆'
  }, {
    value: '14', label: '交通'
  }, {
    value: '15', label: '涉林'
  }, {
    value: '99', label: '其他'
  }]
}

// 涉事列表
export function getSslb() {
  return [
    { key: '108', name: '法轮功' },
    { key: '100', name: '政治事件' },
    { key: '101', name: '藏独' },
    { key: '600', name: '重大警情' },
    { key: '102', name: '疆独' },
    { key: '103', name: '台独' },
    { key: '104', name: '影响国家稳定' },
    { key: '105', name: '敌对组织' },
    { key: '106', name: '邪教' },
    { key: '107', name: '境外非法组织' },
    { key: '110', name: '引发民族矛盾' },
    { key: '202', name: '袭击平民' },
    { key: '307', name: '涉重犯罪' },
    { key: '111', name: '危害社会稳定' },
    { key: '112', name: '维权' },
    { key: '203', name: '袭击党政机关' },
    { key: '308', name: '历史遗留' },
    { key: '204', name: '袭击驻华机构' },
    { key: '309', name: '污染居住环境' },
    { key: '206', name: '利用毒剂袭击' },
    { key: '302', name: '工程建设' },
    { key: '200', name: '暴力恐怖事件' },
    { key: '301', name: '改革措施' },
    { key: '305', name: '涉军问题' },
    { key: '420', name: '围绕重大活动' },
    { key: '500', name: '矛盾排查' },
    { key: '207', name: '利用核能袭击' },
    { key: '303', name: '公职人员' },
    { key: '400', name: '综合性事件' },
    { key: '109', name: '影响高校稳定' },
    { key: '201', name: '劫持国家人员' },
    { key: '306', name: '意外事故' },
    { key: '208', name: '大规模打压' },
    { key: '300', name: '群体性事件' },
    { key: '304', name: '涉农问题' },
    { key: '410', name: '围绕敏感时点' },
    { key: '205', name: '劫持交通工具' },
    { key: '310', name: '新型社会问题' },
    { key: '399', name: '其他' }
  ]
}

//
export function getJjcd() {
  return [
    { key: '1', name: '一般' },
    { key: '4', name: '重要' },
    { key: '8', name: '紧急' }
  ]
}

export function getBgcx() {
  return [
    { key: '0', name: '原报' },
    { key: '1', name: '续报' }
  ]
}

export function getBxxs() {
  return [
    { key: '01', name: '上访' },
    { key: '02', name: '进京上访' },
    { key: '10', name: '请愿' },
    { key: '11', name: '静坐' },
    { key: '20', name: '冲击党政机关' },
    { key: '21', name: '围堵要害部门' },
    { key: '22', name: '聚众阻塞交通' },
    { key: '23', name: '聚众滋事' },
    { key: '24', name: '串联聚会' },
    { key: '25', name: '非法游行' },
    { key: '26', name: '非法示威' },
    { key: '31', name: '罢工' },
    { key: '32', name: '罢课' },
    { key: '33', name: '罢市' },
    { key: '34', name: '聚众械斗' },
    { key: '35', name: '聚众哄抢' },
    { key: '36', name: '打砸抢烧' },
    { key: '37', name: '骚乱' },
    { key: '38', name: '涉枪涉爆' },
    { key: '99', name: '其他' }
  ]
}

export function getAsddlb() {
  return [
    { key: '01', name: '城镇' },
    { key: '02', name: '农村' },
    { key: '03', name: '党政机关' },
    { key: '04', name: '交通枢纽' },
    { key: '05', name: '大型活动场所' },
    { key: '06', name: '要害部位' },
    { key: '07', name: '旅游景点' },
    { key: '09', name: '企事业单位' },
    { key: '10', name: '学校' },
    { key: '11', name: '车站码头' },
    { key: '12', name: '金融机构' },
    { key: '99', name: '其他' }
  ]
}

// 车辆状态
export function getCarStatus() {
  return [
    { label: '正常', value: 'A' },
    { label: '转出', value: 'B' },
    { label: '被盗抢', value: 'C' },
    { label: '停驶', value: 'D' },
    { label: '注销', value: 'E' },
    { label: '违法未处理', value: 'G' },
    { label: '海关监管', value: 'H' },
    { label: '事故未处理', value: 'I' },
    { label: '嫌疑车', value: 'J' },
    { label: '查封', value: 'K' },
    { label: '暂扣', value: 'L' },
    { label: '强制注销', value: 'M' },
    { label: '事故逃逸', value: 'N' },
    { label: '锁定', value: 'O' },
    { label: '达到报废标准公告牌证作废', value: 'P' },
    { label: '逾期未检验', value: 'Q' }
  ]
}

export function getSfzmmc() {
  return [
    { value: 'A', label: '居民身份证' },
    { value: 'B', label: '组织机构代码证书' },
    { value: 'C', label: '军官证' },
    { value: 'D', label: '士兵证' },
    { value: 'E', label: '军官离退休证' },
    { value: 'F', label: '境外人员身份证明' },
    { value: 'G', label: '外交人员身份证明' },
    { value: 'H', label: '居民户口簿' },
    { value: 'I', label: '外国人永久居留身份证' },
    { value: 'J', label: '单位注销证明' },
    { value: 'K', label: '居住暂住证明' },
    { value: 'L', label: '驻华机构证明' },
    { value: 'M', label: '临时居民身份证' },
    { value: 'N', label: '统一社会信用代码' },
    { value: 'P', label: '个体工商户营业执照注册号' }
  ]
}

export function getCsys() {
  return [
    { value: 'A', label: '白' },
    { value: 'B', label: '灰' },
    { value: 'C', label: '黄' },
    { value: 'D', label: '粉' },
    { value: 'E', label: '红' },
    { value: 'F', label: '紫' },
    { value: 'G', label: '绿' },
    { value: 'H', label: '蓝' },
    { value: 'I', label: '棕' },
    { value: 'J', label: '黑' }
  ]
}

export function getHpzl() {
  return [
    { value: '01', label: '大型汽车' },
    { value: '02', label: '小型汽车' },
    { value: '03', label: '使馆汽车' },
    { value: '04', label: '领馆汽车' },
    { value: '05', label: '境外汽车' },
    { value: '06', label: '外籍汽车' },
    { value: '07', label: '普通摩托车' },
    { value: '08', label: '轻便摩托车' },
    { value: '09', label: '使馆摩托车' },
    { value: '10', label: '领馆摩托车' },
    { value: '11', label: '境外摩托车' },
    { value: '12', label: '外籍摩托车' },
    { value: '13', label: '低速车' },
    { value: '14', label: '拖拉机' },
    { value: '15', label: '挂车' },
    { value: '16', label: '教练汽车' },
    { value: '17', label: '教练摩托车' },
    { value: '18', label: '试验汽车' },
    { value: '19', label: '试验摩托车' },
    { value: '20', label: '临时入境汽车' },
    { value: '21', label: '临时入境摩托车' },
    { value: '22', label: '临时行驶车' },
    { value: '23', label: '警用汽车' },
    { value: '24', label: '警用摩托' },
    { value: '25', label: '原农机号牌' },
    { value: '26', label: '香港入出境车' },
    { value: '27', label: '澳门入出境车' },
    { value: '31', label: '武警号牌' },
    { value: '32', label: '军队号牌' },
    { value: '41', label: '无号牌' },
    { value: '42', label: '假号牌' },
    { value: '43', label: '挪用号牌' },
    { value: '51', label: '大型新能源汽车' },
    { value: '52', label: '小型新能源汽车' },
    { value: '99', label: '其他号牌' }
  ]
}

export function getZjxy() {
  return [
    { value: '00', label: '无宗教信仰' },
    { value: '10', label: '佛教' },
    { value: '20', label: '喇嘛教' },
    { value: '30', label: '道教' },
    { value: '40', label: '天主教' },
    { value: '50', label: '基督教' },
    { value: '60', label: '东正教' },
    { value: '70', label: '伊斯兰教' },
    { value: '99', label: '其他' }
  ]
}

export function getMzValue(name) {
  const list = getMZSelect()
  const obj = list.find((item) => {
    return item.label === name
  })
  return obj ? obj.value : '-9'
}
export function getWhcdValue(name) {
  const list = getWHCDSelect()
  console.info(list)
  const obj = list.find((item) => {
    return item.label === name
  })
  return obj ? obj.value : '-9'
}
export function getHyzkValue(name) {
  const list = getHYZKSelect()
  const obj = list.find((item) => {
    return item.label === name
  })
  return obj ? obj.value : '-9'
}
export function getZylbValue(name) {
  const list = getZYLBSelect()
  const obj = list.find((item) => {
    return item.label === name
  })
  return obj ? obj.value : '-9'
}
export function getXbValue(name) {
  const list = getXBSelect()
  const obj = list.find((item) => {
    return item.label === name
  })
  return obj ? obj.value : '-9'
}

// 服务类型
export function getFwlx() {
  return [
    { value: '1', label: '微信' },
    { value: '2', label: 'QQ' },
    { value: '3', label: '手机号码' },
    { value: '4', label: '微博' },
    { value: '5', label: '邮箱' },
    { value: '6', label: '固定电话' },
    { value: '7', label: '银行卡' }
  ]
}
// 服务类型
export function getFwlxText(type) {
  if (type === '1') {
    return '微信'
  }
  if (type === '2') {
    return 'QQ'
  }
  if (type === '3') {
    return '手机号码'
  }
  if (type === '4') {
    return '微博'
  }
  if (type === '5') {
    return '邮箱'
  }
  if (type === '6') {
    return '固定电话'
  }
  if (type === '7') {
    return '银行卡'
  }
}
// 商贩信息审核状态
export function getComArchivesApproveStatus(type) {
  if (type === '1') {
    return '待审批'
  }
  if (type === '2') {
    return '同意'
  }
  if (type === '3') {
    return '拒绝'
  }
}

// 试题类型
export function questionTypeAll(all) { // 有参数 包含全部
  if (all === 'all') {
    return [{
      value: '0',
      label: '全部'
    }, {
      value: '1',
      label: '单选类'
    }, {
      value: '2',
      label: '多选类'
    }, {
      value: '3',
      label: '填空类'
    }, {
      value: '4',
      label: '判断类'
    }]
  } else {
    return [{
      value: '1',
      label: '单选类'
    }, {
      value: '2',
      label: '多选类'
    }, {
      value: '3',
      label: '填空类'
    }, {
      value: '4',
      label: '判断类'
    }]
  }
}

