import clearUnsafe, { TreeAndCleared } from './clearUnsafe';
import createNode from './createNode';
import { Node, BoxArea } from './types';

export default function clear<T>(
  tree: Node<T>,
  area: BoxArea)
  : TreeAndCleared<T> {
  const { tree: result, cleared } = clearUnsafe(tree, area);
  return {
    tree: result || createNode<T>(tree.size),
    cleared
  };
};