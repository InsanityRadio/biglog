import Rotter from './lib/rotter';
import path from 'path';
import fs from 'fs';

const options = {
	directory: path.resolve('./logs') + '/%S-%D',
	format: '%S-%X.mp3'
}

let config;
let rotters = {}

function start () {
	try {
		config = JSON.parse(fs.readFileSync('biglog.json'))
	} catch (e) {
		console.log('!! Invalid configuration file. Oh no')
		return;
	}
	let dirty = Object.keys(rotters);
	config.forEach((stn) => dirty.indexOf(stn.name) >= 0 && delete dirty[dirty.indexOf(stn.name)])
	dirty = dirty.filter((d) => d);

	dirty.length && console.log('Closing rotters', dirty)

	dirty.forEach((dirty) => { rotters[dirty].close(); delete rotters[dirty]; })

	config.map((stn) => {
		if (rotters[stn.name]) return;
		rotters[stn.name] = new Rotter(stn.src, stn.name, options)
	})

}
start();

fs.watchFile('biglog.json', start);
