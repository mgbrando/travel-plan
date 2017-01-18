'use strict'; //Set in strict mode

/*********************************
 * jQuery custom functions
 *********************************/

(function($) {

	//Function used to scroll to an element
    $.fn.goTo = function() {
        $('html, body').animate({
            scrollTop: $(this).offset().top + 'px'
        }, 'fast');
        return this;
    }

    //Function used to scroll to the top of the web app
    $.fn.goToTop = function() {
        $('html, body').animate({
            scrollTop: 0+'px'
        }, 'fast');
        return this;
    }

    //Function used to fix position the navigation menu
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

/***********************************************************
* Templates for the entertainment and events sections
************************************************************/

//Template for the entertainment section
var entertainmentTemplate=	'<section class="js-entertainment entertainment">'+
								'<header>Top Entertainment Spots</header>'+
						   	'</section>';

//Template for the events section
var eventsTemplate='<section class="js-events events">'+
						'<header>Events</header>'+
				    '</section>';

/***********************************************************
* Third party API and application states
************************************************************/

//Flicker state object with functions to interact with the flicker API
var flickr={
	BASE_URL: 'https://api.flickr.com/services/rest/',
	config: {},
	imageArray: [],

	//Initializes the flickr API state object
	init: function(options){
		options = options || {};

		this.config.api_key=options.api_key;
	},

	//Searches for photos taken around a given latitude - longitude position
	searchPhotosByGeography: function(position){
			$.ajax({
				type: "GET",
				url: this.BASE_URL,
				data: {method: 'flickr.photos.search', api_key: this.config.api_key, format: 'json', media: 'photos', 
				tags: 'nature, museum, forest, architecture, venue, scenery', sort: 'interestingness-desc', content_type: 1, 
				accuracy: 11, has_geo: 2, lat: position.lat(), lon: position.lng(), extras: 'url_t, url_n, url_o'},
				dataType: "jsonp"
			});
	}
};

//Eventful state object with functions to interact with the eventful API
var eventful={
	BASE_URL: 'https://api.eventful.com/json/events/search',
	config: {},

	//Initializes the eventful API state object
	init: function(options){
		options = options || {};

		this.config.api_key=options.api_key;
		this.config.user_language=options.user_language;
	},	

	//Retrieves events that are within a 10 mile radius of the given latitude - longitude position
	getNearbyEvents: function(location){
			$.ajax({
				type: "GET",
				url: this.BASE_URL,
				timeout: 5000,
				data: {app_key: this.config.api_key, location: location,
								 within: 10, date: 'Future'},
				dataType: "jsonp",
				success: renderNearbyEvents,
				error: function(x, t, m) {
        			if(t==="timeout") {
            			eventful.getNearbyEvents(location);
        			} else {
            			alert(t+m);
        			}
    			}
			});
	},

	//Function used to add an event element to an element that has a class of .js-events
	addEvent: function(event, element, elementNumber){
			var elementNumber = elementNumber || 0;
			var image='';
			if(event.image!==null && !(~(event.image.medium.url).indexOf('http:')))
				image='<img class="event-image" src="https:'+(event.image.medium.url)+
					'" alt="'+event.title+'">';
			else
				image='<img class="event-image" src="images/image-not-found.jpeg">';
			if(event.description===null)
				event.description='Not available';

			element.filter('.js-events').append('<div class="event"><div class="left-event"><ul class="js-event-list-'+elementNumber+' event-list"></ul></div><div class="right-event">'+image+'</div><div class="description"><span class="property">DESCRIPTION</span>: <div class="comment">'+event.description+'</div></div></div>');
			$('.js-top-events').append(element);

			if(event.start_time===undefined)
					event.start_time='not specified';
			if(event.end_time===undefined)
					event.end_time='not specified';
			if(event.description===null)
					event.description='N/A';

			googleMaps.addEventMarker(event.title, {lat: Number(event.latitude), lng: Number(event.longitude)});
			
			$('.js-event-list-'+elementNumber).append('<li><span class="property">EVENT</span>: <a href="'+event.url+'" target="_blank">'+event.title+'</a></li>'+
										  '<li><span class="property">VENUE</span>: <a href="'+event.venue_url+'" target="_blank">'+event.venue_name+'</a></li>'+
										  '<li><span class="property">CITY</span>: '+event.city_name+', '+event.region_name+' - '+event.country_name+'</li>'+
										  '<li><span class="property">VENUE</span>: '+event.venue_address+'</li>'+
										  '<li><span class="property">START TIME</span>: '+event.start_time+'</li>'+
										  '<li><span class="property">END TIME</span>: '+event.end_time+'</li>');
	},

	//Function used to add all the events to the .js-top-events section
	addEvents: function(results, element){
		if(results.events===null){
			element.filter('.js-events').append('<div class="no-results">NO EVENTS ARE CURRENTLY NEARBY</div>');
			$('.js-top-events').append(element);
		}
		else if(results.total_items==="1")
			this.addEvent(results.events.event, element);
		else{
			for(var i=0; i < results.events.event.length; i++){
				this.addEvent(results.events.event[i], element, i);
		 	}
		}
	}
};

//Yandex Translate state object that contains the functionality to interact with the Yandex Translate API
var yandexTranslate={
	BASE_URL: 'https://translate.yandex.net/api/v1.5/tr.json',
	TRANSLATE_EXT: '/translate',
	GETLANGS_EXT: '/getLangs',
	current_location: {lat: 36.204824, lng: 138.252924},
	current_language: 'Japanese',
	current_language_sn: 'ja',
	attraction_translations: 0,
	languages: {},
	config: {},

	//Initializes the yandex translate API state object
	init: function(options){
		options = options || {};

		this.config.api_key=options.api_key;
		this.config.user_language=options.user_language;
	},

	//Function used to translate a string from the english language to the current_language
	translateRequest: function(property, to_translate, elementNumber){
			var deferred=$.Deferred();
			$.ajax({
				type: "GET",
				url: this.BASE_URL+this.TRANSLATE_EXT,
				data: {key: this.config.api_key, lang: this.config.user_language, options: 1, text: to_translate},
				dataType: "jsonp",
				success: function(results){renderTranslatedDetail(results, property, elementNumber); deferred.resolve(property);}
			});
			return deferred.promise();
	},
	
	/*Function used to translate the string in the translation textbox. 
	The success function returned is different than translateRequest.*/
	translateTextBox: function(textToTranslate){
			$.ajax({
				type: "GET",
				url: this.BASE_URL+this.TRANSLATE_EXT,
				data: {key: this.config.api_key, lang: this.config.user_language+'-'+this.current_language_sn, options: 1, text: textToTranslate},
				dataType: "jsonp",
				success: renderTextBoxTranslation
			});
	},

	//Function used to translate the translation section header language given the current_language
	getTranslationHeaderLanguage: function(){
			$.ajax({
				type: "GET",
				url: this.BASE_URL+this.GETLANGS_EXT,
				data: {key: this.config.api_key, ui: this.config.user_language},
				dataType: "jsonp",
				success: function(results){
					renderTranslationHeader(results.langs[yandexTranslate.current_language]);
				}
			});
	},

	//Function used to get the current_language(long name) using the current_language_sn(short name)
	getLanguageName: function(){
		var deferred=$.Deferred();
			$.ajax({
				type: "GET",
				url: this.BASE_URL+this.GETLANGS_EXT,
				data: {key: this.config.api_key, ui: this.config.user_language},
				dataType: "jsonp",
				success: function(results){
					yandexTranslate.current_language=results.langs[yandexTranslate.current_language_sn];
					deferred.resolve('OK');
				}
			});
		return deferred.promise();
	},

	//Function used to get the language of a country using its country code
	setCurrentLanguage: function(countryCode){
			var deferred=$.Deferred();
			$.ajax({
				type: "GET",
				url: 'https://restcountries.eu/rest/v1/alpha?codes='+countryCode,
				success: function(results){
					yandexTranslate.current_language_sn=results[0].languages[0];
					var promise=yandexTranslate.getLanguageName();
					promise.then(function(status){deferred.resolve('OK');});
				}
			});
			return deferred.promise();
	},
	
	//Function to later be used to speak back the translation in the appropriate voice and mannerism of the country
	/*speakTranslation: function(){
			$.ajax({
				type: "GET",
				url: this.BASE_URL+this.GETLANGS_EXT,
				data: {key: this.config.api_key, ui: this.config.user_language},
				dataType: "jsonp",
				success: function(results){
					var language=results.langs[yandexTranslate.current_language_sn];
					if(language==='English')
						language='US English';
						responsiveVoice.speak($('.js-text-translation').text(), language+' Female');
				}
			});
	},*/

	//Function used to test if the current location has changed
	locationChanged: function(currentLocation){
		if(this.current_location!==currentLocation)
			return true;
		return false;
	}
};

/*State object that is used to store variables and functions that are used for interacting with google related APIs,
including Google Maps, Google Places, and Google Geocode.*/

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

	//Initializes the google maps API state object
	init: function(options){
		options = options || {};

		this.config.api_key=options.api_key;
	},

	//Function used to get the details of a place given a place_id.
	getPlaceDetails: function(place_id){
		this.placeService.getDetails({location: place_id}, renderPlaceDetails);
	},

	//Function used to get nearby attractions(places) given a latitude-longitude position
	getNearbyPlaces: function(position){
		this.placeService.nearbySearch({location: position, radius: 5000, keyword: 'entertainment'}, renderNearbyPlaces);
	},

	//Function used to create the entertainment html elements and translate the name an vicinity properties
	addEntertainmentDetails: function(place, elementNumber, contentTemplate){
		var photo='';
		if(place.photos){
				photo='<img class="place-image" src="'+place.photos[0].getUrl({maxWidth: 100, maxHeight: 100})+'">';
		}
		else{
			photo='<img class="place-image" src="images/image-not-found.jpeg">';
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

		var promise=yandexTranslate.translateRequest('name', place.name, elementNumber);
		promise.then(function(status){var promise2=yandexTranslate.translateRequest('vicinity', place.vicinity, elementNumber);
										promise2.then(function(status){
											$('.js-entertainment-list-'+elementNumber).append('<li><span class="property">TYPE</span>: '+place.types.toString().replace(/_/g, ' ').replace(/,/g, ', ')+'</li>');
										});});
	},

	//Function used to add attraction(place) markers
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
				
				this.addEntertainmentDetails(places[i], i, attractionContent);

				//Function used to render the details for a place when a placemarker is clicked (Future)
        		/*googleMaps.maps.searchMap.placesMarkers[i].addListener('click', function(event){
        			renderPlaceDetails(places[i]);
        		});*/

			}
			$('.js-entertainment').remove();
			$('.js-top-attractions').append(attractionContent);
	},

	//Function used to update attraction(place) markers
	updatePlaces: function(places){
		var attractionContent=$(entertainmentTemplate);
		if(places.length<this.maps.searchMap.placesMarkers.length || (places.length>this.maps.searchMap.placesMarkers.length
			&& this.maps.searchMap.placesMarkers.length<10)){
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

	//Function used to remove all attraction(place) markers
	removePlaceMarkers: function(){
		for(var i=0; i<this.maps.searchMap.placesMarkers.length; i++){
			this.maps.searchMap.placesMarkers[i].setMap(null);
		}
		this.maps.searchMap.placesMarkers = [];
	},

	//Function used to remove all event markers
	removeEventMarkers:function(){
		var deferred=$.Deferred();
		for(var i=0; i<this.maps.searchMap.eventsMarkers.length; i++){
			this.maps.searchMap.eventsMarkers[i].setMap(null);
		}
		this.maps.searchMap.eventsMarkers = [];
		deferred.resolve('OK');
		return deferred.promise();
	},

	//Function used to update an event marker
	updateEventMarker(marker, position, title){
		marker.setPosition(position);
		marker.setTitle(title);
	},

	//Function used to toggle place or event markers on and off on the map
	toggleMarkers: function(markerType){
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

	//Function used to actually show the markers supplied
	showMarkers: function(markers){
		markers.forEach(function(marker){
			marker.setMap(googleMaps.maps.searchMap.map);
		});
	},

	//Function used to actually hide the markers supplied
	hideMarkers: function(markers){
		markers.forEach(function(marker){
			marker.setMap(null);
		});
	},

	//Function used to add an Event Marker to the map
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
};


//State object to hold the travel plan app independent application variables
var applicationState={
	currentSection: 'Events',
	mapOpen: false,
	initialMap: true
};

/***********************************************************
* Application helper and render functions
************************************************************/

/*Function used to render the header for the translation section with the current_language if a language is 
not supplied*/
function renderTranslationHeader(language){
	language = language || yandexTranslate.current_language;
	$('.js-language').text(language);
}

//Future functionality of rendering a single place's details
/*function renderPlaceDetails(place){

}*/

//Function used to render a translated attraction detail
function renderTranslatedDetail(results, property, elementNumber){
	$('.js-entertainment-list-'+elementNumber).append('<li><span class="property">'+property.toUpperCase()+'</span>: '+results.text[0]+'</li>');
}

//Function used to clear old event markers and render the new events
function renderNearbyEvents(results){
	var eventsContent=$(eventsTemplate);
	var elementNumber=0;
	$('.js-events').remove();
	var promise=googleMaps.removeEventMarkers();
	promise.then(function(status){
		eventful.addEvents(results, eventsContent);
		$('.comment').shorten({
			"showChars": 200,
			"moreText": "Read more...",
			"lessText": "Show less..."
		});
	});
}

//Function used to render the nearby attractions
function renderNearbyPlaces(results, status){
	if(status === 'OK'){
		if(googleMaps.maps.searchMap.placesMarkers.length===0){
			googleMaps.addPlaces(results);
		}
		else{
			googleMaps.updatePlaces(results);
		}
	}
	else if(status==='ZERO_RESULTS') {
		var attractionContent=$(entertainmentTemplate);
		console.log(attractionContent);
		console.log('MADE IT TO CHINA!');
		attractionContent.filter('.js-entertainment').append('<div class="no-results">SORRY, NO ATTRACTIONS NEARBY</div>');
		$('.js-top-attractions').empty().append(attractionContent);
    }
    else
    	alert('There was an error with the Google Places request.');
}

/*Function used to get the details of a place given a google accepted address format or 
a latitude and longitude position*/
function getPositionDetails(type, position){
	var request={};
	request[type]=position;
	googleMaps.search_type=type;
	googleMaps.geocoder.geocode(request, renderMarkersAndImages);
}

//Function used to render the translated text in the text translator section
function renderTextBoxTranslation(results){
		$('.js-text-translation').text(results.text[0]);
}

//Function used to render markers of attractions and events nearby as well as the images for the image gallery
function renderMarkersAndImages(results, status){
	var bad_submit_request=$('.js-bad-map-submit-request');
	var bad_drag_request=$('.js-bad-map-drag-request');
    if (status === 'OK') {
    	if(!bad_submit_request.hasClass('hidden')){
    		bad_submit_request.toggleClass('hidden');
    	}
    	if(!bad_drag_request.hasClass('hidden')){
    		bad_drag_request.toggleClass('hidden');
    	}
    	googleMaps.latlng=results[0].geometry.location;
    	googleMaps.maps.searchMap.map.setCenter(googleMaps.latlng);
    	if(googleMaps.search_type==='address')
        	googleMaps.maps.searchMap.marker.setPosition(googleMaps.latlng);
        
        googleMaps.place_id=results[0].place_id;

        var countryCode='';

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

        $('.js-search-input').val('');

        eventful.getNearbyEvents(results[0].geometry.location.lat()+','+results[0].geometry.location.lng());
        flickr.searchPhotosByGeography(googleMaps.latlng);
    } 
    else {
    		if(googleMaps.search_type==='address'){
    			if(bad_submit_request.hasClass('hidden'))
    				bad_submit_request.toggleClass('hidden');
    		}
    		else{
    			if(bad_drag_request.hasClass('hidden'))
    				bad_drag_request.toggleClass('hidden');
    		}
    }	
}

//Function used to start the entire process of retrieving information about a location
function renderPosition(input){
	var places=null;
	if(typeof input === 'string'){
		getPositionDetails('address', input);
	}
	else{
		getPositionDetails('location', input);
	}
}

//Function used as the callback by the Flickr API. Calls renderImages.
function jsonFlickrApi(json){
	renderImages(json);
}

//Function used to render the images in the image gallery
function renderImages(imageData){
	if(imageData.photos.total!=='0'){
		var images='';
		var blackList={};
		var links='';
		flickr.imageArray=[];
		imageData.photos.photo.forEach(function(photo){
			if(photo.url_t!==undefined && photo.url_n!==undefined){
				flickr.imageArray.push({
					title: photo.title,
					href: photo.url_n,
					type: 'image/jpeg',
					thumbnail: photo.url_t
				});
				var height=Number(photo.height_t);

				if(height < 66){
					var padding=(66-height)/2;
					links+='<a class=".js-image-links image-links" href="'+photo.url_n+'" title="'+photo.title+'" data-gallery>'+
									'<div style="padding-top: '+padding+'px; padding-bottom: '+padding+'px;"><img class="image" src="'+photo.url_t+'" alt="'+photo.title+'"></div></a>';

				}
				else{
					links+='<a class=".js-image-links image-links" href="'+photo.url_n+'" title="'+photo.title+'" data-gallery>'+
									'<div><img class="image" src="'+photo.url_t+'" alt="'+photo.title+'"></div></a>';
				}
			}
		});
		$('#links').empty().append(links);
	}
	else
		$('#links').empty().append('<div class="no-results">SORRY, NO IMAGES FOUND NEAR THIS LOCATION</div>');
}

//Function used to hide the translated section of the translation section when another navigation button is clicked.
function clickedAwayFromTranslation(){
	$('.js-translated-section').animate({height: '0'}, fast);
}

/***********************
	Event Handlers
 ***********************/

//Function used to handle the search form being revealed/hidden and when the form is submitted
function handleSearchSubmit(){
	$('#js-search-form').submit(function(event){
		event.preventDefault();
		var input = $(this).children('.js-search-input').val();
		renderPosition(input);
	});

	$('.js-mobile-search-button').on('click', function(event){
		$('.mobile-search-button').toggleClass('changeColor');
		$('.form-wrapper').toggleClass('search-bar');
	});
}

//Function used to show the blueimp gallery when a thumbnail image is clicked
function handleImageRetrieval(){
	//To be used as a click button for changing the images based off of position (Future)
	/*$('.js-find-images').on('click touchstart', function(event){
		flickr.searchPhotosByGeography(googleMaps.maps.searchMap.marker.getPosition());
	});*/

	var options={stretchImages: true};
	$('.js-image-links').on('click', function(event){
		if(target===this)
			blueimp.Gallery(flickr.imageArray);
	});
}

//Function used to toggle the translation header to show the translation text box (deprecated)
/*function handleHeaderClick(){
	$('.js-translator-header').on('click touchstart', function(event){
		$(this).children('.js-header-image').toggleClass('header-image-clicked');
		$(this).siblings('.js-textbox').toggleClass('hidden');
	});
}*/

//Function used to show translation on submit in the translation section
function handleTextTranslation(){
	$('#js-translation-form').submit(function(event){
		event.preventDefault();
		var textToTranslate=$(this).children('.js-textarea').val().trim();
		$('.js-translated-section').goTo().animate({height: '100%'}, 'slow', yandexTranslate.translateTextBox(textToTranslate));
	});

	//Function for future texxt-to-speech functionality
	/*$('.js-text-box').on('click', '.js-text-to-speech', function(event){
		responsiveVoice.setDefaultVoice("US English Female");
		yandexTranslate.speakTranslation();
	});
	console.log(responsiveVoice.getVoices());*/
}

//Function used to toggle place and event markers when the associated checkbox is clicked
function handleMarkerCheckBoxes(){
	$('.js-marker-check').change(function(event){
			googleMaps.toggleMarkers(this.name);
	});
}

//Function used to hide a nav dropdown element in the list when it is the name of the current section
function hideSelectedSection(section){
	if($(section).hasClass('hidden')){}
	else{
		$('.dropdown-content div').removeClass('hidden');
		$(section).addClass('hidden');
	}
}

/*Function used to check the current section and to hide it from the dropdown list, while at the same time changing
the text of the navigation button to the current section*/
function handleNavButtons(){
	$('.js-nav-button').on('click', function(event){
		var section='';
		var text=$(this).text();
		$('.js-nav-select').text(text);
		switch(text){
			case 'Entertainment':
				$('.js-top-events, .js-translation, .js-gallery').addClass('hidden');
				section='.js-top-attractions';
				hideSelectedSection('.dropdown-content div:first-child');
				break;
			case 'Events':
				$('.js-top-attractions, .js-translation, .js-gallery').addClass('hidden');
				section='.js-top-events';
				hideSelectedSection('.dropdown-content div:nth-child(2)');
				break;

			case 'Images':
				$('.js-top-events, .js-translation, .js-top-attractions').addClass('hidden');
				section='.js-gallery';
				hideSelectedSection('.dropdown-content div:nth-child(3)');
				break;

			case 'Translator':
				$('.js-top-events, .js-gallery, .js-top-attractions').addClass('hidden');
				section='.js-translation';
				hideSelectedSection('.dropdown-content div:last-child');
				break;

			default: 
				break;
		}
		$(section).removeClass('hidden').goToTop();
	});
}

//Function used to fade in and fade out the map when clicking the map button. Also resizes the map.
function handleMapButton(){
	$('.js-map-button').unbind().on('click', function(event){
		if(applicationState.mapOpen){
			$('.js-main-map, .js-map-background').fadeOut(500);
			applicationState.mapOpen=false;
			$('.js-map-button').text("Map").removeClass('mapOpen');
		}
		else{
			if(applicationState.initialMap){
				$('.js-main-map, .js-map-background').addClass('reveal-map').fadeIn(500);
				applicationState.initialMap=false;
				$('.js-map-button').text("Close Map").addClass('mapOpen');
			}
			else{
				$('.js-main-map, .js-map-background').fadeIn(500);
				$('.js-map-button').text("Close Map").addClass('mapOpen');
				google.maps.event.trigger(googleMaps.maps.searchMap.map, "resize");
				googleMaps.maps.searchMap.map.panTo(googleMaps.maps.searchMap.marker.getPosition());
			}
			applicationState.mapOpen=true;
		}
	});
}
/***********************************************************
* Application initialization functions
************************************************************/

//Function used to initialize the searchMap and render it for the first time
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

      google.maps.event.addDomListener(window, 'resize', function() {
    	googleMaps.maps.searchMap.map.setCenter(googleMaps.maps.searchMap.marker.getPosition());
	  });

      googleMaps.placeService = new google.maps.places.PlacesService(googleMaps.maps.searchMap.map);

  	  googleMaps.maps.searchMap.marker.addListener('dragend', function(event){
  	  	renderPosition(googleMaps.maps.searchMap.marker.getPosition());
  	  });

  	  renderPosition(googleMaps.maps.searchMap.marker.getPosition());
}

//Initialization of API state variables and registration of event handlers after the document has been loaded
$(document).ready(function(){
	var flickerOptions={api_key: 'fce2cc179918f3569a6ceb86165c46c3'};
	var yandexTranslateOptions={api_key: 'trnsl.1.1.20170105T091703Z.37443af0f3f26f82.813faf58301bf41263b49bbdad6b073a9f773941', user_language: 'en'};
	var eventfulOptions={api_key: 'HNPxRfwzNrrMJCqD'};
	var googleMapsOptions={api_key: 'AIzaSyDCz6gKlHvkMprHXZ5gYtJvhiS9aUbDY9o'};

	flickr.init(flickerOptions);
	yandexTranslate.init(yandexTranslateOptions);
	eventful.init(eventfulOptions);
	googleMaps.init(googleMapsOptions);

	handleSearchSubmit();
	handleNavButtons();
	handleMarkerCheckBoxes();
	handleImageRetrieval();
	handleTextTranslation();
	handleMapButton();
});
