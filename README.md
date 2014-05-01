# opt-param

add some sanity to loosely typed javascript option parameters.

## reasoning

passing in an object literal containing parameters is super popular in all the favorite javascript libraries. it's super cool.

however, there is a downside in that, unless the code is well documented, it's hard to keep track of all the possible parameters passed through. this solves that issue by making the code self-documenting. (this also lets client look at your source and understand what they need to pass in without much effort)

## install

```sh
npm install --save opt-param
```

## usage

`optparam(opt, parameterDeclaration)`

* `opt`: the option parameter to be used
* `parameterDeclaration`: an object whose keys are declared parameter names and whose values are objects declaring information about a parameter (as below in examples)

### notes:

* the `type` value is basically the `instanceof` value as a string, to lower case.
* if a parameter is optional (`required = false`) and not present, the output object will still defined that key, but set the value explicitly to `undefined`
* parameters that are passed into the function that are not defined in the `optparam` call will be dropped from the output
* parameter declarations that do not have `required: true` will assume they are optional
* parameter declarations that do not have a type is assumed it's okay to be anything (parameter declarations can be an empty object)

### examples

```js
var optparam = require('opt-param');

var doAThing = function(opt) {
	// parse and modify the option parameter
	opt = optparam(opt, {
		w: {
			// basic object type
			type: 'number',
			required: true
		},
		h: {
			type: 'number',
			required: true
		}
	});

	// lets see what it did
	console.log('out:', opt);
	console.log('w=' + opt.w + ', h=' + opt.h);
}

doAThing({
	w: 12,
	h: 34,
	somethingExtra: 'this will be dropped'
});

/*
 * outputs:
 *     out: { w: 12, h: 34 }
 *     w=12, h=34
 */

doAThing({
	w: '12', // coerce to a 'number' type
	h: 34
});

/*
 * outputs:
 *     out: { w: 12, h: 34 }
 *     w=12, h=34
 */

doAThing({
	w: 12
	// we're missing a required field!
});

/*
 * outputs:
 *     throws and error!
 */
```

we can do more stuff (more examples just for the sake of it);

```js
// but wait, there's more!
var doAnotherThing = function(opt) {
	// parse and modify the option parameter
	opt = optparam(opt, {
		arr: {
			// we can use arrays!
			type: 'array',
			required: false
		}
	});

	if (opt.arr) {
		console.log(opt.arr.length);
	}
}

doAnotherThing(); // no output (opt.arr will be explicitly set to `undefined`)
doAnotherThing([]); // prints: 0
doAnotherThing([1, 2, 3]) // prints: 3
```