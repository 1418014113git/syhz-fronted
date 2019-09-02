<template>
  <div class="nowsApply">
    <p>无文书申请</p>
    <el-form  :model="ajInfo" ref="detail" label-width="108px" v-loading="loading" label-position="left">
      <el-collapse v-model="activeNames" @change="handleChange">
        <el-collapse-item title="案件信息" name="1">
          <el-row>
            <el-col :span="8">
              <el-form-item label="案件名称：" prop="ajmc">
                <span>{{ajInfo.ajmc}}</span>
              </el-form-item>
              <el-form-item label="立案时间：" prop="larq">
                <span>{{$handlerDateTime(ajInfo.larq)}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="案件编号：" prop="ajbh">
                <span @click="linkAjArchive" style="text-decoration: underline;cursor:pointer;">{{ajInfo.ajbh}}</span>
              </el-form-item>
              <el-form-item label="立案单位：" prop="ladwName">
                <span>{{ajInfo.ladwName}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="案件类别：" prop="ajlbName">
                <span>{{ajInfo.ajlbName}}</span>
              </el-form-item>
              <el-form-item label="案件状态：" prop="ajztName">
                <span>{{ajInfo.ajztName}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="23">
              <el-form-item label="简要案情：" prop="jyaq">
                <span>{{ajInfo.jyaq}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="主办单位：" prop="zbdwName">
                <span>{{ajInfo.zbdwName}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="主办侦查员：" prop="zbrName">
                <span>{{ajInfo.zbrName}}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-collapse-item>
        <el-collapse-item title="申请信息" name="2">
          <el-row>
            <el-col :span="8">
              <el-form-item label="申请单位：" prop="dept_name">
                <span>{{order.dept_name}}</span>
              </el-form-item>
              <el-form-item label="申请事由：" prop="ext1">
                <span>{{flow.ext1}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="申请人：" prop="user_name">
                <span>{{order.user_name}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="申请日期：" prop="create_time">
                <span>{{order.create_time}}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-collapse-item>
        <el-collapse-item title="附件下载" name="3">
          <el-row>
            <el-col :span="20">
              <p v-for="(item,index) in filesDetail" :key="index" style="padding-left: 30px;">
                <!-- <a @click="downFile(item.path)" style="text-decoration: underline;">{{item.name}}</a> -->
                <a :download="item.name" :href="item.path" style="text-decoration: underline;">{{item.name}}</a>
              </p>
            </el-col>
          </el-row>
        </el-collapse-item>
      </el-collapse>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'nowsApply',
  props: [
    'detail'
  ],
  components: {},
  data() {
    return {
      imgs: [],
      activeNames: ['1'],
      loading: false,
      filesDetail: [], // 附件
      ajInfo: {},
      order: {},
      flow: {}
    }
  },
  methods: {
    downFile(path) {
      window.open(path)
    },
    handleChange(val) {
      // console.log(val)
    },
    init() {
      if (this.flow && this.flow.ext2) {
        var files = this.flow.ext2.split('|')
        for (let index = 0; index < files.length; index++) {
          var element = files[index]
          element = JSON.parse(element)
          element.path = '/attachment/' + element.path.substring(element.path.indexOf('file'), element.path.length)
          this.filesDetail.push(element)
        }
      }
    },
    linkAjArchive() {
      this.$router.push({
        path: '/caseFile/index', query: { ajbh: this.ajInfo.ajbh, interfaceType: 'etl', isRl: '2' } // 不待认领按钮，不展示申请督办等按钮
      })
    }
  },
  mounted() {
    if (this.flow) {
      this.init()
    }
  },
  watch: {
    detail(val) {
      // console.log(val)
      this.ajInfo = val.ajInfo || {}
      this.order = val.order || {}
      this.flow = val.flow || {}
      this.init()
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.nowsApply {
  .el-collapse-item__header {
    font-weight: bold;
  }
  .el-collapse-item__content {
    padding: 0 20px;
  }
}
</style>
