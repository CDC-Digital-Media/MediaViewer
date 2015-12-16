define(['jquery', 'mediaViewer', 'metrics', 'social'], 
	function($, mv, metrics) {

	$('div[data-module-type="media-viewer"]').each(function() {
		var module = $(this);
		module.mediaViewer({
				target: module, 
				contentId: module.data('content-id'),
				moduleStyle: module.data('module-style'),
				linkStyle: module.data('link-style'),
				headerText: module.data('header-text'),
				headerIcon: module.data('header-icon'),
				headerLink: module.data('header-link'),
				showIcons: module.data('show-icons'),
				showImages: module.data('show-images'),
				showPubDate: module.data('show-pubdate'),
				showSummary: module.data('show-summary'),
				maxItems: module.data('max-items'),
				enabled: module.data('enabled'),
				enableRepost: module.data('enable-repost'),
				enableReply: module.data('enable-reply'),
				sortField: module.data('sort-field'),
				newWindow: module.data('new-window'),
				postProcess: function() { 
					// Set click handlers on anchors in the slider to capture metrics.
					module.find('.slides a').on('click', function(e) {
						if (typeof $(this).data('content-id') === 'undefined' || $(this).data('content-id') === '') {
							metrics.captureLinkClick(module.data('header-text'), $(this).children('img').attr('alt'), $(this).attr('href'));
						}
					});
				}
			});
	});

});
