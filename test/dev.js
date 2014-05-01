var optparam = require('..');
var assert = require("assert");

describe('dev function testing', function() {
	var declaration = {
		p: {
			type: 'string',
			required: true
		}
	};
	describe('in development', function() {

		before(function() {
			process.env.NODE_ENV = 'development';
		});

		it('should simply pass through the opt param in a good case', function() {
			var out = optparam.dev({
				p: 'hi'
			}, declaration);
			assert.deepEqual(out, {
				p: 'hi'
			});
		});

		it('should fail if something isn\'t right', function() {
			assert.throws(function() {
				optparam.dev({}, declaration);
			});
		});
	});


	describe('in production (NODE_ENV=production)', function() {

		before(function() {
			process.env.NODE_ENV = 'production';
		})

		after(function() {
			process.env.NODE_ENV = 'development';
		})

		var declaration = {
			p: {
				type: 'string',
				required: true
			}
		};

		it('should not do anything, even if there should be an error', function() {
			assert.doesNotThrow(function() {
				var out = optparam.dev({}, declaration);
				assert.deepEqual(out, {});
			});
		});
	});
});