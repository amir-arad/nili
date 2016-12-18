import {chat} from'./server';
import {show} from './dashboard';

chat({ tty: true }, function({screen}) {
	console.log('new session');
	show(screen);

}).listen(2300, ()=>{console.log('server listening in port 2300')});