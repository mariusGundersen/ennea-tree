import test from 'ava';

import diff from '../es/diff.js';
import set from '../es/set.js';
import createNode from '../es/createNode.js';

test('null and null', t => {
  const result = [...diff(null, null)];
  t.is(result.length, 0);
});

test('same', t => {
  const tree = createNode(1);
  const result = [...diff(tree, tree)];
  t.is(result.length, 0);
});

test('set empty tree', t => {
  const tree = createNode(1);
  const result = [...diff(null, tree)];
  t.is(result.length, 0);
});

test('clear empty tree', t => {
  const tree = createNode(1);
  const result = [...diff(tree, null)];
  t.is(result.length, 0);
});

test('two empty trees', t => {
  const treeBefore = createNode(1);
  const treeAfter = createNode(1);
  const result = [...diff(treeBefore, treeAfter)];
  t.is(result.length, 0);
});

test('set data', t => {
  const treeBefore = {
    ...createNode(1)
  };
  const treeAfter = {
    ...createNode(1),
    data: 'hello'
  };
  const result = [...diff(treeBefore, treeAfter)];
  t.is(result.length, 1);
  t.deepEqual(result[0], {
    type: 'set',
    top: 0,
    left: 0,
    width: 1,
    height: 1,
    after: 'hello'
  });
});

test('clear data', t => {
  const treeBefore = {
    ...createNode(1),
    data: 'hello'
  };
  const treeAfter = {
    ...createNode(1)
  };
  const result = [...diff(treeBefore, treeAfter)];
  t.is(result.length, 1);
  t.deepEqual(result[0], {
    type: 'clear',
    top: 0,
    left: 0,
    width: 1,
    height: 1,
    before: 'hello'
  });
});

test('update data', t => {
  const treeBefore = {
    ...createNode(1),
    data: 'hello'
  };
  const treeAfter = {
    ...createNode(1),
    data: 'hi'
  };
  const result = [...diff(treeBefore, treeAfter)];
  t.is(result.length, 1);
  t.deepEqual(result[0], {
    type: 'update',
    top: 0,
    left: 0,
    width: 1,
    height: 1,
    before: 'hello',
    after: 'hi'
  });
});

test('set and clear deep data', t => {
  const treeBefore = createTree(4, {data: 'hello', top:1, left: 2});
  const treeAfter = createTree(4, {data: 'hello', top:2, left: 1});
  const result = [...diff(treeBefore, treeAfter)];
  t.is(result.length, 2);
  t.deepEqual(result[0], {
    type: 'clear',
    top: 1,
    left: 2,
    width: 1,
    height: 1,
    before: 'hello'
  });
  t.deepEqual(result[1], {
    type: 'set',
    top: 2,
    left: 1,
    width: 1,
    height: 1,
    after: 'hello'
  });
});

test('same big block center', t => {
  const tree = createTree(4, {data: 'hello', top:1, left: 1, width: 2, height: 2});
  const result = [...diff(tree, tree)];
  t.is(result.length, 0);
});

test('set big block center', t => {
  const treeBefore = createTree(4);
  const treeAfter = createTree(4, {data: 'hello', top:1, left: 1, width: 2, height: 2});
  const result = [...diff(treeBefore, treeAfter)];
  t.is(result.length, 1);
  t.deepEqual(result[0], {
    type: 'set',
    top: 1,
    left: 1,
    width: 2,
    height: 2,
    after: 'hello'
  });
});

test('clear big block center', t => {
  const treeBefore = createTree(4, {data: 'hello', top:1, left: 1, width: 2, height: 2});
  const treeAfter = createTree(4);
  const result = [...diff(treeBefore, treeAfter)];
  t.is(result.length, 1);
  t.deepEqual(result[0], {
    type: 'clear',
    top: 1,
    left: 1,
    width: 2,
    height: 2,
    before: 'hello'
  });
});

test('update big block center', t => {
  const treeBefore = createTree(4, {data: 'hello', top:1, left: 1, width: 2, height: 2});
  const treeAfter = createTree(4, {data: 'hi', top:1, left: 1, width: 2, height: 2});
  const result = [...diff(treeBefore, treeAfter)];
  t.is(result.length, 1);
  t.deepEqual(result[0], {
    type: 'update',
    top: 1,
    left: 1,
    width: 2,
    height: 2,
    before: 'hello',
    after: 'hi'
  });
});

test('change big block size center', t => {
  const treeBefore = createTree(4, {data: 'hello', top:1, left: 1, width: 2, height: 2});
  const treeAfter = createTree(4, {data: 'hello', top:0, left: 0, width: 4, height: 4});
  const result = [...diff(treeBefore, treeAfter)];
  t.is(result.length, 2);
  t.deepEqual(result[0], {
    type: 'clear',
    top: 1,
    left: 1,
    width: 2,
    height: 2,
    before: 'hello'
  });
  t.deepEqual(result[1], {
    type: 'set',
    top: 0,
    left: 0,
    width: 4,
    height: 4,
    after: 'hello'
  });
});

test('same big block top', t => {
  const tree = createTree(4, {data: 'hello', top:0, left: 1, width: 2, height: 1});
  const result = [...diff(tree, tree)];
  t.is(result.length, 0);
});

test('set big block top', t => {
  const treeBefore = createTree(4);
  const treeAfter = createTree(4, {data: 'hello', top:0, left: 1, width: 2, height: 1});
  const result = [...diff(treeBefore, treeAfter)];
  t.is(result.length, 1);
  t.deepEqual(result[0], {
    type: 'set',
    top: 0,
    left: 1,
    width: 2,
    height: 1,
    after: 'hello'
  });
});

test('clear big block top', t => {
  const treeBefore = createTree(4, {data: 'hello', top:0, left: 1, width: 2, height: 1});
  const treeAfter = createTree(4);
  const result = [...diff(treeBefore, treeAfter)];
  t.is(result.length, 1);
  t.deepEqual(result[0], {
    type: 'clear',
    top: 0,
    left: 1,
    width: 2,
    height: 1,
    before: 'hello'
  });
});

test('update big block top', t => {
  const treeBefore = createTree(4, {data: 'hello', top:0, left: 1, width: 2, height: 1});
  const treeAfter = createTree(4, {data: 'hi', top:0, left: 1, width: 2, height: 1});
  const result = [...diff(treeBefore, treeAfter)];
  t.is(result.length, 1);
  t.deepEqual(result[0], {
    type: 'update',
    top: 0,
    left: 1,
    width: 2,
    height: 1,
    before: 'hello',
    after: 'hi'
  });
});

test('resize big block top', t => {
  const treeBefore = createTree(4, {data: 'hello', top:0, left: 1, width: 2, height: 1});
  const treeAfter = createTree(4, {data: 'hello', top:0, left: 1, width: 2, height: 2});
  const result = [...diff(treeBefore, treeAfter)];
  t.is(result.length, 2);
  t.deepEqual(result[0], {
    type: 'clear',
    top: 0,
    left: 1,
    width: 2,
    height: 1,
    before: 'hello'
  });
  t.deepEqual(result[1], {
    type: 'set',
    top: 0,
    left: 1,
    width: 2,
    height: 2,
    after: 'hello'
  });
});

function createTree(size, ...data){
  let tree = createNode(size);
  for(let entry of data){
    tree = set(tree, entry.data, entry);
  }
  return tree;
}