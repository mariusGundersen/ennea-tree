import clear from './clear.js';
import createNode from './createNode.js';

export default function clearBranch(tree, area){
  return clear(tree, area) || createNode(tree.size);
};