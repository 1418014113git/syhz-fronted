<template>
  <div class="ClueCheckList">
    <div style="height: 40px;">
      <el-button type="primary" @click="toCheck" style="float: right; margin-right: 10px;" v-if="$isViewBtn('106013')">发起流转</el-button>
      <el-button type="primary" @click="toBackResult('')" style="float: right; margin-right: 10px" v-if="listData && listData.length > 0 && $isViewBtn('106014')">批量反馈</el-button>
    </div>
    <!--<el-table :data="listData" v-loading="listLoading" style="width: 100%;" @selection-change="clueSelectionChange">-->
      <!--<el-table-column prop="create_org_name" label="发起单位" min-width="8%"></el-table-column>-->
      <!--&lt;!&ndash;<el-table-column prop="create_name" label="流转人" min-width="8%"></el-table-column>&ndash;&gt;-->
      <!--<el-table-column prop="create_time" label="流转时间" min-width="8%"></el-table-column>-->
      <!--<el-table-column prop="check_require" label="核查要求" min-width="8%"></el-table-column>-->
      <!--&lt;!&ndash;<el-table-column prop="reply_time" label="反馈时限" min-width="8%"></el-table-column>&ndash;&gt;-->
      <!--<el-table-column prop="createOrgName" label="反馈单位" min-width="8%"></el-table-column>-->
      <!--&lt;!&ndash;<el-table-column prop="createName" label="反馈人员" min-width="4%"></el-table-column>&ndash;&gt;-->
      <!--<el-table-column label="反馈内容" min-width="20%">-->
        <!--<template slot-scope="scope">-->
          <!--<p :title="scope.row.replyContent" class="ellipsis-word">{{scope.row.replyContent}}</p>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <!--<el-table-column prop="create_time" label="反馈时间" min-width="5%"></el-table-column>-->
      <!--<el-table-column label="状态" width="120">-->
        <!--<template slot-scope="scope">-->
          <!--<span v-if="scope.row.see_status === '1'">反馈未查看</span>-->
          <!--<span v-if="scope.row.see_status === '2'">反馈已查看</span>-->
        <!--</template>-->
      <!--</el-table-column>-->
    <!--</el-table>-->

    <el-row v-if="listData && listData.length > 0">
        <el-collapse v-model="activeNames" accordion @change="handleChange">
          <el-collapse-item v-for="(item,index) in listData" :key="index" :name="item.id">
            <template slot="title">
              <p class="infb-title">
                <el-checkbox v-if="item.status === '1'" name="clueCcb" @change="changeCheck" :true-label="item.id" :false-label="(-1 * item.id)" :disabled="hasCheck"></el-checkbox>
                <el-checkbox v-if="item.status === '2'" name="clueCcb" @change="changeCheck" :true-label="item.id" :false-label="(-1 * item.id)"></el-checkbox>
                <span>{{item.createOrgName}} {{item.createTime}}发起流转</span>
                <span v-if="item.status === '1'" style="color:#e6a23c">待签收</span>
                <span v-if="item.status === '2' && item.clueStatus === '1'" style="color:#409eff">待反馈</span>
                <span v-else-if="item.clueStatus === '2'" style="color:#67c23a">已反馈</span>
              </p>
            </template>
            <div v-if="item.checkRequire" style="color: #fff;padding:10px; ">
              <p>核查要求：</p>
              <p style="padding: 10px 28px; border-bottom: 1px dashed #ccc; ">{{item.checkRequire}}</p>
              <p style="padding: 10px 28px; ">
                <span style="padding-right: 30px">发起部门：{{item.createOrgName}}</span>
                <span style="padding-right: 30px">发起人：{{item.createName}}</span>
                <span style="padding-right: 30px">发起时间：{{item.createTime}}</span>
                <span style="padding-right: 30px">核查部门：{{item.acceptOrgName}}</span>
                <span style="padding-right: 30px">核查人：{{item.acceptStaffName}}</span>
                <span style="padding-right: 30px">核查人联系电话：{{item.staffPhone}}</span>
              </p>
              <div v-if="item.attachment && item.attachment.length > 0">
                <p>附件：</p>
                <p v-for="(img,index) in item.attachment" :key="index" style="padding-left: 28px;">
                  <el-button type="text" v-if="img.name.indexOf('.jpg')>0||img.name.indexOf('.png')>0||img.name.indexOf('.gif')>0"
                             v-preview="img.path" preview-title-enable="true" preview-nav-enable="true">{{img.name}}</el-button>
                  <el-button type="text" v-else @click="downFile(img.path)">{{img.name}}</el-button>
                </p>
              </div>
              <p v-if="item.status==='1'" style="text-align: right;padding:10px;">
                <el-button v-if="item.status==='1' && item.acceptOrgId === currentDep.id && $isViewBtn('106015')"
                           type="primary" size="small" @click.stop="handleReceive(item.bisId, item.id)" style="">签收</el-button>
              </p>
              <p v-if="item.status==='2' && item.acceptOrgId === currentDep.id && $isViewBtn('106016')" style="text-align: right;padding:10px;">
                <el-button type="primary" size="small" @click.stop="toBackResult(item.id)" style="">反馈</el-button>
              </p>
            </div>
            <div v-if="item.list && item.list.length > 0" style="margin-top: 10px; padding:10px; color: #fff;">
              <p>反馈内容：</p>
              <div v-for="(bean,i) in item.list" :key="i" :name="bean.id" style="padding: 10px 0; border-bottom: 1px dashed #ccc; ">
                <p style="padding-left: 28px">{{bean.reply_content}}</p>
                <p style="padding-left: 28px">
                  <span style="padding-right: 30px">反馈部门：{{bean.create_org_name}}</span>
                  <span style="padding-right: 30px">反馈人：{{bean.create_name}}</span>
                  <span style="padding-right: 30px">时间：{{bean.create_time}}</span>
                </p>
                <div v-if="bean.attachment && bean.attachment.length > 0">
                  <p>附件：</p>
                  <p v-for="(img,index) in bean.attachment" :key="index" style="padding-left: 28px;">
                    <el-button type="text" v-if="img.name.indexOf('.jpg')>0||img.name.indexOf('.png')>0||img.name.indexOf('.gif')>0"
                               v-preview="img.path" preview-title-enable="true" preview-nav-enable="true">{{img.name}}</el-button>
                    <el-button type="text" v-else @click="downFile(img.path)">{{img.name}}</el-button>
                  </p>
                </div>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
    </el-row>
    <el-row v-else style="padding: 50px; text-align: center">
      暂时没有数据
    </el-row>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination v-if="total > 0" layout="prev, pager, next" @current-change="handleCurrentChange"
                     :page-size="pageSize" :total="total" :current-page="pageNum" style="float:right;">
      </el-pagination>
    </el-col>
    <el-dialog title="线索反馈" :visible.sync="clueCheckResultDialog" @close="diaClose('resultDia')">
      <clue-back-result ref="resultDia" @cancel="closeBackDia"></clue-back-result>
    </el-dialog>
    <el-dialog title="线索流转" :visible.sync="clueCheckDialog" @close="diaClose('checkDia')">
      <clue-check ref="checkDia" @cancel="closeCheck"></clue-check>
    </el-dialog>
  </div>
