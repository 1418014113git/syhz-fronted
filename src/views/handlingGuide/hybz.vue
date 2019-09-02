<template>
  <section class="hybz">
    <!--工具条-->
    <el-col :span="24" class="searchWrap">
      <el-form :inline="true" :model="filters">
        <!-- <el-row class="firstrow">
          <el-col :span="20" style="padding-bottom: 0;">
            <el-tabs v-model="activeName" @tab-click="handleClick">
              <el-tab-pane label="全库" name="0"></el-tab-pane>
              <el-tab-pane label="食品" name="1">
                <div class="paneDiv">
                  <el-radio-group v-model="radioGroupSP">
                    <el-radio-button label="1010" name="1">食品中可能违法添加的非食用物质名单</el-radio-button>
                    <el-radio-button label="1020" name="2">食品中可能滥用的食品添加剂品种名单</el-radio-button>
                    <el-radio-button label="1030" name="201">其它食品标准</el-radio-button>
                  </el-radio-group>
                </div>
              </el-tab-pane>
              <el-tab-pane label="药品" name="2">
                <div class="paneDiv">
                  <el-radio-group v-model="radioGroupYP">
                    <el-radio-button label="2010" name="2010">保健食品中易非法添加的物质和组分及检测依据</el-radio-button>
                    <el-radio-button label="2020" name="2020">化妆品中易非法添加的物质、组分及检测依据</el-radio-button>
                    <el-radio-button label="2030" name="2030">含可待因复方口服溶液品种目录</el-radio-button>
                    <el-radio-button label="2040" name="2040">其它药品标准</el-radio-button>
                  </el-radio-group>
                </div>
              </el-tab-pane>
              <el-tab-pane label="环境" name="3">
                <div class="paneDiv">
                  <el-radio-group v-model="radioGroupHJ">
                    <el-radio-button label="" name="1">其它环境标准</el-radio-button>
                  </el-radio-group>
                </div>
              </el-tab-pane>
            </el-tabs>
          </el-col>
          <el-col :span="2">
            <el-button type="primary" @click="add" class="more">更多</el-button>
          </el-col>
        </el-row> -->
        <el-row type="flex" justify="center"  :gutter="20">
          <el-col :span="6">
            <el-form-item>
              <el-cascader change-on-select size="large" :options="cascaderOptions" v-model="standardCategory" @change="handleChange" clearable></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-radio-group v-model="hasBatch" @change="hasBatchChange">
                <el-radio :label="0">无批次</el-radio>
                <el-radio :label="1">有批次</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="4" v-show="batchShow">
            <el-form-item class="batch" prop="batch">
                <el-input-number size="large" v-model="filters.batch" :min="1" :max="100" label="批次"></el-input-number>
              </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item size="large">
              <el-input placeholder="输入关键字搜索" v-model="filters.word">
                <el-button slot="append" v-on:click="query(true)" icon="el-icon-search" style="width: 100px; font-size: 17px; color: #fff;" v-if="$isViewBtn('120001')"></el-button>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item>
              <el-button type="primary" size="large" @click="add" v-if="$isViewBtn('120002')">添加</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-button type="primary" size="large" @click="handelMore" class="more" v-if="$isViewBtn('120003')">更多</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-col>
    <el-col :span="24" v-loading="loading">
      <el-card class="box-card" >
        <div slot="header">
          <span>为您检索到：{{ total }} &nbsp;条相关记录</span>
        </div>
        <!-- <div v-for="(item,index) in dataList" :key="item.value" class="lineStyle" @click='detail(item.id)'>
          <el-col :span="24" style="font-size: 16px; font-weight: bold">{{ item.title }}</el-col>
          <el-col :span="12" style="color: #999;">发布机构：{{ item.establishmentOrgan }}</el-col>
          <el-col :span="12" style="color: #999;">发布时间：{{ item.issueDate }}</el-col>
          <p>{{ item.title }}</p>
          <p><span>发布机构：{{ item.establishmentOrgan }}</span><span>发布时间：{{ item.issueDate }}</span></p>
        </div> -->
        <el-table :data="dataList" v-loading="loading" style="width: 100%;" :max-height="tableHeight">
          <el-table-column type="index" label="序号" width="100"></el-table-column>
          <el-table-column prop="title" label="标题"></el-table-column>
          <el-table-column prop="establishmentOrgan" label="颁布机关"></el-table-column>
          <el-table-column prop="issueDate" label="颁布时间" width="160"></el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <!-- v-if="$isViewBtn('1192004')" -->
              <el-button title="详情" type="primary" plain size="mini" @click="$gotoid('/handlingGuide/hybz/detail', scope.row.id)" v-if="$isViewBtn('120004')">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <el-col :span="24" class="toolbar">
        <el-pagination v-if="total > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" @size-change="handleSizeChange"
                       :page-size="pageSize" :total="total" :current-page="page" style="float:right;">
        </el-pagination>
      </el-col>
    </el-col>
  </section>
