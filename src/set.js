import createNode from './createNode.js';
import intersect from './intersect.js';

export default function set(tree, data, {top, left, width=1, height=1, right=left+width, bottom=top+height}){
  if(tree == null){
    return null;
  }

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
      topLeft: set(tree.topLeft || createNode(halfSize), data, {
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
      topRight: set(tree.topRight || createNode(halfSize), data, {
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
      bottomLeft: set(tree.bottomLeft || createNode(halfSize), data, {
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
      bottomRight: set(tree.bottomRight || createNode(halfSize), data, {
        top: top - halfSize,
        left: left - halfSize,
        right: right - halfSize,
        bottom: bottom - halfSize
      })
    };
  }

  const box = {top, left, right, bottom};
  if(bottom <= halfSize){
    if(!intersect(tree.center, box)
    && tree.top.every(notIntersects(box))
    && tree.left.every(notIntersects(box))
    && tree.right.every(notIntersects(box))){
      return {
        ...tree,
        top: [...tree.top, {top, left, right, bottom, data}]
      }
    }
  }

  if(right <= halfSize){
    if(!intersect(tree.center, box)
    && tree.left.every(notIntersects(box))
    && tree.top.every(notIntersects(box))
    && tree.bottom.every(notIntersects(box))){
      return {
        ...tree,
        left: [...tree.left, {top, left, right, bottom, data}]
      }
    }
  }

  if(left >= halfSize){
    if(!intersect(tree.center, box)
    && tree.right.every(notIntersects(box))
    && tree.top.every(notIntersects(box))
    && tree.bottom.every(notIntersects(box))){
      return {
        ...tree,
        right: [...tree.right, {top, left, right, bottom, data}]
      }
    }
  }

  if(top >= halfSize){
    if(!intersect(tree.center, box)
    && tree.bottom.every(notIntersects(box))
    && tree.left.every(notIntersects(box))
    && tree.right.every(notIntersects(box))){
      return {
        ...tree,
        bottom: [...tree.bottom, {top, left, right, bottom, data}]
      }
    }
  }

  if(tree.center === null
    && top < halfSize
    && left < halfSize
    && right > halfSize
    && bottom > halfSize
    && tree.top.every(notIntersects(box))
    && tree.left.every(notIntersects(box))
    && tree.bottom.every(notIntersects(box))
    && tree.right.every(notIntersects(box))){
    return {
      ...tree,
      center: {top, left, right, bottom, data}
    };
  }

  return tree;
}

function notIntersects(area){
  return box => !intersect(box, area);
}