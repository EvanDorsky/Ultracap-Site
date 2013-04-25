$(document).ready(function() {
    var w = 500;
    var h = 500;

// Define an SVG with width and height, and place it in the body
var svgContainer = d3.select("body")
.append("svg")
.attr("width", w)
.attr("height", h);

// Defines the the graph based on the input data
function graphGen (data, scales) {
    var length = data.length;

    // Defines the main polygon
    var polygonLine = d3.svg.line()
    .x(function(d, i) {
        var theta = 2*Math.PI*i/length;
        if (!isNaN(d)) {
            return w/2+scales[i](d*Math.cos(theta))/100;
        }
        return w/2+50*Math.cos(theta);
    })
    .y(function(d, i) {
        var theta = 2*Math.PI*i/length;
        if (!isNaN(d)) {
            return w/2+scales[i](d*Math.sin(theta))/100;
        }
        return w/2+50*Math.sin(theta);
    })
    .interpolate("linear");

    return polygonLine(data);
}

var polygon;

// Data is bound to the line from the CSV, added to the SVG as a path, and styled
// Everything has to happen here because CSV is asynchronous
// Nothing after this call will have access to any variables assigned here
d3.csv("TestData.csv", function(data) {
    var dataArray = [];
    var subArray = [];
    for (var i = 0; i < data.length; i++) {
        var entry = data[i];
        subArray = [];
        for (var key in entry) {
            subArray.push(entry[key]);
        }
        dataArray.push(subArray);
    }
//FIRST DO AXES
    // First set up the empty array
    var sortedData = [];
    for (var j = 0; j < subArray.length; j++) {
        sortedData.push([]);
    }

    // Transposing the data
    for (var i = 0; i < dataArray.length; i++) {
        for (var j = 0; j < dataArray[i].length; j++) {
            sortedData[j][i] = dataArray[i][j];
        }
    }

    // Then create the scales and append the axes
    // A scale for each row finding the max

    var scales = [];
    for (var i = 0; i < sortedData.length; i++) {
        var axisScale = d3.scale.linear()
        .domain([0, d3.max(sortedData[i], function(d) { return d[0]; })])
        .range([0, w/2]);
        scales.push(axisScale);
    }
    alert(dataArray);
    alert(sortedData);
    
//THEN DO POLYGON
    // Make a polygon for each row
    for (var i = 0; i < data.length; i++) {
        polygon = svgContainer.append("path")
        .attr("d", graphGen(dataArray[i], scales) + "Z")
        .attr("class", "polygon")
        .attr("fill-opacity", 0.5);
    }

});

});