function toggleOn(me){
    link = d3.select(me).attr('link');
    $('#contentbox').animate({
        scrollTop: $("div[link=" + link + "]:not(.sbitem)").offset().top -
	    $("#contentbox").offset().top + $("#contentbox").scrollTop()
    }, 500);
    d3.select(me).attr('switch', 'off');
}

$(document).ready(function(){
    toggle(d3.selectAll('.sbitem'), toggleOn);
});
