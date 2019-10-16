<template>
  <div class="classRoom_myLearning">
    <el-row class="caseEdit">
      <img src="@/assets/icon/back.png" class="goBack" @click="callback">
    </el-row>
    <el-card class="caseEdit">
      <p style="margin-top: 10px;">
        您累计学习<span>{{myData[0].totalCount}}</span>次，
        累计学习时间<span>{{$buildTime(myData[0].time) }}</span>
      </p>
      <el-row type="flex" justify="center" style="margin-top:15px;">
        <el-table :data="myData" v-loading="loading" stripe style="width: 100%;">
          <el-table-column prop="totalCount0" align="center" label="文档">
            <template slot-scope="scope">
              <span>{{scope.row.totalCount0}}次</span>
              <span>{{scope.row.time0 && scope.row.time0 > 0 ? $buildTime(scope.row.time0) : scope.row.time0 }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="totalCount1" align="center" label="视频">
            <template slot-scope="scope">
              <span>{{scope.row.totalCount1}}次</span>
              <span>{{scope.row.time1 && scope.row.time1 > 0 ? $buildTime(scope.row.time1) : scope.row.time1 }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="totalCount2" align="center" label="音频">
            <template slot-scope="scope">
              <span>{{scope.row.totalCount2}}次</span>
              <span>{{scope.row.time2 && scope.row.time2 > 0 ? $buildTime(scope.row.time2) : scope.row.time2 }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <p><i class="el-icon-info"></i> 当前只显示您最近10次在线学习的记录信息！</p>
      <el-row type="flex" justify="center" style="margin-top:15px;">
        <el-table :data="myLearningRecords" v-loading="loading" empty-text="未查询到学习记录" style="width: 100%;">
          <el-table-column type="index" label="序号" width="80"></el-table-column>
          <el-table-column prop="enName" label="资料名称"></el-table-column>
          <el-table-column prop="enType" label="资料类型">
            <template slot-scope="scope">
              <span v-if="scope.row.enType === 0">文档</span>
              <span v-if="scope.row.enType === 1">视频</span>
              <span v-if="scope.row.enType === 2">音频</span>
            </template>
          </el-table-column>
          <el-table-column prop="creationTime" label="学习时间"></el-table-column>
          <el-table-column prop="stopTime" label="学习时长">
            <!--<template slot-scope="scope">-->
              <!--{{parseFloat(scope.row.stopTime / 60 / 60).toFixed(4)}} 小时-->
            <!--</template>-->
            <template slot-scope="scope">
            {{scope.row.stopTime > 0 ? $buildTime(scope.row.stopTime) : '-'}}
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </el-card>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        source: '',
        filters: {},
        loading: false,
        form: {
          type: '',
          describe: '',
          icon: '',
          file: []
        },
        myData: [
          {
            totalCount: 0,
            time: 0,
            totalCount0: 0,
            time0: 0,
            totalCount1: 0,
            time1: 0,
            totalCount2: 0,
            time2: 0
          }
        ],
        myLearningRecords: [],
        rules: {}
      }
    },
    methods: {
      queryMyLearning() {
        this.loading = true
        // 调用查询接口
        const para = this.$setCurrentUser({})
        this.$query('traincoursemystatlog', { id: para.creationId }).then(response => {
          this.myData = []
          this.myData.push(response.data.totol)
          this.myLearningRecords = response.data.list
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      },
      callback() {
        const param = JSON.stringify(this.filters)
        if (this.source === 'online') {
          this.$gotoid('/micro/onlineClassRoom', param)
        }
        if (this.source === '0') {
          this.$gotoid('/micro/moreVideo', param)
        }
        if (this.source === '1') {
          this.$gotoid('/micro/moreAudio', param)
        }
        if (this.source === '2') {
          this.$gotoid('/micro/moreDocument', param)
        }
      }
    },
    mounted() {
      if (sessionStorage.getItem(this.$route.path)) {
        const param = JSON.parse(sessionStorage.getItem(this.$route.path))
        if (param !== undefined && param !== null && param !== '') {
          this.source = param.jumpType
          this.filters = param.param
        }
      }
      this.queryMyLearning()
    }
  }
</script>
<style>
  .classRoom_myLearning .el-upload.el-upload--text, .classRoom_uploadFile .el-upload-dragger{
    width: 100%;
  }
  .classRoom_myLearning p{
    margin-top: 30px;
  }
  .classRoom_myLearning p span{
    color: #ff8511;
    font-weight: bold;
    margin: 0 5px;
  }
  .classRoom_myLearning .el-table__row .cell span{
    display: inline-block;
    width: 40%;
  }
  .classRoom_myLearning .el-table__header th{
    border-bottom: 1px solid #ebeef5;
  }
</style>
