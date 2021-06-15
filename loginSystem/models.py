from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models.fields.related import ForeignKey

# Create your models here.
class User(AbstractUser):
    pass

class Notes(models.Model):
    owner = models.ForeignKey(User,on_delete=models.CASCADE)
    notes = models.CharField(max_length=255)
    title = models.CharField(max_length=64)