import getIterator from './getIterator';

import { Node, AreaData } from './types';

export default function get<T>(tree : Node<T>, top : number, left : number) : AreaData<T>{
  return getIterator(tree, {top, left}).next().value;
}
