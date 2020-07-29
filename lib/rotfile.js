import path from 'path';
import fs from 'fs';

/*
 * RotFile abstracts a hour long MP3 file. 

 * @param directory The directory to store the MP3 in
 * @param format The configured format for the filename
 * @param hour The UTC hour we're recording in
 * @param finish The time at which we will stop recording (ie. next hour)


 * new RotFile('/var/logs', 'station-%U.mp3', startOfThisHourDate, endOfThisHourDate)
 */
export default class RotFile {

	initialData = [];

	constructor (directory, format, hour, finish) {

		this.hour = hour;
		this.finish = finish;
		this.filename = this.getFilename(directory, format, hour)

		this.writeStream = fs.createWriteStream(this.filename, { flags: 'a' })
	}

	getFilename (directory, format, hour) {

		let formatted = format.replace('%U', hour.getTime() / 1000 | 0).replace('%X', new Date().toISOString().slice(0, 13).replace('T', '_'));

		return path.resolve(directory, formatted);
	}

	writeData (data) {
		if (!this.writeStream) {
			throw new Error('Gone');
		}

		this.writeStream.write(data);

		if (Date.now() >= this.finish.getTime()) {
			this.writeStream.end();
			throw new Error('Expired');
		}
	}

}