import test from 'ava';

import set from '../src/set.js';
import createNode from '../src/createNode.js';

test('set data', t => {
  const initialTree = createNode(1);
  const tree = set(initialTree, 'test', coords(0,0));

  t.not(initialTree, tree);
  t.is(tree.data, 'test');
});

test('set topLeft data', t => {
  const initialTree = createNode(2);
  const tree = set(initialTree, 'test', coords(0,0));

  t.not(initialTree, tree);
  t.falsy(tree.data);
  t.is(tree.topLeft.data, 'test');
});

test('set topRight data', t => {
  const initialTree = createNode(2);
  const tree = set(initialTree, 'test', coords(1,0));

  t.not(initialTree, tree);
  t.falsy(tree.data);
  t.is(tree.topRight.data, 'test');
});

test('set bottomLeft data', t => {
  const initialTree = createNode(2);
  const tree = set(initialTree, 'test', coords(0,1));

  t.not(initialTree, tree);
  t.falsy(tree.data);
  t.is(tree.bottomLeft.data, 'test');
});

test('set bottomRight data', t => {
  const initialTree = createNode(2);
  const tree = set(initialTree, 'test', coords(1,1));

  t.not(initialTree, tree);
  t.falsy(tree.data);
  t.is(tree.bottomRight.data, 'test');
});

test('set center data', t => {
  const initialTree = createNode(2);
  const tree = set(initialTree, 'test', coords(0, 0, 2, 2));

  t.not(initialTree, tree);
  t.falsy(tree.data);
  t.is(tree.center.data, 'test');
});

test('set top data', t => {
  const initialTree = createNode(2);
  const tree = set(initialTree, 'test', coords(0, 0, 2, 1));

  t.not(initialTree, tree);
  t.falsy(tree.data);
  t.is(tree.top.length, 1);
  t.is(tree.top[0].data, 'test');
});

test('set left data', t => {
  const initialTree = createNode(2);
  const tree = set(initialTree, 'test', coords(0, 0, 1, 2));

  t.not(initialTree, tree);
  t.falsy(tree.data);
  t.is(tree.left.length, 1);
  t.is(tree.left[0].data, 'test');
});

test('set right data', t => {
  const initialTree = createNode(2);
  const tree = set(initialTree, 'test', coords(1, 0, 1, 2));

  t.not(initialTree, tree);
  t.falsy(tree.data);
  t.is(tree.right.length, 1);
  t.is(tree.right[0].data, 'test');
});

test('set bottom data', t => {
  const initialTree = createNode(2);
  const tree = set(initialTree, 'test', coords(0, 1, 2, 1));

  t.not(initialTree, tree);
  t.falsy(tree.data);
  t.is(tree.bottom.length, 1);
  t.is(tree.bottom[0].data, 'test');
});

test('set large center data', t => {
  const initialTree = createNode(8);
  const tree = set(initialTree, 'test', coords(2, 2, 4, 4));

  t.not(initialTree, tree);
  t.falsy(tree.data);
  t.is(tree.center.data, 'test');
});

test('set top data twice', t => {
  const initialTree = createNode(8);
  const tempTree = set(initialTree, 'test1', coords(3, 0, 2, 1));
  const tree = set(tempTree, 'test2', coords(3, 1, 2, 1));

  t.not(initialTree, tempTree);
  t.not(tempTree, tree);
  t.falsy(tree.data);
  t.is(tree.top.length, 2);
  t.is(tree.top[0].data, 'test1');
  t.is(tree.top[1].data, 'test2');
});

test('set left data twice', t => {
  const initialTree = createNode(8);
  const tempTree = set(initialTree, 'test1', coords(0, 3, 1, 2));
  const tree = set(tempTree, 'test2', coords(1, 3, 1, 2));

  t.not(initialTree, tempTree);
  t.not(tempTree, tree);
  t.falsy(tree.data);
  t.is(tree.left.length, 2);
  t.is(tree.left[0].data, 'test1');
  t.is(tree.left[1].data, 'test2');
});

test('set right data twice', t => {
  const initialTree = createNode(8);
  const tempTree = set(initialTree, 'test1', coords(7, 3, 1, 2));
  const tree = set(tempTree, 'test2', coords(6, 3, 1, 2));

  t.not(initialTree, tempTree);
  t.not(tempTree, tree);
  t.falsy(tree.data);
  t.is(tree.right.length, 2);
  t.is(tree.right[0].data, 'test1');
  t.is(tree.right[1].data, 'test2');
});

test('set bottom data twice', t => {
  const initialTree = createNode(8);
  const tempTree = set(initialTree, 'test1', coords(3, 7, 2, 1));
  const tree = set(tempTree, 'test2', coords(3, 6, 2, 1));

  t.not(initialTree, tempTree);
  t.not(tempTree, tree);
  t.falsy(tree.data);
  t.is(tree.bottom.length, 2);
  t.is(tree.bottom[0].data, 'test1');
  t.is(tree.bottom[1].data, 'test2');
});

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