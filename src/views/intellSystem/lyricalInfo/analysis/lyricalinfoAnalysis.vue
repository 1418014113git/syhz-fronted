<template>
  <div class="intell-count body">
      <div style="width: 100%; height: auto; margin:0 0">
        <div class="event-nav">
          <el-menu :default-active="activeIndex" class="el-menu-demo" text-color="#bce8fc" active-text-color="#00a0e9" mode="horizontal" @select="handleSelect">
            <el-menu-item index="1">我的关注</el-menu-item>
            <el-menu-item index="2">舆情事件</el-menu-item>
            <el-menu-item index="3">往期事件</el-menu-item>
          </el-menu>
        </div>
        <div class="line"></div>
        <div class="event-x tj-event">
          <div class="eve-pub" href="#" v-for="(item, index) in dataArray" @click="clickItem">
            <i class="state" :style="item.status === '已结束' ? 'color: #e6a23c' : ''">{{ item.status }}</i>
            <div class="title-time">
              <div>
                <p>{{ item.title }}</p>
                <p>{{ item.time }}</p>
              </div>
            </div>
            <div class="sum">
              相关报道<span>{{ item.sum }}</span>条
            </div>
            <div class="mediaTypeListWarp">
              <ul class="mediaTypeList">
                <li><span>网媒</span><span>{{ item.networkMedia }}</span></li>
                <li><span>论坛</span><span>{{ item.forum }}</span></li>
                <li><span>微博</span><span>{{ item.weibo }}</span></li>
                <li><span>微信</span><span>{{ item.weChat }}</span></li>
                <li><span>博客</span><span>{{ item.blogs }}</span></li>
                <li><span>报刊</span><span>{{ item.press }}</span></li>
                <li><span>视频</span><span>{{ item.video }}</span></li>
                <li><span>APP</span><span>{{ item.app }}</span></li>
                <li><span>其他</span><span>{{ item.other }}</span></li>
                <li><span>评论</span><span>{{ item.comment }}</span></li>
              </ul>
            </div>
            <div class="eve-footer" style="margin-top: 45.65px;">
              <ul></ul>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
  export default {
    name: 'analysis',
    data() {
      return {
        dataArray: [],
        activeIndex: '1'
      }
    },
    methods: {

      handleSelect(index) {
        var _this = this
        if (index === '1') {
          _this.dataArray = [
            {
              status: '进行中',
              title: '食品安全犯罪',
              time: '2011-07-22 13:48 ～ 2019-08-31 12:12',
              sum: '59345',
              networkMedia: '21764',
              forum: '1922',
              weibo: '4310',
              weChat: '19264',
              blogs: '34',
              press: '519',
              video: '0',
              app: '11382',
              other: '83',
              comment: '67'
            },
            {
              status: '进行中',
              title: '涉嫌伪造鼻炎“神药”5家经销店被查',
              time: '2019-08-17 00:00 ～ 2019-08-31 00:00',
              sum: '2215',
              networkMedia: '276',
              forum: '9',
              weibo: '1476',
              weChat: '88',
              blogs: '0',
              press: '0',
              video: '34',
              app: '332',
              other: '0',
              comment: '0'
            },
            {
              status: '进行中',
              title: '白糖+白矾+水=“蜂蜜”',
              time: '2019-08-13 00:06 ～ 2019-09-12 11:27',
              sum: '7450',
              networkMedia: '1084',
              forum: '49',
              weibo: '5595',
              weChat: '220',
              blogs: '1',
              press: '0',
              video: '22',
              app: '466',
              other: '7',
              comment: '6'
            },
            {
              status: '进行中',
              title: '冰醋酸兑出食用醋年获利200万元',
              time: '2019-08-11 00:00 ～ 2019-09-12 00:00',
              sum: '65893',
              networkMedia: '5356',
              forum: '472',
              weibo: '53836',
              weChat: '1607',
              blogs: '3',
              press: '64',
              video: '126',
              app: '4411',
              other: '4',
              comment: '14'
            },
            {
              status: '进行中',
              title: '民房内“造”出茅台五粮液',
              time: '2019-08-09 00:00 ～ 2019-09-11 00:00',
              sum: '3636',
              networkMedia: '401',
              forum: '25',
              weibo: '2697',
              weChat: '181',
              blogs: '0',
              press: '1',
              video: '58',
              app: '272',
              other: '0',
              comment: '1'
            },
            {
              status: '进行中',
              title: '咸阳刘某等人生产销售有毒有害食品案',
              time: '2019-08-21 21:00 ～ 2019-09-22 09:19',
              sum: '7455',
              networkMedia: '1056',
              forum: '78',
              weibo: '3357',
              weChat: '691',
              blogs: '0',
              press: '5',
              video: '105',
              app: '2161',
              other: '1',
              comment: '1'
            },
            {
              status: '进行中',
              title: '榆林高某王某生产销售不符合安全标准食品案',
              time: '2019-08-22 03:12 ～ 2019-08-30 09:07',
              sum: '13537',
              networkMedia: '108',
              forum: '63',
              weibo: '11065',
              weChat: '67',
              blogs: '0',
              press: '0',
              video: '24',
              app: '345',
              other: '0',
              comment: '1864'
            },
            {
              status: '进行中',
              title: '汉中张某网络销售假冒注册商标商品假酒案',
              time: '2019-08-14 09:00 ～ 2019-08-31 00:28',
              sum: '11422',
              networkMedia: '1987',
              forum: '91',
              weibo: '3615',
              weChat: '1914',
              blogs: '0',
              press: '7',
              video: '122',
              app: '3685',
              other: '0',
              comment: '1'
            }
          ]
        } else if (index === '2') {
          _this.dataArray = [
            {
              status: '进行中',
              title: '制售假食盐案',
              time: '2019-08-02 00:00 ～ 2019-09-07 00:00',
              sum: '7637',
              networkMedia: '1938',
              forum: '82',
              weibo: '2598',
              weChat: '1035',
              blogs: '0',
              press: '7',
              video: '116',
              app: '1854',
              other: '1',
              comment: '0'
            },
            {
              status: '进行中',
              title: '全省首例假冒微整形药械案',
              time: '2019-08-06 10:00 ～ 2019-09-06 00:00',
              sum: '23586',
              networkMedia: '3051',
              forum: '133',
              weibo: '14822',
              weChat: '2216',
              blogs: '3',
              press: '12',
              video: '400',
              app: '2934',
              other: '9',
              comment: '6'
            },
            {
              status: '进行中',
              title: '阎良查获562瓶假西凤酒',
              time: '2019-08-20 01:00 ～ 2019-09-20 09:09',
              sum: '30474',
              networkMedia: '724',
              forum: '52',
              weibo: '28843',
              weChat: '306',
              blogs: '0',
              press: '4',
              video: '37',
              app: '494',
              other: '0',
              comment: '14'
            },
            {
              status: '进行中',
              title: '吃碗凉皮13村民上吐下泻',
              time: '2019-08-16 10:30 ～ 2019-08-31 09:23',
              sum: '4063',
              networkMedia: '550',
              forum: '29',
              weibo: '2142',
              weChat: '176',
              blogs: '2',
              press: '0',
              video: '55',
              app: '1107',
              other: '1',
              comment: '1'
            },
            {
              status: '进行中',
              title: '双氧水加工牛肉 4个月获利64万',
              time: '2019-08-16 21:03 ～ 2019-08-31 09:03',
              sum: '1234',
              networkMedia: '406',
              forum: '13',
              weibo: '238',
              weChat: '262',
              blogs: '0',
              press: '1',
              video: '24',
              app: '290',
              other: '0',
              comment: '0'
            },
            {
              status: '进行中',
              title: '屠宰场流出注水肉兽医站动检员乱盖检疫章',
              time: '2019-08-14 16:00 ～ 2019-08-31 09:38',
              sum: '1581',
              networkMedia: '528',
              forum: '16',
              weibo: '274',
              weChat: '239',
              blogs: '0',
              press: '2',
              video: '25',
              app: '492',
              other: '3',
              comment: '2'
            },
            {
              status: '进行中',
              title: '制售有毒有害土豆粉案',
              time: '2019-08-11 17:00 ～ 2019-09-11 00:00',
              sum: '29725',
              networkMedia: '5677',
              forum: '325',
              weibo: '15956',
              weChat: '3745',
              blogs: '2',
              press: '256',
              video: '114',
              app: '3637',
              other: '4',
              comment: '9'
            },
            {
              status: '进行中',
              title: '网络销售假酒案',
              time: '2019-08-08 07:30 ～ 2019-09-08 00:00',
              sum: '21206',
              networkMedia: '1129',
              forum: '132',
              weibo: '17510',
              weChat: '1098',
              blogs: '0',
              press: '2',
              video: '337',
              app: '991',
              other: '0',
              comment: '7'
            },
            {
              status: '进行中',
              title: '生产销售有毒有害“牛血”',
              time: '2019-08-07 19:35 ～ 2019-09-08 00:00',
              sum: '9135',
              networkMedia: '1384',
              forum: '68',
              weibo: '4627',
              weChat: '1293',
              blogs: '0',
              press: '8',
              video: '202',
              app: '1547',
              other: '0',
              comment: '6'
            },
            {
              status: '进行中',
              title: '汉中市略阳县公安局侦办的梁某某等制售假蜂蜜案',
              time: '2019-08-04 00:00 ～ 2019-09-07 00:00',
              sum: '2139',
              networkMedia: '399',
              forum: '46',
              weibo: '1097',
              weChat: '165',
              blogs: '0',
              press: '1',
              video: '112',
              app: '314',
              other: '3',
              comment: '2'
            }
          ]
        } else if (index === '3') {
          _this.dataArray = [
            {
              status: '已结束',
              title: '非法猎捕、杀害朱鹮获刑',
              time: '2019-08-20 18:00 ～ 2019-09-21 10:22',
              sum: '34064',
              networkMedia: '221',
              forum: '42',
              weibo: '33443',
              weChat: '69',
              blogs: '0',
              press: '0',
              video: '41',
              app: '247',
              other: '0',
              comment: '0'
            },
            {
              status: '已结束',
              title: '王志盆非法采伐、毁坏红豆杉树苗',
              time: '2019-08-19 20:00 ～ 2019-09-21 09:21',
              sum: '17797',
              networkMedia: '2553',
              forum: '182',
              weibo: '7399',
              weChat: '1706',
              blogs: '3',
              press: '15',
              video: '117',
              app: '5813',
              other: '4',
              comment: '5'
            },
            {
              status: '已结束',
              title: '小电镀作坊主违法排污',
              time: '2019-08-19 00:00 ～ 2019-09-20 09:21',
              sum: '2583',
              networkMedia: '702',
              forum: '37',
              weibo: '844',
              weChat: '331',
              blogs: '1',
              press: '3',
              video: '13',
              app: '650',
              other: '0',
              comment: '1'
            },
            {
              status: '已结束',
              title: '非法使用工业松香给宰杀后禽畜脱毛案件',
              time: '2019-08-14 12:44 ～ 2019-08-31 09:06',
              sum: '33266',
              networkMedia: '6693',
              forum: '487',
              weibo: '15959',
              weChat: '1865',
              blogs: '3',
              press: '147',
              video: '641',
              app: '7453',
              other: '1',
              comment: '17'
            },
            {
              status: '已结束',
              title: '师某制售假冒穆堂香等 名牌调味品案',
              time: '2019-08-14 03:00 ～ 2019-08-31 10:22',
              sum: '10118',
              networkMedia: '2179',
              forum: '133',
              weibo: '4779',
              weChat: '354',
              blogs: '0',
              press: '13',
              video: '238',
              app: '2419',
              other: '0',
              comment: '3'
            },
            {
              status: '已结束',
              title: '紫阳济善堂大药房销售假药案',
              time: '2019-08-06 07:00 ～ 2019-09-06 00:00',
              sum: '741',
              networkMedia: '136',
              forum: '3',
              weibo: '300',
              weChat: '99',
              blogs: '0',
              press: '0',
              video: '36',
              app: '167',
              other: '0',
              comment: '0'
            },
            {
              status: '已结束',
              title: '百吨毒牛肉案值千万',
              time: '2019-08-05 00:00 ～ 2019-09-05 00:00',
              sum: '14252',
              networkMedia: '1635',
              forum: '129',
              weibo: '10247',
              weChat: '742',
              blogs: '0',
              press: '13',
              video: '170',
              app: '1309',
              other: '6',
              comment: '1'
            },
            {
              status: '已结束',
              title: '羊肉被掉包 事主父亲中毒亡',
              time: '2019-08-05 07:54 ～ 2019-09-05 00:00',
              sum: '4170',
              networkMedia: '650',
              forum: '22',
              weibo: '2310',
              weChat: '553',
              blogs: '0',
              press: '1',
              video: '169',
              app: '461',
              other: '4',
              comment: '0'
            },
            {
              status: '已结束',
              title: '租赁民房造出“德懋恭”',
              time: '2019-08-04 00:00 ～ 2019-09-04 00:00',
              sum: '179314',
              networkMedia: '8055',
              forum: '2219',
              weibo: '156240',
              weChat: '5545',
              blogs: '25',
              press: '38',
              video: '580',
              app: '6415',
              other: '8',
              comment: '189'
            }
          ]
        }
      },
      init() {
        var _this = this
        _this.handleSelect('1')
      },
      clickItem: function() {
        this.$router.push({
          path: '/lyricalinfo/analysisDetail',
          query: {
          }
        })
      }
    },
    mounted: function() {
      this.init()
    }
  }
</script>

<style scoped>
  @import "./css/lyricalinfoAnalysis.css";
</style>
