import get from './get.js';
import set from './set.js';
import clear from './clear.js';
import getIterator from './getIterator.js';

export {get, set, clear, getIterator};

export function isEmpty(tree, area){
  return getAll(tree, area).length === 0;
}

export function getAll(tree, area){
  return [...getIterator(tree, area)];
}
