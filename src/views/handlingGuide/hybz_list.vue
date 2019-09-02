<template>
  <section>
    <div style="margin: 10px 20px">
      <!--工具条-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px">
        <el-form :inline="true" :model="filters">
          <el-form-item>
            <el-input v-model="filters.standardNumber" placeholder="标准编号"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="filters.standardName" placeholder="标准名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-select v-model="filters.professionalClassification" placeholder="专业分类">
              <el-option key="专业1" label="专业1" value="专业1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="filters.standardType" placeholder="标准种类">
              <el-option key="标准1" label="标准1" value="标准1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="filters.draftingUnit" placeholder="起草单位">
              <el-option key="单位1" label="单位1" value="单位1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-date-picker v-model="filters.releaseDate" type="date" placeholder="发布日期"></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-date-picker v-model="filters.implementationDate" type="date" placeholder="实施日期"></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-date-picker v-model="filters.abolitionDate" type="date" placeholder="废止日期"></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="getHybz">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="fileDown">模板下载</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="fileUpload">批量上传</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="handleAdd">添加</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <!--列表-->
      <template>
        <el-table :data="hybzs" highlight-current-row v-loading="listLoading" style="width: 100%">
          <el-table-column type="index">序号</el-table-column>
          <el-table-column prop="standardNumber" label="标准编号" sortable></el-table-column>
          <el-table-column prop="standardName" label="标准名称"></el-table-column>
          <el-table-column prop="professionalClassification" label="专业分类"></el-table-column>
          <el-table-column prop="insteadStandard" label="行业标准"></el-table-column>
          <el-table-column prop="draftingUnit" label="起草单位"></el-table-column>
          <el-table-column prop="releaseDate" label="发布日期" sortable></el-table-column>
          <el-table-column prop="implementationDate" label="实施日期" sortable></el-table-column>
          <el-table-column prop="abolitionDate" label="废止日期" sortable></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" icon="share" circle @click="handleDetail(scope.$index, scope.row)"></el-button>
              <el-button size="mini" type="primary" icon="edit" circle
                         @click="handleEdit(scope.$index, scope.row)"></el-button>
              <el-button size="mini" type="danger" icon="delete" circle
                         @click="handleDel(scope.$index, scope.row)"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <!--工具条-->
        <el-col :span="24" class="toolbar">
          <el-pagination v-if="total > 0" layout="prev, pager, next" @current-change="handleCurrentChange"
                         :page-size="20" :total="total" :current-page="page" style="float:right">
          </el-pagination>
        </el-col>
      </template>


      <template>
        <el-dialog title="标准名录查询" v-model="detailVisible" :close-on-click-modal="false">
          <table class="hybz_table" cellspacing="0" cellpadding="0">
            <tr>
              <td>标准编号</td>
              <td>SN/T0270-2012</td>
            </tr>
            <tr>
              <td>标准名称</td>
              <td>出口商品运输包装纸板桶检验规程</td>
            </tr>
            <tr>
              <td>计划编号</td>
              <td>2009B689r</td>
            </tr>
            <tr>
              <td>标准种类</td>
              <td>规程</td>
            </tr>
            <tr>
              <td>专业分类</td>
              <td>包装</td>
            </tr>
            <tr>
              <td>代替标准</td>
              <td>SN/T0270-1993</td>
            </tr>
            <tr>
              <td>与国际(国外先进)标准的关系</td>
              <td></td>
            </tr>
            <tr>
              <td>起草单位</td>
              <td>江苏检验检疫局</td>
            </tr>
            <tr>
              <td>参加起草单位</td>
              <td></td>
            </tr>
            <tr>
              <td>起草人</td>
              <td>徐炎</td>
            </tr>
            <tr>
              <td>发布日期</td>
              <td>2018-06-13</td>
            </tr>
            <tr>
              <td>实施日期</td>
              <td>2018-06-13</td>
            </tr>
            <tr>
              <td>复审年度</td>
              <td></td>
            </tr>
            <tr>
              <td>复审结论</td>
              <td></td>
            </tr>
            <tr>
              <td>后评估结果</td>
              <td>标准使用率：100.00%</td>
            </tr>
            <tr>
              <td>废止日期</td>
              <td></td>
            </tr>
            <tr>
              <td>主任委员</td>
              <td>王李兵</td>
            </tr>
            <tr>
              <td>副主任委员</td>
              <td>唐丽君</td>
            </tr>
            <tr>
              <td>委员</td>
              <td>曹丽芳、李凝韬、谭爱惜、陈超、李明曦、张积豪、刘鹏、蓝天</td>
            </tr>
          </table>
        </el-dialog>
      </template>

      <template>
        <el-dialog title="标准名录编辑" v-model="editFormVisible" :close-on-click-modal="false">
          <el-form :model="editForm" :rules="editFormRules" ref="editForm">
            <el-form-item label="标准编号">
              <el-input v-model="editForm.standardNumber" placeholder="标准编号"></el-input>
            </el-form-item>
            <el-form-item label="标准名称">
              <el-input v-model="editForm.standardName" placeholder="标准名称"></el-input>
            </el-form-item>
            <el-form-item label="计划编号">
              <el-input v-model="editForm.planNumber" placeholder="计划编号"></el-input>
            </el-form-item>
            <el-form-item label="标准种类">
              <el-input v-model="editForm.standardType" placeholder="标准种类"></el-input>
            </el-form-item>
            <el-form-item label="专业分类">
              <el-input v-model="editForm.professionalClassification" placeholder="专业分类"></el-input>
            </el-form-item>
            <el-form-item label="代替标准">
              <el-input v-model="editForm.insteadStandard" placeholder="代替标准"></el-input>
            </el-form-item>
            <el-form-item label="与国际(国外先进)标准的关系">
              <el-input v-model="editForm.internt" placeholder="与国际(国外先进)标准的关系"></el-input>
            </el-form-item>
            <el-form-item label="起草单位">
              <el-input v-model="editForm.draftingUnit" placeholder="起草单位"></el-input>
            </el-form-item>
            <el-form-item label="参加起草单位">
              <el-input v-model="editForm.joinDraftingUnit" placeholder="参加起草单位"></el-input>
            </el-form-item>
            <el-form-item label="起草人">
              <el-input v-model="editForm.draftingPeople" placeholder="起草人"></el-input>
            </el-form-item>
            <el-form-item label="发布日期">
              <el-input v-model="editForm.releaseDate" placeholder="发布日期"></el-input>
            </el-form-item>
            <el-form-item label="实施日期">
              <el-input v-model="editForm.implementationDate" placeholder="实施日期"></el-input>
            </el-form-item>
            <el-form-item label="复审年度">
              <el-input v-model="editForm.reviewYear" placeholder="复审年度"></el-input>
            </el-form-item>
            <el-form-item label="复审结论">
              <el-input v-model="editForm.reviewConclusion" placeholder="复审结论"></el-input>
            </el-form-item>
            <el-form-item label="后评估结果">
              <el-input v-model="editForm.evaluationResults" placeholder="后评估结果"></el-input>
            </el-form-item>
            <el-form-item label="废止日期">
              <el-input v-model="editForm.abolitionDate" placeholder="废止日期"></el-input>
            </el-form-item>
            <el-form-item label="主任委员">
              <el-input v-model="editForm.chairman" placeholder="主任委员"></el-input>
            </el-form-item>
            <el-form-item label="副主任委员">
              <el-input v-model="editForm.viceChairperson" placeholder="副主任委员"></el-input>
            </el-form-item>
            <el-form-item label="委员">
              <el-input v-model="editForm.committeeMember" placeholder="委员"></el-input>
            </el-form-item>
            <el-form-item label="标准内容">
              <el-input type="textarea" v-model="editForm.standardContent"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click.native="editFormVisible = false">取消</el-button>
            <el-button type="primary" @click.native="editSubmit" v-loading.fullscreen.lock="editLoading">提交</el-button>
          </div>
        </el-dialog>
      </template>
    </div>
  </section>
