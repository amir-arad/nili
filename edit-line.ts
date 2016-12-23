import * as direction from 'direction';

type Segment = {dir:direction.Result, text:string};

export class EditLine{
	private segments:Segment[];

	constructor(segments:Segment[] = []){
		this.segments = segments;
		this.reset();
	}

	reset(){
		this.segments.splice(0);
		this.segments.push({dir:'ltr', text:''});
	}

	private getLastSegment() {
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
			if(this.segments.length === 1){
				this.segments.pop();
			}
			this.segments.push({dir, text:text});
		}
	}

	backspace(){
		const lastSegment = this.getLastSegment();
		switch (lastSegment.text.length){
			case 0: break;
			case 1:
				(this.segments.length > 1)? this.segments.pop() : lastSegment.text = '';
				break;
			default:
				lastSegment.text = lastSegment.text.split('').slice(0, -1).join('');
		}
	}
}