# Table of Contents

* [Introduction](#introduction "Introduction")

## Pellmell

Pellmell provides several helpful methods for aggregate configurations pieces.

### `patch(pieces, [options])`

Aggregate all pieces to a single object using the given options where:

- `pieces` - a piece or an array of piece where a piece can be:
    - a plain object.
    - a function that returns a plain object.
    - a string representing the path of an external:
        - JSON file
        - YML file
        - JS module that exports:
            - a plain object
            - a function that returns a plain object.

- `options` - optional merging options:
    - `sanitize` - a [mask](https://github.com/hapipip/masks) 
    - `isNullOverride` - a boolean specifying whether to override a key if null is provided.

- `callback` - the callback function with signature `function(err)` where:
    - `err` - an error returned from the registration function. Note that exceptions thrown by the
      registration function are not handled by the framework.

If no `callback` is provided, a `Promise` object is returned.

## Usage

Merge pieces to a single object

```js
const pieces = [
   {a: 1, c: 3}, 
   {b: 2}, 
   () => ({c: 42})
];

const result = Pellmell.patch(pieces);  // results in {a: 1, b: 2, c: 42}



```

Merge the content of a file or a directory to a single object.

```js

const result = Pellmell.patch(Path.join(__dirname, 'your', 'path.yml'));


```

Merge the content of multiple files or a directories to a single object.

```js
const result = Pellmell.patch([
    Path.join(__dirname, 'your', 'first',  'path.json'),
    Path.join(__dirname, 'your', 'second', 'path.js'),
    Path.join(__dirname, 'your', 'third', 'path.yml')
]);
```

Merge mixed pieces into a single object

```js
const result = Pellmell.patch([
    {a: 1},
    Path.join(__dirname, 'a', 'file', 'path.js'),
    () => ({b: 2}),
    Path.join(__dirname, 'another', 'file', 'path.yml')
]);


```

Loading files using sanitize option:

```js
'use strict';
const Patchwork = require('pellmell');
const Path = require('path');

const mask = {
  My: {
    object: true,
    need: true,
    to: {
      be: {
        like: true,
        this: true
      }
    }
  }
};

const result = Pellmell.patch(Path.join(__dirname, 'your', 'path'), {sanitize: mask});
```