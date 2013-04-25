$(document).ready(function() {
    var w = 500;
    var h = 500;

    var lineData = [];

// Generates test data
function genData() {
    lineData = [];
    var numDataPoints = 8;
    var xRange = w/2;
    for (var i = 0; i < numDataPoints; i++) {
        var newNumber1 = Math.round(Math.random() * xRange);
        lineData.push(newNumber1);
    }
}
// Call this to have the data for the first run
genData();

// Define an SVG with width and height, and place it in the body
var svgContainer = d3.select("body")
.append("svg")
.attr("width", w)
.attr("height", h);

// Defines the line that will surround the polygon
// The "d" argument here is data passed into lineFunction
// by calling code
// This is a function, even though it's defined as a variable
function lineGenerator (data) {
    var lineFunction = d3.svg.line()
    .x(function(d, i) {
        var length = data.length;
        var theta = 2*Math.PI*i/length;
        if (!isNaN(d)) {
            return w/2+d*Math.cos(theta);
        }
        return w/2+50*Math.cos(theta);
    })
    .y(function(d, i) {
        var length = data.length;
        var theta = 2*Math.PI*i/length;
        if (!isNaN(d)) {
            return w/2+d*Math.sin(theta);
        }
        return w/2+50*Math.sin(theta);
    })
    .interpolate("linear");

    return lineFunction(data);
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
        .attr("d", lineGenerator(dataArray[i]))
        .attr("fill", "blue")
        .fill-opacity(0.5);
    }
});

// polygon.on('click', function(){randomize()});

// This randomizes the data when the button is pressed
function update() {
    genData();
    svgContainer.select("path")
    .transition()
    .duration(800)
    .attr("d", lineFunction(lineData));
}

// The actual function called by the button
function randomize() {
    update();
}
});