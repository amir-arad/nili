

declare module "direction" {
	namespace direction {
		type Result = 'rtl' | 'ltr' | 'neutral';
	}
	function direction(value: string): direction.Result;

	export = direction;
}