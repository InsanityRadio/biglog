import RotFile from './rotfile';
import MP3Stream from './mp3stream';
import http from 'http';

process.on('SIGINT', async () => {
	console.log("");

	setInterval(() => 	process.exit(), 3000)
	await Promise.all(ROTTERS.map((a) => a.close()));
	process.exit();
});

let ROTTERS = [];

export default class Rotter {
	
	constructor (streamPath, id, options) {
		Object.assign(this, options);
		this.id = id;
		this.streamPath = streamPath;
		this.createRotFile();
		this.promise = this.openMP3Stream();

		ROTTERS.push(this)
	}

	createRotFile () {
		this.startHour = new Date();
		this.startHour.setUTCMinutes(0); this.startHour.setUTCSeconds(0); this.startHour.setUTCMilliseconds(0);
		this.startHourEnd = new Date(this.startHour.getTime() + 3600000);


		this.rotFile = new RotFile(
			this.directory.replace('%S', this.id),
			this.format.replace('%S', this.id),
			this.startHour, this.startHourEnd
		);

		console.log('Starting or appending to file', this.rotFile.filename);
	}

	async close () {
		let res = this.res;

		console.log('! Closing ' + this.id)
		res && await res.destroy();

		if (ROTTERS.indexOf(this) >= 0) 
			ROTTERS.splice(ROTTERS.indexOf(this), 1);

	}

	openMP3Stream () {
		// force flush :D
		if (this.mp3Stream) {
			this.mp3stream.handleFrameComplete();
		}

		this.mp3stream = new MP3Stream(
			(cb) => this.write = cb,
			(frame) => this.writeFrame(frame)
		);

		return new Promise((resolve) => {
			http.get(this.streamPath, (res) => {
				res.on('data', (chunk) => this.write(Buffer.from(chunk, 'binary')));
				res.on('end', () => resolve(this.openMP3Stream()));
				this.res = res;
			})
		})
	}

	onReceivedStreamData (data) {
		if (!this.mp3stream) {
			this.openMP3Stream();
		}
		this.write(data);
	}

	writeFrame (frame) {
		try {
			this.rotFile.writeData(frame);
		} catch (e) {
			this.createRotFile();
			this.writeFrame(frame);
		}
	}
}