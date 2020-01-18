<template>
  <div>
      <el-card class="Menucard">
        <el-row :gutter="20">
          <el-col :span="2">
            <div
              class="menu"
              :class="type === '1' ? 'activeMenu' : ''"
              @click="handleMenuClick('1')"
            >
              <span>白名单</span>
            </div>
          </el-col>
          <el-col :span="2">
            <div
              class="menu"
              :class="type === '2' ? 'activeMenu' : ''"
              @click="handleMenuClick('2')"
            >
              <span>黑名单</span>
            </div>
          </el-col>
          <el-col :span="8" :offset="12" style="text-align:right;" >
            <div v-if="type == '1'">

              <span>启用白名单</span>
              <el-switch :width="50" v-model="activeWhite"
              @change="changeSwitch()"

              ></el-switch>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <el-button  @click="initDialog('1')" >添加白名单</el-button>
            </div>
              <div v-else>
              <el-button @click="initDialog('1')">添加黑名单</el-button>
            </div>
          </el-col>
        </el-row>
        <br>
        <el-table :data="listData" v-loading="loading" style="width: 100%" >
      <el-table-column type="index" label="序号" width="60"></el-table-column>
      <el-table-column prop="ipAddress" label="IP地址" min-width="200" show-overflow-tooltip></el-table-column>
      <el-table-column prop="createTime" label="添加时间" min-width="150"  >
             <template slot-scope="scope">
          {{scope.row.createTime | formatDate}}
        </template>
      </el-table-column>
      <el-table-column prop="creator" label="添加人" min-width="100"></el-table-column>

      <el-table-column prop="endTime" label="有效期" min-width="150" >
        <template slot-scope="scope">
          {{scope.row.endTime}}
        </template>
      </el-table-column>

      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button
            title="编辑"
            size="mini"
            icon="el-icon-edit"
            circle
            plain
            @click="handleEdit(scope.row)"
          ></el-button>
          <el-button
           title="移出"
            size="mini"
            icon="el-icon-minus"
            circle
           @click="handleRemove(scope.$index,scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
      </el-card>
   <!-- 分页按钮 -->
    <el-col :span="24" class="toolbar">
      <el-pagination
        v-if="total > 0"
        layout="total, sizes, prev, pager, next, jumper"
        :page-sizes="[15,30,50,100]"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :page-size="pageSize"
        :total="total"
        :current-page="page"
        style="float:right;"
      ></el-pagination>
    </el-col>


      <el-dialog
       :title="(this.optType === '1' ? (this.type === '1'?'添加白名单':'添加黑名单') : (this.type === '1'?'编辑白名单':'编辑黑名单'))"
        :visible.sync="IpDialogVisable"
        @close = "closeDialog"
        center>
        <el-form  label-width="90px" :rules="rules" ref='ipForm' :model="ipForm">
          <el-row>
            <el-col :span="10">
            <el-form-item label="IP地址"  prop="ipAddressStart">
          <el-input v-model="ipForm.ipAddressStart"></el-input>
        </el-form-item>
        </el-col>
        <el-col :span="10" :offset="1">
        <el-form-item label="~" prop="ipAddressEnd">
          <el-input v-model="ipForm.ipAddressEnd" ></el-input>
        </el-form-item>
        </el-col>
        </el-row>
         <el-form-item label="有效期" prop="endTime"
         >
           <el-date-picker  v-model="ipForm.endTime" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="有效期"
           @change="handleEndTimeChange"></el-date-picker>
        </el-form-item>

      </el-form>
        <span slot="footer" class="dialog-footer">
           <el-button type="primary" @click="goback" class="cancelBtn">取消</el-button>
              <el-button type="primary" class="saveBtn" @click="saveIpList()" :loading="btnLoading">保存</el-button>
        </span>
      </el-dialog>
  </div>






