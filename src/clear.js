import intersect from './intersect.js';

export default function clear(tree, {top, left, width=1, height=1, right=left+width, bottom=top+height}){
  if(tree == null){
    return null;
  }

  if(tree.data !== null){
    return null;
  }

  const halfSize = tree.size/2;
  const min = x => Math.min(x, halfSize);
  const max = x => Math.max(x, halfSize);
  const topLeft = top < halfSize && left < halfSize
    ? clear(tree.topLeft, {
      top,
      left,
      right: min(right),
      bottom: min(bottom)
    }) : tree.topLeft;
  const topRight = top < halfSize && right > halfSize
    ? clear(tree.topRight, {
      top,
      left: max(left) - halfSize,
      right: right - halfSize,
      bottom: min(bottom)
    }) : tree.topRight;
  const bottomLeft = bottom > halfSize && left < halfSize
    ? clear(tree.bottomLeft, {
      top: max(top) - halfSize,
      left,
      right: min(right),
      bottom: bottom - halfSize
    }) : tree.bottomLeft;
  const bottomRight = bottom > halfSize && right > halfSize
    ? clear(tree.bottomRight, {
      top: max(top) - halfSize,
      left: max(left) - halfSize,
      right: right - halfSize,
      bottom: bottom - halfSize
    }) : tree.bottomRight;
  const center = intersect(tree.center, {top, left, right, bottom})
    ? null
    : tree.center;
  const tops = top < halfSize
    ? tree.top.filter(box => !intersect(box, {top, left, right, bottom}))
    : tree.top;
  const lefts = left < halfSize
    ? tree.left.filter(box => !intersect(box, {top, left, right, bottom}))
    : tree.left;
  const rights = right > halfSize
    ? tree.right.filter(box => !intersect(box, {top, left, right, bottom}))
    : tree.right;
  const bottoms = bottom > halfSize
    ? tree.bottom.filter(box => !intersect(box, {top, left, right, bottom}))
    : tree.bottom;

  if(tops.length === tree.top.length
  && lefts.length === tree.left.length
  && rights.length === tree.right.length
  && bottoms.length === tree.bottom.length
  && center === tree.center
  && topLeft === tree.topLeft
  && topRight === tree.topRight
  && bottomLeft === tree.bottomLeft
  && bottomRight === tree.bottomRight){
    return tree;
  }

  if((tops.length
  || lefts.length
  || rights.length
  || bottom.lengths
  || center
  || topLeft
  || topRight
  || bottomLeft
  || bottomRight) === null){
    return null;
  }

  return {
    size: tree.size,
    data: null,
    top: tops,
    left: lefts,
    right: rights,
    bottom: bottoms,
    center,
    topLeft,
    topRight,
    bottomLeft,
    bottomRight
  };
}