var mymap;
var baseURL = "http://webapplication-226612.appspot.com/Datastore";
var popupOptions = {
	    minWidth: 400	    
	};

window.onload = initMap();

function initMap(){
	//Create and link map to div
	mymap = L.map('mapid');

	// create the tile layer with correct attribution
	var mbUrl='https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';
	var mbAttrib='Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
	'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
	'Imagery � <a href="https://www.mapbox.com/">Mapbox</a>';
	var mbId = 'mapbox.streets';
	var mb = new L.TileLayer(mbUrl, {minZoom: 1, maxZoom: 12, attribution: mbAttrib, id: mbId});		

	// start the map in South-East England
	setMapSize();
	mymap.setView(new L.LatLng(51.3, 0.7),3);
	mymap.addLayer(mb);	
	addMarkersToMap();
}

function setMapSize(){
	var element = document.getElementById('title').clientHeight;
	document.getElementById("mapid").style.height = document.body.clientHeight - element + 'px';
}

function addMarkersToMap() {
	$.getJSON(baseURL , function (data) {
        for (var i = 0; i < data.length; i++) {
            var marker = L.marker([data[i].locLat, data[i].locLong]).addTo(mymap);
            marker.id = data[i].id;	//Make marker id to sensor id
            
            //Popup
            var popup = L.popup();
            marker.bindPopup(popup, popupOptions);
            marker.on('click', onMarkerClick);
            
            function onMarkerClick(e){
            	var popup = e.target.getPopup();
                popup.setContent(getPopupContent(e.target.id));
                plotGraph(e.target.id);
                //alert(popup.getContent())
                popup.update();
            }

        }
    });
}

function getPopupContent(id){
	var jsonExportUrl = baseURL + "?res=temperatures_'+id+'.json&id=" + id;
    var csvExportUrl = baseURL + "?res=temperatures_'+id+'.csv&id=" + id;

    var html = '<div id="table'+id+'"></div>' +
    '<div>' +
    '	<a class="center">' +   
    '   	<button class="export" type="button" onclick="window.location.href=\'' + jsonExportUrl + '\'">JSON export</button>' +
    '   	<button class="export" type="button" onclick="window.location.href=\'' + csvExportUrl + '\'">CSV export</button>' +
    '	</a>' +
    '</div>';
    	return html;
}

function plotGraph(id){
	var xData = [];
	var yData = [];
	$.getJSON(baseURL + "?id=" + id , function (data) {
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
  	
        var link = document.getElementById('table' + id);
  	  	Plotly.newPlot(link, dataSet, layout);
    });
}