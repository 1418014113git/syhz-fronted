<template>
  <section>
    <table width="100%" class="assessScoresTable">
      <thead>
        <th width="90%" colspan="3">考核标准</th>
        <th width="10%">考核得分</th>
      </thead>
      <tbody>
        <tr>
          <td width="11%" rowspan="5" class="center">案件质量</td>
          <td width="10%" class="center">事实清楚</td>
          <td width="69%">
            <p>1.违纪事实发生的时间、地点清楚；</p>
            <p>2.违纪事实的情节、手段清楚；</p>
            <p>3.违纪事实的原因、结果清楚；</p>
            <p>4.案件相关人员责任界定清楚；</p>
            <p>5.案件事实表述清晰，逻辑严密；</p>
            <p>6.经济案件，违纪金额要准确，资金来源、去向清楚；</p>
            <p>7.举报的问题线索及在办案中发现的其它违纪问题要调查清楚，未调查的说明原因。</p>
            <p>上述要件，有一项不符合的扣2分。</p>
          </td>
          <td width="10%"><input name="rate" type="number" @change="changeHandler" style="height:240px"/></td>
        </tr>
        <tr>
          <td class="center">证据确凿</td>
          <td>
            <p>1.证据来源合法，取证规范</p>
            <p>（1）谈话取证必须在谈话室进行（特殊情况除外），谈话举止文明，无变相体罚现象，连续谈话时间不得超过12小时、不得超过夜间24时。有一项不符合扣2分；</p>
            <p>（2）调查取证必须二人以上，单人取证的，扣2分；</p>
            <p>（3）证言材料要一人一证，一事一证，不能多人一证。存在多人一证的，扣2分；</p>
            <p>（4）谈话笔录中严禁骗证、诱证。发现有骗证、诱证的扣 2 分；</p>
            <p>（5）证明材料必须写清证人的基本情况。包括：姓名、性别、出生年月、学历、籍贯、入党年月、参加工作年月、工作履历、是否人大、政协代表、工作单位、现任职务的时间，与被证明人的关系等，有一项不符合扣1分；</p>
            <p>（6）证明材料是询问或谈话笔录的：应注明谈话时间、地点、谈话人、记录人。询问或谈话时应首先亮明身份，并交待有关政策；要告知被审查人的权利和义务。有一项不符合扣1分；</p>
            <p>（7）所有证明材料应有证人及被谈话人的签字，并盖章或押印。有一项不符合扣 1 分；</p>
            <p>（8）复印件或复制件：必须注明材料的出处，并由原件保管单位加盖公章，注明复制人和复制时间；如果案件中复制件较多，可由原件保管单位出一个证明即可，但必须说明份数、页数，并加盖骑缝章。取证人也要签字并按手印。 有一项不符合扣1分；</p>
            <p>（9）证明材料必须用钢笔或毛笔书写。用圆珠笔、铅笔、彩笔、红墨水等易溶墨水书写的材料要复印。如果出证人死亡或者其它原因不能再取的，要进行复印，附在原件的后面。举报件若是用圆珠笔、铅笔和彩笔书写的也必须复印。有一项不符合的扣1分；</p>
            <p>（10）证据材料涂改处要盖章或签字，不符合的扣1分。</p>
            <p>2.证据确实充分</p>
            <p>（1）所取得的并能够证明违纪事实的每一个证据都必须真实、客观，主要事实要有关键证据的支持。主要违纪行为认定证据不足的，扣5分；</p>
            <p>（2）证据必须确凿充分，认定的每一个事实都要有相应的一定量的证据予以证明，在没有物证、书证的情况下，必须有两个以上证据才能认定；只有被审查人交代，没有其他证据或证据不充分、不确凿的，不能认定；证据充分、确凿，即使被审查人本人拒不承认，也可以认定。存在证据不足的，扣 2 分。</p>
            <p>3.证据之间能够形成链条，不存在矛盾</p>
            <p>（1）证据必须与认定的违纪事实之间有客观的联系，不能牵强附会，并且所有证据要构成一个完整的证据链。有一项不符合的，扣2分；</p>
            <p>（2）证据之间、证据与认定事实之间不能存在矛盾。发现证据存在疑点和有矛盾的，扣2分。</p>
          </td>
          <td><input name="rate" type="number" @change="changeHandler" style="height:720px"/></td>
        </tr>
        <tr>
          <td class="center">定性准确</td>
          <td>
            <p>1.错误事实见面材料内容清楚，错误的性质及所负的责任明确，落款为兰考县纪委调查组，注明时间。如果被审查人对错误事实见面材料有不同意见的，调查组还应根据证明材料对调查人提出的不同意见写出说明。有一项不符合扣 2 分；</p>
            <p>2.违纪事实发生的时间、地点、原因、结果、人员责任界定、违纪金额等违纪构成要件齐全。有一项不符合扣 2 分；</p>
            <p>3.调查报告中，党纪条规引用准确、完整，表述正确。有一项不符合扣 2 分。</p>
          </td>
          <td><input name="rate" type="number" @change="changeHandler" style="height:120px"/></td>
        </tr>
        <tr>
          <td class="center">处理恰当</td>
          <td>
            <p>1.建议处分情况基本恰当。建议处分幅度明显低于标准的，扣2分；</p>
            <p>2.法定情节、酌定情节运用适当。违纪人的认错态度，从轻、减轻、从重、加重处分的情节，违纪行为获得的款物退赔或收缴情况，非法利益应予取消或纠正情况要在调查报告中叙述清楚。未叙述的或叙述不清楚的，扣1分。</p>
          </td>
          <td><input name="rate" type="number" @change="changeHandler" style="height:100px"/></td>
        </tr>
        <tr>
          <td class="center">手续完备，程序合法</td>
          <td>
            <p>1.严格遵守案件审查期限规定</p>
            <p>（1）根据上级纪委案件审查要快进快出、快查快结的要求，各承办室在收到案件线索后，初步核实应在一个月内办结。确因特殊情况不能在规定时限内办结的，应在办结时限之前填写《延长办理期限呈批表》报主管常委（副局长）、分管副书记批准后可适当延长，延长时限不能超过15天，《延长办理期限呈批表》送案管室备案。有一项不符合扣2分；</p>
            <p>（2）立案调查时限为2个月，重大或复杂的问题不能办结的，由调查组填写《延长办理期限呈批表》报主管常委（副局长）、分管副书记审核批准后可适当延长，延长时限不能超过1个月，《延长办理期限呈批表》送案管室备案。有一项不符合扣2分；</p>
            <p>（3）领导批示明确办理时限的，应按批示时限办结，逾期未结的扣2分。</p>
            <p>2.程序规范，手续完备</p>
            <p>（1）所查案件应有线索来源和主要领导的签批。案件线索为信访室或案管室交办的，应有举报原件；案件线索为电话或网络举报的，应有相关书面记录；其他执法执纪机关移送的线索，应有公函等书面材料。有一项不符合，扣1分；</p>
            <p>（2）承办科室接到领导批示线索当天，应到案管室领取《办案日志》，并根据案件进展情况进行记录。案件移送审理后，应在3天内将《办案日志》及备份卷送案管室。不按时领取《办案日志》、不按规定记录的、不及时报送的，有一项不符合扣1分；</p>
            <p>（3）初核时应当规范填写《初步核实呈批表》，线索来源、被反映人基本情况、反映的主要问题、承办室意见、领导审批意见、填表人等事项要填写完整，并报案管室备案。有一项不符合，扣1分；</p>
            <p>（4）经县纪委常委会议同意，对党员和行政监察对象的违纪问题立案的。承办科室要规范填写《立案呈批表》，立案对象基本情况、错误性质、认定的主要违纪问题、立案依据、领导审批意见、填表人等事项要填写完整，并报案管室备案。有一项不符合，扣1分；</p>
            <p>（5）经县纪委常委会同意对党员和行政监察对象的违纪问题立案的，承办科室要在常委会结束后2个工作日内，到案管室填写立案决定书编号，并负责送达被审查人单位。立案决定书必须有日期、单位印章、被审查人单位签收日期及印章。有一项不符合扣1分；</p>
            <p>（6）案件审查中需采取暂予扣留、暂予封存措施的，经主管常委（副局长）、分管副书记同意后，应填写暂予扣留、封存涉案款物登记表。原款物持有人、保管人、涉案款物、暂扣封存理由等事项要填写完整，并报案管室备案。有一项不符合，扣1分；</p>
            <p>（7）案件审查中需要查核被审查对象或涉嫌单位及涉嫌人员在银行或其他金融机构的存款时，应填写《查询存款通知书》，经主管常委（副局长）审核报监察局长签字批准后方可实施。违反程序办理的扣3分。</p>
          </td>
          <td><input name="rate" type="number" @change="changeHandler" style="height:660px"/></td>
        </tr>
        <tr>
          <td class="center">表述准确，文书规范</td>
          <td colspan="2">
            <p>（1）初核报告、调查报告要按照颁发文书规定的格式撰写，每一问题调查情况注明证据材料在多少页至多少页，调查组成员必须亲笔签名。有一项不符合，扣1分；</p>
            <p>（2）被审查人身份证明：立案之前应调取被审查人身份证明、入党证明、任职证明材料，或党表材料和简历材料，经组织部门、人事部门或相关主管机关盖章批注，身份证明必须出自本人档案。有一项不符合，扣1分。</p>
          </td>
          <td><input name="rate" type="number" @change="changeHandler" style="height:120px"/></td>
        </tr>
        <tr>
          <td rowspan="2" class="center">案卷装订，归档规范</td>
          <td>检查卷应具备下列材料及排列顺序</td>
          <td>
            <p>（1）办案依据（包括举报信件、领导批示、案件初步核实呈批表）；</p>
            <p>（2）案件初步核实报告 ；</p>
            <p>（3）立案呈批表及立案决定书（附简要案情及立案依据）；</p>
            <p>（4）调查方案 ；</p>
            <p>（5）错误事实见面材料，被审查人对“见面材料”的意见，调查组对其“意见”的说明；</p>
            <p>（6）个人检查 ；</p>
            <p>（7）调查报告；</p>
            <p>（8）调查报告的主要内容与被审查人所在单位党组织通报并征求意见的情况材料；</p>
            <p>（9）证据材料（按问题的分类排列）；</p>
            <p>（10）暂予扣留、没收追缴财物清单；</p>
            <p>（11）违纪人单位或有关组织人事部门出据的被审查人的基本情况；</p>
            <p>（12）其他材料及与调查报告认定的错误事实无关联的材料（副卷）；</p>
            <p>材料不齐全的、排列顺序错误的，扣1分。</p>
          </td>
          <td><input name="rate" type="number" @change="changeHandler" style="height:390px"/></td>
        </tr>
        <tr>
          <td class="center">装订</td>
          <td>
            <p>（1）编号：卷内材料均以页为单位在右上角（反面在左上角）用铅笔编阿拉伯字母编号；</p>
            <p>（2）卷内目录：卷内目录应与卷内材料相符，尽可能填全，不能太笼统，对文件标题和作者不要随意更改和简化；</p>
            <p>（3）填写卷内备考表: 按照谁办案谁立卷的原则，立卷人应认真在卷内备考表中填写需要说明的情况，并在卷内备考上亲笔签名、注明立卷日期。检查人应检查后亲笔签名；</p>
            <p>（4）卷皮封面字体一律打印，机构名称一律为“案件审理类”，字体为黑体二号。封面内容摘要限50字内，二号楷体加粗。保管期限要求楷体三号字加黑，需作出处理的，保管期限为永久，不需要作出处理的，保管期限为长期；</p>
            <p>（5）装订要整齐。如材料纸大小不一，应以右边、下边齐；</p>
            <p>（6）用黑鞋带或白线绳装订。装订线下端、上端各留七公分；左边以装订线为准；</p>
            <p>（7）每卷最多不能超过200页，超过200页应另行装卷。如果分卷，同一问题不要分开；</p>
            <p>（8）有曲别针、订书钉、直别针等金属物应取出，不能装在卷内；</p>
            <p>（9）应对装订线外有字迹的材料或破损的材料及照片、小纸条要进行加边和托裱，对过大的材料要折叠；大于或小于卷面的材料，要进行修补、裱贴和折叠；</p>
            <p>（10）排列证明材料：将挑选后的证明材料按问题分类，按认定错误事实的顺序排列。作为处理依据的主要问题排在前面。每个问题的重要证据排在前面。</p>
            <p>装订不符合要求，一项扣1分。</p>
          </td>
          <td><input name="rate" type="number" @change="changeHandler" style="height:450px"/></td>
        </tr>
        <tr>
          <td class="center">加分因素</td>
          <td colspan="2">
            <p>1.案件实行“一案双书”的，每件加 3 分；</p>
            <p>2.移送审理或协审的经济案件无需补证的，每件加 3 分，其他案件每件加 1 分；</p>
            <p>3.案件审查结束后撰写剖析报告的，每件加3分；</p>
            <p>4.每立案处理一人，基础分加1分。</p>
          </td>
          <td><input name="rate" type="number" @change="changeHandler" style="height:120px"/></td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="3" class="right">总计：</td>
          <td><span id="total">{{total}}</span></td>
        </tr>
        <tr>
          <td colspan="3" class="right">考核结果：</td>
          <td><span id="level">{{level}}</span></td>
        </tr>
      </tfoot>
    </table>
    <div style="margin-top: 10px; text-align: center;">
      <p>优秀（ 90 分以上）、合格（ 75-90分）、基本合格（ 60-74 分）、不合格（ 60 分以下）</p>
      <el-button @click="assessSubmit()" :loading="assessLoading" type="primary">提交考核</el-button>
      <el-button @click="close()" type="primary">关闭</el-button>
    </div>
  </section>
