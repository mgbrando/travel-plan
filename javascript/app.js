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
				data: {method: 'flickr.photos.search', api_key: this.config.api_key, format: 'json', media: 'photos', tags: 'nature, museum, forest, architecture, venue, scenery', sort: 'interestingness-desc', content_type: 1, accuracy: 11, has_geo: 2, lat: position.lat(), lon: position.lng(), extras: 'url_t'},
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
	geocoder: null,
	maps: {searchMap: {map: null, marker: null}, imageMap: {map: null, marker: null}},
	config:{},

	init: function(options){
		options = options || {};

		this.config.api_key=options.api_key;
	},
	getMapByArea: function(area){
			$.ajax({
				type: "GET",
				url: this.GEOCODER_BASE_URL,
				data: {key: this.config.api_key, address: area, callback: renderMap},
				dataType: "jsonp"
			});		
	}
};

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
function renderMap(geocode){
	console.log(geocode);
	googleMaps.geocoder = new google.maps.Geocoder();
    var latlng = new google.maps.LatLng(geocode.geometry.location[0], geocode.geometry.location[1]);
    var mapOptions = {
      zoom: 8,
      center: latlng
    }
    googleMaps.maps.searchMap.map = new google.maps.Map(document.getElementById('search-map'), mapOptions);

}
function initMaps(response){
      /*function initMap() {
        var uluru = {lat: -25.363, lng: 131.044};
        var map = new google.maps.Map(document.getElementById('search-map'), {
          zoom: 4,
          center: uluru
        });
        var marker = new google.maps.Marker({
          position: uluru,
          map: map
        });
      }*/
      var coordinates={lat: 40.7128, lng: 139.6917};
      //var map=googleMaps.maps.searchMap.map;
      //var marker=googleMaps.maps.searchMap.marker;
      var latlng = new google.maps.LatLng(40.7128, 139.6917);
      googleMaps.geocoder = new google.maps.Geocoder();
      googleMaps.maps.searchMap.map=new google.maps.Map(document.getElementById('search-map'),
			{center: coordinates,
			zoom: 8});

      googleMaps.maps.searchMap.marker=new google.maps.Marker({
          position: coordinates,
          map: googleMaps.maps.searchMap.map,
          draggable: true,
          title: 'Chosen Location'
        });

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

  	  marker.addListener('mousedown', function(){
  	  });

  	  marker.addListener('mouseup', function(event){
  	  	marker.setPosition(event.latlng);
  	  });*/
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
		var input = $(this).children('.js-search-input').val();
		googleMaps.geocoder.geocode({address: input}, function(results, status){
          if (status === 'OK') {
            googleMaps.maps.searchMap.map.setCenter(results[0].geometry.location);
            googleMaps.maps.searchMap.marker.setPosition(results[0].geometry.location);
            flickr.searchPhotosByGeography(googleMaps.maps.searchMap.marker.getPosition());
          } else {
            alert('Geocode was not successful for the following reason: ' + status);
          }		
		});
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