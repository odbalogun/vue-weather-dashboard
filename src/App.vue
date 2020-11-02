<template>
  <div id="app">
    <div id="search">
      <input type="text" id="location-input" ref="input" placeholder="Location?" @keyup.enter="organizeAllDetails" />
      <button id="search-btn" @click="organizeAllDetails">
        <img src="./assets/Search.svg" width="24" height="24">
      </button>
    </div>
    <dashboard-content :highlights="highlights" :tempVar="tempVar"></dashboard-content>
    <div id="info">
      <div class="wrapper-left">
        <div id="current-weather">
          {{ currentWeather.temp }}
          <span>°C</span>
        </div>
        <div id="weather-desc">{{ currentWeather.summary }}</div>
        <div class="temp-max-min">
          <div class="max-desc">
            <div id="max-detail">
              <i>▲</i>
              {{ currentWeather.todayHighLow.todayTempHigh }}
              <span>°C</span>
            </div>
            <div id="max-summary">at {{ currentWeather.todayHighLow.todayTempHighTime }}</div>
          </div>
          <div class="min-desc">
            <div id="min-detail">
              <i>▼</i>
              {{ currentWeather.todayHighLow.todayTempLow }}
              <span>°C</span>
            </div>
            <div id="min-summary">at {{ currentWeather.todayHighLow.todayTempLowTime }}</div>
          </div>
        </div>
      </div>
      <div class="wrapper-right">
        <div class="date-time-info">
          <div id="date-desc">
            <img src="./assets/calendar.svg" width="20" height="20">
            {{ currentWeather.time }}
          </div>
        </div>
        <div class="location-info">
          <div id="location-desc">
            <img
              src="./assets/location.svg"
              width="10.83"
              height="15.83"
              style="opacity: 0.9;"
            >
            {{ currentWeather.full_location }}
            <div id="location-detail" class="mt-1">
              Lat: {{ currentWeather.formatted_lat }}
              <br>
              Long: {{ currentWeather.formatted_long }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyC-lCjpg1xbw-nsCc11Si8Ldg2LKYizqI4&libraries=places" async defer></script>
<script>
import Content from './components/Content.vue'

export default {
  name: 'app',
  components: {
    'dashboard-content': Content
  },
  data () {
    return {
      weatherDetails: false,
      location: '', // raw location from input
      lat: '', // raw latitude from google maps api response
      long: '', // raw longitude from google maps api response
      completeWeatherApi: '', // weather api string with lat and long
      rawWeatherData: '', // raw response from weather api
      currentWeather: {
        full_location: '', // for full address
        formatted_lat: '', // for N/S
        formatted_long: '', // for E/W
        time: '',
        temp: '',
        todayHighLow: {
          todayTempHigh: '',
          todayTempHighTime: '',
          todayTempLow: '',
          todayTempLowTime: ''
        },
        summary: '',
        possibility: ''
      },
      tempVar: {
        tempToday: [
          // gets added dynamically by this.getSetHourlyTempInfoToday()
        ]
      },
      highlights: {
        uvIndex: '',
        visibility: '',
        windStatus: {
          windSpeed: '',
          windDirection: '',
          derivedWindDirection: ''
        }
      }
    }
  },
  methods: {
    convertToTitleCase: function (str) {
      // Takes a string or phrase and converts the individual words to title case
      str = str.toLowerCase().split(' ')
      for (var i = 0; i < str.length; i++) {
        str[i] = str[i].charAt(0).toUppercase() + str[i].slice(1)
      }
      return str.join(' ')
    },
    formatPossibility: function (str) {
      // To format the "possibility" string obtained from the weather API
      str = str.toLowerCase().split('-')
      for (var i = 0; i < str.length; i++) {
        str[i] = str[i].charAt(0).toUppercase() + str[i].slice(1)
      }
      return str.join(' ')
    },
    unixToHuman: function (timezone, timestamp) {
      // To convert Unix timestamps according to our convenience
      /* READ THIS BEFORE JUDGING & DEBUGGING
      For any location beyond the arctic circle and the
      antarctic circle, the goddamn weather api does not return certain
      keys/values in each of this.rawWeatherData.daily.data[some_array_index].
      Due to this, console throws up an error.
      The code is correct, the problem is with the API.
      May be later on I will add some padding to tackle missing values.
      */
      var moment = require('moment-timezone') // for handling date & time
      var decipher = new Date(timestamp * 1000)
      var human = moment(decipher).tz(timezone).format('llll')
      var timeArray = human.split(' ')
      var timeNumeral = timeArray[4]
      var timeSuffix = timeArray[5]
      var justTime = timeNumeral + ' ' + timeSuffix
      var monthDateArray = human.split(',')
      var monthDate = monthDateArray[1].trim()
      return {
        fullTime: human,
        onlyTime: justTime,
        onlyMonthDate: monthDate
      }
    },
    fahToCel: function (tempInFahrenheit) {
      // convert temperature to Celsius
      var tempInCelsius = Math.round(5 / 9) * (tempInFahrenheit - 32)
      return tempInCelsius
    },
    milibarToKiloPascal: function (pressureInMilibar) {
      // To convert the air pressure reading from milibar to kilopascal
      return Math.round(pressureInMilibar * 0.1)
    },
    mileToKM: function (miles) {
      return Math.round(miles * 1.60934)
    },
    deriveWindDir: function (windDir) {
      var windDirectionsArray = [
        { minVal: 0, maxVal: 30, direction: 'N' },
        { minVal: 31, maxVal: 45, direction: 'NNE' },
        { minVal: 46, maxVal: 75, direction: 'NE' },
        { minVal: 76, maxVal: 90, direction: 'ENE' },
        { minVal: 91, maxVal: 120, direction: 'E' },
        { minVal: 121, maxVal: 135, direction: 'ESE' },
        { minVal: 136, maxVal: 165, direction: 'SE' },
        { minVal: 166, maxVal: 180, direction: 'SSE' },
        { minVal: 181, maxVal: 210, direction: 'S' },
        { minVal: 211, maxVal: 225, direction: 'SSW' },
        { minVal: 226, maxVal: 255, direction: 'SW' },
        { minVal: 256, maxVal: 270, direction: 'WSW' },
        { minVal: 271, maxVal: 300, direction: 'W' },
        { minVal: 301, maxVal: 315, direction: 'WNW' },
        { minVal: 316, maxVal: 345, direction: 'NW' },
        { minVal: 346, maxVal: 360, direction: 'NNW' }
      ]
      var windDirection = ''
      for (var i = 0; i < windDirectionsArray.length; i++) {
        if (
          windDir >= windDirectionsArray[i].minVal &&
          windDir <= windDirectionsArray[i].maxVal
        ) {
          windDirection = windDirectionsArray[i].direction
        }
      }
      return windDirection
    },
    // action oriented methods
    makeInputEmpty: function () {
      this.$refs.input.value = ''
    },
    makeTempVarTodayEmpty: function () {
      this.tempVar.tempToday = []
    },
    detectEnterKeyPress: function () {
      var input = this.$refs.input
      input.addEventListener('keyup', function (event) {
        event.preventDefault()
        var enterKeyCode = 13

        if (event.keyCode === enterKeyCode) {
          this.setHitEnterKeyTrue()
        }
      })
    },
    locationEntered: function () {
      var input = this.$refs.input
      if (input.value === '') {
        this.location = 'Lagos'
      } else {
        this.location = this.convertToTitleCase(input.value)
      }
      this.makeInputEmpty()
      this.makeTempVarTodayEmpty()
    },
    // function to retrieve location coordinates from Google api
    getCoordinates: function () {
      this.locationEntered()
      var loc = this.location
      var coords
      var geocoder = new google.maps.Geocoder()
      return new Promise(function (resolve, reject) {
        geocoder.geocode({ address: loc }, function (results, status) {
          if (status === google.maps.GeocoderStatus.OK) {
            this.lat = results[0].geometry.location.lat()
            this.long = results[0].geometry.location.lng()
            this.full_location = results[0].formatted_address
            coords = {
              lat: this.lat,
              long: this.long,
              full_location: this.full_location
            }
            resolve(coords)
          } else {
            alert("Oops! Couldn't get data for the location")
          }
        })
      })
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
