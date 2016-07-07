"use strict"

var fs = require('fs'),
	_ = require('underscore'),
	phantom = require('phantom'),
	Output = require('./lib/Output'),
	Manipulator = require('./lib/Manipulator');


var headers = {
	desktop: {
		// agent: 'Mozilla/5.0 (Windows NT 6.3; rv:36.0) Gecko/20100101 Firefox/36.0', //FF36
		agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.124 Safari/537.36', //CHROME37
		platform: 'desktop',
		viewport: { width : 1920, height : 1080}
		},
	mobile: {
		agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25',
		platform: 'mobile'
		// viewport: { width : 750, height : 1334}
		},
	tablet: {
		agent: 'Mozilla/5.0 (iPad; CPU OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25',
		platform: 'tablet'
		// viewport: { width : 2048, height : 1536}
		}
}

if (!process.argv[2]){
	console.error('Usage error: please pass a document containing links you would like to test')
	process.exit(1)
}

function phantomGatherer(array, option, type){
	console.log('>> call received: testing', option.platform, type);
	var count = 0;
	_.each(array, function(obj){
		phantom.create('--ssl-protocol=any', function (ph) {
			ph.createPage(function (page) {
				console.log('>> creating a new', type, 'phantom for', option.platform);
				page.set('viewportSize', option.viewport);
		  		page.set('settings', {
                        userAgent: option.agent,
                        javascriptEnabled: true,
                        loadImages: true
                    });
		  		page.set('onLoadFinished', function(success) {
		  			var outputFile = './screenshots/screenshot_' + option.platform + '_' + obj.url + '.png';
		  			page.render(outputFile);
		  			console.log(">> Render complete")
		  		})
		    	page.open(obj.url, function () {
		    		console.log('>> loading url for', type, option.platform);
		    		// var outputFile = './screenshots/screenshot_' + option.platform + '_' + obj.url + '.png';
		        	page.evaluate(function() {
		        		return document.body.innerHTML
		        	}, function (result) {
		        	        obj.body = result
		        	        obj.status = 200
		        	        console.log('>> extracting tags for', type, option.platform);
		        	        Manipulator.extractTagData(obj);
		        	        count++
		        	        if (count === array.length) {
		        	        	Output.reporter(array, option, type)
		        	        }
		        	        ph.exit();
		        	 	}
		        	);
		    	});
		    });
		}, {
 		   dnodeOpts: {weak: false}
		});
	});
}

fs.readFile(process.argv[2], 'utf8', function(err, data){
	if (err) {
		return console.log(err);
	}
	var linkArray = data.split('\n')
	console.log(linkArray);
	Manipulator.arrange(linkArray, function(group){
			// CHANGEME - context for array length is necessary!
			console.log('group.control');
			console.log(group.control);
			console.log(_.first(group.control, [5]));
			phantomGatherer(_.first(group.control, [5]), headers.desktop, 'control');
			// phantomGatherer(_.last(group.control, [2]), headers.mobile, 'control'); // for some reason, the second url for mob on control/treat say sso tab, when run parallel with tab.
			// phantomGatherer(_.last(group.control, [2]), headers.tablet, 'control');

			// phantomGatherer(_.first(group.treatment, [11]), headers.desktop, 'treatment');
			// phantomGatherer(_.last(group.treatment, [99]), headers.mobile, 'treatment');
			// phantomGatherer(_.last(group.treatment, [99]), headers.tablet, 'treatment');
	});
});
