import setUnsafe from './setUnsafe.js';

import isEmpty from './isEmpty.js';

export default function set(tree, data, area){
  if(!isEmpty(tree, area)) return tree;
  return setUnsafe(tree, data, area);
};