import * as blessed from 'blessed';
import * as contrib from 'blessed-contrib';
import {EditLine} from './edit-line';
import {autorun, transaction, observable} from 'mobx';

var logLines = observable([]);
function addLine(line){
	logLines.push(line);
	if (logLines.length>100) {
		logLines.shift()
	}
}
//set spark dummy data
var spark1 = observable([1, 2, 5, 2, 1, 5, 1, 2, 5, 2, 1, 5, 4, 4, 5, 4, 1, 5,
	1, 2, 5, 2, 1, 5, 1, 2, 5, 2, 1, 5, 4, 4, 5, 4, 1, 5, 1, 2, 5, 2, 1, 5, 1,
	2, 5, 2, 1, 5, 4, 4, 5, 4, 1, 5, 1, 2, 5, 2, 1, 5, 1, 2, 5, 2, 1, 5, 4, 4,
	5, 4, 1, 5, 1, 2, 5, 2, 1, 5, 1, 2, 5, 2, 1, 5, 4, 4, 5, 4, 1, 5, 1, 2, 5,
	2, 1, 5, 1, 2, 5, 2, 1, 5, 4, 4, 5, 4, 1,4, 5, 4, 1, 5, 1, 2, 5, 2, 1, 5,
	1, 2, 5, 2, 1, 5, 4, 4, 5, 4, 1, 5, 1, 2, 5, 2, 1, 5, 1, 2, 5, 2, 1, 5, 1]);
let lastValCalc = 0;
var spark2 = spark1.map(val => {
	const res = (val + lastValCalc);
	lastValCalc = val;
	return res;
});
setInterval(function refreshSpark() {
	transaction(() => {
		spark1.unshift(Math.random() * 5 + 1);
		spark1.splice(400);
		spark2.unshift((spark1[0] + spark1[1]));
		spark2.splice(400);
	})
}, 150);

function reverse(str){
	return str.split('').reverse().join('')
}
export function show(screen) {
//create layout and widgets

	const grid = new contrib.grid({align: 'right',rows: 12, cols: 1, screen: screen});

	const sparkline = grid.set(0, 0, 3, 1, contrib.sparkline, {
		align: 'right',
		label: reverse('מערכת נילי')
		, tags: true
		, style: {fg: 'yellow', titleFg: 'white'}
	});

	const log = grid.set(3, 0, 7, 1, blessed.list, {
		align: 'right',
		fg: "green"
		, selectedFg: "green"
		, label: reverse('יישום משתמש')
	});

	const input = grid.set(10, 0, 2, 1, blessed.text,{
		align: 'right',
		style: {
			bg: 'black',
			fg: 'white'
		},
		name: 'input'
	});

	const editLine = new EditLine();

	screen.on('keypress', function(char, key) {
		if (key.name !== 'return') {
			transaction(() => {
				if (char && char.length) {
					if (key.name === 'enter') {
						addLine('' + editLine);
						editLine.reset();
					} else if (key.name === 'backspace') {
						editLine.backspace();
					} else {
						editLine.append(key.sequence || key.ch);
					}
				}
			});
		}
	});

	const disposer1 = autorun(() => {
		sparkline.setData([reverse('משאבים פנויים'), reverse('פעילות ליבה')], [spark1, spark2]);
		screen.render();
	});

	const disposer2 = autorun(() => {
		input.setText('' + editLine);
		screen.render();
	});

	const disposer3 = autorun(() => {
		log.setItems(logLines);
		log.scrollTo(logLines.length);
		screen.render()
	});

	logLines.push(reverse('-- חיבור --'));

	let closed = false;
	return function close(){
		if (!closed) {
			closed = true;
			disposer1();
			disposer2();
			disposer3();
			logLines.push(reverse('-- ניתוק --'));
		}
	}
}