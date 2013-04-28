$(document).ready(function() {
    var w = 500;
    var h = 500;

// Define an SVG with width and height, and place it in the body
var svgContainer = d3.select("svg.energy_sources")

// Defines the the polygon for the graph
// based on the input data
function graphGen (data, scales) {
    var length = data.length;
    // Defines the main polygon
    var polygonLine = d3.svg.line()
    .x(function(d, i) {
        var theta = 2*Math.PI*i/length;
        // alert(theta);
        var scale = scales[i];
        return w/2+scale(d)*Math.cos(theta);
    })
    .y(function(d, i) {
        var theta = 2*Math.PI*i/length;
        var scale = scales[i];
        return w/2+scale(d)*Math.sin(theta);
    })
    .interpolate("linear");

    return polygonLine(data);
}

// Returns an array of axes, one for each row
function axesGen (data, scales) {

}

var polygon;

// Data is bound to the line from the CSV, added to the SVG as a path, and styled
// Everything has to happen here because CSV is asynchronous
// Nothing after this call will have access to any variables assigned here
d3.csv("/static/TestData.csv", function(data) {
    var dataArray = [];
    var subArray = [];
    for (var i = 0; i < data.length; i++) {
        var entry = data[i];
        subArray = [];
        var j = 0;
        for (var key in entry) {
            if (j>1) {
                subArray.push(entry[key]);
            }
            j++;
        }
        dataArray.push(subArray);
        // alert(subArray);
    }
//FIRST DO SCALES
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
    // A scale for each row finding the max in the row
    var scales = [];
    for (var i = 0; i < sortedData.length; i++) {
        var axisScale = d3.scale.linear()
        .domain([0, d3.max(sortedData[i])])
        .range([0, w/2]);
        console.log(sortedData[i]);
        console.log(d3.max(sortedData[i]));
        scales.push(axisScale);
    }
    
//THEN DO POLYGON
    // Make a polygon for each row
    for (var i = 0; i < data.length; i++) {
        polygon = svgContainer.append("path")
        .attr("d", graphGen(dataArray[i], scales) + "Z")
        .attr("class", "polygon")
        .attr("fill-opacity", 0.5);
    }
// THEN DO AXES
    // generate them
    // var axes = axesGen(data, scales);
    // append them
    for (var i = 0; i < axes.length; i++) {
        svg.append("g")
        .call(axes[i]);
    }
    // and then I have to transform them if I don't do that in axesGen
});

});
