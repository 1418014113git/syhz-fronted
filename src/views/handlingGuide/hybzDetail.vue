<template>
  <section>
    <el-row>
      <img src="@/assets/icon/back.png"  class="goBack" @click="callback">   <!--返回-->
    </el-row>
    <div class="hybzDetail" v-loading="loading">
      <div class="lineDetail">
        <div>类别：
          <!-- <span v-if="casezy.syhFllb === '1000'">食品</span>
          <span v-if="casezy.syhFllb === '2000'">药品</span>
          <span v-if="casezy.syhFllb === '3000'">环境</span>
          <span v-if="casezy.syhFllb === '4000'">综合</span> -->
          <span v-if="casezy.syhFllb === '1000'">国家标准</span>
          <span v-if="casezy.syhFllb === '2000'">行业标准</span>
          <span v-if="casezy.syhFllb === '3000'">企业标准</span>
          <span v-if="casezy.syhFllb === '4000'">地方标准</span>
        </div>
        <div>分类：<span>{{casezy.standardCategory}}</span> </div>
        <!-- <div class="detailBtn">
          <el-button type="success" plain @click="doEdit">修改</el-button>
          <el-button plain @click="callback">返回</el-button>
        </div> -->
      </div>
      <div class="lineDetail">
        <div>制定机关：<span>{{casezy.establishmentOrgan}}</span></div>
      </div>
      <div class="lineDetail">
        <div>颁布文号：<span>{{casezy.annex}}</span></div>
      </div>
      <div class="lineDetail">
        <div>颁布日期：<span>{{casezy.issueDate}}</span></div>
        <div>施行日期：<span>{{casezy.enforcementDate}}</span></div>
      </div>
      <div class="lineDetail">
        <div>时效性： <span>{{casezy.timeliness}}</span></div>
      </div>
      <div class="lineDetail">
        <el-button type="primary" plain @click="doEdit">修改</el-button>
      </div>
    </div>
    <div class="hybzContent">
      <div class="title">{{casezy.title}}</div>
      <div v-html="casezy.content" class="e-p-line ql-editor"></div>
    </div>
  </section>
</template>

<script>
import VueEditor from '@/components/Editor/VueEditor'
import {
  uploadImg
} from '@/utils/editorUpload'

export default {
  name: 'caseEdit',
  components: {
    VueEditor
  },
  data() {
    return {
      id: '',
      loading: false,
      currentDep: {},
      casezy: {
        syhFllb: '',
        lawCategory: '',
        lawCategoryName: '',
        title: '',
        content: '',
        establishmentOrgan: '',
        enactment: '',
        issueDate: '',
        enforcementDate: '',
        timeliness: '',
        annex: '',
        createUser: '',
        mergeUser: ''
      },
      categoryOptions: [
        {
          label: '法律', value: '1'
        },
        {
          label: '行政法规', value: '2'
        },
        {
          label: '地方性行政法规', value: '201'
        },
        {
          label: '部门规章', value: '202'
        },
        {
          label: '司法解释', value: '3'
        },
        {
          label: '其他规范性文件', value: '4'
        }
      ],
      optionClassify: [
        {
          value: '1000',
          label: '食品'
        }, {
          value: '2000',
          label: '药品'
        }, {
          value: '3000',
          label: '环境'
        }, {
          value: '4000',
          label: '综合'
        }
      ],
      optionsCategory: [
        {
          value: '1010',
          label: '食品中可能违法添加的非食用物质名单'
        }, {
          value: '1020',
          label: '食品中可能滥用的食品添加剂品种名单'
        },
        {
          value: '1030',
          label: '其它食品标准'
        },
        {
          value: '2010',
          label: '保健食品中易非法添加的物质和组分及检测依据'
        }, {
          value: '2020',
          label: '化妆品中易非法添加的物质、组分及检测依据'
        }, {
          value: '2030',
          label: '含可待因复方口服溶液品种目录'
        },
        {
          value: '2040',
          label: '其它药品标准'
        },
        {
          value: '3010',
          label: '其它环境标准'
        }
      ]
    }
  },
  methods: {
    // getCategoryData(key) {
    //   let a = ''
    //   this.categoryOptions.forEach(item1 => {
    //     if (item1.value === key) {
    //       a += item1.label + ','
    //     }
    //   })
    //   return a.substring(0, a.length - 1)
    // },
    doEdit() {
      this.$gotoid('/handlingGuide/hybz/edit', this.id)
    },
    callback() {
      this.$router.push({ path: '/handlingGuide/hybzList' })
    },
    getDetail() {
      this.loading = true
      this.$query('standard/' + this.id, {}).then(response => {
        this.loading = false
        this.casezy = response.data
        this.casezy.standardCategory = this.getSelectLabel(this.optionsCategory, this.casezy.standardCategory)
        this.casezy.issueDate = this.casezy.issueDate ? this.$parseTime(this.casezy.issueDate, '{y}-{m}-{d}') : ''
      }).catch(() => {
        this.loading = false
      })
    },
    handleImageAdded(file, Editor, cursorLocation, resetUploader) {
      const formData = new FormData()
      formData.append('file', file)
      uploadImg(formData).then((response) => {
        if (response.code === '000000') {
          Editor.insertEmbed(cursorLocation, 'image', response.data)
          resetUploader()
        }
      }).catch((e) => { })
    },
    getSelectLabel(array, val) {
      for (let i = 0; i < array.length; i++) {
        if (array[i].value === val) {
          return array[i].label
        }
      }
      return ''
    }
  },
  mounted() {
    this.currentDep = JSON.parse(sessionStorage.getItem('depToken'))[0]
    const curUser = JSON.parse(sessionStorage.getItem('userInfo'))
    if (this.currentDep && curUser) {
      this.casezy.createUser = curUser.realName
      this.casezy.mergeUser = curUser.realName
    }
    if (sessionStorage.getItem(this.$route.path)) {
      this.id = sessionStorage.getItem(this.$route.path)
      this.getDetail()
    }
  }
}
</script>

<style scoped>
.hybzDetail {
  padding: 20px;
  display: inline-block;
  width: 100%;
}
.hybzDetail > div.lineDetail {
  width: 100%;
  padding: 5px;
  display: inline-block;
}
.hybzDetail > div.lineDetail > div {
  float: left;
  width: 45%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.hybzDetail > div.lineDetail > div.detailBtn {
  width: 10%;
  text-align: right;
}
.hybzDetail > div.lineDetail > div > span {
  margin-left: 20px;
}
.hybzContent {
  border-top: 1px solid #eeeeee;
  padding-top: 20px;
  min-height: 500px;
}
.hybzContent .title {
  color: rgb(32, 160, 255);
  font-size: 26px;
  text-align: center;
}
</style>
