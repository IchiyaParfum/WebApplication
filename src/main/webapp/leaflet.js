var mymap = L.map('mapid').setView([51.505, -0.09], 3);
var apiUrl = "https://heatmap-219120.appspot.com/api";
var sensorUrl = apiUrl + "/sensors"
var charts = [];
var mapZoomDelta = 0.2;
var rawMeasurements = [];
var measurements = [];

window.onload = addMarkersToMap();

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 9,
    minZoom: 1,
    zoomDelta: mapZoomDelta,
    //noWrap: true,
    bounds: [
        [-90, -300],
        [90, 300]
    ],
    maxBounds: [
        [-90, -300],
        [90, 300]
    ],
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
        '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery � <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox.streets'
}).addTo(mymap);

mymap.on('resize', function (event) {
    calculateMinZoom(event.newSize);
});

mymap.on('zoomend', function () {
    calculateMinZoom(mymap.getSize());
});

var moveEndTimeout;
var mouseDown = false;
mymap.on('moveend', function () {
    //Make sure mouse is not pressed when trying to pan to center for better user experience
    if (!mouseDown) {
        clearTimeout(moveEndTimeout);
        moveEndTimeout = setTimeout(panToCenter, 100);
    }
});
mymap.on('mousedown', function () {
    mouseDown = true;
    clearTimeout(moveEndTimeout);
});
mymap.on('mouseup', function () {
    mouseDown = false;
    clearTimeout(moveEndTimeout);
    moveEndTimeout = setTimeout(panToCenter, 100);
})

function calculateMinZoom(newSize) {
    var factor = Math.pow(2, mapZoomDelta);
    //256x256 is the required space of the map at zoom level 0
    var size = 256;
    var minZoomLevel = 0;
    //Increase minZoomLevel until new size at min zoom level will completly take up the new size
    while (size < newSize.x || size < newSize.y) {
        size *= factor;
        minZoomLevel += mapZoomDelta;
    }
    mymap.setMinZoom(minZoomLevel);
}

function panToCenter() {
    if (mymap.getBounds().getEast() > 300 || mymap.getBounds().getWest() < -300) {
        mymap.panInsideBounds([
            [-90, -190],
            [90, 190]
        ], animate = true);
    }
}

function addMarkersToMap() {
    $.get(sensorUrl, function (data, status) {
        for (var i = 0; i < data.length; i++) {
            var marker = L.marker([data[i].location.latitude, data[i].location.longitude]).addTo(mymap);
            marker.bindPopup();
            marker.id = data[i].id;
            marker.on('click', onMarkerClick);
            function onMarkerClick(e) {
                var exists = false;
                var chartId = "chart" + e.target.id;
                charts.forEach(function (chart, index, array) {
                    if (chart.id == e.target.id) {
                        exists = true;
                    }
                });
                if (!exists) {
                    var popup = e.target.getPopup();
                    popup.setContent(getPopupHtml(e.target.id, chartId));
                }
                drawChartAndAverage(document.getElementById(chartId), e.target.id);
            }
        }
    });
}

function getPopupHtml(targetId, chartId) {
    var jsonExportUrl = sensorUrl + "/" + targetId + "/measurements.json?orderBy=+timestamp";
    var csvExportUrl = sensorUrl + "/" + targetId + "/measurements.csv?orderBy=+timestamp";

    var html =
        '<div class="tab" width="400">' +
        '   <button class="tabbutton" onclick="showDay(event,' + targetId + ')">Day</button>' +
        '   <button class="tabbutton" onclick="showWeek(event,' + targetId + ')">Week</button>' +
        '   <button class="tabbutton" onclick="showMonth(event,' + targetId + ')">Month</button>' +
        '   <button class="tabbutton" onclick="showYear(event,' + targetId + ')">Year</button>' +
        '   <button class="tabbutton active" onclick="showAll(event,' + targetId + ')">All</button>' +
        '</div>' +
        '<canvas class="chart" id="' + chartId + '" width="400" height="400""></canvas>' +
        '<section class="avgtable">' +
        '   <attributes>' +
        '       <p><b>Average Year:</b></p>' +
        '       <p><b>Average Month:</b></p>' +
        '       <p><b>Average Week:</b></p>' +
        '       <p><b>Average Day:</b></p>' +
        '       <p><b>Average Hour:</b></p>' +
        '   </attributes>' +
        '   <values>' +
        '       <p id="avgyear' + targetId + '">No data available</p>' +
        '       <p id="avgmonth' + targetId + '">No data available</p>' +
        '       <p id="avgweek' + targetId + '">No data available</p>' +
        '       <p id="avgday' + targetId + '">No data available</p>' +
        '       <p id="avghour' + targetId + '">No data available</p>' +
        '   </values>' +
        '</section>' +
        '<div class="export" width="400">' +
        '   <button type="button" onclick="window.location.href=\'' + jsonExportUrl + '\'">JSON export</button>' +
        '   <button type="button" onclick="window.location.href=\'' + csvExportUrl + '\'">CSV export</button>' +
        '</div>';
    return html;
}

function showDay(evt, sensorId) {
    handleTabButtonPress(evt);
    showPeriod(sensorId, getDateBeforeAmountOfDays(1), new Date(), 'hour');
}

