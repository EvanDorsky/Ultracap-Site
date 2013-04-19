function makeData(numPoints, numAttr) {
    var dataSet = [];
    for (var i = 0; i < numPoints; i++) {
	var point = [];
	for (var j = 0; j < numAttr; j++){
	    point.push(Math.random());
	}
	dataSet.push(point);
    }
    return dataSet;
}

function initialize(){
    var data = [{name:'ultracap',color:'teal', data:makeData(15, 7)},
	       {name:'liion', color:'yellow', data:makeData(10,7)}];
    for (var i in data){
	console.log(data[i]);
    }
    var scatter = d3.select('svg#scatter');
}

$(document).ready(initialize);
