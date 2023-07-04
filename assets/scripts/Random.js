export default class {

	static get unit() { return Math.random(); }

	static int(_min, _max) {

		return Math.floor(Math.random() * (_max - _min + 1) + _min);
	}

	static float(_min, _max) {

		return Math.random() * (_max - _min) + _min;
	}

	static rgb(_hex = false) {

		let color = this.rgba(_hex);

		if (_hex)
			color = color.substring(0, 7);
		else
			color.pop();

		return color;
	}

	static rgba(_hex = false) {

		let color = [

			this.int(0, 255),
			this.int(0, 255),
			this.int(0, 255),
			this.int(0, 255)
		];

		if (_hex) {

			for (let index = 0; index < color.length; index++) {

				color[index] = color[index].toString(16);
				while (color[index].length < 2)
					color[index] = "0" + color[index];
			}

			color = `#${color.join("")}`;
		}

		return color;
	}
};