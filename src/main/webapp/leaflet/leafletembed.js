var map;
var ajaxRequest;
var plotlist;
var plotlayers=[];

//set up the map
map = new L.Map('mapid').setView([42.35, -71.08], 13);;

// create the tile layer with correct attribution
var osmUrl='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
var osmAttrib='Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors';
var osm = new L.TileLayer(osmUrl, {minZoom: 8, maxZoom: 12, attribution: osmAttrib});		

// start the map in South-East England
map.setView(new L.LatLng(51.3, 0.7),9);
map.addLayer(osm);