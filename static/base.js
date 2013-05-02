//Takes a d3 selection and two (optional) callbacks to
//be called when the switch is toggled on and off
function toggle(selection, callOn, callOff){
    console.log(selection);
    selection.on('click', function(){
	me = d3.select(this);
	if (me.attr('switch') == 'on'){
	    me.attr('switch', 'off');
	    if(callOff){callOff(this);}
	}
	else{
	    d3.select(this).attr('switch', 'on');
	    if(callOn){callOn(this);}
	}
    });
}

/*
//Example Code:
function callOn(me){
    console.log(me)
}

function callOff(me){
    console.log(me)
}

$(document).ready(function(){
    sel = d3.selectAll('.sbitem');
    toggle(sel, callOn, callOff);
});
*/
