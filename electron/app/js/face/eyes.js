'use strict'

const event = require('js/events/events')
const Snap = require('snapsvg')
const snap = Snap("#eyes")
const mic = require('js/senses/mic')

//small change to test

class Eyes {

	constructor(color="#0199FD"){

		this.eyeSize = 87.5
		this.closedEye = 1
		this.blinkDuration = 120
		this.leftEye = snap.ellipse(202.5, 300, this.eyeSize, this.eyeSize)
		this.rightEye = snap.ellipse(604.5, 300, this.eyeSize, this.eyeSize)
		this.leftSquish = snap.ellipse(202.5, 475, 175, 87.5)
		this.rightSquish = snap.ellipse(604.5, 475, 175, 87.5)
		this.isBlinking = false
		this.blinkTimer = null
		this.eyes = snap.group(this.leftEye, this.rightEye)
		this.squishes = snap.group(this.leftSquish, this.rightSquish)
		this.sleepEye = snap.rect(0, 0, 800, 150)
		this.blinkIntervals = [4000, 6000, 10000, 1000, 500, 8000]
		this.transitionSize = 1000
		this.transitionSpeed = 100

		this.eyes.attr({
			fill: color
		})

		this.squishes.attr({
			fill: "#000000",
		})

		this.sleepEye.attr({
			fill: "#000000",
		})

		this.startBlinking = this.startBlinking.bind(this)
		this.stopBlinking =  this.stopBlinking.bind(this)
		this.transitionToMedia = this.transitionToMedia.bind(this)
		this.transitionFromMedia = this.transitionFromMedia.bind(this)
		this.blink = this.blink.bind(this)
		this.squashin = this.squashin.bind(this)
		this.squashout = this.squashout.bind(this)
		this.sleepeye = this.sleepeye.bind(this)

		event.on('start-blinking', this.startBlinking)
		event.on('stop-blinking', this.stopBlinking)
		event.on('transition-eyes-away', this.transitionToMedia)
		event.on('transition-eyes-back', this.transitionFromMedia)
		event.on('wakeword-heard', this.squashin)
		event.on('wakeword-lost', this.squashout)
		event.on('sleep-time', this.sleepeye)
	}

	getRandomBlinkInterval(){
		return this.blinkIntervals[Math.floor(this.blinkIntervals.length * Math.random())]
	}

	startBlinking() {
		this.isBlinking = true
		let duration = this.getRandomBlinkInterval()
		this.blinkTimer = setTimeout(this.blink, duration) 
	}

	transitionFromMedia(){

		// eye animation when transitioning after displaying media


		this.leftEye.animate({ry:this.eyeSize, rx:this.eyeSize}, this.transitionSpeed, mina.easein())
		this.rightEye.animate({ry:this.eyeSize, rx:this.eyeSize}, this.transitionSpeed, mina.easein(), ()=>{
			console.log("transitioned back")
			// this.squashout()
			this.startBlinking()
		})
	}

	transitionToMedia(cb){

		// eye animation when transitioning to display media
		
		if(this.isBlinking){
			this.stopBlinking()
		}
		this.leftSquish.animate({ ry: 10 }, this.transitionSpeed, mina.elastic())
		this.rightSquish.animate({ ry: 10 }, this.transitionSpeed, mina.elastic())
		this.leftEye.animate({ry:this.transitionSize, rx:this.transitionSize}, this.transitionSpeed, mina.elastic())
		this.rightEye.animate({ry:this.transitionSize, rx:this.transitionSize}, this.transitionSpeed, mina.elastic(), ()=>{
			console.log("transitioned away")
			cb()
		})
	}

	blink() {

		// mic.stopMic()

		let eyes = ['leftEye','rightEye']

		// this.wakeeye()

		for(const i in eyes){
			this[eyes[i]].animate({ry: this.closedEye}, this.blinkDuration, mina.elastic(), () => {
				this[eyes[i]].animate({ry:this.eyeSize}, this.blinkDuration, mina.easein())
			})
		}

		clearTimeout(this.blinkTimer)

		this.blinkTimer = null
		let duration = this.getRandomBlinkInterval()
		this.blinkTimer = setTimeout(this.blink, duration)

	}

	stopBlinking(){
		this.eyes.isBlinking = false
		clearTimeout(this.blinkTimer)
		this.blinkTimer = null
	}

	squashin(){
		let squishes = ['leftSquish','rightSquish']
		for(const i in squishes){
			// this[squishes[i]].animate({ transform: 't0,-120' }, 200, mina.easein());
			this[squishes[i]].animate({ ry: 200 }, 200, mina.elastic());
		}
	}
	squashout(){
		let squishes = ['leftSquish','rightSquish']
		for(const i in squishes){
			this[squishes[i]].animate({ ry: 87.5 }, this.transitionSpeed, mina.easein());
		}
	}

	sleepeye(){
		this.sleepEye.animate({ transform: 't0,190' }, 2000, mina.elastic());
		// mic.stopMic()

	}

	wakeeye(){
		this.sleepEye.animate({ transform: 't0,-190' }, 200, mina.elastic());

	}



}

module.exports = Eyes