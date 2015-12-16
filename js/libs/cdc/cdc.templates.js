define(['jquery', 'global', 'constants', 'HandlebarsExtended', 'policy'], function($, g, c, Handlebars, policy) {
	'use strict';

	var defaults = {
		templateType: 'collection',
		content: {}
	};

	var pageTemplateMarkup = '';
	pageTemplateMarkup += '		<div class="cdc-microsite">';
	pageTemplateMarkup += '			<div id="loading-indicator"><span class="fa fa-spinner fa-spin"></span></div>';
	pageTemplateMarkup += '			{{#if multipleLanguages}}';
	pageTemplateMarkup += '			<label id="language-select">';
	pageTemplateMarkup += '				<span>{{#ifCond language "==" "en-us"}}Language:{{else}}Idioma:{{/ifCond}}</span>';
	pageTemplateMarkup += '				{{#ifCond language "==" "es-us"}}';
	pageTemplateMarkup += '				<select id="language-select-dropdown">';
	pageTemplateMarkup += '					<option value="en-us"{{#ifCond language "==" "en-us"}}selected="selected"{{/ifCond}}>Ingl&eacute;s (English)</option>';
	pageTemplateMarkup += '					<option value="es-us"{{#ifCond language "==" "es-us"}}selected="selected"{{/ifCond}}>Espa&ntilde;ol (Spanish)</option>';
	pageTemplateMarkup += '				</select>';
	pageTemplateMarkup += '				{{else}}';
	pageTemplateMarkup += '				<select id="language-select-dropdown">';
	pageTemplateMarkup += '					<option value="en-us"{{#ifCond language "==" "en-us"}}selected="selected"{{/ifCond}}>English</option>';
	pageTemplateMarkup += '					<option value="es-us"{{#ifCond language "==" "es-us"}}selected="selected"{{/ifCond}}>Spanish</option>';
	pageTemplateMarkup += '				</select>';
	pageTemplateMarkup += '				{{/ifCond}}';
	pageTemplateMarkup += '			</label>';
	pageTemplateMarkup += '			{{/if}}';
	pageTemplateMarkup += '			<nav id="{{menuId}}">';
	pageTemplateMarkup += '				<ul>';
	pageTemplateMarkup += '					<li id="menu-button"><a href="#" id="menu-nav"><span class="fa fa-navicon"></span>';
	pageTemplateMarkup += '					{{#ifCond language "==" "es-us"}}MEN&Uacute;{{else}}MENU{{/ifCond}}';
	pageTemplateMarkup += '					</a></li>';
	pageTemplateMarkup += '				</ul>';
	pageTemplateMarkup += '			</nav>';
	pageTemplateMarkup += '			<div id="{{homePageId}}">';
	pageTemplateMarkup += '				<div class="row banner">';
	pageTemplateMarkup += '					<div class="col-md-12">';
	pageTemplateMarkup += '						<h1>{{banner.title}}</h1>';
	pageTemplateMarkup += '						<h2>{{banner.title}}</h2>';
	pageTemplateMarkup += '						{{#ifnotempty banner.description}}<p>{{banner.description}}</p>{{/ifnotempty}}';
	//pageTemplateMarkup += '						<p class="learn-more"><a href="{{banner.link}}" target="_blank">{{banner.learnMoreLabel}}</a></p>';
	pageTemplateMarkup += '					</div>';
	pageTemplateMarkup += '				</div>';
	pageTemplateMarkup += '				{{{relocatedContent}}}';
	pageTemplateMarkup += '				{{#each layout.rows}}';
	pageTemplateMarkup += '				<div class="{{cssClass}}">';
	pageTemplateMarkup += '					{{#each cols}}';
	pageTemplateMarkup += '					<div class="{{cssClass}}">';
	pageTemplateMarkup += '						{{#each modules}}';
	pageTemplateMarkup += '						<div {{#ifnotempty tagId}}id="{{tagId}}"{{/ifnotempty}} data-module-type="{{type}}" data-content-id="{{contentId}}" ';
	pageTemplateMarkup += '							data-module-style="{{style}}" data-css-class="{{cssClass}}" data-link-style="{{linkStyle}}" data-link-more-label="{{linkMoreLabel}}" data-show-icons="{{showIcons}}" ';
	pageTemplateMarkup += '							data-show-pubdate="{{showPubDate}}" data-show-summary="{{showSummary}}" data-show-images="{{showImages}}" data-max-items="{{maxItems}}" ';
	pageTemplateMarkup += '							data-enabled="{{enabled}}" data-enable-repost="{{enableRepost}}" data-enable-reply="{{enableReply}}" ';
	pageTemplateMarkup += '							{{#ifnotempty photosetId}}data-photoset-id="{{photosetId}}"{{/ifnotempty}} data-sort-by="{{sortBy}}" data-sort-direction="{{sortDirection}}" ';
	pageTemplateMarkup += '							{{#ifnotempty childCssClass}}data-child-css-class="{{childCssClass}}"{{/ifnotempty}} ';
	pageTemplateMarkup += '							{{#ifnotempty showChildImages}}data-show-child-images="{{showChildImages}}"{{/ifnotempty}} ';
	pageTemplateMarkup += '							{{#ifnotempty showChildIcons}}data-show-child-icons="{{showChildIcons}}"{{/ifnotempty}} ';
	pageTemplateMarkup += '							data-enable-external-link-icons="{{../../../enableExternalLinkIcons}}" data-enable-file-icons="{{../../../enableFileIcons}}" ';
	pageTemplateMarkup += '							data-header-text="{{headerText}}" data-header-link="{{headerLink}}" data-header-icon="{{headerIcon}}" data-new-window="{{newWindow}}"></div>';
	pageTemplateMarkup += '						{{/each}}';
	pageTemplateMarkup += '					</div>';
	pageTemplateMarkup += '					{{/each}}';
	pageTemplateMarkup += '				</div>';
	pageTemplateMarkup += '				{{/each}}';
	pageTemplateMarkup += '			</div>';
	pageTemplateMarkup += '			<div id="{{contentPageId}}">';
	pageTemplateMarkup += '				<div class="row banner">';
	pageTemplateMarkup += '					<div class="col-md-12">';
	pageTemplateMarkup += '						<a id="return" href="#" data-module-name="Banner"><span class="fa fa-chevron-left"></span>&nbsp;{{banner.title}}</a>';
	pageTemplateMarkup += '					</div>';
	pageTemplateMarkup += '				</div>';
	pageTemplateMarkup += '				<div class="row navigation">';
	pageTemplateMarkup += '					<div class="col-md-6 left">';
	pageTemplateMarkup += '						<button type="button" class="btn btn-default btn-sm"><span class="fa fa-chevron-left"></span>&nbsp;Previous article</button>';
	pageTemplateMarkup += '					</div>';
	pageTemplateMarkup += '					<div class="col-md-6 right">';
	pageTemplateMarkup += '						<button type="button" class="btn btn-default btn-sm">Next article&nbsp;<span class="fa fa-chevron-right"></span></button>';
	pageTemplateMarkup += '					</div>';
	pageTemplateMarkup += '				</div>';
	pageTemplateMarkup += '				<div class="row">';
	pageTemplateMarkup += '					<div class="col-md-12">';
	pageTemplateMarkup += '						<div id="{{contentPlaceholderId}}"></div>';
	pageTemplateMarkup += '					</div>';
	pageTemplateMarkup += '				</div>';
	pageTemplateMarkup += '			</div>';
	pageTemplateMarkup += '			<div id="{{contentNotAvailableId}}">';
	pageTemplateMarkup += '				<div class="row banner">';
	pageTemplateMarkup += '					<div class="col-md-12">';
	pageTemplateMarkup += '						<a id="return" href="#"><span class="fa fa-chevron-left"></span>&nbsp;{{banner.title}}</a>';
	pageTemplateMarkup += '					</div>';
	pageTemplateMarkup += '				</div>';
	pageTemplateMarkup += '				<div class="row">';
	pageTemplateMarkup += '					<div class="col-md-12">';
	pageTemplateMarkup += '						<div class="module type-C">';
	pageTemplateMarkup += '							<h3>Content Not Available</h3>';
	pageTemplateMarkup += '							<p>This content is no longer available on this site.</p>';
	pageTemplateMarkup += '						</div>';
	pageTemplateMarkup += '					</div>';
	pageTemplateMarkup += '				</div>';
	pageTemplateMarkup += '			</div>';
	pageTemplateMarkup += '			{{#if displayFileIconLegend}}';
	pageTemplateMarkup += '			<div class="row">';
	pageTemplateMarkup += '				<div class="col-md-12">';
	pageTemplateMarkup += '					<div id="plugin-legend">';
	pageTemplateMarkup += '						{{#ifCond language "==" "es-us"}}';
	pageTemplateMarkup += '						<h5>Ayuda con formatos de archivos:</h5><span><a href="http://www.cdc.gov/Other/plugins/" target="_blank">&iquest;C&oacute;mo se visualizan los diferentes formatos de archivos (PDF, DOC, PPT, MPEG) en este sitio?</a></span>';
	pageTemplateMarkup += '						<ul>';
	pageTemplateMarkup += '							<li class="plugin-pdf"><a href="http://www.cdc.gov/spanish/formatos.html#pdf"><span class="sprite-16-pdf">Archivo Adobe PDF </span></a></li>';
	pageTemplateMarkup += '							<li class="plugin-ppt"><a href="http://www.cdc.gov/spanish/formatos.html#ppt"><span class="sprite-16-ppt">Archivo Microsoft PowerPoint</span></a></li>';
	pageTemplateMarkup += '							<li class="plugin-word"><a href="http://www.cdc.gov/spanish/formatos.html#doc"><span class="sprite-16-word">Archivo Microsoft Word</span></a></li>';
	pageTemplateMarkup += '							<li class="plugin-excel"><a href="http://www.cdc.gov/spanish/formatos.html#xls"><span class="sprite-16-excel">Archivo Microsoft Excel</span></a></li>';
	pageTemplateMarkup += '							<li class="plugin-wmv"><a href="http://www.cdc.gov/spanish/formatos.html#wmv"><span class="sprite-16-wmv">Archivo Audio/Video</span></a></li>';
	pageTemplateMarkup += '							<li class="plugin-qt"><a href="http://www.cdc.gov/spanish/formatos.html#qt"><span class="sprite-16-qt">Archivo Apple Quicktime</span></a></li>';
	pageTemplateMarkup += '							<li class="plugin-real"><a href="http://www.cdc.gov/spanish/formatos.html#ram"><span class="sprite-16-rp">Archivo RealPlayer</span></a></li>';
	pageTemplateMarkup += '							<li class="plugin-text"><a href="http://www.cdc.gov/spanish/formatos.html#text"><span class="sprite-16-txt">Archivo Texto</span></a></li>';
	pageTemplateMarkup += '							<li class="plugin-zip"><a href="http://www.cdc.gov/spanish/formatos.html#zip"><span class="sprite-16-zip">Archivo Zip Comprimido</span></a></li>';
	pageTemplateMarkup += '							<li class="plugin-sas"><a href="http://www.cdc.gov/spanish/formatos.html#sas"><span class="sprite-16-sas">Archivo SAS</span></a></li>';
	pageTemplateMarkup += '							<li class="plugin-epub"><a href="http://www.cdc.gov/spanish/formatos.html#epub"><span class="sprite-16-ebook">Archivo ePub</span></a></li>';
	pageTemplateMarkup += '							<li class="plugin-ris"><a href="http://www.cdc.gov/spanish/formatos.html#ris"><span class="sprite-16-ris">Archivo RIS</span></a></li>';
	pageTemplateMarkup += '						</ul>';
	pageTemplateMarkup += '						{{else}}';
	pageTemplateMarkup += '						<h5>File Formats Help:</h5><span><a href="http://www.cdc.gov/Other/plugins/" target="_blank">How do I view different file formats (PDF, DOC, PPT, MPEG) on this site?</a></span>';
	pageTemplateMarkup += '						<ul>';
	pageTemplateMarkup += '							<li class="plugin-pdf"><a href="http://www.cdc.gov/Other/plugins/#pdf" target="_blank"><span class="sprite-16-pdf">Adobe PDF file</span></a></li>';
	pageTemplateMarkup += '							<li class="plugin-ppt"><a href="http://www.cdc.gov/Other/plugins/#ppt" target="_blank"><span class="sprite-16-ppt">Microsoft PowerPoint file</span></a></li>';
	pageTemplateMarkup += '							<li class="plugin-word"><a href="http://www.cdc.gov/Other/plugins/#doc" target="_blank"><span class="sprite-16-word">Microsoft Word file</span></a></li>';
	pageTemplateMarkup += '							<li class="plugin-excel"><a href="http://www.cdc.gov/Other/plugins/#xls" target="_blank"><span class="sprite-16-excel">Microsoft Excel file</span></a></li>';
	pageTemplateMarkup += '							<li class="plugin-wmv"><a href="http://www.cdc.gov/Other/plugins/#wmv" target="_blank"><span class="sprite-16-wmv">Audio/Video file</span></a></li>';
	pageTemplateMarkup += '							<li class="plugin-qt"><a href="http://www.cdc.gov/Other/plugins/#qt" target="_blank"><span class="sprite-16-qt">Apple Quicktime file</span></a></li>';
	pageTemplateMarkup += '							<li class="plugin-real"><a href="http://www.cdc.gov/Other/plugins/#ram" target="_blank"><span class="sprite-16-rp">RealPlayer file</span></a></li>';
	pageTemplateMarkup += '							<li class="plugin-text"><a href="http://www.cdc.gov/Other/plugins/#text" target="_blank"><span class="sprite-16-txt">Text file</span></a></li>';
	pageTemplateMarkup += '							<li class="plugin-zip"><a href="http://www.cdc.gov/Other/plugins/#zip" target="_blank"><span class="sprite-16-zip">Zip Archive file</span></a></li>';
	pageTemplateMarkup += '							<li class="plugin-sas"><a href="http://www.cdc.gov/Other/plugins/#sas" target="_blank"><span class="sprite-16-sas">SAS file</span></a></li>';
	pageTemplateMarkup += '							<li class="plugin-epub"><a href="http://www.cdc.gov/Other/plugins/#epub" target="_blank"><span class="sprite-16-ebook">ePub file</span></a></li>';
	pageTemplateMarkup += '							<li class="plugin-ris"><a href="http://www.cdc.gov/Other/plugins/#ris" target="_blank"><span class="sprite-16-ris">RIS file</span></a></li>';
	pageTemplateMarkup += '						</ul>';
	pageTemplateMarkup += '						{{/ifCond}}';
	pageTemplateMarkup += '					</div>';
	pageTemplateMarkup += '				</div>';
	pageTemplateMarkup += '			</div>';
	pageTemplateMarkup += '			{{/if}}';
	pageTemplateMarkup += '		</div>';

	var navTemplateMarkup = '';
	navTemplateMarkup += '		<ul>';
	navTemplateMarkup += '		{{#each listItem}}';
	navTemplateMarkup += '			<li><a {{#ifnumber contentId}}href="#{{contentId}}" data-source-href="{{contentId}}" data-content-id="{{contentId}}"{{else}}href="{{url}}"{{/ifnumber}} data-module-name="{{{moduleName}}}" target="_blank">{{{label}}}</a></li>';
	navTemplateMarkup += '		{{/each}}';
	navTemplateMarkup += '		</ul>';

	var moduleTemplateMarkup = '';
	moduleTemplateMarkup += '{{#if isNavBlock}}<nav>{{/if}}';
	moduleTemplateMarkup += '<div class="{{cssClass}}">';
	moduleTemplateMarkup += '	{{#if showHeaderIcon}}';
	moduleTemplateMarkup += '	<h3>';
	moduleTemplateMarkup += '	<span class="fa {{headerIcon}}"></span><span>{{{headerText}}}</span>';
	moduleTemplateMarkup += '	</h3>';
	moduleTemplateMarkup += '	{{else}}';
	moduleTemplateMarkup += '	<h3>';
	moduleTemplateMarkup += '	{{{headerText}}}';
	moduleTemplateMarkup += '	</h3>';
	moduleTemplateMarkup += '	{{/if}}';
	moduleTemplateMarkup += '	<ul class="{{listStyle}}{{#if showIcons}} icons{{/if}}">';
	moduleTemplateMarkup += '		{{#each listItem}}';
	moduleTemplateMarkup += '		<li>';
	moduleTemplateMarkup += '			{{#if showIcon}}';
	moduleTemplateMarkup += '				{{#if linkTitle}}';
	moduleTemplateMarkup += '				<a {{#ifnumber contentId}}data-content-id="{{contentId}}" href="#{{contentId}}" data-source-href="{{link}}" {{else}}href="{{link}}" {{/ifnumber}} {{#if showMoreInfoLink}}class="title-and-more" {{/if}}{{#if newWindow}}target="_blank" {{/if}} data-module-name="{{{../../headerText}}}"><div class="cdc-bullet-icon"><span class="fa {{iconClass}}"></span></div></a>';
	moduleTemplateMarkup += '				{{else}}';
	moduleTemplateMarkup += '				<div class="cdc-bullet-icon"><span class="fa {{iconClass}}"></span></div>';
	moduleTemplateMarkup += '				{{/if}}';
	moduleTemplateMarkup += '			{{/if}}';
	moduleTemplateMarkup += '			{{#if showImage}}';
	moduleTemplateMarkup += '				{{#if linkTitle}}';
	moduleTemplateMarkup += '				<a {{#ifnumber contentId}}data-content-id="{{contentId}}" href="#{{contentId}}" data-source-href="{{link}}" {{else}}href="{{link}}" {{/ifnumber}} {{#if showMoreInfoLink}}class="title-and-more" {{/if}}{{#if newWindow}}target="_blank" {{/if}} data-module-name="{{{../../headerText}}}"><img class="cdc-thumbnail" src="{{imageSource}}" alt="{{imageAltText}}" /></a>';
	moduleTemplateMarkup += '				{{else}}';
	moduleTemplateMarkup += '				<img class="cdc-thumbnail" src="{{imageSource}}" alt="{{imageAltText}}" />';
	moduleTemplateMarkup += '				{{/if}}';
	moduleTemplateMarkup += '			{{/if}}';
	moduleTemplateMarkup += '			<div class="list-item-content">';
	moduleTemplateMarkup += '				{{#if showPubDate}}';
	moduleTemplateMarkup += '				<div class="pubDate">{{{pubDate}}}</div>';
	moduleTemplateMarkup += '				{{/if}}';
	moduleTemplateMarkup += '				{{#if enableResponse}}';
	moduleTemplateMarkup += '					<div class="nowrap response">';
	moduleTemplateMarkup += '						{{#if enableRepost}}';
	moduleTemplateMarkup += '						<div class="retweet"><a href="{{repostUrl}}"><span class="fa fa-retweet"></span></a></div>';
	moduleTemplateMarkup += '						{{/if}}';
	moduleTemplateMarkup += '						{{#if enableReply}}';
	moduleTemplateMarkup += '						<div class="reply"><a href="{{replyUrl}}"><span class="fa fa-reply"></span></a></div>';
	moduleTemplateMarkup += '						{{/if}}';
	moduleTemplateMarkup += '					</div>';
	moduleTemplateMarkup += '				{{/if}}';
	moduleTemplateMarkup += '				{{#if linkTitle}}';
	moduleTemplateMarkup += '				<div class="title"><a {{#ifnumber contentId}}data-content-id="{{contentId}}" href="#{{contentId}}" data-source-href="{{link}}" {{else}}href="{{link}}" {{/ifnumber}} {{#if showMoreInfoLink}}class="title-and-more" {{/if}}{{#if newWindow}}target="_blank" {{/if}} data-module-name="{{{../../headerText}}}">{{{title}}}</a></div>';
	moduleTemplateMarkup += '				{{else}}';
	moduleTemplateMarkup += '				<div class="title">{{{title}}}</div>';
	moduleTemplateMarkup += '				{{/if}}';
	moduleTemplateMarkup += '				{{#if showSummary}}';
	moduleTemplateMarkup += '				<div class="summary">{{{summary}}}</div>';
	moduleTemplateMarkup += '				{{/if}}';
	moduleTemplateMarkup += '				{{#if showMoreInfoLink}}';
	moduleTemplateMarkup += '				<p class="morelink"><a {{#ifnumber contentId}}data-content-id="{{contentId}}" href="#{{contentId}}" data-source-href="{{link}}" data-page-title="{{{title}}}" {{else}}href="{{link}}" {{/ifnumber}} {{#if newWindow}}target="_blank" {{/if}} data-module-name="{{{../../headerText}}}">{{moreLabel}}&nbsp;<span class="fa fa-angle-right"></span></a></p>';
	moduleTemplateMarkup += '				{{/if}}';
	moduleTemplateMarkup += '			</div>';
	moduleTemplateMarkup += '		</li>';
	moduleTemplateMarkup += '		{{/each}}';
	moduleTemplateMarkup += '	</ul>';
	moduleTemplateMarkup += '</div>';
	moduleTemplateMarkup += '{{#if isNavBlock}}</nav>{{/if}}';

	var masterCollectionTemplateMarkup = '';
	masterCollectionTemplateMarkup += '{{#if isNavBlock}}<nav>{{/if}}';
	masterCollectionTemplateMarkup += '<div class="{{cssClass}}">';
	masterCollectionTemplateMarkup += '	{{#if showHeaderIcon}}';
	masterCollectionTemplateMarkup += '	<h3>';
	masterCollectionTemplateMarkup += '	<span class="fa {{headerIcon}}"></span><span>{{{headerText}}}</span>';
	masterCollectionTemplateMarkup += '	</h3>';
	masterCollectionTemplateMarkup += '	{{else}}';
	masterCollectionTemplateMarkup += '	<h3>';
	masterCollectionTemplateMarkup += '	{{{headerText}}}';
	masterCollectionTemplateMarkup += '	</h3>';
	masterCollectionTemplateMarkup += '	{{/if}}';
	masterCollectionTemplateMarkup += '	{{#each childCollection}}';
	masterCollectionTemplateMarkup += '	<div class="{{childCssClass}}">';
	masterCollectionTemplateMarkup += '		<h4>';
	masterCollectionTemplateMarkup += '		{{{headerText}}}';
	masterCollectionTemplateMarkup += '		</h4>';
	masterCollectionTemplateMarkup += '		<ul class="{{listStyle}}{{#if showIcons}} icons{{/if}}">';
	masterCollectionTemplateMarkup += '			{{#each listItem}}';
	masterCollectionTemplateMarkup += '			<li>';
	masterCollectionTemplateMarkup += '				{{#if showChildIcon}}';
	masterCollectionTemplateMarkup += '				<div class="cdc-bullet-icon"><span class="fa {{iconClass}}"></span></div>';
	masterCollectionTemplateMarkup += '				{{/if}}';
	masterCollectionTemplateMarkup += '				{{#if showChildImage}}';
	masterCollectionTemplateMarkup += '				<img class="cdc-thumbnail" src="{{imageSource}}" alt="{{imageAltText}}" />';
	masterCollectionTemplateMarkup += '				{{/if}}';
	masterCollectionTemplateMarkup += '				<div class="list-item-content">';
	masterCollectionTemplateMarkup += '					{{#if showPubDate}}';
	masterCollectionTemplateMarkup += '					<div class="pubDate">{{{pubDate}}}</div>';
	masterCollectionTemplateMarkup += '					{{/if}}';
	masterCollectionTemplateMarkup += '					{{#if enableResponse}}';
	masterCollectionTemplateMarkup += '						<div class="nowrap response">';
	masterCollectionTemplateMarkup += '							{{#if enableRepost}}';
	masterCollectionTemplateMarkup += '							<div class="retweet"><a href="{{repostUrl}}"><span class="fa fa-retweet"></span></a></div>';
	masterCollectionTemplateMarkup += '							{{/if}}';
	masterCollectionTemplateMarkup += '							{{#if enableReply}}';
	masterCollectionTemplateMarkup += '							<div class="reply"><a href="{{replyUrl}}"><span class="fa fa-reply"></span></a></div>';
	masterCollectionTemplateMarkup += '							{{/if}}';
	masterCollectionTemplateMarkup += '						</div>';
	masterCollectionTemplateMarkup += '					{{/if}}';
	masterCollectionTemplateMarkup += '					{{#if linkTitle}}';
	masterCollectionTemplateMarkup += '					<div class="title"><a {{#ifnumber contentId}}data-content-id="{{contentId}}" href="#{{contentId}}" data-source-href="{{link}}" {{else}}href="{{link}}" {{/ifnumber}} {{#if showMoreInfoLink}}class="title-and-more" {{/if}}{{#if newWindow}}target="_blank" {{/if}} data-module-name="{{{../../headerText}}}">{{{title}}}</a></div>';
	masterCollectionTemplateMarkup += '					{{else}}';
	masterCollectionTemplateMarkup += '					<div class="title">{{{title}}}</div>';
	masterCollectionTemplateMarkup += '					{{/if}}';
	masterCollectionTemplateMarkup += '					{{#if showSummary}}';
	masterCollectionTemplateMarkup += '					<div class="summary">{{{summary}}}</div>';
	masterCollectionTemplateMarkup += '					{{/if}}';
	masterCollectionTemplateMarkup += '					{{#if showMoreInfoLink}}';
	masterCollectionTemplateMarkup += '					<p class="morelink"><a {{#ifnumber contentId}}data-content-id="{{contentId}}" href="#{{contentId}}" data-source-href="{{link}}" data-page-title="{{{title}}}" {{else}}href="{{link}}" {{/ifnumber}} {{#if newWindow}}target="_blank" {{/if}} data-module-name="{{{../../headerText}}}">{{moreLabel}}&nbsp;<span class="fa fa-angle-right"></span></a></p>';
	masterCollectionTemplateMarkup += '					{{/if}}';
	masterCollectionTemplateMarkup += '				</div>';
	masterCollectionTemplateMarkup += '			</li>';
	masterCollectionTemplateMarkup += '			{{/each}}';
	masterCollectionTemplateMarkup += '		</ul>';
	masterCollectionTemplateMarkup += '	</div>';
	masterCollectionTemplateMarkup += '	{{/each}}';
	masterCollectionTemplateMarkup += '</div>';
	masterCollectionTemplateMarkup += '{{#if isNavBlock}}</nav>{{/if}}';

	var flickrFeedTemplateMarkup = '';
	flickrFeedTemplateMarkup += '<h3><a href="{{link}}">{{title}}</a></h3>';
	flickrFeedTemplateMarkup += '<div id="slider" class="flexslider cdc-slider">';
	flickrFeedTemplateMarkup += '	<ul class="slides">';
	flickrFeedTemplateMarkup += '		{{#each photos}}';
	flickrFeedTemplateMarkup += '		<li data-url="{{link}}" data-title="{{title}}">';
	flickrFeedTemplateMarkup += '			<a href="{{link}}" target="_blank"><img src="{{src}}" alt="{{title}}" /></a>';
	flickrFeedTemplateMarkup += '			<div class="flex-caption">';
	flickrFeedTemplateMarkup += '				<p><strong>{{title}}</strong></p>';
	flickrFeedTemplateMarkup += '			</div>';
	flickrFeedTemplateMarkup += '		</li>';
	flickrFeedTemplateMarkup += '		{{/each}}';
	flickrFeedTemplateMarkup += '	</ul>';
	flickrFeedTemplateMarkup += '</div>';
	flickrFeedTemplateMarkup += '<div id="carousel" class="flexslider cdc-carousel">';
	flickrFeedTemplateMarkup += '	<ul class="slides">';
	flickrFeedTemplateMarkup += '		{{#each photos}}';
	flickrFeedTemplateMarkup += '		<li>';
	flickrFeedTemplateMarkup += '			<img src="{{src}}" alt="{{title}}" />';
	flickrFeedTemplateMarkup += '		</li>';
	flickrFeedTemplateMarkup += '		{{/each}}';
	flickrFeedTemplateMarkup += '	</ul>';
	flickrFeedTemplateMarkup += '</div>';

	var mediaViewerTemplateMarkup = '';
       
	mediaViewerTemplateMarkup += '  <div class="cdc-media-viewer-embed">';
	mediaViewerTemplateMarkup += '      <span class="fa fa-times close-embed"></span><strong>Embed This</strong>';
	mediaViewerTemplateMarkup += '      <div>Copy and paste the following code into the body of any Web page to embed this widget.</div>';
	mediaViewerTemplateMarkup += '      <textarea onclick="this.focus();this.select()" readonly>{{embedCode}}</textarea>';
	mediaViewerTemplateMarkup += '  </div>';
	mediaViewerTemplateMarkup += '     <h3><a href="{{link}}" title="{{title}}"{{#if newWindow}} target="_blank"{{/if}}>{{title}}</a></h3>';
	mediaViewerTemplateMarkup += '     <div id="cdc-slider-{{uniqueId}}" data-uid="{{uniqueId}}" class="flexslider cdc-slider">';
	mediaViewerTemplateMarkup += '         <div class="social-toolbox" id="cdc-social-{{uniqueId}}">';
	mediaViewerTemplateMarkup += '              <div id="msSocialMediaShareContainer-{{uniqueId}}" data-url="" data-syndication="false">' +
                                     '                  <div class="ms_share_container noLinking">'+
                                     '                      <a class="ms_share_button" href="#msSocialMediaShareContainer-{{uniqueId}}" ><img src="//' + CDC.Microsite.hostName + '/microsites/ebola/images/sm-plus.gif" alt="Share" /></a>'+
                                     '                  </div>'+
                                     '              </div>';
	mediaViewerTemplateMarkup += '             <a class="embed-button" title="Embed"><img src="//' + CDC.Microsite.hostName + '/microsites/ebola/images/code.png" alt="Share" /></a>';
	mediaViewerTemplateMarkup += '             <a class="info-button" title="Info" href="http://www.cdc.gov/syndication/microsites/ebola/about.html"><span class="fa fa-info-circle"></span></a>';
	mediaViewerTemplateMarkup += '         </div>';
	mediaViewerTemplateMarkup += '         <ul class="slides">';
	mediaViewerTemplateMarkup += '		{{#each mediaItems}}';
	mediaViewerTemplateMarkup += '                 {{#if isVideo}}';
	mediaViewerTemplateMarkup += '                     <li data-url="{{sourceUrl}}" data-title="{{title}}" data-videoid="{{videoId}}">';
	mediaViewerTemplateMarkup += '                         <div class="videoContainer">';
	mediaViewerTemplateMarkup += '                             <iframe id="player-{{videoId}}" class="ytplayer" width="600" height="450" src="https://www.youtube-nocookie.com/embed/{{videoId}}?enablejsapi=1&rel=0&wmode=transparent&modestbranding=1" frameborder="0" allowfullscreen></iframe>';
	mediaViewerTemplateMarkup += '                         </div>';
	mediaViewerTemplateMarkup += '                         <div class="flex-caption">';
	mediaViewerTemplateMarkup += '                         {{#if ../../newWindow}}';
	mediaViewerTemplateMarkup += '                              <p>{{description}}&nbsp;&nbsp;<a tabindex="-1" target="_blank" href="{{targetUrl}}" title="{{title}}">More&raquo;</a></p>';
	mediaViewerTemplateMarkup += '                         {{else}}';
	mediaViewerTemplateMarkup += '                              <p>{{description}}&nbsp;&nbsp;<a tabindex="-1" href="{{targetUrl}}" title="{{title}}">More&raquo;</a></p>';
	mediaViewerTemplateMarkup += '                         {{/if}}';
	mediaViewerTemplateMarkup += '                         </div>';
	mediaViewerTemplateMarkup += '                     </li>';
	mediaViewerTemplateMarkup += '                 {{else}}';
	mediaViewerTemplateMarkup += '                     <li data-url="{{moreInfoUrl}}" data-title="{{title}}">';
	mediaViewerTemplateMarkup += '                         {{#if ../../newWindow}}';
	mediaViewerTemplateMarkup += '                              <a href="{{moreInfoUrl}}" target="_blank" title="{{title}}"><img tabindex="-1" src="{{mainSrc}}" alt="{{title}}" /></a>';
	mediaViewerTemplateMarkup += '                         {{else}}';
	mediaViewerTemplateMarkup += '                              <a href="{{moreInfoUrl}}" title="{{title}}"><img tabindex="-1" src="{{mainSrc}}" alt="{{title}}" /></a>';
	mediaViewerTemplateMarkup += '                         {{/if}}';
	mediaViewerTemplateMarkup += '                         <div class="flex-caption">';
	mediaViewerTemplateMarkup += '                         {{#if ../../newWindow}}';
	mediaViewerTemplateMarkup += '                              <p>{{description}}&nbsp;&nbsp;<a tabindex="-1" href="{{moreInfoUrl}}" target="_blank"  title="{{title}}">More&raquo;</a></p>';
	mediaViewerTemplateMarkup += '                         {{else}}';
	mediaViewerTemplateMarkup += '                              <p>{{description}}&nbsp;&nbsp;<a tabindex="-1" href="{{moreInfoUrl}}" title="{{title}}">More&raquo;</a></p>';
	mediaViewerTemplateMarkup += '                         {{/if}}';
	mediaViewerTemplateMarkup += '                         </div>';
	mediaViewerTemplateMarkup += '                     </li>';
	mediaViewerTemplateMarkup += '                 {{/if}}';
	mediaViewerTemplateMarkup += '		{{/each}}';
	mediaViewerTemplateMarkup += '         </ul>';
	mediaViewerTemplateMarkup += '     </div>';
	mediaViewerTemplateMarkup += '     <div class="slider-paging">';
	mediaViewerTemplateMarkup += '          <span class="slide-current-slide">1</span>';
	mediaViewerTemplateMarkup += '          <span class="slide-total-slides"> of {{mediaItems.length}}</span>';
	mediaViewerTemplateMarkup += '     </div>';
	mediaViewerTemplateMarkup += '     <div id="cdc-carousel-{{uniqueId}}" data-uid="{{uniqueId}}" class="flexslider cdc-carousel">';
	mediaViewerTemplateMarkup += '         <ul class="slides">';
	mediaViewerTemplateMarkup += '		{{#each mediaItems}}';
	mediaViewerTemplateMarkup += '		<li>';
	mediaViewerTemplateMarkup += '			<img src="{{thumbSrc}}" alt="View slide for {{title}}" />';
	mediaViewerTemplateMarkup += '		</li>';
	mediaViewerTemplateMarkup += '		{{/each}}';
	mediaViewerTemplateMarkup += '         </ul>';
	mediaViewerTemplateMarkup += '     </div>';

	var templateMarkup = {
		page: pageTemplateMarkup,
		navigation: navTemplateMarkup,
		module: moduleTemplateMarkup,
		masterCollection: masterCollectionTemplateMarkup,
		flickrFeed: flickrFeedTemplateMarkup,
		mediaViewer: mediaViewerTemplateMarkup
	};

	// funtion //////////////////////////
	$.fn.templates = function(options) {

		options = $.extend({}, defaults, options);

		var template;
		if (options.templateType === 'page') {
			template = Handlebars.compile(templateMarkup.page);
		} else if (options.templateType === 'navigation') {
			template = Handlebars.compile(templateMarkup.navigation);
		} else if (options.templateType === 'collection') {
			template = Handlebars.compile(templateMarkup.module);
		} else if (options.templateType === 'master-collection') {
			template = Handlebars.compile(templateMarkup.masterCollection);
		} else if (options.templateType === 'feed') {
			template = Handlebars.compile(templateMarkup.module);
		} else if (options.templateType === 'twitter-feed') {
			template = Handlebars.compile(templateMarkup.module);
		} else if (options.templateType === 'flickr-feed') {
			template = Handlebars.compile(templateMarkup.mediaViewer);
		} else if (options.templateType === 'media-viewer') {
			template = Handlebars.compile(templateMarkup.mediaViewer);
		} else {
			template = Handlebars.compile(templateMarkup.module);
		}
		$(this).append(template(options.content));

		if (options.content.enableFileIcons && options.templateType !== 'page') {
			policy.Documents.init($(this));
		}

		if (options.content.enableExternalLinkIcons && options.templateType !== 'page') {
			policy.External.init($(this));
		}

	};

	return $.fn.templates;

});
