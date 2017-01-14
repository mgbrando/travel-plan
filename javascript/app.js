'use strict';

//const Translate = require('@google/translate');

(function($) {
    $.fn.goTo = function() {
        $('html, body').animate({
            scrollTop: $(this).offset().top + 'px'
        }, 'fast');
        return this; // for chaining...
    }

    $.fn.goToTop = function() {
        $('html, body').animate({
            scrollTop: 0+'px'
        }, 'fast');
        return this; // for chaining...
    }

	$.fn.fixMenu = function (pos) {
    	var $this = this,
        	$window = $(window);

    	$window.scroll(function (e) {
        	if ($window.scrollTop() <= pos) {
            	$this.css({
                	position: 'absolute',
                	top: pos
            });
            $(this).removeClass('highest-index');
        	} else {
            	$this.css({
                	position: 'fixed',
                	top: 0,
                	left: 0,
                	right: 0
            });
            $(this).addClass('highest-index');
        }
    });
};
})(jQuery);



var photoTemplate='<img src="" alt="">';
/*var imageLinksTemplate= '<a href="images/banana.jpg" title="Banana" data-gallery>'+
        					'<img src="images/thumbnails/banana.jpg" alt="Banana">'+
    					'</a>'+
    					'<a href="images/apple.jpg" title="Apple" data-gallery>'+
        					'<img src="images/thumbnails/apple.jpg" alt="Apple">'+
    					'</a>'+
    					'<a href="images/orange.jpg" title="Orange" data-gallery>'+
        					'<img src="images/thumbnails/orange.jpg" alt="Orange">'+
    					'</a>';*/
var descriptionTemplate='<header>Location: <span class="js-location location"></span></header>'+
						'';
var entertainmentTemplate=	'<section class="js-entertainment entertainment">'+
								'<header>Top Entertainment Spots</header>'+
						   	'</section>';

var eventsTemplate='<section class="js-events events">'+
						'<header>Events</header>'+
				    '</section>';

