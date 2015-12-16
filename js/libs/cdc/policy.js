/**
* policy.js
* @fileoverview External Links and Non-HTML Documents
* @version 1.0.0.0
* @copyright 2013 Centers for Disease Control
*/
define(['jquery', 'underscore', 'global', 'constants'], function($, _, g, c) {

	/** Does global CDC namespace exists? */
	CDC = CDC || {};
	
	/**
	* @module Policy
	* @memberof CDC
	*/
	CDC.Policy = {};
	
	/**
	* @module External
	* @memberof Policy
	* @param {object} $ - jQuery object
	* @param {object} w - window object
	* @param {object} _ - underscore object
	* @param {object} g - CDC.Global object
	* @param {object} c - CDC.Constants
	*/
	CDC.Policy.External = CDC.Policy.External || (function ($, w, _, g, c) {
		'use strict';
		/*global log:false */
		var config = {
			externalLink: ['<a href="'+ c.getExternalLink() +'" class="external"></a>'].join('')		
		};

		/**
		* @function setupDisplay
		* @access private
		* @desc Add external link icon on an element
		*/
		var setupDisplay = function (elem) {
			elem.find('a:external').attr({target: '_blank', title: c.getExternalIconTitle()}).after(config.externalLink);
		};
	
		return {
			/** 
			* @method init
			* @access public
			* @desc Initialize policy class
			* @param {Object} [c] 
			*/
			init: function (elem, c) {
				//log('external init');
				if (c && typeof(c) === 'object') {
					$.extend(config, c);
				}
				setupDisplay(elem);
			}
		};
	})($, window, _, g, c);


	// Declare an object for handling page links.
	CDC.Policy.Documents = CDC.Policy.Documents || (function ($, w, _, g, c) {
		'use strict';
	
		var config = {};
	
		// A class used to define the image and attributes associated with a particular file extension.
		function PluginDefinition(fileExtension, imageClass, imageAlt, legendClass) {
			this.fileExtension = fileExtension;
			this.imageClass = imageClass;
			this.imageAlt = imageAlt;
			this.legendClass = legendClass;
		}
	
		var PluginDefinitions = new Array(
		new PluginDefinition('.pdf', 'pdf', 'Adobe PDF file', 'plugin-pdf'),
		new PluginDefinition('.doc', 'word', 'Microsoft Word file', 'plugin-word'),
		new PluginDefinition('.docx', 'word', 'Microsoft Word file', 'plugin-word'),
		new PluginDefinition('.rtf', 'word', 'Microsoft Word file', 'plugin-text'),
		new PluginDefinition('.txt', 'txt', 'Microsoft Word file', 'plugin-text'),
		new PluginDefinition('.xls', 'excel', 'Microsoft Excel file', 'plugin-excel'),
		new PluginDefinition('.xlsx', 'excel', 'Microsoft Excel file', 'plugin-excel'),
		new PluginDefinition('.csv', 'excel', 'Microsoft Excel file', 'plugin-excel'),
		new PluginDefinition('.ppt', 'ppt', 'Microsoft PowerPoint file', 'plugin-ppt'),
		new PluginDefinition('.pptx', 'ppt', 'Microsoft PowerPoint file', 'plugin-pptx'),
		new PluginDefinition('.avi', 'wmv', 'Audio/Video file', 'plugin-wmv'),
		new PluginDefinition('.mp3', 'wmv', 'Audio/Video file', 'plugin-wmv'),
		new PluginDefinition('.mp4', 'wmv', 'Audio/Video file', 'plugin-wmv'),
		new PluginDefinition('.mpg', 'wmv', 'Audio/Video file', 'plugin-wmv'),
		new PluginDefinition('.mpeg', 'wmv', 'Audio/Video file', 'plugin-wmv'),
		new PluginDefinition('.wmv', 'wmv', 'Audio/Video file', 'plugin-wmv'),
		new PluginDefinition('.wav', 'wmv', 'Audio/Video file', 'plugin-wmv'),
		new PluginDefinition('.wma', 'wmv', 'Audio/Video file', 'plugin-wmv'),
		new PluginDefinition('.aiff', 'wmv', 'Audio/Video file', 'plugin-wmv'),
		new PluginDefinition('.aaf', 'wmv', 'Audio/Video file', 'plugin-wmv'),
		new PluginDefinition('.zip', 'zip', 'Zip Archive file', 'plugin-zip'),
		new PluginDefinition('.cab', 'zip', 'Zip Archive file', 'plugin-zip'),
		new PluginDefinition('.ram', 'rp', 'RealPlayer file', 'plugin-real'),
		new PluginDefinition('.rmm', 'rp', 'RealPlayer file', 'plugin-real'),
		new PluginDefinition('.ra', 'rp', 'RealPlayer file', 'plugin-real'),
		new PluginDefinition('.rax', 'rp', 'RealPlayer file', 'plugin-real'),
		new PluginDefinition('.rv', 'rp', 'RealPlayer file',  'plugin-real'),
		new PluginDefinition('.rvx', 'rp', 'RealPlayer file', 'plugin-real'),
		new PluginDefinition('.rm', 'rp', 'RealPlayer file', 'plugin-real'),
		new PluginDefinition('.rms', 'rp', 'RealPlayer file', 'plugin-real'),
		new PluginDefinition('.mov', 'qt', 'Apple QuickTime file', 'plugin-qt'),
		new PluginDefinition('.m4v', 'qt', 'Apple QuickTime file', 'plugin-qt'),
		new PluginDefinition('.qt', 'qt', 'Apple QuickTime file', 'plugin-qt'),
		new PluginDefinition('.epub', 'ebook', 'eBook file', 'plugin-epub'),
		new PluginDefinition('.mobi', 'ebook', 'eBook file', 'plugin-epub'),
		new PluginDefinition('.azw', 'ebook', 'eBook file', 'plugin-epub'),
		new PluginDefinition('.iba', 'ebook', 'eBook file', 'plugin-epub'),
		new PluginDefinition('.bbeb', 'ebook', 'eBook file', 'plugin-epub'),
		new PluginDefinition('.prc', 'ebook', 'eBook file', 'plugin-epub'),
		new PluginDefinition('.ris', 'ris', 'RIS file', 'plugin-ris')	
		);
	
		var PluginDefinitionsEsp = new Array(
		new PluginDefinition('.pdf', 'pdf', 'Archivo PDF', 'plugin-pdf'),
		new PluginDefinition('.doc', 'word', 'Archivo de Microsoft Word', 'plugin-word'),
		new PluginDefinition('.docx', 'word', 'Archivo de Microsoft Word', 'plugin-word'),
		new PluginDefinition('.txt', 'txt', 'Archivo de Text', 'plugin-text'),
		new PluginDefinition('.rtf', 'txt', 'Archivo de Text', 'plugin-tesxt'),
		new PluginDefinition('.xls', 'excel', 'Archivo de Microsoft Excel', 'plugin-excel'),
		new PluginDefinition('.xlsx', 'excel', 'Archivo de Microsoft Excel', 'plugin-excel'),
		new PluginDefinition('.csv', 'excel', 'Archivo de Microsoft Excel', 'plugin-excel'),
		new PluginDefinition('.ppt', 'ppt', 'Archivo de Microsoft PowerPoint', 'plugin-ppt'),
		new PluginDefinition('.pptx', 'ppt', 'Archivo de Microsoft PowerPoint', 'plugin-pptx'),
		new PluginDefinition('.avi', 'wmv', 'Archivo de audio o video', 'plugin-wmv'),
		new PluginDefinition('.mp3', 'wmv', 'Archivo de audio o video', 'plugin-wmv'),
		new PluginDefinition('.mp4', 'wmv', 'Archivo de audio o video', 'plugin-wmv'),
		new PluginDefinition('.mpg', 'wmv', 'Archivo de audio o video', 'plugin-wmv'),
		new PluginDefinition('.mpeg', 'wmv', 'Archivo de audio o video', 'plugin-wmv'),
		new PluginDefinition('.wmv', 'wmv', 'Archivo de audio o video', 'plugin-wmv'),
		new PluginDefinition('.wav', 'wmv', 'Archivo de audio o video', 'plugin-wmv'),
		new PluginDefinition('.wma', 'wmv', 'Archivo de audio o video', 'plugin-wmv'),
		new PluginDefinition('.aiff', 'wmv', 'Archivo de audio o video', 'plugin-wmv'),
		new PluginDefinition('.aaf', 'wmv', 'Archivo de audio o video', 'plugin-wmv'),
		new PluginDefinition('.zip', 'zip', 'Archivo en formato zip', 'plugin-zip'),
		new PluginDefinition('.cab', 'zip', 'Archivo en formato zip', 'plugin-zip'),
		new PluginDefinition('.ram', 'rp', 'Archivo de RealPlayer', 'plugin-real'),
		new PluginDefinition('.rmm', 'rp', 'Archivo de RealPlayer', 'plugin-real'),
		new PluginDefinition('.ra', 'rp', 'Archivo de RealPlayer', 'plugin-real'),
		new PluginDefinition('.rax', 'rp', 'Archivo de RealPlayer', 'plugin-real'),
		new PluginDefinition('.rv', 'rp', 'Archivo de RealPlayer', 'plugin-real'),
		new PluginDefinition('.rvx', 'rp', 'Archivo de RealPlayer', 'plugin-real'),
		new PluginDefinition('.rm', 'rp', 'Archivo de RealPlayer', 'plugin-real'),
		new PluginDefinition('.rms', 'rp', 'Archivo de RealPlayer', 'plugin-real'),
		new PluginDefinition('.mov', 'qt', 'Archivo de Apple QuickTime', 'plugin-qt'),
		new PluginDefinition('.m4v', 'qt', 'Archivo de Apple QuickTime', 'plugin-qt'),
		new PluginDefinition('.qt', 'qt', 'Archivo de Apple QuickTime', 'plugin-qt'),
		new PluginDefinition('.epub', 'ebook', 'Archivo de eBook', 'plugin-epub'),
		new PluginDefinition('.mobi', 'ebook', 'Archivo de eBook', 'plugin-epub'),
		new PluginDefinition('.azw', 'ebook', 'Archivo de eBook', 'plugin-epub'),
		new PluginDefinition('.iba', 'ebook', 'Archivo de eBook', 'plugin-epub'),
		new PluginDefinition('.bbeb', 'ebook', 'Archivo de eBook', 'plugin-epub'),
		new PluginDefinition('.prc', 'ebook', 'Archivo de eBook', 'plugin-epub'),
		new PluginDefinition('.ris', 'ris', 'Archivo RIS', 'plugin-ris')	
		);
	
		// A helper method to add the non-HTML image to the link.
		var AddNonHtmlImage = function (anchor, definitionArray) {
			var href = anchor.attr('href');
			if (href && !anchor.hasClass('noDecoration')) {
				href = href.toLowerCase();
				var hash = href.indexOf('#');
				if (hash > -1) {
					href = href.substring(0, hash);
				}
				if (!(href.endsWith('.htm') || href.endsWith('.html') || href.endsWith('/'))) {
					// Get the text of the anchor.
					var anchorContent = anchor.html();
	
					// Find out where the location of the '[' is. If not found the image will be placed at the end.
					// Strip out any comments before looking for bracket -- just in case.
					anchorContent = anchorContent.replace(/<!(?:--[\s\S]*?--\s*)?>\s*/g, '');
					var bracketPos = anchorContent.lastIndexOf('[');
	
					// Now determine what image should be displayed based on the href attribute.
					for (var i = 0; i < definitionArray.length; i++) {
						if (href.endsWith(definitionArray[i].fileExtension.toLowerCase())) {
							anchor.addClass('nonHtml noDecoration plugin');
							// Replace the inner HTML with the image included.
							if (bracketPos === -1) {
								if (anchor.hasClass("noIcon")) {
									anchor.html('<span class="tp-label">' + anchorContent.trim() + '</span>');
									anchor.removeClass('nonHtml');
									anchor.addClass('noDecoration plugin');
								} else {
									anchor.html('<span class="tp-label">' + anchorContent.trim() + '</span>' + //'&nbsp;' +
									'<span class="sprite-16-' + definitionArray[i].imageClass + '" alt="' + definitionArray[i].imageAlt + '">' + '</span>');
								}
							} else {
								anchor.html('<span class="tp-label">' + anchorContent.substring(0, bracketPos).trim() + '</span>' +
								'<span class="tp-size"><span class="sprite-16-' + definitionArray[i].imageClass + '" alt="' + definitionArray[i].imageAlt + '"></span>' + anchorContent.substring(bracketPos) +
								'</span>');
							}
	
							// Turn on the corresponding list item in the legend.
							$('#plugin-legend li.' + definitionArray[i].legendClass).addClass('pluginOn');
	
							break;
						}
					}
				}
			}
		};
	
		//
		// This function modifies content links to documents (e.g., Word, Powerpoint, etc.) so that they are
		// rendered with the appropriate image.  It also displays the document legend on the page if any document
		// links are on the page.
		//
		var setupDisplay = function (elem) {

			var pluginsEnabled = (!$('body').hasClass('noPlugins') ? true : false);
	
			if (pluginsEnabled) {
				var definitionArray,
					linkPolicyUrl = c.getExternalLink();
	
				definitionArray = PluginDefinitions;
	
				if (c.getLanguageCode() == 'es-us') {
					definitionArray = PluginDefinitionsEsp;
				}

				// Fix the external anchors (which can exclude root-relative, javascript, mailto, and jump links).
				elem.find('a:not([class*="noDecoration"],[href^="mailto:"],[href^="javascript:"],[href^="#"])').each(function () {
					AddNonHtmlImage($(this), definitionArray);
				});

				// Now display the plugin legend if any of the anchors have the .plugin class assigned.
				if (elem.find('a.plugin').length > 0) {
					// Show the legend
					$('#plugin-legend').removeClass('pluginOff');
					$('#plugin-legend').addClass('pluginOn');
				} else {
					$('#plugin-legend').addClass('pluginOff');
					$('#plugin-legend').removeClass('pluginOn');
				}
			}
		};
	
		return {
			init: function (elem, c) {
				//log('policy init for ' + elem);
				if (c && typeof(c) === 'object') {
					$.extend(config, c);
				}
				setupDisplay(elem);
			},
			// A public method that can be used to add entries to the plugin definition list.
			addPluginDefinition: function (fileExtension, imageSrc, imageAlt, imageTitle, legendClass) {
				PluginDefinitions[PluginDefinitions.length] = new PluginDefinition(fileExtension, imageSrc, imageAlt, imageTitle, legendClass);
			},
			addPluginDefinitionEsp: function (fileExtension, imageSrc, imageAlt, imageTitle, legendClass) {
				PluginDefinitionsEsp[PluginDefinitionsEsp.length] = new PluginDefinition(fileExtension, imageSrc, imageAlt, imageTitle, legendClass);
			}
		}; // end return
	
	})($, window, _, g, c);

	return CDC.Policy;

});
