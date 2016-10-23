import getIterator from './getIterator.js';

export default function get(tree, top, left){
  return getIterator(tree, {top, left}).next().value;
}
