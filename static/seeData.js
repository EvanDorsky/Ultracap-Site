var padding = 60;
var width = 700;
var height = 500;

function make_scale(data, index) {
  var get_elem = function(indx) {
    return function(d) {
      return is_sane(d[indx]);
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

function is_sane(value) {
  if (value != undefined && !isNaN(value) && value!=""){
    return parseFloat(value);
  }
  return 100;
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
      return xScale(is_sane(d[index[0]]));
    })
    .attr("cy", function(d) {
      //console.log(d[index[1]])
      return yScale(is_sane(d[index[1]]));
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
    return xScale(is_sane(d[index[0]]));
  })
  .attr("cy", function(d) {
    return yScale(is_sane(d[index[1]]));
  })
  .attr("r", 5)
  .style("fill", function(d) {
    return colorScale(d[3]);
  });
  //console.log(xScale(10));

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
  if (xlabel.empty()) {
    xlabel = element.append("text")
  }

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

var startIndex = 0;
$(document).ready(function() {
  d3.csv("/static/explore.csv", function(data) {
    var da1 = ["Aerogel",4.09550561797753, 5.80826052049251, 290.413026024625,
    204.775280898876, 3600,500000, 0.002236196319018, "Activated Carbon Ultracapacitor found <a href=http://www.mouser.com/Search/ProductDetail.aspx?R=HV0810-2R7105-Rvirtualkey99990000virtualkey504-HV0810-2R7105-R>here</a>"]
    var da2 = ["Activated Carbon",6.50892857142857,11.4295669268716,2.85739173171789,
    1.62723214285714,3600,500000,0.003796875,
    "Activated Carbon Ultracapacitor found <a href=http://www.mouser.com/Search/ProductDetail.aspx?R=JUWT1105MCDvirtualkey64700000virtualkey647-JUWT1105MCD>here</a>"]

    var da3 = ["Polyacene",2.60416666666667,3.33867521367521,83.4668803418803,65.1041666666667,3600,500000,0.00041335978836,"Polyacene Ultracapacitor found <a href=http://www.mouser.com/Search/ProductDetail.aspx?R=PAS2126FR2R5504virtualkey57660000virtualkey963-PAS2126FR2R5504>here</a>"]
    var da4 = ["Activated Carbon",20.1659751037344,21.9362108545929,17.1376647301507,15.7546680497925,3600,500000,"n","Activated Carbon Ultracapacitor found <a href=http://www.mouser.com/ProductDetail/Ioxus/RSC2R7407SR/?qs=sGAEpiMZZMuDCPMZUZ%252bYl3fm1KlEjTO%2fpbnKXv2QCuw%3d>here</a>"]
    var da5 = ["Graphene ultracap",308.16,"n",2.7,3600,"n","N/A","na", "Graphene Ultracapacitor found <a href=http://pubs.acs.org/doi/abs/10.1021/nl102661q/> here </a>"]
    var da6 =  ["Lithium-ion panasonic",792,223.2,3,1,0.25,800,7.65957446808511,"Lithium-ion battery found <a href=http://www.panasonic.com/industrial/includes/pdf/ACA4000CE305-UR18650ZTA.pdf>here</a>"]
    var da7 = ["lithium-ion Samsung",850.5,48,0.133,0.236,0.191791331031837,800,7.65957446808511,"Lithium-ion battery found <a href=http://www.samsungsdi.com/battery/cylindrical-ICR18650-30A.jsp>here</a>"]
    var da8 = ["Polymer rechargeable LI battery",663.6,3928.6,"n","n",500,7.65957446808511,"na", "Lithium Polymer rechargeable battery found <a href=http://www.samsungsdi.com/battery/polymer-rechargeable-battery.jsp>here</a>"]
    var da9 = ["Gasoline",44400,"n",,80000,0.003333333333333,1,34013.8193539755,"Gasoline, stats found <a href=http://hypertextbook.com/facts/2003/ArthurGolnik.shtml>here</a>"]
    var da10 = ["Lead Acid battery",127.894736842105,306.446731234867,0.004256204600484,0.001776315789474,0.066666666666667,600,32.1428571428571,"Lead Acid Battery found <a href=http://datasheet.octopart.com/PS-1270F1-Power-Sonic-datasheet-17530.pdf>here</a>"]
    var da11 = ["Fuel Cell",1584,"?","?",0.04,0.003333333333333,100,0.001,"Fuel Cell found <a href=http://www1.eere.energy.gov/hydrogenandfuelcells/mypp/pdfs/fuel_cells.pdf>here</a>"]
  var dataArray = [];
  var subArray = [];
  for (var i = 0; i < data.length; i++) {
      if (i!=50) {
          var entry = data[i];
          subArray = [];
          var j = 0;
          for (var key in entry) {
              if (j>startIndex && j<13) {
              subArray.push(entry[key]);
          }
          j++;
      }
      dataArray.push(subArray);
    }
  }

  //console.log(dataArray)
  
  var svg = d3.select("svg.explore_data");
  var testData = dataArray;
  var testData = [da1, da2, da3, da4, da5, da6, da7, da8, da9, da10, da11];
  var current_x = 0; 
  var current_y = 0;
  
  var ret = make_graph(svg, testData, [0, 0]);
  var points = ret[0];
  var xAxis = ret[1];
  var yAxis = ret[2];
  var gxAxis = ret[3];
  var gyAxis = ret[4];
  //console.log(data); 
  labels = ["", "Energy Density (J/g)",
         "Energy Density (J/cm^3)", "Power Density (W/cm^3)",
         "Power Density (W/g)", "Charge speed (1/h)",
         "Lifetime cycles", "Kilojoules per dollar"]
  //console.log(testData)
  set_labels(svg, labels[0], labels[1]);
  /*d3.selectAll(".point").on("click", function(d) {
    update(svg, testData, labels, points,
      [xAxis, yAxis], [gxAxis, gyAxis], [current_x, current_y]);
  });*/

  d3.selectAll("select.dropdown")
    .selectAll("option")
    .data(labels)
    .enter()
    .append("option")
    .text(function(d) {
      return d;
    })

  d3.selectAll(".point").on("click", function(d, i) {
    //console.log(d)
    d3.select(".selectedItem").html(d[8]);
  });

  d3.selectAll("select.dropdown").on("change", function(d, i) {
    //console.log(this.selectedIndex);
    if (d3.select(this).classed("x")) {
      current_x = this.selectedIndex;
    } else {
      current_y = this.selectedIndex;
    }
    //console.log([current_x, current_y])
    update(svg, testData, labels, points,
      [xAxis, yAxis], [gxAxis, gyAxis], [current_x, current_y]);
  });
  });
});
