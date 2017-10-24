#! /usr/bin/env node

require('source-map-support').install();
import {chat} from'./server';
import {show} from './dashboard';

chat({ tty: true }, function({screen}) {
	console.log('new session');
	const disposer = show(screen);
	screen.on('destroy', disposer);

}).listen(2300, ()=>{console.log('server listening in port 2300')});