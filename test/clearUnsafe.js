import test from 'ava';

import clearUnsafe from '../lib/clearUnsafe.js';
import createNode from '../lib/createNode.js';

test('data', t => {
  const tree = {data: 'hello'};
  const area = {};
  const {tree: result, cleared} = clearUnsafe(tree, area);
  t.is(result, undefined);
  t.deepEqual(cleared, [{
    data: 'hello',
    top: 0,
    left: 0,
    width: 1,
    height: 1
  }]);
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
  const {tree: result, cleared} = clearUnsafe(tree, area);
  t.is(result, tree);
  t.deepEqual(cleared, []);
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
  const {tree: result, cleared} = clearUnsafe(tree, area);
  t.is(result, undefined);
  t.deepEqual(cleared, [{
    data: 'hello',
    top: 0,
    left: 0,
    width: 1,
    height: 1
  }]);
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
  const {tree: result, cleared} = clearUnsafe(tree, area);
  t.is(result, undefined);
  t.deepEqual(cleared, [{
    data: 'hello',
    top: 0,
    left: 1,
    width: 1,
    height: 1
  }]);
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
  const {tree: result, cleared} = clearUnsafe(tree, area);
  t.is(result, undefined);
  t.deepEqual(cleared, [{
    data: 'hello',
    top: 1,
    left: 0,
    width: 1,
    height: 1
  }]);
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
  const {tree: result, cleared} = clearUnsafe(tree, area);
  t.is(result, undefined);
  t.deepEqual(cleared, [{
    data: 'hello',
    top: 1,
    left: 1,
    width: 1,
    height: 1
  }]);
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
  const {tree: result, cleared} = clearUnsafe(tree, area);
  t.is(result, undefined);
  t.deepEqual(cleared, [{
      top: 0,
      left: 0,
      width: 2,
      height: 2,
      data: 'hello'
    }]);
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
  const {tree: result, cleared} = clearUnsafe(tree, area);
  t.is(result, undefined);
  t.deepEqual(cleared, [{
      top: 0,
      left: 0,
      width: 2,
      height: 1,
      data: 'hello'
    }]);
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
  const {tree: result, cleared} = clearUnsafe(tree, area);
  t.is(result, undefined);
  t.deepEqual(cleared, [{
      top: 0,
      left: 0,
      width: 1,
      height: 2,
      data: 'hello'
    }]);
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
  const {tree: result, cleared} = clearUnsafe(tree, area);
  t.is(result, undefined);
  t.deepEqual(cleared, [{
      top: 0,
      left: 1,
      width: 1,
      height: 2,
      data: 'hello'
    }]);
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
  const {tree: result, cleared} = clearUnsafe(tree, area);
  t.is(result, undefined);
  t.deepEqual(cleared, [{
      top: 1,
      left: 0,
      width: 2,
      height: 1,
      data: 'hello'
    }]);
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
  const {tree: result, cleared} = clearUnsafe(tree, area);
  t.not(result, undefined);
  t.is(result.bottomLeft.data, 'bottom');
  t.deepEqual(cleared, [{
    data: 'top',
    top: 0,
    left: 0,
    width: 1,
    height: 1
  }]);
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
  const {tree: result, cleared} = clearUnsafe(tree, area);
  t.not(result, undefined);
  t.is(result.topRight.data, 'right');
  t.deepEqual(cleared, [{
    data: 'left',
    top: 0,
    left: 0,
    width: 1,
    height: 1
  }]);
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
  const {tree: result, cleared} = clearUnsafe(tree, area);
  t.not(result, undefined);
  t.is(result.topLeft.data, 'top');
  t.deepEqual(cleared, [{
    data: 'bottom',
    top: 1,
    left: 0,
    width: 1,
    height: 1
  }]);
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
  const {tree: result, cleared} = clearUnsafe(tree, area);
  t.not(result, undefined);
  t.is(result.topLeft.data, 'left');
  t.deepEqual(cleared, [{
    data: 'right',
    top: 0,
    left: 1,
    width: 1,
    height: 1
  }]);
});

test('clear nested center', t => {
  const tree = {
    ...createNode(8),
    bottomRight: {
      ...createNode(4),
      center: {
        top: 1,
        left: 1,
        right: 3,
        bottom: 3,
        data: 'hello'
      }
    }
  };

  const area = coords(6,6);
  const {tree: result, cleared} = clearUnsafe(tree, area);
  t.is(result, undefined);
  t.deepEqual(cleared, [{
      top: 5,
      left: 5,
      width: 2,
      height: 2,
      data: 'hello'
    }]);
});


test('clear nested top', t => {
  const tree = {
    ...createNode(8),
    bottomRight: {
      ...createNode(4),
      top: [{
        top: 1,
        left: 1,
        right: 3,
        bottom: 2,
        data: 'hello'
      }]
    }
  };

  const area = coords(6, 5);
  const {tree: result, cleared} = clearUnsafe(tree, area);
  t.is(result, undefined);
  t.deepEqual(cleared, [{
      top: 5,
      left: 5,
      width: 2,
      height: 1,
      data: 'hello'
    }]);
});

test('clear left', t => {
  const tree = {
    ...createNode(8),
    bottomRight: {
      ...createNode(4),
      left: [{
        top: 1,
        left: 1,
        right: 2,
        bottom: 3,
        data: 'hello'
      }]
    }
  };

  const area = coords(5, 6);
  const {tree: result, cleared} = clearUnsafe(tree, area);
  t.is(result, undefined);
  t.deepEqual(cleared, [{
      top: 5,
      left: 5,
      width: 1,
      height: 2,
      data: 'hello'
    }]);
});

test('clear right', t => {
  const tree = {
    ...createNode(8),
    bottomRight: {
      ...createNode(4),
      right: [{
        top: 1,
        left: 2,
        right: 3,
        bottom: 3,
        data: 'hello'
      }]
    }
  };

  const area = coords(6, 6);
  const {tree: result, cleared} = clearUnsafe(tree, area);
  t.is(result, undefined);
  t.deepEqual(cleared, [{
      top: 5,
      left: 6,
      width: 1,
      height: 2,
      data: 'hello'
    }]);
});

test('clear bottom', t => {
  const tree = {
    ...createNode(8),
    bottomRight: {
      ...createNode(4),
      bottom: [{
        top: 2,
        left: 1,
        right: 3,
        bottom: 3,
        data: 'hello'
      }]
    }
  };

  const area = coords(6, 6);
  const {tree: result, cleared} = clearUnsafe(tree, area);
  t.is(result, undefined);
  t.deepEqual(cleared, [{
      top: 6,
      left: 5,
      width: 2,
      height: 1,
      data: 'hello'
    }]);
});

function coords(left, top, width=1, height=1){
  return {
    top,
    left,
    width,
    height
  };
}