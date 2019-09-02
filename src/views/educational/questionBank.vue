<template>
  <div>
    <el-row type="flex" >
      <el-col :span="24">
        <el-row>
          <el-col :span="4" style="padding:5px 15px">
            <el-card style="height: 700px">
              <div slot="header">
                <span>题库分类</span>
              </div>
              <div>
                <el-menu text-color="white" >
                <el-menu-item index="1" @click="toSearch(1)">
                  <span  slot="title">食品安全</span>
                </el-menu-item>
                <el-menu-item index="2" @click="toSearch(2)">
                  <span slot="title">环境相关</span>
                </el-menu-item>
                <el-menu-item index="3" @click="toSearch(3)">
                  <span slot="title">药品安全</span>
                </el-menu-item>
                <el-menu-item index="4" @click="toSearch(4)">
                  <span slot="title">食药相关</span>
                </el-menu-item>
                </el-menu>
              </div>
            </el-card>
          </el-col>
          <el-col :span="20" style="padding:5px 15px;" v-loading="listLoading" align="center">
            <el-card>
              <el-form>
              <el-row>
                <el-col :span="10">难易程度：
                  <el-select v-model="value1" placeholder="请选择难易程度"clearable>
                    <el-option
                      v-for="item in options1"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-col>
                <el-col :span="10">题型：
                  <el-select v-model="value2" placeholder="请选择题型"clearable>
                    <el-option
                      v-for="item in options2"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <el-button type="primary" >搜索</el-button>
                  <el-button type="primary" @click="add()">新增</el-button>
                </el-col>
              </el-row>
              </el-form>
            </el-card>
            <div style="overflow:auto;padding-top: 10px" :style="{maxHeight:countHeight}"></div>
            <el-card >
            <el-table :data="tableData"  v-loading="false" row-style="height:55px">
              <el-table-column
                align="center"
                prop="no"
                label="序号"
                width="70">
              </el-table-column>
              <el-table-column
                align="center"
                prop="name"
                label="题干"
                width="500">
              </el-table-column>
              <el-table-column
                align="center"
                prop="type"
                label="题型"
                width="120">
              </el-table-column>
              <el-table-column
                align="center"
                prop="grade"
                label="难易度"
                width="120">
              </el-table-column>
              <el-table-column
                align="center"
                prop="date"
                label="创建日期"
                width="200">
              </el-table-column>
              <el-table-column label="操作"  align="center">
                <template slot-scope="scope">
                  <el-button size="mini"  @click="handleEdit(scope.$index, scope.row)">预览试题</el-button>
                  <el-button size="mini"  @click="handleUpdQus(scope.$index, scope.row)">修改</el-button>
                  <el-button  size="mini"  type="danger"  v-if="scope.row.deleteable=='1'"  @click="handleDelete(scope.$index, scope.row)">废除 </el-button>
                  <el-button  size="mini"  type="danger"  v-if="scope.row.deleteable=='2'"  @click="handleRevord(scope.$index, scope.row)">恢复 </el-button>
                </template>
              </el-table-column>
            </el-table>
            </el-card>
            <el-pagination
              :page-sizes="[10, 20]"
              :page-size="10"
              layout="total, sizes, prev, pager, next, jumper"
              :total="10"
              style="float:right;">
            </el-pagination>
          </el-col>
        </el-row>
        <el-dialog title="题目详情" width="700px" :visible.sync="dialogVisible">
          <el-form :model="detail">
          <el-row>
            <el-form-item label="题目">
              <span>{{detail.name}}</span>
            </el-form-item>
          </el-row>
            <el-row>
              <el-form-item label="A、">
                <span>{{detail.as1}}</span>
              </el-form-item>
            </el-row>
            <el-row >
              <el-form-item label="B、">
                <span>{{detail.as1}}</span>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="C、">
                <span>{{detail.as1}}</span>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="D、">
                <span>{{detail.as1}}</span>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="正确答案">
                <span>{{detail.realAs}}</span>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="试题解析">
                <span>{{detail.intr}}</span>
              </el-form-item>
            </el-row>
          </el-form>
          <el-row>
            <div style="display: flex;justify-content: center;">
              <el-button type="success" @click="cancel()" size="small">关闭</el-button>
            </div>
          </el-row>
        </el-dialog>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  /* eslint-disable no-sequences */

  import qusAdd from './add'
  import qusAEdit from './edit'
  export default {
    name: 'questionBank',
    components: {
      qusAdd,
      qusAEdit
    },
    data() {
      return {
        countHeight: document.documentElement.clientHeight - 240 + 'px',
        dialogVisible: false,
        detail: {},
        tableData: [],
        total: 0,
        searchText: '',
        listLoading: false,
        options1: [{
          value: '1',
          label: '简单'
        }, {
          value: '2',
          label: '中等'
        }, {
          value: '3',
          label: '困难'
        }],
        options2: [{
          value: '选项1',
          label: '单选题'
        }, {
          value: '选项2',
          label: '多选题'
        }, {
          value: '选项3',
          label: '判断题'
        }, {
          value: '选项4',
          label: '填空题'
        }, {
          value: '选项5',
          label: '解答题'
        }],
        value1: '',
        value2: '',
        tableData1: [{
          no: '1',
          date: '2019-08-22 14:25',
          name: ' 食物发生腐败变质的最主要原因是（）',
          type: '单选题',
          grade: '简单',
          deleteable: '1',
          as1: '微生物污染',
          as2: '农药残留',
          as3: '加工方法不合理',
          as4: '没有分类存放',
          realAs: 'B',
          intr: '微生物污染...'
        }, {
          no: '2',
          date: '2019-08-19 15:25',
          name: '违反《食品安全法》规定，构成犯罪的，依法追究( )',
          type: '单选题',
          grade: '简单',
          deleteable: '1',
          as1: '道德谴责',
          as2: '民事责任',
          as3: '刑事责任',
          as4: '都不是',
          realAs: 'B',
          intr: '刑事责任...'
        }, {
          no: '3',
          date: '2019-08-20 12:25',
          name: '寄生虫对人体的危害描述，那一项是错误的（）',
          type: '单选题',
          grade: '中等',
          deleteable: '1',
          as1: '争夺营养',
          as2: '机械损伤',
          as3: '分泌毒素',
          as4: '急性中毒',
          realAs: '',
          intr: '急性中毒...'
        }, {
          no: '4',
          date: '2019-08-21 13:25',
          name: '食品没有煮熟的四季豆导致中毒的原因是（）',
          type: '单选题',
          grade: '中等',
          deleteable: '1',
          as1: '含有皂素',
          as2: '含有秋水仙碱',
          as3: '含有龙葵碱',
          as4: '含有亚硝酸盐',
          realAs: 'A',
          intr: '含有皂素...'
        }, {
          no: '5',
          date: '2019-08-21 13:25',
          name: '以下哪种鱼腐败时产生组胺（）',
          type: '单选题',
          grade: '困难',
          deleteable: '1',
          as1: '鲫鱼',
          as2: '草鱼',
          as3: '鲐鱼',
          as4: '青鱼',
          realAs: 'C',
          intr: '鲐鱼...'
        }, {
          no: '6',
          date: '2019-08-22 14:25',
          name: '食品生产企业生产前，必须向质量监督部门获得（ ）',
          type: '单选题',
          grade: '简单',
          deleteable: '1',
          as1: '食品生产许可证',
          as2: '食品流通许可证',
          as3: '餐饮服务许可证',
          as4: '食品卫生许可证',
          realAs: 'A',
          intr: '食品生产许可证...'
        }, {
          no: '7',
          date: '2019-08-19 15:25',
          name: '进口的食品，食品添加剂以及食品相关产品应当符合（ ）',
          type: '单选题',
          grade: '简单',
          deleteable: '1',
          as1: '我国食品安全国家标准',
          as2: '出口国家食品安全标准',
          as3: '美国食品安全标准',
          as4: '双方约定的标准',
          realAs: 'A',
          intr: '我国食品安全国家标准...'
        }, {
          no: '8',
          date: '2019-08-20 12:25',
          name: '食品安全监管部门对食品不得实施（）',
          type: '单选题',
          grade: '中等',
          deleteable: '1',
          as1: '抽检',
          as2: '检查',
          as3: '免检',
          as4: '监督',
          realAs: 'C',
          intr: '免检...'
        }, {
          no: '9',
          date: '2019-08-21 13:25',
          name: '在中国境内市场销售的进口食品，必须使用下列那些标识（）',
          type: '单选题',
          grade: '中等',
          deleteable: '1',
          as1: '英文',
          as2: '中文',
          as3: '拼音',
          as4: '其他',
          realAs: 'B',
          intr: '中文...'
        }, {
          no: '10',
          date: '2019-08-21 13:25',
          name: '生产经营的食品的得添加（）',
          type: '单选题',
          grade: '困难',
          deleteable: '1',
          as1: '药品',
          as2: '中药材',
          as3: '化合剂',
          as4: '增白剂',
          realAs: 'A',
          intr: '药品...'
        }
        ],
        tableData2: [{
          no: '1',
          date: '2019-08-22 14:25',
          name: ' 酸雨形成的原因是（）进入时，形成酸性降雨',
          type: '单选题',
          grade: '简单',
          deleteable: '1',
          as1: '盐酸',
          as2: '二氧化碳',
          as3: '二氧化硫',
          as4: '二氧化硅',
          realAs: 'C',
          intr: '二氧化硫...'
        }, {
          no: '2',
          date: '2019-08-19 15:25',
          name: '臭氧可以吸收太阳光的( )',
          type: '单选题',
          grade: '简单',
          deleteable: '1',
          as1: '红外线',
          as2: '紫外线',
          as3: '可见光',
          as4: '热量',
          realAs: 'B',
          intr: '紫外线...'
        }, {
          no: '3',
          date: '2019-08-20 12:25',
          name: '人耳感觉到疼痛的声音级别为（）分贝',
          type: '单选题',
          grade: '中等',
          deleteable: '1',
          as1: '60',
          as2: '90',
          as3: '120',
          as4: '140',
          realAs: 'C',
          intr: '120...'
        }, {
          no: '4',
          date: '2019-08-21 13:25',
          name: '造成温室效应的气体为（）',
          type: '单选题',
          grade: '中等',
          deleteable: '1',
          as1: '二氧化碳',
          as2: '二氧化硫',
          as3: '氧气',
          as4: '氮气',
          realAs: 'A',
          intr: '二氧化碳...'
        }, {
          no: '5',
          date: '2019-08-21 13:25',
          name: '中国植树日为每年的（）',
          type: '单选题',
          grade: '困难',
          deleteable: '1',
          as1: '2月12',
          as2: '4月12',
          as3: '3月12',
          as4: '5月12',
          realAs: 'C',
          intr: '3月12...'
        }, {
          no: '6',
          date: '2019-08-22 14:25',
          name: '联合国环境划署总部设在（）的首都',
          type: '单选题',
          grade: '简单',
          deleteable: '1',
          as1: '泰国',
          as2: '瑞士',
          as3: '肯尼亚',
          as4: '美国',
          realAs: 'B',
          intr: '瑞士...'
        }, {
          no: '7',
          date: '2019-08-19 15:25',
          name: '世界最大的哺乳动物为（ ）',
          type: '单选题',
          grade: '简单',
          deleteable: '1',
          as1: '蓝鲸',
          as2: '长颈鹿',
          as3: '非洲象',
          as4: '鲨鱼',
          realAs: 'A',
          intr: '蓝鲸...'
        }, {
          no: '8',
          date: '2019-08-20 12:25',
          name: '世界最大的丹顶鹤越冬地在（）',
          type: '单选题',
          grade: '中等',
          deleteable: '1',
          as1: '俄罗斯',
          as2: '朝鲜',
          as3: '日本',
          as4: '中国',
          realAs: 'D',
          intr: '中国...'
        }, {
          no: '9',
          date: '2019-08-21 13:25',
          name: '中国政府坚定不移的贯彻执行环境保护这项（）',
          type: '单选题',
          grade: '中等',
          deleteable: '1',
          as1: '基本国策',
          as2: '政策',
          as3: '方法',
          as4: '工作',
          realAs: 'A',
          intr: '基本国策...'
        }, {
          no: '10',
          date: '2019-08-21 13:25',
          name: '不属于清洁能源的是（）',
          type: '单选题',
          grade: '困难',
          deleteable: '1',
          as1: '沼气',
          as2: '太阳能',
          as3: '煤炭',
          as4: '风力',
          realAs: 'C',
          intr: '煤炭...'
        }
        ]
      }
    },
    methods: {
      toSearch(val) {
        console.log(val)
        switch (val) {
          case 1:this.tableData = this.tableData1
            break
          case 2:this.tableData = this.tableData2
            break
          case 3:this.tableData = this.tableData1
            break
          case 4:this.tableData = this.tableData2
            break
          default:
            this.tableData = this.tableData1
            break
        }
      },
      handleEdit(index, row) {
        this.detail = row
        this.dialogVisible = true
      },
      handleUpdQus(index, row) {
        this.$router.push({ path: '/educational/edit/' })
      },
      handleDelete(index, row) {
        this.$confirm('确定要废除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          row.deleteable = '2',
          this.$message({
            type: 'success',
            message: '废除成功'
          })
        }).catch(() => {
          this.loading = false
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      },
      handleRevord(index, row) {
        this.$confirm('确定要恢复吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          row.deleteable = '1',
          this.$message({
            type: 'success',
            message: '恢复成功'
          })
        }).catch(() => {
          this.loading = false
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      },
      cancel() {
        this.dialogVisible = false
      },
      add() {
        this.$router.push({ path: '/educational/add/' })
      }
    },
    mounted() {
      this.tableData = this.tableData1
    }
  }
</script>

<style scoped>

</style>
