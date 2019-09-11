<template>
  <div class="excTemplate">
    <el-row>
      <el-col :span="8" class="test" v-for="(item,index) in models" :key="item.id">
        <el-card class="card">
          <div slot="header" class="clearfix">
            <span>{{item.name}}</span>
            <el-button class="rightBtn" type="primary">导出<i class="el-icon-download el-icon--right"></i></el-button>
            <el-button class="rightBtn" icon="el-icon-delete" type="danger"
                       @click="onDelItem(index,true)" :loading="fullLoading"></el-button>
            <el-button class="rightBtn" icon="el-icon-edit" type="primary" @click="showEdit(index)"></el-button>
          </div>
          <el-tag
            :key="tag"
            v-for="tag in item.tags"
            :disable-transitions="false">
            {{tag}}
          </el-tag>
        </el-card>
      </el-col>
      <el-col :span="8" class="test">
        <el-card class="card">
          <el-row>
            <el-button icon="el-icon-plus" class="add-btn" @click="showAddDia('新增模板')"></el-button>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog :visible.sync="diaAddVisible" class="body-class" @close="cancel()">
      <div slot="title">
        {{diaTitle}}
      </div>
      <el-row class="dia-div">
        <el-col class="lineCol">模板名称</el-col>
        <el-col :span="15" class="lineCol" style="margin-bottom: 15px">
          <el-input v-model="templateName" placeholder="请输入内容"></el-input>
        </el-col>
        <el-col class="lineCol">设置列</el-col>
        <el-col class="lineCol" style="margin-bottom: 15px">
          <el-tag
            :key="index"
            v-for="(tag, index) in curData"
            closable
            :disable-transitions="false"
            @close="handleClose(tag)">
            {{tag}}
          </el-tag>
          <el-input
            class="input-new-tag"
            v-if="inputVisible"
            v-model="inputValue"
            ref="saveTagInput"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm" style="font-size: 12px">
          </el-input>
          <el-button v-else class="button-new-tag" @click="showInput">+ 新增列</el-button>
        </el-col>
        <el-col class="lineCol">
          <el-button type="primary" :loading="subBtnLoading" @click="submitTags(true)">提交</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'excTemplate',
  components: {},
  data() {
    return {
      curIndex: -1,
      models: [
        {
          name: '人员上报模板',
          tags: []
        },
        {
          name: '装备上报模板',
          tags: []
        },
        {
          name: '机构上报模板',
          tags: []
        }
      ],
      curData: [],
      inputVisible: true,
      inputValue: '',
      diaTitle: '',
      templateName: '',
      fullLoading: false,
      subBtnLoading: false,
      diaAddVisible: false
    }
  },
  methods: {
    onDelItem(index, hand) {
      // var param = {}
      // if (hand) {
      //   param.logFlag = 1
      // }
      this.models.splice(this.models.indexOf(index), 1)
    },
    showEdit(index) {
      this.curIndex = index
      const m = JSON.parse(JSON.stringify(this.models[index]))
      this.templateName = m.name
      this.curData = m.tags
      this.diaAddVisible = true
      this.diaTitle = '修改模板'
    },
    showAddDia(title) {
      this.diaAddVisible = true
      this.diaTitle = title
      this.curData = []
      this.templateName = ''
    },
    submitTags(hand) {
      // var param = {}
      // if (hand) {
      //   param.logFlag = 1
      // }
      this.subBtnLoading = true
      if (this.curIndex > -1) {
        this.models[this.curIndex].name = this.templateName
        this.models[this.curIndex].tags = this.curData
      } else {
        this.models.push({ name: this.templateName, tags: this.curData })
      }
      this.cancel()
      this.subBtnLoading = false
    },
    cancel() {
      this.diaAddVisible = false
      this.curData = []
      this.templateName = ''
    },
    handleClose(tag) {
      this.curData.splice(this.curData.indexOf(tag), 1)
    },
    showInput() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm() {
      const inputValue = this.inputValue
      if (inputValue) {
        this.curData.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    getListData() {

    }
  },
  mounted() {
    this.getListData()
  }
}
</script>

<style scoped>
.excTemplate .test {
  padding: 5px 10px;
}
.excTemplate .card {
  height: 300px;
}
.excTemplate .add-btn {
  border: 0;
  font-size: 5em;
  width: 150px;
  height: 150px;
  display: block;
  margin: 55px auto;
}
.excTemplate .input_w {
  width: 200px;
}
.excTemplate .dia-padding {
  padding: 5px;
}
.excTemplate .rightBtn {
  float: right;
  margin-right: 5px;
  padding: 3px;
}
.excTemplate .errorText {
  padding-left: 20px;
  font-size: 12px;
  color: red;
}
.excTemplate .lineCol {
  line-height: 34px;
  height: 34px;
}
</style>
<style>
.el-tag {
  margin-right: 10px;
}
.button-new-tag {
  /*height: 24px;*/
  /*line-height: 24px;*/
  padding: 5px;
}
.input-new-tag {
  width: 100px;
  padding: 0;
  margin: 0;
  vertical-align: bottom;
}
</style>












