import intersect from './intersect';
import { Node, Box, BoxedData, AreaData, BoxArea } from './types';

export default function clearUnsafe<T>(
  tree: Node<T>,
  { top, left, width = 1, height = 1, right = left + width, bottom = top + height }: BoxArea,
  x = 0,
  y = 0)
  : UnsafeTreeAndCleared<T> {

  if (tree.data != undefined) {
    return {
      tree: undefined,
      cleared: [{
        left: x,
        top: y,
        data: tree.data,
        width: 1,
        height: 1
      }]
    };
  }

  const halfSize = tree.size / 2;
  const min = (x: number) => Math.min(x, halfSize);
  const max = (x: number) => Math.max(x, halfSize);
  const area = { top, left, right, bottom, x, y };
  const { tree: topLeft, cleared: clearedTopLeft } = top < halfSize && left < halfSize && tree.topLeft
    ? clearUnsafe(tree.topLeft, {
      top,
      left,
      right: min(right),
      bottom: min(bottom)
    },
      x,
      y) : { tree: tree.topLeft, cleared: [] };
  const { tree: topRight, cleared: clearedTopRight } = top < halfSize && right > halfSize && tree.topRight
    ? clearUnsafe(tree.topRight, {
      top,
      left: max(left) - halfSize,
      right: right - halfSize,
      bottom: min(bottom)
    },
      x + halfSize,
      y) : { tree: tree.topRight, cleared: [] };
  const { tree: bottomLeft, cleared: clearedBottomLeft } = bottom > halfSize && left < halfSize && tree.bottomLeft
    ? clearUnsafe(tree.bottomLeft, {
      top: max(top) - halfSize,
      left,
      right: min(right),
      bottom: bottom - halfSize
    },
      x,
      y + halfSize) : { tree: tree.bottomLeft, cleared: [] };
  const { tree: bottomRight, cleared: clearedBottomRight } = bottom > halfSize && right > halfSize && tree.bottomRight
    ? clearUnsafe(tree.bottomRight, {
      top: max(top) - halfSize,
      left: max(left) - halfSize,
      right: right - halfSize,
      bottom: bottom - halfSize
    },
      x + halfSize,
      y + halfSize) : { tree: tree.bottomRight, cleared: [] };
  const { remaining: center, cleared: clearedCenter } = tree.center && intersect(tree.center, area)
    ? { remaining: undefined, cleared: makeCleared(tree.center, x, y) }
    : { remaining: tree.center, cleared: undefined };
  const { remaining: tops, cleared: clearedTops } = top < halfSize
    ? split(tree.top, area, x, y)
    : { remaining: tree.top, cleared: [] };
  const { remaining: lefts, cleared: clearedLefts } = left < halfSize
    ? split(tree.left, area, x, y)
    : { remaining: tree.left, cleared: [] };
  const { remaining: rights, cleared: clearedRights } = right > halfSize
    ? split(tree.right, area, x, y)
    : { remaining: tree.right, cleared: [] };
  const { remaining: bottoms, cleared: clearedBottoms } = bottom > halfSize
    ? split(tree.bottom, area, x, y)
    : { remaining: tree.bottom, cleared: [] };

  const cleared = [
    ...clearedTopLeft,
    ...clearedTopRight,
    ...clearedBottomLeft,
    ...clearedBottomRight,
    ...(clearedCenter ? [clearedCenter] : []),
    ...clearedTops,
    ...clearedLefts,
    ...clearedRights,
    ...clearedBottoms
  ];

  if (cleared.length === 0) {
    return {
      tree,
      cleared: []
    };
  }

  if ((tops.length
    || lefts.length
    || rights.length
    || bottoms.length
    || center
    || topLeft
    || topRight
    || bottomLeft
    || bottomRight) == undefined) {
    return {
      tree: undefined,
      cleared
    };
  }

  return {
    tree: {
      size: tree.size,
      data: undefined,
      top: tops,
      left: lefts,
      right: rights,
      bottom: bottoms,
      center,
      topLeft,
      topRight,
      bottomLeft,
      bottomRight
    },
    cleared
  };
}

export interface TreeAndCleared<T> {
  tree: Node<T>,
  cleared: AreaData<T>[]
}

export interface UnsafeTreeAndCleared<T> {
  tree?: Node<T>,
  cleared: AreaData<T>[]
}

interface ClearedAndRemaining<T> {
  cleared: AreaData<T>[],
  remaining: BoxedData<T>[];
}

function split<T>(
  list: BoxedData<T>[],
  area: Box,
  x: number,
  y: number)
  : ClearedAndRemaining<T> {
  const cleared = [];
  const remaining = [];
  for (const box of list) {
    if (intersect(box, area)) {
      cleared.push(makeCleared<T>(box, x, y));
    } else {
      remaining.push(box);
    }
  }

  return {
    cleared,
    remaining
  };
}

function makeCleared<T>(
  box: BoxedData<T>,
  x: number, y
    : number)
  : AreaData<T> {
  return {
    data: box.data,
    top: box.top + y,
    left: box.left + x,
    width: box.right - box.left,
    height: box.bottom - box.top
  };
}
