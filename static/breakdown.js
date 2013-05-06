function callOn(me){
    link = d3.select(me).attr('link');
    $('.infostuff').animate({
        scrollTop: $("div[link=" + link + "]:not(.sbitem)").offset().top -
	    $("div.infostuff").offset().top + $("div.infostuff").scrollTop()
    }, 500);
    //stuff that turns on linked polygon
}

function callOff(me){
    //stuff that turns off linked polygon
}

$(document).ready(function(){
    $('#contentbox').css('overflow','hidden');
    sel = d3.selectAll('.sbitem');
    toggle(sel, callOn, callOff);
});
