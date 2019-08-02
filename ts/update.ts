import intersect from './intersect';
import { Node, Boxish, Box, Pos } from './types';

export type GetData<T, TContext> = (data: T, context: TContext, pos: Pos) => T;

export type Unchanged<T> = (before: T, after: T) => boolean;

export interface BoxContext<TContext> {
  area: Box,
  context: TContext
};

export interface Updater<T, TContext> {
  update: (area: Boxish, context: TContext) => void,
  result: (changes?: BoxContext<TContext>[]) => Node<T>
}

export default function update<T, TContext>(
  tree: Node<T> | undefined,
  getData: GetData<T, TContext>,
  unchanged: Unchanged<T> = () => false)
  : Updater<T, TContext> {
  const generator = updateGenerator(tree, getData, unchanged);
  generator.next();
  function update(
    { top, left, right = left + 1, bottom = top + 1 }: Boxish,
    context?: TContext) {
    generator.next({
      area: {
        top,
        left,
        right,
        bottom
      },
      context
    });
  };

  function result(changes: BoxContext<TContext>[] = []) {
    for (const change of changes) {
      update(change.area, change.context);
    }
    return generator.next().value;
  };

  return {
    update,
    result
  }
}

export function* updateGenerator<T, TContext>(
  tree: Node<T> | undefined,
  getData: GetData<T, TContext>,
  unchanged: Unchanged<T> = () => false)
  : IterableIterator<Node<T>> {

  if (tree == undefined) {
    while (yield tree as any as Node<T>);
    return undefined;
  }

  if (tree.data != undefined) {
    let data = tree.data;
    let change = undefined;
    let changed = false;
    while (change = yield tree) {
      changed = true;
      data = getData(data, change.context, { top: 0, left: 0 });
    }

    if (!changed) {
      return tree;
    }

    if (tree.data === data || unchanged(tree.data, data)) {
      return tree;
    }

    return {
      ...tree,
      data
    };
  } else {
    const halfSize = tree.size / 2;
    let center = tree.center;
    let top = tree.top;
    let left = tree.left;
    let right = tree.right;
    let bottom = tree.bottom;
    let topLeftUpdater = undefined;
    let topRightUpdater = undefined;
    let bottomLeftUpdater = undefined;
    let bottomRightUpdater = undefined;
    let rawChange: BoxContext<TContext> | undefined = undefined;
    let changed = false;
    while (rawChange = yield tree) {
      changed = true;
      const change = rawChange;
      if (center != undefined && intersect(change.area, center)) {
        center = {
          ...center,
          data: getData(center.data, change.context, { top: change.area.top - center.top, left: change.area.left - center.left })
        };
      } else if (change.area.top < halfSize && top.some(t => intersect(change.area, t))) {
        top = top.map(t => intersect(change.area, t)
          ? {
            ...t,
            data: getData(t.data, change.context, { top: change.area.top - t.top, left: change.area.left - t.left })
          } : t);
      } else if (change.area.left < halfSize && left.some(t => intersect(change.area, t))) {
        left = left.map(t => intersect(change.area, t)
          ? {
            ...t,
            data: getData(t.data, change.context, { top: change.area.top - t.top, left: change.area.left - t.left })
          } : t);
      } else if (change.area.left >= halfSize && right.some(t => intersect(change.area, t))) {
        right = right.map(t => intersect(change.area, t)
          ? {
            ...t,
            data: getData(t.data, change.context, { top: change.area.top - t.top, left: change.area.left - t.left })
          } : t);
      } else if (change.area.top >= halfSize && bottom.some(t => intersect(change.area, t))) {
        bottom = bottom.map(t => intersect(change.area, t)
          ? {
            ...t,
            data: getData(t.data, change.context, { top: change.area.top - t.top, left: change.area.left - t.left })
          } : t);
      } else if (change.area.top < halfSize && change.area.left < halfSize) {
        topLeftUpdater = topLeftUpdater || update(tree.topLeft, getData, unchanged);
        topLeftUpdater.update({ top: change.area.top, left: change.area.left }, change.context);
      } else if (change.area.top < halfSize && change.area.left >= halfSize) {
        topRightUpdater = topRightUpdater || update(tree.topRight, getData, unchanged);
        topRightUpdater.update({ top: change.area.top, left: change.area.left - halfSize }, change.context);
      } else if (change.area.top >= halfSize && change.area.left < halfSize) {
        bottomLeftUpdater = bottomLeftUpdater || update(tree.bottomLeft, getData, unchanged);
        bottomLeftUpdater.update({ top: change.area.top - halfSize, left: change.area.left }, change.context);
      } else if (change.area.top >= halfSize && change.area.left >= halfSize) {
        bottomRightUpdater = bottomRightUpdater || update(tree.bottomRight, getData, unchanged);
        bottomRightUpdater.update({ top: change.area.top - halfSize, left: change.area.left - halfSize }, change.context);
      }
    }

    if (!changed) {
      return tree;
    }

    let nodeUnchanged = true;

    if (tree.center === center || tree.center === undefined || center === undefined) {
      //do nothing
    } else if (tree.center.data === center.data || unchanged(tree.center.data, center.data)) {
      center = tree.center;
    } else {
      nodeUnchanged = false;
    }

    if (tree.top === top) {
      //do nothing
    } else if (tree.top.every((e, i) => e.data === top[i].data || unchanged(e.data, top[i].data))) {
      top = tree.top;
    } else {
      nodeUnchanged = false;
    }

    if (tree.left === left) {
      //do nothing
    } else if (tree.left.every((e, i) => e.data === left[i].data || unchanged(e.data, left[i].data))) {
      left = tree.left;
    } else {
      nodeUnchanged = false;
    }

    if (tree.right === right) {
      //do nothing
    } else if (tree.right.every((e, i) => e.data === right[i].data || unchanged(e.data, right[i].data))) {
      right = tree.right;
    } else {
      nodeUnchanged = false;
    }

    if (tree.bottom === bottom) {
      //do nothing
    } else if (tree.bottom.every((e, i) => e.data === bottom[i].data || unchanged(e.data, bottom[i].data))) {
      bottom = tree.bottom;
    } else {
      nodeUnchanged = false;
    }

    let topLeft = tree.topLeft;
    if (topLeftUpdater !== undefined) {
      topLeft = topLeftUpdater.result();
      if (topLeft !== tree.topLeft) {
        nodeUnchanged = false;
      }
    }

    let topRight = tree.topRight;
    if (topRightUpdater !== undefined) {
      topRight = topRightUpdater.result();
      if (topRight !== tree.topRight) {
        nodeUnchanged = false;
      }
    }

    let bottomLeft = tree.bottomLeft;
    if (bottomLeftUpdater !== undefined) {
      bottomLeft = bottomLeftUpdater.result();
      if (bottomLeft !== tree.bottomLeft) {
        nodeUnchanged = false;
      }
    }

    let bottomRight = tree.bottomRight;
    if (bottomRightUpdater !== undefined) {
      bottomRight = bottomRightUpdater.result();
      if (bottomRight !== tree.bottomRight) {
        nodeUnchanged = false;
      }
    }

    if (nodeUnchanged) {
      return tree;
    }

    return {
      size: tree.size,
      data: undefined,
      center,
      top,
      left,
      right,
      bottom,
      topLeft,
      topRight,
      bottomLeft,
      bottomRight
    }
  }
}
