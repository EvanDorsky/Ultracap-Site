function make_graph(element) {
  var testData = [[1, 2, 3, 4], [1, 2, 3, 4], [1, 2, 3, 3], [1, 2, 3, 3]];
  var points = element.selectAll("elements")
    .data(testData)
    .enter().append("circle")
    .classed("point", true);
  
  points.attr("cx", function(d, i) {
    console.log(d);
    console.log(i);
    return i*20; 
  })
  .attr("cy", function(d, i) {
    return i*10; 
  })
  .attr("r", 3);
}

$(document).ready(function() {
  var svg = d3.select("svg.explore_data");
  make_graph(svg);
});
