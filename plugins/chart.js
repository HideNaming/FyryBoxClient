import Vue from 'vue'
import { Line } from 'vue-chartjs'

Vue.component('chart-line', Line.extend({
  props: ['data', 'options'],
  mounted () {
    this.renderChart(this.data, this.options)
  }
}))