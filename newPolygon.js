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
genData();

d3.csv("TestData.csv", function(data) {
    console.log(data);
});

// Defines the line that will surround the polygon
// The data is read and "bound" here
var lineFunction = d3.svg.line()
.x(function(d, i) {
    var length = lineData.length;
    var theta = 2*Math.PI*i/length;
    return w/2+d*Math.cos(theta);
})
.y(function(d, i) {
    var length = lineData.length;
    var theta = 2*Math.PI*i/length;
    return h/2+d*Math.sin(theta);
})
.interpolate("linear");

// Define an SVG with width and height, and place it in the body
var svgContainer = d3.select("body")
.append("svg")
.attr("width", w)
.attr("height", h);

// A path is defined by the line, added to the SVG, and styled
var polygon = svgContainer.append("path")
.attr("d", lineFunction(lineData))
.attr("fill", "blue");
polygon.on('click', function(){randomize()});

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