var optparam = require('..');

// define a function that takes an opt parameter
function doAThing(opt) {
	console.log(' in:', opt);
	opt = optparam(opt, {
		w: {
			// basic object type
			type: 'number',
			required: true
		},
		h: {
			type: 'number',
			required: true
		},
		name: {
			type: 'string',
			required: false
		},
		array: {
			type: 'array',
			required: false
		},
		bool: {
			type: 'boolean',
			required: false
		},
		noop: {}
	});
	console.log('out:', opt);
	console.log();
}

// run our function with an array of opt objects
var runTheTests = function(opts) {
	for (var i = 0; i < opts.length; i++) {
		var opt = opts[i];
		try {
			doAThing(opt);
		} catch (e) {
			console.log('err:', e.message);
			console.log();
		}
	}
};

// actually run the tests
runTheTests([
	// basic 'ok' values
	{
		w: 50,
		h: 15
	},

	// coerce to a number
	{
		w: '50',
		h: 15
	},

	// won't coerce to a number
	{
		w: '50x',
		h: 15
	},

	// missing parameter
	{
		w: 50,
	},

	// with option name
	{
		w: 1,
		h: 2,
		name: 'howdy'
	},

	// coerce that name to a string
	{
		w: 1,
		h: 2,
		name: 5
	},

	// don't let extras through
	{
		w: 1,
		h: 2,
		name: 5,
		extra: 'this will be dropped'
	},

	// try it with an array
	{
		w: 1,
		h: 2,
		array: []
	},

	// try it with an boolean... you know, truthiness
	{
		w: 1,
		h: 2,
		bool: new Array()
	},

	// ok for realz
	{
		w: 1,
		h: 2,
		bool: false
	},

	// do a noop thing
	{
		w: 1,
		h: 2,
		noop: 'cool!'
	},

	// undefined
	undefined,

	// not an object
	1, [], 'pbbt'
]);