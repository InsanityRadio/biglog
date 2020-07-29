# BigLog

BigLog is a Record of Transmission system that, basically, dumps an Icecast stream to a file. These files can be incremented hourly.

In fact, it can support recording a large number of Icecast streams into files. _How_ many is a good question we don't have an answer to. 

## Usage

```javascript
import Rotter from './lib/rotter';
import path from 'path';

const options = {
	directory: path.resolve('./logs') + '/%S-%D',
	format: '%S-%X.mp3'
}

new Rotter('http://your.streaming.url/monitor.mp3', 'station-name', options);
```