function showWeek(evt, sensorId) {
    handleTabButtonPress(evt);
    showPeriod(sensorId, getDateBeforeAmountOfDays(7), new Date(), 'day');
}

function showMonth(evt, sensorId) {
    handleTabButtonPress(evt);
    showPeriod(sensorId, getDateBeforeAmountOfDays(31), new Date(), 'day');
}

function showYear(evt, sensorId) {
    handleTabButtonPress(evt);
    showPeriod(sensorId, getDateBeforeAmountOfDays(365), new Date(), 'month');
}

function showAll(evt, sensorId) {
    handleTabButtonPress(evt);
    showPeriod(sensorId, null, new Date(), 'quarter');
}

function getDateBeforeAmountOfDays(days) {
    return new Date(Date.now() - getMilisecondsPerDay() * days);
}

function getMilisecondsPerDay() {
    return 1000 * 3600 * 24;
}

function showPeriod(sensorId, minDate, maxDate, timeUnit) {
    charts.forEach(function (chart, index, array) {
        if (chart.id == sensorId) {
            updateChartConfiguration(chart.chart, minDate, maxDate, timeUnit);
        }
    });
}

function handleTabButtonPress(evt) {
    var tabButtons = document.getElementsByClassName("tabbutton");
    for (i = 0; i < tabButtons.length; i++) {
        tabButtons[i].className = tabButtons[i].className.replace(" active", "");
    }
    evt.currentTarget.className += " active";
}

function drawChartAndAverage(ctx, sensorId) {
    var url = apiUrl + "/sensors/" + sensorId + "/measurements?orderBy=+timestamp";
    rawMeasurements = [];
    $.get(url, function (data, status) {
        for (var i = 0; i < data.length; i++) {
            var measurement = {
                x: new Date(data[i].timestamp),
                y: data[i].temperature
            };
            rawMeasurements.push(measurement);
        }
        measurements = rawMeasurements;
        drawAverages(data, sensorId);
        drawChart(sensorId, ctx);
    });
}

function drawChart(sensorId, ctx) {
    var exists = false;
    charts.forEach(function (chart, index, array) {
        if (chart.id == sensorId) {
            exists = true;
        }
    });
    var chart = createChart(sensorId, ctx);
    if (!exists) {
        charts.push(chart);
    } else {
        charts.forEach(function (c, index, array) {
            if (c.id == sensorId) {
                charts[index] = chart;
            }
        });
    }
}

function createChart(sensorId, ctx) {
    var config = getChartConfiguration(null, new Date(), 'quarter');
    var chart = {
        id: 0,
        chart: null
    };
    chart.id = sensorId;
    chart.chart = new Chart(ctx, config);
    chart.chart.update();
    return chart;
}

function updateChartConfiguration(chart, minDate, maxDate, timeUnit) {
    var newConfig = getChartConfiguration(minDate, maxDate, timeUnit);
    chart.options = newConfig.options;
    chart.update();
}

function getChartConfiguration(minDate, maxDate, timeUnit) {
    return {
        type: 'line',
        data: {
            datasets: [{
                label: "Temperature in degree Celcius",
                data: measurements
            }]
        },
        options: {
            scales: {
                xAxes: [{
                    type: 'time',
                    position: 'bottom',
                    time: {
                        min: minDate,
                        max: maxDate,
                        unit: timeUnit
                    }
                }]
            }
        }
    };
}

function drawAverages(data, sensorId) {
    var avghour = { value: 0.0, count: 0 };
    var avgday = { value: 0.0, count: 0 };
    var avgweek = { value: 0.0, count: 0 };
    var avgmonth = { value: 0.0, count: 0 };
    var avgyear = { value: 0.0, count: 0 };
    var now = new Date(Date.now());
    for (var i = 0; i < data.length; i++) {
        var date = new Date(data[i].timestamp);
        if (getDateBeforeAmountOfDays(365).getTime() < date.getTime()) {
            avgyear.value += data[i].temperature;
            avgyear.count++;
            if (getDateBeforeAmountOfDays(31).getTime() < date.getTime()) {
                avgmonth.value += data[i].temperature;
                avgmonth.count++;
                if (getDateBeforeAmountOfDays(7).getTime() < date.getTime()) {
                    avgweek.value += data[i].temperature;
                    avgweek.count++;
                    if (getDateBeforeAmountOfDays(1).getTime() < date.getTime()) {
                        avgday.value += data[i].temperature;
                        avgday.count++;
                        if (getDateBeforeAmountOfDays(1 / 24).getTime() < date.getTime()) {
                            avghour.value += data[i].temperature;
                            avghour.count++;
                        }
                    }
                }
            }
        }
    }
    drawAverageToParagraph(avghour, "avghour" + sensorId);
    drawAverageToParagraph(avgday, "avgday" + sensorId);
    drawAverageToParagraph(avgweek, "avgweek" + sensorId);
    drawAverageToParagraph(avgmonth, "avgmonth" + sensorId);
    drawAverageToParagraph(avgyear, "avgyear" + sensorId);
}

function drawAverageToParagraph(avg, paragraphId) {
    if (avg.count > 0) {
        document.getElementById(paragraphId).innerHTML = (avg.value / avg.count).toFixed(1) + " &#176C";
    }
}