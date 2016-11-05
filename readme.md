# ennea-tree

> Immutable tilemap quad-tree with support for mega-tiles

## Installation

    npm install --save ennea-tree

## Usage

```js
import * as enneaTree from 'ennea-tree'

let tree = enneaTree.createTree(16);
tree = enneaTree.set(tree, 'hello', {top:0, left:0});
tree = enneaTree.set(tree, 'hi', {top:4, left:7, width:3, height:5});
for(const fruit of enneaTree.getIterator(tree, {top:0, left:0, width:16, height:16})){
    console.log(fruit);
}
```

## Methods

### `enneaTree.get(tree, top, left)`

Get the data at the position, or null.

    // returns
    {
        data,
        top,
        left,
        width,
        height
    }

### `enneaTree.set(tree, data, {top, left, width=1, height=1, right=left+width, bottom=top+height})`

Set the data at the position or area. Specify either the width/height or right/bottom. Returns the modified tree. If the area is not empty, returns the original tree.

See also `setUnsafe`, which does not check if the area is empty before setting, and can therefore result in corrupted data.

### `enneaTree.diff(treeBefore, treeAfter)`

Get the differences between two trees. This is a generator, you can use `for of` to loop through the changes.

    // returns
    {
        type: SET,
        top,
        left,
        width,
        height,
        after
    }

    {
        type: UPDATE,
        top,
        left,
        width,
        height,
        before,
        after
    }

    {
        type: CLEAR,
        top,
        left,
        width,
        height,
        before
    }

### `enneaTree.clear(tree, {top, left, width=1, height=1, right=left+width, bottom=top+height})`

Clear the position or area. Returns the modified tree.

See also `clearUnsafe`, which returns `null` if the tree becomes empty.

### `enneaTree.update(tree, (before, context, {top, left}) => after)`

Update multiple positions in a tree without creating intermediate tree structures.

    const updater = enneaTree.update(tree, (before, context, {top, left}) => before+context);
    updater.update({0, 0}, 10);
    tree = updater.result([
        {area: {1, 1}, context: 5},
        {area: {1, 2}, context: 5},
        {area: {1, 3}, context: 5}
    ]);

Note: `updater.result` takes an array that can be used as a queue. You can push changes onto this queue from the update callback.

### `enneaTree.getAll(tree, {top, left, width=1, height=1, right=left+width, bottom=top+height})`

Get all the data within the area as an array. This is a convenience method that uses `getIterator`.

    // returns
    [{
        data,
        top,
        left,
        width,
        height
    }]

### `enneaTree.isEmpty(tree, {top, left, width=1, height=1, right=left+width, bottom=top+height})`

Check if the area is empty, ie, if `getAll` returns an empty array.

### `enneaTree.setUnsafe(tree, data, , {top, left, width=1, height=1, right=left+width, bottom=top+height})`

> This method can result in corrupted trees.

See `set`.

### `enneaTree.createNode(size=1)`

returns a new empty node with the specified size.

### `enneaTree.clearUnsafe()`

> This method will return null if the tree is empty after clearing

See `clear`.

### `enneaTree.getIterator(tree, {top, left, width=1, height=1, right=left+width, bottom=top+height})`

Get all the data within the area as an iterator, than can be looped over with a `for of` loop.

    // returns
    {
        data,
        top,
        left,
        width,
        height
    }

### `enneaTree.createTree(size=1)`

See `createNode`.

## Constants

### `enneaTree.SET`

    'set'

### `enneaTree.UPDATE`

    'update'

### `enneaTree.CLEAR`

    'clear'
