'use strict';

//const Translate = require('@google/translate');

var photoTemplate='<img src="" alt="">';
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
				accuracy: 11, has_geo: 2, lat: position.lat(), lon: position.lng(), extras: 'url_t'},
				dataType: "jsonp"
			});
	},

	echoTest: function(echoValue){
		makeCORSrequest(BASE_URL+echoValue);
	}
};
var eventful={
	BASE_URL: 'http://api.eventful.com/json/events/search',
	config: {},
	init: function(options){
		options = options || {};

		this.config.api_key=options.api_key;
		this.config.user_language=options.user_language;
	},	
	getNearbyEvents: function(location){
			console.log('NEARBY EVENTS: '+location.lat+','+location.lng);
			$.ajax({
				type: "GET",
				url: this.BASE_URL,//+queryString,
				data: {app_key: this.config.api_key, location: location, within: 10, date: 'Future'},
				dataType: "jsonp",
				jsonp: 'callback',
				jsonpCallback: 'renderNearbyEvents'
				//success: renderNearbyEvents
			});
			/*makeCORSrequest('http://api.eventful.com/json/events/search?app_key='+this.config.api_key+
				'&where='+location.lat+','+location.lng+'&within=10&date=Future');*/
	}
}
var yandexTranslate={
	BASE_URL: 'https://translate.yandex.net/api/v1.5/tr.json/translate',
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
				url: this.BASE_URL,//+queryString,
				data: {key: this.config.api_key, lang: this.config.user_language, options: 1, text: to_translate},
				dataType: "jsonp",
				/*jsonp: 'callback',
				jsonpCallback: 'renderName',*/
				success: function(results){renderDetail(results, property, elementNumber); deferred.resolve(property);}
			});
			return deferred.promise();
	}/*,
	translateTextBox: function(text){

	},
	translateLocations: function(textArray){

	}*/

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
	ICON_BASE_URL: 'http://maps.google.com/mapfiles/kml/paddle/',
	icons: {position: 'red-stars.png', places: 'lv.png'},
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
	maps: {searchMap: {map: null, marker: null, placesMarkers: []}, imageMap: {map: null, marker: null}},
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
			rating='<div>'+place.rating+'</div>';
		}
        contentTemplate.filter('.js-entertainment').append('<img src="'+place.icon+'">'+photo+rating+
        			'<ul class="js-entertainment-list-'+elementNumber+' entertainment-list">'+
        			'</ul>');
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
						promise2.then(function(status){yandexTranslate.translateRequest('type', place.types[0], elementNumber)});});
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
			for(var i=0; i<places.length && i<10; i++){
				googleMaps.maps.searchMap.placesMarkers[i] = new google.maps.Marker({
          		position: places[i].geometry.location,
          		icon: this.ICON_BASE_URL+(i+1)+'-'+this.icons.places,
          		map: googleMaps.maps.searchMap.map,
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
			$('.js-top-attractions').append(attractionContent)
		}	
	},
	removePlaceMarkers: function(){
		for(var i=0; i<this.maps.searchMap.placesMarkers.length; i++){
			this.maps.searchMap.placesMarkers[i].setMap(null);
		}
		this.maps.searchMap.placesMarkers = [];
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
function renderDetail(results, property, elementNumber){
	var detail=results.text[0];
	if(property==='type'){
		property=property.replace(/_/g, ' ');
		detail=detail.replace(/_/g, ' ');
	}

	$('.js-entertainment-list-'+elementNumber).append('<li><span class="property">'+property.toUpperCase()+'</span>: '+detail+'</li>');
	/*console.log(results);
	console.log(results.text[0]);
	return results.text[0];*/
}
function renderPlaceDetails(results, status){
	if(status === 'OK'){
		$('.js-description')
	}
	else {
        alert('Geocode was not successful for the following reason: ' + status);
    }	
}
function renderNearbyEvents(results){
	var eventsContent=$(eventsTemplate);
	var elementNumber=0;
	console.log('HELLO THERE!');
	console.log(results);
	$('.js-events').remove();
	if(results.events===null){
		eventsContent.filter('.js-events').append('<div>NO EVENTS ARE CURRENTLY NEARBY</div>');
		$('.js-top-attractions').append(eventsContent);
	}
	else{
		for(var i=0; i < results.events.event.length; i++){
			eventsContent.filter('.js-events').append('<ul class="js-event-list-'+i+' event-list"></ul>');
			$('.js-top-attractions').append(eventsContent);
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
			$('.js-event-list-'+i).append('<li><span class="property">EVENT</span>: <a href="'+event.url+'">'+event.title+'</a></li>'+
										  '<li><span class="property">VENUE</span>: <a href="'+event.venue_url+'">'+event.venue_name+'</a></li>'+
										  '<li><span class="property">CITY</span>: '+event.city_name+', '+event.region_name+' - '+event.country_name+'</li>'+
										  '<li><span class="property">VENUE</span>: '+event.venue_address+'</li>'+
										  '<li><span class="property">START TIME</span>: '+event.start_time+'</li>'+
										  '<li><span class="property">END TIME</span>: '+event.end_time+'</li>'+
										  '<li><span class="property">DESCRIPTION</span>: '+event.description+'</li>');
		}
	}
	//$('.js-events').remove();
	console.log(eventsContent.html());
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
        alert('Geocode was not successful for the following reason: ' + status);
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
function renderTextBoxTranslation(results, status){

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
        flickr.searchPhotosByGeography(googleMaps.latlng);
        googleMaps.place_id=results[0].place_id;
        console.log(googleMaps.place_id);
        //googleMaps.getPlaceDetails();
        //alert('RESULTS: '+results[0].geometry.location);
        googleMaps.getNearbyPlaces(results[0].geometry.location);
        //googleMaps.getNearbyPlaces();
        googleMaps.geocoder.geocode({'placeId': results[0].place_id}, function(results, status){
        	if(status==='OK')
        		eventful.getNearbyEvents(results[0].formatted_address);
        });

        //$('.js-top-attractions').empty().append(topAttractionsTemplate);
    } else {
            alert('Geocode was not successful for the following reason: ' + status);
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
			zoom: 8});

      googleMaps.maps.searchMap.marker=new google.maps.Marker({
          position: googleMaps.latlng,
          map: googleMaps.maps.searchMap.map,
          icon: googleMaps.ICON_BASE_URL+googleMaps.icons.position, 
          draggable: true,
          title: 'Chosen Location'
        });

      googleMaps.placeService = new google.maps.places.PlacesService(googleMaps.maps.searchMap.map);
      googleMaps.getNearbyPlaces(googleMaps.latlng);
 
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
}
function jsonFlickrApi(json){
	//console.log(json);
	renderImages(json);
}
function renderImages(imageData){
	var imageSection=$('<header class="js-image-header image-header">Search Results: </header><div class="js-image-listings image-listings"></div>');
	var images='';
	var blackList={};
	imageData.photos.photo.forEach(function(photo){
		if(photo.url_t!=='undefined')
			images+='<img src="'+photo.url_t+'" alt="'+photo.title+'">\n';
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
	imageSection.filter('.js-image-listings').append(images);
	$('.js-images-section').empty().append(imageSection);
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
}
function handleHeaderClick(){
	$('.js-translator-header').click(function(event){
		$(this).children('.js-header-image').toggleClass('header-image-clicked');
		$(this).siblings('.js-textbox').toggleClass('hidden');
	});
}

$(document).ready(function(){
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
	handleImageRetrieval();
	handleHeaderClick();
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