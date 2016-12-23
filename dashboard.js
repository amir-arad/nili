import * as blessed from 'blessed';
import * as contrib from 'blessed-contrib';
import * as direction from 'direction';

function renderEditLine(editLine){
	return editLine.map(segment =>
		segment.dir === 'rtl' ?
			segment.text.split('').reverse().join('') :
			segment.text
	).join('');
}

function addKeyToEditLine(editLine, key){
	const lastSegment = editLine[editLine.length-1];
	let text = key.sequence || key.ch;
	const dir = direction(text);
	if (dir === 'neutral' || dir === lastSegment.dir){
		lastSegment.text = lastSegment.text + text;
	} else {
		editLine.push({dir, text:text});
	}
}

function resetEditLine(editLine){
	editLine.splice(0);
	editLine.push({dir:'ltr', text:''});

}
function backspaceEditLine(editLine){
	const lastSegment = editLine[editLine.length-1];
	switch (lastSegment.text.length){
		case 0: break;
		case 1:
			(editLine.length > 1)? editLine.pop() : lastSegment.text = '';
			break;
		default:
			lastSegment.text = lastSegment.text.split('').slice(0, -1).join('');
	}
}
export function show(screen) {
//create layout and widgets

	const grid = new contrib.grid({rows: 12, cols: 1, screen: screen});

	let editLine = [];
	resetEditLine(editLine);

	const sparkline = grid.set(0, 0, 3, 1, contrib.sparkline, {
		label: 'Fluff Analysis'
		, tags: true
		, style: {fg: 'yellow', titleFg: 'white'}
	});

	const log = grid.set(3, 0, 7, 1, contrib.log, {
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
			console.log(JSON.stringify(key));
			if (char.length) {
				if (key.name === 'enter') {
					log.log('line: '+renderEditLine(editLine));
					resetEditLine(editLine);
					screen.render();
				} else if (key.name === 'backspace') {
					backspaceEditLine(editLine);
					screen.render();
				} else {
					addKeyToEditLine(editLine, key);
				}
				input.setText(renderEditLine(editLine));
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