$(document).ready(function() {
    var padding = 20;
    var h = 500;

// Define an SVG with width and height, and place it in the body
var svgContainer = d3.select("svg.energy_sources");
var w = parseFloat(svgContainer.style("width"));
// Defines the the polygon for the graph
// based on the input data
function graphGen (data, scales) {
    var length = data.length;
    // Defines the main polygon
    var polygonLine = d3.svg.line()
    .x(function(d, i) {
        var theta = 2*Math.PI*i/length;
        var scale = scales[i];
        d=parseFloat(d);
        console.log("THIS IS AN X DATAPOINT");
        console.log(d);
        console.log(w/2+scale(d)*Math.cos(theta));
        return w/2+scale(d)*Math.cos(theta);
    })
    .y(function(d, i) {
        var theta = 2*Math.PI*i/length;
        var scale = scales[i];
        d=parseFloat(d);
        return w/2+scale(d)*Math.sin(theta);
    })
    .interpolate("linear");
    return polygonLine(data);
}

function calcScales (scaleData) {
    var scales = [];
    for (var i = 0; i < scaleData.length; i++) {
        // var axisScale = d3.scale.linear()
        // .domain([0, d3.max(scaleData[i])])
        // .range([0, w/2]);
        var axisScale = d3.scale.log()
        .domain([d3.min(scaleData[i])-d3.min(scaleData[i])/2, d3.max(scaleData[i])])
        .range([0, w/2-padding]);
        scales.push(axisScale);
    }
    return scales;
}

// Returns an array of axes, one for each row
function test (sender) {
    // alert("clicked");

    sender.transition()
    .style("opacity", 0.1);
}

var polygon;

var startIndex = 0;

// Data is bound to the line from the CSV, added to the SVG as a path, and styled
// Everything has to happen here because CSV is asynchronous
// Nothing after this call will have access to any variables assigned here
d3.csv("/static/TestData.csv", function(data) {
    var dataArray = [];
    var subArray = [];
    for (var i = 0; i < data.length; i++) {
        if (i!=50) {
            var entry = data[i];
            subArray = [];
            var j = 0;
            for (var key in entry) {
                if (j>startIndex && j<7) {
                // alert(j);
                subArray.push(entry[key]);
            }
            j++;
        }
        dataArray.push(subArray);
    }
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
            sortedData[j][i] = parseFloat(dataArray[i][j]);
            //This is important; it makes everything numbers
        }
    }
    // console.log(sortedData);

    // Then create the scales and append the axes
    // A scale for each row finding the max in the row
    var scales = calcScales(sortedData);
    
//THEN DO POLYGON
    // This array stores all the polygons for later use
    var polygons = [];
    // Make a polygon for each row

    for (var i = 0; i < dataArray.length; i++) {
        polygon = svgContainer.append("path")
        .attr("d", graphGen(dataArray[i], scales) + "Z")
        .classed("polygon", true)
        .attr("fill-opacity", 0.3)
        .attr("index", i)
        .attr("fill", data[i]['Color'])
        .attr("link", data[i]['Link'])
        .style("stroke", data[i]['Color'])
	.style("opacity",0);

        polygons.push(polygon);
    }
// THEN DO AXES
    // generate them
    // append them
    var subArray = dataArray[0];
    var axisLength = w/2+10
    for (var j = 0; j < subArray.length; j++) {
        var theta = 2*Math.PI*j/subArray.length;
        var endPointx = w/2+axisLength*Math.cos(theta);
        var endPointy = w/2+axisLength*Math.sin(theta);

        svgContainer.append("line")
        .attr("x1", w/2)
        .attr("y1", w/2)
        .attr("x2", endPointx)
        .attr("y2", endPointy)
        .style("stroke", "black");
    }

// THEN DO TEXT LABELS
var texts = [];
var k = 0;
var l = 0;

for (var key in data[1]) {
    if (k>startIndex) {
        texts[l]=key;
        l++;
    }
    k++;
}

var theta;
for (var j = 0; j < subArray.length; j++) {
    theta = 360*j/subArray.length;
    svgContainer
    .append("text")
    .attr("x", w/2+20)
    .attr("y", w/2-6)
    .text(texts[j])
    .attr("transform", "rotate("+theta+", "+w/2+","+w/2+")");
    // .attr("transform", "rotate(90, 250, 250)");
}

        //recalculate scales based on the visible data
        var dataForScaling = [];
        for (var i = 0; i < dataArray.length; i++) {
            dataForScaling.push([]);
        }

        for (var i = 0; i < dataArray.length; i++) {
            for (var j = 0; j < dataArray[i].length; j++) {
                var eachIndex = i+1;
                var innergon = d3.select('[index="'+ i + '"]')
                if (innergon.attr("fill-opacity") != 0) {
                    dataForScaling[i].push(dataArray[i][j]);
                }
            }
        }
        var newScales = calcScales(dataForScaling);

        for (var i = 0; i < dataForScaling.length; i++) {
            var innergon = d3.select('[index="'+ i + '"]');
            var newPolyline = graphGen(dataForScaling[i], newScales);
            innergon.transition.attr("d", newPolyline + "Z");
        }

});
//end d3 CSV call

});
