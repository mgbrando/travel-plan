var photoTemplate='<img src="" alt="">';

var instagram={
	BASE_URL: 'https://api.instagram.com/v1',
	media: '/media/search', 
	config: {},
	init: function(options){
		options = options || {};

		this.config.client_id=options.client_id;
		this.config.access_token=options.access_token;
	},

	searchPhotosByGeography: function(searchTerm){
		//35.6895° N, 139.6917° E

		$.ajax({
				type: "GET",
				url: this.BASE_URL+this.media, 
				data: {client_id: this.config.client_id, access_token: this.config.access_token, scope:'basic+public_content+comments', lat: 40.7128, lng: 139.6917, distance: 5000},
				dataType: "jsonp",
				callback: renderImages
				/*success: renderImages{client_id: this.config.clientID, lat: 35.6895, lng: 139.6917}, renderImages*/
			});
			/*$.getJSON(this.BASE_URL+this.media, {client_id: this.config.client_id, 
				access_token: this.config.access_token, lat: 35.6895, lng: 35.6895});*/
	}
};

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

var googleMaps={
	MAPS_BASE_URL: 'https://maps.googleapis.com/maps/api/js',
	GEOCODER_BASE_URL: 'https://maps.googleapis.com/maps/api/geocode/json',
	PLACES_BASE_URL: 'https://maps.googleapis.com/maps/api/place',
	PLACES_SEARCH: '/nearbysearch/json',
	PLACES_DETAILS: '/details/json',
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
	maps: {searchMap: {map: null, marker: null}, imageMap: {map: null, marker: null}},
	config:{},

	init: function(options){
		options = options || {};

		this.config.api_key=options.api_key;
	},
	getPlaceDetails: function(place_id){
		this.placeService.nearbySearch({location: this.place_id}, renderPlaceDetails);
	},
	getNearbyPlaces: function(){
		this.placeService.nearbySearch({location: this.latlng}, renderNearbyPlaces);
	}
/*	getMapByArea: function(area){
			$.ajax({
				type: "GET",
				url: this.GEOCODER_BASE_URL,
				data: {key: this.config.api_key, address: area, callback: renderMap},
				dataType: "jsonp"
			});		
	},*/
/*	getNearbyPlaces: function(){
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
/*function Place(details){
	this.details=details;
}
function CurrentLocation(){

}
CurrentLocation.prototype=new Place();*/

/*var currentLocation = {
	details: null,
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
};*/
/*var googleGeocoder={
	BASE_URL: 'https://maps.googleapis.com/maps/api/geocode/json',
	//geocoder: null,
	config:{},

	init: function(options){
		options = options || {};

		this.config.api_key=options.api_key;
	},
	getMapByArea: function(area){
			$.ajax({
				type: "GET",
				url: this.BASE_URL,
				data: {key: this.config.api_key, location: area, callback: renderMap},
				dataType: "jsonp",
			});		
	}
};*/
function renderPlaceDetails(results, status){
	if(status === 'OK'){

	}
	else {
        alert('Geocode was not successful for the following reason: ' + status);
    }	
}

function renderNearbyPlaces(results, status){
	if(status === 'OK'){

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
function renderMarkersAndImages(results, status){
    if (status === 'OK') {
    	googleMaps.maps.searchMap.map.setCenter(results[0].geometry.location);
    	if(googleMaps.search_type==='address')
        	googleMaps.maps.searchMap.marker.setPosition(results[0].geometry.location);
        //$('#js-search-form').children('.js-search-input').val('');
        flickr.searchPhotosByGeography(googleMaps.maps.searchMap.marker.getPosition());
        googleMaps.place_id=results[0].place_id;
        console.log(googleMaps.place_id);
    } else {
            alert('Geocode was not successful for the following reason: ' + status);
    }	
}
function renderPosition(input){
	//var place_id='';
	var places=null;
	if(typeof input === 'string'){
		getPositionDetails('address', input);
		/*googleMaps.geocoder.geocode({address: input}, function(results, status){
          if (status === 'OK') {
            googleMaps.maps.searchMap.map.setCenter(results[0].geometry.location);
            googleMaps.maps.searchMap.marker.setPosition(results[0].geometry.location);
            //$('#js-search-form').children('.js-search-input').val('');
            flickr.searchPhotosByGeography(googleMaps.maps.searchMap.marker.getPosition());
            googleMaps.place_id=results[0].place_id;
            console.log(googleMaps.place_id);
          } else {
            alert('Geocode was not successful for the following reason: ' + status);
          }		
		});*/
	}
	else{
		getPositionDetails('location', input);
  	  	/*googleMaps.geocoder.geocode({location: input}, function(results, status){
          if (status === 'OK') {
            googleMaps.maps.searchMap.map.setCenter(googleMaps.latlng);
            //googleMaps.maps.searchMap.marker.setPosition(results[0].geometry.location);
            console.log(results[0].formatted_address);
            $('#js-search-form').children('.js-search-input').val(results[0].formatted_address);
            flickr.searchPhotosByGeography(googleMaps.maps.searchMap.marker.getPosition());
            googleMaps.place_id=results[0].place_id;
            console.log(googleMaps.place_id);
          } else {
            alert('Geocode was not successful for the following reason: ' + status);
          }		
		});*/
	}
	//console.log(googleMaps.place_id);
	//var details=googleMaps.getPlaceDetails(place_id);
	//console.log('past details '+details);
	//var nearbyAttractions=googleMaps.getNearbyPlaces();
	//googleMaps.currentLocation=
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
function renderPlaces(response){
	console.log(response);
	var places=response[1];
	console.log(places);
}
function renderPlaceDetails(response){
	console.log(response);
	console.log(response[1].name);
}
function initMaps(response){
      googleMaps.latlng = {lat: 36.204824, lng: 138.252924}; 
      googleMaps.geocoder = new google.maps.Geocoder();
      googleMaps.maps.searchMap.map=new google.maps.Map(document.getElementById('search-map'),
			{center: googleMaps.latlng,
			zoom: 8});

      googleMaps.maps.searchMap.marker=new google.maps.Marker({
          position: googleMaps.latlng,
          map: googleMaps.maps.searchMap.map,
          draggable: true,
          title: 'Chosen Location'
        });

      googleMaps.placeService = new google.maps.places.PlacesService(googleMaps.maps.searchMap.map);

      /*googleMaps.maps.searchMap.marker.addListener('mouseup', function(event){
      	coordinates.lat=this.getPosition().lat();
      	coordinates.lng=this.getPosition().lng();
      	console.log(coordinates.lat+', '+coordinates.lng);
  	  });*/
      //handleSearchSubmit();
  	  /*map.addListener('center_changed', function() {
    	// 3 seconds after the center of the map has changed, pan back to the
    	// marker.
    	window.setTimeout(function() {
      	map.panTo(marker.getPosition());
        }, 5000);
  	  });

      marker.addListener('click', function() {
    	map.setCenter(marker.getPosition());
  	  });
  	  var startPosition;
  	  var endPosition;

  	  marker.addListener('mousedown', function(event){

  	  });*/

  	  googleMaps.maps.searchMap.marker.addListener('dragend', function(event){
  	  	googleMaps.latlng=googleMaps.maps.searchMap.marker.getPosition();
  	  	renderPosition(googleMaps.latlng);
  	  	//$('#js-search-form').children('.js-search-input').val('');
  	  });
}
function jsonFlickrApi(json){
	//console.log(json);
	renderImages(json);
}
function renderImages(imageData){
	var imageSection=$('<div class="js-image-listings image-listings"></div>');
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
	imageSection.append(images);
	$('.js-images-section').empty().append(imageSection);
}

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
}*/

/*function makeCORSrequest(urlWithParameters){
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

//Handlers
function handleSearchSubmit(){
	$('#js-search-form').submit(function(event){
		console.log('hi');
		event.preventDefault();
		googleMaps.latlng=googleMaps.maps.searchMap.marker.getPosition();
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
	var instagramOptions={client_id: 'fa425cf23d9e4396962f2cae7517363b', 
		access_token: '4300816370.fa425cf.9c249b6ed2594187bdec7f18fdbd0fbf'};
	var flickerOptions={api_key: 'fce2cc179918f3569a6ceb86165c46c3'};
	var googleOptions={api_key: 'AIzaSyDCz6gKlHvkMprHXZ5gYtJvhiS9aUbDY9o'};

	instagram.init(instagramOptions);
	flickr.init(flickerOptions);
	googleMaps.init(googleOptions);
	//geoCoder.init(googleOptions);

	handleSearchSubmit();
	handleImageRetrieval();
	handleHeaderClick();
});