const promodoro = {
  state:{
    session: {
      length: 25,
      min: 15,
      max: 50
    },
    break: {
      length: 5,
      min: 2,
      max: 10
    },
    longBreak: {
      length:15,
      min: 10,
      max: 25
    },
    cycle: ['session', 'break','session', 'break','session', 'break', 'session', 'longBreak'],
    currentLocation:0, //0-7 //can I limit between 0-7? Probably with a set function.
    timeLeftSec: 0,
    clockRuns: false
  },

  setNewLength: function(config, operator){
    if(operator === '+'){
      var newVal = config.length +1
      if(newVal > config.max){
        newVal = config.min
      }
    } else {
      var newVal = config.length - 1
      if(newVal < config.min){
        newVal = config.max
      }
    }
    config.length=newVal
  },

  setCurrentLocation: function (value) {
    //receives a number between 0 and 7
    console.log("setCurrentLocation started")
    if (!this.state.cycle[value]){
      console.warn("Values send to setCurrentLocation must be an integer between 0 and " + this.state.cycle.length)
    }
    this.state.currentLocation = value
    this.state.timeLeftSec = this.state[this.state.cycle[value]].length*60
  },

  setClockState: function(){
    this.state.clockRuns = !this.state.clockRuns
  },

  renderLength: function (){
    // config === All
    console.log("renderLengthChange started")
    $('#sessionLength').text(this.state.session.length)
    $('#breakLength').text(this.state.break.length)
    $('#longBreakLength').text(this.state.longBreak.length)
  },

  renderLocation: function () {
      console.log("renderLocationStarted")
      let currentLocation = this.state.currentLocation
      var output = this.state.cycle.map(function (value, index) {
          let className = (index === currentLocation) ? 'selected': ''
          return `<div><button class="btn2 ${className} btn btn-default" data="${index}">${value}</button ></div>`
      })
      $('#location-control').html(output.join(""));
  },

  renderClock: function (){
    console.log("renderClock Started")
    let min = Math.floor(this.state.timeLeftSec/60)
    let sec = this.state.timeLeftSec % 60
    if (sec < 10) { sec = '0' + sec }
    $('#clockMin').text(min)
    $('#clockSec').text(sec)
  },


  lengthChange: function (config, operator){
    console.log("lengthChange started");
    this.setNewLength (config, operator);
    this.renderLength ()
  },

  changeLocation: function (newLocation){
    console.log("locationChange Started")
    this.setCurrentLocation(newLocation);
    this.renderLocation ();
	this.renderClock();
  },

  tick: function () {
      if (!this.state.clockRuns) { return }
      if (this.state.timeLeftSec === 0) {
          this.changeLocation(this.state.currentLocation + 1)
          //ideally there will also be a sound
          var audio = new Audio('Twinkle-sound-effect.mp3');
          audio.play();
      }
      this.state.timeLeftSec -= 1
      this.renderClock()
  },

  init: function (){
    console.log('Init function started')
    this.renderLength()
    this.renderLocation()
    this.state.timeLeftSec=this.state.session.length*60
    this.renderClock()

    const promodoro=this
    $('#sessionControl button').click(function (){
      console.log('Session button clicked')
      let operator = this.innerText.trim()
      var config = promodoro.state.session
      promodoro.lengthChange(config, operator)
    })
    $('#breakControl button').click(function (){
      let operator = this.innerText.trim()
      var config = promodoro.state.break
      promodoro.lengthChange(config, operator)
    })
    $('#longBreakControl button').click(function (){
      let operator = this.innerText.trim()
      var config = promodoro.state.longBreak
      promodoro.lengthChange(config, operator)
    })

    $('#location-control').on('click', 'button', function () {
        promodoro.changeLocation(parseInt($(this).attr('data')))
    })

    $('#circle-clock').click(function () {
        promodoro.state.clockRuns = !promodoro.state.clockRuns
    })

    $('#reset').click(function(){
      promodoro.changeLocation(promodoro.state.currentLocation);
    })

    this.interval = setInterval(promodoro.tick.bind(promodoro), 1000)

     }
}

  promodoro.init()
