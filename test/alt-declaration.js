var optparam = require('..');

function fn(opt) {
	opt = optparam(opt, {
		one: 'number',
		two: 'required number',
		three: 'string',
		four: 'required',
		five: ''
	});
	console.log(opt);
}

fn({
	one: 1,
	two: 2,
	three: 'three',
	four: {},
	five: 'pbbt'
});

// just required
fn({
	two: 2,
	four: {},
});

try {
	// not a number
	fn({
		two: 'not a number',
		four: {},
	});
} catch (e) {
	console.log(e.message);
}

try {
	// bad declaration
	optparam({}, {
		pbbt: []
	});
} catch (e) {
	console.log(e.message);
}