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

function update(element, data, labels, points, axis, axis_rep, index) {
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

  set_labels(element, labels[index[0]], labels[index[1]]);
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

function set_labels(element, xLabel, yLabel) {
  var xlabel = d3.select(".x_label");
  console.log(xlabel.empty())
  if (xlabel.empty()) {
    xlabel = element.append("text")
  }

  console.log(xlabel)
  xlabel.attr("class", "x_label")
      .attr("x", width/2)
      .attr("y", height+40)
      .text(xLabel)
      .attr("text-anchor", "middle")
  
  var ylabel = d3.select(".y_label");
  if (ylabel.empty()) {
    ylabel = element.append("text")
  }

  ylabel.attr("class", "y_label")
    .attr("x", -height/2-padding/2)
    .attr("y", padding/2-10)
    .text(yLabel)
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)");
}

$(document).ready(function() {
  var svg = d3.select("svg.explore_data");
  var testData = [
      [.1,  .001, 4,    4],
      [1,   2200,    3, 4],
      [1,   3,    2,    3],
      [1,   4,    .1,   3],
      [20,  1,    1,    2],
      [300, 4,    1,    2],
      [.3,  3.5,  1,    3],
      [1,   22,   300,  5]
  ];
  var current_x = 0; 
  var current_y = 0;
  
  var ret = make_graph(svg, testData, [0, 0]);
  var points = ret[0];
  var xAxis = ret[1];
  var yAxis = ret[2];
  var gxAxis = ret[3];
  var gyAxis = ret[4];
  
  
  labels = ["Energy Density (W/kg)",
    "Something else (asdf)",
    "Mass (kg",
    "Why do you ask??"];

  set_labels(svg, labels[0], labels[1]);
  d3.selectAll(".point").on("click", function(d) {
    update(svg, testData, labels, points,
      [xAxis, yAxis], [gxAxis, gyAxis], [current_x, current_y]);
  });

  console.log(labels);
  d3.selectAll("select.dropdown")
    .selectAll("option")
    .data(labels)
    .enter()
    .append("option")
    .text(function(d) {
      return d;
    })

  d3.selectAll("select.dropdown").on("change", function(d, i) {
    if (d3.select(this).classed("x")) {
      current_x = this.selectedIndex;
    } else {
      current_y = this.selectedIndex;
    }
    update(svg, testData, labels, points,
      [xAxis, yAxis], [gxAxis, gyAxis], [current_x, current_y]);
  });
});
