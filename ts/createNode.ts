import { Node } from './types';

export default function createNode<T>(size = 1): Node<T> {
  return {
    size,
    data: undefined,
    top: [],
    left: [],
    right: [],
    bottom: [],
    center: undefined,
    topLeft: undefined,
    topRight: undefined,
    bottomLeft: undefined,
    bottomRight: undefined,
  }
}