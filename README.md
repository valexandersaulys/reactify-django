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

We'll do just that for the leads app:

```javascript
[
    {
        "model": "leads.lead",
        "pk": 1,
        "fields": {
            "name": "Armin",
            "email": "something@gmail.com",
            "message": "I am looking for a Javascript mentor",
            "created_at": "2018-02-14 00:00:00"
        }
    },
    {
        "model": "leads.lead",
        "pk": 2,
        "fields": {
            "name": "Tom",
            "email": "tomsomething@gmail.com",
            "message": "I want to talk about a Python project",
            "created_at": "2018-01-14 00:00:00"
        }
    }
]
```


## Pulling it all together with React

There are multiple ways to bring react into Django. One way is to load
a single HTML template and let React manage the frontend. Another is to
create a django app as a standalone API and then pull React in as a
standalone SPA. This is much more difficult as we'll need to use JWT
for authentication.

The easiest way is to mix and match, adding mini React apps inside of
Django templates.

App-like websites should use a single HTML template with
react-router. Otherwise, go with the easiest option. Know that SEO is
a bit more tricky with that first option too so mini React apps will
be better when SEO is a must.


## Setting up django REST with React

Now we'll add a single django app to handle the frontend. This will be
called `frontend`. Inside, we'll create a `src` folder to hold all of
our important files

```shell
# assuming you're in the leads app foler
mkdir -p src/components
mkdir -p src/{static,templates/frontend
```

Webpack, React, etc. will be installed at the top level. This is to
make it obvious when looking at the code repo that we're pulling in
React JS; it makes our intentions explicit.

At the top level, run the following to get started:

```shell
npm init -y
npm i webpack webpack-cli --save-dev
```

Then we'll modify our `package.json` file, created when we initialized
our npm project, to include scripts for making running easier:

```javascript
# ...
  "scripts": {
    "dev": "webpack --mode development ./project/frontend/src/index.js --output ./project/frontend/static/frontend/main.js",
    "build": "webpack --mode production ./project/frontend/src/index.js --output  ./project/frontend/static/frontend/main.js"
  }    
# ...
```

Basic file operation =>  `webpack --mode <mode> ./path/to/entry_point.js ./path/to/build_point.js`

[Supposedly neat
tutorial](https://www.valentinog.com/blog/webpack-tutorial/)

Now to install babel. This is for transpiling code from ECMAscript
2015 (I think?) to plain old javascript. Then we'll pull in React and
prop-types.

```shell
npm i @babel/core \
    babel-loader @babel/preset-env @babel/preset-react \
    babel-plugin-transform-class-properties --save-dev

npm i react react-dom prop-types --save-dev
```

Babel uses a `.babelrc` file to configure all of our cruft. We'll need
to create that and populate it.

```javascript
# .babelrc
{
    "presets": [
        "@bable/preset-env", "@babel/preset-react"
    ],
    "plugins": [
        "transform-class-properties"
    ]
}
```

Finally, we'll add a `webpack.config.js` file for configuring the
babel loader.

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  }
};
```

Now we're ready to go!


## Connecting React JS to Django Frontend

To do this, we need to do a few things:

  1. create our view function
  2. create the html template being rendered
  3. add the appropriate url to `frontend/urls.py`
  4. wire this into our `project/urls.py`
  5. add the app into `project/settings.py` so it knows it exists

Our Django view will be expectedly simple. We'll create a
function based view that returns the page.

```python
# frontend/views.py
from django.shortcuts import render

def index(request):
    return render(request, "frontend/index.html")
```

We'll then create our base template within
`frontend/templates/frontend/index.html`.

```html
<!doctype html>
<html lang="en">
    <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Document</title>
        <link rel="stylesheet"
              href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.6.2/css/bulma.min.css">
    </head>
    <body>
        <section class="section">
            <div class="container">
                <div id="app"><!-- React --></div>
            </div>
        </section>
    </body>
    {% load static %}
    <script src="{% static 'frontend/main.js' %}"></script>
</html> 
```

Then we add the URL to `frontend/urls.py`, which we also have to
create.

```python
from django.urls import path

from frontend import views

urlpatterns = [
    path('', views.index),
]
```

Then we wire this into our `project/urls.py`:

```python
# ...
urlpatterns = [
    path('', include('leads.urls')),
    path('', include('frontend.urls')),
]
```

Finally, we add it to our installed apps in `project/settings.py`:

```python
# project/settings.py
# ...
INSTALLED_APPS = [
    'django.contrib.admin',
    # ...
    'leads.apps.LeadsConfig',
    'frontend.apps.FrontendConfig',
    'rest_framework'
]
# ...
```

Finally we'll run and see if all is well. 

If you see a blank page, then you're doing great. That's because React
is not actually hooked up doing anything (yet!)

Now on to add components


## Adding React JS Components

We'll need 3 components:

  1. `App.js` -- the mother component
  2. Dataprovider for rendering stateful data
  3. Table, a stateless component for displaying data

To start, create a file call `frontend/src/components/App.js`. This
will get populated with some standard React JS boiler plate.

```javascript
import React from "react";
import ReactDOM from "react-dom";

import DataProvider from "./DataProvider";
import Table from "./Table";

