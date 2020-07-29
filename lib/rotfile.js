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

		fs.mkdirSync(directory = this.format(directory), { recursive: true })

		this.filename = this.getFilename(directory, this.format(format), hour)

		this.writeStream = fs.createWriteStream(this.filename, { flags: 'a' })
	}

	getFilename (directory, format, hour) {

		let formatted = path.resolve(directory, format)
			
		return formatted
	}

	format (string) {
		return string.replace('%U', this.hour.getTime() / 1000 | 0)
			.replace('%D', this.hour.toISOString().slice(0, 10))
			.replace('%X', this.hour.toISOString().slice(0, 13).replace('T', '_'));
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