var flickr={
	BASE_URL: 'https://api.flickr.com/services/rest/',
	config: {},
	imageArray: [],
	init: function(options){
		options = options || {};

		this.config.api_key=options.api_key;
	},

	searchPhotosByGeography: function(position){
		//35.6895° N, 139.6917° E
		console.log(position.lat()+ ", " + position.lng());
		/*$.ajax({
				type: "GET",
				url: this.BASE_URL+this.media, 
				data: {client_id: this.config.client_id, access_token: this.config.access_token, scope:'basic+public_content+comments', lat: 40.7128, lng: 74.0059, distance: 5000},
				dataType: "jsonp",
				callback: renderImages*/
				/*success: renderImages{client_id: this.config.clientID, lat: 35.6895, lng: 139.6917}, renderImages*/
			/*});*/
			//$.getJSON(this.BASE_URL, {method: 'flickr.photos.search', api_key: this.config.api_key, format: 'json', has_geo: 1, lat: 35.6895, lng: 35.6895}, jsonFlickrApi);
			$.ajax({
				type: "GET",
				url: this.BASE_URL,
				data: {method: 'flickr.photos.search', api_key: this.config.api_key, format: 'json', media: 'photos', 
				tags: 'nature, museum, forest, architecture, venue, scenery', sort: 'interestingness-desc', content_type: 1, 
				accuracy: 11, has_geo: 2, lat: position.lat(), lon: position.lng(), extras: 'url_t, url_n, url_o'},
				dataType: "jsonp"
			});
	},

	echoTest: function(echoValue){
		makeCORSrequest(BASE_URL+echoValue);
	}
};
var eventful={
	BASE_URL: 'https://api.eventful.com/json/events/search',
	config: {},
	init: function(options){
		options = options || {};

		this.config.api_key=options.api_key;
		this.config.user_language=options.user_language;
	},	
	getNearbyEvents: function(location){
			console.log('NEARBY EVENTS: '+location);
			//console.log(location["lat"]);
			$.ajax({
				type: "GET",
				url: this.BASE_URL,//+queryString,
				data: {app_key: this.config.api_key, location: location,
								 within: 10, date: 'Future'},
				dataType: "jsonp",
				/*jsonp: 'callback',
				jsonpCallback: 'renderNearbyEvents',*/
				success: renderNearbyEvents
			});
			/*makeCORSrequest('http://api.eventful.com/json/events/search?app_key='+this.config.api_key+
				'&where='+location.lat+','+location.lng+'&within=10&date=Future');*/
	},
	addEvents: function(results, element){
		if(results.events===null){
			element.filter('.js-events').append('<div class="no-results">NO EVENTS ARE CURRENTLY NEARBY</div>');
			$('.js-top-events').append(element);
		}
		else{
			for(var i=0; i < results.events.event.length; i++){
				element.filter('.js-events').append('<ul class="js-event-list-'+i+' event-list"></ul>');
				$('.js-top-events').append(element);
				var event=results.events.event[i];
				/*var properties=[results.events.event[i].title, results.events.event[i].venue_name, results.events.event[i].city_name,
							results.events.event[i].country_name,];
				for(var property in results.events.event[i]){
				if(i===0){
					console.log(property);
					//console.log(results.events.event[i]);
				}
				if(results.events.event[i][property]!==null)
					$('.js-event-list-'+i).append('<li><span class="property">'+property.toUpperCase()+'</span>: '+results.events.event[i][property]+'</li>');
				}*/
				//var properties=Object.keys(event);
				/*if(googleMaps.eventMarkersOn)
				updateEventMarker({lat: Number(event.latitude), lng: Number(event.longitude)}, event.title);*/
				/*var start_time='';
				var end_time='';
				var description='';*/
				if(event.start_time===undefined)
					event.start_time='not specified';
				if(event.end_time===undefined)
					event.end_time='not specified';
				if(event.description===null)
					event.description='N/A';

				googleMaps.addEventMarker(event.title, {lat: Number(event.latitude), lng: Number(event.longitude)});
				//console.log(event.image.medium.url);
				var photo_url='';
				/*console.log((''+event.image.medium.url).replace('file', 'http'));
				if(event.image)
					$('.js-events').append('<img src="'+(event.image.medium.url).replace('file', 'http')+'" alt="'+event.title+'">');*/
				$('.js-event-list-'+i).append('<li><span class="property">EVENT</span>: <a href="'+event.url+'" target="_blank">'+event.title+'</a></li>'+
										  '<li><span class="property">VENUE</span>: <a href="'+event.venue_url+'" target="_blank">'+event.venue_name+'</a></li>'+
										  '<li><span class="property">CITY</span>: '+event.city_name+', '+event.region_name+' - '+event.country_name+'</li>'+
										  '<li><span class="property">VENUE</span>: '+event.venue_address+'</li>'+
										  '<li><span class="property">START TIME</span>: '+event.start_time+'</li>'+
										  '<li><span class="property">END TIME</span>: '+event.end_time+'</li>'+
										  '<li><span class="property">DESCRIPTION</span>: <div class="comment">'+event.description+'</div></li>');
		 	}
		}
		$('.comment').shorten({
			"showChars": 300,
			"moreText": "Read more...",
			"lessText": "Show less..."
		});
	}
};
var yandexTranslate={
	BASE_URL: 'https://translate.yandex.net/api/v1.5/tr.json',
	TRANSLATE_EXT: '/translate',
	GETLANGS_EXT: '/getLangs',
	current_location: {lat: 36.204824, lng: 138.252924},
	current_language: 'Japanese',
	current_language_sn: 'ja',
	attraction_translations: 0,
	/*attraction_translation_done: false,
	event_translations_done: false,*/
	languages: {},
	config: {},

	init: function(options){
		options = options || {};

		this.config.api_key=options.api_key;
		this.config.user_language=options.user_language;
	},
	translateRequest: function(property, to_translate, elementNumber){
			//var parameters={key: this.config.api_key, format: 'json', callback: callback, target: this.config.user_language};
			/*var url=this.BASE_URL+'?';
			if(Array.isArray(text)){
				text.forEach(function(element){
					url+='q='+element+'&';
				});
			}
			else
				url+='q='+text;*/
			/*console.log('Text: '+to_translate);
			var queryString='?';*///'?key='+this.config.api_key+'&lang='+this.config.user_language+'&options='+1+'&callback='+callback;
			//var translateType = typeof to_translate;
			/*if(typeof to_translate==='object'){
				for(var property in to_translate){
					queryString+='&text='+to_translate[property];
				}
			}
			else{*/
				//queryString+='&text='+to_translate;
				//queryString+='&text='+to_translate;
			//}
			/*console.log('Querystring: '+queryString);
			console.log('Complete URL: '+this.BASE_URL+queryString);*/
			//$.getJSON(this.BASE_URL+queryString, {key: this.config.api_key, lang: this.config.user_language, options: 1}, renderName);
			var deferred=$.Deferred();
			$.ajax({
				type: "GET",
				url: this.BASE_URL+this.TRANSLATE_EXT,//+queryString,
				data: {key: this.config.api_key, lang: this.config.user_language, options: 1, text: to_translate},
				dataType: "jsonp",
				/*jsonp: 'callback',
				jsonpCallback: 'renderName',*/
				success: function(results){renderTranslatedDetail(results, property, elementNumber); deferred.resolve(property);}
			});
			return deferred.promise();
	},
	translateTextBox: function(textToTranslate){
			$.ajax({
				type: "GET",
				url: this.BASE_URL+this.TRANSLATE_EXT,//+queryString,
				data: {key: this.config.api_key, lang: this.config.user_language+'-'+this.current_language_sn, options: 1, text: textToTranslate},
				dataType: "jsonp",
				/*jsonp: 'callback',
				jsonpCallback: 'renderName',*/
				success: renderTextBoxTranslation
			});
	},
	getTranslationHeaderLanguage: function(){
			$.ajax({
				type: "GET",
				url: this.BASE_URL+this.GETLANGS_EXT,//+queryString,
				data: {key: this.config.api_key, ui: this.config.user_language},
				dataType: "jsonp",
				/*jsonp: 'callback',
				jsonpCallback: 'renderName',*/
				success: function(results){
					console.log(results.langs);
					/*Object.keys(results.langs).forEach(function(key){
						console.log('LANGUAGES: '+results.langs); 
					});*/
					renderTranslationHeader(results.langs[yandexTranslate.current_language]);
				}
			});
	},
	getLanguageName: function(){
		var deferred=$.Deferred();
			$.ajax({
				type: "GET",
				url: this.BASE_URL+this.GETLANGS_EXT,//+queryString,
				data: {key: this.config.api_key, ui: this.config.user_language},
				dataType: "jsonp",
				/*jsonp: 'callback',
				jsonpCallback: 'renderName',*/
				success: function(results){
					console.log(results.langs);
					/*Object.keys(results.langs).forEach(function(key){
						console.log('LANGUAGES: '+results.langs); 
					});*/
					console.log(results.langs[yandexTranslate.current_language_sn]);
					yandexTranslate.current_language=results.langs[yandexTranslate.current_language_sn];
					//renderTranslationHeader(results.langs[yandexTranslate.current_language]);
					deferred.resolve('OK');
				}
			});
		return deferred.promise();
	},
	//FIX THIS geocode is giving a weird number instead of a 2 letter short_name
	setCurrentLanguage: function(countryCode){
			var deferred=$.Deferred();
			$.ajax({
				type: "GET",
				url: 'https://restcountries.eu/rest/v1/alpha?codes='+countryCode,//+queryString,
				//dataType: "jsonp",
				/*jsonp: 'callback',
				jsonpCallback: 'renderName',*/
				success: function(results){
					console.log(results);
					yandexTranslate.current_language_sn=results[0].languages[0];
					//yandexTranslate.current_language=results[0].languages[0];
					var promise=yandexTranslate.getLanguageName();
					promise.then(function(status){deferred.resolve('OK');});
				}
			});
			return deferred.promise();
	},
	//https://restcountries.eu/rest/v1/lang/et
	speakTranslation: function(){
			$.ajax({
				type: "GET",
				url: this.BASE_URL+this.GETLANGS_EXT,//+queryString,
				data: {key: this.config.api_key, ui: this.config.user_language},
				dataType: "jsonp",
				/*jsonp: 'callback',
				jsonpCallback: 'renderName',*/
				success: function(results){
					var language=results.langs[yandexTranslate.current_language_sn];
					if(language==='English')
						language='US English';
						responsiveVoice.speak($('.js-text-translation').text(), language+' Female');
				}
			});
	},
	locationChanged: function(currentLocation){
		if(this.current_location!==currentLocation)
			return true;
		return false;
	}
};
/*var googleTranslate={
	TRANSLATE_BASE_URL: 'https://translation.googleapis.com/language/translate/v2',
	config: {},

	init: function(options){
		options = options || {};

		this.config.api_key=options.api_key;
		this.config.user_language=options.user_language;
	},
	translateRequest: function(text, callback){
			//var parameters={key: this.config.api_key, format: 'json', callback: callback, target: this.config.user_language};
			var url=this.BASE_URL+'?';
			if(Array.isArray(text)){
				text.forEach(function(element){
					url+='q='+element+'&';
				});
			}
			else
				url+='q='+text;

			$.ajax({
				type: "GET",
				url: url,
				data: {key: this.config.api_key, format: 'json', callback: callback, target: this.config.user_language},
				dataType: "jsonp"
			});
	}/*,
	translateTextBox: function(text){

	},
	translateLocations: function(textArray){

	}

};*/
var googleMaps={
	MAPS_BASE_URL: 'https://maps.googleapis.com/maps/api/js',
	GEOCODER_BASE_URL: 'https://maps.googleapis.com/maps/api/geocode/json',
	PLACES_BASE_URL: 'https://maps.googleapis.com/maps/api/place',
	PLACES_SEARCH: '/nearbysearch/json',
	PLACES_DETAILS: '/details/json',
	ICON_BASE_URL: 'https://maps.google.com/mapfiles/kml/paddle/',
	icons: {position: 'red-stars.png', places: 'lv.png', events: 'grn-stars-lv.png'},
	search_type: null,
	place_id: null,
	latlng: null,
	geocoder: null,
	placeService: null,
	currentLocation: {	details: null,
						language: null,
						nearbyAttractions: null,
						events: null,

						init: function(options){
							options=options || {};

							this.details=details;
							this.language=language;
							this.nearbyAttractions=nearbyAttractions;
							this.events=events;
						}
	},
	maps: {searchMap: {map: null, marker: null, placeMarkersOn: false, eventMarkersOn: false, placesMarkers: [], eventsMarkers: []}, imageMap: {map: null, marker: null}},
	config:{},

	init: function(options){
		options = options || {};

		this.config.api_key=options.api_key;
	},
	getPlaceDetails: function(place_id){
		this.placeService.getDetails({location: place_id}, renderPlaceDetails);
	},
	getNearbyPlaces: function(position){
		console.log('LOCATION: '+position);
		this.placeService.nearbySearch({location: position, radius: 5000, keyword: 'entertainment'}, renderNearbyPlaces);
	},
	translate: function(input, target){
		if(!Array.isArray(input)){
			input=[input];
		}

	},
	addEntertainmentDetails(place, elementNumber, contentTemplate){
		//var attractionContent=$(topAttractionsTemplate);
		//var translated=yandexTranslate.translateRequest(place.name, 'renderName');
		/*for(var property in translated){
			console.log(property+': '+translated[property]);
			if(typeof place[property]==='string'){
				yandexTranslate.translateRequest(place[property], 'renderName');
				//console.log('Translated Property: '+yandexTranslate.translateRequest(place[property], 'renderName'));
			}
		}*/
		//console.log('Translated Place: '+translated.text);
		/*for(var property in place){
			console.log(property+': '+place[property]);
			if(typeof place[property]==='string'){
				console.log('Translated Property: '+yandexTranslate.translateRequest(place[property], 'renderName'));
			}
		}*/
		//console.log(place);
		var photo='';
		if(place.photos){
			//console.log(place.photos);
				photo='<img src="'+place.photos[0].getUrl({maxWidth: 100, maxHeight: 100})+'">';
		}
		var rating='';
		if(place.rating){
			rating=place.rating;
		}
		else
			rating="N/A";
        contentTemplate.filter('.js-entertainment').append('<div class="place-wrapper"><div class="place-elements"><div class="left-elements">'+photo+'<div class="place-stats"><img class="place-icon" src="'+place.icon+'">'+
        	'<div class="rating"><span class="property">Rating:</span>'+rating+'</div></div></div></div><ul class="js-entertainment-list-'+elementNumber+' entertainment-list">'+
        			'</ul></div>');
        /*for(var property in place){
			console.log(property+': '+place[property]);
			if(typeof place[property]==='string' && place[property]!=='GOOGLE' && place[property]!==undefined){
				yandexTranslate.translateRequest(property+': '+place[property], elementNumber, 'renderDetail');
				console.log('Translated Property: '+yandexTranslate.translateRequest(place[property], 'renderName'));
			}
			else{ console.log(place[property]);}
		}*/
		/*yandexTranslate.translateRequest(place.name, elementNumber)
			.promise().done()
			.promise().done();*/
			//yandexTranslate.translateRequest('name', place.name, elementNumber).done(yandexTranslate.translateRequest('vicinity', place.vicinity, elementNumber).done(yandexTranslate.translateRequest('type', place.types[0], elementNumber)));
			var promise=yandexTranslate.translateRequest('name', place.name, elementNumber);
			promise.then(function(status){var promise2=yandexTranslate.translateRequest('vicinity', place.vicinity, elementNumber);
						promise2.then(function(status){
							var types='';
							for(var i=0; i<place.types.length; i++){
								types+=place.types[i]+", ";
							}
							$('.js-entertainment-list-'+elementNumber).append('<li><span class="property">TYPE</span>: '+types.replace(/_/g, ' ')+'</li>');
						});});
						/*yandexTranslate.translateRequest('type', place.types[0], elementNumber)*///});});
			/*$.when(yandexTranslate.translateRequest('name', place.name, elementNumber))
				.then($.when(yandexTranslate.translateRequest('vicinity', place.vicinity, elementNumber))
					.then(yandexTranslate.translateRequest('type', place.types[0], elementNumber)));*/
                /*			'<li>'+place.name+'</li>'+
        			'<li>'+place.formatted_address+'</li>'+
        			'<li>'+place.formatted_phone_number+'</li>'+
        			'<li>'+place.url+'</li>'+
        			'<li>'+place.vicinity+'</li>'+*/
        //return contentTemplate;
	},
	addPlaces: function(places){
		var attractionContent=$(entertainmentTemplate);
		var map=null;
		if(this.maps.searchMap.placeMarkersOn){
			map=this.maps.searchMap.map;
		}
			for(var i=0; i<places.length && i<10; i++){
				googleMaps.maps.searchMap.placesMarkers[i] = new google.maps.Marker({
          		position: places[i].geometry.location,
          		icon: this.ICON_BASE_URL+(i+1)+'-'+this.icons.places,
          		map: map,
          		draggable: false,
          		title: places[i].name
        		});
				
				//console.log(attractionContent.filter('.js-events').html());
				//attractionContent.find('.js-events');
				this.addEntertainmentDetails(places[i], i, attractionContent);
				/*console.log(attractionContent.filter('.js-events').html());
				console.log(attractionContent.html());*/

        		googleMaps.maps.searchMap.placesMarkers[i].addListener('click', function(event){
        			renderPlaceDetails(places[i]);
        		});

			}
			$('.js-entertainment').remove();
			$('.js-top-attractions').append(attractionContent);
	},
	updatePlaces: function(places){
		//console.log(places);
		//console.log(places.length+' is less than '+this.maps.searchMap.placesMarkers.length);
		var attractionContent=$(entertainmentTemplate);
		if(places.length<this.maps.searchMap.placesMarkers.length || (places.length>this.maps.searchMap.placesMarkers.length
			&& this.maps.searchMap.placesMarkers.length<10)){
			console.log("Hyenas!");
			this.removePlaceMarkers();
			this.addPlaces(places);
		}
		else{
			for(var i=0; i<places.length && i<10; i++){
				console.log(googleMaps.maps.searchMap.placesMarkers);
				googleMaps.maps.searchMap.placesMarkers[i].setPosition(places[i].geometry.location);
				googleMaps.maps.searchMap.placesMarkers[i].setTitle(places[i].name);

				this.addEntertainmentDetails(places[i], i, attractionContent);
			}
			$('.js-entertainment').remove();
			$('.js-top-attractions').append(attractionContent);
		}	
	},
	removePlaceMarkers: function(){
		for(var i=0; i<this.maps.searchMap.placesMarkers.length; i++){
			this.maps.searchMap.placesMarkers[i].setMap(null);
		}
		this.maps.searchMap.placesMarkers = [];
	},
	removeEventMarkers:function(){
		var deferred=$.Deferred();
		for(var i=0; i<this.maps.searchMap.eventsMarkers.length; i++){
			this.maps.searchMap.eventsMarkers[i].setMap(null);
		}
		this.maps.searchMap.eventsMarkers = [];
		deferred.resolve('OK');
		return deferred.promise();
	},
	updateEventMarker(marker, position, title){
		marker.setPosition(position);
		marker.setTitle(title);
	},
	toggleMarkers: function(markerType){

		console.log('PlaceMarkers: ');
		console.log('PlaceMarkersOn: '+this.maps.searchMap.eventMarkersOn);
		console.log(this.maps.searchMap.placesMarkers);
		console.log('EventMarkers: ');
		console.log('EventMarkersOn: '+this.maps.searchMap.eventMarkersOn);
		console.log(this.maps.searchMap.eventsMarkers);
		if(markerType==='places'){
			if(this.maps.searchMap.placeMarkersOn){
				this.hideMarkers(googleMaps.maps.searchMap.placesMarkers);
				this.maps.searchMap.placeMarkersOn=false;
			}
			else{
				this.showMarkers(googleMaps.maps.searchMap.placesMarkers);
				this.maps.searchMap.placeMarkersOn=true;
			}
		}
		else{
			if(this.maps.searchMap.eventMarkersOn){
				this.hideMarkers(googleMaps.maps.searchMap.eventsMarkers);
				this.maps.searchMap.eventMarkersOn=false;
			}
			else{
				this.showMarkers(googleMaps.maps.searchMap.eventsMarkers);
				this.maps.searchMap.eventMarkersOn=true;
			}
		}
	},
	showMarkers: function(markers){
		markers.forEach(function(marker){
			marker.setMap(googleMaps.maps.searchMap.map);
		});
	},
	hideMarkers: function(markers){
		markers.forEach(function(marker){
			marker.setMap(null);
		});
	},
	addEventMarker: function(name, latlng){
		var map=null;
		if(this.maps.searchMap.eventMarkersOn)
			map=this.maps.searchMap.map;

		this.maps.searchMap.eventsMarkers.push(new google.maps.Marker({
        	position: latlng,
        	icon: this.ICON_BASE_URL+this.icons.events,
          	map: map,
          	draggable: false,
          	title: name
        }));
	}
	/*getMapByArea: function(area){
			$.ajax({
				type: "GET",
				url: this.GEOCODER_BASE_URL,
				data: {key: this.config.api_key, address: area, callback: renderMap},
				dataType: "jsonp"
			});		
	},
	getNearbyPlaces: function(){
			$.ajax({
				type: "GET",
				url: this.PLACES_BASE_URL+this.PLACES_SEARCH,
				data: {key: this.config.api_key, location: this.latlng},
				dataType: "jsonp",
				success: renderPlaces
			});	
	},
	getPlaceDetails: function(place_id){
			$.ajax({
				type: "GET",
				url: this.PLACES_BASE_URL+this.PLACES_SEARCH,
				data: {key: this.config.api_key, place_id: place_id},
				dataType: "jsonp",
				success: renderPlaceDetails
			});			
	}*/
};
var applicationState={
	currentSection: 'Events',
	mapOpen: false,
	initialMap: true
};

