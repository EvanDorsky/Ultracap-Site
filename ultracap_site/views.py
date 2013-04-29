from django.shortcuts import render_to_response
from django.http import Http404, HttpResponseRedirect

def home(request):
    return HttpResponseRedirect('home/')

def route(request, place):
    if place == 'base':
        raise Http404
    try:
        return render_to_response(place + '.html', {'place':place})
    except:
        raise Http404
