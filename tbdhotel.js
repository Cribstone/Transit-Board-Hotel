var realTimeArrivals;
if (console.log != undefined) var log = console.log;
else var log = function (m) {};

$(document).ready(function () {
    trArr({
	configString: window.location.search,
	displayInterval: 30*1000,
	displayCallback: function (data) {
	    // save the real-time arrivals; they will be ref'd later on
	    // I don't think there's any chance of this being referred to as
	    realTimeArrivals = data;
	},
	initializeCallback: function (data) {
	    realTimeArrivals = data;
	    setTimeout(tbdHotel, 10);
	}
    });
});

function tbdHotel() {
    // set the sizes
    // one height unit = 1%
    var hu = $(window).height() / 100;
    
    $('#head-box').height(15*hu);
    $('#slideshow').height(56*hu);
    $('#trip-box').height(23*hu);

    // nested inside trip-box
    $('#narrative').height(16*hu);
    $('#trip-details').height(6*hu);

    $('#bar').height(6*hu);

    // allow them to set either a CloudMade style or a custom tile server
    if (realTimeArrivals.optionsConfig.cloudmadeStyle != undefined) {
	// config section
	// it'd be better if the key was left as is, so that we can track traffic
	// style #46244 is the one Matt built for this project
	var tileUrl = 'http://{s}.tile.cloudmade.com/2d634343963a4426b126ab70b62bba2a/'+
	    realTimeArrivals.optionsConfig.cloudmadeStyle[0] +
	    '/256/{z}/{x}/{y}.png';
	
	var tileAttr = 'Map data &copy; 2011 OpenStreetMap contributors, Imagery &copy; 2011 CloudMade';
    }
    else if (realTimeArrivals.optionsConfig.tileUrl != undefined) {
	var tileUrl = realTimeArrivals.optionsConfig.tileUrl[0]
	if (realTimeArrivals.optionsConfig.tileAttr != undefined)
	    var tileAttr = realTimeArrivals.optionsConfig.tileAttr[0]
	else var tileAttr = '';
    }
    else {
	// config section
	// it'd be better if the key was left as is, so that we can track traffic
	// style #46244 is the one Matt built for this project
	var tileUrl = 'http://{s}.tile.cloudmade.com/2d634343963a4426b126ab70b62bba2a/46244/256/{z}/{x}/{y}.png';
	
	var tileAttr = 'Map data &copy; 2011 OpenStreetMap contributors, Imagery &copy; 2011 CloudMade';
    }    
	
    var rights_string = '';
    for (var agency in realTimeArrivals.stopsConfig) {
        rights_string += realTimeArrivals.agencyCache.agencyData(agency).rights_notice+" ";
    }

    tileAttr += rights_string;

    var baseLayer = new L.TileLayer(tileUrl, 
				    {maxZoom: 18, attribution: tileAttr});

    var transitLayer = new L.TileLayer("gis/trimetTiles/{z}/{x}/{y}.png",
				       {maxZoom: 18});
    
    // add this back
    //{zoomControl: false})
    var map = new L.Map(
	'map')
	.setView(new L.LatLng(45.5240, -122.6810), 14)
	.addLayer(baseLayer)
	.addLayer(transitLayer);


    // parse out the destinations
    var destIds = realTimeArrivals.optionsConfig.destinations[0].split(',');
    console.log('destinations: ' + destIds.join(' '));

    // Use the Couch Multiple Document Interface to fetch all of the
    // destinations in one fell swoop
    $.ajax({
	// include the documents, get them all
	url: 'http://transitappliance.couchone.com/destinations/_all_docs?include_docs=true',
	dataType: 'jsonp',
	type: 'GET',
	// filter to just the IDs we want
	data: {keys: destIds},
	success: function (data) {
	    console.log('Successfully retrieved data');
	}
    });
}

