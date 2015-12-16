define(['jquery', 'global', 'policy'], function($, g, policy) {
	'use strict';

	var defaults = {
		contentId: -1,
		requestClassIds: 'syndicate',
		requestElementIds: '',
		requestXPath: '',
		cssClass: 'csHtmlContent',
		stripScripts : 1,
		stripAnchorTags : 0,
		stripImages : 0,
		stripComments : 1,
		stripInlineStyles : 1,
		imagePlacement : 'none',
		postProcess : '',
		outputFormat : 'XHTML',
		outputEncoding : 'UTF-8',
		nameSpace : '',
		enableExternalLinkIcons: g.settings.enableExternalLinkIcons,
		enableFileIcons: g.settings.enableFileIcons,
		newWindow : false
	};

	// funtion //////////////////////////
	$.fn.htmlContent = function(options) {

		options = $.extend({}, defaults, options);

		if (options.contentId === -1){ alert('No Media Id was specified.'); return; }

		options.target = options.target ? options.target : $(this);

		var format = options.outputFormat === 'XML' ? '.xml' : '/';
		var url = g.settings.apiRoot + g.settings.apiMediaPath + options.contentId + '/syndicate' + format;

		var paramPrefix = '?';
		//set values for anything not set as default -
		if (!options.stripScripts) {
			url += paramPrefix + 'stripScripts=' + options.stripScripts;
			paramPrefix = '&';
		}
		if (options.stripAnchorTags) {
			url += paramPrefix + 'stripAnchors=' + options.stripAnchorTags;
			paramPrefix = '&';
		}
		if (options.stripImages) {
			url += paramPrefix + 'stripImages=' + options.stripImages;
			paramPrefix = '&';
		}
		if (!options.stripComments) {
			url += paramPrefix + 'stripComments=' + options.stripComments;
			paramPrefix = '&';
		}
		if (!options.stripInlineStyles) {
			url += paramPrefix + 'stripStyles=' + options.stripInlineStyles;
			paramPrefix = '&';
		}
		if (options.imagePlacement !== 'none') {
			url += paramPrefix + 'imagePlacement=' + options.imagePlacement;
			paramPrefix = '&';
		}
		if (options.nameSpace) {
			url += paramPrefix + 'ns=' + options.nameSpace;
			paramPrefix = '&';
		}
		if (options.newWindow) {
			url += paramPrefix + 'nw=' + (options.newWindow ? '1' : '0');
			paramPrefix = '&';
		}
		if (options.outputFormat !== 'XML') {
			url += paramPrefix + 'callback=?';
		}

		$.ajax({
			url: url,
			dataType: 'jsonp'
		})
		.done(function (response) {

			$(options.target).removeClass().addClass(options.cssClass).addClass('id_' + options.contentId);
			$(options.target).html(response.results.content);

			if (options.enableExternalLinkIcons) {
				policy.External.init($(options.target));
			}
			if (options.enableFileIcons) {
				policy.Documents.init($(options.target));
			}

			var func = options.postProcess;
			if (typeof func === 'function') { func(); }

		})
		.fail(function(xhr, ajaxOptions, thrownError) {
			log(xhr.status);
			log(thrownError);
		});

	};

	return $.fn.htmlContent;

});
