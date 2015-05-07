"use strict"
var fs = require('fs'),
	json2csv = require('json2csv');

module.exports.reporter = function(array, option, type){
	var path = './results/' + type + '_' + option.platform + '_results.csv'
	json2csv({data: array, fields: ['status', 'url', 'type', 'impressionTag', 'CTATagA', 'ClicknDoneTagA', 'CTATagB', 'ClicknDoneTagB'], fieldNames: ['Response', 'URL', 'Type', 'Pixel Tag', 'CTA Tag', 'ClicknDone Tag', 'CTA Tag', 'ClicknDone Tag']}, function(err, csv) {
	  if (err) console.log(err);
	  fs.writeFile((path), csv, function(err) {
	    if (err) throw err;
	    console.log('>> results generated for', option.platform, type, '@' + path);
	  });
	}); 
};

module.exports.displayer = function(obj) {
	console.log('\nA WINNER IS YOU');
	console.log('>> URL tested:', obj.url);
	console.log('>> Pixel Tag:', obj.impressionTag);
	console.log('>> CTA Tag:', obj.CTATagA);
	console.log('>> ClicknDone Tag:', obj.ClicknDoneTagA);
	console.log('>> CTA Tag:', obj.CTATagB);
	console.log('>> ClicknDone Tag:', obj.ClicknDoneTagB);
}