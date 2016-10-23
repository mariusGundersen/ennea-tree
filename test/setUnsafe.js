import test from 'ava';

import setUnsafe from '../src/setUnsafe.js';
import createNode from '../src/createNode.js';

test('setUnsafe data', t => {
  const initialTree = createNode(1);
  const tree = setUnsafe(initialTree, 'test', coords(0,0));

  t.not(initialTree, tree);
  t.is(tree.data, 'test');
});

test('setUnsafe topLeft data', t => {
  const initialTree = createNode(2);
  const tree = setUnsafe(initialTree, 'test', coords(0,0));

  t.not(initialTree, tree);
  t.falsy(tree.data);
  t.is(tree.topLeft.data, 'test');
});

test('setUnsafe topRight data', t => {
  const initialTree = createNode(2);
  const tree = setUnsafe(initialTree, 'test', coords(1,0));

  t.not(initialTree, tree);
  t.falsy(tree.data);
  t.is(tree.topRight.data, 'test');
});

test('setUnsafe bottomLeft data', t => {
  const initialTree = createNode(2);
  const tree = setUnsafe(initialTree, 'test', coords(0,1));

  t.not(initialTree, tree);
  t.falsy(tree.data);
  t.is(tree.bottomLeft.data, 'test');
});

test('setUnsafe bottomRight data', t => {
  const initialTree = createNode(2);
  const tree = setUnsafe(initialTree, 'test', coords(1,1));

  t.not(initialTree, tree);
  t.falsy(tree.data);
  t.is(tree.bottomRight.data, 'test');
});

test('setUnsafe center data', t => {
  const initialTree = createNode(2);
  const tree = setUnsafe(initialTree, 'test', coords(0, 0, 2, 2));

  t.not(initialTree, tree);
  t.falsy(tree.data);
  t.is(tree.center.data, 'test');
});

test('setUnsafe top data', t => {
  const initialTree = createNode(2);
  const tree = setUnsafe(initialTree, 'test', coords(0, 0, 2, 1));

  t.not(initialTree, tree);
  t.falsy(tree.data);
  t.is(tree.top.length, 1);
  t.is(tree.top[0].data, 'test');
});

test('setUnsafe left data', t => {
  const initialTree = createNode(2);
  const tree = setUnsafe(initialTree, 'test', coords(0, 0, 1, 2));

  t.not(initialTree, tree);
  t.falsy(tree.data);
  t.is(tree.left.length, 1);
  t.is(tree.left[0].data, 'test');
});

test('setUnsafe right data', t => {
  const initialTree = createNode(2);
  const tree = setUnsafe(initialTree, 'test', coords(1, 0, 1, 2));

  t.not(initialTree, tree);
  t.falsy(tree.data);
  t.is(tree.right.length, 1);
  t.is(tree.right[0].data, 'test');
});

test('setUnsafe bottom data', t => {
  const initialTree = createNode(2);
  const tree = setUnsafe(initialTree, 'test', coords(0, 1, 2, 1));

  t.not(initialTree, tree);
  t.falsy(tree.data);
  t.is(tree.bottom.length, 1);
  t.is(tree.bottom[0].data, 'test');
});

test('setUnsafe large center data', t => {
  const initialTree = createNode(8);
  const tree = setUnsafe(initialTree, 'test', coords(2, 2, 4, 4));

  t.not(initialTree, tree);
  t.falsy(tree.data);
  t.is(tree.center.data, 'test');
});

test('setUnsafe top data twice', t => {
  const initialTree = createNode(8);
  const tempTree = setUnsafe(initialTree, 'test1', coords(3, 0, 2, 1));
  const tree = setUnsafe(tempTree, 'test2', coords(3, 1, 2, 1));

  t.not(initialTree, tempTree);
  t.not(tempTree, tree);
  t.falsy(tree.data);
  t.is(tree.top.length, 2);
  t.is(tree.top[0].data, 'test1');
  t.is(tree.top[1].data, 'test2');
});

test('setUnsafe left data twice', t => {
  const initialTree = createNode(8);
  const tempTree = setUnsafe(initialTree, 'test1', coords(0, 3, 1, 2));
  const tree = setUnsafe(tempTree, 'test2', coords(1, 3, 1, 2));

  t.not(initialTree, tempTree);
  t.not(tempTree, tree);
  t.falsy(tree.data);
  t.is(tree.left.length, 2);
  t.is(tree.left[0].data, 'test1');
  t.is(tree.left[1].data, 'test2');
});

test('setUnsafe right data twice', t => {
  const initialTree = createNode(8);
  const tempTree = setUnsafe(initialTree, 'test1', coords(7, 3, 1, 2));
  const tree = setUnsafe(tempTree, 'test2', coords(6, 3, 1, 2));

  t.not(initialTree, tempTree);
  t.not(tempTree, tree);
  t.falsy(tree.data);
  t.is(tree.right.length, 2);
  t.is(tree.right[0].data, 'test1');
  t.is(tree.right[1].data, 'test2');
});

test('setUnsafe bottom data twice', t => {
  const initialTree = createNode(8);
  const tempTree = setUnsafe(initialTree, 'test1', coords(3, 7, 2, 1));
  const tree = setUnsafe(tempTree, 'test2', coords(3, 6, 2, 1));

  t.not(initialTree, tempTree);
  t.not(tempTree, tree);
  t.falsy(tree.data);
  t.is(tree.bottom.length, 2);
  t.is(tree.bottom[0].data, 'test1');
  t.is(tree.bottom[1].data, 'test2');
});

function coords(left, top, width=1, height=1){
  return {
    top,
    left,
    width,
    height
  };
}