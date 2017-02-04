import setUnsafe from './setUnsafe';

import isEmpty from './isEmpty';

import { Node, BoxArea } from './types';

export default function set<T>(tree : Node<T>, data : T, area : BoxArea) : Node<T>{
  if(!isEmpty(tree, area)) return tree;
  return setUnsafe(tree, data, area);
};