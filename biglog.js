const path = require('path');
const fs = require('fs');

const Rotter = require('./lib').default;

const options = {
	directory: path.resolve('./logs') + '/%S-%D',
	format: '%S-%X.mp3'
}

let config, stations;
let rotters = {}

/*
 * Main entrypoint if running straight as
 */
function start () {

	try {
		// Cautiously read the new configuration file
		config = JSON.parse(fs.readFileSync('biglog.json'))
		
		Object.assign(options, config.options || {})
		stations = config.stations;
	} catch (e) {
		console.log(e)
		console.log('!! Invalid configuration file. Oh no')
		// yeet out early so we don't change anything
		return;
	}

	console.log('Configuration file is reloading')

	let dirty = Object.keys(rotters);
	stations.forEach((stn) => dirty.indexOf(stn.name) >= 0 && delete dirty[dirty.indexOf(stn.name)])
	dirty = dirty.filter((d) => d);

	dirty.forEach((dirty) => { rotters[dirty].close(); delete rotters[dirty]; })

	stations.map((stn) => {
		if (rotters[stn.name]) {
			return;
		}

		rotters[stn.name] = new Rotter(stn.src, stn.name, options)
	})

}

start();

fs.watchFile('biglog.json', start);
