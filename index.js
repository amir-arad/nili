import {chat} from'./server';
import {show} from './dashboard';

chat({ tty: true }, function({screen}) {
	show(screen);

}).listen(2300);