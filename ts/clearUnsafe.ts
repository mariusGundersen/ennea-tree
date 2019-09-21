import intersect from './intersect';
import { Node, Box, BoxedData, AreaData, BoxArea } from './types';

const defaultConditionTrue = () => true;

export default function clearUnsafe<T>(
  tree: Node<T>,
  { top, left, width = 1, height = 1, right = left + width, bottom = top + height }: BoxArea,
  x = 0,
  y = 0,
  condition: (data: T) => boolean = defaultConditionTrue)
  : UnsafeTreeAndCleared<T> {

  if (tree.data != undefined) {
    if (condition(tree.data)) {
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
    } else {
      return {
        tree,
        cleared: []
      };
    }
  }

  const halfSize = tree.size / 2;
  const min = (x: number) => Math.min(x, halfSize);
  const max = (x: number) => Math.max(x, halfSize);
  const area = { top, left, right, bottom, x, y };

  const { tree: topLeft, cleared: clearedTopLeft } = tree.topLeft && top < halfSize && left < halfSize
    ? clearUnsafe(
      tree.topLeft,
      {
        top,
        left,
        right: min(right),
        bottom: min(bottom)
      },
      x,
      y,
      condition)
    : nothingCleared(tree.topLeft);

  const { tree: topRight, cleared: clearedTopRight } = tree.topRight && top < halfSize && right > halfSize
    ? clearUnsafe(
      tree.topRight,
      {
        top,
        left: max(left) - halfSize,
        right: right - halfSize,
        bottom: min(bottom)
      },
      x + halfSize,
      y,
      condition)
    : nothingCleared(tree.topRight);

  const { tree: bottomLeft, cleared: clearedBottomLeft } = tree.bottomLeft && bottom > halfSize && left < halfSize
    ? clearUnsafe(
      tree.bottomLeft,
      {
        top: max(top) - halfSize,
        left,
        right: min(right),
        bottom: bottom - halfSize
      },
      x,
      y + halfSize,
      condition)
    : nothingCleared(tree.bottomLeft);

  const { tree: bottomRight, cleared: clearedBottomRight } = tree.bottomRight && bottom > halfSize && right > halfSize
    ? clearUnsafe(
      tree.bottomRight,
      {
        top: max(top) - halfSize,
        left: max(left) - halfSize,
        right: right - halfSize,
        bottom: bottom - halfSize
      },
      x + halfSize,
      y + halfSize,
      condition)
    : nothingCleared(tree.bottomRight);

  const { remaining: { 0: center }, cleared: clearedCenter } = tree.center && intersect(tree.center, area) && condition(tree.center.data)
    ? { remaining: [], cleared: [makeCleared(tree.center, x, y)] }
    : everythingRemaining(tree.center ? [tree.center] : []);

  const { remaining: tops, cleared: clearedTops } = top < halfSize
    ? split(tree.top, area, x, y, condition)
    : everythingRemaining(tree.top);

  const { remaining: lefts, cleared: clearedLefts } = left < halfSize
    ? split(tree.left, area, x, y, condition)
    : everythingRemaining(tree.left);

  const { remaining: rights, cleared: clearedRights } = right > halfSize
    ? split(tree.right, area, x, y, condition)
    : everythingRemaining(tree.right);

  const { remaining: bottoms, cleared: clearedBottoms } = bottom > halfSize
    ? split(tree.bottom, area, x, y, condition)
    : everythingRemaining(tree.bottom);

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

function everythingRemaining<T>(remaining: BoxedData<T>[]): ClearedAndRemaining<T> {
  return { remaining, cleared: [] };
}

function nothingCleared<T>(tree: Node<T> | undefined): UnsafeTreeAndCleared<T> {
  return { tree, cleared: [] };
}

function split<T>(
  list: BoxedData<T>[],
  area: Box,
  x: number,
  y: number,
  condition: (data: T) => boolean)
  : ClearedAndRemaining<T> {
  const cleared = [];
  const remaining = [];
  for (const box of list) {
    if (intersect(box, area) && condition(box.data)) {
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
