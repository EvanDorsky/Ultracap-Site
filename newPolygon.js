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
    var length = lineData.length;
    var theta = 2*Math.PI*i/length;
    return w/2+2*Math.cos(theta);
})
.y(function(d, i) {
    var length = lineData.length;
    var theta = 2*Math.PI*i/length;
    return h/2+2*Math.sin(theta);
})
.interpolate("linear");

// Data is bound to the line, added to the SVG as a path, and styled
var polygon = svgContainer.append("path")
.attr("d", lineFunction(function() {
    d3.csv("TestData.csv", function(data) {
        console.log(data);
        return data;
    });
}))
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