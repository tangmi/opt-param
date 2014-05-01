//opt-param÷

var assert = require('assert');

var getType = function(obj) {
	var funcNameRegex = /function (.{1,})\(/;
	var results = (funcNameRegex).exec((obj).constructor.toString());
	return (results && results.length > 1) ? results[1] : "";
};

function parse(opt, parameters) {
	if (typeof opt == 'undefined') {
		// basically does opt = opt || {};
		opt = {};
	}

	// check if our parameters are objects
	if (getType(opt).toLowerCase() != 'object') {
		throw new TypeError('opt is not an object! (type: ' + getType(opt).toLowerCase() + ', value: ' + JSON.stringify(opt, null, 2) + ')');
	}
	if (getType(parameters).toLowerCase() != 'object') {
		throw new TypeError('declaration is not an object! (type: ' + getType(parameters).toLowerCase() + ', value: ' + JSON.stringify(parameters, null, 2) + ')');
	}

	var missingParameters = [];

	var output = {};
	for (var parameter in parameters) {
		// variable hoisting means these have to be initialized every time
		var specType = '',
			specRequired = false;

		// parse/read the declaration
		var declaration = parameters[parameter],
			declarationType = getType(parameters[parameter]).toLowerCase();
		if (declarationType == 'object') {
			// object-based declaration
			specType = (declaration.type || '').toLowerCase();
			specRequired = declaration.required || false;
		} else if (declarationType == 'string') {
			// string-based declaration
			var parts = declaration.split(/\s+/);
			assert(parts.length <= 2, 'declaration has too many parts!');
			for (var i = 0; i < parts.length; i++) {
				var part = parts[i];
				if (part == 'required') {
					specRequired = true;
				} else {
					specType = part;
				}
			}
		} else {
			// unsupported declaration
			throw new TypeError('declaration is of type ' + declarationType + ', expected an object or string!');
		}

		if (opt.hasOwnProperty(parameter)) {
			// opt object has a declared parameter

			var value = opt[parameter];
			var type;
			if (typeof value == 'undefined' || value === null) {
				output[parameter] = value;
			} else {
				type = getType(value).toLowerCase()
			}

			// check if the types are the same
			if (type == specType || specType == '') {
				// everything's good in the neighborhood
				output[parameter] = value;
			} else {
				if (specType == 'string') {
					if (typeof value == 'undefined' || value === null) {
						continue;
					}
					// coerce it to a string
					output[parameter] = '' + value;
				} else if (specType == 'number') {
					if (typeof value == 'undefined' || value === null) {
						continue;
					}

					// coerce it to a number
					var failOnParseNumber = function() {
						throw new TypeError('cannot coerce parameter "' + parameter + '" (value: ' + JSON.stringify(value) + ')' + ' to a number!');
					}
					try {
						var num = Number(value);
						if (isNaN(num)) {
							failOnParseNumber();
						}
						output[parameter] = num;
					} catch (e) {
						failOnParseNumber();
					}
				} else if (specType == 'boolean') {
					// coerce it to a boolean, based on "truthiness"
					output[parameter] = !! value;
				} else {
					// we can't coerce easily, abort abort!
					throw new TypeError('parameter "' + parameter + '" was expected to be "' + specType + '", but was actually "' + type + '"!')
				}
			}
		} else {
			// opt object does not have a declared parameter

			if (specRequired) {
				// we don't have it, but it was required!
				missingParameters.push('"' + parameter + '"');
			} else {
				output[parameter] = undefined;
			}
		}
	}

	// handle all missing parameters at once
	if (missingParameters.length > 0) {
		if (missingParameters.length == 1) {
			throw new Error('required parameter ' + missingParameters[0] + ' nonexistant!');
		} else {
			throw new Error('required parameters ' + missingParameters.join(',') + ' nonexistant!');
		}
	}

	return output;
}

module.exports = parse;


// only throws errors if parameters are bad and turns
// into a essentially no-op if NODE_ENV == 'production'
module.exports.dev = function(opt) {
	if (process.env.NODE_ENV != 'production') {
		parse.apply(this, arguments);
	}
	return opt;
}
