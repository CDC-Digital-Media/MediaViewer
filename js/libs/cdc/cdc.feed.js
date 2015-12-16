define(['jquery', 'core', 'global', 'moment', 'templates'], function($, c, g, moment, templates) {
	'use strict';

	var defaults = {
		tagId: '',
		contentId: -1,
		cssClass: 'cdc-feed',
		postProcess: '',
		newWindow: false,
		moduleStyle: '',
		linkStyle: 'title',
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
		maxItems: 0
	};

	// funtion //////////////////////////
	$.fn.feed = function(options) {

		options = $.extend({}, defaults, options);
		options.target = options.target ? options.target : $(this);
		if (options.contentId === -1){ alert('No Feed Id was specified.'); return; }

		var url = g.settings.apiFeedRoot + g.settings.apiFeedPath + options.contentId + '&fmt=json&callback=?';

		$.ajax({
			url: url,
			dataType: 'jsonp'
		})
		.done(function(response) {

			var results = response;

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
				hasTagId: (options.tagId && options.tagId.trim().length > 0),
				enableExternalLinkIcons: options.enableExternalLinkIcons,
				enableFileIcons: options.enableFileIcons,
				listItem: []
			};

			if (results) {
				for (var i = 0; ((i < results.length) && (options.maxItems === 0 || i < options.maxItems)); i++) {

					var child = results[i];
					var targetUrl;
					var imageUrl;
					var currentIcon;
					var showImage;

					// Figure out what icon to display if needed.
					if (!options.showImages && options.showIcons) {
						// TODO: need to find default icon for feed items.
						currentIcon = g.settings.defaultIcon;
					}

					// Determine what image to display (if needed).
					if (options.showImages && !options.showIcons) {
						for (var j = 0; j < child.Links.length; j++) {
							if (child.Links[j].RelationshipType === 'enclosure') {
								imageUrl = child.Links[j].Uri;
								break;
							}
						}
						if (!imageUrl || imageUrl.length === 0) {
							// Need failover image here...
							log('using failover image');
						}
						showImage = options.showImages && imageUrl && imageUrl.length > 0;
					} else {
						showImage = false;
					}
					// Get the target URL for the feed item.
					for (var j = 0; j < child.Links.length; j++) {
						if (child.Links[j].RelationshipType === 'alternate') {
							targetUrl = child.Links[j].Uri;
							break;
						}
					}

					var nextListItem = new listItem(
						child.Guid, 
						child.Title.Text,
						targetUrl, 
						child.Summary.Text, 
						moment.utc(c.parseJsonDate(child.PublishDate.DateTime)).format(options.pubDateFormat), 
						options.moreInfoLabel, 
						currentIcon, 
						imageUrl, 
						child.Title.Text, 
						options.showIcons, 
						options.showImages, 
						options.showPubDate, 
						options.showSummary,
						options.newWindow);
	
					list.listItem.push(nextListItem);
				}
			}

			// Render out the module with the list data.
			$(options.target).templates({ templateType: 'feed', content: list });

			// Call the post process if one is registered.
			var func = options.postProcess;
			if (typeof func === 'function') { func(); }
		})
		.fail(function(xhr, ajaxOptions, thrownError) {
			log(xhr.status);
			log(thrownError);
		});

	};

	return $.fn.feed;

});
