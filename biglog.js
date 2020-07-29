import Rotter from './lib/rotter';
import path from 'path';

const options = {
	directory: path.resolve('./logs') + '/%S-%D',
	format: '%S-%X.mp3'
}

new Rotter('http://contrib.insn.it:8000/sra-split-a.mp3', 'sra-split-a', options);
new Rotter('http://contrib.insn.it:8000/sra-split-b.mp3', 'sra-split-b', options);
new Rotter('http://contrib.insn.it:8000/sra-split-c.mp3', 'sra-split-c', options);
new Rotter('http://contrib.insn.it:8000/sra-split-d.mp3', 'sra-split-d', options);
