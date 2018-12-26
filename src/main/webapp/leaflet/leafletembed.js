var mymap;
var baseURL = "http://webapplication-226612.appspot.com/Datastore";
var charts = [];
var rawMeasurements = [];
var measurements = [];

window.onload = addMarkersToMap();

//Create and link map to div
mymap = L.map('mapid');

// create the tile layer with correct attribution
var osmUrl='https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png';
var osmAttrib='Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors';
var osm = new L.TileLayer(osmUrl, {minZoom: 1, maxZoom: 12, attribution: osmAttrib});		

// start the map in South-East England
mymap.setView(new L.LatLng(51.3, 0.7),1);
mymap.addLayer(osm);

var markerOptions = {
	    radius: 8,
	    fillColor: "#ff7800",
	    color: "#000",
	    weight: 1,
	    opacity: 1,
	    fillOpacity: 0.8
	};

function addMarkersToMap() {
	$.getJSON(baseURL + "?option=sensors" , function (data) {
        for (var i = 0; i < data.length; i++) {
            var marker = L.circleMarker([data[i].locLat, data[i].locLong], markerOptions).addTo(mymap);
            marker.id = data[i].id;
            marker.on('click', plotGraph);
        }
    });
}

function plotGraph(e){
	var xData = [];
	var yData = [];
	$.getJSON(baseURL + "?option=values&id=" + e.target.id , function (data) {
        for (var i = 0; i < data.length; i++) {
            xData[i] = new Date(data[i].timestamp);
            yData[i] = data[i].temperature;
        }
        
        var dataSet = [
  	  	  {
  	  	    x: xData,
  	  	    y: yData,
  	  	    type: 'scatter'
  	  	  }
  	  	];
  	
        var layout = {
  			  title: 'Temperature',
  			  xaxis: {
  			    title: 'Point of time',
  			    showgrid: false,
  			    zeroline: false
  			  },
  			  yaxis: {
  			    title: 'Temperature in degrees',
  			    showline: false
  			  }
  			};
  	
  	  	Plotly.newPlot('table', dataSet, layout);
    });
}