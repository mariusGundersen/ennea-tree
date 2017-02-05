import intersect from './intersect';
import { Node, BoxedData, AreaData, BoxArea, Box } from './types';

export default function *getIterator<T>(
  tree : Node<T>,
  {top, left, width=1, height=1, right=left+width, bottom=top+height} : BoxArea)
  : IterableIterator<AreaData<T>> {

  if(tree == null){
    return;
  }

  if(tree.data != null){
    return yield {
      data: tree.data,
      top: 0,
      left: 0,
      width: 1,
      height: 1
    };
  }

  const halfSize = tree.size/2;
  const min = (x : number) => Math.min(x, halfSize);
  const max = (x : number) => Math.max(x, halfSize);
  if(top < halfSize && left < halfSize && tree.topLeft){
    yield* getIterator(tree.topLeft, {
      top,
      left,
      right: min(right),
      bottom: min(bottom)
    });
  }

  if(top < halfSize && right > halfSize && tree.topRight){
    yield* getIterator(tree.topRight, {
      top,
      left: max(left) - halfSize,
      right: right - halfSize,
      bottom: min(bottom)
    });
  }

  if(bottom > halfSize && left < halfSize && tree.bottomLeft){
    yield* getIterator(tree.bottomLeft, {
      top: max(top) - halfSize,
      left,
      right: min(right),
      bottom: bottom - halfSize
    });
  }

  if(bottom > halfSize && right > halfSize && tree.bottomRight){
    yield* getIterator(tree.bottomRight, {
      top: max(top) - halfSize,
      left: max(left) - halfSize,
      right: right - halfSize,
      bottom: bottom - halfSize
    });
  }

  const area = {top, left, right, bottom} as Box;
  if(tree.center != null){
    yield* getIntersections(area, tree.center);
  }

  if(top < halfSize){
    yield* getIntersections(area, ...tree.top);
  }

  if(left < halfSize){
    yield* getIntersections(area, ...tree.left);
  }

  if(right > halfSize){
    yield* getIntersections(area, ...tree.right);
  }

  if(bottom > halfSize){
    yield* getIntersections(area, ...tree.bottom);
  }
}

function* getIntersections<T>(
  area : Box,
  ...boxes : BoxedData<T>[])
  : IterableIterator<AreaData<T>> {
    for(const box of boxes){
      if(intersect(box, area)){
        yield {
          data: box.data,
          top: area.top - box.top,
          left: area.left - box.left,
          width: box.right - box.left,
          height: box.bottom - box.top
        };
      }
    }
}