</template>

<script>
  // import { formatTime } from '@/utils/index'
  // import { getHybzListPage, removeHybz, editHybz, addHybz } from '@/api/handingGuide'
  export default {
    data() {
      return {
        /* 测试数据start */
        testData: [{
          'id': '6C96CB83-Ab47-DBFd-00c0-aefc8FeDd8dF',
          'standardNumber': 3927157,
          'standardName': '计要则以定土',
          'planNumber': 9079217,
          'standardType': '',
          'professionalClassification': '',
          'insteadStandard': '',
          'internt': '',
          'draftingUnit': '走知队较史越系百农委劳思人是商电文。严常究事山米期边意质王对必从各行当。变今院何家见三问解空几大元观包则。区使地京或何西二安严周里转我命须号。达日民斯为就或而完天清响界写给。',
          'joinDraftingUnit': '',
          'draftingPeople': '周洋',
          'releaseDate': '1977-11-18',
          'implementationDate': '2009-11-14',
          'reviewYear': '',
          'reviewConclusion': '',
          'evaluationResults': '',
          'abolitionDate': '1993-11-21',
          'chairman': '姜霞',
          'viceChairperson': '孔刚',
          'committeeMember': '邓强,黎明,吴平',
          'standardContent': ''
        }, {
          'id': 'dAfdBbeB-4c1d-33C2-4839-3c1B12042BDa',
          'standardNumber': 4951345,
          'standardName': '革江还有',
          'planNumber': 4383537,
          'standardType': '',
          'professionalClassification': '',
          'insteadStandard': '',
          'internt': '',
          'draftingUnit': '联听影火学即军光已满石算步压往划林。给道表话月时参如则己个决有性气北。产确热业都运等达声增济所比争还写们收。长基度值其热立速山它育义存。深保里国素情族层几成干证。面以八目角化解值先需其十经流门五被。',
          'joinDraftingUnit': '',
          'draftingPeople': '唐磊',
          'releaseDate': '2004-12-02',
          'implementationDate': '2002-03-21',
          'reviewYear': '',
          'reviewConclusion': '',
          'evaluationResults': '',
          'abolitionDate': '1988-01-27',
          'chairman': '张艳',
          'viceChairperson': '彭勇',
          'committeeMember': '丁丽,武丽,龙明',
          'standardContent': ''
        }, {
          'id': 'cE7872A8-Fb74-dDCc-c16b-a756CcD56bEf',
          'standardNumber': 8775411,
          'standardName': '民条火当',
          'planNumber': 8910662,
          'standardType': '',
          'professionalClassification': '',
          'insteadStandard': '',
          'internt': '',
          'draftingUnit': '科采广会理务等素其安例从易。太史条见交步二书九叫也战。员五今性第外济于积种象产音天。',
          'joinDraftingUnit': '',
          'draftingPeople': '罗静',
          'releaseDate': '1997-04-22',
          'implementationDate': '1982-05-14',
          'reviewYear': '',
          'reviewConclusion': '',
          'evaluationResults': '',
          'abolitionDate': '1999-01-01',
          'chairman': '胡涛',
          'viceChairperson': '金明',
          'committeeMember': '郝杰,史超,任秀兰',
          'standardContent': ''
        }, {
          'id': '8A1C2867-72Ad-eA28-a650-e5b158d360cf',
          'standardNumber': 7496683,
          'standardName': '织现最公京始',
          'planNumber': 2463620,
          'standardType': '',
          'professionalClassification': '',
          'insteadStandard': '',
          'internt': '',
          'draftingUnit': '边高己机农入派美及引面好传只直光。单少织便持九料酸近市向思住五构当。研向先江实种则连白十可间白快儿造算小。通整养下细最十物形可发准何革算广命。因团起八数中才象高工基区国每研。术感种且共率都完三上传积华去基你出。',
          'joinDraftingUnit': '',
          'draftingPeople': '朱平',
          'releaseDate': '2002-02-14',
          'implementationDate': '1970-12-21',
          'reviewYear': '',
          'reviewConclusion': '',
          'evaluationResults': '',
          'abolitionDate': '2012-10-03',
          'chairman': '蔡平',
          'viceChairperson': '郭娟',
          'committeeMember': '黎芳,夏艳,方芳',
          'standardContent': ''
        }, {
          'id': 'DdC8EeCF-Def3-c3ce-3DC3-72Ec86A2F972',
          'standardNumber': 2425022,
          'standardName': '属实以结',
          'planNumber': 1130595,
          'standardType': '',
          'professionalClassification': '',
          'insteadStandard': '',
          'internt': '',
          'draftingUnit': '劳农到相状因且色新习传小根。得系效般相接打真东前道全道加化打众。八强使因教事列过角使之观个查象。气受产到须少色片求们打米很被。形问我报证只同结干则江准压而。高重点收领代历化造候领素间至。',
          'joinDraftingUnit': '',
          'draftingPeople': '杜伟',
          'releaseDate': '2006-11-18',
          'implementationDate': '2011-09-03',
          'reviewYear': '',
          'reviewConclusion': '',
          'evaluationResults': '',
          'abolitionDate': '2001-05-01',
          'chairman': '尹超',
          'viceChairperson': '苏平',
          'committeeMember': '常芳,沈敏,侯平',
          'standardContent': ''
        }, {
          'id': 'E05eBC6a-ca87-DE28-E98e-FbeDB8Bdf4F5',
          'standardNumber': 8339097,
          'standardName': '身会准色须',
          'planNumber': 2176911,
          'standardType': '',
          'professionalClassification': '',
          'insteadStandard': '',
          'internt': '',
          'draftingUnit': '办面必走保量通低从斗关别具律。支般六着支气族问证使二或。解马合流格不走平节解发保同西增。带观政商于深十本思安革拉学亲书。史己毛性于精计人快专别究群。响八正就区口接命道水群圆记备办构标温。',
          'joinDraftingUnit': '',
          'draftingPeople': '沈芳',
          'releaseDate': '2015-05-24',
          'implementationDate': '1975-11-11',
          'reviewYear': '',
          'reviewConclusion': '',
          'evaluationResults': '',
          'abolitionDate': '2012-09-05',
          'chairman': '彭敏',
          'viceChairperson': '尹伟',
          'committeeMember': '于娜,金强,贺涛',
          'standardContent': ''
        }, {
          'id': 'ceAdfC08-F813-EFAF-5B31-Cf910BcC5F92',
          'standardNumber': 5332102,
          'standardName': '想可形也极此情',
          'planNumber': 4380691,
          'standardType': '',
          'professionalClassification': '',
          'insteadStandard': '',
          'internt': '',
          'draftingUnit': '红斯一素存白层才布做天则生委。号我众度回证西商群光能事开列接油明。打保细道么选术验入京受儿各有不用美。',
          'joinDraftingUnit': '',
          'draftingPeople': '谭娟',
          'releaseDate': '1999-09-05',
          'implementationDate': '1971-04-03',
          'reviewYear': '',
          'reviewConclusion': '',
          'evaluationResults': '',
          'abolitionDate': '2009-01-14',
          'chairman': '苏超',
          'viceChairperson': '常伟',
          'committeeMember': '何秀英,戴刚,史娟',
          'standardContent': ''
        }, {
          'id': '4EB76DB1-8782-dcac-41D8-f87A460E6d2F',
          'standardNumber': 2328904,
          'standardName': '住专议',
          'planNumber': 3417890,
          'standardType': '',
          'professionalClassification': '',
          'insteadStandard': '',
          'internt': '',
          'draftingUnit': '属安精内装设程江去具如按热九于思。委目走种据克至作专率常族求青车。速情验作器教心按花意在历史么给角教。准格东音需价列消相定所证容己矿。青从如取大集这真看期圆程发思至争。长拉传放深却该更调以主代数存就电计商。',
          'joinDraftingUnit': '',
          'draftingPeople': '丁伟',
          'releaseDate': '1978-07-29',
          'implementationDate': '1994-02-09',
          'reviewYear': '',
          'reviewConclusion': '',
          'evaluationResults': '',
          'abolitionDate': '1970-05-31',
          'chairman': '贺敏',
          'viceChairperson': '谭涛',
          'committeeMember': '阎勇,郑霞,孟秀英',
          'standardContent': ''
        }, {
          'id': 'B3EF6d54-e671-2bBB-e72D-f853eCf2133B',
          'standardNumber': 1164443,
          'standardName': '采需单术前金',
          'planNumber': 2896796,
          'standardType': '',
          'professionalClassification': '',
          'insteadStandard': '',
          'internt': '',
          'draftingUnit': '产者色西更调习风解来属队月是身。维少集积带号断红还难住过情。革规厂族白斗元但保理力革战存计音格。因支究化在向工离和也比他。',
          'joinDraftingUnit': '',
          'draftingPeople': '吴静',
          'releaseDate': '1973-06-17',
          'implementationDate': '1993-04-12',
          'reviewYear': '',
          'reviewConclusion': '',
          'evaluationResults': '',
          'abolitionDate': '1991-07-03',
          'chairman': '邹洋',
          'viceChairperson': '任秀兰',
          'committeeMember': '乔艳,萧刚,史涛',
          'standardContent': ''
        }, {
          'id': '5A59c5bC-C1ff-88bF-52cd-171ebeFECfdA',
          'standardNumber': 3323832,
          'standardName': '音别己酸于象基',
          'planNumber': 9694860,
          'standardType': '',
          'professionalClassification': '',
          'insteadStandard': '',
          'internt': '',
          'draftingUnit': '即料京现度基公这状干使则划取还身识。局求半山色制目精周九七经西各格劳建没。名入位公由素局世期传类半基。北及反道风思外表去下果且国音。次京日东统地以须国律这生除。果等候何至历就今第历等证米效矿般十记。',
          'joinDraftingUnit': '',
          'draftingPeople': '侯军',
          'releaseDate': '1972-01-02',
          'implementationDate': '1991-01-04',
          'reviewYear': '',
          'reviewConclusion': '',
          'evaluationResults': '',
          'abolitionDate': '1993-10-23',
          'chairman': '江霞',
          'viceChairperson': '刘明',
          'committeeMember': '邱秀英,杨娜,熊秀兰',
          'standardContent': ''
        }, {
          'id': 'fb1FbC5c-6Ac8-34af-D549-3DB4BAC183Ef',
          'standardNumber': 2713290,
          'standardName': '北业治要主约风',
          'planNumber': 1897645,
          'standardType': '',
          'professionalClassification': '',
          'insteadStandard': '',
          'internt': '',
          'draftingUnit': '和山也究证他放四起指日此和满者。水土意命石天验化民太进外但分林包。价样今改去此易少听们料列设却但不除。关全心真较影只管八布段历我战路即也调。为会低速传天表所动速反青更段。过支通很争始很九儿此万指文受音细。',
          'joinDraftingUnit': '',
          'draftingPeople': '李静',
          'releaseDate': '2014-05-17',
          'implementationDate': '2017-01-31',
          'reviewYear': '',
          'reviewConclusion': '',
          'evaluationResults': '',
          'abolitionDate': '1976-01-21',
          'chairman': '许秀英',
          'viceChairperson': '宋静',
          'committeeMember': '万超,萧勇,孙刚',
          'standardContent': ''
        }, {
          'id': 'd29B4A81-7bC5-4922-89B1-1d7ec69A8B17',
          'standardNumber': 8050541,
          'standardName': '近才进保三',
          'planNumber': 1773002,
          'standardType': '',
          'professionalClassification': '',
          'insteadStandard': '',
          'internt': '',
          'draftingUnit': '可美日约林第效王取被阶种维成理文料作。转手别没每除快任强都容题算论路再。委论很数火作报为意近取反比放低些东。',
          'joinDraftingUnit': '',
          'draftingPeople': '邵涛',
          'releaseDate': '2013-02-20',
          'implementationDate': '2006-10-09',
          'reviewYear': '',
          'reviewConclusion': '',
          'evaluationResults': '',
          'abolitionDate': '2001-09-15',
          'chairman': '夏静',
          'viceChairperson': '崔霞',
          'committeeMember': '郭磊,罗军,金军',
          'standardContent': ''
        }, {
          'id': 'cd2DEcbB-CAfd-8d4c-bEAb-8CBa4Ab22cDA',
          'standardNumber': 6863681,
          'standardName': '火认面',
          'planNumber': 2570646,
          'standardType': '',
          'professionalClassification': '',
          'insteadStandard': '',
          'internt': '',
          'draftingUnit': '意志将走织律论清学本门造响都号。给体直且该根江文地史大九半员易此。米东用县成子理头间金话么基率心飞清段。须路动展满家色起分周标元准法真。资能指斯法变火干明革京几社风。色军圆集联斯速资并展色处。',
          'joinDraftingUnit': '',
          'draftingPeople': '李军',
          'releaseDate': '2004-07-28',
          'implementationDate': '1992-01-03',
          'reviewYear': '',
          'reviewConclusion': '',
          'evaluationResults': '',
          'abolitionDate': '1985-09-14',
          'chairman': '蒋秀兰',
          'viceChairperson': '余平',
          'committeeMember': '汤秀兰,毛桂英,谢艳',
          'standardContent': ''
        }, {
          'id': 'A1A493c3-d7cf-423e-85b3-4cdDd1E3becd',
          'standardNumber': 5776884,
          'standardName': '三政族维',
          'planNumber': 8114216,
          'standardType': '',
          'professionalClassification': '',
          'insteadStandard': '',
          'internt': '',
          'draftingUnit': '广律家气总红自看置证备与程中律。务种离具选进两示划维快民经线何少。老克率步如西律离市建对没这般统。事平身包八部收确每那总为完。整清治面期业书我心消林越与论则人权。',
          'joinDraftingUnit': '',
          'draftingPeople': '沈芳',
          'releaseDate': '2000-06-06',
          'implementationDate': '2012-12-06',
          'reviewYear': '',
          'reviewConclusion': '',
          'evaluationResults': '',
          'abolitionDate': '2001-09-29',
          'chairman': '董静',
          'viceChairperson': '锺明',
          'committeeMember': '邓敏,贾丽,刘霞',
          'standardContent': ''
        }, {
          'id': '8367F897-Fac5-E413-4869-9ef1ffbFF4ad',
          'standardNumber': 5210260,
          'standardName': '传图根满指走活',
          'planNumber': 8985571,
          'standardType': '',
          'professionalClassification': '',
          'insteadStandard': '',
          'internt': '',
          'draftingUnit': '广能便温外般六式第群离工政。立写号参都些研厂节眼五他构极。候参海热层经法号置又出一也花深走建。才八素酸基书资自头响起导品才世间。引全公易般老下史验规现复们权状展历接。还般发与织离五战用进听做收众设效。',
          'joinDraftingUnit': '',
          'draftingPeople': '夏涛',
          'releaseDate': '1988-11-19',
          'implementationDate': '1985-01-11',
          'reviewYear': '',
          'reviewConclusion': '',
          'evaluationResults': '',
          'abolitionDate': '1998-10-17',
          'chairman': '毛娜',
          'viceChairperson': '冯洋',
          'committeeMember': '毛秀英,姚霞,梁勇',
          'standardContent': ''
        }, {
          'id': '1Ea05D89-2d4f-A1c5-0EDD-3795b31A1E7b',
          'standardNumber': 3541993,
          'standardName': '应金影带二什走',
          'planNumber': 3188829,
          'standardType': '',
          'professionalClassification': '',
          'insteadStandard': '',
          'internt': '',
          'draftingUnit': '重率阶器称米万西难各公算书能争身。代级低头开员器又第习基育出提需。增布经算定装料没素中为面已科数十。水她取众属确般意着正进把之。有十想向离着联明色安断转须业采干。京别下术亲龙须面决工直十争段。因究话华类积节型命养比周速情响利号点。',
          'joinDraftingUnit': '',
          'draftingPeople': '田磊',
          'releaseDate': '1998-12-20',
          'implementationDate': '2002-03-31',
          'reviewYear': '',
          'reviewConclusion': '',
          'evaluationResults': '',
          'abolitionDate': '1976-11-03',
          'chairman': '苏军',
          'viceChairperson': '苏静',
          'committeeMember': '宋刚,于霞,韩桂英',
          'standardContent': ''
        }, {
          'id': 'bdBBBf71-EDBf-DAc1-b3CF-ABAC68ce1ddd',
          'standardNumber': 4776499,
          'standardName': '动国治商',
          'planNumber': 7009791,
          'standardType': '',
          'professionalClassification': '',
          'insteadStandard': '',
          'internt': '',
          'draftingUnit': '化满商五划表明引他维光利传展。太中任你但律导转至积已接生亲与切。如些们斯育基界人八料书资还东出太区。据调土中量分查它易规清无物可可月而。眼维图号科别精形长导们角里主。么结经最非打引义处无和专家风往。温气如海平物石论军造问经等日给。',
          'joinDraftingUnit': '',
          'draftingPeople': '侯艳',
          'releaseDate': '2007-11-24',
          'implementationDate': '1975-04-12',
          'reviewYear': '',
          'reviewConclusion': '',
          'evaluationResults': '',
          'abolitionDate': '2009-01-30',
          'chairman': '傅杰',
          'viceChairperson': '周涛',
          'committeeMember': '夏军,锺平,钱秀兰',
          'standardContent': ''
        }, {
          'id': 'D9BcbBB8-84Af-68A7-CB5D-83c3cD874AE7',
          'standardNumber': 8709171,
          'standardName': '性算书五记干',
          'planNumber': 9969918,
          'standardType': '',
          'professionalClassification': '',
          'insteadStandard': '',
          'internt': '',
          'draftingUnit': '劳织合实力做上通解合步果步克。议低外地风达并决速和备文王话群。导干结被效住和说铁九采北众林。务劳内有住五共装话列主都制进组法统。何千构建维权经开展下月品。',
          'joinDraftingUnit': '',
          'draftingPeople': '袁杰',
          'releaseDate': '1998-08-02',
          'implementationDate': '1990-03-23',
          'reviewYear': '',
          'reviewConclusion': '',
          'evaluationResults': '',
          'abolitionDate': '1981-11-07',
          'chairman': '史艳',
          'viceChairperson': '石明',
          'committeeMember': '王明,邹霞,陈涛',
          'standardContent': ''
        }, {
          'id': 'dCCf4Cd7-7f5a-8deA-AdDB-2b635cAfc9A7',
          'standardNumber': 4642938,
          'standardName': '断场之和物',
          'planNumber': 8012350,
          'standardType': '',
          'professionalClassification': '',
          'insteadStandard': '',
          'internt': '',
          'draftingUnit': '两七式选元第工发步该群场史明主听。新空拉务很决走计时步务思体议。示来品接增加员接装圆保结下特型机。',
          'joinDraftingUnit': '',
          'draftingPeople': '金超',
          'releaseDate': '1971-08-29',
          'implementationDate': '1998-09-28',
          'reviewYear': '',
          'reviewConclusion': '',
          'evaluationResults': '',
          'abolitionDate': '2000-03-15',
          'chairman': '蔡敏',
          'viceChairperson': '沈芳',
          'committeeMember': '何刚,崔芳,常勇',
          'standardContent': ''
        }, {
          'id': 'fEDBBbaC-bb26-946a-beBd-58C2c5fA5bcD',
          'standardNumber': 5819668,
          'standardName': '领千参现两',
          'planNumber': 3735219,
          'standardType': '',
          'professionalClassification': '',
          'insteadStandard': '',
          'internt': '',
          'draftingUnit': '结题图期期效命几教发回素。九用到白快列道水此电目老阶果解。事教保养从将多之见要县化华还同备少如。明它火着资手住传照公温参高打。规许养任应还走收育正代过做性学断动。口织今多又质方图油第原导不复办局解表。',
          'joinDraftingUnit': '',
          'draftingPeople': '赵霞',
          'releaseDate': '1995-11-05',
          'implementationDate': '2009-06-15',
          'reviewYear': '',
          'reviewConclusion': '',
          'evaluationResults': '',
          'abolitionDate': '2001-04-11',
          'chairman': '郭强',
          'viceChairperson': '程秀兰',
          'committeeMember': '孙超,锺敏,熊洋',
          'standardContent': ''
        }],
        /* 测试数据end */
        filters: {
          standardNumber: '',
          standardName: '',
          professionalClassification: '',
          standardType: '',
          draftingUnit: '',
          releaseDate: '',
          implementationDate: '',
          abolitionDate: ''
        },
        total: 0,
        page: 1,
        listLoading: false,
        sels: [],
        hybzs: [],

        detailVisible: false,
        editFormVisible: false,
        editLoading: false,
        editFormRules: {},
        editForm: {
          id: 0,
          standardNumber: '',
          standardName: '',
          planNumber: '',
          standardType: '',
          professionalClassification: '',
          insteadStandard: '',
          internt: '',
          draftingUnit: '',
          joinDraftingUnit: '',
          draftingPeople: '',
          releaseDate: '',
          implementationDate: '',
          reviewYear: '',
          reviewConclusion: '',
          evaluationResults: '',
          abolitionDate: '',
          chairman: '',
          viceChairperson: '',
          committeeMember: '',
          standardContent: ''
        },
        addFormVisible: false, // 新增界面是否显示
        addLoading: false,
        addFormRules: {
          standardNumber: [
            { required: true, message: '请输入', trigger: 'blur' }
          ]
        },
        // 新增界面数据
        addForm: {
          standardNumber: '',
          standardName: '',
          planNumber: '',
          standardType: '',
          professionalClassification: '',
          insteadStandard: '',
          internt: '',
          draftingUnit: '',
          joinDraftingUnit: '',
          draftingPeople: '',
          releaseDate: '',
          implementationDate: '',
          reviewYear: '',
          reviewConclusion: '',
          evaluationResults: '',
          abolitionDate: '',
          chairman: '',
          viceChairperson: '',
          committeeMember: '',
          standardContent: ''
        }
      }
    },
    methods: {
      handleCurrentChange(val) {
        this.page = val
        this.getHybz()
      },
      // 获取用户列表
      getHybz() {
        // let para = {
        //   pageNum: this.page,
        //   standardNumber: this.filters.standardNumber,
        //   standardName: this.filters.standardName,
        //   professionalClassification: this.filters.professionalClassification,
        //   standardType: this.filters.standardType,
        //   draftingUnit: this.filters.draftingUnit,
        //   releaseDate: this.filters.releaseDate,
        //   implementationDate: this.filters.implementationDate,
        //   abolitionDate: this.filters.abolitionDate
        // }
        this.listLoading = true

        // 测试数据start
        this.hybzs = this.testData
        this.total = 100
        this.listLoading = false
        // 测试数据end

        // getHybzListPage(para).then((response) => {
        //   this.total = res.data.total
        //   this.hybzs = res.data.hybzs
        //   this.listLoading = false
        // })
      },
      // 删除
      handleDel(index, row) {
        this.$confirm('确认删除该记录吗?', '提示', {
          type: 'warning'
        }).then(() => {
          // this.listLoading = true
          // let para = {id: row.id}
          // removeHybz(para).then((res) => {
          //   this.listLoading = false
          //   this.$message({
          //     message: '删除成功',
          //     type: 'success'
          //   })
          //   this.getHybz()
          // })
        }).catch(() => {

        })
      },
      handleDetail(index, row) {
        this.detailVisible = true
        this.editForm = Object.assign({}, row)
      },
      handleEdit(index, row) {
        this.editFormVisible = true
        this.editForm = Object.assign({}, row)
      },
      // 显示新增界面
      handleAdd() {
        this.addFormVisible = true
      },
      openFullScreen() {
        this.fullscreenLoading = true
        setTimeout(() => {
          this.fullscreenLoading = false
        }, 2000)
      },
      // 编辑
      editSubmit() {
        this.$refs.editForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              // this.editLoading = true
              // let para = Object.assign({}, this.editForm)
              // para.birth = (!para.birth || para.birth == '') ? '' : formatTime(new Date(para.birth), 'yyyy-MM-dd')
              // editHybz(para).then((res) => {
              //   this.editLoading = false
              //   this.$message({
              //     message: '提交成功',
              //     type: 'success'
              //   })
              //   this.$refs['editForm'].resetFields()
              //   this.editFormVisible = false
              //   this.getHybz()
              // })
            })
          }
        })
      },
      // 新增
      addSubmit() {
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              // this.addLoading = true
              // const para = Object.assign({}, this.addForm)
              // para.birth = (!para.birth || para.birth === '') ? '' : formatTime(new Date(para.birth), 'yyyy-MM-dd')
              // addHybz(para).then((res) => {
              //   this.addLoading = false
              //   this.$message({
              //     message: '提交成功',
              //     type: 'success'
              //   })
              //   this.$refs['addForm'].resetFields()
              //   this.addFormVisible = false
              //   this.getHybz()
              // })
            })
          }
        })
      },
      fileDown() {
        this.$message('执行下载')
      },
      fileUpload() {
        this.$message('执行上传')
      }
    },
    mounted() {
      this.getHybz()
    }
  }
</script>

<style>
</style>
