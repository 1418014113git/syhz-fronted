<template>
  <section>

    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span>案件操作</span>
        <img src="@/assets/icon/back.png"  class="goBack" @click="toback">   <!--返回-->
      </div>
      <el-form class="ajInfoForm" style="width: 540px; margin:0 auto" :model="ajInfo" ref="form" :rules="rules" size="small" label-width="120px"
               @submit.prevent="onSubmit">
        <el-form-item label="案件类型：" prop="fllb">
          <el-cascader v-model="ajInfo.fllb" change-on-select filterable :options="fllbList" @change="handleChange" clearable></el-cascader>
          <el-button type="primary" style="margin-left: 20px;" v-on:click="toAjDetail(ajInfo.AJBH)">案件详情</el-button>
          <el-button type="primary" style="margin-left: 20px;" v-on:click="editFllb()">更改类型</el-button>
        </el-form-item>
        <div  style="text-align: center">
          <el-button type="primary" size="medium" :disabled="ajInfo.status==5 || ajInfo.status == 9 || ajInfo.status == 10" @click="rlsave()" :loading="rlLoading">认领</el-button>
        </div>
      </el-form>
     <!-- <el-form class="ajInfoForm" :model="ajInfo" ref="ajInfo" :rules="rules"  size="small" label-width="150px"
               @submit.prevent="onSubmit">
      <el-row>
        <el-col :span="16">

          <el-row :gutter="20">
            <el-col :span="12">
              <el-card class="box-card" body-style="height:130px">
                <div class="text_center">
                  <el-row style="margin:6px">
                    <el-col>

                      <el-row >
                           <el-form-item label="案件名称："  prop="AJMC">
                             <el-input  v-model="ajInfo.AJMC" placeholder="请输入案件名称"></el-input>
                           </el-form-item>
                      </el-row>

                    </el-col>
                  </el-row>
                  <el-row style="margin:6px">
                    <el-col>

                      <el-row >
                        <el-form-item label="案件编号："  prop="AJBH">
                          <el-input  v-model="ajInfo.AJBH" placeholder="请输入案件编号"></el-input>
                        </el-form-item>
                      </el-row>

                    </el-col>
                  </el-row>
                  <el-row style="margin:6px">
                    <el-col :span="12">

                      <el-row >
                        <el-form-item  label-width="86px" label="状态："  prop="AJZT">
                          <el-input  v-model="ajInfo.AJZT" placeholder="请输入状态"></el-input>
                        </el-form-item>
                      </el-row>
                    </el-col>
                    <el-col :span="12">

                      <el-row >
                        <el-form-item label-width="92px" label="涉案价值："  prop="SAJZ">
                          <el-input  v-model="ajInfo.SAJZ" placeholder="请输入涉案价值"></el-input>
                        </el-form-item>
                      </el-row>

                    </el-col>
                  </el-row>
                </div>
              </el-card>
            </el-col>
            <el-col :span="12">
              <el-card class="box-card" body-style="height:130px">
                <div class="text_center">
                  <el-row style="margin:6px">
                    <el-col>

                      <el-row >
                        <el-form-item  label="案件来源："  prop="AJLY">
                          <el-input  v-model="ajInfo.AJLY" placeholder="请输入案件来源"></el-input>
                        </el-form-item>
                      </el-row>

                    </el-col>
                  </el-row>
                  <el-row style="margin:6px">
                    <el-col style="text-align: center">

                      <el-row >
                        <el-form-item  label="案件性质："  prop="AJXZ">
                          <el-input  v-model="ajInfo.AJXZ" placeholder="请输入案件性质"></el-input>
                        </el-form-item>
                      </el-row>

                    </el-col>
                  </el-row>
                  <el-row style="margin:6px">
                    <el-col :span="24">

                      <el-row >
                        <el-form-item  label="受理时间："  prop="SLSJ">
                          <el-date-picker style="width:100%"
                                          v-model="ajInfo.SLSJ"
                                          type="datetime"
                                          value-format="yyyy-MM-dd HH:mm:ss"
                                          placeholder="选择日期">
                          </el-date-picker>
                        </el-form-item>
                      </el-row>

                    </el-col>
                  </el-row>
                </div>
              </el-card>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-card class="box-card" body-style="height:130px">
                <div class="text_center">
                  <el-row style="margin:6px">
                    <el-col>

                      <el-row >
                        <el-form-item  label="案件类型："  prop="SYH_FLLB">
                          <el-input  v-model="ajInfo.SYH_FLLB" placeholder="请输入案件类型"></el-input>
                        </el-form-item>
                      </el-row>

                    </el-col>
                  </el-row>
                  <el-row style="margin:6px">
                    <el-col>

                      <el-row >
                        <el-form-item  label="案件类别："  prop="AJLB">
                          &lt;!&ndash;<el-input  v-model="ajInfo.AJLB" placeholder="请输入案件类型"></el-input>&ndash;&gt;

                          <el-select style="width:100%" size="small" v-model="ajInfo.AJLB" clearable placeholder="案件类型">
                            <el-option style="width: 200px" v-for="item in ajlbList" :key="item.code" :label="item.code_name" :value="item.code"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-row>

                    </el-col>
                  </el-row>
                  <el-row style="margin:6px">
                    <el-col :span="24">

                      <el-row >
                        <el-form-item  label="立案日期："  prop="LARQ">
                          <el-date-picker style="width:100%"
                                          v-model="ajInfo.LARQ"
                                          type="date"
                                          value-format="yyyy-MM-dd"
                                          placeholder="选择日期">
                          </el-date-picker>
                        </el-form-item>
                      </el-row>

                    </el-col>
                  </el-row>
                </div>
              </el-card>
            </el-col>
            <el-col :span="12">
              <el-card class="box-card" body-style="height:130px">
                <div class="text_center">
                  <el-row style="margin:6px">
                    <el-col>

                      <el-row >
                        <el-form-item  label="发案地域：" >
                          <el-select v-model="ajInfo.FADY" style="width: 100%" placeholder="请选择发案地域">
                            <el-option label="西北" value="1"></el-option>
                            <el-option label="华北" value="2"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-row>

                    </el-col>
                  </el-row>
                  <el-row style="margin:6px">
                    <el-col>

                      <el-row >
                        <el-form-item  label="发案部位："  prop="FABW">
                          <el-input  v-model="ajInfo.FABW" placeholder="请输入发案部位"></el-input>
                        </el-form-item>
                      </el-row>

                    </el-col>
                  </el-row>
                  <el-row style="margin:6px">
                    <el-col :span="24">

                      <el-row >
                        <el-form-item  label="发现时间："  prop="FXSJ">
                          <el-date-picker style="width:100%"
                                          v-model="ajInfo.FXSJ"
                                          type="datetime"
                                          value-format="yyyy-MM-dd HH:mm:ss"
                                          placeholder="选择日期">
                          </el-date-picker>
                        </el-form-item>
                      </el-row>

                    </el-col>
                  </el-row>
                </div>
              </el-card>
            </el-col>
          </el-row>

        </el-col>
        <el-col :span="8">
         &lt;!&ndash; <el-form class="ajInfoForm" :model="ajInfo" ref="ajInfo" :rules="rules"  size="small" label-width="150px"
                   @submit.prevent="onSubmit">&ndash;&gt;
            <el-form-item label="立案单位" prop="LADW">
              <el-input v-model="ajInfo.LADW" ></el-input>
            </el-form-item>
            <el-form-item label="作案特点" prop="ZATD">
              <el-input v-model="ajInfo.ZATD"></el-input>
            </el-form-item>
            <el-form-item label="案件属性" prop="AJSX">
              <el-input v-model="ajInfo.AJSX"></el-input>
            </el-form-item>
            <el-form-item label="危害程度" >
              <el-select v-model="ajInfo.WHCD" style="width: 100%" placeholder="请选择危害程度">
                <el-option label="大" value="1"></el-option>
                <el-option label="小" value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="发案地市县区" prop="FADZSSXQ">
              <el-input v-model="ajInfo.FADZSSXQ"></el-input>
            </el-form-item>
            <el-form-item label="发案地址门楼祥址" prop="FADZMLXZ">
              <el-input v-model="ajInfo.FADZMLXZ"></el-input>
            </el-form-item>
            <el-form-item label="作案渠道"  prop="ZAQD">
              <el-input v-model="ajInfo.ZAQD"></el-input>
            </el-form-item>
            <el-form-item label="主案编号"  prop="ZABH">
              <el-input v-model="ajInfo.ZABH"></el-input>
            </el-form-item>

        </el-col>

      </el-row>

       <el-row>
           <el-col :span="24" style="text-align: center">
             <el-button type="primary" size="medium" :disabled="ajInfo.status==5" @click="save()">认领</el-button>
           </el-col>
       </el-row>
      </el-form>
