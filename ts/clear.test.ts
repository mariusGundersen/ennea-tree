import test from 'ava';

import { Node } from './types';
import clear from './clear';
import createNode from './createNode';
import { BoxArea } from './main';

test('data', t => {
  const tree = { size: 5, data: 'hello' } as Node<string>;
  const area = {} as BoxArea;
  const { tree: result } = clear(tree, area);
  t.deepEqual(result, createNode(5));
});

test('data with condition', t => {
  const tree = { size: 5, data: 'hello' } as Node<string>;
  const area = {} as BoxArea;
  const { tree: result } = clear(tree, area, d => d !== 'hello');
  t.deepEqual(result, tree);
});
