import getIterator from './getIterator.js';

export default function getAll(tree, area){
  return [...getIterator(tree, area)];
}
