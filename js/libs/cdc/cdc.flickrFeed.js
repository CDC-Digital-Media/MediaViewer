define(['jquery', 'global', 'flexslider', 'metrics', 'templates', 'social'], function($, g, flexslider, metrics, templates, social) {
	'use strict';

	var defaults = {
		contentId: '89075068@N07',
		photosetId: '72157646018355339',
		cssClass: 'cdc-mediaviewer',
		postProcess: '',
		newWindow: true,
		moduleStyle: '',
		linkStyle: 'title',
		headerText: '',
		showPubDate: true,
		showSummary: true,
		showImages: true,
		showIcons: false,
		headerIcon: '',
		enableExternalLinkIcons: false,
		enableFileIcons: false,
		maxItems: 50,
		sortField: ''
	};

	$.fn.flickrFeed = function(options) {

		options = $.extend({}, defaults, options);
		options.target = options.target ? options.target : $(this);
		if (options.contentId === -1){ alert('No Collection Id was specified.'); return; }

                //Event handler for when user shares using AddThis
                var addThisShareEventHandler = function(evt) {
                    if (evt.type === 'addthis.menu.share') { 
                        var activeSlide = $(evt.data.element).closest(".cdc-slider").find('.flex-active-slide');
                        var sourceTitle =$(activeSlide).data('title');
                        metrics.captureInteraction(options.headerText, "Shared: " + evt.data.service, sourceTitle, evt.data.url);
                        log("Capturing media view omniture event. moduleName: " + options.headerText + ", eventName: " + "Shared: " + evt.data.service + ", pageName: " + sourceTitle + ", sourceUrl " + evt.data.url);
                    }
                };

		var url = 'http://www2c.cdc.gov/podcasts/feed.asp' +
			'?feedid=' + options.contentId +
			'&photosetid=' + options.photosetId + 
			'&maxnumber=' + options.maxItems +
			'&format=json&callback=?';

		$.ajax({
			url: url,
			dataType: 'jsonp',
			jsonp: 'jsoncallback'
		})
		.done(function(response) {

			var mediaItem = function(title, description, sourceUrl, targetUrl, mainSrc, thumbSrc, type, embedCode, displayOrdinal) {
				this.title = title;
				this.description = description;
				this.sourceUrl = sourceUrl;
				this.targetUrl = targetUrl;
				this.mainSrc = mainSrc;
				this.thumbSrc = thumbSrc;
				this.type = type;
				this.isVideo = this.type === 'video' ? true : false;
				this.embedCode = embedCode;
				this.displayOrdinal = displayOrdinal;
				this.moreInfoUrl = targetUrl;
				var videoId = '';
				if (type.toLowerCase() === 'video') {
					if (sourceUrl.indexOf("embed") > 0) {
						videoId = sourceUrl.substr(sourceUrl.lastIndexOf('/') + 1);
						if (videoId.indexOf("?") > -1) {
							videoId = videoId.substr(0, videoId.indexOf("?"));
						}
					} else if (sourceUrl.indexOf("=") > 0) {
						videoId = sourceUrl.substr(sourceUrl.lastIndexOf('=') + 1);
					}
				}
				this.videoId = videoId;
			}
                        
                        var embedCode = '<div class="media-viewer" data-header-text="'+options.headerText+'" data-module-type="flickr-feed" ' +
					'data-content-id="'+options.contentId+'" data-photoset-id="'+options.photosetId+'" data-max-items="50"></div>'+
                                        '<script data-main="//' + CDC.Microsite.embedHostName + '/microsites/ebola/js/flickr" src="//' + CDC.Microsite.embedHostName + 
                                        '/microsites/ebola/js/libs/require/require.js"></script>';
                        
			var theDate = new Date();
			var millis = theDate.getTime();
			var mediaSet = {
				title: options.headerText,
				link: '',
				enableExternalLinkIcons: options.enableExternalLinkIcons,
				enableFileIcons: options.enableFileIcons,
				mediaItems: [],
				uniqueId: millis,
				sortField: options.sortField,
                                embedCode: embedCode,
				contentId: options.contentId,
				newWindow: options.newWindow
			};

			var pathalias;
			for (var i = 0; ((i < response.photoset.photo.length) && (options.maxItems === 0 || i < options.maxItems)); i++) {
				var item = response.photoset.photo[i];
				pathalias = item.pathalias;
				var nextPhoto = new mediaItem(
					item.title, 
					item.title, 
					'https://www.flickr.com/photos/' + item.pathalias + '/' + item.id, 
					'https://www.flickr.com/photos/' + item.pathalias + '/' + item.id, 
					typeof item.url_l !== 'undefined' ? item.url_l : item.url_m,
					typeof item.url_l !== 'undefined' ? item.url_l : item.url_m,
					'image',
					$('<textarea/>').html('<img src="' + item.url_l + '" alt="' + item.description + '">').text().trim(),
					i
				);


				mediaSet.mediaItems.push(nextPhoto);
			}
			mediaSet.link = 'https://www.flickr.com/photos/' + pathalias + '/sets/' + options.photosetId;

                    // Render out the module with the list data.
                    $(options.target).templates({ templateType: 'media-viewer', content: mediaSet });

                    //Add event handler to close button for embed popover
                    $(options.target).find('.close-embed').click(function() {
                        $(options.target).find('.cdc-media-viewer-embed').hide();
                    });
                    
                    //Add event handler to show embed popover
                    $(options.target).find('.embed-button').click(function() {
                        $(options.target).find('.cdc-media-viewer-embed').show();
                    });
                    
                    
                    $("[id^=cdc-carousel]").each(function(){
                        $(this).flexslider({
                            animation: 'slide',
                            controlNav: true,
                            animationLoop: true,
                            slideshow: false,
                            directionNav: true,
                            itemWidth: 100,
                            itemMargin: 5,
                            keyboard: true,
                            multipleKeyboard: true,
                            asNavFor: '#cdc-slider-'+$(this).data('uid'),
                            prevText: '<i class="fa fa-angle-left"></i><span class="hidden">Previous</span>',
                            nextText: '<i class="fa fa-angle-right"></i><span class="hidden">Next</span>',                      
                            video: true
                        });
                    });

                    $("[id^=cdc-slider]").each(function(index){
                        $(this).flexslider({
                            animation: 'slide',
                            animationLoop: true,
                            controlNav: false,
                            slideshow: false,
                            directionNav: true,
                            sync: "#cdc-carousel"+$(this).data('uid'),
                            keyboardNav: true,
                            multipleKeyboard: true,
                            video: true,
                            smoothHeight: true,
                            prevText: '<i class="fa fa-angle-left"></i><span class="hidden">Previous</span>',
                            nextText: '<i class="fa fa-angle-right"></i><span class="hidden">Next</span>',                    
                            start: function(slider){

                                var $curSlide = $(slider.slides[0]);
                                var socialContainer = $(slider).find("[id^='msSocialMediaShareContainer']").first();
                                $(socialContainer).data('url', $curSlide.data('url')).data('title', $curSlide.data('title'));
                                social.init('#'+$(socialContainer).attr('id'));
                            },
                            before: function(slider) {
                                var $curSlide = $(slider.slides[slider.currentSlide]);
                                if ($($curSlide).has(".videoContainer").length!==0) {
                                    toggleVideo($curSlide.data('videoid'));
                                }
                                $(slider).parent().find('.slide-current-slide').html(slider.animatingTo+1);
                            },
                            after: function(slider){
                                var $curSlide = $(slider.slides[slider.currentSlide]);
                                var socialContainer = $(slider).find("[id^='msSocialMediaShareContainer']").first();
                                $(socialContainer).data('url', $curSlide.data('url')).data('title', $curSlide.data('title'));
                                social.init('#'+$(socialContainer).attr('id'));
                            }
                        });
                        
                    });

                    $('#slider .slides').find('a').each(function() {
                        $(this).focus(function() {
                            log($(this).attr("href"));
                            var slider = $('#slider').data().flexslider;
                            var $li = $(this).parents('li');
                            slider.flexAnimate($li.index());
                        });
                    });

                    // Call the post process if one is registered.
                    var func = options.postProcess;
                    if (typeof func === 'function') { func(); }

		})
		.fail(function(xhr, ajaxOptions, thrownError) {
			log(xhr.status);
			log(thrownError);
		});
	};

	return $.fn.flickrFeed;

});
