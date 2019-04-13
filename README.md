# README

This is from a YouTube video on React =>
~~https://www.youtube.com/watch?v=AHhQRHE8IR8~~ This was total shit
and relies on using a bunch of pre-made shit. This appears simpler
than the one from Traversy Media on top of that.

Instead, I'm trying this tutorial that's written =>
https://www.valentinog.com/blog/tutorial-api-django-rest-react/

Now that I'm thick into it, I get the distinct feeling that this was
the post Traversy Media used. Interesting he totally copied it. 


# Tutorial

## Getting Set Up

First we install django and djangorestframework, then we pop in and
start our project.

```Shell
# From The Top Level (Differs From Tutorial)
django-admin startproject project
cd project/
django-admin startapp leads   # didn't use manage.py
```

Then we add our leads app into our settings file.

```python
# ...
INSTALLED_APPS = [
    'django.contrib.admin',
    # ...
    'leads.apps.LeadsConfig',
]
# ...
```

Next is to build the __Lead__ model. This will be located inside of
`leads/models.py`. We'll need a name, email, message, and created_at
entries.

```python
from django.db import models

class Lead(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    message = models.CharField(max_length=300)
    created_at = models.DateTimeField(auto_now_add=True)
```

Which will get migrated after making said migrations.


## Writing Serializers

Now we'll write serializers. These are how Django Rest Framework
interacts with our models. They allow for complex data, such as
querysets, complete with admin protection, to be serialized (get it?)
and rendered into `JSON` or `XML`. 

These serializers act like
[`ModelForms`](https://docs.djangoproject.com/en/2.0/topics/forms/modelforms/).

We'll use `serializers.ModelSerializer` to make our life a little
easier. This serializer will use a `class Meta` inside of itself,
which takes the django model to serialize as well as the fields to
expose during serialization.

```python
from rest_framework import serializers
from leads.models import Lead

class LeadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lead
        # can also use `fields = '__all__'`
        fields = ('id', 'name', 'email', 'message')
```


## Views (aka Controllers) within Django

Django has no explicit controllers, but instead uses views to
encapsulate the logic for processing requests and creating
responses. This is called an MVT, or Model-View-Template, framework
(Rails, by contrast, uses an MVC framework).

Like in plain django, django REST framework uses functions, classes,
or generic APIs to create views. We'll leverage the generic API views
for this tutorial.

Now, it's best to think about what our app should have when creating
this API. So let's list them out:

  * list a collection of models
  * create new objects in the database

Combing through [the generic API views
docs](https://www.django-rest-framework.org/api-guide/generic-views/#generic-views),
we can see that the best API for us to use is the
[`ListCreateAPIView`](https://www.django-rest-framework.org/api-guide/generic-views/#listcreateapiview). 

`ListCreateAPIView` provides read-write endpoints for a collection of
model instances via GET and POST method handlers. It requires a
queryset and serializer class. Both of these come from its
[`GenericAPIView`](https://www.django-rest-framework.org/api-guide/generic-views/#genericapiview)
base class. Once we write those, we'll be good to go!

```python
from rest_framework import generics

from leads.models import Lead
from leads.serializers import LeadSerializer

class LeadListCreate(generics.ListCreateAPIView):
    queryset = Lead.objects.all()
    serializer_class = LeadSerializer
```

This only took three lines of code, but by leveraging the
ListCreateAPIView, we can get _a lot_ of functionality.

Next is to map to `leads/urls.py` and then map that to
`project/project/urls.py`.

First, create `urls.py` within our `leads` app. Next, add in a
`urlpatterns` list with `path`. We'll import our views file add the
class based generic API we descended from.

```python
# leads/urls.py
from django.urls import path

from leads import views

urlpatterns = [
    path('api/lead/', views.LeadListCreate.as_view()),
]  # trailing comma is important
```

We'll need the main project app to recognize that we have these in. To
do so, use django's built-in `include` function, located right where
`path` is, to do so.

```python
# project/urls.py
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('leads.urls')),
]
```

Lastly, we'll need to add in a string for the rest framework to our
settings file.

```python
# project/settings.py
# ...
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'leads.apps.LeadsConfig',
    'rest_framework',
]
# ...
```

## Using Fixtures

Django has a neat tool called
[fixtures](https://docs.djangoproject.com/en/2.0/howto/initial-data/)
for populating a database for demos in the frontend.

These fixtures will live inside of `<app-name>/fixtures/` folder and
are JSON, XML, or YAML files. When we run `./manage.py loaddata
<app-name>`, these get dumped into the database.


## Pulling it all together with React




