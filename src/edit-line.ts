import * as direction from 'direction';
import {observable} from 'mobx';

type Segment = {dir:direction.Result, text:string};

export class EditLine{
	private segments:Segment[];

	constructor(){
		this.segments = observable([]);
		this.reset();
	}

	reset(){
		this.segments.splice(0);
		this.segments.push(this.makeSegment('ltr', ''));
	}

	private makeSegment(dir:direction.Result, text:string){
		return observable({dir, text});
	}

	private getLastSegment() {
		if (!this.segments.length) {
			this.reset();
		}
			return this.segments[this.segments.length - 1];
	}

	toString(){
		return this.segments.map(segment =>
			segment.dir === 'rtl' ?
				segment.text.split('').reverse().join('') :
				segment.text
		).join('');
	}

	append(text:string){
		const lastSegment = this.getLastSegment();
		const dir = direction(text);
		if (dir === 'neutral' || dir === lastSegment.dir){
			lastSegment.text = lastSegment.text + text;
		} else {
			if(lastSegment.text.length === 0){
				this.segments.pop();
			}
			this.segments.push(this.makeSegment(dir, text));
		}
	}

	backspace(){
		const lastSegment = this.getLastSegment();
		switch (lastSegment.text.length){
			case 0: break;
			case 1:
				this.segments.pop();
				break;
			default:
				lastSegment.text = lastSegment.text.split('').slice(0, -1).join('');
		}
	}
}