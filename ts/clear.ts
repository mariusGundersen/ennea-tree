import clearUnsafe, { TreeAndCleared } from './clearUnsafe';
import createNode from './createNode';
import { Node, BoxArea } from './types';

export default function clear<T>(
  tree: Node<T>,
  area: BoxArea,
  condition: (data: T) => boolean = () => true)
  : TreeAndCleared<T> {
  const { tree: result, cleared } = clearUnsafe(tree, area, 0, 0, condition);
  return {
    tree: result || createNode<T>(tree.size),
    cleared
  };
};
