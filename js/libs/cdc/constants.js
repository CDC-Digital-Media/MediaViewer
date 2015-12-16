define(['jquery', 'core', 'global'], function($, core, g) {

	/**
	* constants.js
	* @fileoverview Immutable values
	* @version 1.0.0.0
	* @copyright 2013 Centers for Disease Control
	*/
	
	/** Does global CDC namespace exists? */
	CDC = CDC || {};
	
	/** 
	* @module Constants
	* @memberof CDC
	* @return {Object}
	*/
	CDC.Constants = (function () {
		'use strict';
		
		var local = {
			micrositeName: 'Ebola Hemorrhagic Fever: Information for U.S. Health Care Workers',
			title: 'Centers for Disease Control and Prevention',
			description: 'CDC Centers for Disease Control and Prevention - Your Online Source for Credible Health Information',
			author: 'Centers for Disease Control and Prevention',
			menuLabel: 'MENU',
			externalIconTitle: 'Link to External Web Site',
			externalLink: 'http://www.cdc.gov/Other/disclaimer.html',
			charset: 'utf-8',
			mobileCDCLogo: 'images/m-cdc-logo.png',
			CDCLogo: 'images/cdcHeaderLogo.gif',
			languageLabel: 'English',
			languageFlag: '',
			languageCode: 'en-us',
			tapToView: 'Tap Image for Full Screen',
			tapToClose: 'Tap to Close',
			homePage: 'http://www.cdc.gov/',
			breadcrumb: 'CDC',
			share: 'Share',
			previous: 'Previous',
			next: 'Next',
			of: 'of',
			search: 'SEARCH',
			back: 'BACK',
			addthistoyoursite: 'Add this to your site',
			watchOnYouTube: 'Watch Video on Youtube',
			youTubeNotSupported: 'YouTube videos are not supported in your browser. <br/>Please upgrade your browser to view videos.',
			youTubeVideo: 'YouTube Video',
			audioDownload: 'Audio Download',
			javascriptBookmark: 'Your web browser does not support adding a bookmark with Javascript.  Please manually add one via your browser\'s bookmark menu.',
			emailLink: '/TemplatePackage/3.0/includes/email/email-link.html',
			emailLinkConfirm: 'email-link-confirm.html',
			addThisToYourSiteLink: 'http://tools.cdc.gov/syndication/default.aspx?url='
			// facebookLogo: 'TemplatePackage\3.0\images\smRecommend.png',
			// twitterLogo: 'TemplatePackage\3.0\images\smTweet.png',
			// linkedinLogo: 'TemplatePackage\3.0\images\smLinkedIn.png'		
		},
		localES = {
			micrositeName: 'Ebola Hemorrhagic Fever: Information for U.S. Health Care Workers {Spanish}',
			title: 'Centros para el Control y la Prevenci&oacute;n de Enfermedades | P&aacute;gina principal',
			description: 'Centros para el Control y la Prevenci&oacute;n de Enfermedades - Su fuente confiable de informaci&oacute;n sobre salud en Internet',
			author: 'Centros para el Control y la Prevenci&oacute;n de Enfermedades',
			menuLabel: 'MEN&Uacute;',
			externalIconTitle: 'Web externa icono del sitio',
			externalLink: 'http://www.cdc.gov/spanish/CDC/descargos.html',
			charset: 'utf-8',
			mobileCDCLogo: 'images/esp/m-cdc-logo.png',
			CDCLogo: 'images/esp/cdcHeaderLogo.gif',
			languageLabel: ' Espa&ntilde;ol ',
			languageFlag: '',
			languageCode: 'es-us',
			tapToView: 'Pulse en la imagen para ver pantalla completa',
			tapToClose: 'Pulse para cerrar',
			homePage: 'http://www.cdc.gov/spanish/',
			breadcrumb: 'CDC en Espa&ntilde;ol',
			share: 'Compartir',
			previous: 'Anterior',
			next: 'Siguiente',
			of: 'de',
			search: 'BUSCAR',
			back: 'VOLVER',
			addthistoyoursite: 'Agregue a su p&aacute;gina',
			watchOnYouTube: 'Ver video en YouTube',
			youTubeNotSupported: 'Videos de YouTube no est&aacute;n soportados por su navegador, por favor actualize su navegador',
			youTubeVideo: 'Video de Youtube',
			audioDownload: 'Descargar archivo de audio',
			javascriptBookmark: 'Su navegador web no permite agregar marcadores de p&aacute;ginas a trav&eacute;s de JavaScript. Por favor, a&ntilde;ada manualmente un marcador de p&aacute;gina usando el men&uacute; de marcadores de su navegador web',
			emailLink: '/TemplatePackage/3.0/includes/email/email-link.html',
			emailLinkConfirm: 'email-link-confirm.html',
			addThisToYourSiteLink: 'http://tools.cdc.gov/syndication/default.aspx?url='		
			// facebookLogo: 'TemplatePackage\3.0\images\esp\smRecommend_es.png',
			// twitterLogo: 'TemplatePackage\3.0\images\esp\smTweet_es.png',
			// linkedinLogo: 'TemplatePackage\3.0\images\esp\smLinkedIn_es.png'
		};
	
		return {
			/** 
			* @method get
			* @access public
			* @desc Get Constant in module by name based on determined site language
			* @return {String}
			*/
			get: function (w) {
				switch(this.getLanguage()) {
					case localES.languageCode:
						return localES[w];
						break;
					default:
						return local[w];
				}			
			},
	
			/** 
			* @method getConstant
			* @access public
			* @desc Generic method for getting the variables
			* @return {String}
			*/
			getConstant: function(constant) { return this.get(constant); },
			
			/** 
			* @method getTitle
			* @access public
			* @desc Get site title
			* @return {String}
			*/
			getTitle: function () { return this.get('title'); },
			/** 
			* @method getDescription
			* @access public
			* @desc Get site description
			* @return {String}
			*/
			getDescription: function () { return this.get('description'); },
			/** 
			* @method getAuthor
			* @access public
			* @desc Get site author
			* @return {String}
			*/
			getAuthor: function () { return this.get('author'); },
			/** 
			* @method getCharset
			* @access public
			* @desc Get site character set
			* @return {String}
			*/
			getCharset: function () { return this.get('charset'); },
			/** 
			* @method getMenuLabel
			* @access public
			* @desc Get lable for menu button
			* @return {String}
			*/
			getMenuLabel: function () { return this.get('menuLabel'); },
			/** 
			* @method getExternalIconTitle
			* @access public
			* @desc Get external icon title
			* @return {String}
			*/
			getExternalIconTitle: function () { return this.get('externalIconTitle'); },
			/** 
			* @method getExternalLink
			* @access public
			* @desc Get external disclaimer url
			* @return {String}
			*/
			getExternalLink: function () { return this.get('externalLink'); },
			/** 
			* @method getMobileCDCLogo
			* @access public
			* @desc Get CDC logo for mobile devices
			* @return {String}
			*/
			getMobileCDCLogo: function () { return this.get('mobileCDCLogo'); },
			/** 
			* @method getTapToViewText
			* @access public
			* @desc Get tap to view larger image text
			* @return {String}
			*/
			getTapToViewText: function () { return this.get('tapToView'); },
			/** 
			* @method getTapToViewText
			* @access public
			* @desc Get tap to view larger image text
			* @return {String}
			*/
			getTapToCloseText: function () { return this.get('tapToClose'); },
			/** 
			* @method getCDCLogo
			* @access public
			* @desc Get CDC logo URI
			* @return {String}
			*/
			getCDCLogo: function () { return this.get('CDCLogo'); },
			/** 
			* @method getLanguageLabel
			* @access public
			* @desc Get text label for pageoption langauage drop down
			* @return {String}
			*/
			getLanguageLabel: function () { return this.get('languageLabel'); },
			/** 
			* @method getLanguageCode
			* @access public
			* @desc Get site language code
			* @return {String}
			*/
			getLanguageCode: function () { return  this.get('languageCode'); },
			/** 
			* @method getLanguage
			* @access public
			* @desc Get window language
			* @return {String}
			*/
			getLanguage: function () { $('[data-cdc-microsite="ebola"]').hasClass('es-us') ? 'es-us' : 'en-us'; }
		};
	})();

	return CDC.Constants;

});
