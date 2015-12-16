define(['jquery', 'global', 'moment', 'templates'], function($, g, moment, templates) {
	'use strict';

	var defaults = {
		tagId: '',
		contentId: -1,
		style: 'A',
		cssClass: 'cdc-collection',
		newWindow: false,
		moduleStyle: '',
		linkStyle: 'title',
		linkMoreLabel: '&lt; Learn More',
		headerText: '',
		headerLink: '',
		headerIcon: '',
		moreInfoLink: '',
		moreInfoLabel: 'More',
		showPubDate: true,
		pubDateFormat: 'MMMM DD, YYYY',
		showSummary: true,
		showImages: true,
		showIcons: false,
		enableExternalLinkIcons: g.settings.enableExternalLinkIcons,
		enableFileIcons: g.settings.enableFileIcons,
		maxItems: 0,
		sortBy: '',
		sortDirection: '',
		postProcess: ''
	};

	// funtion //////////////////////////
	$.fn.collection = function(options) {

		options = $.extend({}, defaults, options);
		options.target = options.target ? options.target : $(this);
		if (options.contentId === -1){ alert('No Collection Id was specified.'); return; }

		var url = g.settings.apiRoot + g.settings.apiMediaPath + options.contentId + '?showchildlevel=1';
		if (options.sortBy && options.sortBy.trim().length > 0) {
			url += '&sort=' + encodeURIComponent(options.sortBy);
		}
		if (options.sortDirection && options.sortDirection.trim().length > 0) {
			url += '&order=' + encodeURIComponent(options.sortDirection.toUpperCase());
		}
		url += '&callback=?';

		$.ajax({
			url: url,
			dataType: 'jsonp'
		})
		.done(function(response) {

			var results = response.results[0];

			var listItem = function(contentId, title, link, summary, pubDate, moreLabel, iconClass, imageSource, imageAltText, showIcon, showImage, showPubDate, showSummary, newWindow) {
				this.contentId = contentId;
				this.title = title;
				this.link = link;
				this.summary = summary;
				this.pubDate = pubDate;
				this.moreLabel = moreLabel;
				this.iconClass = iconClass;
				this.imageSource = imageSource;
				this.imageAltText = imageAltText;
				this.showIcon = showIcon;
				this.showImage = showImage;
				this.showPubDate = showPubDate;
				this.showSummary = showSummary;
				this.showMoreInfoLink = options.linkStyle === 'more' && this.link !== '' && this.moreLabel !== '';
				this.linkTitle = this.link !== '';
				this.newWindow = newWindow;
			}

			var list = {
				isNavBlock: options.moduleStyle === 'A',
				headerText: options.headerText,
				headerIcon: options.headerIcon,
				showHeaderIcon: options.headerIcon !== '',
				showMoreInfoLink: options.moreInfoLink !== '',
				headerLink: options.headerLink,
				showIcons: options.showIcons,
				cssClass: 'module type-' + options.moduleStyle + ' ' + options.cssClass,
				wrapHeader: options.headerLink !== '',
				listStyle: 'link-style-' + options.linkStyle,
				tagId: options.tagId,
				hasTagId: (options.tagId && options.tagId.trim().length > 0),
				enableExternalLinkIcons: options.enableExternalLinkIcons,
				enableFileIcons: options.enableFileIcons,
				listItem: []
			};

			if (results && results.children) {
				for (var i = 0; ((i < results.children.length) && (options.maxItems === 0 || i < options.maxItems)); i++) {
	
					var child = results.children[i];
	
					// Figure out what icon to display if needed.
					var currentIcon;
					if (!options.showImages && options.showIcons) {
						if (child.extendedAttributes && child.extendedAttributes.VisualCategory && child.extendedAttributes.VisualCategory.length > 0) {
							currentIcon = CDC.getIcon(child.extendedAttributes.VisualCategory);
						} else {
							// Just using a fixed default icon for now...
							log('no VisualCategory extended attribute provided');
							currentIcon = g.settings.defaultIcon;
						}
					}
	
					// Determine what image to display (if needed).
					var showImage;
					if (options.showImages && !options.showIcons) {
						var imageUrl;
						if (child.alternateImages && Array.isArray(child.alternateImages) && child.alternateImages.length > 0) {
							for (var j = 0; j < child.alternateImages.length; j++) {
								if (child.alternateImages[j].name === 'SmallTileImage') {
									imageUrl = child.alternateImages[j].url;
								}
							}
						} else if (child.thumbnailUrl && child.thumbnailUrl.length > 0) {
							imageUrl = child.thumbnailUrl;
							log('using thumbnailUrl');
						}
						if (!imageUrl || imageUrl.length === 0) {
							// Need failover image here...
							log('using failover image');
						}
						showImage = options.showImages && imageUrl && imageUrl.length > 0;
					} else {
						showImage = false;
					}
	
					// Now get the appropriate title to display for the item by checking extended attributes first. 
					var title;
					if (child.extendedAttributes && child.extendedAttributes.TopicContextTitle &&
						child.extendedAttributes.TopicContextTitle.length > 0) {
						title = child.extendedAttributes.TopicContextTitle;
					} else {
						title = child.name;
					}

					var targetUrl = child.targetUrl;
					var newWindow = options.newWindow;
					var childId = child.id;
					if (child.mediaType === 'PDF' || child.mediaType === 'ReferenceLink') {
						targetUrl = child.sourceUrl;
						newWindow = true;
						childId = '';
					}

					var nextListItem = new listItem(
						childId,
						title,
						targetUrl, 
						child.description, 
						moment(child.datePublished).format(options.pubDateFormat), 
						options.moreInfoLabel, 
						currentIcon, 
						imageUrl, 
						child.name, 
						options.showIcons, 
						options.showImages, 
						options.showPubDate, 
						options.showSummary,
						newWindow);
	
					list.listItem.push(nextListItem);
				}
			}

			// Render out the module with the list data.
			$(options.target).templates({ templateType: 'collection', content: list });

			// Call the post process if one is registered.
			var func = options.postProcess;
			if (typeof func === 'function') { func(); }
		})
		.fail(function(xhr, ajaxOptions, thrownError) {
			log(xhr.status);
			log(thrownError);
		});

	};

	return $.fn.collection;

});
