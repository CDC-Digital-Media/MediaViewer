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
	
	CDC.Social = (function() {
            var isTouchDevice = function() {
                return('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch;
            };
            var shareContainer;
            
            var allowClickTrack = 1,												// do we want to allow click tracking?
                encodeText = false,													// do we want to encode the text used?
                facebookAppID = 205691699516606,									// Facebook Application ID
                v_href = encodeURIComponent(location.href),							// localhost doesn't work
                v_title = $("meta[property='og:title']").attr('content') || encodeURIComponent(document.title),
                v_desc = $("meta[property='og:description']").attr('content') || '',
                v_img = $("meta[property='og:image']").attr('content') || '';

            // encode them all
            if(encodeText) {
                    v_title = encodeURIComponent(v_title);
                    v_desc = encodeURIComponent(v_desc);
                    v_img = encodeURIComponent(v_img);
            }

            // twitter specific variables which could be used on the tweet button
            var twitter_via = '',	 		//Screen name of the user to attribute the Tweet to
                    twitter_related = '',		// Related accounts
                    twitter_hashtags = '', 		// Comma separated hashtags appended to tweet text
                    twitter_text = v_desc,
                    twitter_dnt = true;			// do not track

            var idx = 0,
                max = 100,
                imagePath = '//' + CDC.Microsite.hostName + CDC.Microsite.folderPath + '/images/',
                syndicateImage = '<i class="sprite-24-syndicate"><\/i>',
                checkForShareMenu = window.setInterval(function() {
                        if($(shareContainer).length) {
                                initShareMenu();
                        }
                        idx++;
                        window.clearInterval(checkForShareMenu);
                }, 100);
            
            // using AddThis Sharing EndPoints, the params are roughly the same
            // http://support.addthis.com/customer/portal/articles/381265-addthis-sharing-endpoints
            var populateShareMenuLinkParams = function(h) {
                    return 'http://api.addthis.com/oexchange/0.8/forward/' + h +
                            '/offer?url=' + v_href +
                            '&title=' + v_title +
                            '&description=' + v_desc +
                            '&ct=' + allowClickTrack;
            };

            // update the facebook recommend button with required parameters
            var getFacebookRecommendLink = function() {
                    return 'https://www.facebook.com/dialog/share?app_id=' + facebookAppID +
                            '&display=popup' +
                            '&caption=' + v_desc +
                            '&href=' + v_href +
                            '&redirect_uri=' + v_href;
            };

            // update the twitter tweet button with required parameters
            var getTwitterTweetLink = function() {
                    return 'https://twitter.com/share?' +
                    '&url=' + v_href +
                    '&via=' + twitter_via +
                    '&related=' + twitter_related +
                    '&hashtags=' + twitter_hashtags +
                    '&text=' + twitter_text +
                    '&dnt=' + twitter_dnt;
            };

            // dropdown specific variables
            var arr = [],
                config = {selector: '.msdd', toggle: 'msdd-toggle', open: 'msdd-open', menu: '.msdd-menu' },
                isTouch = isTouchDevice() || $('html.touch').length ? 1 : 0,
                link = '';
            
            var init = function (selector) {
                shareContainer = $(selector);
                var existingMenu = $(selector + ' .msdd-menu');
                if (existingMenu) {
                    $(existingMenu).remove();
                }
                initShareMenu();
            };
            
            var initShareMenu = function () {
                window.clearInterval(checkForShareMenu);

                //URL Override - used with things like infographics/images/widgets
                if ($(shareContainer).data('url') !== undefined) {
                    v_href = $(shareContainer).data('url');
                }

                // the dropdown menu
                var menu = '<ul class="msdd-menu">';
                if ($(shareContainer).data('twitter') !== false) {
                    menu += '<li><a href="#twitter"><img class="twitter" src="'+ imagePath +'twitter-16.png" alt="twitter" \/>Twitter<\/a><\/li>';
                }
                if ($(shareContainer).data('facebook') !== false) {
                    menu += '<li><a href="#facebook"><img class="facebook" src="'+ imagePath +'facebook-16.png" alt="facebook" \/>Facebook<\/a><\/li>';
                }
                if ($(shareContainer).data('pinterest') !== false) {
                    menu += '<li><a href="#pinterest"><img class="pinterest" src="'+ imagePath +'pinterest-16.png" alt="pinterest" \/>Pinterest<\/a><\/li>';
                }
                if ($(shareContainer).data('linkedin') !== false) {
                    menu += '<li><a href="#linkedin"><img class="linkedin" src="'+ imagePath +'linkedin-16.png" alt="linkedin" \/>LinkedIn<\/a><\/li>';
                }
                if ($(shareContainer).data('email') !== false) {
                    menu += '<li><a href="#email"><img class="email" src="'+ imagePath +'email-16.png" alt="email" \/>Email<\/a><\/li>';
                }
                if ($(shareContainer).data('digg') !== false) {
                    menu += '<li><a href="#digg"><img class="digg" src="'+ imagePath +'digg-16.png" alt="digg" \/>Digg<\/a><\/li>';
                }
                menu += '<\/ul>';

                // update facebook recommend and twitter tweet button links
                //$('a.share_button_facebook').attr('href', getFacebookRecommendLink()).attr('rel','nofollow').attr('target', '_blank');
                //$('a.share_button_twitter').attr('href', getTwitterTweetLink()).attr('rel','nofollow').attr('target', '_blank');
                $(shareContainer).addClass('msdd');		// 3.0
                $('.ms_share_button').addClass('msdd-toggle').after($(menu));

                // loop over the menu items and update the href with settings from the current page
                $('.msdd-menu a[href^="#"]').each(function(e, t) {
                        var h = $(t).attr('href');
                        $(t).attr('href', populateShareMenuLinkParams(h)
                                .replace('#',''))
                                .attr('rel','nofollow')
                                .attr('target', '_blank');
                });

                $('.msdd-menu a[href*="tools.cdc.gov"]').each(function() {
                        this.href += v_href;
                }).attr('rel','nofollow').attr('target', '_blank');
            };

            // using bind instead of on for 2.x (jquery 1.6.x)
            $(document).bind('click touchend', function(e) {
                    // if the menu is open
                    if (arr.length) {
                            // if we're clicking within the share menu
                            if(arr[arr.length - 1].find(e.target).length) {
                                    link = $(e.target).attr('href');
                                    // some touch devices were not firing the anchor before closing the menu
                                    if(isTouch) {
                                            // if what was tapped has an href
                                            if(link && link.indexOf("#") !== 0) {
                                                    window.open(link,'_blank');
                                                    return false;	// prevent default link action
                                            }
                                            else {
                                                    // Delay in some iOS devices seems to be related to iOS (or jQuery (TBD)) trying to determine where you tapped, if not exactly on Share
                                                    return false;
                                            }
                                    }
                                    else {
                                            // close the menu
                                            arr.pop().removeClass(config.open);

                                            // tapping on the share button shouldn't do anything else
                                            if(!link) {
                                                    return false;
                                            }
                                    }
                            }
                            // clicking somewhere else
                            else {
                                    // if(!arr[arr.length - 1].find(e.target).length) {
                                    // 	arr.pop().removeClass(config.open);
                                    // }
                                    if(arr.length) {
                                            arr.pop().removeClass(config.open);
                                    }
                            }
                    }
                    // open the menu
                    else {
                            var $this = $(e.target);
                            if ($this.hasClass(config.toggle) || $this.parent().hasClass(config.toggle)) {
                                    e.preventDefault();
                                    if ($(shareContainer).find('.msdd-menu').is(":visible")) {
                                        arr.pop().removeClass(config.open);
                                    } else {
                                    
                                        // get the coords of the share button button
                                        var toggle = $this.hasClass(config.toggle) ? $this : $this.parent(),
                                                menu = $(config.menu);

                                        // position the menu just under it
                                        menu.css({position: 'absolute', right: toggle.position().right, top: toggle.position().top + 19});

                                        $this = $this.closest(config.selector);

                                        // open the menu
                                        if (!$this.hasClass(config.open)) {
                                                arr.push($this.addClass(config.open));
                                        }
                                        else {
                                                arr.pop().removeClass(config.open);
                                        }
                                    }
                            }
                            else {
                                    // everything else
                            }
                    }
            });

            // close the share on resize/orientation change
            $(window).resize(function(e) {
                    if(arr.length) {
                            arr.pop().removeClass(config.open);
                    }
            });
                
            return {

                /** 
                * @method capturePageLoad
                * @access public
                * @desc Capture the page load event
                * @return {String}
                */
                init: function(selector) {
                    init(selector);
                }
            };
	})();

	return CDC.Social;

});


// try to detect a touch device (instead of a window size) - roughly how Modernizr does it









