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
    '<div>'+
    '	<section class="aggregation">'+
    '		<attribute>'+
    '			<p>Average week:</p>'+
    '			<p>Average month:</p>'+
    '			<p>Average year:</p>'+
    '		</attribute>'+
    '		<value>'+
    '			<p id="avgWeek'+id+'">Not enough data</p>'+
    '			<p id="avgMonth'+id+'">Not enough data</p>'+
    '			<p id="avgYear'+id+'">Not enough data</p>'+
    '		</value>'+
    '	</section>'+
    '</div>'+
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
	//Get data of sensor from server
	$.getJSON(baseURL + "?id=" + id , function (data) {
        for (var i = 0; i < data.length; i++) {
            xData[i] = new Date(data[i].timestamp);
            yData[i] = data[i].temperature;
        }
    //Create data set and plot   
        var dataSet = [
  	  	  {
  	  	    x: xData,
  	  	    y: yData,
  	  	    type: 'scatter'
  	  	  }
  	  	];

        var layout = {
  			  xaxis: {
  			    showgrid: true,
  			    zeroline: true
  			  },
  			  yaxis: {
  			    title: 'Temperature in degrees celsius',
  			    showline: false
  			  }
  			};
  	
        var link = document.getElementById('table' + id);
  	  	Plotly.newPlot(link, dataSet, layout);
  	  	
  	  	//Calculate average temperatures
  	  	document.getElementById('avgWeek' + id).innerHTML = getAvgWeek(xData, yData);
  	  	document.getElementById('avgMonth' + id).innerHTML = getAvgMonth(xData, yData);
  	  	document.getElementById('avgYear' + id).innerHTML = getAvgYear(xData, yData);
    });
}

function getAvgWeek(xData, yData){
	var cur = new Date();
	var thisWeek = new Date();	//Week starts on sunday
	var milliADay = 24*60*60*1000;
	thisWeek.setTime(cur.getTime() - cur.getDay()*milliADay);
	thisWeek.setHours(0);
	thisWeek.setMinutes(0);
	thisWeek.setSeconds(0);
	thisWeek.setMilliseconds(0);

	var nextWeek = new Date();
	nextWeek.setTime(thisWeek.getTime() + milliADay*7);
	
	var count = 0;
	var temp = 0;

	for (var i = 0; i < xData.length; i++) {
		//Data within this week	
        if(xData[i] >= thisWeek && xData[i] < nextWeek ){
        	count++;
        	temp+=yData[i];
        }
    }
	
	if(count == 0){
		return 'No data';
	}
	return round2Significant(temp/count, 2) + " &#8451";
}

function getAvgMonth(xData, yData){
	var cur = new Date();
	var thisMonth = new Date();
	thisMonth.setDate(1);
	thisMonth.setHours(0);
	thisMonth.setMinutes(0);
	thisMonth.setSeconds(0);
	thisMonth.setMilliseconds(0);
	
	var nextMonth = new Date();
	nextMonth.setTime(thisMonth.getTime());
	nextMonth.setMonth((thisMonth.getMonth()+1)%12)
	if(thisMonth.getMonth()+1 > 11){
		nextMonth.setFullYear(thisMonth.getFullYear()+1)
	}
	
	var count = 0;
	var temp = 0;

	for (var i = 0; i < xData.length; i++) {
		//Data within this week	
        if(xData[i] >= thisMonth && xData[i] < nextMonth ){
        	count++;
        	temp+=yData[i];
        }
    }
	
	if(count == 0){
		return 'No data';
	}
	return round2Significant(temp/count, 2) + " &#8451";
}

function getAvgYear(xData, yData){
	var cur = new Date();
	var thisYear = new Date();
	thisYear.setMonth(0);
	thisYear.setDate(1);
	thisYear.setHours(0);
	thisYear.setMinutes(0);
	thisYear.setSeconds(0);
	thisYear.setMilliseconds(0);
	
	var nextYear = new Date();
	nextYear.setTime(thisYear.getTime());
	nextYear.setFullYear(thisYear.getFullYear()+1)

	var count = 0;
	var temp = 0;

	for (var i = 0; i < xData.length; i++) {
		//Data within this week	
        if(xData[i] >= thisYear && xData[i] < nextYear ){
        	count++;
        	temp+=yData[i];
        }
    }
	
	if(count == 0){
		return 'No data';
	}
	return round2Significant(temp/count, 2) + " &#8451";
}

function round2Significant(value, significant){
	return Math.round(value * Math.pow(10, significant))/Math.pow(10, significant);
}