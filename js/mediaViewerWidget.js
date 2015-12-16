// Setting up some basic configuration settings for the whole app.
var CDC = CDC || {};
CDC.Microsite = CDC.Microsite || {};
CDC.Microsite.testing = false;
CDC.Microsite.version = 'v1.0.8.8';
CDC.Microsite.embedHostName = CDC.Microsite.testing ? window.location.host : 'yourmediaviewerserver.gov';
CDC.Microsite.hostName = CDC.Microsite.testing ? window.location.host : ((window.location.protocol !== 'https:') ? 'yourmediaviewerserver.gov' : 'yourmediaviewerhttpsserver.gov');
CDC.Microsite.folderPath = '/media/viewer/folder/path/';
CDC.Microsite.apiRoot = CDC.Microsite.testing ? '//yourcontentservicestestserver.gov' : ((window.location.protocol !== 'https:') ? '//yourcontentservicesserver.gov' : '//yourcontentserviceshttpsserver.gov');
CDC.Microsite.apiFeedRoot = CDC.Microsite.testing ? '//yourcontentservicestestserver.gov' : ((window.location.protocol !== 'https:') ? '//yourcontentservicesserver.gov' : '//yourcontentserviceshttpsserver.gov');
CDC.Microsite.apiTwitterFeedRoot = CDC.Microsite.testing ? '//yourtwitterfeedtestingserver.gov' : '//yourtwitterfeedserver.gov';
CDC.Microsite.noConflict = (typeof CDC.Microsite.noConflict !== 'undefined') ? CDC.Microsite.noConflict : false;

(function() {

	// ----------------------------------------------------------
	// A short snippet for detecting versions of IE in JavaScript
	// without resorting to user-agent sniffing
	// ----------------------------------------------------------
	// If you're not in IE (or IE version is less than 5) then:
	//     ie === undefined
	// If you're in IE (>=5) then you can determine which version:
	//     ie === 7; // IE7
	// Thus, to detect IE:
	//     if (ie) {}
	// And to detect the version:
	//     ie === 6 // IE6
	//     ie > 7 // IE8, IE9 ...
	//     ie < 9 // Anything less than IE9
	// ----------------------------------------------------------
	
	// UPDATE: Now using Live NodeList idea from @jdalton
	
	var ie = (function(){
	
	    var undef,
	        v = 3,
	        div = document.createElement('div'),
	        all = div.getElementsByTagName('i');
	    
	    while (
	        div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
	        all[0]
	    );
	    
	    return v > 4 ? v : undef;
	    
	}());

	if(!Array.isArray) {
		Array.isArray = function (vArg) {
			return Object.prototype.toString.call(vArg) === "[object Array]";
		};
	}

	function cssLoaded(href) {
		var cssFound = false;
		for (var i = 0; i < document.styleSheets.length; i++) {
			try {
				var sheet = document.styleSheets[i];
				if (sheet && sheet['href'] && sheet['href'].indexOf(href) >= 0 && sheet['cssRules'] && sheet['cssRules'].length > 0) {
					cssFound = true;
				}
			} catch (e) {
				cssFound = true;
			}
		};
		return cssFound;
	}

	var head = document.getElementsByTagName('head')[0];
	var micrositeStyleSheet;
	var bsVersion = ( (typeof $ !== 'undefined' && typeof $.fn !== 'undefined' && typeof $.fn.typeahead !== 'undefined') ? '2.x' : '3.x' );
	if (cssLoaded('/TemplatePackage/3.0/css/lib/bootstrap24.css') && !CDC.Microsite.noConflict) {
		// CDC.gov templates using 2.x Bootstrap -- need to load 3.x bootstrap plus our adjustment CSS.
		micrositeStyleSheet = document.createElement('link');
		micrositeStyleSheet.setAttribute('rel', 'stylesheet');
		micrositeStyleSheet.setAttribute('type', 'text/css');
		micrositeStyleSheet.setAttribute('href', '//' + CDC.Microsite.hostName + CDC.Microsite.folderPath + 'css/cdc_vhf.css?v=' + CDC.Microsite.version);
		head.appendChild(micrositeStyleSheet);
	} else if (cssLoaded('/bootstrap.min.css') && bsVersion !== '3.x' && !CDC.Microsite.noConflict) {
		// Somebody else has an older version of Bootstrap loaded on their page.
		micrositeStyleSheet = document.createElement('link');
		micrositeStyleSheet.setAttribute('rel', 'stylesheet');
		micrositeStyleSheet.setAttribute('type', 'text/css');
		micrositeStyleSheet.setAttribute('href', '//' + CDC.Microsite.hostName + CDC.Microsite.folderPath + 'css/libs/bootstrap/3.2.0/bootstrap.min.css');
		head.appendChild(micrositeStyleSheet);
	} else if (!cssLoaded('/bootstrap.min.css') && !CDC.Microsite.noConflict) {
		// No bootstrap as far as we can tell so load ours.
		micrositeStyleSheet = document.createElement('link');
		micrositeStyleSheet.setAttribute('rel', 'stylesheet');
		micrositeStyleSheet.setAttribute('type', 'text/css');
		micrositeStyleSheet.setAttribute('href', '//' + CDC.Microsite.hostName + CDC.Microsite.folderPath + 'css/libs/bootstrap/3.2.0/bootstrap.min.css');
		head.appendChild(micrositeStyleSheet);
	}
	if (!cssLoaded('/font-awesome.min.css')) {
		micrositeStyleSheet = document.createElement('link');
		micrositeStyleSheet.setAttribute('rel', 'stylesheet');
		micrositeStyleSheet.setAttribute('type', 'text/css');
		micrositeStyleSheet.setAttribute('href', '//' + CDC.Microsite.embedHostName + CDC.Microsite.folderPath + 'css/libs/font-awesome/4.1.0/font-awesome.min.css');
		head.appendChild(micrositeStyleSheet);
	}
	if (!cssLoaded('/vhf.css')) {
		micrositeStyleSheet = document.createElement('link');
		micrositeStyleSheet.setAttribute('rel', 'stylesheet');
		micrositeStyleSheet.setAttribute('type', 'text/css');
		micrositeStyleSheet.setAttribute('href', '//' + CDC.Microsite.hostName + CDC.Microsite.folderPath + 'css/vhf.css?v=' + CDC.Microsite.version);
		head.appendChild(micrositeStyleSheet);
	}
})();


