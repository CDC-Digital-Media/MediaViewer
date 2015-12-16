/**
 * core.js
 * @fileoverview This file should house code snippets that are core to the application and unlikely to change, i.e libs, frameworks, etc.
 * @version 1.0.0.0
 * @copyright 2013 Centers for Disease Control
 */
define(['jquery', 'global'], function($, g) {

	/** 
	* New CDC namespace for responsive templates to avoid any possible clash with existing template scripts
	* @namespace CDC
	*/
	var CDC = CDC || {};
	
	/** 
	* Application Logging
	* @function log
	*/
	window.log = function () {
		'use strict';
		if(CDC.getHostName() in {'www.cdc.gov': 1,'cdc.gov': 1}) { return; }
	
		log.history = log.history || [];
		log.history.push(arguments);
	
		if (window.console) {
			console.log(Array.prototype.slice.call(arguments));
		}
	};
	
	
	/** 
	* Aditional STRING manipulation function: Trim white space from left and right side of a string
	* @function {String}.trim();
	* @return {string} Trimmed string
	*/
	String.prototype.trim = function () {
		'use strict';
		return this.replace(/^\s+|\s+$/g, '');
	};
	
	/** 
	* Aditional STRING manipulation function: Trim white space from left side of a string
	* @function {String}.lTrim();
	* @returns {string} Trimmed string
	*/
	String.prototype.lTrim = function () {
		'use strict';
		return this.replace(/^\s+/g, '');
	};
	
	/** 
	* Aditional STRING manipulation function: Trim white space from right side of a string
	* @function {String}.rTrim();
	* @return {string} Trimmed string
	*/
	String.prototype.rTrim = function () {
		'use strict';
		return this.replace(/\s+$/g, '');
	};
	
	/** 
	* Aditional STRING manipulation function: Get sub-string of size {len} starting from the beggining of a string
	* @function {String}.left()
	* @param {integer} len
	* @returns {string} Sub-string
	*/
	String.prototype.left = function (len) {
		'use strict';
		return (len > this.length) ? this : this.substring(0, len);
	};
	
	/** 
	* Aditional STRING manipulation function: Get sub-string of size {len} starting from the end of a string
	* @function {String}.right()
	* @param {integer} len
	* @returns {string} Sub-string
	*/
	String.prototype.right = function (len) {
		'use strict';
		if(arguments.length) {
			return (len > this.length) ? this : this.substring(this.length - len);
		}
	};
	
	/** 
	* Additional STRING manipulation function: Check to see if a string begins with string value {t}
	* @function {String}.beginsWith();
	* @param {string} s
	* @returns {boolean} True or false 
	*/
	String.prototype.beginsWith = function (s) {
		'use strict';
		if(arguments.length) {
			return (s.toLowerCase() === this.substring(0, s.length).toLowerCase());	
		}
	};
	
	/** 
	* Additional STRING manipulation function: Check to see if a string ends with string value {t}
	* @function {String}.endsWith();
	* @param {string} s
	* @returns {boolean} True or false 
	*/
	if (typeof String.prototype.endsWith !== 'function') {
		String.prototype.endsWith = function (s) {
			'use strict';
			if(arguments.length) {
				return (s.toLowerCase() === this.substring(this.length - s.length).toLowerCase());
			}
		};
	}
	
	/**
	 * Boolean validation function (may be pointless!)
	 * @function {Variable}.bool()
	 * @param {Unknown Variable} s
	 * @returns {boolean} True or false 
	 */
	if(typeof String.prototype.bool !== 'function') {
		String.prototype.bool = function() {
			'use strict';
			return (/^true$/i).test(this);
		};
	}

	if(typeof Object.size !== 'function') {
		Object.size = function(obj) {
			var size = 0, key;
			for (key in obj) {
				if (obj.hasOwnProperty(key)) size++;
			}
			return size;
		};
	}

	/** 
	* Get real dimensions of an image
	* @function CDC.getImageDimensions(image url);
	* @param {selector} img
	* @return {array} Width and Height 
	*/
	CDC.getImageDimensions = function (img) {
		'use strict';
		var i = $(img)[0],
			w,
			h;
		$('<img/>').attr('src', i.src).load(function () {
			w = this.width;
			h = this.height;
	
		});
		return [].push.apply(w, h);
	};
	
	/**
	 * Get the domain name from a url string
	 * @function CDC.getDomain(urlstring)
	 * @param  {string} url 		A url string, such as "http://www.facebook.com/CDC"
	 * @return {string}     		The value of the match if found
	 */
	CDC.getDomain = function(url) {
		var matches = url.match(g.variables.patternForDomain);
		
		return matches[matches.length - 1];
	};
	
	/**
	 * Get the host name from a URL string or the default hostname property of the location object
	 * TODO: evaluate need for CDC.getDomain() since this seems far more elegant
	 * @param  {string} path 		Optional URL parameter
	 * @return {string}      		The host name without port information
	 */
	CDC.getHostName = function(path) {
		var p = '';
	
		if(path) {
			// create an anchor object to use the default hostname property of the location object
			var a = document.createElement('a');
				a.href = path;
			p = a.hostname;
		}
		else {
			// use the default hostname
			p = window.location.hostname;
		}
	
		return p;
	};
	
	$.expr[':'].parents = function(a,m){
			return $(a).parents(m[3]).length < 1;
	};
		
	$.expr[':'].external = function (a) {
		var pattern = g.variables.patternForDomain,
			href = $(a).attr('href'),
			matches = '',
			dom = g.variables.domainsToIgnoreExternalLink,
			found = false;
	
		// immediately bail if we see any of the following
		if(href === undefined || href.substring(0,1) === '#' || href.substring(0,7) === 'mailto:') { 
			return;
		}
		else {
			matches = href.match(pattern);
			///TemplatePackage, etc..
			if(matches === null) {
				return;	
			}
		}
	
		// bail if the domain is found in our exlusions list
		$.each(dom, function(i,d){
			if(CDC.getDomain(href).indexOf(d) >= 0) {
				found = true;
				return false;
			}  
		});
	
		return !found && $(a).parents().filter('.no-link').length === 0 && $(a).parents().filter('.noLinking').length === 0 && !$(a).hasClass('no-link') && !$(a).hasClass('noLinking');
	};
	
	$.expr[':'].internal = function (a) {
		return $(a).attr('href') !== undefined && !$.expr[':'].external(a);
	};
	
	$.expr[':'].extension = function (a) {
	    return a.href.split('/').pop().match(/\.([a-zA-Z0-9]{2,4})([#;\?]|$)/);
	}
		
	/** 
	* Get File name from path
	* @function CDC.getFileNameFromPath()
	* @param {string} path
	* @return {string} Filename of a given path
	*/
	CDC.getFileNameFromPath = function (path) {
		'use strict';
		path = path.split('/');
		return path[path.length - 1];
	};
	
	/** 
	* Get current pathname
	* @function CDC.getPathName()
	* @return {string} pathname from current path without hashtags or querystrings
	*/
	CDC.getPathName = function(path) { 
		var p = '';
	
		// http://tools.ietf.org/html/rfc3986#section-4.1
		if(path) {
			p = path.split('?')[0].split('#')[0];
		}
		else {
			p = window.location.pathname;
		}
		return p;
	};
	
	/**
	 * CDC.getSearch(path, removeNotation)
	 * Takes zero or more parameters, and returns query string
	 * @param  {string} path           		optional URL with query string tag
	 * @param  {boolean} removeNotation 	optional value to remove query string from return value
	 * @return {string}                		query string tag value with or without notation
	 */
	CDC.getSearch = function(path, removeNotation) {
		var p = '',
			b = (typeof removeNotation === 'undefined') ? false : removeNotation,
			args = arguments;
	
		// if any arguments have been passed
		if(args) {
			// if there's only one argument, and it's a boolean
			if(args.length === 1 && (typeof args[0] === 'boolean')) {
				b = (typeof path === 'undefined') ? false : path;	// path is removeNotation at this point
				path = window.location.search;
			}
		}
		
		// if the path was passed
		if(path) {
			// retain the notation, and split
			p = '?' + path.split('?')[1];
		}
		else {
			// just use the location object
			p = window.location.search;
		}
	
		// if we're removing the notation (?)
		if(b) {
			p = p.substr(1);
		}
	
		return p;
	};
	
	/**
	 * CDC.getHash(path, removeNotation)
	 * Takes zero or more parameters, and returns hash tag
	 * @param  {string} path           		optional URL with hash tag
	 * @param  {boolean} removeNotation 	optional value to remove hash from return value
	 * @return {string}               		hash tag value with or without notation
	 */
	CDC.getHash = function (path, removeNotation) { 
		var p = '',
			b = (typeof removeNotation === 'undefined') ? false : removeNotation,
			args = arguments;
	
		// if any arguments have been passed
		if(args) {
			// if there's only one argument, and it's a boolean
			if(args.length === 1 && (typeof args[0] === 'boolean')) {
				b = (typeof path === 'undefined') ? false : path;	// path is removeNotation at this point
				path = window.location.hash;
			}
		}
		
		// if the path was passed
		if(path) {
			// retain the notation, and split
			p = '#' + path.split('#')[1];
		}
		else {
			// just use the location object
			p = window.location.hash;
		}
	
		// if we're removing the notation (#)
		if(b) {
			p = p.substr(1);
		}
	
		return p;
	};
	
	/**
	 * CDC.getFileName(path)
	 * Takes zero or more parameters
	 * @param  {string} path 		optional path parameter, otherwise uses CDC.getPathName() value
	 * @return {string}      		filename from URL path
	 */
	CDC.getFileName = function (path) {
		'use strict';
		var p = '', 
			ar = [],
			filename = '';
	
		p = path ? path : CDC.getPathName();
		ar = p.split('/');
		
		// if the url doesn't end in a slash
		if(!p.endsWith('/')) {
			// if there's a dot in the last array, it's *probably* a file name
			if(ar[ar.length - 1].indexOf('.') > -1) {
				filename = ar[ar.length - 1];
			}
		}
	
		return filename;
	};
	
	/** 
	* Get querystring parameter indexed by name (e.g., CDC.qs['param']).
	* @function CDC.qs['param']
	* @return {string} Querystring parameter value associated with index name.
	*/
	CDC.qs = (function(a) {
		if (a === '') { return; }
		var b = {};
		for (var i = 0; i < a.length; ++i) {
			var p=a[i].split('=');
			if (p.length !== 2) { continue; }
			b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, ' '));
		}
		return b;
	})(window.location.search.substr(1).split('&'));
	
	
	/** 
	* Try to detect if we're on a mobile device using UA
	* @function CDC.isMobile
	* @param {string} UA,vendor or opera
	* @http://detectmobilebrowsers.com/
	* @return {bool}
	*/
	//TODO: http://api.jquery.com/jquery.browser/ jQuery.browser is deprecated, and no longer available in 1.9+
	CDC.isMobile = function (a) {
		return (jQuery.browser = jQuery.browser || {}).mobile = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4));
	}(navigator.userAgent || navigator.vendor || window.opera);
	
	//http://stackoverflow.com/questions/4574940/settimeout-with-zero-delay-used-often-in-web-pages-why/4575011#4575011
	CDC.loadMethod = function(m) {
		log(typeof m);
		setTimeout(m, 0);
	};
	
	CDC.parseJsonDate = function(dateString) {
	    var milli = dateString.replace(/\/Date\((-?\d+)\)\//, '$1');
	    var date = new Date(parseInt(milli));
	    return date;
	};
	
	CDC.getIcon = function(category) {
		var currentIcon;
		switch(category) {
			case 'HealthCareWorkers':
				currentIcon = 'fa-user-md';
				break;
			case 'Guidance':
				currentIcon = 'fa-hospital-o';
				break;
			case 'Training':
				currentIcon = 'fa-medkit';
				break;
			case 'Definitions':
				currentIcon = 'fa-flask';
				break;
			case 'Travel':
				currentIcon = 'fa-plane';
				break;
			case 'COCA':
				currentIcon = 'fa-phone';
				break;
			case 'FAQ':
				currentIcon = 'fa-question-circle';
				break;
			default:
				log('did not find VisualCategory "' + category + '" in list');
				currentIcon = 'fa-user-md';
		}
		return currentIcon;
	};

	return CDC;

});
