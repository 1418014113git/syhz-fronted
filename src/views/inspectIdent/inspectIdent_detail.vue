<template>
  <el-row class="inspect_apply" type="flex" justify="center">
    <el-col :span="20">
      <el-card>
        <div slot="header" class="clearfix">
          <span>检验机构详情</span>
          <!-- <el-button style="float: right; padding: 3px 0" type="text" @click="toList">返回</el-button> -->
          <img src="@/assets/icon/back.png"  class="goBack" @click="toList">   <!--返回-->
        </div>
        <el-row class="line">
          <el-col :span="3" class="title">检验机构：</el-col>
          <el-col :span="20" class="ft_color_999">{{detail.organizationName}}</el-col>
        </el-row>
        <el-row class="line">
          <el-col :span="3" class="title">送检单位：</el-col>
          <el-col :span="6" class="ft_color_999">{{detail.copyDeptName}}</el-col>
          <el-col :span="3" class="title">送检民警：</el-col>
          <el-col :span="5" class="ft_color_999">{{detail.copyPerson}}</el-col>
          <el-col :span="3" class="title">联系电话：</el-col>
          <el-col :span="4" class="ft_color_999">{{detail.copyPersonPhone}}</el-col>
        </el-row>
        <el-row class="line">
          <el-col :span="3" class="title">案件：</el-col>
          <el-col :span="20" class="ft_color_999">{{detail.caseName}}</el-col>
        </el-row>
        <el-row class="line">
          <el-col :span="3" class="title">公安厅联系人：</el-col>
          <el-col :span="6" class="ft_color_999">{{detail.cellPersonName}}</el-col>
          <el-col :span="2" class="title">联系电话：</el-col>
          <el-col :span="6" class="ft_color_999">{{detail.cellPersonPhone}}</el-col>
        </el-row>
        <el-row class="line">
          <el-col :span="3" class="title">审核单位：</el-col>
          <el-col :span="6" class="ft_color_999">{{detail.approveDeptName}}</el-col>
        </el-row>
        <el-row class="line">
          <el-col :span="3" class="title">有效期：</el-col>
          <el-col :span="6" class="ft_color_999">{{detail.dayNum}} 天</el-col>
        </el-row>
        <el-row class="line">
          <el-col :span="3" class="title">检材名称：</el-col>
          <el-col :span="6" class="ft_color_999">{{detail.checkName}}</el-col>
        </el-row>
        <el-row class="line">
          <el-col :span="3" class="title">送检要求：</el-col>
          <el-col :span="20" class="ft_color_999" v-html="detail.checkReason"></el-col>
        </el-row>
        <el-row class="line" v-if="uploadImgs.length > 0">
          <el-col :span="3" class="title">附件：</el-col>
          <el-col :span="20">
            <div v-for="(item,index) in uploadImgs" :key="index">
              <el-button type="text"
                         v-if="item.name.indexOf('.jpg')>0||item.name.indexOf('.png')>0||item.name.indexOf('.gif')>0"
                         v-preview="item.path" preview-title-enable="true" preview-nav-enable="true">{{item.name}}
              </el-button>
              <el-button type="text" v-else @click="downFile(item.path)">{{item.name}}</el-button>
            </div>
          </el-col>
        </el-row>
        <el-row v-if="results.length > 0" class="line">
          <el-row v-for="(item, index) in results" :key="index" style="margin-bottom: 26px;">
            <el-col :span="3" class="title">反馈内容：</el-col>
            <el-col :span="20">
              <p>
                {{item.auth_result}}
              </p>
              <p style="margin-top: 10px;">
                <span style="padding-right: 30px;">反馈部门：<span>{{item.create_org_name}}</span></span>
                <span>反馈人：<span>{{item.create_name}}</span></span>
              </p>
              <p style="margin-top: 10px;">
                <span style="padding-right: 30px;">附件：
                  <span v-for="(img,index) in jsonAttachment(item.attachment)" :key="index">
                    <el-button type="text"
                               v-if="img.name.indexOf('.jpg')>0||img.name.indexOf('.png')>0||img.name.indexOf('.gif')>0"
                               v-preview="img.path" preview-title-enable="true"
                               preview-nav-enable="true">{{img.name}}</el-button>
                    <el-button type="text" v-else @click="downFile(img.path)">{{img.name}}</el-button>
                  </span>
                </span>
              </p>
            </el-col>
          </el-row>
        </el-row>
        <el-row v-if="Number(detail.status) >= 6 && curDept.id === Number(detail.applyDeptId) && $isViewBtn('104009')"
                class="line" style="text-align: center">
          <el-button title="反馈" size="small" type="warning"
                     @click="toAddResult">&nbsp;&nbsp;反&nbsp;馈&nbsp;&nbsp;
          </el-button>
        </el-row>
        <el-row style="padding: 50px;"></el-row>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
  import {
    getAuthenticateDetail, getCheckResult
  } from '@/api/inspectIdent'
  import {
    getSessionDeptSelect
  } from '@/api/depts'

  export default {
    name: 'edit',
    data() {
      return {
        detail: {
          organizationId: '',
          organizationName: '',
          copyDeptId: '',
          copyDeptName: '',
          copyPerson: '',
          copyPerson2: [],
          copyPersonPhone: '',
          caseId: '',
          caseName: '',
          checkName: '',
          checkReason: '',
          cellPersonName: '',
          cellPersonPhone: '',
          approveDept: '',
          dayNum: 1,
          attachment: '',
          status: 0,
          enable: 1,
          copyPersonIds: ''
        },
        deptList: [],
        uploadImgs: [],
        results: [],
        curDept: {}
      }
    },
    methods: {
      jsonAttachment(text) {
        if (text) {
          return JSON.parse(text)
        }
        return []
      },
      toList() {
        this.$router.push({ path: '/inspectIdent/list' })
      },
      getDetail(id) {
        getAuthenticateDetail({
          id: id
        }).then((response) => {
          // this.queryCase(response.data.caseName)
          // this.detail = response.data
          const result = response.data
          this.detail = response.data
          if (result.STATUS) {
            this.detail.status = result.STATUS
          }
          if (result.copyPersonIds) {
            this.detail.copyPerson2 = result.copyPersonIds.split(',')
          }
          for (let i = 0; i < this.detail.copyPerson2.length; i++) {
            this.detail.copyPerson2[i] = parseInt(this.detail.copyPerson2[i])
          }
          if (result.attachment) {
            this.detail.attachment = result.attachment
            this.uploadImgs = JSON.parse(this.detail.attachment)
          }
          for (let i = 0; i < this.deptList.length; i++) {
            if (String(this.deptList[i].id) === String(result.approveDept)) {
              this.detail.approveDeptName = this.deptList[i].name
            }
          }
        })
      },
      toAddResult() {
        this.$router.push({ path: '/inspect/result/add/' + this.$route.params.id })
      },
      getResult() {
        getCheckResult({
          authId: this.$route.params.id
        }).then((response) => {
          if (response.code === '000000' && response.data) {
            this.results = response.data
          }
        })
      },
      downFile(path) {
        window.open(path)
      }
    },
    mounted() {
      this.curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
      if (this.$route.params.id) {
        this.getDetail(this.$route.params.id)
        this.deptList = getSessionDeptSelect()
        this.getResult()
      }
    }
  }
</script>

<style scoped>
  .inspect_apply h3 {
    font-size: 16px;
    font-weight: bold;
    height: 50px;
    line-height: 50px;
    margin-bottom: 10px;
  }

  .inspect_apply .input_w {
    width: 40%;
  }

  .inspect_apply .title {
    text-align: right;
    color: #fff;
  }

  .inspect_apply .line {
    padding: 15px 0;
    border-bottom: 1px dashed #d9d9d9;
  }
</style>
