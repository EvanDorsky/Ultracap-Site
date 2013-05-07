function callOn(me){
    link = d3.select(me).attr('link');
    $('.infostuff').animate({
        scrollTop: $("div[link=" + link + "]:not(.sbitem)").offset().top -
	    $("div.infostuff").offset().top + $("div.infostuff").scrollTop()
    }, 500);
    //stuff that turns on linked polygon
    var targetGon = d3.select('.polygon[link = "' + link + '"]');
    //the targeted polygon

    targetGon.transition()
    .style("opacity", 1);
}

function callOff(me){
    link = d3.select(me).attr('link');
    //stuff that turns off linked polygon
    var targetGon = d3.select('.polygon[link = "' + link + '"]');
    //the targeted polygon
    targetGon.transition()
    .style("opacity", 0);
}

$(document).ready(function(){
    sel = d3.selectAll('.sbitem');
    toggle(sel, callOn, callOff);

    
});