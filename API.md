## Interface

Patchwork exports a single function `patch` accepting a String or an Array specifying the configuration paths you want aggregate.

### `patch(basesDir)`

Composes a hapi server object where:
+ `paths` - a String or an Array of paths folder valid
+ `options` - an options object with two  options `{sanitize: Object, isNullOverride: true/false}`

### Notes

The config files can be a folder, YAML, JSON and JS module

## Usage

Loading without inheritance:

```javascript
'use strict';
const Patchwork = require('patchwork');
const Path = require('path');

const result = Patchwork.patch(Path.join(__dirname, 'your', 'path'));
```

Loading with inheritance:

```javascript
'use strict';
const Patchwork = require('patchwork');
const Path = require('path');

const paths = [
  Path.join(__dirname, 'your', 'path', '1'),
  Path.join(__dirname, 'your', 'path', '2')
];

const result = Patchwork.patch(paths);
```


Loading files using sanitize option:

```javascript
'use strict';
const Patchwork = require('patchwork');
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

const paths = Path.join(__dirname, 'your', 'path');

const result = Patchwork.patch(paths, {sanitize: mask});
```
