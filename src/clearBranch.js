import clear from './clear.js';
import createNode from './createNode.js';

export default function clearBranch(tree, area){
  const [result, ...cleared] = clear(tree, area);
  return [result || createNode(tree.size), ...cleared];
};