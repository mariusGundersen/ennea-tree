import getIterator from './getIterator';

import { Node, BoxArea, AreaData } from './types';

export default function getAll<T>(tree : Node<T>, area : BoxArea) : AreaData<T>[] {
  return [...getIterator(tree, area)];
}
