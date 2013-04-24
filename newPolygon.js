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
var lineFunction = d3.svg.line()
.x(function(d, i) {
    if (!isNaN(d[i])) {
        var length = d.length;
        var theta = 2*Math.PI*i/length;
        return w/2+d[0]*Math.cos(theta);
    }
    return 0;
})
.y(function(d, i) {
    if (!isNaN(d[i])) {
        var length = d.length;
        var theta = 2*Math.PI*i/length;
        return w/2+d[0]*Math.cos(theta);
    }
    return 0;
})
.interpolate("linear");

var polygon;

// Data is bound to the line from the CSV, added to the SVG as a path, and styled
d3.csv("TestData.csv", function(data) {
    var dataArray = [];
    var subArray = [];
    for (var i = 0; i < data.length; i++) {
        var entry = data[i];
        subArray = [];
        for (var j = 0; j < entry.length; j++) {
            subArray.push(entry[j]);
        }
        dataArray.push(entry);
    }
    polygon = svgContainer.append("path")
    .attr("d", lineFunction(dataArray))
    .attr("fill", "blue");
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