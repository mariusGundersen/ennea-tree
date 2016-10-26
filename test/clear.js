import test from 'ava';

import clear from '../src/clear.js';
import createNode from '../src/createNode.js';

test('null', t => {
  const tree = null;
  const area = {};
  t.is(clear(tree, area), null);
});

test('data', t => {
  const tree = {data: 'hello'};
  const area = {};
  t.is(clear(tree, area), null);
});

test('clear miss', t => {
  const tree = {
    ...createNode(2),
    topLeft: {
      ...createNode(1),
      data: 'hello'
    }
  };
  const area = coords(8, 0);
  t.is(clear(tree, area), tree);
});

test('clear topLeft', t => {
  const tree = {
    ...createNode(2),
    topLeft: {
      ...createNode(1),
      data: 'hello'
    }
  };
  const area = coords(0, 0);
  t.is(clear(tree, area), null);
});

test('clear topRight', t => {
  const tree = {
    ...createNode(2),
    topRight: {
      ...createNode(1),
      data: 'hello'
    }
  };
  const area = coords(1, 0);
  t.is(clear(tree, area), null);
});

test('clear bottomLeft', t => {
  const tree = {
    ...createNode(2),
    bottomLeft: {
      ...createNode(1),
      data: 'hello'
    }
  };
  const area = coords(0, 1);
  t.is(clear(tree, area), null);
});

test('clear bottomRight', t => {
  const tree = {
    ...createNode(2),
    bottomRight: {
      ...createNode(1),
      data: 'hello'
    }
  };
  const area = coords(1, 1);
  t.is(clear(tree, area), null);
});

test('clear center', t => {
  const tree = {
    ...createNode(2),
    center: {
      top: 0,
      left: 0,
      right: 2,
      bottom: 2,
      data: 'hello'
    }
  };

  const area = coords(0, 0);
  t.is(clear(tree, area), null);
});

test('clear top', t => {
  const tree = {
    ...createNode(2),
    top: [{
      top: 0,
      left: 0,
      right: 2,
      bottom: 1,
      data: 'hello'
    }]
  };

  const area = coords(0, 0);
  t.is(clear(tree, area), null);
});

test('clear left', t => {
  const tree = {
    ...createNode(2),
    left: [{
      top: 0,
      left: 0,
      right: 1,
      bottom: 2,
      data: 'hello'
    }]
  };

  const area = coords(0, 0);
  t.is(clear(tree, area), null);
});

test('clear right', t => {
  const tree = {
    ...createNode(2),
    right: [{
      top: 0,
      left: 1,
      right: 2,
      bottom: 2,
      data: 'hello'
    }]
  };

  const area = coords(1, 0);
  t.is(clear(tree, area), null);
});

test('clear bottom', t => {
  const tree = {
    ...createNode(2),
    bottom: [{
      top: 1,
      left: 0,
      right: 2,
      bottom: 2,
      data: 'hello'
    }]
  };

  const area = coords(1, 1);
  t.is(clear(tree, area), null);
});

test('clear one of two vertical', t => {
  const tree = {
    ...createNode(2),
    topLeft: {
      ...createNode(1),
      data: 'top'
    },
    bottomLeft: {
      ...createNode(1),
      data: 'bottom'
    }
  };

  const area = coords(0, 0);
  t.not(clear(tree, area), null);
  t.is(clear(tree, area).bottomLeft.data, 'bottom');
});

test('clear one of two horizontal', t => {
  const tree = {
    ...createNode(2),
    topLeft: {
      ...createNode(1),
      data: 'left'
    },
    topRight: {
      ...createNode(1),
      data: 'right'
    }
  };

  const area = coords(0, 0);
  t.not(clear(tree, area), null);
  t.is(clear(tree, area).topRight.data, 'right');
});

test('clear one of two vertical', t => {
  const tree = {
    ...createNode(2),
    topLeft: {
      ...createNode(1),
      data: 'top'
    },
    bottomLeft: {
      ...createNode(1),
      data: 'bottom'
    }
  };

  const area = coords(0, 1);
  t.not(clear(tree, area), null);
  t.is(clear(tree, area).topLeft.data, 'top');
});

test('clear one of two horizontal', t => {
  const tree = {
    ...createNode(2),
    topLeft: {
      ...createNode(1),
      data: 'left'
    },
    topRight: {
      ...createNode(1),
      data: 'right'
    }
  };

  const area = coords(1, 0);
  t.not(clear(tree, area), null);
  t.is(clear(tree, area).topLeft.data, 'left');
});

function coords(left, top, width=1, height=1){
  return {
    top,
    left,
    width,
    height
  };
}