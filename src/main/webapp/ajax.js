/*
 * Requests data over http from server
 */
function loadRes(url, cFunction) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
     cFunction(this);
    }
  };
  xhttp.open("GET", url, true);
  xhttp.send();
}

/*
 * Load markers in GeoJson format from server
 */
function getMarkers(xhttp){
	
}

/*
 * Load time series as csv from device with id from server
 */
function getTimeSeries(id, xhttp){
	document.getElementById('ErrorMessage').innerHTML = xhttp.responseXML;
}