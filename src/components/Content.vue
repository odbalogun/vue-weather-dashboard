<template>
  <div style="position: relative">
    <temp-var-chart :tempVar="tempVar"></temp-var-chart>
    <today-highlights :highlights="highlights"></today-highlights>
  </div>
</template>

<script>
import TempVarChart from './TempVarChart.vue'
import Highlights from './Highlights.vue'

export default {
  components: {
    'temp-var-chart': TempVarChart,
    'today-highlights': Highlights
  },
  props: ['highlights', 'tempVar']
}
</script>
