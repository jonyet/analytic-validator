# analytic-validator
Quickly (ok, sort-of quickly) spin up a series of parallel phantom instances via node and scrape data. Phantom is used because a lot of this stuff gets done in A/B test format, where javascript serves the treatment (B) data on render...otherwise, we wouldn't need a browser of any type, and i'd do it all with hyperquext. Plenty of room for improvement: would be worthwhile to concat the report csv's logically, perhaps add nodemailer, click automation, image download for validation, etc. Right now, this just keeps you from having to view source during test. run this, then go manually trigger you CTA's and validate your creative/copy.

you'll need to create an options.js file with your desired test url hosts. something like this:
```javascript
/**
 * Copy this file to the name options.js and change the values below to your preferences. The options.js file is in the
 * .gitignore file so that your sensitive information does not get committed to Git.
 */
"use strict";
module.exports = {
	urls: {
		originUrl		: 'www.google.com', //designate your hostname - only lines in the document that have this host will be added to the test array
		analyticUrl		: 'tags.analytics.com' //host name of the tags you want to gather
	}
};

```

**Known Issues**
- when running parallel instances of phantom spoofing as both tablet and mobile user agents, the mobile phantom instances sometimes render tablet results. when mobile is run alone, it works fine.
- lots of stdout noise from phantom. quite irritating.