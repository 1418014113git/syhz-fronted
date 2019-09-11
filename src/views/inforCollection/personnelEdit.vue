<template>
  <section>
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix" style="position: relative">
        <span v-if="$route.query.id && Number($route.query.id) > 0">编辑用户</span>
        <span v-else>增加用户</span>
        <!-- <el-button style="position: absolute; right: 20px;" size="small" @click="back">返回</el-button> -->
        <img src="@/assets/icon/back.png"  class="goBack" @click="back">   <!--返回-->
      </div>
      <div class="person_content_edit">
        <el-row>
          <el-col :span="8">
            <div class="img info_collect">
              <el-upload
                class="avatar-uploader"
                :action="uploadAction"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload">
                <img v-if="baseInfo.ATTACHMENT" :src="baseInfo.ATTACHMENT" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              <!--<img :src="baseInfo.img"/>-->
              <p>人员相片</p>
            </div>
          </el-col>
          <el-col :span="16">
            <el-form ref="form" :rules="rules" :model="baseInfo" size="small" label-width="100px">
              <el-col :span="12">
                <el-form-item label="姓名" prop="XM">
                  <el-input size="small" v-model="baseInfo.XM" class="ipt"></el-input>
                </el-form-item>
                <el-form-item label="民族" prop="MZ">
                  <el-select size="small" v-model="baseInfo.MZ" placeholder="请选择民族" @change="MZSelectChange" class="ipt">
                    <el-option v-for="item in getMZSelectList" :label="item.label" :value="item.value"
                               :key="item.value"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="籍贯" prop="HJDSSXQ">
                  <el-input size="small" v-model="baseInfo.HJDSSXQ" class="ipt"></el-input>
                </el-form-item>
                <el-form-item label="文化程度" prop="WHCD">
                  <el-select size="small" v-model="baseInfo.WHCD" placeholder="请选择文化程度" @change="WHCDSelectChange" class="ipt">
                    <el-option v-for="item in getWHCDSelectList" :label="item.label" :value="item.value"
                               :key="item.value"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="职业" prop="ZYLB">
                  <el-select size="small" filterable v-model="baseInfo.ZYLB" @change="ZYLBSelectChange" class="ipt">
                    <el-option v-for="item in getZYLBSelectList" :label="item.label" :value="item.value"
                               :key="item.value"></el-option>
                    <!-- <el-option label="" value="061"></el-option>
                    <el-option label="棉农" value="612"></el-option>
                    <el-option label="土建机槭和有关设备操作工" value="943"></el-option>
                    <el-option label="其他生产工人和有关人员" value="910"></el-option>
                    <el-option label="审判人员" value="101"></el-option>
                    <el-option label="邮政业务人员" value="331"></el-option>
                    <el-option label="建筑工人" value="920"></el-option>
                    <el-option label="其它文化工作人员" value="149"></el-option>
                    <el-option label="民主党派、人民团体负责人" value="224"></el-option>
                    <el-option label="检察人员" value="102"></el-option>
                    <el-option label="其它卫生技术人员" value="089"></el-option>
                    <el-option label="服务员" value="510"></el-option>
                    <el-option label="中西药剂人员" value="072"></el-option>
                    <el-option label="体育教练员和裁判员" value="129"></el-option>
                    <el-option label="其它法律工作人员" value="109"></el-option>
                    <el-option label="中央级国家机关及工作机构负责人" value="211"></el-option>
                    <el-option label="其他非金属矿物制品制造工人" value="915"></el-option>
                    <el-option label="油漆工人" value="900"></el-option>
                    <el-option label="油漆工" value="901"></el-option>
                    <el-option label="运动员" value="130"></el-option>
                    <el-option label="省级国家机关及其机构负责人" value="212"></el-option>
                    <el-option label="教学人员" value="110"></el-option>
                    <el-option label="城镇、街道、乡镇机关机构负责人" value="215"></el-option>
                    <el-option label="其他采矿、石、勘探、钻井、采盐" value="719"></el-option>
                    <el-option label="瓦工、抹灰工" value="921"></el-option>
                    <el-option label="摄影人员" value="125"></el-option>
                    <el-option label="其他油漆工" value="909"></el-option>
                    <el-option label="其它文艺、体育工作人员" value="139"></el-option>
                    <el-option label="地市级国家机关及工作机构负责人" value="213"></el-option>
                    <el-option label="高等教育教师" value="111"></el-option>
                    <el-option label="企、事业及工作机构负责人" value="240"></el-option>
                    <el-option label="金属表面处理工" value="726"></el-option>
                    <el-option label="经济业务人员" value="090"></el-option>
                    <el-option label="护理人员" value="073"></el-option>
                    <el-option label="国家机关及其工作机构负责人" value="210"></el-option>
                    <el-option label="文化工作人员" value="140"></el-option>
                    <el-option label="县级国家机关及其工作机构负责人" value="214"></el-option>
                    <el-option label="税务人员和工商管理人员" value="096"></el-option>
                    <el-option label="化学肥料制造工人" value="732"></el-option>
                    <el-option label="编缉" value="142"></el-option>
                    <el-option label="党群组织负责人" value="220"></el-option>
                    <el-option label="海关检查人员" value="098"></el-option>
                    <el-option label="其它政治、保卫工作人员" value="329"></el-option>
                    <el-option label="其他农业劳动者" value="619"></el-option>
                    <el-option label="翻译" value="144"></el-option>
                    <el-option label="中共中央及地方县级组织负责人" value="221"></el-option>
                    <el-option label="其它经济业务人员" value="099"></el-option>
                    <el-option label="其他办事人员和有关人员" value="399"></el-option>
                    <el-option label="档案业务人员" value="146"></el-option>
                    <el-option label="营造林人员" value="621"></el-option>
                    <el-option label="其他牧业劳动者" value="639"></el-option>
                    <el-option label="收发员和通迅员" value="313"></el-option>
                    <el-option label="家庭保姆及家庭服务员" value="518"></el-option>
                    <el-option label="检验计量等分析人员和有关人员" value="960"></el-option>
                    <el-option label="装卸工和有关设备操作工" value="940"></el-option>
                    <el-option label="采伐人员" value="622"></el-option>
                    <el-option label="渔业劳动者" value="640"></el-option>
                    <el-option label="打字和誊印人员" value="314"></el-option>
                    <el-option label="洗染织补人员" value="520"></el-option>
                    <el-option label="检验员(工)、检查员(工)" value="961"></el-option>
                    <el-option label="工艺美术品制作工人" value="918"></el-option>
                    <el-option label="护林人员" value="623"></el-option>
                    <el-option label="省、军级企、事业及其机构负责人" value="242"></el-option>
                    <el-option label="其它行政办事人员" value="319"></el-option>
                    <el-option label="生活燃料供应工人" value="521"></el-option>
                    <el-option label="计量员(工)" value="962"></el-option>
                    <el-option label="其他生产工人和有关人员" value="919"></el-option>
                    <el-option label="文学、艺术研究人员" value="016"></el-option>
                    <el-option label="木材水运人员" value="624"></el-option>
                    <el-option label="县、团级企、事业及其机构负责人" value="243"></el-option>
                    <el-option label="政治、保卫工作人员" value="320"></el-option>
                    <el-option label="市镇待业" value="978"></el-option>
                    <el-option label="其他林业劳动者" value="629"></el-option>
                    <el-option label="县团级以下及集体企、事业负责人" value="244"></el-option>
                    <el-option label="社会闲散人员" value="979"></el-option>
                    <el-option label="橡胶和塑料制品生产工人" value="740"></el-option>
                    <el-option label="汽车司机" value="954"></el-option>
                    <el-option label="乳制品加工工人" value="785"></el-option>
                    <el-option label="家具、营建木工" value="803"></el-option>
                    <el-option label="制版工人" value="822"></el-option>
                    <el-option label="美术工作人员" value="127"></el-option>
                    <el-option label="水下作业人员" value="991"></el-option>
                    <el-option label="离退休" value="980"></el-option>
                    <el-option label="水泥及其制品制造工人" value="911"></el-option>
                    <el-option label="塑料机槭操作工" value="742"></el-option>
                    <el-option label="机动车司机" value="955"></el-option>
                    <el-option label="面包、糕点和糖果制造工人" value="786"></el-option>
                    <el-option label="竹、麻、藤、棕、草等制品制作工" value="804"></el-option>
                    <el-option label="印刷工人" value="823"></el-option>
                    <el-option label="测绘工人" value="992"></el-option>
                    <el-option label="播音员" value="143"></el-option>
                    <el-option label="石棉及其制品制造工人" value="912"></el-option>
                    <el-option label="轮胎制作工和加硫工" value="743"></el-option>
                    <el-option label="包装工、打包工" value="993"></el-option>
                    <el-option label="在校大专生" value="972"></el-option>
                    <el-option label="展览讲解员" value="148"></el-option>
                    <el-option label="在校初中生" value="974"></el-option>
                    <el-option label="砖瓦、石灰制造工人" value="913"></el-option>
                    <el-option label="其他橡胶和塑料制品生产工人" value="749"></el-option>
                    <el-option label="刺锈工人" value="774"></el-option>
                    <el-option label="制茶工人" value="787"></el-option>
                    <el-option label="其他木材加工和木、竹、麻等制作" value="809"></el-option>
                    <el-option label="装钉工人" value="824"></el-option>
                    <el-option label="仓储工人" value="994"></el-option>
                    <el-option label="茶农、果农、桑农" value="614"></el-option>
                    <el-option label="在校小学生" value="975"></el-option>
                    <el-option label="学生" value="118"></el-option>
                    <el-option label="耐火材料制造工人" value="914"></el-option>
                    <el-option label="其他裁剪缝纫工人" value="779"></el-option>
                    <el-option label="酿造和饮料制造工人" value="788"></el-option>
                    <el-option label="造纸和纸制品制作工人" value="810"></el-option>
                    <el-option label="照像暗室工人" value="825"></el-option>
                    <el-option label="个体劳动者" value="996"></el-option>
                    <el-option label="退休人员" value="995"></el-option>
                    <el-option label="学龄前儿童" value="976"></el-option>
                    <el-option label="编导和音乐指挥人员" value="122"></el-option>
                    <el-option label="食品饮料制造工人" value="780"></el-option>
                    <el-option label="其他食品饮料制造工人" value="789"></el-option>
                    <el-option label="造纸工人" value="811"></el-option>
                    <el-option label="其他印刷工人和有关人员" value="829"></el-option>
                    <el-option label="家务" value="977"></el-option>
                    <el-option label="哲学研究人员" value="011"></el-option>
                    <el-option label="碾米工、磨粉工、榨油工" value="781"></el-option>
                    <el-option label="制烟工人" value="790"></el-option>
                    <el-option label="纸制品制作工人" value="812"></el-option>
                    <el-option label="石料切割和雕刻工" value="830"></el-option>
                    <el-option label="牧业劳动者" value="630"></el-option>
                    <el-option label="离休人员" value="249"></el-option>
                    <el-option label="制糖工人" value="782"></el-option>
                    <el-option label="木材加工和木、竹、麻等制作工人" value="800"></el-option>
                    <el-option label="其他造纸和纸制品制作工人" value="819"></el-option>
                    <el-option label="裁石工" value="831"></el-option>
                    <el-option label="大牲畜饲养人员" value="631"></el-option>
                    <el-option label="行政办事人员" value="310"></el-option>
                    <el-option label="车、船、飞机服务员" value="515"></el-option>
                    <el-option label="屠宰和肉类食品加工工人" value="783"></el-option>
                    <el-option label="木材处理工" value="801"></el-option>
                    <el-option label="印刷工人和有关人员" value="820"></el-option>
                    <el-option label="工艺石工" value="832"></el-option>
                    <el-option label="调度人员" value="095"></el-option>
                    <el-option label="家禽家畜饲养人员" value="632"></el-option>
                    <el-option label="行政业务管理、助理员" value="311"></el-option>
                    <el-option label="售票员" value="516"></el-option>
                    <el-option label="其他生产工人、运输工人和有关人" value="997"></el-option>
                    <el-option label="特殊用途动物饲养人员" value="633"></el-option>
                    <el-option label="秘书" value="312"></el-option>
                    <el-option label="幼儿保育员" value="517"></el-option>
                    <el-option label="食品腌渍、制罐头和保藏工人" value="784"></el-option>
                    <el-option label="制材工人" value="802"></el-option>
                    <el-option label="拣字和排版工人" value="821"></el-option>
                    <el-option label="其他运输设备操作工和有关人员" value="959"></el-option>
                    <el-option label="不便分类的其他劳动者" value="998"></el-option>
                    <el-option label="金属切削机床操作工和刃磨工" value="844"></el-option>
                    <el-option label="其他农林牧鱼劳动者" value="690"></el-option>
                    <el-option label="动力设备操作工" value="930"></el-option>
                    <el-option label="电子设备安装工、修理工" value="862"></el-option>
                    <el-option label="焊工" value="882"></el-option>
                    <el-option label="其他锻工、工具制造、机床操作工" value="849"></el-option>
                    <el-option label="其他农林牧鱼劳动者" value="699"></el-option>
                    <el-option label="电力网值班运行工" value="932"></el-option>
                    <el-option label="电气、电子设备装配工" value="863"></el-option>
                    <el-option label="冷作工" value="883"></el-option>
                    <el-option label="采盐工人" value="715"></el-option>
                    <el-option label="基本化学原料制造工人" value="731"></el-option>
                    <el-option label="其它邮电工作人员" value="339"></el-option>
                    <el-option label="其它生活日用品修理人员" value="559"></el-option>
                    <el-option label="鞋、帽制作工人" value="773"></el-option>
                    <el-option label="水产养殖劳动者" value="641"></el-option>
                    <el-option label="工段长" value="700"></el-option>
                    <el-option label="锅炉工" value="933"></el-option>
                    <el-option label="电工" value="864"></el-option>
                    <el-option label="金属构件制作和安装工" value="884"></el-option>
                    <el-option label="其它商业工作人员" value="499"></el-option>
                    <el-option label="金属冶炼和处理工人" value="720"></el-option>
                    <el-option label="化学农药制造工人" value="733"></el-option>
                    <el-option label="其他办事人员和有关人员" value="390"></el-option>
                    <el-option label="皮革、皮毛制造及制品制作工人" value="760"></el-option>
                    <el-option label="水产捕捞劳动者" value="642"></el-option>
                    <el-option label="采矿、石、勘探、钻井、采盐工人" value="710"></el-option>
                    <el-option label="其他动力设备操作工" value="939"></el-option>
                    <el-option label="电话、电报设备装修工" value="865"></el-option>
                    <el-option label="人民警察和公安保卫人员" value="323"></el-option>
                    <el-option label="金属冶炼工人" value="721"></el-option>
                    <el-option label="日用化学工人" value="734"></el-option>
                    <el-option label="营业员、售货员" value="411"></el-option>
                    <el-option label="皮革、皮毛制作工" value="761"></el-option>
                    <el-option label="其他石工" value="839"></el-option>
                    <el-option label="天然水生物采集劳动者" value="643"></el-option>
                    <el-option label="混凝土工" value="922"></el-option>
                    <el-option label="机器装配工" value="851"></el-option>
                    <el-option label="广播电台录音操作人员电影放映员" value="870"></el-option>
                    <el-option label="收购人员" value="430"></el-option>
                    <el-option label="计算机纸带孔录入员(工)" value="966"></el-option>
                    <el-option label="金属轧制和机槭操作工" value="722"></el-option>
                    <el-option label="化学纤维制造工人" value="735"></el-option>
                    <el-option label="其它售货人员" value="419"></el-option>
                    <el-option label="皮革制造品制作工" value="762"></el-option>
                    <el-option label="锻工、工具制造、机床操作工" value="840"></el-option>
                    <el-option label="其他渔业劳动者" value="649"></el-option>
                    <el-option label="钢筋工" value="923"></el-option>
                    <el-option label="机器修理工" value="852"></el-option>
                    <el-option label="发射设备操作人员" value="871"></el-option>
                    <el-option label="铸工" value="723"></el-option>
                    <el-option label="炼油工人" value="736"></el-option>
                    <el-option label="皮毛制造品制作工" value="763"></el-option>
                    <el-option label="铁匠、锻工和锻压机操作工" value="841"></el-option>
                    <el-option label="狩猎业劳动者" value="650"></el-option>
                    <el-option label="架子工" value="924"></el-option>
                    <el-option label="钟表及精密仪器制造工" value="853"></el-option>
                    <el-option label="录音设备操作人员" value="872"></el-option>
                    <el-option label="化验员(工)、分析员(工)" value="964"></el-option>
                    <el-option label="金属热处理工" value="724"></el-option>
                    <el-option label="炼焦工人" value="737"></el-option>
                    <el-option label="厨师和炊事员" value="530"></el-option>
                    <el-option label="其他皮革、皮毛制造及制品制作工" value="769"></el-option>
                    <el-option label="钳工" value="842"></el-option>
                    <el-option label="农业机械操作人员" value="660"></el-option>
                    <el-option label="力工(壮工)" value="925"></el-option>
                    <el-option label="其他机器装配工和精密仪器制造工" value="859"></el-option>
                    <el-option label="电影放映员" value="873"></el-option>
                    <el-option label="信托收购人员" value="432"></el-option>
                    <el-option label="在校本科生(含本科以上)" value="971"></el-option>
                    <el-option label="金属拉拔和挤压工" value="725"></el-option>
                    <el-option label="消防人员" value="324"></el-option>
                    <el-option label="炊事员" value="532"></el-option>
                    <el-option label="裁剪缝纫工人" value="770"></el-option>
                    <el-option label="机床安装工" value="843"></el-option>
                    <el-option label="拖拉机驾驶员" value="661"></el-option>
                    <el-option label="其他建筑工人" value="929"></el-option>
                    <el-option label="电气设备安装工、修理工" value="861"></el-option>
                    <el-option label="管工焊工冷作工和金属构件安装工" value="880"></el-option>
                    <el-option label="玻璃、陶瓷和搪瓷制品工人" value="890"></el-option>
                    <el-option label="政治工作人员" value="321"></el-option>
                    <el-option label="其他金属冶炼和处理工人" value="729"></el-option>
                    <el-option label="邮电工作人员" value="330"></el-option>
                    <el-option label="导游员" value="540"></el-option>
                    <el-option label="打样、裁剪工人" value="771"></el-option>
                    <el-option label="采购员和供销人员" value="420"></el-option>
                    <el-option label="描图、绘图、影印员(工)" value="965"></el-option>
                    <el-option label="搪瓷工" value="893"></el-option>
                    <el-option label="化学工人" value="730"></el-option>
                    <el-option label="电信业务人员" value="332"></el-option>
                    <el-option label="生活日用品修理人员" value="550"></el-option>
                    <el-option label="缝纫、缝制工人" value="772"></el-option>
                    <el-option label="废旧物资回收人员" value="433"></el-option>
                    <el-option label="环境清洁卫生工人" value="522"></el-option>
                    <el-option label="旅店、饭馆、宾馆、招待所服务员" value="512"></el-option>
                    <el-option label="人事管理人员" value="322"></el-option>
                    <el-option label="公勤人员" value="523"></el-option>
                    <el-option label="城市园林工作人员" value="525"></el-option>
                    <el-option label="其它服务员" value="529"></el-option>
                    <el-option label="测试员(工)、试验员(工)" value="963"></el-option>
                    <el-option label="装卸搬运工" value="941"></el-option>
                    <el-option label="律师" value="103"></el-option>
                    <el-option label="中等教育教师" value="112"></el-option>
                    <el-option label="起重机槭操作工" value="942"></el-option>
                    <el-option label="图书馆学、情报学研究人员" value="017"></el-option>
                    <el-option label="统计人员" value="092"></el-option>
                    <el-option label="财会人员" value="093"></el-option>
                    <el-option label="在校中专、技校生、高中生" value="973"></el-option>
                    <el-option label="文教体育用品制造工人" value="916"></el-option>
                    <el-option label="殡葬人员" value="524"></el-option>
                    <el-option label="纺织、针织、印染机安装维修工" value="753"></el-option>
                    <el-option label="劳动工资人员" value="094"></el-option>
                    <el-option label="浴室服务员" value="514"></el-option>
                    <el-option label="制药工人" value="738"></el-option>
                    <el-option label="其他服务性工作人员" value="590"></el-option>
                    <el-option label="其他科学研究人员" value="023"></el-option>
                    <el-option label="采矿、采石工" value="711"></el-option>
                    <el-option label="影剧院、体育场和游览场所服务员" value="513"></el-option>
                    <el-option label="织布工" value="754"></el-option>
                    <el-option label="橡胶机槭操作工" value="741"></el-option>
                    <el-option label="电气电子设备安装修理装配工" value="860"></el-option>
                    <el-option label="针织工" value="755"></el-option>
                    <el-option label="纺织印染工" value="756"></el-option>
                    <el-option label="发电设备运行工" value="931"></el-option>
                    <el-option label="其他电气电子设备安装修理装配工" value="869"></el-option>
                    <el-option label="中央级企、事业及工作机构负责人" value="241"></el-option>
                    <el-option label="纺织、针织、印染工人" value="750"></el-option>
                    <el-option label="机器装配工和精密仪器制造工" value="850"></el-option>
                    <el-option label="纤维预处理工" value="751"></el-option>
                    <el-option label="管工和管道工" value="881"></el-option>
                    <el-option label="纺织工、缫丝工、合股捻线工" value="752"></el-option>
                    <el-option label="珠宝、金银首饰加工工人" value="917"></el-option>
                    <el-option label="金融业务人员" value="097"></el-option>
                    <el-option label="经济计划人员" value="091"></el-option>
                    <el-option label="理发员" value="519"></el-option>
                    <el-option label="机车司机和司炉" value="952"></el-option>
                    <el-option label="工学研究人员" value="020"></el-option>
                    <el-option label="其他纺织、针织、印染工人" value="759"></el-option>
                    <el-option label="矿物和石料处理工" value="712"></el-option>
                    <el-option label="玻璃工" value="891"></el-option>
                    <el-option label="盲聋哑学校教师" value="115"></el-option>
                    <el-option label="农学研究人员" value="021"></el-option>
                    <el-option label="石油、天然气开采工" value="713"></el-option>
                    <el-option label="教学辅助人员" value="116"></el-option>
                    <el-option label="工程技术人员和农林技术人员" value="030"></el-option>
                    <el-option label="地质勘探工" value="714"></el-option>
                    <el-option label="其它教师" value="119"></el-option>
                    <el-option label="兽力车驭手" value="956"></el-option>
                    <el-option label="城市建筑规划设计人员" value="031"></el-option>
                    <el-option label="陶瓷工" value="892"></el-option>
                    <el-option label="文艺、体育工作人员" value="120"></el-option>
                    <el-option label="铁路运输工人" value="953"></el-option>
                    <el-option label="文艺创作和评论人员" value="121"></el-option>
                    <el-option label="演员" value="123"></el-option>
                    <el-option label="乐器演奏员" value="124"></el-option>
                    <el-option label="历史学研究人员" value="018"></el-option>
                    <el-option label="小学教师" value="113"></el-option>
                    <el-option label="理学研究人员" value="019"></el-option>
                    <el-option label="幼儿教师" value="114"></el-option>
                    <el-option label="饭馆、餐厅服务员" value="511"></el-option>
                    <el-option label="图书资料业务人员" value="145"></el-option>
                    <el-option label="其他装卸工和有关设备操作工" value="949"></el-option>
                    <el-option label="运输设备操作工" value="950"></el-option>
                    <el-option label="船员" value="951"></el-option>
                    <el-option label="电影、电视摄制人员" value="126"></el-option>
                    <el-option label="科学研究人员" value="010"></el-option>
                    <el-option label="宗教职业者" value="150"></el-option>
                    <el-option label="社会学研究人员" value="012"></el-option>
                    <el-option label="医生" value="071"></el-option>
                    <el-option label="经济学研究人员" value="013"></el-option>
                    <el-option label="舞台工作人员" value="128"></el-option>
                    <el-option label="机动渔船驾驶人员" value="644"></el-option>
                    <el-option label="厨师" value="531"></el-option>
                    <el-option label="医学研究人员" value="022"></el-option>
                    <el-option label="其他不在业人员" value="989"></el-option>
                    <el-option label="其他农业机械操作人员" value="669"></el-option>
                    <el-option label="家用机电产品修理人员" value="551"></el-option>
                    <el-option label="记者" value="141"></el-option> -->
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="性别" prop="XB">
                  <el-select size="small" v-model="baseInfo.XB" @change="XBSelectChange" class="ipt">
                    <el-option v-for="item in getXBSelectList" :label="item.label" :value="item.value"
                               :key="item.value"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="出生日期" prop="CSRQ">
                  <el-date-picker size="small" type="date" v-model="baseInfo.CSRQ" class="ipt"
                                  value-format="yyyy-MM-dd" format="yyyy-MM-dd"></el-date-picker>
                </el-form-item>
                <el-form-item label="身份证号" prop="ZJHM">
                  <el-input size="small" v-model="baseInfo.ZJHM" class="ipt"></el-input>
                </el-form-item>
                <el-form-item label="婚姻" prop="HYZK">
                  <el-select size="small" v-model="baseInfo.HYZK" @change="HYZKSelectChange" class="ipt">
                    <el-option v-for="item in getHYZKSelectList" :label="item.label" :value="item.value"
                               :key="item.value"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="联系方式" prop="LXDH" class="ipt">
                  <el-input size="small" v-model="baseInfo.LXDH"></el-input>
                </el-form-item>
              </el-col>
              <el-col>
                <el-form-item label="现住址" prop="ZZXZ">
                  <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 5}" v-model="baseInfo.ZZXZ"></el-input>
                </el-form-item>
              </el-col>
              <el-col>
                <el-form-item label="户籍地址" prop="HJDXZ">
                  <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 5}" v-model="baseInfo.HJDXZ"></el-input>
                </el-form-item>
              </el-col>
              <el-col>
                <el-form-item>
                  <el-button size="small" style="float: left;" type="primary" @click="submit" v-if="$isViewBtn('111010')">保存</el-button>
                </el-form-item>
              </el-col>
            </el-form>
          </el-col>
        </el-row>
      </div>
      <el-row style="margin: 20px auto">
        <el-col>
          <el-tabs type="border-card">
            <el-tab-pane label="相关企业">
              <person-company :personId="personId" :jgbh="jgbh"></person-company>
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
    </el-card>

  </section>
