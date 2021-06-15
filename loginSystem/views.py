from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt

from .models import User,Notes

import re

@csrf_exempt
def index(request):
    if request.method == "POST":
        owner = request.user
        notes = request.POST['notes']
        title = request.POST['noteTitle']
        newNote = Notes(owner=owner,notes=notes,title=title)
        newNote.save()
        return HttpResponseRedirect(reverse("index"))

    try:
        userNotes = Notes.objects.filter(owner=request.user)
    except:
        userNotes = None
    return render(request,"loginSystem/index.html",{
        "notes":userNotes,
    })

def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "loginSystem/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "loginSystem/login.html")


def register_view(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]

        reg = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!#%*?&]{6,20}$"
        pat = re.compile(reg)            
        mat = re.search(pat, password)
        if mat:
            print("Password is valid.")
        else:
            return render(request, "loginSystem/register.html", {
                "message": "Password not valid"
            })

        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "loginSystem/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "loginSystem/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "loginSystem/register.html")

def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("login"))

@csrf_exempt
def delete(request):
    if request.method == "POST":
        id = request.POST['delete_id']
        delNote = Notes.objects.get(id=id)
        delNote.delete()
        return HttpResponseRedirect(reverse("index"))

    return HttpResponseRedirect(reverse("index"))

@csrf_exempt
def update(request,id):
    try:
        updateNotes = Notes.objects.get(id=id)
    except:
        updateNotes = None

    if request.method == "POST":
        newNotes = Notes.objects.get(id=id)
        newNotes.notes = request.POST['notes']  
        newNotes.title = request.POST['title']
        newNotes.save()
        return HttpResponseRedirect(reverse("index"))  

    return render(request,"loginSystem/update.html",{
        "note":updateNotes,
    })




