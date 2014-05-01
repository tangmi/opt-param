var optparam = require('opt-param');

var doAThing = function(opt) {
	// parse and modify the input parameter
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
    h: 34
});

/*
outputs:

out: { w: 12, h: 34 }
w=12, h=34
 */