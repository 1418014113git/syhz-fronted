<template>

  <el-tabs type="border-card">
    <!--v-if="item.isShow===true"-->
    <el-tab-pane :key="item.value" :label="item.title"  v-for="item in tabData" >
      <BusinessLicenseInfo v-if="item.content === 'BusinessLicenseInfo'" :info="enterpriseInfo"
                          :id="id"></BusinessLicenseInfo>
      <!--<ChangeInfo v-if="item.content == 'ChangeInfo'"></ChangeInfo>-->
      <!--<AdminLicensingInfo v-if="item.content == 'AdminLicensingInfo'"></AdminLicensingInfo>-->
      <!--<AdminPunishInfo v-if="item.content == 'AdminPunishInfo'"></AdminPunishInfo>-->
      <!--<HighRiskInfo v-if="item.content == 'HighRiskInfo'"></HighRiskInfo>-->
      <!--<BlackInfo v-if="item.content == 'BlackInfo'"></BlackInfo>-->
      <InvolvedCase v-if="item.content === 'InvolvedCase'" :bh="jgbh" @listenCase="listenToChildCase"></InvolvedCase>
      <company-person v-if="item.content === 'CompanyPerson'" :bh="jgbh" @listenPer="listenToChildPer"></company-person>
      <!--<time-line-small :caseId="caseId" :type="1" v-if="item.content == 'timeLineSmall'"></time-line-small>-->
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import BusinessLicenseInfo from './BusinessLicenseInfo'
import ChangeInfo from './ChangeInfo'
import AdminLicensingInfo from './AdminLicensingInfo'
import AdminPunishInfo from './AdminPunishInfo'
import HighRiskInfo from './HighRiskInfo'
import BlackInfo from './BlackInfo'
import InvolvedCase from './InvolvedCase'
import timeLineSmall from '../../common/timeLineSmall'
import CompanyPerson from './CompanyPerson'

export default {
  name: 'Tab',
  props: [
    'tabData',
    'enterpriseInfo',
    'id',
    'caseId',
    'jgbh'
  ],
  components: {
    BusinessLicenseInfo,
    ChangeInfo,
    AdminLicensingInfo,
    AdminPunishInfo,
    HighRiskInfo,
    BlackInfo,
    InvolvedCase,
    timeLineSmall,
    CompanyPerson
  },
  data() {
    return {}
  },
  methods: {
    listenToChildCase(evtValue) {
      this.$emit('listen2', '0')
    },
    listenToChildPer(evtValue) {
      this.$emit('listen3', '0')
    }
  }
}
</script>

<style scoped>
</style>