-->
    </el-card>
    <!--基础信息1start-->
    <template>
      <section>
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <span>基础信息一</span>
            <!--<el-tag color="yellow">部督办</el-tag>
            <el-tag color="yellow">涉外</el-tag>
            <el-tag color="yellow">公开</el-tag>
            <el-tag color="yellow">专案</el-tag>
            <el-tag color="yellow">涉网</el-tag>-->
          </div>
          <el-row>
            <el-col :span="16">
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-card class="box-card" body-style="height:130px">
                    <div class="text_center">
                      <el-row>
                        <el-col>
                          <h2 style="font-size: 16px;">
                            <i class="el-icon-info" style="color:#1E98D2;"></i><span class="ajbh-color" v-on:click="toAjDetail(ajInfo.AJBH)">{{ajInfo.AJMC}}</span></h2>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col><i class="el-icon-star-on" style="color:#1E98D2;font-size: 16px"></i><span class="ajbh-color" v-on:click="toAjDetail(ajInfo.AJBH)">{{ajInfo.AJBH}}</span>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="12">状态：{{ajInfo.AJZT_NAME}}</el-col>
                        <el-col :span="12">涉案价值：{{ajInfo.SAJZ}}</el-col>
                      </el-row>
                    </div>
                  </el-card>
                </el-col>
                <el-col :span="12">
                  <el-card class="box-card" body-style="height:130px">
                    <div class="text_center">
                      <el-row>
                        <el-col><h2 style="font-size: 16px;"><i class="el-icon-mobile-phone" style="color:#1E98D2;"></i>案件来源：{{ajInfo.AJLY_NAME}}
                        </h2></el-col>
                      </el-row>
                      <el-row>
                        <el-col style="text-align: center">案件性质：{{ajInfo.AJXZ_NAME}}</el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="24">受理时间：{{$handlerDateTime(ajInfo.SLSJ)}}</el-col>
                      </el-row>
                    </div>
                  </el-card>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-card class="box-card" body-style="height:130px">
                    <div class="text_center">
                      <el-row>
                        <el-col><h2 style="font-size: 16px;"><i class="el-icon-mobile-phone" style="color:#1E98D2;"></i>案件类型：{{getFllbName(ajInfo.SYH_FLLB)}}
                        </h2></el-col>
                      </el-row>
                      <el-row>
                        <el-col>案件类别：{{ajInfo.AJLB_NAME}}</el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="24">立案日期：{{$handlerDateTime(ajInfo.LARQ)}}</el-col>
                      </el-row>
                    </div>
                  </el-card>
                </el-col>
                <el-col :span="12">
                  <el-card class="box-card" body-style="height:130px">
                    <div class="text_center">
                      <el-row>
                        <el-col><h2 style="font-size: 16px;"><i class="el-icon-mobile-phone" style="color:#1E98D2;"></i>发案地域：{{ajInfo.FADY_NAME}}
                        </h2></el-col>
                      </el-row>
                      <el-row>
                        <el-col>发案部位：{{ajInfo.FABW_NAME}}</el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="24">发现时间：{{$handlerDateTime(ajInfo.FXSJ)}}</el-col>
                      </el-row>
                    </div>
                  </el-card>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="8">

              <el-row :gutter="20" style="margin:12px">
                <el-col style="text-align: right" :span="12">立案单位 :</el-col>
                <el-col :span="12" style="word-break: break-all;">{{ajInfo.LADW_NAME}}</el-col>
              </el-row>
              <el-row :gutter="20" style="margin:12px">
                <el-col style="text-align: right" :span="12">作案特点 :</el-col>
                <el-col :span="12" style="word-break: break-all;">{{ajInfo.ZATD_NAME}}</el-col>
              </el-row>
              <el-row :gutter="20" style="margin:12px">
                <el-col style="text-align: right" :span="12">案件属性 :</el-col>
                <el-col :span="12" style="word-break: break-all;">{{ajInfo.AJSX_NAME}}</el-col>
              </el-row>
              <el-row :gutter="20" style="margin:12px">
                <el-col style="text-align: right" :span="12">危害程度 :</el-col>
                <el-col :span="12" style="word-break: break-all;">{{ajInfo.WHCD_NAME}}</el-col>
              </el-row>
              <el-row :gutter="20" style="margin:12px">
                <el-col style="text-align: right" :span="12">发案地市县区 :</el-col>
                <el-col :span="12" style="word-break: break-all;">{{ajInfo.FADZSSXQ_NAME}}</el-col>
              </el-row>
              <el-row :gutter="20" style="margin:12px">
                <el-col style="text-align: right" :span="12">发案地址门楼详址 :</el-col>
                <el-col :span="12" style="word-break: break-all;">{{ajInfo.FADZMLXZ}}</el-col>
              </el-row>
              <el-row :gutter="20" style="margin:12px">
                <el-col style="text-align: right" :span="12">作案渠道 :</el-col>
                <el-col :span="12" style="word-break: break-all;">{{ajInfo.ZAQD}}</el-col>
              </el-row>
              <el-row :gutter="20" style="margin:12px">
                <el-col style="text-align: right" :span="12">主案编号 :</el-col>
                <el-col :span="12" style="word-break: break-all;">{{ajInfo.ZABH}}</el-col>
              </el-row>

            </el-col>
          </el-row>
        </el-card>
      </section>
    </template>
    <!--基础信息1end-->
    <template>
      <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
          <span>基础信息二</span>
        </div>
        <el-tabs v-model="activeName" @tab-click="handleClick" style="padding:0 5px;">
          <el-tab-pane label="基础信息" name="first">
            <el-row style="margin:15px">
              <el-col :span="4" style="text-align: right">案件类别1 :</el-col><el-col :span="4"><div> <span> &nbsp;{{ajInfo.AJLB1_NAME}}</span></div></el-col>
              <el-col :span="4" style="text-align: right">案件类别2 :</el-col><el-col :span="4"><span>&nbsp;{{ajInfo.AJLB2_NAME}}</span></el-col>
              <el-col :span="4" style="text-align: right">报案人 :</el-col><el-col :span="4"><span>&nbsp;{{ajInfo.BARXM}}</span></el-col>
            </el-row>

            <el-row style="margin:15px">
              <el-col :span="4" style="text-align: right">发案时间 :</el-col>
              <el-col :span="12" style="padding-left: 10px;">{{$handlerDateTime(ajInfo.FASJSX)}}&nbsp;至&nbsp;{{$handlerDateTime(ajInfo.FASJXX)}}&nbsp;</el-col>
              <el-col :span="4" style="text-align: right">是否单位作案 :</el-col>
              <el-col :span="4">&nbsp;{{ajInfo.SFDWZA_NAME}}</el-col>
            </el-row>

            <el-row style="margin:15px">
              <el-col :span="4" style="text-align: right">是否有现场 :</el-col><el-col :span="4">&nbsp;{{ajInfo.SFYXC_NAME}}</el-col>
              <el-col :span="4" style="text-align: right">犯罪主体类型 :</el-col><el-col :span="4">&nbsp;{{ajInfo.FZZTLX_NAME}}</el-col>
              <el-col :span="4" style="text-align: right">发案单位名称 :</el-col><el-col :span="4">&nbsp;{{ajInfo.FADWMC}}</el-col>
            </el-row>

            <el-row style="margin:15px">
              <el-col :span="4" style="text-align: right">作案人数 :</el-col><el-col :span="4">&nbsp;{{ajInfo.ZARS}}</el-col>
              <el-col :span="4" style="text-align: right">抓获人员数 :</el-col><el-col :span="4">&nbsp;{{ajInfo.ZHRYS}}</el-col>
              <el-col :span="4" style="text-align: right">案件集团人数 :</el-col><el-col :span="4">&nbsp;{{ajInfo.JTRS}}</el-col>
            </el-row>

            <el-row style="margin:15px">
              <el-col :span="4" style="text-align: right">作案原因 :</el-col>
              <el-col :span="20">&nbsp;{{ajInfo.ZAYY_NAME}}</el-col>
            </el-row>
            <el-row style="margin:15px 15px 50px">
              <el-col :span="4" style="text-align: right">简要案情 :</el-col>
              <el-col :span="20">&nbsp;{{ajInfo.JYAQ}}</el-col>
            </el-row>

          </el-tab-pane>
        </el-tabs>
      </el-card>
    </template>

    <!--<Tab :tabData="tabData"></Tab>-->
  </section>