</template>

<script>
  import {
    getClueCheckResult, getClueChecks
  } from '@/api/cluecheck'
  import {
    updBusinessSign
  } from '@/api/cluecheck'
  import {
    parseTime
  } from '@/utils/index'
  import ClueCheck from '../components/ClueCheck'
  import ClueBackResult from '../components/ClueBackResult'

  export default {
    name: 'ClueCheckList',
    components: {
      'clue-check': ClueCheck,
      'clue-back-result': ClueBackResult
    },
    data() {
      return {
        hasCheck: true,
        activeNames: '',
        pageSize: 10,
        total: 0,
        pageNum: 1,
        listData: [],
        clueCheckDialog: false,
        clueCheckResultDialog: false,
        selectClues: [],
        boxList: {},
        listLoading: false,
        currentDep: {},
        curUser: {},
        clueCheckId: ''
      }
    },
    methods: {
      clueSelectionChange(val) {
        const array = []
        val.forEach((item, i) => {
          array.push(item.id)
        })
        this.selectClues = array
      },
      handleCurrentChange(val) {
        this.pageNum = val
      },
      getData() {
        this.listLoading = true
        getClueChecks({
          clueId: this.$route.params.id,
          pageNum: this.pageNum,
          pageSize: this.pageSize
        }).then((res) => {
          if (res.code === '000000' && res.data.list) {
            this.total = res.data.totalCount
            const checkData = res.data.list
            const ids = []
            for (let i = 0; i < checkData.length; i++) {
              ids.push(checkData[i]['id'])
              if (checkData[i]['attachment']) {
                checkData[i]['attachment'] = JSON.parse(checkData[i]['attachment'])
              }
            }
            if (ids.length > 0) {
              getClueCheckResult({
                ids: ids
              }).then((res) => {
                this.listLoading = false
                if (res.code === '000000' && res.data) {
                  const backsData = res.data
                  for (let i = 0; i < checkData.length; i++) {
                    for (let j = 0; j < backsData.length; j++) {
                      if (checkData[i]['id'] === backsData[j]['clue_check_id']) {
                        if (backsData[j]['attachment']) {
                          backsData[j]['attachment'] = JSON.parse(backsData[j]['attachment'])
                        }
                        if (checkData[i]['list'] && checkData[i]['list'].length > 0) {
                          checkData[i]['list'].push(backsData[j])
                        } else {
                          checkData[i]['list'] = []
                          checkData[i]['list'].push(backsData[j])
                        }
                      }
                    }
                  }
                  this.listData = checkData
                }
              }).catch(() => {
                this.listLoading = false
              })
            }
          }
        }).catch(() => {
          this.listLoading = false
        })
      },
      toBackResult(id) {
        if (id) {
          this.selectClues = [id]
        }
        if (this.selectClues.length === 0) {
          this.$message({
            message: '请勾选要反馈的流转信息',
            type: 'warning'
          })
          return false
        }
        this.clueCheckResultDialog = true
      },
      closeBackDia() {
        this.selectClues = []
        this.clueCheckResultDialog = false
        this.getData()
      },
      diaClose(type) {
        this.$refs[type].cancel()
      },
      toCheck() {
        this.clueCheckId = this.$route.params.id
        this.clueCheckDialog = true
      },
      closeCheck() {
        this.selectClues = []
        this.clueCheckDialog = false
        this.getData()
      },
      handleChange(val) {},
      handleReceive(bsId, id) {
        updBusinessSign({
          id: bsId,
          status: 2,
          clueId: id,
          signUserId: this.curUser.id,
          signTime: parseTime(new Date(), '{y}-{m}-{d} {h}:{i}:{s}'),
          updateUserId: this.curUser.id,
          bizType: 7,
          action: '签收情报线索',
          bizId: id,
          userId: this.curUser.id,
          userName: this.curUser.realName
        }).then((res) => {
          if (res.code === '000000') {
            this.$message({
              message: '签收成功',
              type: 'success'
            })
            this.getData(true)
          }
        })
      },
      changeCheck(val) {
        if (val > 0) {
          this.boxList[val] = true
        } else {
          delete this.boxList[(-1 * val)]
        }
        this.selectClues = Object.keys(this.boxList)
      },
      downFile(path) {
        window.open(path)
      }
    },
    mounted() {
      this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
      this.currentDep = JSON.parse(sessionStorage.getItem('depToken'))[0]
      this.getData()
    }
  }
</script>

<style scoped>
  .ClueCheckList .infb-title span {
    padding-right: 15px;
  }
</style>






department
















