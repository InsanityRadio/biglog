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

### Formatting

- `%S` - the station ID
- `%D` - YYYY-MM-DD
- `%X` - YYYY-MM-DD_HH
- `%U` - UNIX timestamp

## Stability

BigLog appends complete MP3 frames to a file in a chunked format. This means that once restarted, it'll immediately start appending fresh data to any pre-existing file for the current hour. It will create a new file (and directory, if needed) at the end of the hour, and write the next MP3 frame to the newly created file. This also means you can easily concatenate files without losing any data. 

However, the project hasn't been extensively tested. Use at your own risk (but hopefully not for any broadcast critical compliance logging, get hardware!). Really, don't use this for broadcast critical compliance logging. 