</template>
<script>
import { parseTime } from '@/utils/index'
import { regIp } from '@/utils/validate'
export default {
  data() {
    return {
      loading: false, // 列表loading
      type: '1',
      activeWhite: false,
      IpDialogVisable: false,
      listData: [],
      pageSize: 15,
      page: 1,
      total: 0,

      btnLoading: false,
      userInfo: {},
      ipForm: {
        ipAddressStart: '', // ip地址开始段
        ipAddressEnd: '', // ip地址结束段
        creator: '', // 创建人
        endTime: '' // 有效日期
      },
      optType: '1', // 1添加2修改

      rules: {
        endTime: [{
          required: true, trigger: 'blur', message: '请输入有效期'
        }],

        ipAddressStart: [
          {

            required: true, trigger: 'blur', validator: (rule, value, callback) => {
              if (value === '' || value === undefined || value === null) {
                return callback(new Error('请输入IP地址'))
              } else if (this.$regCode.test(value)) {
                callback(new Error('请不要输入特殊字符'))
              } else if (!regIp.test(value)) {
                callback(new Error('请输入正确的IP地址'))
              } else {
                callback()
              }
            }

          }
        ],
        ipAddressEnd: [
          {
            required: true, trigger: 'blur', validator: (rule, value, callback) => {
              if (value === '' || value === undefined || value === null) {
                return callback(new Error('请输入IP地址'))
              } else if (this.$regCode.test(value)) {
                callback(new Error('请不要输入特殊字符'))
              } else if (!regIp.test(value)) {
                callback(new Error('请输入正确的IP地址'))
              } else {
                callback()
              }
            }
          }
        ]

      }
    }
  },
  filters: {
    formatDate(time) {
      return parseTime(time, '{y}-{m}-{d} {h}:{i}:{s}')
    }
  },

  methods: {
    handleSizeChange(val) {
      this.page = 1
      this.pageSize = val
      this.queryIpList(false, true)
    },
    handleCurrentChange(val) {
      this.page = val
      this.queryIpList(false, true)
    },
    handleEdit(row) {
      this.optType = '2'
      this.initDialog(this.optType, row)
    },
    handleRemove(index, row) {
      this.loading = true
      this.$remove('IPCONTROL/' + row.id, { requestId: '' }).then((response) => {
        this.loading = false
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.queryIpList(true)
      }).catch(() => {
        this.loading = false
      })
    },
    handleEndTimeChange(val) {
      this.ipForm.endTime = val + ' 23:59:59'
    },

    initDialog(optType, row) {
      // 1添加2编辑
      if (optType === '1') {
        this.optType = '1'
        this.initendTime()
        this.ipForm.endTime = this.ipForm.endTime ? this.ipForm.endTime + ' 23:59:59' : ''
        this.IpDialogVisable = true
      } else {
        this.optType = '2'
        this.ipForm.id = row.id
        this.ipForm.endTime = row.endTime ? row.endTime + ' 23:59:59' : ''
        if (row.ipAddress.indexOf('~') !== -1) {
          var ips = row.ipAddress.split('~')
          this.ipForm.ipAddressStart = ips[0]
          this.ipForm.ipAddressEnd = ips[1]
        } else {
          this.ipForm.ipAddressStart = row.ipAddress
          this.ipForm.ipAddressEnd = row.ipAddress
        }
        this.IpDialogVisable = true
      }
    },
    closeDialog() {
      this.goback()
    },
    saveIpList() {
      this.$refs.ipForm.validate(valid => {
        if (valid) {
          this.btnLoading = true
          this.ipForm.type = this.type
          this.userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
          this.ipForm.creator = this.userInfo.realName
          if (this.optType === '1') {
            this.ipForm.id = null
          }
          this.$save('iplist', this.ipForm).then(res => {
            this.btnLoading = false
            if (res.code === '000000') {
              this.$message({ message: 'IP地址设置成功！', type: 'success' })
              setTimeout(() => {
                this.IpDialogVisable = false
                this.queryIpList()
              }, 2000)
            } else {
              this.$message({ message: 'IP地址设置失败，请联系管理员！', type: 'error' })
              setTimeout(() => {
                this.IpDialogVisable = false
                this.queryIpList()
              }, 2000)
            }
          }).catch(() => {
            this.btnLoading = false
          })
        }
      })
    },
    clearForm() { },
    toAdd() { },
    goback() {
      this.$refs.ipForm.resetFields()
      this.IpDialogVisable = false
    },
    toNoticeEdit(row) { },
    handleDetail(row) { },
    changeSwitch(val) {
      // '0禁用 1启用',
      const para = {
        'configKey': 'useWhitelist'
      }
      this.$query('SYSCONFIGBYKEY', para).then((response) => {
        if (response.code === '000000') {
          if (response.data.length > 0) {
            const param = {
              enable: this.activeWhite === true ? '1' : '0'
            }
            // 修改sysconfig
            this.$update('SYSCONFIG/' + response.data[0].id, param).then(response => {
            }).catch(() => {
              this.loading = false
            })
          }
        }
      }).catch(() => {
        this.caseLoading = false
      })
    },
    handleMenuClick(type) {
      this.type = type
      this.page = 1
      this.pageSize = 15
      this.queryIpList()
    },
    queryIpList() {
      this.listData = []
      this.loading = true
      var param = {
        type: this.type,
        pageNum: this.page,
        pageSize: this.pageSize
      }
      this.$query('page/ipcontrol', param).then(response => {
        this.loading = false
        this.listData = response.data.list
        this.pageSize = response.data.pageSize
        this.page = response.data.pageNum
        this.total = response.data.totalCount
      }).catch(() => {
        this.loading = false
      })
    },
    initendTime() {
      var myDate = new Date()
      myDate.setFullYear(myDate.getFullYear() + 3)
      this.ipForm.endTime = parseTime(myDate, '{y}-{m}-{d}')
    }

  },
  mounted() {
    this.initendTime()
    this.queryIpList(true)
    // 查白名单的启用状态
    // 查法律文书的配置年限
    const para = {
      'configKey': 'useWhitelist'
    }
    this.$query('sysconfig', para).then((response) => {
      if (response.code === '000000') {
        if (response.data.length === 0) {
          this.activeWhite = false
        } else {
          this.activeWhite = true
        }
      }
    }).catch(() => {
      this.caseLoading = false
    })
  }
}

</script>
<style rel="stylesheet/scss" lang="scss">
.menu {
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB,
    Microsoft YaHei, Arial, sans-serif;
  padding: 10px;
  background-color: rgba(188, 232, 252, 0.1);
  text-align: center;
}

.activeMenu {
  background-color: rgba(0, 160, 233, 0.6);
}
.menu span {
  cursor: default;
}
.switchMenu {
  padding: 10px;
  text-align: right;
}
.rightMenu {
  float: right;
  padding: 10px;
  text-align: left;
}
</style>
