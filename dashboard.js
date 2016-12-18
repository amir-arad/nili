import * as blessed from 'blessed';
import * as contrib from 'blessed-contrib';


export function show(screen) {
//create layout and widgets

	const grid = new contrib.grid({rows: 12, cols: 1, screen: screen});

	var sparkline = grid.set(0, 0, 3, 1, contrib.sparkline,
		{
			label: 'Fluff Analysis'
			, tags: true
			, style: {fg: 'yellow', titleFg: 'white'}
		})

	var log = grid.set(3, 0, 7, 1, contrib.log,
		{
			fg: "green"
			, selectedFg: "green"
			, label: 'Session Log'
		})



	var text = grid.set(10, 0, 2, 1, blessed.textbox,{
		//mouse: true,
		keys: true,
		style: {
			bg: 'black',
			fg: 'white'
		},
		// height: 1,
		// width: 20,
		// left: 1,
		// top: 3,
		name: 'input'
	});

	text.on('submit', function(data) {
		log.log('line: '+data);
		text.clearValue();
		// text.focus();
		screen.render();
	});

	text.focus();
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