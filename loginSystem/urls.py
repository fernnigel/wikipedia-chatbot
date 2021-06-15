from django.urls import path
from . import views

urlpatterns = [
    path('login',views.login_view,name="login"),
    path('register',views.register_view,name="register"),
    path('',views.index,name="index"),
    path('logout',views.logout_view,name="logout"),
    path('delete',views.delete,name="delete"),
    path('update/<int:id>',views.update,name="update"),
]
