# pathbuilderjs

Easily modify parameters in paths.

This simple library allows you to work easily with parameters in routing
frameworks like [Backbone.js](http://backbonejs.org/) and [pathjs](https://github.com/mtrpcic/pathjs), although it can be used for setting parameters in any
delimiter-separated string containing parameter-value pairs.

## Installation

In the browser:

```html
<script src="dist/pathbuilder.min.js"></script> 
```

**Note:** This library requires `Array.indexOf`, so you'll need [a polyfill](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/IndexOf#Compatibility) for
browsers without ES5 support.

On the server:

```
npm install pathbuilder
```

## Usage

```js
var pb = new PathBuilder();

var path = pb
    .prefix('/search/') // Parameters will be parsed after this
    .path('/search/query/hello+there/categories/hairy/')
    .param('query', 'hello+there+big+and')
    .param('filter', 'old')
    .path();

console.log(path);

// "/search/query/hello+there+big+and/categories/hairy/filter/old/"
```

Or on the server:

```js
var pb = require('pathbuilder');

// ...
```

## API

### .delimiter(delimiter)

Set or get the path delimiter. This is `/` by default.

**Note:** Setting the delimiter will reset the path.

```js
pb.delimiter("'");
pb.delimiter(); // "'"
```

### .ordering(ordering)

Set or get the current custom ordering.

This should be an array of parameter names in the order you'd like them to
appear in the resulting path.

```js
pb.ordering(['categories', 'query']);
pb.ordering(); // ['categories', 'query']

pb.prefix('/search/');
pb.path('/search/query/hello+there/categories/hairy/');
pb.path(); // "/search/categories/hairy/query/hello+there/"
```

### .param(key, value)

Set or get a parameter in the path.

Set `value` to `false` to remove `key`.

```js
pb.param('first', 'the-first');
pb.param('second', 'the-second');

pb.param('first'); // "the-first"
pb.param('second'); // "the-second"

pb.path(); // "/first/the-first/second/the-second"
```

### .path(path)

Set or get the current path.

```js
pb.path('/query/hello+there/categories/hairy/');
pb.path(); // "/query/hello+there/categories/hairy/"
```

### .prefix(prefix)

Set or get the path prefix. Anything after the `.prefix()` will be considered
to be the parameters.

**Note:** If you set a prefix the path *must* contain it, otherwise an error
will be thrown.

```js
pb.prefix('/search/');
pb.prefix(); // "/search/"

// This will throw an error
pb.prefix('/search/')
pb.path('/first/the-first/second/the-second/');
```

### .toObject()

Get the current path as an object.

```js
pb.path('/query/hello+there/categories/hairy/');
pb.toObject(); // { "query": "hello+there", "categories": "hairy" }
```
