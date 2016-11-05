import test from 'ava';

import clear from '../src/clear.js';
import createNode from '../src/createNode.js';

test('data', t => {
  const tree = {size:5, data: 'hello'};
  const area = {};
  const [result] = clear(tree, area);
  t.deepEqual(result, createNode(5));
});

function coords(left, top, width=1, height=1){
  return {
    top,
    left,
    width,
    height
  };
}