function makeData (n) {
    data = [];
    for (var i = 0; i < n; i++){
	data.push(Math.random());
    }
    //console.log(data);
    return data;
}

function makePoints(data, scale) {
    numPoints = data.length;
    points = [];
    for (var i = 0; i < numPoints; i++){
	angle = 2 * Math.PI * i / numPoints;
	points.push([scale(data[i]) * Math.cos(angle),
		     scale(data[i]) * Math.sin(angle)]);
    }
    //console.log(points);
    return points;
}

function pointString(points){
    string = '';
    for (var i = 0; i < points.length; i++){
	string += points[i][0] + ',' + points[i][1] + ' ';
    }
    //console.log(string);
    return string;
}

function makeScale(data, range){
    return d3.scale.linear().domain([0,d3.max(data)]).range([0,range]);
}

function drawAxes(svg, points, range){
    for (var i = 0; i < points.length; i++){
	scaling = range / Math.sqrt(points[i][0] * points[i][0] +
				    points[i][1] * points[i][1]);
	points[i][0] *= scaling 
	points[i][1] *= scaling 
    }
    axes = svg.selectAll('line').data(points).enter().append('line')
	.classed('axis', true).attr('x1',0).attr('y1',0)
	.attr('x2',function(d){return d[0];}).attr('y2',function(d){return d[1];})
	.attr('transform', 'translate(' + w/2 + ',' + h/2 + ')')
	.attr('stroke','black');
    return axes
}

function randomize(svg){
    h = parseFloat(svg.attr('height'));
    w = parseFloat(svg.attr('width'));
    data = makeData(svg.selectAll('.axis')[0].length);
    scale = makeScale(data, d3.min([h,w]) * 3 / 8)
    points = makePoints(data, scale);
    pointstr = pointString(points);
    svg.select('.polygon').transition().duration(1000).attr('points',pointstr);
}

$(document).ready(function() {
    //console.log('running');
    svg = d3.select('svg#test');
    h = parseFloat(svg.attr('height'));
    w = parseFloat(svg.attr('width'));
    data = makeData(5);
    range = d3.min([h,w]) * 3 / 8;
    scale = makeScale(data, range);
    points = makePoints(data, scale);
    pointstr = pointString(points);
    polygon = svg.append('polygon').classed('polygon', true).attr('points',pointstr)
	.attr('transform', 'translate(' + w/2 + ',' + h/2 + ')');
    axes = drawAxes(svg, points, range + 5)
    polygon.on('click', function(){randomize(svg)});
});

