var optparam = require('..');
var assert = require("assert");

describe('alt-declaration', function() {
	var declaration = {
		one: 'number',
		two: 'required number',
		three: 'string',
		four: 'required',
		five: ''
	};

	describe('good cases', function() {
		it('should correctly declare and red the parameters', function() {
			var out = optparam({
				one: 1,
				two: 2,
				three: 'three',
				four: {},
				five: 'pbbt'
			}, declaration);

			assert.deepEqual(out, {
				one: 1,
				two: 2,
				three: 'three',
				four: {},
				five: 'pbbt'
			});
		});

		it('should only need the required parameters', function() {
			var out = optparam({
				two: 2,
				four: {},
			}, declaration);

			assert.deepEqual(out, {
				one: undefined,
				two: 2,
				three: undefined,
				four: {},
				five: undefined
			});
		});

		it('should not accept bad declarations', function() {
			assert.throws(function() {
				optparam({}, {
					pbbt: []
				})
			}, TypeError, 'error thrown');
		});
	});
});
