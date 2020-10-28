// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import FusionCharts from 'fusioncharts'
import Charts from 'fusioncharts/fusioncharts.charts'
import Widgets from 'fusioncharts/fusioncharts.widgets'
import PowerCharts from 'fusioncharts/fusioncharts.powercharts'
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion'
import VueFusionCharts from 'vue-fusioncharts'

// Resolve the dependencies
Charts(FusionCharts)
PowerCharts(FusionCharts)
Widgets(FusionCharts)
FusionTheme(FusionCharts)

Vue.config.productionTip = false

// register the component for project wide use
Vue.use(VueFusionCharts, FusionCharts)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})
