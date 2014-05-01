//opt-param÷

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

	if (getType(opt).toLowerCase() != 'object') {
		throw new TypeError('opt is not an object! (type: ' + getType(opt).toLowerCase() + ', value: ' + JSON.stringify(opt, null, 2) + ')');
	}

	var missingParameters = [];

	var output = {};
	for (var parameter in parameters) {
		var specType = parameters[parameter].type.toLowerCase();
		var specRequired = parameters[parameter].required;

		if (opt.hasOwnProperty(parameter)) {
			var value = opt[parameter];
			var type = getType(value).toLowerCase();

			// check if the types are the same
			if (type == specType) {
				// everything's good in the neighborhood
				output[parameter] = opt[parameter];
			} else {
				if (specType == 'string') {
					// coerce it to a string
					output[parameter] = '' + opt[parameter];
				} else if (specType == 'number') {
					// coerce it to a number
					var failOnParseNumber = function() {
						throw new TypeError('cannot coerce parameter "' + parameter + '" (value: ' + JSON.stringify(opt[parameter]) + ')' + ' to a number!');
					}
					try {
						var num = Number(opt[parameter]);
						if (isNaN(num)) {
							failOnParseNumber();
						}
						output[parameter] = num;
					} catch (e) {
						failOnParseNumber();
					}
				} else if (specType == 'boolean') {
					// coerce it to a boolean, based on "truthiness"
					output[parameter] = !! opt[parameter];
				} else {
					// we can't coerce easily, abort abort!
					throw new TypeError('parameter "' + parameter + '" was expected to be "' + specType + '", but was actually "' + type + '"!')
				}
			}
		} else {
			if (specRequired) {
				// we don't have it, but it was required!
				missingParameters.push('"' + parameter + '"');
			} else {
				output[parameter] = undefined;
			}
		}
	}

	if (missingParameters.length > 0) {
		if (missingParameters.length == 1) {
			throw new Error('required parameter ' + missingParameters[0] + ' nonexistant!');
		} else {
			throw new Error('required parameters ' + missingParameters.join(',') + ' nonexistant!');
		}
	}

	// // 'clean' opt
	// for (var key in opt) {
	// 	if (opt.hasOwnProperty(key)) {
	// 		delete opt[key];
	// 	}
	// }
	// // fill opt with output
	// for (var key in output) {
	// 	opt[key] = output[key];
	// }

	return output;
}

module.exports = parse;