const App = () => (
    <DataProvider endpoint="api/lead/"
                  render={data => <Table data={data}/>} />
);

const wrapper = document.getElementById("app");

wrapper ? ReactDOM.render(<App/>, wrapper) : null;
```

Now we need to create the `DataProvider` and `Table` components in
their respetive files.

To create `DataProvider`, we'll go into
`frontend/src/component/DataProvider.js`.

```javascript
import React, { Component } from "react";
import PropTypes from "prop-types";

class DataProvider extends Component {
    static propTypes = {
        endpoint: PropTypes.string.isRequired,
        render: PropTypes.func.isRequired
    };

    state = {
        data: [],
        loaded: false,
        placeholder: "loading..."
    };

    componentDidMount() {
        fetch(this.props.endpoint)
            .then(res => {
                if (res.status !== 200)
                    return this.setState({
                        placeholder: "something went wrong"
                    });
                else
                    return res.json()
            })
            .then(data => this.setState({
                data: data,
                loaded: true
            }));
    }

    render() {
        const { data, loaded, placeholder } = this.state;

        return loaded ? this.props.render(data) : <p> {placeholder}</p>;
    }
};
```

Then we do the same with the `Table` component in
`frontend/src/components/Table.js`. Because the `Table` component just
displays data propagated down onto it, we can use a function-based
component here from React.js. Know that we'll need to install
`weak-key` as well; this package will automatically generate keys for
us and is safer than using built-in react js key generation.

```javascript
import React, { Component } from "react";
import PropTypes from "prop-types";
import key from "weak-key";  // to generate keys for us

// data is passed on from the component <Table data=... />
const Table = ({ data }) =>
      !data.length ? (
          <p>Nothing to show</p>
      ) : (
          <div className="column">
          <h2 className="subtitle">Ze Table of {data.length} items</h2>
            <table className="table is-striped">
              <thead>
                <tr>
                  {Object.entries(data[0]).map(
                      el => <th key={key(el)}>{el[0]}</th>)}
                </tr>
              </thead>
              <tbody>
                {data.map(el => (
                    <tr key={el.id}>
                      {Object.entries(el).map(
                          el => <td key={key(el)}>{el[0]}</td>)}
                    </tr>
                ))};
              </tbody>
            </table>
          </div>
      );

Table.propTypes = {
    data: PropTypes.array.isRequired
};

export default Table;
```

Finally, we'll add in the import statement on `index.js`, our entry
point.

```javascript
// frontend/src/index.js
import App from "./components/App";
```

We'll build our js file using `npm run dev` and then start our django
dev server.

Surprise! It all should work.


## Building a form with React JS

Next, we'll add a simple form in React JS for interacting with our
django backend.

This will be a component (of course) and it will live inside of
`frontend/src/components/` as well.

```javascript
import React, { Component } from "react";
import PropTypes from "prop-types";

class Form extends Component {
    static propTypes = {
        endpoint: PropTypes.string.isRequired // gets mapped in tag
    };

    // defaults
    state = {
        name: "",
        email: "",
        message: ""
    };

    handleChange = e => {
        this.setState({
            [e.target.name]: e.target.value 
        });
    };

    handleSubmit = e => {
        e.preventDefault();
        const { name, email, message } = this.state;
        const lead = { name, email, message };
        const conf = {
            method: "post",
            body: JSON.stringify(lead),
            headers: new Headers({
                "Content-Type": "application/json"
            })
        };

        fetch(this.props.endpoint, conf)
            .then(res => console.log(res));

        // clear form after submission
        this.setState({
            name: "",
            email: "",
            message: ""
        });
    };
        
    render() {
        const { name, email, message } = this.state;

        return (
            <div className="column">
              <form onSubmit={this.handleSubmit}>
                <div className="field">
                  <label className="label">Name</label>
                  <div className="input">
                    <input className="input"
                           name="name"
                           type="text"
                           value={name}
                           onChange={this.handleChange}
                           required />
                  </div>
                </div>
                <div className="field">
                  <label className="label">Email</label>
                  <div className="control">
                    <input className="input"
                           name="email" 
                           type="email"
                           value={email}
                           onChange={this.handleChange}
                           required/>
                  </div>
                </div>
                <div className="field">
                  <label className="label">Message</label>
                  <div className="control">
                    <textarea className="textarea"
                              type="text"
                              name="message"
                              onChange={this.handleChange}
                              value={message}
                              required/>
                  </div>
                </div>
                <div className="control">
                  <button className="button is-info">
                    Send Message
                  </button>
                </div>
              </form>
            </div>
        );
    }
}

export default Form;
```

Then we wire this up to our `App.js` file.

```javascript
import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";

import DataProvider from "./DataProvider";
import Table from "./Table";
import Form from "./Form";

const App = () => (
    <Fragment>
      <DataProvider endpoint="api/lead/"
                    render={data => <Table data={data} />} />
      <Form endpoint="api/lead/" />
    </Fragment>
);


const wrapper = document.getElementById("app");

wrapper ? ReactDOM.render(<App/>, wrapper) : null;
```

Finally, we can run and submit changes. Note that, because we don't
use redux, we can't actually see them propagate and reflect that :/
