define(['jquery', 'global', 'flexslider', 'metrics', 'templates', 'social'], function($, g, flexslider, metrics, templates, social) {
	'use strict';

	var defaults = {
		contentId: -1,
		cssClass: 'cdc-mediaviewer',
		postProcess: '',
		newWindow: false,
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
		maxItems: 0,
		sortField: ''
	};

	$.fn.mediaViewer = function(options) {
		options = $.extend({}, defaults, options);
		options.target = options.target ? options.target : $(this);
		if (options.contentId === -1){ alert('No Collection Id was specified.'); return; }
                
                //var mediaViewerContainer = $('[data-module-type="media-viewer"][data-content-id="'+options.contentId+'"]');
                //$(mediaViewerContainer).addClass('media-viewer');
                
                //if ($(mediaViewerContainer).width() < 500) {
                //    $(mediaViewerContainer).addClass('cdc-slider-minimized');
                //}
                
                var yt_players={};

                //When youtube is ready, add players to array and add event handlers
                window.onYouTubeIframeAPIReady = function() {
                    $(".ytplayer").each(function() {
                        yt_players[this.id] = new YT.Player(this.id);
                        yt_players[this.id].addEventListener("onStateChange", "youTubePlayerStateChange");
                    });
                };

                //Log metrics when user starts, pauses, or finishes watching a video
                window.youTubePlayerStateChange = function(newState) {
                    var actionName = '';
                    var ytPlayer = newState.target;
                    var currentPlayerTime = Math.round(ytPlayer.getCurrentTime());
                    var videoData = ytPlayer.getVideoData();
                    var title = videoData['title'];
                    var percentViewed = Math.round((currentPlayerTime / ytPlayer.getDuration()) * 100);
                    var videoId = videoData['video_id'];

                    //hide caption
                    if (newState.data === YT.PlayerState.PLAYING) {
                        $("ul").find("[data-videoid='" + videoId + "']").children(".flex-caption").hide();
                    }

                    if (newState.data === YT.PlayerState.PLAYING && currentPlayerTime <= 1) { //play event may have a "time" slightly above 0
                        //Capture metrics: moduleName, eventName, pageName, sourceUrl
                        metrics.captureInteraction(options.headerText, "Video Played: " + title, title, ytPlayer.getVideoUrl());
                        log("Capturing media view omniture event. moduleName: " + options.headerText + ", eventName: " + actionName + ": " + title + ", pageName: " + title + ", sourceUrl " + ytPlayer.getVideoUrl());
                    } else if (newState.data === YT.PlayerState.PAUSED) {
                        //Capture metrics: moduleName, eventName, pageName, sourceUrl
                        metrics.captureMediaInteraction(options.headerText, "Video Stopped: " + title, title, ytPlayer.getVideoUrl(), percentViewed);
                        log("Capturing media view omniture event. moduleName: " + options.headerText + ", eventName: " + actionName + ": " + title + ", pageName: " + title + ", sourceUrl " + ytPlayer.getVideoUrl() + ", percent viewed: " + percentViewed);
                    }

                };

                /*
                window.onresize = function(event) {
                    clearTimeout(resizeTimer);
                    resizeTimer = setTimeout(function(){
                        if (options.target.width() < 500) {
                            $(this.mediaViewerContainer).addClass('cdc-slider-minimized');
                        } else {
                            $(this.mediaViewerContainer).removeClass('cdc-slider-minimized');
                        }
                    }, 150);
                };
                */
                var toggleVideo = function(videoId) {
                    yt_players['player-'+videoId].pauseVideo();
                    //$("ul").find("[data-videoid='" + videoId + "']").children(".flex-caption").show();
                };

		var url = g.settings.apiRoot + '/api/v2/resources/media/'+ options.contentId + '?showchildlevel=1&callback=?';
		$.ajax({
			url: url,
			dataType: 'jsonp'
		})
		.done(function(response) {

                    var results = response.results[0];

                    var SortByDisplayOrdinal = function(a, b){
                        var aOrdinal = a.displayOrdinal;
                        var bOrdinal = b.displayOrdinal; 
                        return ((aOrdinal < bOrdinal) ? -1 : ((aOrdinal > bOrdinal) ? 1 : 0));
                    };

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
                            if (type.toLowerCase() === 'video') {
                                var videoId = '';
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
                            
                            if (type.toLowerCase() === 'image') {
                                this.moreInfoUrl = this.targetUrl;
                            } else {
                                this.moreInfoUrl =  this.sourceUrl;
                            }
                    };

                    var embedCode = '<div class="media-viewer" data-header-text="'+options.headerText+'" ' +
                                    'data-module-type="media-viewer" data-content-id="'+options.contentId+'" data-content-tags="" data-new-window="" ' +
                                    'data-sort-field="EbolaMediaViewerOrdinal"></div><script data-main="//' + CDC.Microsite.embedHostName + '/microsites/ebola/js/mediaviewerwidget" ' +
                                    'src="//' + CDC.Microsite.embedHostName + '/microsites/ebola/js/libs/require/require.js"></script>';
                    
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
						contentId: options.contentId,
                                                embedCode: embedCode,
						newWindow: options.newWindow
                    };

                    if (results) {
                        mediaSet.link = results.targetUrl;
                    }
                    
                    
                    var sortOverride = options.sortField.length > 0 ? options.sortField : '';

                    if (results && results.children) {
                        for (var i = 0; ((i < results.children.length) && (options.maxItems === 0 || i < options.maxItems)); i++) {
                            var item = results.children[i];

                            var featuredImage = '';
                            var featuredThumbnail = '';
                            
                            if (item.mediaType === 'Image') {
                                featuredImage = item.sourceUrl;
                            }

                            $.each(item.alternateImages, function(i, item) {
                                if (item.name === 'FeaturedImage') {
                                    featuredImage = item.url;
                                } else if (item.name === 'FeaturedThumbnail') {
                                    featuredThumbnail = item.url;
                                }
                            });

                            var displayOrdinal = Number.MAX_VALUE;
                            if (item.extendedAttributes && item.extendedAttributes[sortOverride] && !isNaN(item.extendedAttributes[sortOverride])) {
                                displayOrdinal = parseInt(item.extendedAttributes[sortOverride]);
                            }

                            var nextMediaItem = new mediaItem(item.name, 
                                item.description,
                                item.sourceUrl, 
                                item.targetUrl, 
                                featuredImage, 
                                featuredThumbnail, 
                                item.mediaType.toLowerCase(),
                                $('<textarea/>').html(item.embedCode).text().trim(),
                                displayOrdinal
                            );
                            mediaSet.mediaItems.push(nextMediaItem);
                        }
                        
                        if (sortOverride.length) {
                            mediaSet.mediaItems.sort(SortByDisplayOrdinal);
                        }
                    }

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
                    
                    
                    
                    //Get youtube api script
                    $.getScript("//www.youtube.com/player_api");

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
                            sync: "#cdc-carousel-"+$(this).data('uid'),
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
                    
                    //Fix hover issue when using IE and you hover of the video iframe
                    if (window.navigator.userAgent.indexOf("MSIE") > 0) {
                        $('.cdc-slider').on('mouseenter',function() {
                           $(this).addClass('iehover');
                        });
                        $('.cdc-slider iframe').on('hover',function() {
                           $(this).parents(".item").addClass('iehover');
                        });
                        $(".cdc-slider").on('mouseleave',function() {
                           $(this).removeClass('iehover');
                        });
                    }
                    
                    // Call the post process if one is registered.
                    var func = options.postProcess;
                    if (typeof func === 'function') { func(); }

                })
                .fail(function(xhr, ajaxOptions, thrownError) {
                        log(xhr.status);
                        log(thrownError);
                });
	};

	return $.fn.mediaViewer;

});
