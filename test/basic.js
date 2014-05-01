var optparam = require('..');

var assert = require("assert");

describe('basic', function() {
	describe('good cases', function() {
		var declaration = {
			w: {
				type: 'number',
				required: true
			},
			h: {
				type: 'number',
				required: true
			}
		};

		it('should be an ok input value', function() {
			var out = optparam({
				w: 50,
				h: 15
			}, declaration);
			assert.deepEqual(out, {
				w: 50,
				h: 15
			});
		});

		it('should drop extra vlues', function() {
			var out = optparam({
				w: 50,
				h: 15,
				extra: 'thing',
			}, declaration);
			assert.deepEqual(out, {
				w: 50,
				h: 15
			});
		});
	});

	describe('use non-primitives', function() {
		it('should use array', function() {
			var out = optparam({
				n: []
			}, {
				n: {
					type: 'array'
				}
			});
			assert.deepEqual(out.n, []);
		});
		it('should use custom functions', function() {
			function Person(name) {
				this.name = name;
			}
			var out = optparam({
				n: new Person('tangmi')
			}, {
				n: {
					type: 'person'
				}
			});
			assert.deepEqual(out.n, new Person('tangmi'));
		});
	});

	describe('null/undefined cases', function() {
		var declaration = {
			n: {}
		};
		it('should pass null through', function() {
			var out = optparam({
				n: null
			}, declaration);
			assert.equal(out.n, null);
		});
		it('should pass undefined through', function() {
			var out = optparam({
				n: undefined
			}, declaration);
			assert.equal(out.n, undefined);
		});
	});

	describe('primitive parameter coercing', function() {
		describe('to a number', function() {
			var declaration = {
				num: {
					type: 'number'
				}
			}
			it('should coerce a string to a number', function() {
				var out = optparam({
					num: '123'
				}, declaration);

				assert.equal(out.num, 123);
			});
			it('should coerce a boolean to a number', function() {
				var out = optparam({
					num: false
				}, declaration);
				assert.equal(out.num, 0);

				out = optparam({
					num: true
				}, declaration);
				assert.equal(out.num, 1);
			});
			it('should pass a null/undefined without coercing', function() {
				var out = optparam({
					num: null
				}, declaration);

				assert.equal(out.num, null);

				out = optparam({
					num: undefined
				}, declaration);

				assert.equal(out.num, undefined);
			});
			it('should fail if cannot coerce to a number', function() {
				assert.throws(function() {
					optparam({
						num: 'THIS IS NOT A NUMBER'
					}, declaration);
				});
			});
		});
		describe('to a string', function() {
			var declaration = {
				str: {
					type: 'string'
				}
			}
			it('should coerce a number to a string', function() {
				var out = optparam({
					str: '123'
				}, declaration);
				assert.equal(out.str, '123');
			});
			it('should coerce a boolean to a string', function() {
				var out = optparam({
					str: false
				}, declaration);
				assert.equal(out.str, 'false');
			});
			it('should pass a null/undefined without coercing', function() {
				var out = optparam({
					str: null
				}, declaration);

				assert.equal(out.str, null);

				out = optparam({
					str: undefined
				}, declaration);

				assert.equal(out.str, undefined);
			});
		});
		describe('to a boolean', function() {
			var declaration = {
				bool: {
					type: 'boolean'
				}
			}
			it('should coerce whatever to a boolean', function() {
				var out = optparam({
					bool: 123
				}, declaration);
				assert.equal(out.bool, true);

				out = optparam({
					bool: 'hello'
				}, declaration);
				assert.equal(out.bool, true);

				out = optparam({
					bool: []
				}, declaration);
				assert.equal(out.bool, true);

				out = optparam({
					bool: undefined
				}, declaration);
				assert.equal(out.bool, false);
			});
		});
	});
	describe('other cases', function() {
		var declaration = {
			n: {}
		};
		it('should construct a blank object if passed undefined', function() {
			var out = optparam(undefined, declaration);
			assert.deepEqual(out, {
				n: undefined
			});
		});
		it('should fail if passed bad declaration', function() {
			assert.throws(function() {
				optparam({}, 1);
			});
			assert.throws(function() {
				optparam({}, null);
			});
			assert.throws(function() {
				optparam({}, []);
			});
			assert.throws(function() {
				optparam({}, undefined);
			});
		});
	});
});
