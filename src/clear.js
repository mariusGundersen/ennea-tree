import clearUnsafe from './clearUnsafe.js';
import createNode from './createNode.js';

export default function clear(tree, area){
  const [result, ...cleared] = clearUnsafe(tree, area);
  return [result || createNode(tree.size), ...cleared];
};