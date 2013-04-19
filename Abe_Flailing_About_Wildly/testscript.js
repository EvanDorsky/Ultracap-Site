function makedata(n) {
    var dataset = [];
    for (var i = 0; i < n; i++) {
	var n1 = Math.random();
	var n2 = Math.random();
	dataset.push([n1, n2]);
    }
    return dataset;
}

var w = 400;
var h = 400;
var r = 5;
var pad = 25;

//Scaling functions for data->pixel values
function setupscales(dataset){
    var xscale = d3.scale.linear().domain([0,d3.max(dataset, function(d){
	return d[0];
    })]).range([pad,w-pad]);
    var yscale = d3.scale.linear().domain([0,d3.max(dataset, function(d){
	return d[1];
    })]).range([h-pad,pad]);
    return [xscale, yscale]
}

function setupsvg(){
    var svg = d3.select("svg").attr("width",w).attr("height",h);
    return svg
}

function setupaxes(svg, xscale, yscale){
    //Some nice built-in axis functions that make use of the scales
    var xaxis = d3.svg.axis().scale(xscale).ticks(5);
    var yaxis = d3.svg.axis().scale(yscale).orient("left").ticks(5);
    svg.append("g").classed("axis",true).attr("id","xaxis")
	.attr("transform", "translate(0, " + (h - pad) + ")").call(xaxis);
    svg.append("g").classed("axis",true).attr("id","yaxis")
	.attr("transform", "translate(" + pad + ", 0)").call(yaxis);
    return svg
}

function initgraph(svg, dataset, xscale, yscale){
    var dots = svg.selectAll("circle").data(dataset).enter().append("circle").classed("dot",true);
    dots.attr("cx",pad).attr("cy",h - pad).attr("r",r);
    dots.transition().duration(1000)
    .attr("cx", function(d) {return xscale(d[0]);})
    .attr("cy", function(d) {return yscale(d[1]);}).attr("r",r);
    setupaxes(svg, xscale, yscale);
    return dots
}

function randomize(){
    var dataset = makedata(25);
    var scales = setupscales(dataset);
    var xaxis = d3.svg.axis().scale(scales[0]).ticks(5);
    var yaxis = d3.svg.axis().scale(scales[1]).orient("left").ticks(5);
    d3.selectAll('svg .dot').data(dataset).transition().duration(1000)
    .attr("cx", function(d) {return scales[0](d[0]);})
    .attr("cy", function(d) {return scales[1](d[1]);}).attr("r",r);
    d3.select('svg #xaxis').transition().duration(1000).call(xaxis);
    d3.select('svg #yaxis').transition().duration(1000).call(yaxis);
}

$(document).ready(function(){
    //Do the initial setup
    var dataset = makedata(25);
    var scales = setupscales(dataset);
    var svg = setupsvg();
    var dots = initgraph(svg, dataset, scales[0], scales[1]);
    
    //And bind the randomization
    $("#randomize").click(function(){
	randomize();
    });
});


