import getIterator from './getIterator.js';

export default function isEmpty(tree, area){
  return getIterator(tree, area).next().done;
}