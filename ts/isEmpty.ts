import getIterator from './getIterator';

import { Node, BoxArea } from './types';

export default function isEmpty(tree: Node<any> | undefined, area: BoxArea): boolean {
  return getIterator(tree, area).next().done;
}