</template>

<script>
import {
  save, update, getPersonById
} from '@/api/collect/personCollect'
import Attachment from '@/api/attachment'
import {
  getMZSelect, getWHCDSelect, getHYZKSelect, getZYLBSelect, getXBSelect
} from '@/utils/codetotext'
import {
  identityCodeValid
} from '@/utils/validate'
import PersonCompany from './components/PersonCompany'

export default {
  name: 'personnelEdit',
  components: {
    PersonCompany
  },
  data() {
    return {
      jgbh: '',
      personId: '',
      baseInfo: {
        img: '',
        XM: '',
        XB: '',
        MZ: '',
        CSRQ: '',
        HJDSSXQ: '',
        ZJHM: '',
        ZZXZ: '',
        HJDXZ: '',
        HYZK: '',
        WHCD: '',
        ZYLB: '',
        LXDH: '',
        ATTACHMENT: ''
      },
      getMZSelectList: getMZSelect(), // 民族
      MZLable: '',
      getWHCDSelectList: getWHCDSelect(), // 文化程度
      WHCDLable: '',
      getHYZKSelectList: getHYZKSelect(), // 婚姻状况
      HYZKLable: '',
      getZYLBSelectList: getZYLBSelect(), // 职业
      ZYLBLable: '',
      getXBSelectList: getXBSelect(), // 性别
      XBLable: '',
      rules: {
        XM: [
          {
            required: true, message: '姓名不能为空', trigger: 'blur'
          },
          {
            min: 2, max: 32, message: '姓名长度在 2 到 32 个字符', trigger: 'blur'
          }
        ],
        MZ: [
          {
            required: true, message: '民族不能为空', trigger: 'change'
          }
        ],
        XB: [
          {
            required: true, message: '请选择性别', trigger: 'change'
          }
        ],
        CSRQ: [
          {
            required: true, message: '出生日期不能为空', trigger: 'blur'
          }
        ],
        HJDSSXQ: [
          {
            required: true, message: '籍贯不能为空', trigger: 'blur'
          }
        ],
        ZJHM: [
          {
            required: true, trigger: 'blur', validator: (rule, value, callback) => {
              if (!this.IdentityCodeValid(value)) {
                callback(new Error('请输入正确的身份证号码'))
              } else {
                callback()
              }
            }
          }
        ],
        ZZXZ: [
          {
            required: true, message: '现住所不能为空', trigger: 'blur'
          },
          {
            min: 2, max: 32, message: '现住所长度在 2 到 100 个字符', trigger: 'blur'
          }
        ],
        HYZK: [
          {
            required: true, message: '请选择婚姻状况', trigger: 'change'
          }
        ],
        HJDXZ: [
          {
            required: true, message: '户籍地址不能为空', trigger: 'blur'
          },
          {
            min: 2, max: 32, message: '户籍地址长度在 2 到 100 个字符', trigger: 'blur'
          }
        ],
        ZYLB: [
          {
            required: true, message: '职业不能为空', trigger: 'change'
          }
        ],
        WHCD: [
          {
            required: true, message: '文化程度不能为空', trigger: 'change'
          }
        ],
        LXDH: [
          {
            required: true, trigger: 'blur', validator: (rule, value, callback) => {
              const reg = /^[1][345678][0-9]{9}$/
              if (!reg.test(value)) {
                callback(new Error('请输入11位正确的手机号码'))
              } else {
                callback()
              }
            }
          }
        ]
      },
      uploadAction: Attachment.uploadFileUrl
    }
  },
  methods: {
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          // this.baseInfo.MZNAME = this.MZLable
          this.baseInfo.MZNAME = this.MZSelectChange(this.baseInfo.MZ)
          this.baseInfo.WHCDNAME = this.WHCDLable
          this.baseInfo.HYZKNAME = this.HYZKLable
          this.baseInfo.ZYLBNAME = this.ZYLBLable
          this.baseInfo.XBNAME = this.XBLable
          this.baseInfo.logFlag = 1 // 是否写日志
          // 用户编辑
          if (this.baseInfo.id) {
            update(this.baseInfo).then(response => {
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              this.back()
            })
          } else {
            save(this.baseInfo).then(response => {
              this.$message({
                message: '添加成功',
                type: 'success'
              })
              this.back()
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleAvatarSuccess(res, file) {
      this.baseInfo.ATTACHMENT = res.data
    },
    beforeAvatarUpload(file) {
      // return true
      var name = file.name.split('.')
      var arrayLength = name.length
      var fileType = name[arrayLength - 1]
      const reg = /^(png)|(jpg)$/
      if (!reg.test(fileType)) {
        this.$message({
          message: '上传文件只支持png、jpg',
          type: 'warning'
        })
        return false
      }
    },
    detail() {
      const para = {
        id: this.$route.query.id
      }
      getPersonById(para).then((response) => {
        const data = response.data
        this.baseInfo = {
          id: data.id,
          XM: data.XM,
          XB: data.XB,
          MZ: data.MZ,
          CSRQ: data.CSRQ,
          HJDSSXQ: data.HJDSSXQ,
          ZJHM: data.ZJHM,
          ZZXZ: data.ZZXZ,
          HJDXZ: data.HJDXZ,
          HYZK: data.HYZK,
          WHCD: data.WHCD,
          ZYLB: data.ZYLB,
          LXDH: data.LXDH,
          ATTACHMENT: data.ATTACHMENT
        }
        if (data.JGBH) {
          this.jgbh = data.JGBH
        }
      })
    },
    IdentityCodeValid(code) {
      return identityCodeValid(code)
    },
    MZSelectChange(val) { // 民族
      let obj = {}
      obj = this.getMZSelectList.find((item) => {
        return item.value === val
      })
      this.MZLable = obj.label
    },
    WHCDSelectChange(val) { // 文化程度
      let obj = {}
      obj = this.getWHCDSelectList.find((item) => {
        return item.value === val
      })
      this.WHCDLable = obj.label
    },
    HYZKSelectChange(val) { // 婚姻状况
      let obj = {}
      obj = this.getHYZKSelectList.find((item) => {
        return item.value === val
      })
      this.HYZKLable = obj.label
    },
    ZYLBSelectChange(val) { // 职业
      let obj = {}
      obj = this.getZYLBSelectList.find((item) => {
        return item.value === val
      })
      this.ZYLBLable = obj.label
    },
    XBSelectChange(val) { // 性别
      let obj = {}
      obj = this.getXBSelectList.find((item) => {
        return item.value === val
      })
      this.XBLable = obj.label
    },
    back() {
      this.$router.back(-1)
    }
  },
  mounted() {
    if (this.$route.query.id) {
      this.personId = this.$route.query.id
      this.detail()
    }
  }
}
</script>

<style scoped>
.person_header {
  width: 80%;
  margin: 0 auto;
  font-weight: bold;
  height: 40px;
  line-height: 40px;
}

.person_content_edit {
  margin: 0 auto;
  padding: 30px;
}

.person_content_edit .img {
  padding-right: 20px;
}

.person_content_edit .img p {
  text-align: center;
  padding-top: 5px;
}

.person_content_edit .img img {
  width: 280px;
  height: 240px;
  background-color: #c5ccd6;
}
.person_content_edit .ipt {
  width: 100%;
}

/* 上传图片 */
.info_collect {
  text-align: center;
}

.info_collect .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.info_collect .avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.info_collect .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 300px;
  height: 350px;
  line-height: 350px;
  text-align: center;
}
.el-table--scrollable-x .el-table__body-wrapper {
  overflow-x: auto;
}
</style>
