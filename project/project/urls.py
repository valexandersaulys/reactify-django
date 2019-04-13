from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    #path('admin/', admin.site.urls),  # not needed
    path('', include('leads.urls')),
    path('', include('frontend.urls'))
]
