
/*
 * MP3 stream just splits input MP3 into a buffer of frames. 

 * let stream = new MP3Stream(
 	(cb) => io.addEventListener('data', cb),
 	(frame) => this.writeFrame(frame))

 * 
 */
export default class MP3Stream {
	
	constructor (inputCallback, outputCallback) {
		this.buffer = new Uint8Array(65536)
		this.bufferSize = 0;
		this.bufferTarget = 4096;

		this.outputCallback = outputCallback;
		inputCallback(this.handleFrame.bind(this));
	}

	handleFrame (frame) {
		let foundIndex = -1, head;

		// is a new frame happening here? if so, shift the old ones
		if (this.bufferSize > this.bufferTarget) {
			for (let i = 0; i + 4 <= frame.length; i++) {
				head = frame.readUInt32BE(i);

				if ((head & 0xffe00000) == ~~0xffe00000) {
					foundIndex = i;

					if (foundIndex > 0)
						this.buffer.set(frame.slice(0, foundIndex), this.bufferSize);

					this.bufferSize += foundIndex;
					this.handleFrameComplete(i)

					break;
				}

			}
		}

		// add the rest of the frame (some might have been yoinked out above) to the buffer
		let frameStart = Math.max(foundIndex, 0);
		let slice = frame.slice(frameStart);

		this.buffer.set(slice, this.bufferSize);
		this.bufferSize += slice.length;
	}

	handleFrameComplete (i) {
		if (this.bufferSize == 0) return;

		// ok, this.buffer[0..bufferSize] is a full frame, we can yeet it out
		this.outputCallback(this.buffer.slice(0, this.bufferSize));
		this.bufferSize = 0;
	}

}