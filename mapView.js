$(document).ready(function () {
    // parse down the query string
    // drop the ?, thanks SO
    var qsPairs = window.location.search.substring(1).split('&'); 
    var qsPairsLen = qsPairs.length;
    var query = {};
    for (var i = 0; i < qsPairsLen; i++) {
	var splitPair = qsPairs[i].split('=')
	query[splitPair[0]] = splitPair[1];
    }

    var mapId = query.mapId?query.mapId:'46244';

    // config section
    // it'd be better if the key was left as is, so that we can track traffic
    // style #46244 is the one Matt built for this project
    var tileUrl = 'http://{s}.tile.cloudmade.com/2d634343963a4426b126ab70b62bba2a/' + mapId + '/256/{z}/{x}/{y}.png';
    var tileAttr = 'Basemap data &copy; 2011 OpenStreetMap contributors, Imagery &copy; 2011 CloudMade';

    var baseLayer = new L.TileLayer(tileUrl, 
				    {maxZoom: 18, attribution: tileAttr});

    var transitLayer = new L.TileLayer("gis/trimetTiles/{z}/{x}/{y}.png",
				       {maxZoom: 18, attribution: 'Transit data courtesy TriMet'});
    

    var lat = query.lat?Number(query.lat):45.5240;
    var longitude = query.lon?Number(query.lon):-122.6810;
    var zoom = query.zoom?Number(query.zoom):14;

    var map = new L.Map(
	'map')
	.setView(new L.LatLng(lat, longitude), zoom)
	.addLayer(baseLayer)
	.addLayer(transitLayer);

    // update the link
    map.on('moveend', function (e) {
	// this gets just the URL up the the query string exclusive
	var url = window.location.href.replace(window.location.search, '') +
	    '?lon=' + map.getCenter().lng +
	    '&lat=' + map.getCenter().lat +
	    '&zoom=' + map.getZoom() +
	    '&mapId=' + mapId;

	// update the href and the link text
	$('#link').attr('href', url).text(url);
    });
});