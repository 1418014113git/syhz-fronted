<template>
  <div class="portal-tab">
    <div v-if="listData.length < 1" style="line-height: 260px; text-align: center; color: #fff;font-size:15px;">
      暂无数据
    </div>
    <div v-else>
      <ul>
        <li class="listCont" v-for="(item,index) in listData" :key="index">
          <p class="flexParent ajbh-color" @click="toDetail(item.id)" :title="item.AJMC">
            <span class="ellipsis-word text">{{ item.AJMC }}</span>
            <span style="float: right;color:#fff;">{{formatDate(item.create_time)}}</span>
          </p>
          <p class="flexParent" style="padding-top:5px;">
            <span class="f_color_00a0e9">{{formatterLevel(item.supervise_level)}}</span>
            <span class="f_color_e6a23c">{{filterText(item.status)}}</span>
          </p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
// import { getDBAJHome } from '@/api/supervise'
import {
  getAssistStatusText, getDBLevelText
} from '@/utils/codetotext'
import {
  parseTime
} from '@/utils/index'

export default {
  name: 'Tab',
  data() {
    return {
      deptInfo: {},
      listData: []
    }
  },
  methods: {
    formatDate(time) {
      return parseTime(new Date(time), '{y}-{m}-{d}')
    },
    filterText(status) {
      return getAssistStatusText(status)
    },
    formatterLevel(level) {
      return getDBLevelText(level)
    },
    getData() {
      // getDBAJHome({
      //   deptId: this.deptInfo.id,
      //   deptCode: this.deptInfo.depCode, // 部门code
      //   pageSize: 5,
      //   pageNum: 1
      // }).then((res) => {
      //   if (res.code === '000000' && res.data) {
      //     this.listData = res.data.list
      //   }
      // })
    },
    toDetail(id) {
      localStorage.setItem('curAppCode', 'B')
      this.$router.push({ path: '/caseManage/dbdetail/' + id })
    }
  },
  mounted() {
    if (sessionStorage.getItem('depToken')) {
      this.deptInfo = JSON.parse(sessionStorage.getItem('depToken'))[0]
      this.getData()
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.portal-tab .f_color_e6a23c {
  color: #e6a23c;
}
.portal-tab .f_color_00a0e9 {
  color: #00a0e9;
}
.flexParent {
  display: flex;
  justify-content: space-between;
}
.listCont {
  padding-left: 25px;
  margin-bottom: 10px;
  position: relative;
  &::before {
    display: inline-block;
    content: "";
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: #6cbef2;
    position: absolute;
    left: 0;
    top: 3px;
  }
}
.text {
  width: 70%;
  overflow: hidden;
}
</style>
