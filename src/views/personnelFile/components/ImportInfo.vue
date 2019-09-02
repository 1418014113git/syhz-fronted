<template>
<!-- 重点类别信息 -->
  <div class="ImportInfo" v-loading="loading">
    <title-pub :title="title" url=""></title-pub>
    <ul class="ul">
      <li v-for="(item,index) in list" :key="index">
        <p class="name" :class="{'yc':item.isZC===false}">{{item.name}}</p>
        <p class="status" v-if="item.isZC===true">正常</p>
      </li>
    </ul>
  </div>
</template>

<script>
import titlePub from './titlePub'
export default {
  props: ['cardId'],
  name: 'ImportInfo',
  data() {
    return {
      loading: false, // 页面加载进度条
      title: '重点类别信息',
      list: [
        { name: '在逃人员', type: '03', isZC: 1 },
        { name: '重点上访人员', type: '07', isZC: 1 },
        { name: '肇事肇祸精神病人', type: '06', isZC: 1 },
        { name: '涉毒人员', type: '04', isZC: 1 },
        { name: '刑事犯罪前科人员', type: '05', isZC: 1 },
        { name: '其他', type: '', isZC: 1 }
      ],
      typeList: ['03', '04', '05', '06', '07'],
      infoData: // 字段 LBBJ:'04,05'，表示异常类型，（ 其他：（ 01：涉恐人员，02：涉稳人员是大类，还有很多的小类），03：在逃人员，04：涉毒人员，05：刑事犯罪前科人员，06：肇事肇祸精神病人 07：重点上访人员）
        {
          HJDQH: '',
          BARDH1: '',
          ZZ: '',
          BAR1: '',
          SSGAJGDM: '',
          ZDRYBH: '',
          SQRDWDM: '',
          SG: '',
          CSD: '',
          SSPCS: '',
          RYLB: '',
          LBBJ: '',
          HJDXZ: '',
          BKJB: '',
          FWCS: '',
          HYZK: '',
          ZDRLY: '',
          SQSY: '',
          SFZH: '',
          ZZXZ: '',
          XB: '',
          MZ: '',
          CSRQ: '',
          XL: '',
          XM: '',
          ZZSSXQ: '',
          HCID: '',
          ZY: ''
        },
      cardNumber: '' // 存储身份证号
    }
  },
  components: {
    titlePub
  },
  watch: {
    cardId(val) {
      this.cardNumber = val
      this.getzdryhc()
    }
  },
  methods: {
    // 人员重点类型查询
    getzdryhc() { // 正式数据
      // this.loading = true
      // var param = {
      //   'XM': '', 'SFZH': this.cardNumber, 'XB': '', 'CSRQ': '', 'MZ': '',
      //   'ZZ': '', 'QFJG': '', 'YXQX': '', 'HCDD': '', 'HCSJ': '', 'BZ': '', 'HCLY': ''
      // }
      // this.$zdryhc('ryhc', param).then(res => {
      //   this.loading = false
      //   if (res.data) {
      //     this.infoData = res.data
      //     if (!this.infoData.XL || this.infoData.XL === '正常') {
      //       this.list.forEach(item => {
      //         item.isZC = true
      //       })
      //     } else {
      //       var arry = this.infoData.LBBJ ? this.infoData.LBBJ.split(',') : []
      //       if (arry.length > 0) {
      //         for (var n = 0; n < arry.length; n++) { // 去掉数组里的空值。
      //           if (arry[n] === '') {
      //             arry.splice(n, 1)
      //             n = n - 1
      //           }
      //         }
      //         for (var i = 0; i < arry.length; i++) {
      //           if (this.typeList.indexOf(arry[i]) === -1) {
      //             this.list[5].type = arry[i]
      //           }
      //         }
      //         for (var j = 0; j < this.list.length; j++) {
      //           if (arry.indexOf(this.list[j].type) > -1) {
      //             this.list[j].isZC = false
      //           } else {
      //             this.list[j].isZC = true
      //           }
      //         }
      //       } else {
      //         this.list.forEach(item => {
      //           item.isZC = true
      //         })
      //       }
      //     }
      //   }
      // }).catch(() => {
      //   this.loading = false
      // })

      // 测试数据
      this.infoData = {
        'HJDQH': '610111',
        'BARDH1': '',
        'ZZ': '',
        'BAR1': '',
        'SSGAJGDM': '',
        'ZDRYBH': '610111180500542643',
        'SQRDWDM': '',
        'SG': '',
        'CSD': '',
        'SSPCS': '',
        'RYLB': '01',
        'LBBJ': '33,',
        'HJDXZ': '',
        'BKJB': '',
        'FWCS': '',
        'HYZK': '',
        'ZDRLY': '02',
        'SQSY': '',
        'SFZH': '610111197907130277',
        'ZZXZ': '',
        'XB': '1',
        'MZ': '01',
        'CSRQ': '19790713',
        'XL': '本地关注人员',
        'XM': '张迪',
        'ZZSSXQ': '',
        'HCID': '8ae48ff8684f95ed016cbcdd5adb47a2',
        'ZY': ''
      }
      if (!this.infoData.XL || this.infoData.XL === '正常') {
        this.list.forEach(item => {
          item.isZC = true
        })
      } else {
        var arry = this.infoData.LBBJ ? this.infoData.LBBJ.split(',') : []
        if (arry.length > 0) {
          for (var n = 0; n < arry.length; n++) {
            if (arry[n] === '') {
              arry.splice(n, 1)
              n = n - 1
            }
          }
          for (var i = 0; i < arry.length; i++) {
            if (this.typeList.indexOf(arry[i]) === -1) {
              this.list[5].type = arry[i]
            }
          }
          for (var j = 0; j < this.list.length; j++) {
            if (arry.indexOf(this.list[j].type) > -1) {
              this.list[j].isZC = false
            } else {
              this.list[j].isZC = true
            }
          }
        } else {
          this.list.forEach(item => {
            item.isZC = true
          })
        }
      }
    }
  },
  mounted() {
    if (this.cardId) {
      this.cardNumber = this.cardId
      this.getzdryhc()
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.ImportInfo{
  width: 100%;
  border: 2px solid rgb(0, 160, 233);
  border-radius: 6px;
  padding: 0 12px 8px 8px;
  .ul{
    display: flex;
    padding: 17px 0;
    color: #bce8fc;
    text-shadow: 0 0 1px #fff;
    li{
      flex:1;
      text-align: center;
      p{
        display: block;
      }
    }
  }

}
.status{
  color: #00ff0c;
}
.yc{
  color: #ff8a00 !important;
  text-shadow: 0 0 0 transparent;
  font-weight: bolder;
}
@media only screen and (max-width: 1367px){

}
</style>

