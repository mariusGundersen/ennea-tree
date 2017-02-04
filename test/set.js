import test from 'ava';

import set from '../lib/set.js';
import createNode from '../lib/createNode.js';

test('change center size should fail', t => {
  const initialTree = createNode(8);
  const tempTree = set(initialTree, 'test1', coords(2, 2, 4, 4));
  const tree = set(tempTree, 'test2', coords(3, 3, 2, 2));

  t.not(initialTree, tempTree);
  t.is(tempTree, tree);
  t.falsy(tree.data);
  t.is(tree.center.data, 'test1');
});

test('set center intersecting with top should fail', t => {
  const initialTree = createNode(2);
  const tempTree = set(initialTree, 'test1', coords(0, 0, 2, 1));
  const tree = set(tempTree, 'test2', coords(0, 0, 2, 2));

  t.not(initialTree, tempTree);
  t.is(tempTree, tree);
  t.falsy(tree.data);
  t.falsy(tree.center);
});

test('set center intersecting with left should fail', t => {
  const initialTree = createNode(2);
  const tempTree = set(initialTree, 'test1', coords(0, 0, 1, 2));
  const tree = set(tempTree, 'test2', coords(0, 0, 2, 2));

  t.not(initialTree, tempTree);
  t.is(tempTree, tree);
  t.falsy(tree.data);
  t.falsy(tree.center);
});

test('set center intersecting with right should fail', t => {
  const initialTree = createNode(2);
  const tempTree = set(initialTree, 'test1', coords(1, 0, 1, 2));
  const tree = set(tempTree, 'test2', coords(0, 0, 2, 2));

  t.not(initialTree, tempTree);
  t.is(tempTree, tree);
  t.falsy(tree.data);
  t.falsy(tree.center);
});

test('set center intersecting with bottom should fail', t => {
  const initialTree = createNode(2);
  const tempTree = set(initialTree, 'test1', coords(0, 1, 2, 1));
  const tree = set(tempTree, 'test2', coords(0, 0, 2, 2));

  t.not(initialTree, tempTree);
  t.is(tempTree, tree);
  t.falsy(tree.data);
  t.falsy(tree.center);
});

test('set top intersecting twice should fail', t => {
  const initialTree = createNode(2);
  const tempTree = set(initialTree, 'test1', coords(0, 0, 2, 1));
  const tree = set(tempTree, 'test2', coords(0, 0, 2, 1));

  t.not(initialTree, tempTree);
  t.is(tempTree, tree);
  t.falsy(tree.data);
  t.is(tree.top.length, 1);
  t.is(tree.top[0].data, 'test1');
});

test('set top intersecting with left should fail', t => {
  const initialTree = createNode(2);
  const tempTree = set(initialTree, 'test1', coords(0, 0, 1, 2));
  const tree = set(tempTree, 'test2', coords(0, 0, 2, 1));

  t.not(initialTree, tempTree);
  t.is(tempTree, tree);
  t.falsy(tree.data);
  t.is(tree.top.length, 0);
  t.is(tree.left[0].data, 'test1');
});

test('set top intersecting with right should fail', t => {
  const initialTree = createNode(2);
  const tempTree = set(initialTree, 'test1', coords(1, 0, 1, 2));
  const tree = set(tempTree, 'test2', coords(0, 0, 2, 1));

  t.not(initialTree, tempTree);
  t.is(tempTree, tree);
  t.falsy(tree.data);
  t.is(tree.top.length, 0);
  t.is(tree.right[0].data, 'test1');
});

test('set top intersecting with center should fail', t => {
  const initialTree = createNode(2);
  const tempTree = set(initialTree, 'test1', coords(0, 0, 2, 2));
  const tree = set(tempTree, 'test2', coords(0, 0, 2, 1));

  t.not(initialTree, tempTree);
  t.is(tempTree, tree);
  t.falsy(tree.data);
  t.is(tree.top.length, 0);
  t.is(tree.center.data, 'test1');
});

test('set left intersecting twice should fail', t => {
  const initialTree = createNode(2);
  const tempTree = set(initialTree, 'test1', coords(0, 0, 1, 2));
  const tree = set(tempTree, 'test2', coords(0, 0, 1, 2));

  t.not(initialTree, tempTree);
  t.is(tempTree, tree);
  t.falsy(tree.data);
  t.is(tree.left.length, 1);
  t.is(tree.left[0].data, 'test1');
});

test('set left intersecting with top should fail', t => {
  const initialTree = createNode(2);
  const tempTree = set(initialTree, 'test1', coords(0, 0, 2, 1));
  const tree = set(tempTree, 'test2', coords(0, 0, 1, 2));

  t.not(initialTree, tempTree);
  t.is(tempTree, tree);
  t.falsy(tree.data);
  t.is(tree.left.length, 0);
  t.is(tree.top[0].data, 'test1');
});

