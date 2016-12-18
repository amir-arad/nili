import * as blessed from 'blessed';
import * as telnet  from 'telnet2';


export function chat(options, sessionHandler){
	return telnet(options, function(client) {
		client.on('term', function(terminal) {
			screen.terminal = terminal;
			screen.render();
		});

		client.on('size', function(width, height) {
			client.columns = width;
			client.rows = height;
			client.emit('resize');
		});

		var screen = blessed.screen({
			smartCSR: true,
			input: client,
			output: client,
			terminal: 'xterm-256color',
			fullUnicode: true
		});

		client.on('close', function() {
			if (!screen.destroyed) {
				screen.destroy();
			}
		});

		screen.key(['C-c', 'escape'], function(ch, key) {
			screen.destroy();
		});

		screen.on('destroy', function() {
			if (client.writable) {
				client.destroy();
			}
		});

		sessionHandler({screen});
	});
}