</template>

<script>
export default {
  data() {
    return {
      hasBatch: 0,
      batchShow: false,
      filters: {
        word: '',
        batch: ''
      },
      radioGroupSP: '',
      radioGroupYP: '',
      radioGroupHJ: '',
      loading: false,
      standardCategory: [],
      total: 0,
      page: 1,
      pageSize: 15,
      dataList: [],
      isActive: 0,
      activeName: '0',
      activeCategory: '',
      tableHeight: null,
      cascaderOptions: [{
        value: '1000',
        // label: '食品',
        label: '国家标准',
        children: [
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
          }
        ]

      }, {
        value: '2000',
        // label: '药品',
        label: '行业标准',
        children: [
          {
            value: '2010',
            label: '保健食品中易非法添加的物质和组分及检测依据'
          }, {
            value: '2020',
            label: '化妆品中易非法添加的物质、组分及检测依据'
          }, {
            value: '2030',
            label: '含可待因复方口服溶液品种目录',
            children: [{
              value: '2031',
              label: '国产'
            }, {
              value: '2032',
              label: '进口'
            }]
          },
          {
            value: '2040',
            label: '其它药品标准'
          }
        ]
      }, {
        value: '3000',
        // label: '环境',
        label: '企业标准',
        children: [{
          value: '01',
          label: '其它环境标准'
        }]
      },
      {
        value: '4000',
        // label: '综合'
        label: '地方标准'
      }],
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
    handleCurrentChange(val) {
      this.page = val
      this.query(false)
    },
    handleSizeChange(val) {
      this.page = 1
      this.pageSize = val
      this.query(false)
    },
    hasBatchChange(val) {
      if (val === 1) { // 有批次
        this.batchShow = true
      } else { // 无批次
        this.batchShow = false
      }
    },
    query(flag) {
      this.loading = true
      this.page = flag ? 1 : this.page
      const para = {
        pageNum: this.page,
        content: this.filters.word ? this.filters.word : '',
        pageSize: this.pageSize
      }
      if (this.batchShow) {
        para.batch = this.filters.batch
      } else {
        para.batch = ''
      }
      para.syhFllb = this.standardCategory[0] ? this.standardCategory[0] : ''
      para.standardCategory = this.standardCategory[1] ? this.standardCategory[1] : ''
      para.varietyCategory = this.standardCategory[2] ? this.standardCategory[2] : ''
      this.$query('page/standard', para).then((response) => {
        this.loading = false
        this.dataList = response.data.list
        this.dataList.forEach(element => {
          element.issueDate = element.issueDate ? this.$parseTime(element.issueDate, '{y}-{m}-{d}') : ''
          if (element.standardCategory !== '1030' && element.standardCategory !== '2040' && element.standardCategory !== '3010') {
            element.title = this.getSelectLabel(this.optionsCategory, element.standardCategory) + ' 第' + element.batch + '批 ' + element.title
          }
        })
        this.total = response.data.totalCount
        this.page = response.data.pageNum
        this.pageSize = response.data.pageSize
      }).catch(() => {
        this.loading = false
      })
    },
    selectTypeChange() {
      this.query()
    },
    handleChange(value) {
      // console.log(value)
    },
    handleClick(tab, event) {
      this.checkboxGroup1 = []
    },
    detail(id) {
      this.$gotoid('/handlingGuide/hybz/detail', id)
    },
    add() {
      this.$router.push({ path: '/handlingGuide/hybz/add' })
    },
    handelMore() {
      window.open('http://10.1.1.17:81/spcweb/Customer/Index.aspx')
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
    this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 330
    this.query(true)
    this.curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
    this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
  },
  activated() { // 因为查询页被缓存，所以此页面需要此生命周期下才能刷新数据
    this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 330
  }
}
</script>

<style>
.hybz .el-card__body {
  padding: 10px 1px;
}
.lineStyle {
  padding: 5px 50px;
  border-bottom: 1px dotted #ccc;
  display: inline-block;
  width: 100%;
}
.lineStyle .el-col {
  padding: 5px;
}
.hybz .el-input-group__append {
  background: #0082e6;
  border: none;
}
.hybz .el-form-item__content {
  width: 100%;
}

.firstrow {
  width: 50%;
  margin: 0 auto;
}
/* .el-radio-group label {
	float: left;
	width: 50%;
	text-align: left;
}
.el-radio-group label span {
	display: inline-block;
	border: none;
	border-radius: 0px;
} */
.paneDiv {
  float: left;
  margin-bottom: 12px;
}
/* .el-radio-button:first-child .el-radio-button__inner {
	border-left: none;
}
.el-radio-button:first-child .el-radio-button__inner,
.el-radio-button:last-child .el-radio-button__inner {
	border-radius: 0px;
} */
.hybz .el-cascader {
  width: 100%;
}
.hybz .searchWrap {
  text-align: center;
  margin: 20px auto;
}
.hybz .el-form-item {
  width: 100%;
}
</style>
