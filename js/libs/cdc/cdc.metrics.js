define(['jquery', 'core', 'global', 'constants'], function($, core, g, c) {

	/**
	* cdc.metrics.js
	* @fileoverview Encapsulation of metrics capture logic for CDC.
	* @version 1.0.0.0
	* @copyright 2014 Centers for Disease Control
	*/
	
	/** Does global CDC namespace exists? */
	CDC = CDC || {};
	
	/** 
	* @module Metrics
	* @memberof CDC
	* @return {Object}
	*/
	
	CDC.Metrics = (function() {

		var isMicrosite = $('div[data-cdc-microsite]').length > 0;

		var S4 = function () {
			return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
		};
		
		var guid = function () {
			return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
		};

		var captureMetric = function(moduleName, eventName, pageName, sourceUrl, percentViewed) {

			if (typeof moduleName === 'undefined' || moduleName.length === 0) {
				log('Empty moduleName for sourceUrl = "' + sourceUrl + '"');
			}
			if (typeof eventName === 'undefined' || eventName.length === 0) {
				log('Empty eventName for sourceUrl = "' + sourceUrl + '"');
			}

			var c1 = (typeof sourceUrl !== 'undefined') ? sourceUrl.replace('\t', '').replace('\r', '').replace('\n', '') : '';
			var c2 = document.title.replace('\t', '').replace('\r', '').replace('\n', '');
			var c3 = window.location.hostname;
			var c8 = isMicrosite ? 'Microsite' : 'Stand-Alone Module';
			var c16 = window.location.href;
			var c61 = 'Ebola Microsite';
			var c62 = percentViewed;
			var c64 = eventName.replace('\t', '').replace('\r', '').replace('\n', '');
			var c65 = moduleName.replace('\t', '').replace('\r', '').replace('\n', '');
			var pageName = pageName.replace('\t', '').replace('\r', '').replace('\n', '');
			var channel = 'Microsite';

			var url = '//tools.cdc.gov/metrics.aspx' + 
				'?reportsuite=' + g.settings.metricsReportSuite + 
				'&c1=' + encodeURIComponent(c1) + 
				'&c2=' + encodeURIComponent(c2) + 
				'&c8=' + encodeURIComponent(c8) + 
				'&c64=' + encodeURIComponent(c64) + 
				'&hostname=' + encodeURIComponent(c3) + 
				'&channel=' + encodeURIComponent(channel) + 
				'&ContentTitle=' + encodeURIComponent(pageName) +
				((sourceUrl && sourceUrl.length > 0) ? '&url=' + encodeURIComponent(sourceUrl) : '') + 
				'&urlreferrer=' + encodeURIComponent(c16) + 
				'&i=' + guid();

			if (isMicrosite) {
				url += '&c61=' + encodeURIComponent(c61);
				url += '&c65=' + encodeURIComponent(c65);
			}

			if (percentViewed) {
				url += '&c62=' + encodeURIComponent(c62);
			}

			var beaconId = 'cdc-metrics-beacon';
			var imageBeacon = $('#' + g.selectors.homePageId + ' img#' + beaconId);
			if (imageBeacon.length === 0) {
				$('#' + g.selectors.homePageId).append($('<img />').attr('id', beaconId).attr('alt', 'metrics image beacon').attr('src', url));
			} else {
				imageBeacon.attr('src', url);
			}
		};

		return {

			/** 
			* @method capturePageLoad
			* @access public
			* @desc Capture the page load event
			* @return {String}
			*/
			captureHomePageLoad: function(sourceUrl) {
				captureMetric(g.events.homePageModule, g.events.homePageView, c.getConstant('micrositeName'), sourceUrl, null);
			},

			/** 
			* @method captureLinkClick
			* @access public
			* @desc Capture a link click event
			* @return {String}
			*/
			captureLinkClick: function(moduleName, pageName, sourceUrl) {
				captureMetric(moduleName, g.events.contentPageView, pageName, sourceUrl, null);
			},

			/** 
			* @method captureInteraction
			* @access public
			* @desc Capture an interaction event
			* @return {String}
			*/
			captureInteraction: function(moduleName, eventName, pageName, sourceUrl) {
				captureMetric(moduleName, eventName, pageName, sourceUrl, null);
			},

			/** 
			* @method captureMediaInteraction
			* @access public
			* @desc Capture an interaction event for video or audio
			* @return {String}
			*/
			captureMediaInteraction: function(moduleName, eventName, pageName, sourceUrl, percentViewed) {
				captureMetric(moduleName, eventName, pageName, sourceUrl, percentViewed);
			}

		}
	})();

	return CDC.Metrics;

});
