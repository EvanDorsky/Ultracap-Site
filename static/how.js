function toggleOn(me){
    link = d3.select(me).attr('link');
    sel = d3.selectAll('[link='+ link + ']').classed('hide', false);
}

function toggleOff(me){
    link = d3.select(me).attr('link');
    sel = d3.selectAll('[link='+ link +']:not(.sbitem)').classed('hide', true);
}

$(document).ready(function(){
    toggle(d3.selectAll('.sbitem'), toggleOn, toggleOff);
});
