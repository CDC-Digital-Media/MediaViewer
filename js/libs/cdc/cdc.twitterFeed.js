/*
* @fileOverview A jQuery-based class to support the display of real-time Facebook and Twitter feeds.
* @description This is a library utilizing jQuery JSONP AJAX calls to request JSON serialized Atom feeds
* that are requested directly from Facebook and Twitter via an application that "proxies" the feed.
* 
* @requires jQuery CORE
*           Server-side feed generator that supports JSONP
* @version 2.0.0.0
*/
define(['jquery', 'global', 'moment', 'templates'], function($, g, moment, templates) {
	'use strict';

	var defaults = {
		feedDefinitionArray: [],
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
		pubDateFormat: 'MMMM D [&bull;] h:mm A [ET]',
		showSummary: true,
		showImages: false,
		showIcons: false,
		enableExternalLinkIcons: g.settings.enableExternalLinkIcons,
		enableFileIcons: g.settings.enableFileIcons,
		enableRepost: false,
		enableReply: false,
		maxItems: 0
	};


	var feedDefinition = function(feedId, url, title, numberOfItems, enabled) {
		this.feedId = feedId;
		this.url = url;
		this.title = title;
		this.numberOfItems = (typeof numberOfItems === "undefined") ? 3 : numberOfItems;;
		this.enabled = (typeof enabled === "undefined") ? true : enabled;
	};

	// Private class to help support search/replace by using variable length tokens that can be used to identify
	// areas of a string that are to be replaced without altering the length/position of the string.
	var Placeholder = function(token, value) {
		this.token = token;
		this.value = value;
	};

	// funtion //////////////////////////
	$.fn.twitterFeed = function(options) {

		options = $.extend({}, defaults, options);
		options.target = options.target ? options.target : $(this);
		if (options.contentId === -1){ alert('No Twitter Feed Id was specified.'); return; }

		// Just forcing one feed definition for now...
		var feedId = options.contentId;
		var url = options.headerLink;
		var title = options.headerText;
		var numberOfItems = options.maxItems;
		var enabled = options.enabled;
		var enablePostDate = options.showPubDate;
		var enableRepost = options.enableRepost;
		var enableReply = options.enableReply;
		var wrapTitleInHeader = options.headerLink !== '';
		var definition = new feedDefinition(feedId, url, title, numberOfItems, enabled);
		var definitionArray = [];
		options.feedDefinitionArray.push(definition);

		var url = g.settings.apiTwitterFeedRoot + g.settings.apiTwitterFeedPath + options.contentId + '&format=json&callback=?';

		$.ajax({
			url: url,
			dataType: 'jsonp'
		})
		.done(function(response) {

			var results = response.statuses;

			var listItem = function(contentId, title, link, summary, pubDate, moreLabel, 
				iconClass, imageSource, imageAltText, showIcon, showImage, showPubDate, 
				showSummary, repostUrl, replyUrl, newWindow) {
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
				this.repostUrl = repostUrl;
				this.replyUrl = replyUrl;
				this.enableRepost = options.enableRepost && repostUrl && repostUrl.trim().length > 0;
				this.enableReply = options.enableReply && replyUrl && replyUrl.trim().length > 0;
				this.enableResponse = this.enableRepost || this.enableReply;
				this.newWindow = newWindow;
			}

			var list = {
				isNavBlock: options.moduleStyle === 'C',
				headerText: options.headerText,
				headerIcon: options.headerIcon,
				showHeaderIcon: options.headerIcon !== '',
				showMoreInfoLink: options.moreInfoLink !== '',
				headerLink: options.headerLink,
				showIcons: options.showIcons,
				cssClass: 'module type-' + options.moduleStyle,
				wrapHeader: options.headerLink !== '',
				listStyle: 'link-style-' + options.linkStyle,
				enableRepost: options.enableRepost,
				enableReply: options.enableReply,
				tagId: options.tagId,
				hasTagId: (options.tagId && options.tagId.trim().length > 0),
				enableExternalLinkIcons: options.enableExternalLinkIcons,
				enableFileIcons: options.enableFileIcons,
				listItem: []
			};

			if (results) {
				try {
					var numberFound = 0;
					for (var i = 0; (i < results.length && numberFound < numberOfItems); i++) {
						// The tweet text that is going to be updated.
						var tweetText = results[i].text;
						if (tweetText.trim().length > 0) {
							var tweetId;
							if (results[i].retweeted_status) {
								tweetId = results[i].retweeted_status.id_str;
							} else {
								tweetId = results[i].id_str;
							}
							// Variables to hold the substitutions that will need to be made along with token parsing.
							var substitutions = new Array();
							var substitutionsIndex = 0;
							var tokenText = '';
							var tokenStart = 0;
							var tokenEnd = 0;
							var placeholderText = '';
							var placeholderSize = 0;
							// Set placeholders for target URLs as anchors.
							if (results[i].entities && results[i].entities.urls) {
								for (var j = 0; j < results[i].entities.urls.length; j++) {
									if (results[i].entities.urls[j].expanded_url && results[i].entities.urls[j].expanded_url.length > 0) {
										tokenText = results[i].entities.urls[j].url;
										tokenStart = results[i].entities.urls[j].indices[0];
										tokenEnd = results[i].entities.urls[j].indices[1];
										placeholderSize = tokenText.length - 2;
										if (placeholderSize > 0) {
											placeholderText = '|'+ Array(placeholderSize + 1).join(substitutionsIndex.toString()) + '|';
											substitutions[substitutionsIndex++] = new Placeholder(placeholderText, '&lt;a href="' + results[i].entities.urls[j].expanded_url + '"&gt;' + tokenText + '&lt;/a&gt;');
											tweetText = tweetText.substring(0, tokenStart) + placeholderText + tweetText.substring(tokenEnd);
										}
									}
								}
							}
							// Set placeholders for hashtags as anchors.
							if (results[i].entities && results[i].entities.hashtags) {
								for (var j = 0; j < results[i].entities.hashtags.length; j++) {
									tokenText = results[i].entities.hashtags[j].text;
									tokenStart = results[i].entities.hashtags[j].indices[0];
									tokenEnd = results[i].entities.hashtags[j].indices[1];
									placeholderSize = tokenText.length - 2;
									if (placeholderSize > 0) {
										placeholderText = '|'+ Array(placeholderSize + 1).join(substitutionsIndex.toString()) + '|';
										substitutions[substitutionsIndex++] = new Placeholder(placeholderText, '&lt;a href="https://twitter.com/search?q=%23' + tokenText + '&src=hash"&gt;' + tokenText + '&lt;/a&gt;');
										tweetText = tweetText.substring(0, tokenStart + 1) + placeholderText + tweetText.substring(tokenEnd);
									}
								}
							}
							// Set placeholders for user mentions as anchors.
							if (results[i].entities && results[i].entities.user_mentions) {
								for (var j = 0; j < results[i].entities.user_mentions.length; j++) {
									tokenText = results[i].entities.user_mentions[j].screen_name;
									tokenStart = results[i].entities.user_mentions[j].indices[0];
									tokenEnd = results[i].entities.user_mentions[j].indices[1];
									placeholderSize = tokenText.length - 2;
									if (placeholderSize > 0) {
										placeholderText = '|'+ Array(placeholderSize + 1).join(substitutionsIndex.toString()) + '|';
										substitutions[substitutionsIndex++] = new Placeholder(placeholderText, '&lt;a href="https://twitter.com/' + tokenText + '"&gt;' + tokenText + '&lt;/a&gt;');
										tweetText = tweetText.substring(0, tokenStart + 1) + placeholderText + tweetText.substring(tokenEnd);
									}
								}
							}

							// Now run through the entire string and replace all the placeholder tokens with values.
							for (var k = 0; k < substitutions.length; k++) {
								tweetText = tweetText.replace(substitutions[k].token, substitutions[k].value);
							}

							// Final cleanup/reformatting of content block for Tweet.
							tweetText = $('<div style="display: none;"/>').html(tweetText).text().replace(/\<\/?em\>/g, '');

							// Need to reformat the Tweet date provided by Twitter.
							var tweetDateTime = moment(results[i].created_at, 'ddd MMM D hh:mm:ss ZZ YYYY').format('MMMM D [&bull;] h:mm A [ET]');

							var nextListItem = new listItem(
								tweetId, 
								'',
								'',
								tweetText, 
								tweetDateTime, 
								options.moreInfoLabel, 
								'',
								'',
								'',
								options.showIcons, 
								options.showImages, 
								options.showPubDate, 
								options.showSummary,
								'https://twitter.com/intent/retweet?tweet_id=' + tweetId,
								'https://twitter.com/intent/tweet?in_reply_to=' + tweetId,
								options.newWindow);
			
							list.listItem.push(nextListItem);

							numberFound++;

						}

					}

				} catch (err) {
					log(err);
					// Display failover block
				}

			}

			// Render out the module with the list data.
			$(options.target).templates({ templateType: 'twitter-feed', content: list });

			// Needed to look at every anchor href attribute to fixup http:// references.
			$(options.target).find('a').each(function() {
				var target = $(this).prop('href');
				// Need to save/restore link text because of issue with IE replacing it when HREF property is set.
				var linkText = $(this).html();
				if (target.indexOf('http://twitter.com') == 0) {
					$(this).prop('href', target.replace('http://twitter.com', 'https://twitter.com'));
				} else if (target.indexOf('http://search.twitter.com/search') == 0) {
					$(this).prop('href', target.replace('http://search.twitter.com/search', 'https://twitter.com/search'));
				} else if (target.indexOf('/') == 0) {
					$(this).prop('href', 'https://twitter.com' + target);
				}
				// Restore the link text (IE fix).
				$(this).html(linkText);
			});

			// These handlers needs to be registered after the elements have been added to the DOM in order
			// be handled properly.
			if (options.enableRepost) {
				$(options.target).find('span.retweet a').click(function(e) {
					if (g.settings.enableInterstitialPage) {
						//ShowInterstitial($(this).attr('href'));
						//e.preventDefault();
					}
				});
			}
			if (options.enableReply) {
				$(options.target).find('span.reply a').click(function(e) {
					if (g.settings.enableInterstitialPage) {
						//ShowInterstitial($(this).attr('href'));
						//e.preventDefault();
					}
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

	return $.fn.twitterFeed;

});
