<template>
  <section>
    <div class="ImportInfo">
      <title-pub :title="title" url=""></title-pub>
      <el-table :data="clxxData" style="width: 100%;" v-loading="carLoading" max-height="156">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" class="demo-table-expand" label-width="92px">
            <el-row>
              <el-col :span="8">
                <el-form-item label="号牌种类：">
                  <span>{{getLabelByValue(hpzlList,props.row.hpzl)}}</span>
                </el-form-item>
                <el-form-item label="是否抵押：">
                  <span v-if="props.row.dybj">已抵押</span>
                  <span v-else>未抵押</span>
                </el-form-item>
                <el-form-item label="车辆识别号：" label-width="108px">
                  <span>{{props.row.clsbdh}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="身份证明名称：" label-width="124px">
                  <span>{{getLabelByValue(sfzmmcList,props.row.sfzmmc)}}</span>
                </el-form-item>
                <el-form-item label="发动机号：">
                  <span>{{props.row.fdjh}}</span>
                </el-form-item>
                <el-form-item label="发动机序号：" label-width="108px">
                  <span>{{props.row.fdjxh}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="身份证号码：" label-width="108px">
                  <span>{{props.row.sfzmhm}}</span>
                </el-form-item>
                <el-form-item label="发证机关：">
                  <span>{{props.row.fzjg}}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          </template>
        </el-table-column>
        <el-table-column type="index" label="序号" width="52"></el-table-column>
        <el-table-column prop="clpp" label="车辆品牌"></el-table-column>
        <el-table-column prop="clxh" label="车辆型号"></el-table-column>
        <el-table-column prop="csys" label="车身颜色">
          <template slot-scope="scope">
            {{getLabelByValue(csysList,scope.row.csys)}}
          </template>
        </el-table-column>
        <el-table-column prop="hphm" label="号牌号码"></el-table-column>
        <el-table-column prop="syr" label="机动车所有人"></el-table-column>
        <el-table-column prop="zt" label="机动车状态">
          <template slot-scope="scope">
            {{getLabelByValue(jdcztsList,scope.row.zt)}}
          </template>
        </el-table-column>
      </el-table>
      <el-row>
        <el-col :span="24" class="toolbar">
          <el-pagination v-if="total > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-sizes="[5,10,15,20]" @size-change="handleSizeChange"
                        :page-size="pageSize" :total="total" :current-page="page" style="float:right;">
          </el-pagination>
        </el-col>
      </el-row>
    </div>
  </section>
</template>
<script>
import titlePub from './titlePub'
import {
  getCarStatus, getSfzmmc, getCsys, getHpzl
} from '@/utils/codetotext'
// import {
//   carByCardId
// } from '@/api/personSearch/personSearch'
export default {
  props: ['cardId'],
  name: 'index',
  components: {
    titlePub
  },
  data() {
    return {
      title: '车辆信息',
      curUser: {},
      paramDept: sessionStorage.getItem('depToken') ? JSON.parse(sessionStorage.getItem('depToken'))[0].areaCode : '',
      // cardId: '152224199005230516',
      clxxData: [],
      carDetail: {},
      carLoading: false, // 车辆loading
      pageSize: 5,
      page: 1,
      total: 0,
      csysList: getCsys(), // 车身颜色
      hpzlList: getHpzl(), // 号牌种类
      sfzmmcList: getSfzmmc(), // 身份证明名称
      jdcztsList: getCarStatus(), // 机动车状态
      cardNumber: '' // 存储身份证号
    }
  },
  watch: {
    cardId(val) {
      this.cardNumber = val
      this.init()
    }
  },
  methods: {
    handleClick(tab, event) {
      // console.log(tab, event)
    },
    init() {
      this.handleClxx(true)
    },
    handleClxx(flag) {
      // this.carLoading = true
      // carByCardId({
      //   method: 'Query',
      //   cardId: this.cardNumber,
      //   userCardId: this.curUser.cardNumber,
      //   userCertId: this.curUser.cardNumber,
      //   userDept: this.paramDept,
      //   userName: this.curUser.realName,
      //   pageSize: this.pageSize,
      //   pageNum: flag ? 1 : this.page
      // }).then((res) => {
      //   this.carLoading = false
      //   this.clxxClicked = true
      //   if (res.code === '000000') {
      //     this.clxxData = res.data.list
      //     this.pageSize = res.data.pageSize
      //     this.total = res.data.totalCount
      //     this.$resetSetItem('t6', this.total) // 将总数存在session中
      //   } else {
      //     this.$resetSetItem('t6', 0) // 将总数存在session中
      //   }
      // }).catch(() => {
      //   this.carLoading = false
      // })
      this.clxxClicked = true
      const res = {
        'success': true,
        'code': '000000',
        'message': 'OK',
        'data': {
          'pageSize': 5,
          'pageNum': 1,
          'totalCount': 2,
          'list': [{
            'fzjg': '西安市公安局交通警察支队车辆管理所',
            'updateDate': '2019-06-25 15:58:42',
            'csys': 'E',
            'clpp': '吉利美日牌',
            'updateUser': '',
            'hpzl': '02',
            'clsbdh': 'LTVBJ2223600*****',
            'syr': '张X',
            'sfzmmc': 'A',
            'fdjxh': 'JLE-4G18TD',
            'fdjh': '4E-4110',
            'dydj': false,
            'clxh': 'ZSP92L-BEPHKC',
            'sfzmhm': '610111197907130277',
            'zt': 'A',
            'cjdwName': '',
            'id': 999,
            'hphm': '蒙A12D32',
            'hpzlName': '小型汽车',
            'createDate': '2019-06-25 15:58:42'
          }, {
            'fzjg': '西安市公安局交通警察支队车辆管理所',
            'updateDate': '2019-06-25 15:58:41',
            'csys': 'A',
            'clpp': '吉利美日牌',
            'updateUser': '',
            'hpzl': '02',
            'clsbdh': 'LTVBJ2223600*****',
            'syr': '张X',
            'sfzmmc': 'A',
            'fdjxh': 'JLE-4G18TD',
            'fdjh': '4D-4108',
            'dydj': false,
            'clxh': 'GRX122L-AETQKC',
            'sfzmhm': '610111197907130277',
            'zt': 'A',
            'cjdwName': '',
            'id': 998,
            'hphm': '蒙AUT055',
            'hpzlName': '小型汽车',
            'createDate': '2019-06-25 15:58:41'
          }]
        }
      }
      if (res.code === '000000') {
        this.clxxData = res.data.list
        this.pageSize = res.data.pageSize
        this.total = res.data.totalCount
        this.$resetSetItem('t6', this.total) // 将总数存在session中
      } else {
        this.$resetSetItem('t6', 0) // 将总数存在session中
      }
    },
    handleCurrentChange(val) { // 车辆信息
      this.page = val
      this.handleClxx(false)
    },
    handleSizeChange(val) {
      this.page = 1
      this.pageSize = val
      this.handleClxx(false)
    },
    getLabelByValue(array, value) {
      var result = ''
      array.forEach(item => {
        if (item.value === value) {
          result = item.label
        }
      })
      return result
    },
    formatTime(date) {
      if (date) {
        date = this.$handlerDateTime(date)
        return this.$parseTime(new Date(date), '{y}-{m}-{d} {h}:{i}')
      }
      return ''
    }
  },
  mounted() {
    this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
    this.cardNumber = this.cardId
    this.init()
  }
}
</script>
<style  rel="stylesheet/scss" lang="scss">
</style>
