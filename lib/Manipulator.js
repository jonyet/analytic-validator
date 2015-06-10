"use strict"
var _ = require('underscore'),
	cheerio = require('cheerio'),
	options = require('./options'),
	Utility = require('./Utility');

module.exports.extractTagData = function(obj){
	var $ = cheerio.load(obj.body),
		a = $('a'),
		img = $('img'),
		tests = [];
		
	_.each(a, function (tag){
		var href = $(tag).attr('href');
		if (href) {
			var base = Utility.parseUri(href)
			if (base.host === options.urls.analyticUrl){
				tests.push(href)
			}
		}
	});

	_.each(img, function (tag){
		var src = $(tag).attr('src');
		if (src) {
			var base = Utility.parseUri(src)
			if (base.host === options.urls.analyticUrl){
				obj.impressionTag = src
			}
		}
	});

	obj.impressionTag = Utility.parseUri(obj.impressionTag).source;

	if (tests != []) {
		obj.CTATags = _.uniq(tests)
		obj.CTATagA = Utility.parseUri(obj.CTATags[0]).source;
		obj.ClicknDoneTagA = Utility.parseUri(obj.CTATags[0]).queryKey.done;
		obj.CTATagB = Utility.parseUri(obj.CTATags[1]).source;
		obj.ClicknDoneTagB = Utility.parseUri(obj.CTATags[1]).queryKey.done;
	}

	// displayer(obj)
	return obj
};

module.exports.arrange = function(array, next){
	var linkArray = array,
		urlArray = [],
		controls = [],
		treatments = [],
		pages = [];
	_.each(linkArray, function(url){
		var base = url.replace(/(http(s)?:\/\/)|(\/.*){1}/g, '')
		if (base === options.urls.originUrl){
			urlArray.push(url)
			return urlArray
		} 
	})
	console.log(urlArray)
	_.each(urlArray, function(url){
		var resolve = Utility.parseUri(url),
			cmp = function(){
			var c = Utility.getUrlParameter(url, 'deviceProdId')
			return c;
		},
			type = function(){
			var t = Utility.getUrlParameter(url, 'test')
			return t;
		},

			result = {
			url: url,
			status: null,
			type: type().trim()
		};

		if ((result.type) = 22422){
			result.type = 'treatment'
			controls.push(result)
		}  else if ((result.type) === 'a'){ 
			result.type = 'control'
			treatments.push(result)
		}

		console.log(result.url, '\n', result.type);
		pages.push(result);

		if (pages.length === urlArray.length){
			var group = _.groupBy(pages, 'type');
			// console.log('\n>> ' + group.control.length + ' control links detected')
			console.log('>> ' + group.treatment.length + ' treatment links detected')
			console.log('>> calling phantom')
			next(group)
		}
	})
};