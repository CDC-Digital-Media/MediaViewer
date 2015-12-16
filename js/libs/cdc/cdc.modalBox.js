define(['jquery'], function($) {
	'use strict';

	$.fn.modalBox = function(prop){

		// Default parameters
		var options = $.extend({
			height : "50%",
			width : "50%",
			title:"Microsite Modal Box",
			description: "Microsite modal content goes here.",
			top: "20%",
			left: "30%",
		}, prop);

		//Click event on element
		return this.click(function(e){
			var background = $('<div class="cdc_block_page"></div>');
			background.css({
				'position': 'absolute',
				'top': '0',
				'left': '0',
				'height': '100%',
				'width': '100%',
				'z-index': '9999',
				'background-color': 'rgba(0, 0, 0, 0.7)'
			});
			background.appendTo('body');

			log(e.clientX);
			log(e.clientY);

			var modalMinHeight = 250;
			var modalMinWidth = 400;
			var windowWidth = $(window).width();
			var windowHeight = $(window).height();
			if (windowWidth - modalMinWidth < 0) {
				options.width = '100%';
				options.left = '0px';
			} else if (e.clientX + modalMinWidth > windowWidth) {
				options.width = modalMinWidth + 'px';
				options.left = (e.clientX - modalMinWidth) + 'px';
			} else if (e.clientX - modalMinWidth < 0) {
				options.width = modalMinWidth + 'px';
				options.left = '0px';
			} else {
				options.width = modalMinWidth + 'px';
				options.left = ((windowWidth / 2) - (modalMinWidth / 2)) + 'px';
			}
			if (windowHeight - modalMinHeight < 0) {
				options.height = '100%';
				options.top = '0px';
			} else if (e.clientY + modalMinHeight > windowHeight) {
				// popup would fall over the bottom -- see if we can go up
				if (e.clientY - modalMinHeight < 0) {
					options.height = modalMinHeight + 'px';
					options.top = '0px';
				} else {
					options.height = modalMinHeight + 'px';
					options.top = (e.clientY - modalMinHeight) + 'px';
				}
			} else if (e.clientY + modalMinHeight <= windowHeight) {
				options.height = modalMinHeight + 'px';
				options.top = e.clientY + 'px';
			} else if (e.clientY - modalMinHeight < 0) {
				options.height = modalMinHeight + 'px';
				options.top = '0px';
			}

			var pop_up = $('<div class="cdc_modal_box"><h2>' + options.title + '</h2><p>' + options.description + '</p></div>');
			pop_up.css({
				'position': 'absolute',
				'height': options.height,
				'width': options.width,
				'top': options.top,
				'left': options.left,
				'display': 'none',
				'padding': '18px',
				'overflow-y': 'scroll',
				'border': '5px solid #f2f2f2',
				'box-shadow': '0px 2px 3px #292929',
				'-moz-box-shadow': '0px 2px 3px #292929',
				'-webkit-box-shadow': '0px 2px 3px #292929',
				'border-radius': '5px',
				'-moz-border-radius': '5px',
				'-webkit-border-radius': '5px',
				'background': '#fff',
				'z-index': '9998'
			});

			var closeButton = $('<a href="#" class="cdc_modal_close"><span class="fa fa-times-circle"></span></a>');
			closeButton.css({
				'position': 'relative',
				'top': '0px',
				'right': '0px',
				'float': 'right',
				'display': 'block',
				'height': '24px',
				'width': '24px',
				'font-size': '24px'
			});
			closeButton.prependTo(pop_up);

			pop_up.appendTo('.cdc_block_page');
			$('.cdc_modal_close').click(function(){
				$(this).parent().fadeOut().remove();
				$('.cdc_block_page').fadeOut().remove();
			});
			$('.cdc_modal_box').fadeIn();
		});

		return this;
	};

	return $.fn.modalBox;

});
