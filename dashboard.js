import * as blessed from 'blessed';
import * as contrib from 'blessed-contrib';
import {EditLine} from './edit-line';

export function show(screen) {
//create layout and widgets

	const grid = new contrib.grid({rows: 12, cols: 1, screen: screen});

	let editLine = new EditLine();

	const sparkline = grid.set(0, 0, 3, 1, contrib.sparkline, {
		label: 'Fluff Analysis'
		, tags: true
		, style: {fg: 'yellow', titleFg: 'white'}
	});

	const log = grid.set(3, 0, 7, 1, contrib.log, {
		bufferLength : 100,
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
//			console.log(JSON.stringify(key));
			if (char && char.length) {
				if (key.name === 'enter') {
					log.log('line: '+editLine);
					editLine.reset();
					screen.render();
				} else if (key.name === 'backspace') {
					editLine.backspace();
					screen.render();
				} else {
					editLine.append(key.sequence || key.ch);
				}
				input.setText(''+editLine);
			}
		}
	});

//set log dummy data
	setInterval(function () {
		var rnd = Math.round(Math.random() * 2)
		log.log('random: '+rnd);
		screen.render()
	}, 500)


//set spark dummy data
	var spark1 = [1, 2, 5, 2, 1, 5, 1, 2, 5, 2, 1, 5, 4, 4, 5, 4, 1, 5, 1, 2, 5, 2, 1, 5, 1, 2, 5, 2, 1, 5, 1, 2, 5, 2, 1, 5]
	let lastValCalc = 0;
	var spark2 = spark1.map(val => {
		const res = (val + lastValCalc);
		lastValCalc = val;
		return res;
	});
	refreshSpark()
	setInterval(refreshSpark, 150)

	function refreshSpark() {
		spark1.unshift(Math.random() * 5 + 1)
		spark1.splice(400);
		spark2.unshift((spark1[0] + spark1[1]))
		spark2.splice(400);
		sparkline.setData(['Anomalies', 'Leaps'], [spark1, spark2])
		screen.render()

	}


	var pct = 0.00;


	screen.render()

}