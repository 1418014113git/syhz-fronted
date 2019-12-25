<template>
  <section class="knowLedgeBase">
    <el-row>
      <el-col :span="4">
        <el-card>
          <div slot="header"><span>舆情报告</span></div>
          <!--<div class="all">全部（{{ totalData.total }}）</div>-->
          <ul>
            <li
              class="menu"
              @click="handleMenuClick('1')"
              :class="active === '1' ? 'activeSpan' : ''"
            >
              <i class="el-icon-picture"></i
              ><span>舆情日报（{{ totalData.type1 }}）</span>
            </li>
          </ul>
          <ul>
            <li
              class="menu"
              @click="handleMenuClick('2')"
              :class="active === '2' ? 'activeSpan' : ''"
            >
              <i class="el-icon-document"></i
              ><span>舆情周报（{{ totalData.type2 }}）</span>
            </li>
          </ul>
          <ul>
            <li
              class="menu"
              @click="handleMenuClick('3')"
              :class="active === '3' ? 'activeSpan' : ''"
            >
              <i class="el-icon-picture"></i
              ><span>舆情月报（{{ totalData.type3 }}）</span>
            </li>
          </ul>
        </el-card>
      </el-col>
      <el-col :span="20" class="content">
        <el-card>
          <el-form :inline="true" :model="filters" label-width="80px">
            <el-form-item label="生成时间" prop="createTimeStart">
              <el-date-picker
                class="inputw"
                v-model="filters.createTimeStart"
                type="date"
                value-format="yyyy-MM-dd"
                :picker-options="createTimeStartPickerOptions"
                placeholder="请选择开始时间"
                @change="createTimeStartChange"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="至" prop="createTimeEnd" class="datezhi">
              <el-date-picker
                class="inputw"
                v-model="filters.createTimeEnd"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择结束时间"
                :picker-options="createTimeEndPickerOptions"
                @change="createTimeEndChange"
              >
              </el-date-picker>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" size="small" @click="getList"
                >检索</el-button
              >
            </el-form-item>
          </el-form>
        </el-card>
        <br />
        <!--列表card-->
        <el-card>
          <section v-loading="loading">
            <div
              v-for="item in listData"
              :key="item.key"
              class="file_data_list"
              @click="handlerClick(item)"
            >
              <!-- <img
                src="/static/image/online/hj.jpg"
                style="text-align:center;width:150px;height:100px"
              /> -->
            </div>
          </section>
        </el-card>
      </el-col>
    </el-row>
  </section>
</template>

<script>
export default {
  /*
    <el-form :inline="true" :model="filters" label-width="80px">

              <el-form-item label="生成时间" prop="createTimeStart">
            <el-date-picker
          v-model="filters.createTimeStart"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择开始时间"
          @change="createTimeStartChange"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="至" prop="createTimeEnd">
        <el-date-picker
          v-model="filters.createTimeEnd"
          type="date"
          size="small"
          value-format="yyyy-MM-dd"
          placeholder="请选择结束时间"
          @change="createTimeEndChange"
        >
        </el-date-picker>
      </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="query(true, true)" icon="el-icon-search">检索</el-button>
        </el-form-item>
      </el-form>
    */

  data() {
    return {
      listData: [
        {
          type: '1'
        },
        {
          type: '2'
        }
      ],

      loading: false,
      totalData: {
        type1: 0,
        type2: 0,
        type3: 0
      },
      active: '2',
      createTimeEndPickerOptions: {},
      createTimeStartPickerOptions: {},
      filters: {
        createTimeStart: '',
        createTimeEnd: ''
      }
    }
  },
  watch: {},
  methods: {
    handlerClick() {},
    src() {},
    getList() {},
    handleMenuClick() {},
    createTimeEndChange() {},
    createTimeStartChange() {},
    handleCurrentChange(val) {
      this.page = val
      this.query()
    },
    handleSizeChange(val) {
      this.page = 1
      this.pageSize = val
      this.query()
    },
    query(flag, clear) {},
    queryTotal() {
      const para = {}

      this.$query('YQREPORTTOTAL', para).then(response => {
        // if(response.data.)
      })
    },

    handleRowEdit(index, row) {},
    handleRowDel(index, row) {},

    closeDialog() {
      this.auditDialogVisible = false
      this.auditForm = {
        auditId: '',
        remark: '',
        workId: '',
        documentId: '',
        userId: ''
      }
      this.isBatchAudit = false
      this.$refs.auditForm.resetFields()
    }
  },
  mounted() {
    this.queryTotal()
  }
}
</script>

<style>
.file_data_list {
  width: 160px;
  height: 110px;
  float: left;
  margin: 20px;
  border: 1px solid #00a0e9;
  border-radius: 4px;
  background-color: rgba(0, 63, 94, 0.6);
  cursor: pointer;
  text-align: center;
  /* background-image: "/static/image/online/hj.jpg"; */
}
.knowLedgeBase .content {
  padding: 0 10px;
}
.knowLedgeBase .menu {
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB,
    Microsoft YaHei, Arial, sans-serif;
  font-size: 14px;
  padding: 10px;
  cursor: pointer;
}
.knowLedgeBase .menu.activeSpan,
.knowLedgeBase .menu.activeSpan:hover {
  background-color: rgba(0, 160, 233, 0.6);
}
.knowLedgeBase .menu:hover {
  background-color: rgba(188, 232, 252, 0.1);
}
.knowLedgeBase .menu i {
  font-size: 18px;
  width: 24px;
}
.file_data > p {
  width: 100%;
  display: inline-block;
  height: 40px;
  line-height: 40px;
  border-bottom: 2px solid #fff;
}
.file_data > p > span {
  float: left;
}
.file_data > p > span:last-child {
  float: right;
  margin-right: 10px;
  cursor: pointer;
}
.file_data .file_data_list {
  width: 23%;
  float: left;
  margin-right: 38px;
  padding: 15px 15px 10px 15px;
  border: 1px solid transparent;
  border-radius: 4px;
}
.file_data_list:hover,
.file_data .file_data_list:active {
  background: red;
}
.file_data .file_data_list:nth-child(4n) {
  margin-right: 0;
}
/* .file_data .file_data_list .img {
  position: relative;
  width: 150px;
  height: 200px;
} */
/* .file_data .file_data_list .img > img {
  width: 150px;
  height: 200px;
} */
.file_data .file_data_list .img .tag {
  position: absolute;
  bottom: 0;
  height: 30px;
  line-height: 30px;
  width: 100%;
  padding-left: 10px;
  background-color: #000;
  background-color: rgba(0, 0, 0, 0.6);
  font-size: 14px;
  /*opacity: 0.1;*/
}
.file_data .file_data_list .title {
  margin: 20px 0 5px;
  text-overflow: ellipsis;
  width: 100%;
  word-break: break-all;
  overflow: hidden;
  white-space: nowrap;
}
.file_data .file_data_list .time {
  color: #ccc;
  font-size: 14px;
  margin-top: 20px;
}
.file_data .file_data_list .time > span {
  float: left;
}
.file_data .file_data_list .time > span:last-child {
  float: right;
}
.file_data > div > div {
  height: 309px;
  width: 100%;
  text-align: center;
  line-height: 309px;
  color: #c9edfc;
  text-shadow: 0 0 2px #fff;
}
</style>
