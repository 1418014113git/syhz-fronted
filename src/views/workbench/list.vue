<template>
  <div class="workList">
    <db-sign v-if="type === '4'"></db-sign>
    <clue-check v-if="type === '5'"></clue-check>
    <local-assist v-if="type === '6'"></local-assist>
    <investigation v-if="type === '7'"></investigation>
    <db-cb v-if="type === '8'"></db-cb>
    <inspect-ident v-if="type === '10'"></inspect-ident>
  </div>
</template>

<script>
  import ClueCheck from './ClueCheck'
  import DbSign from './DBSign'
  import LocalAssist from './LocalAssist'
  import Investigation from './Investigation'
  import DbCb from './DbCb'
  import InspectIdent from './InspectIdent'

  export default {
    name: 'workList',
    components: {
      ClueCheck, DbSign, LocalAssist, Investigation, DbCb, InspectIdent
    },
    data() {
      return {
        type: ''
      }
    },
    methods: {
    },
    mounted() {
      this.type = this.$route.params.type
    }
  }
</script>

<style scoped>

</style>