function renderTranslationHeader(language){
	console.log(yandexTranslate.current_language);
	$('.js-language').text(yandexTranslate.current_language);
}
/*function getTranslatedLanguage(translatedLanguages){
	console.log('MADE IT HERE!');
	var maxUsedLanguage='en';
	for(var language in translatedLanguages){
		console.log(language);
		if(translatedLanguages[language] > translatedLanguages[maxUsedLanguage])
			maxUsedLanguage=language;
	}
	yandexTranslate.current_language_sn=maxUsedLanguage;
	yandexTranslate.getTranslationHeaderLanguage();
	console.log(maxUsedLanguage);
}
function analyzeLanguage(results){
	if(yandexTranslate.locationChanged(googleMaps.latlng)){
		yandexTranslate.current_location=googleMaps.latlng;
		yandexTranslate.attraction_translations=0;
		console.log('YUP');
		yandexTranslate.languages={};	
	}
	if(yandexTranslate.languages[results.detected.lang])
		yandexTranslate.languages[results.detected.lang]++;
	else
		yandexTranslate.languages[results.detected.lang]=1;

	yandexTranslate.attraction_translations++;
	//console.log(yandexTranslate.attraction_translations);
	if(yandexTranslate.attraction_translations===10){
		getTranslatedLanguage(yandexTranslate.languages);
	}
	console.log(yandexTranslate.languages);
}*/
function renderTranslatedDetail(results, property, elementNumber){
	//console.log(results);

	$('.js-entertainment-list-'+elementNumber).append('<li><span class="property">'+property.toUpperCase()+'</span>: '+results.text[0]+'</li>');
	//analyzeLanguage(results);
	/*console.log(results);
	console.log(results.text[0]);
	return results.text[0];*/
}
function renderPlaceDetails(results, status){
	if(status === 'OK'){
		//$('.js-description')
	}
	else {
        alert('Geocode was not successful for the following reason: ' + status);
    }	
}
function renderNearbyEvents(results){
	var eventsContent=$(eventsTemplate);
	var elementNumber=0;
	$('.js-events').remove();
	console.log('HELLO THERE!');
	console.log(results);
	var promise=googleMaps.removeEventMarkers();
	promise.then(function(status){eventful.addEvents(results, eventsContent);});
	console.log(googleMaps.maps.searchMap.eventsMarkers);
	//$('.js-events').remove();
	//console.log(eventsContent.html());
	//attractionContent.filter('.js-events').append('<ul class="js-event-list-'+elementNumber+' event-list"></ul>');
	//$('.js-events-list-'+elementNumber).append('<li>'+results.text[0]+'</li>');
}
function renderNearbyPlaces(results, status){
	if(status === 'OK'){
		if(googleMaps.maps.searchMap.placesMarkers.length===0){
			googleMaps.addPlaces(results);
		}
		//console.log(results);
		else{
			googleMaps.updatePlaces(results);
		}
		/*displayEntertainmentItem()
		displayEventItem()
		displayEvents()*/
		/*var attractionContent=$(topAttractionsTemplate);
		for(var i=0; i<places.length && i<10; i++){
			attractionContent.find('.js-entertainment');
			attractionContent.find('.js-events');
		$('.js-top-attractions').append(attractionContent);*/
	}
	else {
		var attractionContent=$(entertainmentTemplate);
		attractionContent.filter('.js-entertainment').html('<span class="no-results">SORRY, NO ATTRACTIONS NEARBY</span>');
        //alert('Geocode was not successful for the following reason: ' + status);
    }	
}
function getPositionDetails(type, position){
	var request={};
	request[type]=position;
	googleMaps.search_type=type;
	googleMaps.geocoder.geocode(request, renderMarkersAndImages);
}
function getMarkerPositionDetails(location){

}
function renderTextBoxTranslation(results){
		//console.log(results.text[0]);
		$('.js-text-translation').text(results.text[0]);
}
function renderLocationTranslations(results, status){

}
function renderMarkersAndImages(results, status){
    if (status === 'OK') {
    	console.log('RAWR: '+results[0].geometry.location);
    	googleMaps.latlng=results[0].geometry.location;
    	googleMaps.maps.searchMap.map.setCenter(googleMaps.latlng);
    	if(googleMaps.search_type==='address')
        	googleMaps.maps.searchMap.marker.setPosition(googleMaps.latlng);
        //$('#js-search-form').children('.js-search-input').val('');
        googleMaps.place_id=results[0].place_id;
        console.log(googleMaps.place_id);
        //googleMaps.getPlaceDetails();
        //alert('RESULTS: '+results[0].geometry.location);
        var countryCode='';
        /*for(var obj in results[0].address_components){
        	if(obj.types[0]==='country'){
        		countryCode=obj.short_name;
        		break;
        	}
        }*/
        for(var i=results[0].address_components.length-1; i >=0; i--){
        	if(results[0].address_components[i].types[0]==='country'){
        		countryCode=(results[0].address_components[i].short_name).toLowerCase();
        		break;
        	}
        }
        $('.js-address').text(results[0].formatted_address);
        var promise=yandexTranslate.setCurrentLanguage(countryCode);
        promise.then(function(status){renderTranslationHeader();});
        googleMaps.getNearbyPlaces(results[0].geometry.location);
        //googleMaps.getNearbyPlaces();
        $('.js-search-input').val('');
        //eventful.getNearbyEvents(results[0].formatted_address);
        eventful.getNearbyEvents(results[0].geometry.location.lat()+','+results[0].geometry.location.lng());
        console.log('RIGHT BEFORE RENDERTRANSLATIONHEADER!');
        flickr.searchPhotosByGeography(googleMaps.latlng);
        /*googleMaps.geocoder.geocode({'placeId': results[0].place_id}, function(results, status){
        	if(status==='OK'){
        		console.log(results[0]);
        		$('.js-search-input').val(results[0].formatted_address);
        		eventful.getNearbyEvents(results[0].formatted_address);
        	}
        });*/
        //$('.js-top-attractions').empty().append(topAttractionsTemplate);
    } else {
    		console.log('LOOKS LIKE WE MADE IT!');
    		$('.js-bad-map-request').removeClass('hidden');
            //alert('Geocode was not successful for the following reason: ' + status);
    }	
}
function renderPosition(input){
	//var place_id='';
	var places=null;
	if(typeof input === 'string'){
		getPositionDetails('address', input);
	}
	else{
		getPositionDetails('location', input);
	}
}
/*function renderMap(geocode){
	console.log(geocode);
	googleMaps.geocoder = new google.maps.Geocoder();
    var latlng = new google.maps.LatLng(geocode.geometry.location[0], geocode.geometry.location[1]);
    var mapOptions = {
      zoom: 8,
      center: latlng
    }
    googleMaps.maps.searchMap.map = new google.maps.Map(document.getElementById('search-map'), mapOptions);

}*/
/*function renderPlaces(response){
	console.log(response);
	var places=response[1];
	console.log(places);
}
function renderPlaceDetails(response){
	console.log(response);
	console.log(response[0].name);
}*/
function initMaps(response){
      googleMaps.latlng = {lat: 36.204824, lng: 138.252924}; 
      googleMaps.geocoder = new google.maps.Geocoder();
      googleMaps.maps.searchMap.map=new google.maps.Map(document.getElementById('search-map'),
			{center: googleMaps.latlng,
			zoom: 8,
			mapTypeId: 'terrain'});

      googleMaps.maps.searchMap.marker=new google.maps.Marker({
          position: googleMaps.latlng,
          map: googleMaps.maps.searchMap.map,
          icon: googleMaps.ICON_BASE_URL+googleMaps.icons.position, 
          draggable: true,
          title: 'Chosen Location'
        });

      googleMaps.placeService = new google.maps.places.PlacesService(googleMaps.maps.searchMap.map);
      /*googleMaps.getNearbyPlaces(googleMaps.latlng);
 	  eventful.getNearbyEvents(results[0].formatted_address);*/
  	  /*map.addListener('center_changed', function() {
    	// 3 seconds after the center of the map has changed, pan back to the
    	// marker.
    	window.setTimeout(function() {
      	map.panTo(marker.getPosition());
        }, 5000);
  	  });*/

  	  googleMaps.maps.searchMap.marker.addListener('dragend', function(event){
  	  	renderPosition(googleMaps.maps.searchMap.marker.getPosition());
  	  	//$('#js-search-form').children('.js-search-input').val('');
  	  });
  	  renderPosition(googleMaps.maps.searchMap.marker.getPosition());
}
function jsonFlickrApi(json){
	//console.log(json);
	renderImages(json);
}
function renderImages(imageData){
	//var imageSection=$('<header class="js-image-header image-header">Search Results: </header><div class="js-image-listings image-listings"></div>');
	console.log('Total photos: '+imageData.photos.total);
	if(imageData.photos.total!=='0'){
	var images='';
	var blackList={};
	var links='';
	flickr.imageArray=[];
	imageData.photos.photo.forEach(function(photo){
		if(photo.url_t!==undefined && photo.url_n!==undefined){
			//images+='<img src="'+photo.url_t+'" alt="'+photo.title+'">\n';
			flickr.imageArray.push({
				title: photo.title,
				href: photo.url_n,
				type: 'image/jpeg',
				thumbnail: photo.url_t
			});
			var height=Number(photo.height_t);
			console.log(photo.url_o);
			if(height < 66){
				var padding=(66-height)/2;
				links+='<a class=".js-image-links image-links" href="'+photo.url_n+'" title="'+photo.title+'" data-gallery>'+
									//'<div style="background-image: url("'+photo.url_t+'");"></div></a>';
									'<div style="padding-top: '+padding+'px; padding-bottom: '+padding+'px;"><img class="image" src="'+photo.url_t+'" alt="'+photo.title+'"></div></a>';

			}
			else{
				links+='<a class=".js-image-links image-links" href="'+photo.url_n+'" title="'+photo.title+'" data-gallery>'+
									//'<div style="background-image: url("'+photo.url_t+'");"></div></a>';
									'<div><img class="image" src="'+photo.url_t+'" alt="'+photo.title+'"></div></a>';
			}


		}

		/*if(!blackList[photo.owner]){
			blackList[photo.owner]=1;
		}
		else if(blackList[photo.owner] < 3){
			blackList[photo.owner]+=1;
			console.log(blackList[photo.owner]);
			images+='<img src="'+photo.url_n+'" alt="'+photo.title+'">\n';
			console.log('Used: '+photo.owner);
		}
		else{ console.log('Skipped: '+photo.owner); }*/
	});
	//gallery=blueimp.Gallery(links, options);
	$('#links').empty().append(links);
	//imageSection.filter('.js-image-listings').append(images);
	}
	else{
		$('#links').empty().append('<div class="no-results">SORRY, NO IMAGES FOUND NEAR THIS LOCATION</div>');
		//console.log("WHAT'S HAPPENING!");
		//imageSection.filter('.js-image-listings').append('<span class=no-results>SORRY, NO IMAGES FOUND NEAR THIS LOCATION</span>');
	}
	//$('.js-images-section').empty().append(imageSection);
}
function clickedAwayFromTranslation(){
	$('.js-translated-section').animate({height: '0'}, fast);
}
//Handlers
function handleSearchSubmit(){
	$('#js-search-form').submit(function(event){
		console.log('hi');
		event.preventDefault();
		//googleMaps.geocoder.geocode(googleMaps.maps.searchMap.marker.getPosition);
		var input = $(this).children('.js-search-input').val();
		renderPosition(input);
		//instagram.searchPhotosByGeography(input);
		//googleMaps.getMapByArea(input);
		//console.log(googleMaps.maps.searchMap.marker.getPosition());
	});
}
function handleImageRetrieval(){
	$('.js-find-images').click(function(event){
		flickr.searchPhotosByGeography(googleMaps.maps.searchMap.marker.getPosition());
	});

	var options={stretchImages: true};
	$('.js-image-links').click(function(event){
		if(target===this)
			blueimp.Gallery(flickr.imageArray);
	});
}
function handleHeaderClick(){
	$('.js-translator-header').click(function(event){
		$(this).children('.js-header-image').toggleClass('header-image-clicked');
		$(this).siblings('.js-textbox').toggleClass('hidden');
	});
}
function handleTextTranslation(){
	$('#js-translation-form').submit(function(event){
		event.preventDefault();
		var textToTranslate=$(this).children('.js-textarea').val().trim();
		$('.js-translated-section').goTo().animate({height: '100%'}, 'slow', yandexTranslate.translateTextBox(textToTranslate));
	});
	$('.js-text-box').on('click', '.js-text-to-speech', function(event){
		responsiveVoice.setDefaultVoice("US English Female");
		yandexTranslate.speakTranslation();
	});
	console.log(responsiveVoice.getVoices());
}
function handleMarkerCheckBoxes(){
	$('.js-marker-check').change(function(event){
			googleMaps.toggleMarkers(this.name);
	});
}
function handleNavButtons(){
	$('.js-nav-button').click(function(event){
		var section='';
		var text=$(this).text();
		$('.js-nav-select').text(text);
		switch(text){
			case 'Entertainment':
				$('.js-top-events, .js-translation, .js-gallery').addClass('hidden');
				section='.js-top-attractions';
				break;
			case 'Events':
				$('.js-top-attractions, .js-translation, .js-gallery').addClass('hidden');
				section='.js-top-events';
				break;

			case 'Images':
				$('.js-top-events, .js-translation, .js-top-attractions').addClass('hidden');
				section='.js-gallery';
				break;

			case 'Translator':
				$('.js-top-events, .js-gallery, .js-top-attractions').addClass('hidden');
				section='.js-translation';
				break;

			default: 
				break;
		}
		console.log(section);
		$(section).removeClass('hidden').goToTop();
		/*$(section).goTo();
		$(section).*/
	});
}
function handleMapButton(){
	$('.js-map-button').unbind().click(function(event){
		console.log('WHAT IS GOING ON?');
		console.log(applicationState.mapOpen);
		if(applicationState.mapOpen){
			$('.js-main-map, .js-map-background').fadeOut(500);
			applicationState.mapOpen=false;
			$('.js-map-button').text("Map").removeClass('mapOpen');
		}
		else{
			if(applicationState.initialMap){
				$('.js-main-map, .js-map-background').addClass('reveal-map').fadeIn(500);
				//$('.main-map:before').fadeIn(500);
				applicationState.initialMap=false;
				$('.js-map-button').text("Close Map").addClass('mapOpen');
			}
			else{
				$('.js-main-map, .js-map-background').fadeIn(500);
				$('.js-map-button').text("Close Map").addClass('mapOpen');
			}
			/*$('.main-map').addClass('reveal-map');*/
			applicationState.mapOpen=true;
		}
	});
}
$(document).ready(function(){
	//$('.section-nav').fixMenu(0);
	var flickerOptions={api_key: 'fce2cc179918f3569a6ceb86165c46c3'};
	//var googleTranslateOptions={api_key: 'AIzaSyDCz6gKlHvkMprHXZ5gYtJvhiS9aUbDY9o', user_language: 'en'};
	var yandexTranslateOptions={api_key: 'trnsl.1.1.20170105T091703Z.37443af0f3f26f82.813faf58301bf41263b49bbdad6b073a9f773941', user_language: 'en'};
	var eventfulOptions={api_key: 'HNPxRfwzNrrMJCqD'};
	var googleMapsOptions={api_key: 'AIzaSyDCz6gKlHvkMprHXZ5gYtJvhiS9aUbDY9o'};

	flickr.init(flickerOptions);
	//googleTranslate.init(googleMapsOptions);
	yandexTranslate.init(yandexTranslateOptions);
	eventful.init(eventfulOptions);
	googleMaps.init(googleMapsOptions);
	//geoCoder.init(googleOptions);

	handleSearchSubmit();
	handleNavButtons();
	handleMarkerCheckBoxes();
	handleImageRetrieval();
	//handleHeaderClick();***
	handleTextTranslation();
	handleMapButton();
	//handleEntertainment
});

/*function createCORSRequest(method, url) {
  	var xhr = new XMLHttpRequest();
  	if ("withCredentials" in xhr) {

    	// Check if the XMLHttpRequest object has a "withCredentials" property.
    	// "withCredentials" only exists on XMLHTTPRequest2 objects.
    	xhr.open(method, url, true);

  	} else if (typeof XDomainRequest != "undefined") {

    		// Otherwise, check if XDomainRequest.
    		// XDomainRequest only exists in IE, and is IE's way of making CORS requests.
    		xhr = new XDomainRequest();
    		xhr.open(method, url);

  	} else {

    	// Otherwise, CORS is not supported by the browser.
    	xhr = null;

  	}
  		
  	return xhr;
}

function makeCORSrequest(urlWithParameters){
	var url=urlWithParameters;
	var request = createCORSRequest('GET', url);
	if (request) {
		request.send();
  	}
  	else
  		throw new Error('CORS not supported');
  	
  	//response handlers
  	request.onload=function(response){
  		console.log(response);
  	}

  	request.onerror=function(){
  		throw new Error('There was an error making the request.');
  	}
}*/