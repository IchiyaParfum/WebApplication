var map;
var ajaxRequest;
var plotlist;
var plotlayers=[];

function initmap(){
	//set up the map
	map = new L.Map('mapid').setView([42.35, -71.08], 1);;

	// create the tile layer with correct attribution
	var osmUrl='https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png';
	var osmAttrib='Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors';
	var osm = new L.TileLayer(osmUrl, {minZoom: 1, maxZoom: 12, attribution: osmAttrib});		

	// start the map in South-East England
	map.setView(new L.LatLng(51.3, 0.7),1);
	map.addLayer(osm);
	addGeoJson();
}

function addGeoJson(){
	var geojsonMarkerOptions = {
		    radius: 8,
		    fillColor: "#ff7800",
		    color: "#000",
		    weight: 1,
		    opacity: 1,
		    fillOpacity: 0.8
		};
	
	var geojsonFeature = {
		    "type": "Feature",
		    "properties": {
		        "name": "Coors Field",
		        "amenity": "Baseball Stadium",
		        "popupContent": "This is where the Rockies play!"
		    },
		    "geometry": {
		        "type": "Point",
		        "coordinates": [8.227512, 46.818188]
		    }
		};

	L.geoJSON(geojsonFeature, {
	    onEachFeature: onEachFeature,
	    pointToLayer: function (feature, latlng) {
	        return L.circleMarker(latlng, geojsonMarkerOptions);
	    }
	    
	}).addTo(map);
	
}

function onEachFeature(feature, layer) {
    // does this feature have a property named popupContent?
    if (feature.properties && feature.properties.popupContent) {
        layer.bindPopup(feature.properties.popupContent);
    }
}