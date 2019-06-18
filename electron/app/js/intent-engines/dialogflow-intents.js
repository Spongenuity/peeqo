const actions = require('js/actions/actions')
const weather = require('js/skills/weather')
const Timer = require('js/skills/timer')
const event = require('js/events/events')
const responses = require('js/responses/responses')
const fetch = require('node-fetch')

function parseIntent(cmd){

	/* param {cmd} - response object from speech to text engine */

	// this one is for google dialogflow, you might need to make adjustments for a different engine	

	console.log(cmd)

	switch(cmd.intent){

		case "greeting":
			actions.setAnswer(responses.greeting, {type: 'remote'})
			break

		case "moveit":
			actions.setAnswer(responses.moveit, {type: 'local'})
			break

		case "portrait":
			actions.setAnswer(responses.portrait, {type: 'local'})
			console.log("DRAWING A PORTRAIT")
			fetch('https://maker.ifttt.com/trigger/webhook_ping/with/key/cIpuYgYsW0KWGFla00I1i9')
			break

		case "sleep":
			actions.setAnswer(responses.sleep)
			console.log("SLEEEEEEEEEEEEEPP")
			break

		case "camera":
			event.emit(`camera-${cmd.params.on.stringValue}`)
			break

		case "timer":
			let timer = new Timer(cmd.params.time.numberValue, cmd.params.timeUnit.stringValue)
			timer.startTimer()
			break

		case "weather":
			weather.getWeather(cmd.params.city.stringValue)
			break

		case "changeGlasses":
			event.emit("change-glasses")
			break

		case "goodbye":
			actions.setAnswer(responses.bye, {type: 'remote'})
			break
		default:
			actions.setAnswer(responses.confused, {type:'local'})
			break
	}

	// setAnswer(responses[cmd.intent], {type:'remote'})
}

module.exports = {
	parseIntent
}