test('set left intersecting with bottom should fail', t => {
  const initialTree = createNode(2);
  const tempTree = set(initialTree, 'test1', coords(0, 1, 2, 1));
  const tree = set(tempTree, 'test2', coords(0, 0, 1, 2));

  t.not(initialTree, tempTree);
  t.is(tempTree, tree);
  t.falsy(tree.data);
  t.is(tree.left.length, 0);
  t.is(tree.bottom[0].data, 'test1');
});

test('set left intersecting with center should fail', t => {
  const initialTree = createNode(2);
  const tempTree = set(initialTree, 'test1', coords(0, 0, 2, 2));
  const tree = set(tempTree, 'test2', coords(0, 0, 1, 2));

  t.not(initialTree, tempTree);
  t.is(tempTree, tree);
  t.falsy(tree.data);
  t.is(tree.left.length, 0);
  t.is(tree.center.data, 'test1');
});

test('set right intersecting twice should fail', t => {
  const initialTree = createNode(2);
  const tempTree = set(initialTree, 'test1', coords(1, 0, 1, 2));
  const tree = set(tempTree, 'test2', coords(1, 0, 1, 2));

  t.not(initialTree, tempTree);
  t.is(tempTree, tree);
  t.falsy(tree.data);
  t.is(tree.right.length, 1);
  t.is(tree.right[0].data, 'test1');
});

test('set right intersecting with top should fail', t => {
  const initialTree = createNode(2);
  const tempTree = set(initialTree, 'test1', coords(0, 0, 2, 1));
  const tree = set(tempTree, 'test2', coords(1, 0, 1, 2));

  t.not(initialTree, tempTree);
  t.is(tempTree, tree);
  t.falsy(tree.data);
  t.is(tree.right.length, 0);
  t.is(tree.top[0].data, 'test1');
});

test('set right intersecting with bottom should fail', t => {
  const initialTree = createNode(2);
  const tempTree = set(initialTree, 'test1', coords(0, 1, 2, 1));
  const tree = set(tempTree, 'test2', coords(1, 0, 1, 2));

  t.not(initialTree, tempTree);
  t.is(tempTree, tree);
  t.falsy(tree.data);
  t.is(tree.right.length, 0);
  t.is(tree.bottom[0].data, 'test1');
});

test('set right intersecting with center should fail', t => {
  const initialTree = createNode(2);
  const tempTree = set(initialTree, 'test1', coords(0, 0, 2, 2));
  const tree = set(tempTree, 'test2', coords(1, 0, 1, 2));

  t.not(initialTree, tempTree);
  t.is(tempTree, tree);
  t.falsy(tree.data);
  t.is(tree.right.length, 0);
  t.is(tree.center.data, 'test1');
});

test('set bottom intersecting twice should fail', t => {
  const initialTree = createNode(2);
  const tempTree = set(initialTree, 'test1', coords(0, 1, 2, 1));
  const tree = set(tempTree, 'test2', coords(0, 1, 2, 1));

  t.not(initialTree, tempTree);
  t.is(tempTree, tree);
  t.falsy(tree.data);
  t.is(tree.bottom.length, 1);
  t.is(tree.bottom[0].data, 'test1');
});

test('set bottom intersecting with left should fail', t => {
  const initialTree = createNode(2);
  const tempTree = set(initialTree, 'test1', coords(0, 0, 1, 2));
  const tree = set(tempTree, 'test2', coords(0, 1, 2, 1));

  t.not(initialTree, tempTree);
  t.is(tempTree, tree);
  t.falsy(tree.data);
  t.is(tree.bottom.length, 0);
  t.is(tree.left[0].data, 'test1');
});

test('set bottom intersecting with right should fail', t => {
  const initialTree = createNode(2);
  const tempTree = set(initialTree, 'test1', coords(1, 0, 1, 2));
  const tree = set(tempTree, 'test2', coords(0, 1, 2, 1));

  t.not(initialTree, tempTree);
  t.is(tempTree, tree);
  t.falsy(tree.data);
  t.is(tree.bottom.length, 0);
  t.is(tree.right[0].data, 'test1');
});

test('set bottom intersecting with center should fail', t => {
  const initialTree = createNode(2);
  const tempTree = set(initialTree, 'test1', coords(0, 0, 2, 2));
  const tree = set(tempTree, 'test2', coords(0, 1, 2, 1));

  t.not(initialTree, tempTree);
  t.is(tempTree, tree);
  t.falsy(tree.data);
  t.is(tree.bottom.length, 0);
  t.is(tree.center.data, 'test1');
});

function coords(left, top, width=1, height=1){
  return {
    top,
    left,
    width,
    height
  };
}