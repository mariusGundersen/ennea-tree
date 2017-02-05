import createNode from './createNode';
import intersect from './intersect';
import { Box, BoxArea, BoxedData, Node } from './types';

export default function setUnsafe<T>(
  tree : Node<T>,
  data : T,
  {top, left, width=1, height=1, right=left+width, bottom=top+height} : BoxArea)
  : Node<T> {

  if(tree.size === 1){
    return {
      ...tree,
      data
    };
  }

  const halfSize = tree.size/2;
  if(right <= halfSize && bottom <= halfSize){
    return {
      ...tree,
      topLeft: setUnsafe(tree.topLeft || createNode<T>(halfSize), data, {
        top,
        left,
        right,
        bottom
      })
    };
  }

  if(left >= halfSize && bottom <= halfSize){
    return {
      ...tree,
      topRight: setUnsafe(tree.topRight || createNode<T>(halfSize), data, {
        top,
        left: left - halfSize,
        right: right - halfSize,
        bottom
      })
    };
  }

  if(right <= halfSize && top >= halfSize){
    return {
      ...tree,
      bottomLeft: setUnsafe(tree.bottomLeft || createNode<T>(halfSize), data, {
        top: top - halfSize,
        left,
        right,
        bottom: bottom - halfSize
      })
    };
  }

  if(left >= halfSize && top >= halfSize){
    return {
      ...tree,
      bottomRight: setUnsafe(tree.bottomRight || createNode<T>(halfSize), data, {
        top: top - halfSize,
        left: left - halfSize,
        right: right - halfSize,
        bottom: bottom - halfSize
      })
    };
  }

  if(bottom <= halfSize){
    return {
      ...tree,
      top: [...tree.top, {top, left, right, bottom, data}]
    };
  }

  if(right <= halfSize){
    return {
      ...tree,
      left: [...tree.left, {top, left, right, bottom, data}]
    };
  }

  if(left >= halfSize){
    return {
      ...tree,
      right: [...tree.right, {top, left, right, bottom, data}]
    };
  }

  if(top >= halfSize){
    return {
      ...tree,
      bottom: [...tree.bottom, {top, left, right, bottom, data}]
    };
  }

  if(tree.center == null
    && top < halfSize
    && left < halfSize
    && right > halfSize
    && bottom > halfSize){
    return {
      ...tree,
      center: {top, left, right, bottom, data}
    };
  }

  return tree;
}