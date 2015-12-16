define(['jquery'], function($) {

	/**
	 * global.js
	 * @fileoverview Global variables used to enable/disable or set parameters used elsewhere in the application
	 * @version 1.0
	 * @copyright 2013 Centers for Disease Control
	 */
	/** Does global CDC namespace exists? */
	CDC = CDC || {};
	
	/** 
	 * @module Global
	 * @memberof CDC
	 */
	CDC.Global = {
		/** list of all the common selectors in the microsite */
		selectors: {
			micrositeId: 'ebola',
			homePageId: 'cdc-microsite-home-page',
			contentPageId: 'cdc-microsite-content-page',
			contentPlaceholderId: 'cdc-microsite-content-placeholder',
			loadingIndicatorBlockId: 'loading-indicator',
			contentNotAvailableId: 'cdc-microsite-content-not-available',
			menuId: 'cdc-microsite-nav',
			relocateContentClass: 'cdc-microsite-relocate'
		},
		/** any assets used in the app should be referenced here. */
		elements: {
		},
		/** variables used throughout the application **/
		variables: {
			moduleLoadCount: 0,	// Used to track when all modules have been loaded on microsite.
			//domainsToIgnoreExternalLink: ['cdc.gov','facebook.com','twitter.com','linkedin.com','pinterest.com','youtube.com','plus.google.com','instagram.com','flickr.com','vimeo.com'],
			domainsToIgnoreExternalLink: ['facebook.com','twitter.com','linkedin.com','pinterest.com','youtube.com','plus.google.com','instagram.com','flickr.com','vimeo.com'],
			patternForDomain: /^(ftp|https?)?:?\/\/([^\/?#]+)/i
		},
		settings: {
			apiRoot: CDC.Microsite.apiRoot,
			apiFeedRoot: CDC.Microsite.apiFeedRoot,
			apiTwitterFeedRoot: CDC.Microsite.apiTwitterFeedRoot,
			apiMediaPath: '/api/v2/resources/media/',
			apiFeedPath: '/syndication/feed.aspx?feedId=',
			apiTwitterFeedPath: '/podcasts/feed.asp?feedid=',
			metricsReportSuite: 'devcdc',
			defaultLanguageCode: 'en-us',
			enableExternalLinkIcons: false,
			enableFileIcons: true,
			displayFileIconLegend: false,
			enableInterstitialPage: false,
			enableLanguageSupport: false,
			defaultIcon: 'fa-user-md'
		},
		events: {
			homePageUrl: 'http://www.cdc.gov/vhf/ebola',
			homePageModule: 'Home',
			homePageView: 'Microsite: view',
			contentPageView: 'Content: browse'
		}
	};

	return CDC.Global;

});
