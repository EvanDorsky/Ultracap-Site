from django.shortcuts import render_to_response
from django.http import Http404

def home(request):
    return render_to_response('home.html')

def route(request, place):
    if place == 'base':
        raise Http404
    try:
        print place
        return render_to_response(place + '.html')
    except:
        raise Http404
