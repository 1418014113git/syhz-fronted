<template>
  <div id='myMain'>
    <tableList></tableList>
  </div>
</template>
<script>
  import tableList from './components/TableList'
  export default {
    data() {
      return {
        activeName: 'tableList'
      }
    },
    components: {
      tableList
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event)
      }
    }
  }
</script>
