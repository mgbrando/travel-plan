function createCORSRequest(method, url) {
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
  	request.onload=function(){

  	}

  	request.onerror=function(){
  		throw new Error('There was an error making the request.');
  	}
}

//Handlers
function handleHeaderClick(){
	$('.js-translator-header').click(function(event){
		$(this).children('.js-header-image').toggleClass('header-image-clicked');
		$(this).siblings('.js-textbox').toggleClass('hidden');
	});
}

$(document).ready(function(){

	handleHeaderClick();
});