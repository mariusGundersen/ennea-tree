import test from 'ava';

import getIterator from '../src/getIterator.js';
import getAll from '../src/getAll.js';
import isEmpty from '../src/isEmpty.js';
import createNode from '../src/createNode.js';

test('null', t => {
  t.true(isEmpty(null, {}));
});

test('data', t => {
  const tree = {data:'hello'};
  const area = {};
  t.deepEqual(getArray(tree, area), ['hello']);
});

test('top left', t => {
  const tree = {
    ...createNode(2),
    topLeft: {data:'topLeft'}
  };
  const area = coords(0, 0);
  t.deepEqual(getArray(tree, area), ['topLeft']);
});

test('top right', t => {
  const tree = {
    ...createNode(2),
    topRight: {data:'topRight'}
  };
  const area = coords(1, 0);
  t.deepEqual(getArray(tree, area), ['topRight']);
});

test('bottom left', t => {
  const tree = {
    ...createNode(2),
    bottomLeft: {data:'bottomLeft'}
  };
  const area = coords(0, 1);
  t.deepEqual(getArray(tree, area), ['bottomLeft']);
});

test('bottom right', t => {
  const tree = {
    ...createNode(2),
    bottomRight: {data:'bottomRight'}
  };
  const area = coords(1, 1);
  t.deepEqual(getArray(tree, area), ['bottomRight']);
});

test('center', t => {
  const tree = {
    ...createNode(2),
    center: {top:0, left: 0, right: 2, bottom: 2, data:'center'}
  };
  const area = coords(0, 0);
  t.deepEqual(getArray(tree, area), ['center']);
});

test('top', t => {
  const tree = {
    ...createNode(2),
    top: [{top:0, left: 0, right: 2, bottom: 1, data:'top'}]
  };
  const area = coords(0, 0);
  t.deepEqual(getArray(tree, area), ['top']);
});

test('left', t => {
  const tree = {
    ...createNode(2),
    left: [{top:0, left: 0, right: 1, bottom: 2, data:'left'}]
  };
  const area = coords(0, 0);
  t.deepEqual(getArray(tree, area), ['left']);
});

test('right', t => {
  const tree = {
    ...createNode(2),
    right: [{top:0, left: 1, right: 2, bottom: 2, data:'right'}]
  };
  const area = coords(1, 0);
  t.deepEqual(getArray(tree, area), ['right']);
});

test('bottom', t => {
  const tree = {
    ...createNode(2),
    bottom: [{top:1, left: 0, right: 2, bottom: 2, data:'bottom'}]
  };
  const area = coords(0, 1);
  t.deepEqual(getArray(tree, area), ['bottom']);
});

test('all top left', t => {
  const tree = {
    ...createNode(4),
    topLeft: {
      ...createNode(2),
      topLeft: {size:1, data:'topLeft'},
      topRight: {size:1, data:'topRight'},
      bottomLeft: {size:1, data:'bottomLeft'},
      bottomRight: {size:1, data:'bottomRight'}
    }
  };
  const area = coords(0, 0, 2, 2);
  t.deepEqual(getArray(tree, area), ['topLeft', 'topRight', 'bottomLeft', 'bottomRight']);
});

test('all top right', t => {
  const tree = {
    ...createNode(4),
    topRight: {
      ...createNode(2),
      topLeft: {size:1, data:'topLeft'},
      topRight: {size:1, data:'topRight'},
      bottomLeft: {size:1, data:'bottomLeft'},
      bottomRight: {size:1, data:'bottomRight'}
    }
  };
  const area = coords(2, 0, 2, 2);
  t.deepEqual(getArray(tree, area), ['topLeft', 'topRight', 'bottomLeft', 'bottomRight']);
});

test('all bottom left', t => {
  const tree = {
    ...createNode(4),
    bottomLeft: {
      ...createNode(2),
      topLeft: {size:1, data:'topLeft'},
      topRight: {size:1, data:'topRight'},
      bottomLeft: {size:1, data:'bottomLeft'},
      bottomRight: {size:1, data:'bottomRight'}
    }
  };
  const area = coords(0, 2, 2, 2);
  t.deepEqual(getArray(tree, area), ['topLeft', 'topRight', 'bottomLeft', 'bottomRight']);
});

test('all bottom right', t => {
  const tree = {
    ...createNode(4),
    bottomRight: {
      ...createNode(2),
      topLeft: {size:1, data:'topLeft'},
      topRight: {size:1, data:'topRight'},
      bottomLeft: {size:1, data:'bottomLeft'},
      bottomRight: {size:1, data:'bottomRight'}
    }
  };
  const area = coords(2, 2, 2, 2);
  t.deepEqual(getArray(tree, area), ['topLeft', 'topRight', 'bottomLeft', 'bottomRight']);
});

test('not top left', t => {
  const tree = {
    ...createNode(2),
    topRight: {size:1, data:'topRight'},
    bottomLeft: {size:1, data:'bottomLeft'},
    bottomRight: {size:1, data:'bottomRight'}
  };
  const area = coords(0, 0);
  t.true(isEmpty(tree, area));
});

test('not top right', t => {
  const tree = {
    ...createNode(2),
    topLeft: {size:1, data:'topLeft'},
    bottomLeft: {size:1, data:'bottomLeft'},
    bottomRight: {size:1, data:'bottomRight'}
  };
  const area = coords(1, 0);
  t.true(isEmpty(tree, area));
});

test('not bottom left', t => {
  const tree = {
    ...createNode(2),
    topLeft: {size:1, data:'topLeft'},
    topRight: {size:1, data:'topRight'},
    bottomRight: {size:1, data:'bottomRight'}
  };
  const area = coords(0, 1);
  t.true(isEmpty(tree, area));
});

test('not bottom right', t => {
  const tree = {
    ...createNode(2),
    topLeft: {size:1, data:'topLeft'},
    topRight: {size:1, data:'topRight'},
    bottomLeft: {size:1, data:'bottomLeft'}
  };
  const area = coords(1, 1);
  t.true(isEmpty(tree, area));
});

function getArray(tree, area){
  return getAll(tree, area).map(x => x.data);
}

function coords(left, top, width=1, height=1){
  return {
    top,
    left,
    width,
    height
  };
}