$(document).ready(function() {
    var w = 500;
    var h = 500;

// Define an SVG with width and height, and place it in the body
var svgContainer = d3.select("body")
.append("svg")
.attr("width", w)
.attr("height", h);

// Defines the the polygon based on the input data
function polygonGen (data) {
    var length = data.length;
    var polygonLine = d3.svg.line()
    .x(function(d, i) {
        var theta = 2*Math.PI*i/length;
        if (!isNaN(d)) {
            return w/2+d*Math.cos(theta);
        }
        return w/2+50*Math.cos(theta);
    })
    .y(function(d, i) {
        var theta = 2*Math.PI*i/length;
        if (!isNaN(d)) {
            return w/2+d*Math.sin(theta);
        }
        return w/2+50*Math.sin(theta);
    })
    .interpolate("linear");

    return polygonLine(data);
}

var polygon;

// Data is bound to the line from the CSV, added to the SVG as a path, and styled
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
    var column1 = dataArray[0];
    for (var i = 0; i < data.length; i++) {
        polygon = svgContainer.append("path")
        .attr("d", polygonGen(dataArray[i]))
        .attr("fill", "blue")
        .attr("fill-opacity", 0.5)
        .attr("class", "polygon");
    }
});

});