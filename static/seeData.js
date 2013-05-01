var padding = 60;
var width = 400;
var height = 300;

function make_scale(data, index) {
  var get_elem = function(indx) {
    return function(d) {
      return d[indx]
    }
  };
  
  var xmin = d3.min(data, get_elem(index[0]));
  var ymin = d3.min(data, get_elem(index[1]));
  
  var xmax = d3.max(data, get_elem(index[0]));
  var ymax = d3.max(data, get_elem(index[1]));
  
  var xScale = d3.scale.log()
    .domain([xmin, xmax])
    .range([padding, width]);

  var yScale = d3.scale.log()
    .domain([ymax, ymin])
    .range([padding, height])

  return [xScale, yScale];
}

function update(data, points, axis, axis_rep, index) {
  var scale = make_scale(data, index);
  var xScale = scale[0];
  var yScale = scale[1];
  
  axis[0]
    .scale(xScale);

  axis[1]
    .scale(yScale);

  axis_rep[0].transition()
    .duration(1000)
    .call(axis[0])
  
  axis_rep[1].transition()
    .duration(1000)
    .call(axis[1])
  
  points.transition()
  .attr("cx", function(d) {
    return xScale(d[index[0]]);
  })
  .attr("cy", function(d) {
    return yScale(d[index[1]]);
  })
  .duration(1000);
}

function make_graph(element, data, index) {
  var scale = make_scale(data, index);
  var xScale = scale[0];
  var yScale = scale[1];
  var colorScale = d3.scale.category10();

  var points = element.selectAll("elements")
    .data(data)
    .enter().append("circle")
    .classed("point", true)

  points.attr("cx", function(d) {
    return xScale(d[index[0]]);
  })
  .attr("cy", function(d) {
    return yScale(d[index[1]]);
  })
  .attr("r", 5)
  .style("fill", function(d) {
    return colorScale(d[3]);
  });

  var xAxis = d3.svg.axis();
  xAxis.scale(xScale)
    .orient("bottom")
    .ticks(3, d3.format("r1"))

  var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left")
    .ticks(2, d3.format("r4"));

  var gxAxis = element.append("g")
    .attr("class", "axis")
    .call(xAxis)
    .attr("transform", "translate("+0+"," + height + ")")

  var gyAxis = element.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(" + padding + ",0)")
    .call(yAxis);
  
  return [points, xAxis, yAxis, gxAxis, gyAxis]
}

$(document).ready(function() {
  var svg = d3.select("svg.explore_data");
  var testData = [
      [.1,  .001, 4,   4],
      [1,   2200,    3,   4],
      [1,   3,    2,   3],
      [1,   4,    .1,   3],
      [20,  1,    1,   2],
      [300, 4,    1,   2],
      [.3,  3.5,  1,   3],
      [1,   22,   300, 5]
  ];
  var ret = make_graph(svg, testData, [0, 1]);
  var points = ret[0];
  var xAxis = ret[1];
  var yAxis = ret[2];
  var gxAxis = ret[3];
  var gyAxis = ret[4];
  
  d3.selectAll(".point").on("click", function(d) {
    update(testData, points, [xAxis, yAxis], [gxAxis, gyAxis], [1, 2]);
  });
});
