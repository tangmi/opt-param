var optparam = require('..');

function Person(first, last) {
	this.first = first;
	this.last = last;
}

Person.prototype.greet = function() {
	console.log('Hello, %s %s!', this.first, this.last);
}

var sayHiToTwoPeople = function(opt) {
	opt = optparam(opt, {
		person1: 'required person',
		person2: 'required person'
	});

	opt.person1.greet();
	opt.person2.greet();
}

sayHiToTwoPeople({
	person1: new Person('michael', 'tang'),
	person2: new Person('tyler', 'menenenenezes')
});

sayHiToTwoPeople({
	person1: new Person('michael', 'tang'),
	person2: {
		first: 'tyler',
		last: 'menenenenezes'
	}
});