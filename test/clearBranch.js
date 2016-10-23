import test from 'ava';

import clearBranch from '../src/clearBranch.js';
import createNode from '../src/createNode.js';

test('data', t => {
  const tree = {size:5, data: 'hello'};
  const area = {};
  t.deepEqual(clearBranch(tree, area), createNode(5));
});

function coords(left, top, width=1, height=1){
  return {
    top,
    left,
    width,
    height
  };
}