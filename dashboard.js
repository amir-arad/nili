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
export function show(screen) {
//create layout and widgets

	const grid = new contrib.grid({rows: 12, cols: 1, screen: screen});

	let editLine = new EditLine();

	const sparkline = grid.set(0, 0, 3, 1, contrib.sparkline, {
		label: 'Fluff Analysis'
		, tags: true
		, style: {fg: 'yellow', titleFg: 'white'}
	});

	const log = grid.set(3, 0, 7, 1, blessed.list, {
		fg: "green"
		, selectedFg: "green"
		, label: 'Session Log'
	});

	const input = grid.set(10, 0, 2, 1, blessed.text,{
		style: {
			bg: 'black',
			fg: 'white'
		},
		name: 'input'
	});

	screen.on('keypress', function(char, key) {
		if (key.name !== 'return') {
			transaction(() => {
//			console.log(JSON.stringify(key));
				if (char && char.length) {
					if (key.name === 'enter') {
						addLine('>' + editLine);
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

//set spark dummy data
	var spark1 = observable([1, 2, 5, 2, 1, 5, 1, 2, 5, 2, 1, 5, 4, 4, 5, 4, 1, 5, 1, 2, 5, 2, 1, 5, 1, 2, 5, 2, 1, 5, 1, 2, 5, 2, 1, 5])
	let lastValCalc = 0;
	var spark2 = spark1.map(val => {
		const res = (val + lastValCalc);
		lastValCalc = val;
		return res;
	});
	refreshSpark()
	const timer1 = setInterval(refreshSpark, 150)

	function refreshSpark() {
		transaction(() => {
			spark1.unshift(Math.random() * 5 + 1)
			spark1.splice(400);
			spark2.unshift((spark1[0] + spark1[1]))
			spark2.splice(400);
			sparkline.setData(['Anomalies', 'Leaps'], [spark1, spark2])
		})
	}

	const disposer1 = autorun(() => {
		spark1.join();
		input.setText('' + editLine);
		screen.render();
	});

	const disposer2 = autorun(() => {
		log.setItems(logLines);
		log.scrollTo(logLines.length);
		screen.render()
	});

	logLines.push('-- someone joined --');

	let closed = false;
	return function close(){
		if (!closed) {
			closed = true;
			clearInterval(timer1);
			disposer1();
			disposer2();
			logLines.push('-- someone left --');
		}
	}
}