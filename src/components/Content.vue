<template>
  <div id="pagecontent">
    <p>This child components of Content.vue are:</p>
    <ul>
      <li v-for="child in childComponents" v-bind:key="child">{{ child }}</li>
    </ul>
    {{ weather_data }}
  </div>
</template>

<script>
export default {
  data () {
    return {
      childComponents: ['TempVarChart.vue', 'Highlights.vue']
    }
  },
  methods: {

  },
  computed: {

  },
  props: ['weather_data']
}
</script>

<style>
#pagecontent {
    border: 1px solid black;
    padding: 2px;
}
</style>
