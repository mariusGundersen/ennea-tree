import intersect from './intersect.js';

export default function clearUnsafe(tree, {top, left, width=1, height=1, right=left+width, bottom=top+height, x=0, y=0}){
  if(tree == null){
    return [null];
  }

  if(tree.data !== null){
    return [null, {
      left: x,
      top: y,
      data: tree.data,
      width: 1,
      height: 1
    }];
  }

  const halfSize = tree.size/2;
  const min = x => Math.min(x, halfSize);
  const max = x => Math.max(x, halfSize);
  const area = {top, left, right, bottom, x, y};
  const [topLeft, ...clearedTopLeft] = top < halfSize && left < halfSize
    ? clearUnsafe(tree.topLeft, {
      top,
      left,
      right: min(right),
      bottom: min(bottom),
      x,
      y
    }) : [tree.topLeft];
  const [topRight, ...clearedTopRight] = top < halfSize && right > halfSize
    ? clearUnsafe(tree.topRight, {
      top,
      left: max(left) - halfSize,
      right: right - halfSize,
      bottom: min(bottom),
      x: x+halfSize,
      y
    }) : [tree.topRight];
  const [bottomLeft, ...clearedBottomLeft] = bottom > halfSize && left < halfSize
    ? clearUnsafe(tree.bottomLeft, {
      top: max(top) - halfSize,
      left,
      right: min(right),
      bottom: bottom - halfSize,
      x,
      y: y+halfSize
    }) : [tree.bottomLeft];
  const [bottomRight, ...clearedBottomRight] = bottom > halfSize && right > halfSize
    ? clearUnsafe(tree.bottomRight, {
      top: max(top) - halfSize,
      left: max(left) - halfSize,
      right: right - halfSize,
      bottom: bottom - halfSize,
      x: x+halfSize,
      y: y+halfSize
    }) : [tree.bottomRight];
  const [center, ...clearedCenter] = intersect(tree.center, area)
    ? [null, makeCleared(tree.center, x, y)]
    : [tree.center];
  const [tops, ...clearedTops] = top < halfSize
    ? split(tree.top, area)
    : [tree.top];
  const [lefts, ...clearedLefts] = left < halfSize
    ? split(tree.left, area)
    : [tree.left];
  const [rights, ...clearedRights] = right > halfSize
    ? split(tree.right, area)
    : [tree.right];
  const [bottoms, ...clearedBottoms] = bottom > halfSize
    ? split(tree.bottom, area)
    : [tree.bottom];

  const cleared = [
    ...clearedTopLeft,
    ...clearedTopRight,
    ...clearedBottomLeft,
    ...clearedBottomRight,
    ...clearedCenter,
    ...clearedTops,
    ...clearedLefts,
    ...clearedRights,
    ...clearedBottoms
  ];

  if(cleared.length === 0){
    return [tree];
  }

  if((tops.length
  || lefts.length
  || rights.length
  || bottoms.length
  || center
  || topLeft
  || topRight
  || bottomLeft
  || bottomRight) === null){
    return [null, ...cleared];
  }

  return [{
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
  }, ...cleared];
}

function split(list, area){
  const result = [[]];
  for(const box of list){
    if(intersect(box, area)){
      result.push(makeCleared(box, area.x, area.y));
    }else{
      result[0].push(box);
    }
  }

  return result;
}

function makeCleared(box, x, y){
  return {
    data: box.data,
    top: box.top + y,
    left: box.left + x,
    width: box.right - box.left,
    height: box.bottom - box.top
  };
}