</template>

<script>
  export default {
    name: 'assessScores',
    data() {
      return {
        rate: [],
        total: 0,
        level: '',
        assessLoading: false
      }
    },
    methods: {
      getLevel() {
        if (this.total > 90) {
          this.level = '优秀'
        } else if (this.total >= 75 && this.total <= 90) {
          this.level = '合格'
        } else if (this.total >= 60 && this.total <= 74) {
          this.level = '基本合格'
        } else if (this.total < 60) {
          this.level = '不合格'
        }
      },
      changeHandler() {
        this.rate = []
        let number = 0
        const elements = document.getElementsByName('rate')
        for (let i = 0; i < elements.length; i++) {
          if (elements[i].value !== '') {
            this.rate.push(elements[i].value)
            number += parseInt(elements[i].value)
          }
        }
        this.total = number
        this.getLevel()
      },
      assessSubmit() {
        this.assessLoading = true
        if (this.rate.length !== 9) {
          this.$message({
            message: '请完善考核分数后，再提交！',
            type: 'warning'
          })
          this.assessLoading = false
          return
        }
        const _this = this
        setTimeout(function() {
          _this.$message({
            message: '考核打分提交成功！',
            type: 'success'
          })
          _this.assessLoading = false
          _this.$emit('setAssessScores', _this.rate)
        }, 1000)
      },
      init(rate) {
        this.rate = [10, 10, 10, 10, 10, 10, 10, 10, 10]
        if (rate) {
          this.rate = rate
        }
        const elements = document.getElementsByName('rate')
        let number = 0
        for (let i = 0; i < elements.length; i++) {
          elements[i].value = this.rate[i]
          number += parseInt(elements[i].value)
        }
        this.total = number
        this.getLevel()
      },
      close() {
        this.$emit('closeDialog')
      }
    },
    mounted() {
      const elements = document.getElementsByName('rate')
      let number = 0
      for (let i = 0; i < elements.length; i++) {
        elements[i].value = 10
        number += 10
        this.rate.push(10)
      }
      this.total = number
      this.getLevel()
    }
  }
</script>

<style>
  table.assessScoresTable th {
    height: 35px;
    line-height: 35px;
    text-align: center;
    font-size: 16px;
    border: 1px solid #ccc;
  }
  table.assessScoresTable td {
    height: 30px;
    line-height: 30px;
    border: 1px solid #ccc;
    padding: 0 5px;
  }
  table.assessScoresTable td.center{
    text-align: center;
  }
  table.assessScoresTable td.right{
    text-align: right;
  }
  table.assessScoresTable td p{
    margin: 0;
  }
  table.assessScoresTable td input{
    width: 130px;
    min-height: 100px;
    height: auto;
    line-height: 50px;
    text-align: center;
    margin: 0;
    border: none;
  }

  table.assessScoresTable td input::-webkit-outer-spin-button,
  table.assessScoresTable td input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  table.assessScoresTable td input[type='number'] {
    -moz-appearance: textfield;
  }
</style>
