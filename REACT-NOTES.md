# React

Every react app has components which are rendered on pages.

All components follow this template:

```javascript
import React, { Component } from 'react';

class Counter extends Component {
  state = {
    ...defaults
  };
  
  render() {
    return <h1>JSX goes here</h1>;
  }
}

export default Counter;
```

We can then call it inside of another compoent by calling `import
Counter from 'Counter'`. The js is implicit. Whatever is in
`render()`, will get rendered on screen.

Know that all JSX needs to be wrapped inside of a parent tag,
typically a div tag. This is because of how babel works. In render,
you'll need to wrap your JSX with parentheses in `return`.

JSX allows for including evaluated javascript via the `{ }`
tags. Inside you'll put values you want to call, calculations,
methods, etc.

Know that all quotes get rendered as quotes. So when writing `src=`
props to your `<img/>` tags, you want to put in
`src={this.state.image_url}`.

You can include styles as JSON objects and set an JSX html tag equal
to it.

A better way to apply styles is through classes, which you'll probs
need to pull in as imports (methinks).

For dynamically changing classes, we'll use ternary operators to
append classes to a string (remember the spaces!). If we meet some
criteria, we'll call the appended class.

When rendering lists, JSX uses the `.map()` method from arrays. Inside
of the map fucntion, we pass an arrow function that takes a value and
returns a JSX element. The value it takes will represent each value of
the array.

```javascript
// this would belong inside of the render function
<ul>{ this.state.tags.map(tag => <li key={tag}>{tag}</li>) };</ul>
```

React will want to identify each value so it likes a `key` prop to be
attached to each tag. Otherwise, it returns a warning; know that you
can't access this key through `this.props.key`. 

The simplest way to do this is to set the key value to a dynamic value
such as the position in the array or an id property of the `tag`
object.

You can use `true`/`false` values to render text too. If you want to
check for the length of an array and return a "sorry" type string, you
can pass in:

```javascript
<div>
  { this.state.tags.length === 0 && "Sorry there are no tags" }
</div>
```

This is a quirk of javascript. It will render "Sorry there are no tags"
if we have an empty array, otherwise nothing. 

Typically we set up functions that get passed as references to
`onClick` props on tags. Don't call it as a function though, instead
call it as a reference (e.g. `this.event` vs `this.event()`). These
functions _tend_ to be arrow functions, though I don't know if this is
required. 

You also get a `constructor` class to call. If you call this, you
_must_ call `super();` within it.

When calling a component, props are defaulted to true.

It's often a good idea to split out a component for sub-items in an
array.

You can pass context inbetween opening and closing tags. This can help
when rendering it dynamically. It will add these values under the
"master" wrapping html tags.

Components can raise events that upper components can handle. This is
a common UI paradigm. We'll add a function within a `Counters`
component that deletes called `handleDelete`. Within the
sub-`Counter`s. You'll pass down a reference to this function to
sub-components.

```javascript
// Counters.js
// inside of render() { return (...) }
<div>
  {this.state.counters.map(coutner => (
    <Counter key={counter.id} onDelete={this.handleDelete} value=.../>
  ))}
</div>

// Counter.js
render() {
  return (
  //...
  <button className="dl-btn" onClick={this.props.onDelete}>Delete</button>
  )
}
```

Writing delete functions revolves around calling
`const counters = this.state.counters.filters(c => c.id !==
counterId);` and then using `this.setState({ counters })`, which is
counter-intuitive.

One can pass in objects, with multiple values attached, through
components. 

