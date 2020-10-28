<template>
  <div id="app">
    <p>This component's code is in {{ filename }}</p>
    <Content v-bind:weather_data="weather_data"></Content>
  </div>
</template>

<script>
import Content from './components/Content.vue'

export default {
  name: 'App',
  components: {
    'Content': Content
  },
  data () {
    return {
      filename: 'App.vue',
      weather_data: {
        location: 'California',
        temperature: {
          current: '35 C'
        },
        highlights: {
          uvindex: '3',
          windstatus: {
            speed: '20 km/h',
            direction: 'N-E'
          },
          visibility: '12 km'
        }
      }
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