requirejs.config({
	baseUrl: '//' + CDC.Microsite.hostName + CDC.Microsite.folderPath + 'js/libs',
	urlArgs: 'bust=' + CDC.Microsite.version,
	paths: {
		app: '../app',
		global: 'cdc/global',
		core: 'cdc/core',
		constants: 'cdc/constants',
		underscore: 'underscore/underscore-min',
		policy: 'cdc/policy',
		templates: 'cdc/cdc.templates',
		htmlContent: 'cdc/cdc.htmlContent',
		feed: 'cdc/cdc.feed',
		twitterFeed: 'cdc/cdc.twitterFeed',
                social: 'cdc/cdc.social',
		flickrFeed: 'cdc/cdc.flickrFeed',
		collection: 'cdc/cdc.collection',
		masterCollection: 'cdc/cdc.masterCollection',
		metrics: 'cdc/cdc.metrics',
		mediaViewer: 'cdc/cdc.mediaViewer',
		moment: 'moment/moment.min',
		jquery: 'jquery/1.11.1/jquery.min',
		'noconflict': 'jquery/1.11.1/noconflict',
		'jquery-address': 'jquery-address/jquery.address-1.5',
		flexslider: 'jquery-flexslider/jquery.flexslider2',
		text: 'require/text',
		Handlebars: 'handlebars/handlebars-v1.3.0',
		HandlebarsExtended: 'cdc/cdc.handlebars.helpers',
		bootstrap: 'bootstrap/3.2.0/bootstrap.min'
	},
	shim: {
		core: {
			deps: ['jquery'],
			exports: 'core'
		},
		constants: {
			deps: ['jquery'],
			exports: 'constants'
		},
		bootstrap: {
			deps: ['jquery']
		},
		flexslider: {
			deps: ['jquery'],
			exports: 'flexslider'
		},
		moment: {
			exports: 'moment'
		},
		Handlebars: {
			deps: ['text'],
			exports: 'Handlebars'
		},
		HandlebarsExtended: {
			deps: ['Handlebars'],
			exports: 'HandlebarsExtended'
		}
	},
	config: {
		moment: {
			noGlobal: true
		}
	},
	map: {
		'*': {
			'jquery': 'noconflict'
		},
		'noconflict': {
			'jquery': 'jquery'
		}
	}
});

// Load the main app module to start the app
requirejs(['app/v1/cdc.mediaViewerWidget']);
