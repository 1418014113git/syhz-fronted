<template>
  <div class="tztg_index">
    <el-row :gutter="20">
      <el-col :span="8" style="padding: 0 10px;">
        <el-tabs v-model="type" @tab-click="handleClick" style="padding:0px;margin:0px">
          <el-tab-pane label="全部" name=""></el-tab-pane>
          <el-tab-pane v-for="item in typebList" :label="item.code_name" :name="item.code" :key="item.code"></el-tab-pane>
        </el-tabs>
        <el-form :inline="true" :model="filters">
          <el-row :gutter="20" style="padding-bottom: 15px;">
            <el-col :span="15">
              <el-input placeholder="请输入内容" prefix-icon="el-icon-search"
                        v-model="filters.title" maxlength="50"></el-input>
            </el-col>
            <el-col :span="9" style="display:flex;">
              <el-button type="primary" @click="search" v-if="$isViewBtn('117001')">查询</el-button>
              <el-button type="primary" @click="goList" v-if="$isViewBtn('117002')" style="margin-left: 5px;">站内信息列表</el-button>
            </el-col>
          </el-row>
        </el-form>
        <div v-if="total>0">
          <!--左侧列表-->
          <ul class="tztg_ul" v-loading="loading">
            <li v-for="data in list" @click="detail(data.id)" style="cursor: pointer; display: block" :key="data.id">
              <p :title="data.title" class="ellipsis-word"><span style="padding-right: 10px;">◦</span>{{data.title}}</p>
            </li>
          </ul>
          <div>
            <el-pagination v-if="total > 0" layout="prev, pager, next" @current-change="handleCurrentChange"
                           :page-size="pageSize" :current-page="page" :total="total">
            </el-pagination>
          </div>
        </div>
        <div v-if="total === 0" style="height: 145px; text-align: center; line-height: 100px; list-style: none;">
          暂无数据
        </div>
      </el-col>
      <el-col :span="16" style="padding: 0 20px;">
        <el-row style="padding: 13px 0 5px; border-bottom: 1px solid #e4e7ed">
          <el-col :span="3">
            <span>本日：{{countNum[0]}}</span>
          </el-col>
          <el-col :span="3">
            <span>本周：{{countNum[1]}}</span>
          </el-col>
          <el-col :span="3">
            <span>本月：{{countNum[2]}}</span>
          </el-col>
          <el-col :span="3">
            <span>总数：{{countNum[3]}}</span>
          </el-col>
        </el-row>
        <div v-if="tztg.title && tztg.title!==''">
        <el-row>
          <el-col :span="24"><h1 class="text_center" style="color: #20a0ff;font-size:26px">{{ tztg.title }}</h1>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-row>
              <el-col :span="2" style="text-align: right">发布者：</el-col>
              <el-col :span="5">
                <p :title="tztg.author" class="ellipsis-word">{{ tztg.author }}</p>
              </el-col>
              <el-col :span="3" style="text-align: right">发布时间：</el-col>
              <el-col :span="5">{{ tztg.updateTime }}</el-col>
              <el-col :span="3" style="text-align: right">信息来源：</el-col>
              <el-col :span="6">
                <p :title="tztg.infoSource" class="ellipsis-word">{{ tztg.infoSource }}</p>
              </el-col>
            </el-row>
            <el-row style="padding-bottom: 5px;">
              <el-col :span="12">
                <el-button v-show="String(tztg.isSign)==='0' && $isViewBtn('117003') && Number(tztg.create_org_id) !== curDept.id" style="position:absolute; right:26px; top: -8px" type="primary"
                           @click="sign(tztg.mtsId)">待签收</el-button>
                <el-tag type="success" v-if="String(tztg.isSign)==='1' && $isViewBtn('117003') && Number(tztg.create_org_id) !== curDept.id" style="position:absolute; right:26px; top: -8px">已签收</el-tag>
                <el-tag type="info" v-if="Number(tztg.create_org_id) === curDept.id" style="position: absolute; right: 26px;">本部门</el-tag>
              </el-col>
            </el-row>
            <el-row style="margin-top:10px" type="flex" justify="center">
              <el-col :span="22">
                <div v-html="tztg.content" style="width:100%" class="e-p-line ql-editor">
                </div>
              </el-col>
            </el-row>
            <el-row style="margin-top:60px" type="flex" justify="center">
              <el-col :span="22" v-if="uploadImgs.length > 0">
                <h5 style="margin:0px;">相关下载:</h5>
                <a v-for="item in uploadImgs" :href="item.path" :key="item.name"
                    style="text-decoration:underline;color: rgb(32, 160, 255);display: block" :download="item.name">{{item.name}}</a>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        </div>
        <div v-else style="height: 200px; line-height: 100px; text-align: center;">
          暂无数据
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { getTztgmhPage, editTztgSign, getTztgReceive, getTztgCount } from '@/api/notice'
import { getTCode } from '@/api/inforCollection'
export default {
  data() {
    return {
      uploadImgs: [],
      filters: {
        type: '',
        title: ''
      },
      tztg: {
        id: 0,
        title: '',
        author: '',
        updateTime: '',
        infoSource: '',
        type: '',
        views: '',
        content: ''
      },
      loading: false,
      total: 0,
      page: 1,
      pageSize: 10,
      list: [],
      type: '',
      countNum: [0, 0, 0, 0],
      typebList: [],
      curDept: {},
      curUser: {}
    }
  },
  methods: {
    handleClick(tab, event) {
      this.page = 1
      this.query()
    },
    handleCurrentChange: function(currentPage) {
      this.page = currentPage
      this.query()
    },
    detail(id) {
      const para = {
        id: id, noticeOrgId: this.curDept.id
      }
      getTztgReceive(para).then((response) => {
        if (response.data !== null && response.data.length > 0) {
          this.tztg = response.data[0]
          if (typeof (this.tztg.isSign) === 'undefined') {
            this.tztg.isSign = 1
          }
          this.tztg.infoSource = this.tztg.info_source
          this.tztg.updateTime = this.tztg.update_time
          if (this.tztg.attachement) {
            this.uploadImgs = JSON.parse(this.tztg.attachement)
          } else {
            this.uploadImgs = []
          }
        } else {
          this.tztg = {}
        }
      })
    },
    sign(mtsId) {
      const para = {
        id: mtsId, signUserId: this.curUser.id, isSign: 1
      }
      editTztgSign(para).then((response) => {
        if (response.success === true) {
          this.$message({
            message: '签收成功',
            type: 'success'
          })
          this.count()
          this.detail(this.tztg.id)
        }
      })
    },
    query(hand) {
      const para = {
        pageNum: this.page,
        pageSize: this.pageSize,
        title: this.filters.title,
        noticeOrgId: this.curDept.id
      }
      if (hand) {
        para.logFlag = 1 // 是否写日志
      }
      if (this.type !== '0') {
        para.type = this.type
      }
      this.loading = true
      getTztgmhPage(para).then((response) => {
        const data = response.data
        this.total = data.totalCount
        this.list = data.list
        this.loading = false
        // 查询后必须刷新详情
        this.tztg = {}
        if (this.list.length > 0) {
          this.detail(this.list[0].id)
        }
      }).catch(() => {
        this.loading = false
      })
    },
    search() {
      this.page = 1
      this.query(true)
    },
    goList() {
      this.$router.push({ path: '/tztg/list' })
    },
    count() {
      const para = {
        orgId: this.curDept.id
      }
      getTztgCount(para).then((response) => {
        if (response.data.length > 0 && response.data[0]) {
          this.countNum[0] = response.data[0].oneDay
          this.countNum[1] = response.data[0].weekDay
          this.countNum[2] = response.data[0].monthDay
          this.countNum[3] = response.data[0].totalDay
        }
      })
    },
    tcode() {
      getTCode({ codeLx: 'tztglx' }).then((response) => {
        this.typebList = response.data
      })
    }
  },
  mounted() {
    this.curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
    this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
    this.query()
    this.count()
    this.tcode()
  }
}
</script>
<style scoped>
.tztg_index .tztg_ul {
  margin: 0 18px;
  padding: 0;
  font-size: 14px;
  list-style: circle;
}

.tztg_index .tztg_ul li {
  margin-bottom: 20px;
  justify-content: space-between;
}

.tztg_index .tztg_detail span {
  padding: 5px 50px;
  display: inline-block;
}

.tztg_index .tztg_detail .tztg_detail_content {
  padding: 20px 10px;
}

.tztg_index .text_center {
  text-align: center;
}
.tztg_index .el-tabs {
  color: #fff;
  background: transparent !important;
  border: 0;
}
</style>