</template>
<script>
import Tab from './Tab'
import { getAJJBXXETLRL, addAJJBXXSYHRL } from '@/api/caseManage'
import { getTCode } from '@/api/inforCollection'
import { getUserInfo } from '@/utils/auth'
import { getSYHFLLBList, getAJLBText } from '@/utils/codetotext'

export default {
  data() {
    return {
      ajInfo: {
        id: '',
        delivery: false,
        type: [],
        primaryType: '',
        resource: '',
        LADW: '',
        fllb: []
      },
      ajlbList: [],
      xzqhList: [],
      rlLoading: false,
      fllbList: getSYHFLLBList(), // 案件分类类别
      tingDeptData: [
        {
          code: '610000535300',
          name: '陕西省公安厅环境食品药品犯罪侦查总队食品犯罪侦查支队'
        }, {
          code: '610000535400',
          name: '陕西省公安厅环境食品药品犯罪侦查总队药品犯罪侦查支队'
        }, {
          code: '610000535500',
          name: '陕西省公安厅环境食品药品犯罪侦查总队环境犯罪侦查支队'
        }
      ],
      rules: {
        LADW: [{ required: true, message: '请输入立案单位', trigger: 'blur' },
          { max: 12, message: '最大长度12个字符', trigger: 'blur' }
        ],
        ZATD: [{ required: true, message: '请输入作案特点', trigger: 'blur' },
          { max: 67, message: '最大长度67个字符', trigger: 'blur' }
        ],
        AJSX: [{ required: true, message: '请输入案件属性', trigger: 'blur' },
          { max: 16, message: '最大长度16个字符', trigger: 'blur' }
        ],
        FADZSSXQ: [{ required: true, message: '请输入发案地市县区', trigger: 'blur' },
          { max: 6, message: '最大长度6个字符', trigger: 'blur' }
        ],
        FADZMLXZ: [{ required: true, message: '请输入发案地址门楼祥址', trigger: 'blur' },
          { max: 150, message: '最大长度150个字符', trigger: 'blur' }
        ],
        ZAQD: [{ required: true, message: '请输入作案渠道', trigger: 'blur' },
          { max: 50, message: '最大长度50个字符', trigger: 'blur' }
        ],
        ZABH: [{ required: true, message: '请输入主案编号', trigger: 'blur' },
          { max: 23, message: '最大长度23个字符', trigger: 'blur' }
        ],
        AJMC: [{ required: true, message: '请输入案件名称', trigger: 'blur' },
          { max: 200, message: '最大长度200个字符', trigger: 'blur' }
        ],
        AJBH: [{ required: true, message: '请输入案件编号', trigger: 'blur' },
          { max: 23, message: '最大长度23个字符', trigger: 'blur' }
        ],
        AJZT: [{ required: true, message: '请输入状态', trigger: 'blur' },
          { max: 3, message: '最大长度3个字符', trigger: 'blur' }
        ],
        SAJZ: [{ required: true, message: '请输入涉案价值', trigger: 'blur' },
          { max: 12, message: '最大长度12个字符', trigger: 'blur' }
        ],
        AJLY: [{ required: true, message: '请输入案件来源', trigger: 'blur' },
          { max: 3, message: '最大长度3个字符', trigger: 'blur' }
        ],
        AJXZ: [{ required: true, message: '请输入案件性质', trigger: 'blur' },
          { max: 8, message: '最大长度8个字符', trigger: 'blur' }
        ],
        SLSJ: [{ required: true, message: '请输入受理时间', trigger: 'blur' }],
        SYH_FLLB: [{ required: true, message: '请输入案件类型', trigger: 'blur' },
          { max: 50, message: '最大长度50个字符', trigger: 'blur' }
        ],
        AJLB: [{ required: true, message: '请输入案件类别', trigger: 'blur' },
          { max: 6, message: '最大长度6个字符', trigger: 'blur' }
        ],
        LARQ: [{ required: true, message: '请输入立案日期', trigger: 'blur' }],
        FABW: [{ required: true, message: '请输入发案部位', trigger: 'blur' },
          { max: 14, message: '最大长度14个字符', trigger: 'blur' }
        ],
        FXSJ: [{ required: true, message: '请输入发现时间', trigger: 'blur' }],
        fllb: [{ required: true, message: '请选择案件类型', trigger: 'blur' }]
      },
      tabData: [
        { title: '案件描述', content: 'Describe' },
        { title: '作案特征', content: 'CrimeFeature' },
        { title: '造成后果', content: 'List' },
        { title: '作案手段特点描述', content: 'Tab' },
        { title: '损失物品', content: 'High' },
        { title: '缴获', content: 'Rank' },
        { title: '时间轴', content: 'Work' }
      ],
      activeName: 'first'
    }
  },
  components: {
    Tab
  },
  methods: {
    handleChange(value) {
      // console.log(value)
    },
    getFllbName(fllb) {
      if (fllb && fllb.indexOf(',') > -1) {
        const array = fllb.split(',')
        let text = ''
        for (let i = 0; i < array.length; i++) {
          text += '，' + getAJLBText(array[i])
        }
        return text.substring(1, text.length)
      } else {
        return getAJLBText(fllb)
      }
      // if (fllb === '1') {
      //   return '食药'
      // } else if (fllb === '2') {
      //   return '环境'
      // } else if (fllb === '3') {
      //   return '食品'
      // } else if (fllb === '4') {
      //   return '药品'
      // } else {
      //   return fllb
      // }
    },
    handleClick(tab, event) {
      // console.log(tab, event)
    },
    detail() {
      const para = {
        id: this.ajInfo.id
      }
      getAJJBXXETLRL(para).then((response) => {
        this.ajInfo = response.data
        if (this.ajInfo.SYH_FLLB) { // 案件详情存在 案件类型
          // this.ajInfo.fllb = this.ajInfo.SYH_FLLB
          this.ajInfo.fllb = this.ajInfo.SYH_FLLB.split(',')
        }
      })
    },
    tcode() {
      // getTCode({ codeLx: 'fllb' }).then((response) => {
      //   this.fllbList = response.data
      // })
      getTCode({ codeLx: 'ajlb' }).then((response) => {
        this.ajlbList = response.data
      })
      getTCode({ codeLx: 'xzqh' }).then((response) => {
        this.xzqhList = response.data
      })
    },
    getCodeName(value, type) {
      if (type === 'ajlb') {
        for (let i = 0; i < this.ajlbList.length; i++) {
          if (value === this.ajlbList[i].code) return this.ajlbList[i].code_name
        }
      } else if (type === 'xzqh') {
        for (let i = 0; i < this.xzqhList.length; i++) {
          if (value === this.xzqhList[i].code) return this.xzqhList[i].code_name
        }
      }
    },
    rlsave() {
      this.$refs.form.validate(valid => {
        if (valid) {
          var ajString = JSON.stringify(this.ajInfo)
          ajString = JSON.parse(ajString)
          if (ajString.fllb[0] === '1') {
            ajString.tDeptCode = this.tingDeptData[0].code
            ajString.tDeptName = this.tingDeptData[0].name
          } else if (ajString.fllb[0] === '2') {
            ajString.tDeptCode = this.tingDeptData[1].code
            ajString.tDeptName = this.tingDeptData[1].name
          } else if (ajString.fllb[0] === '3') {
            ajString.tDeptCode = this.tingDeptData[2].code
            ajString.tDeptName = this.tingDeptData[2].name
          }
          ajString.status = 5
          const b = JSON.parse(getUserInfo())
          ajString.userId = b.id
          ajString.userName = b.realName
          ajString.ajbh = this.ajInfo.AJBH
          ajString.fllb = ajString.fllb.join(',')
          this.rlLoading = true
          addAJJBXXSYHRL(ajString).then((response) => {
            if (response.success === true) {
              this.rlLoading = false
              this.$message({
                message: '认领成功',
                type: 'success'
              })
              this.$router.push({ path: '/caseManage/ajrl' })
            }
          }).catch(() => {
            this.rlLoading = false
          })
        }
      })
    },
    editFllb() {
      this.$refs.form.validate(valid => {
        if (valid) {
          var ajString = JSON.stringify(this.ajInfo)
          ajString = JSON.parse(ajString)
          const b = JSON.parse(getUserInfo())
          const para = {}
          para.bizType = 1
          para.action = '修改案件分类'
          para.bizId = this.ajInfo.id
          para.userId = b.id
          para.userName = b.realName
          para.ajbh = this.ajInfo.AJBH
          para.fllb = ajString.fllb.join(',')
          this.$update('ajeditfllb/' + this.ajInfo.AJBH, para).then((response) => {
            if (response.success === true) {
              this.$message({
                message: '修改成功', type: 'success'
              })
              this.$router.push({ path: '/caseManage/ajrl' })
            }
          })
        }
      })
    },
    toAjDetail(ajbh) {
      // this.$router.push({ path: '/caseManage/detailetl/' + ajbh })
      this.$router.push({
        path: '/caseFile/index', query: { ajbh: ajbh, isRl: '1' } // 展示申请督办等按钮
      })
    },
    toback() {
      this.$router.back(-1)
    }
  },
  mounted() {
    this.tcode()
    this.ajInfo.id = this.$route.params.id
    this.detail()
  }
}
</script>
<style scoped>
.text_center {
  text-align: center;
}

.ajInfoForm * {
  /* margin: 1px; */
}

.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  /* background-color: #99a9bf; */
}

.el-carousel__item:nth-child(2n + 1) {
  /* background-color: #d3dce6; */
}
</style>
